import { supabase } from "@/integrations/supabase/client";
import { mapStudyRow, mapConditionRow, mapStimulusRow } from "./mappers";
import type { Study } from "@/data/studies";
import type { Stimulus } from "@/data/stimuli";

export async function fetchStudies(): Promise<Study[]> {
  const { data: rows, error } = await supabase
    .from("studies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  const studyIds = rows.map((r) => r.id);

  // Batch-fetch related data
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
    sessionCountRes.data?.length ?? 0
  );
}

export async function fetchStimuliByStudy(studyId: string): Promise<Stimulus[]> {
  const [stimRes, condRes] = await Promise.all([
    supabase.from("stimuli").select("*").eq("study_id", studyId),
    supabase.from("study_conditions").select("id, name").eq("study_id", studyId),
  ]);

  if (stimRes.error) throw stimRes.error;
  const condMap = new Map((condRes.data ?? []).map((c) => [c.id, c.name]));

  return (stimRes.data ?? []).map((row) =>
    mapStimulusRow(row, condMap.get(row.condition_id))
  );
}
