export type QuestionType = "vas" | "open_ended" | "single_choice" | "multiple_choice";

export interface VASConfig {
  leftAnchor: string;
  rightAnchor: string;
  constructLabel: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface SurveyQuestion {
  id: string;
  surveyId: string;
  type: QuestionType;
  prompt: string;
  constructLabel: string;
  required: boolean;
  order: number;
  linkedStimulusId: string | null;
  internalNote: string;
  vasConfig?: VASConfig;
  choices?: ChoiceOption[];
}

export interface Survey {
  id: string;
  studyId: string;
  title: string;
  description: string;
  status: "draft" | "active" | "closed";
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt: string;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  vas: "Visual Analog Scale",
  open_ended: "Open-Ended",
  single_choice: "Single Choice",
  multiple_choice: "Multiple Choice",
};

// Multi-construct warning patterns
export const MULTI_CONSTRUCT_PATTERNS = [
  /\band\b/i,
  /\by\b/i,  // Spanish "and"
  /,\s*\w+/,
];

export function checkMultiConstruct(prompt: string): boolean {
  return MULTI_CONSTRUCT_PATTERNS.some((pattern) => pattern.test(prompt));
}

export const MOCK_SURVEYS: Survey[] = [
  {
    id: "survey-1",
    studyId: "study-1",
    title: "Packaging Quality Perception — Warm",
    description: "Perception survey for warm-palette packaging stimuli.",
    status: "active",
    createdAt: "2026-02-20",
    updatedAt: "2026-03-15",
    questions: [
      {
        id: "q1-1",
        surveyId: "survey-1",
        type: "vas",
        prompt: "How would you rate the perceived quality of this packaging?",
        constructLabel: "Perceived quality",
        required: true,
        order: 1,
        linkedStimulusId: "stim-1",
        internalNote: "Primary measure for quality construct.",
        vasConfig: {
          leftAnchor: "Very low quality",
          rightAnchor: "Very high quality",
          constructLabel: "Perceived quality",
        },
      },
      {
        id: "q1-2",
        surveyId: "survey-1",
        type: "vas",
        prompt: "How fresh does this product appear?",
        constructLabel: "Freshness",
        required: true,
        order: 2,
        linkedStimulusId: "stim-1",
        internalNote: "Freshness construct — single dimension.",
        vasConfig: {
          leftAnchor: "Not fresh at all",
          rightAnchor: "Extremely fresh",
          constructLabel: "Freshness",
        },
      },
      {
        id: "q1-3",
        surveyId: "survey-1",
        type: "single_choice",
        prompt: "Which word best describes this packaging?",
        constructLabel: "Brand association",
        required: true,
        order: 3,
        linkedStimulusId: "stim-1",
        internalNote: "Forced-choice brand association.",
        choices: [
          { id: "opt-1", label: "Premium" },
          { id: "opt-2", label: "Affordable" },
          { id: "opt-3", label: "Natural" },
          { id: "opt-4", label: "Artificial" },
        ],
      },
      {
        id: "q1-4",
        surveyId: "survey-1",
        type: "open_ended",
        prompt: "What is the first thought that comes to mind when you see this packaging?",
        constructLabel: "Free association",
        required: false,
        order: 4,
        linkedStimulusId: "stim-1",
        internalNote: "Qualitative complement to quantitative measures.",
      },
      {
        id: "q1-5",
        surveyId: "survey-1",
        type: "multiple_choice",
        prompt: "Select all attributes you associate with this product:",
        constructLabel: "Attribute selection",
        required: true,
        order: 5,
        linkedStimulusId: "stim-1",
        internalNote: "Multi-select attribute mapping.",
        choices: [
          { id: "mc-1", label: "Healthy" },
          { id: "mc-2", label: "Tasty" },
          { id: "mc-3", label: "Expensive" },
          { id: "mc-4", label: "Eco-friendly" },
          { id: "mc-5", label: "Generic" },
        ],
      },
    ],
  },
  {
    id: "survey-2",
    studyId: "study-1",
    title: "Packaging Quality Perception — Cool",
    description: "Perception survey for cool-palette packaging stimuli.",
    status: "active",
    createdAt: "2026-02-22",
    updatedAt: "2026-03-15",
    questions: [],
  },
  {
    id: "survey-3",
    studyId: "study-2",
    title: "Typeface Legibility Assessment",
    description: "Legibility and professionalism rating for typeface samples.",
    status: "active",
    createdAt: "2026-01-25",
    updatedAt: "2026-02-28",
    questions: [
      {
        id: "q3-1",
        surveyId: "survey-3",
        type: "vas",
        prompt: "How easy is it to read this text?",
        constructLabel: "Legibility",
        required: true,
        order: 1,
        linkedStimulusId: "stim-5",
        internalNote: "Core legibility measure.",
        vasConfig: {
          leftAnchor: "Very difficult to read",
          rightAnchor: "Very easy to read",
          constructLabel: "Legibility",
        },
      },
    ],
  },
];
