/**
 * Analytics aggregation from Supabase participant_sessions and answers.
 *
 * Computations are done client-side over fetched rows. This is fine for the
 * current scale (small studies). Future work: move heavy aggregations to
 * Postgres views or RPC functions when result volume grows.
 */
import { supabase } from "@/integrations/supabase/client";
import { isUuid } from "@/lib/ids";

export interface SessionRow {
  id: string;
  study_id: string;
  survey_id: string;
  condition_id: string;
  status: "in_progress" | "completed" | "abandoned";
  participant_code: string;
  started_at: string;
  completed_at: string | null;
}

export interface AnswerRow {
  id: string;
  session_id: string;
  condition_id: string;
  question_id: string;
  question_type: "vas" | "single_choice" | "multiple_choice" | "open_ended";
  vas_value: number | null;
  text_value: string | null;
  selected_option_ids: string[] | null;
}

export interface QuestionMeta {
  id: string;
  prompt: string;
  type: AnswerRow["question_type"];
  construct_label: string | null;
  survey_id: string;
}

export interface ConditionMeta {
  id: string;
  name: string;
}

export interface StudyAnalytics {
  sessions: SessionRow[];
  answers: AnswerRow[];
  questions: QuestionMeta[];
  conditions: ConditionMeta[];
}

export async function fetchStudyAnalytics(studyId: string): Promise<StudyAnalytics> {
  if (!isUuid(studyId)) {
    return { sessions: [], answers: [], questions: [], conditions: [] };
  }

  const [sessionsRes, conditionsRes, surveysRes] = await Promise.all([
    supabase
      .from("participant_sessions")
      .select("id, study_id, survey_id, condition_id, status, participant_code, started_at, completed_at")
      .eq("study_id", studyId),
    supabase
      .from("study_conditions")
      .select("id, name, display_order")
      .eq("study_id", studyId)
      .order("display_order", { ascending: true }),
    supabase.from("surveys").select("id").eq("study_id", studyId),
  ]);

  if (sessionsRes.error) throw sessionsRes.error;
  if (conditionsRes.error) throw conditionsRes.error;
  if (surveysRes.error) throw surveysRes.error;

  const sessions = (sessionsRes.data ?? []) as SessionRow[];
  const conditions = (conditionsRes.data ?? []).map((c) => ({ id: c.id, name: c.name }));
  const surveyIds = (surveysRes.data ?? []).map((s) => s.id);

  let questions: QuestionMeta[] = [];
  if (surveyIds.length > 0) {
    const { data, error } = await supabase
      .from("questions")
      .select("id, prompt, type, construct_label, survey_id")
      .in("survey_id", surveyIds);
    if (error) throw error;
    questions = (data ?? []) as QuestionMeta[];
  }

  let answers: AnswerRow[] = [];
  const sessionIds = sessions.map((s) => s.id);
  if (sessionIds.length > 0) {
    const { data, error } = await supabase
      .from("answers")
      .select("id, session_id, condition_id, question_id, question_type, vas_value, text_value, selected_option_ids")
      .in("session_id", sessionIds);
    if (error) throw error;
    answers = (data ?? []) as AnswerRow[];
  }

  return { sessions, answers, questions, conditions };
}
