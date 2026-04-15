import { supabase } from "@/integrations/supabase/client";
import { mapSurveyRow, mapQuestionRow } from "./mappers";
import type { Survey, SurveyQuestion } from "@/data/surveys";

export async function fetchSurveysByStudy(studyId: string): Promise<Survey[]> {
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

  // Batch-fetch question counts
  const surveyIds = (rows ?? []).map((r) => r.id);
  const { data: questions } = await supabase
    .from("questions")
    .select("id, survey_id, type")
    .in("survey_id", surveyIds);

  return (rows ?? []).map((r) => {
    const qs = (questions ?? []).filter((q) => q.survey_id === r.id);
    // Light mapping: just enough for the list view
    return mapSurveyRow(r, qs.map((q) => ({
      id: q.id,
      surveyId: q.survey_id,
      type: q.type,
      prompt: "",
      constructLabel: "",
      required: true,
      order: 0,
      linkedStimulusId: null,
      internalNote: "",
    })));
  });
}

export async function fetchSurveyWithQuestions(surveyId: string): Promise<Survey | null> {
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
