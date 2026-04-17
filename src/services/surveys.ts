import { supabase } from "@/integrations/supabase/client";
import { mapSurveyRow, mapQuestionRow } from "./mappers";
import type { Survey, SurveyQuestion } from "@/data/surveys";
import { isUuid } from "@/lib/ids";

export async function fetchSurveysByStudy(studyId: string): Promise<Survey[]> {
  if (!isUuid(studyId)) return [];
  const { data: rows, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("study_id", studyId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (rows ?? []).map((r) => mapSurveyRow(r));
}

export async function fetchAllSurveys(): Promise<Survey[]> {
  const { data: rows, error } = await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  const surveyIds = (rows ?? []).map((r) => r.id);
  if (surveyIds.length === 0) return [];

  const { data: questions } = await supabase
    .from("questions")
    .select("id, survey_id, type")
    .in("survey_id", surveyIds);

  return (rows ?? []).map((r) => {
    const qs = (questions ?? []).filter((q) => q.survey_id === r.id);
    return mapSurveyRow(
      r,
      qs.map((q) => ({
        id: q.id,
        surveyId: q.survey_id,
        type: q.type,
        prompt: "",
        constructLabel: "",
        required: true,
        order: 0,
        linkedStimulusId: null,
        internalNote: "",
      })),
    );
  });
}

export async function fetchSurveyWithQuestions(surveyId: string): Promise<Survey | null> {
  if (!isUuid(surveyId)) return null;
  const { data: row, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", surveyId)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  const [qRes, optRes] = await Promise.all([
    supabase.from("questions").select("*").eq("survey_id", surveyId).order("display_order"),
    supabase.from("question_options").select("*").order("display_order"),
  ]);

  const allOptions = optRes.data ?? [];
  const questions: SurveyQuestion[] = (qRes.data ?? []).map((q) => {
    const opts = allOptions.filter((o) => o.question_id === q.id);
    return mapQuestionRow(q, opts);
  });

  return mapSurveyRow(row, questions);
}

/**
 * Persist survey + questions + options to Supabase.
 * Strategy: update survey metadata, delete existing questions for this survey
 * (cascade removes options via question_id FK delete handled here explicitly),
 * then insert the current question set fresh. This keeps ordering and linked
 * stimulus state authoritative from the editor.
 */
export async function saveSurvey(survey: Survey): Promise<void> {
  if (!isUuid(survey.id)) {
    throw new Error(
      "This survey is mock-only and cannot be saved. Create the survey in the database first.",
    );
  }

  // 1. Update survey metadata
  const { error: updErr } = await supabase
    .from("surveys")
    .update({
      title: survey.title,
      description: survey.description,
      status: survey.status,
    })
    .eq("id", survey.id);
  if (updErr) throw updErr;

  // 2. Fetch existing question ids for cleanup
  const { data: existingQs, error: exErr } = await supabase
    .from("questions")
    .select("id")
    .eq("survey_id", survey.id);
  if (exErr) throw exErr;
  const existingIds = (existingQs ?? []).map((q) => q.id);

  // 3. Delete existing options + questions
  if (existingIds.length > 0) {
    const { error: optDelErr } = await supabase
      .from("question_options")
      .delete()
      .in("question_id", existingIds);
    if (optDelErr) throw optDelErr;

    const { error: qDelErr } = await supabase
      .from("questions")
      .delete()
      .eq("survey_id", survey.id);
    if (qDelErr) throw qDelErr;
  }

  if (survey.questions.length === 0) return;

  // 4. Insert questions
  const questionsToInsert = survey.questions.map((q, idx) => ({
    survey_id: survey.id,
    type: q.type,
    prompt: q.prompt,
    construct_label: q.constructLabel || null,
    required: q.required,
    display_order: idx + 1,
    linked_stimulus_id: isUuid(q.linkedStimulusId) ? q.linkedStimulusId : null,
    internal_note: q.internalNote || null,
    vas_left_anchor: q.type === "vas" ? q.vasConfig?.leftAnchor ?? null : null,
    vas_right_anchor: q.type === "vas" ? q.vasConfig?.rightAnchor ?? null : null,
  }));

  const { data: insertedQs, error: qInsErr } = await supabase
    .from("questions")
    .insert(questionsToInsert)
    .select("id, display_order");
  if (qInsErr) throw qInsErr;

  // 5. Insert options for choice questions, mapping by display_order
  const orderToNewId = new Map<number, string>();
  (insertedQs ?? []).forEach((q) => orderToNewId.set(q.display_order, q.id));

  const optionsToInsert: Array<{
    question_id: string;
    label: string;
    display_order: number;
  }> = [];
  survey.questions.forEach((q, idx) => {
    if ((q.type === "single_choice" || q.type === "multiple_choice") && q.choices) {
      const newQid = orderToNewId.get(idx + 1);
      if (!newQid) return;
      q.choices.forEach((c, ci) => {
        optionsToInsert.push({
          question_id: newQid,
          label: c.label,
          display_order: ci + 1,
        });
      });
    }
  });

  if (optionsToInsert.length > 0) {
    const { error: optInsErr } = await supabase.from("question_options").insert(optionsToInsert);
    if (optInsErr) throw optInsErr;
  }
}
