import { supabase } from "@/integrations/supabase/client";
import { mapStudyRow, mapStimulusRow } from "./mappers";
import type { Study, StudyCondition, StudyFactor, StudyStatus } from "@/data/studies";
import type { Stimulus } from "@/data/stimuli";
import { isUuid } from "@/lib/ids";

export async function fetchStudies(): Promise<Study[]> {
  const { data: rows, error } = await supabase
    .from("studies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  const studyIds = rows.map((r) => r.id);

  const [condRes, surveyCountRes, sessionCountRes] = await Promise.all([
    supabase.from("study_conditions").select("*").in("study_id", studyIds),
    supabase.from("surveys").select("id, study_id").in("study_id", studyIds),
    supabase.from("participant_sessions").select("id, study_id").in("study_id", studyIds),
  ]);

  const conditions = condRes.data ?? [];
  const surveys = surveyCountRes.data ?? [];
  const sessions = sessionCountRes.data ?? [];

  return rows.map((row) => {
    const studyConds = conditions.filter((c) => c.study_id === row.id);
    const surveyCount = surveys.filter((s) => s.study_id === row.id).length;
    const sessionCount = sessions.filter((s) => s.study_id === row.id).length;
    return mapStudyRow(row, studyConds, surveyCount, sessionCount);
  });
}

export async function fetchStudyById(id: string): Promise<Study | null> {
  if (!isUuid(id)) return null;
  const { data: row, error } = await supabase
    .from("studies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  const [condRes, surveyCountRes, sessionCountRes] = await Promise.all([
    supabase.from("study_conditions").select("*").eq("study_id", id),
    supabase.from("surveys").select("id").eq("study_id", id),
    supabase.from("participant_sessions").select("id").eq("study_id", id),
  ]);

  return mapStudyRow(
    row,
    condRes.data ?? [],
    surveyCountRes.data?.length ?? 0,
    sessionCountRes.data?.length ?? 0,
  );
}

export async function fetchStimuliByStudy(studyId: string): Promise<Stimulus[]> {
  if (!isUuid(studyId)) return [];
  const [stimRes, condRes] = await Promise.all([
    supabase.from("stimuli").select("*").eq("study_id", studyId),
    supabase.from("study_conditions").select("id, name").eq("study_id", studyId),
  ]);

  if (stimRes.error) throw stimRes.error;
  const condMap = new Map((condRes.data ?? []).map((c) => [c.id, c.name]));

  return (stimRes.data ?? []).map((row) =>
    mapStimulusRow(row, condMap.get(row.condition_id)),
  );
}

// ── Writes ──

export interface StudyInput {
  title: string;
  code: string;
  description: string;
  objective: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  status: StudyStatus;
  version: string;
  factors: StudyFactor[];
  attributes: string[];
  conditions: Pick<StudyCondition, "id" | "name" | "description">[];
}

export class StudyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudyValidationError";
  }
}

function validate(input: StudyInput) {
  if (!input.title.trim()) throw new StudyValidationError("Study title is required.");
  if (!input.code.trim()) throw new StudyValidationError("Study code is required.");

  if (input.factors.length < 1 || input.factors.length > 8) {
    throw new StudyValidationError("Define between 1 and 8 factors.");
  }
  for (const f of input.factors) {
    if (!f.name.trim()) throw new StudyValidationError("Every factor must have a name.");
    const levels = f.levels.map((l) => l.trim()).filter(Boolean);
    if (levels.length < 2) {
      throw new StudyValidationError(`Factor "${f.name}" must have at least 2 non-empty levels.`);
    }
  }

  const attrs = input.attributes.map((a) => a.trim()).filter(Boolean);
  if (attrs.length < 2 || attrs.length > 8) {
    throw new StudyValidationError("Define between 2 and 8 attributes.");
  }

  if (input.conditions.length < 1) {
    throw new StudyValidationError("At least one experimental condition is required.");
  }
  if (input.conditions.some((c) => !c.name.trim())) {
    throw new StudyValidationError("All conditions must have a name.");
  }
}

function studyPayload(input: StudyInput) {
  const cleanFactors = input.factors.map((f) => ({
    id: f.id,
    name: f.name.trim(),
    levels: f.levels.map((l) => l.trim()).filter(Boolean),
  }));
  const cleanAttrs = input.attributes.map((a) => a.trim()).filter(Boolean);

  return {
    title: input.title.trim(),
    code: input.code.trim(),
    description: input.description.trim(),
    objective: input.objective.trim(),
    owner_name: input.ownerName.trim(),
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    status: input.status,
    version: input.version.trim() || "0.1",
    // factors is jsonb in DB; cast to satisfy generated type
    factors: cleanFactors as unknown as never,
    attributes: cleanAttrs,
    constructs: cleanAttrs, // mirror attributes as constructs for now
  };
}

export async function createStudy(input: StudyInput): Promise<string> {
  validate(input);

  const { data: study, error } = await supabase
    .from("studies")
    .insert(studyPayload(input))
    .select("id")
    .single();

  if (error) throw error;

  await replaceConditions(study.id, input.conditions);
  return study.id;
}

export async function updateStudy(id: string, input: StudyInput): Promise<void> {
  validate(input);
  if (!isUuid(id)) {
    throw new StudyValidationError("Cannot update a mock study. Save it as a new study first.");
  }

  const { error } = await supabase
    .from("studies")
    .update(studyPayload(input))
    .eq("id", id);

  if (error) throw error;

  await replaceConditions(id, input.conditions);
}

async function replaceConditions(
  studyId: string,
  conditions: Pick<StudyCondition, "id" | "name" | "description">[],
) {
  // Simple strategy: delete existing and re-insert. Safe because stimuli/answers
  // reference conditions by id; this will fail if dependents exist, surfacing
  // the right error to the user.
  const { error: delErr } = await supabase
    .from("study_conditions")
    .delete()
    .eq("study_id", studyId);
  if (delErr) throw delErr;

  if (conditions.length === 0) return;

  const rows = conditions.map((c, i) => ({
    study_id: studyId,
    name: c.name.trim(),
    description: c.description.trim(),
    display_order: i,
  }));

  const { error: insErr } = await supabase.from("study_conditions").insert(rows);
  if (insErr) throw insErr;
}
