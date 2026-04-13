export type StimulusType = "image" | "text" | "visual_design" | "typographic_sample" | "color_sample";

export interface Stimulus {
  id: string;
  studyId: string;
  title: string;
  type: StimulusType;
  conditionId: string;
  conditionLabel: string;
  description: string;
  internalNotes: string;
  fileUrl: string | null;
  createdAt: string;
}

export const STIMULUS_TYPE_LABELS: Record<StimulusType, string> = {
  image: "Image",
  text: "Text Stimulus",
  visual_design: "Visual Design",
  typographic_sample: "Typographic Sample",
  color_sample: "Color Sample",
};

export const MOCK_STIMULI: Stimulus[] = [
  {
    id: "stim-1",
    studyId: "study-1",
    title: "Warm cereal box — front",
    type: "image",
    conditionId: "c1-1",
    conditionLabel: "Warm palette",
    description: "Front panel of cereal packaging using warm tones (red, orange, yellow).",
    internalNotes: "Designed by studio partner. High-res print-ready.",
    fileUrl: null,
    createdAt: "2026-02-15",
  },
  {
    id: "stim-2",
    studyId: "study-1",
    title: "Cool cereal box — front",
    type: "image",
    conditionId: "c1-2",
    conditionLabel: "Cool palette",
    description: "Front panel of cereal packaging using cool tones (blue, green, teal).",
    internalNotes: "Same layout as warm variant. Only hue shifted.",
    fileUrl: null,
    createdAt: "2026-02-15",
  },
  {
    id: "stim-3",
    studyId: "study-1",
    title: "Neutral cereal box — front",
    type: "image",
    conditionId: "c1-3",
    conditionLabel: "Neutral palette",
    description: "Front panel of cereal packaging using neutral tones (gray, beige).",
    internalNotes: "Control condition. Identical structure.",
    fileUrl: null,
    createdAt: "2026-02-15",
  },
  {
    id: "stim-4",
    studyId: "study-1",
    title: "Warm juice bottle label",
    type: "visual_design",
    conditionId: "c1-1",
    conditionLabel: "Warm palette",
    description: "Juice bottle label using warm color palette.",
    internalNotes: "Secondary stimulus set.",
    fileUrl: null,
    createdAt: "2026-02-20",
  },
  {
    id: "stim-5",
    studyId: "study-2",
    title: "Garamond academic paragraph",
    type: "typographic_sample",
    conditionId: "c2-1",
    conditionLabel: "Serif typefaces",
    description: "200-word academic paragraph rendered in Garamond 12pt.",
    internalNotes: "Text from published abstract, anonymized.",
    fileUrl: null,
    createdAt: "2026-01-20",
  },
  {
    id: "stim-6",
    studyId: "study-2",
    title: "Inter academic paragraph",
    type: "typographic_sample",
    conditionId: "c2-2",
    conditionLabel: "Sans-serif typefaces",
    description: "Same paragraph rendered in Inter 12pt.",
    internalNotes: "Identical content, only typeface changed.",
    fileUrl: null,
    createdAt: "2026-01-20",
  },
  {
    id: "stim-7",
    studyId: "study-3",
    title: "Nike brand card",
    type: "visual_design",
    conditionId: "c3-1",
    conditionLabel: "Established brands",
    description: "Brand identity card for Nike with logo and tagline.",
    internalNotes: "Fair use for academic study.",
    fileUrl: null,
    createdAt: "2026-03-25",
  },
  {
    id: "stim-8",
    studyId: "study-1",
    title: "Warm palette swatch",
    type: "color_sample",
    conditionId: "c1-1",
    conditionLabel: "Warm palette",
    description: "Five-color swatch of the warm packaging palette.",
    internalNotes: "Pantone references included.",
    fileUrl: null,
    createdAt: "2026-02-18",
  },
  {
    id: "stim-9",
    studyId: "study-3",
    title: "Trust prompt text",
    type: "text",
    conditionId: "c3-1",
    conditionLabel: "Established brands",
    description: "Short textual description of brand positioning statement.",
    internalNotes: "Used before visual stimulus exposure.",
    fileUrl: null,
    createdAt: "2026-03-28",
  },
];
