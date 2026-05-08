/**
 * Participant session and answer persistence.
 *
 * Participants are anonymous (no auth). RLS allows insert/update on
 * participant_sessions and insert on answers for anon role.
 */
import { supabase } from "@/integrations/supabase/client";
import type { SurveyQuestion } from "@/data/surveys";
import { isUuid } from "@/lib/ids";

export interface CreateSessionInput {
  studyId: string;
  surveyId: string;
  conditionId: string;
  participantCode: string;
}

export async function createSession(input: CreateSessionInput): Promise<string> {
  if (!isUuid(input.studyId) || !isUuid(input.surveyId) || !isUuid(input.conditionId)) {
    throw new Error("Cannot start a real session against mock data.");
  }

  const { data, error } = await supabase
    .from("participant_sessions")
    .insert({
      study_id: input.studyId,
      survey_id: input.surveyId,
      condition_id: input.conditionId,
      participant_code: input.participantCode || "ANON",
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export interface AnswerDraft {
  questionId: string;
  vasValue?: number;
  textValue?: string;
  selectedOptionIds?: string[];
}

export async function submitAnswers(args: {
  sessionId: string;
  conditionId: string;
  questions: SurveyQuestion[];
  answers: Record<string, AnswerDraft>;
}): Promise<void> {
  const rows = args.questions
    .map((q) => {
      const a = args.answers[q.id];
      if (!a) return null;
      if (!isUuid(q.id)) return null;
      return {
        session_id: args.sessionId,
        condition_id: args.conditionId,
        question_id: q.id,
        question_type: q.type,
        stimulus_id: isUuid(q.linkedStimulusId) ? q.linkedStimulusId : null,
        vas_value: q.type === "vas" ? a.vasValue ?? null : null,
        text_value: q.type === "open_ended" ? a.textValue ?? null : null,
        selected_option_ids:
          q.type === "single_choice" || q.type === "multiple_choice"
            ? a.selectedOptionIds ?? []
            : null,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) return;

  const { error } = await supabase.from("answers").insert(rows);
  if (error) throw error;
}

export async function completeSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("participant_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) throw error;
}
