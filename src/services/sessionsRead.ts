/**
 * Read-side queries for participant sessions used by the operational
 * Sessions monitoring page. Kept separate from sessions.ts (write path)
 * so participant flow code stays focused on session lifecycle.
 */
import { supabase } from "@/integrations/supabase/client";

export interface SessionRow {
  id: string;
  studyId: string;
  studyCode: string;
  studyTitle: string;
  surveyId: string;
  surveyTitle: string;
  conditionId: string;
  conditionLabel: string;
  participantCode: string;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  completedAt: string | null;
  responseCount: number;
}

export async function fetchSessions(studyId?: string): Promise<SessionRow[]> {
  let q = supabase
    .from("participant_sessions")
    .select("id, study_id, survey_id, condition_id, participant_code, status, started_at, completed_at")
    .order("started_at", { ascending: false });

  if (studyId) q = q.eq("study_id", studyId);

  const { data: sessions, error } = await q;
  if (error) throw error;
  if (!sessions || sessions.length === 0) return [];

  const sessionIds = sessions.map((s) => s.id);
  const studyIds = Array.from(new Set(sessions.map((s) => s.study_id)));
  const surveyIds = Array.from(new Set(sessions.map((s) => s.survey_id)));
  const conditionIds = Array.from(new Set(sessions.map((s) => s.condition_id)));

  const [studiesRes, surveysRes, conditionsRes, answersRes] = await Promise.all([
    supabase.from("studies").select("id, code, title").in("id", studyIds),
    supabase.from("surveys").select("id, title").in("id", surveyIds),
    supabase.from("study_conditions").select("id, name").in("id", conditionIds),
    supabase.from("answers").select("session_id").in("session_id", sessionIds),
  ]);

  if (studiesRes.error) throw studiesRes.error;
  if (surveysRes.error) throw surveysRes.error;
  if (conditionsRes.error) throw conditionsRes.error;
  if (answersRes.error) throw answersRes.error;

  const studyMap = new Map(studiesRes.data?.map((s) => [s.id, s]) ?? []);
  const surveyMap = new Map(surveysRes.data?.map((s) => [s.id, s]) ?? []);
  const conditionMap = new Map(conditionsRes.data?.map((c) => [c.id, c]) ?? []);
  const answerCounts = new Map<string, number>();
  for (const a of answersRes.data ?? []) {
    answerCounts.set(a.session_id, (answerCounts.get(a.session_id) ?? 0) + 1);
  }

  return sessions.map((s) => ({
    id: s.id,
    studyId: s.study_id,
    studyCode: studyMap.get(s.study_id)?.code ?? "—",
    studyTitle: studyMap.get(s.study_id)?.title ?? "",
    surveyId: s.survey_id,
    surveyTitle: surveyMap.get(s.survey_id)?.title ?? "—",
    conditionId: s.condition_id,
    conditionLabel: conditionMap.get(s.condition_id)?.name ?? "—",
    participantCode: s.participant_code,
    status: s.status as SessionRow["status"],
    startedAt: s.started_at,
    completedAt: s.completed_at,
    responseCount: answerCounts.get(s.id) ?? 0,
  }));
}
