/**
 * Maps between Supabase row types and frontend domain models.
 * Keeps raw DB structure out of UI components.
 */
import type { Tables } from "@/integrations/supabase/types";
import type { Study, StudyCondition, StudyFactor } from "@/data/studies";
import type { Survey, SurveyQuestion, VASConfig, ChoiceOption } from "@/data/surveys";
import type { Stimulus } from "@/data/stimuli";

// ── Studies ──

export function mapStudyRow(
  row: Tables<"studies">,
  conditions: Tables<"study_conditions">[],
  surveyCount: number,
  sessionCount: number
): Study {
  const factors = Array.isArray(row.factors)
    ? (row.factors as unknown as StudyFactor[])
    : [];

  return {
    id: row.id,
    title: row.title,
    code: row.code,
    description: row.description ?? "",
    objective: row.objective ?? "",
    constructs: row.constructs ?? [],
    factors,
    attributes: (row as any).attributes ?? [],
    owner: row.owner_name ?? "",
    startDate: row.start_date ?? "",
    endDate: row.end_date ?? "",
    status: row.status,
    version: row.version,
    conditions: conditions
      .sort((a, b) => a.display_order - b.display_order)
      .map(mapConditionRow),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    surveysCount: surveyCount,
    participantsCount: sessionCount,
  };
}

export function mapConditionRow(row: Tables<"study_conditions">): StudyCondition {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
  };
}

// ── Surveys ──

export function mapSurveyRow(
  row: Tables<"surveys">,
  questions: SurveyQuestion[] = []
): Survey {
  return {
    id: row.id,
    studyId: row.study_id,
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    questions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Questions ──

export function mapQuestionRow(
  row: Tables<"questions">,
  options: Tables<"question_options">[] = []
): SurveyQuestion {
  const vasConfig: VASConfig | undefined =
    row.type === "vas" && row.vas_left_anchor && row.vas_right_anchor
      ? { leftAnchor: row.vas_left_anchor, rightAnchor: row.vas_right_anchor }
      : undefined;

  const choices: ChoiceOption[] | undefined =
    row.type === "single_choice" || row.type === "multiple_choice"
      ? options
          .sort((a, b) => a.display_order - b.display_order)
          .map((o) => ({ id: o.id, label: o.label }))
      : undefined;

  return {
    id: row.id,
    surveyId: row.survey_id,
    type: row.type,
    prompt: row.prompt,
    constructLabel: row.construct_label ?? "",
    required: row.required,
    order: row.display_order,
    linkedStimulusId: row.linked_stimulus_id,
    internalNote: row.internal_note ?? "",
    vasConfig,
    choices,
  };
}

// ── Stimuli ──

export function mapStimulusRow(
  row: Tables<"stimuli">,
  conditionLabel?: string
): Stimulus {
  return {
    id: row.id,
    studyId: row.study_id,
    title: row.title,
    type: row.type,
    conditionId: row.condition_id,
    conditionLabel: conditionLabel ?? "",
    description: row.description ?? "",
    internalNotes: row.internal_notes ?? "",
    fileUrl: row.file_url,
    createdAt: row.created_at,
  };
}
