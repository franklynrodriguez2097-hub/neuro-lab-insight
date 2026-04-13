export interface StudyCondition {
  id: string;
  name: string;
  description: string;
}

export interface Study {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "completed" | "archived";
  conditions: StudyCondition[];
  createdAt: string;
  updatedAt: string;
  surveysCount: number;
  participantsCount: number;
}

export const MOCK_STUDIES: Study[] = [
  {
    id: "study-1",
    name: "Packaging Color Perception",
    description:
      "Evaluates how color variations in product packaging affect consumer perception of quality, freshness, and premium positioning across different product categories.",
    status: "active",
    conditions: [
      { id: "c1-1", name: "Warm palette", description: "Red, orange, and yellow tones" },
      { id: "c1-2", name: "Cool palette", description: "Blue, green, and teal tones" },
      { id: "c1-3", name: "Neutral palette", description: "Grayscale and beige tones" },
    ],
    createdAt: "2026-02-10",
    updatedAt: "2026-04-08",
    surveysCount: 4,
    participantsCount: 42,
  },
  {
    id: "study-2",
    name: "Typography Legibility Study",
    description:
      "Assesses legibility and perceived professionalism of serif versus sans-serif typefaces in academic and commercial contexts.",
    status: "active",
    conditions: [
      { id: "c2-1", name: "Serif typefaces", description: "Times, Garamond, Baskerville" },
      { id: "c2-2", name: "Sans-serif typefaces", description: "Helvetica, Inter, Arial" },
    ],
    createdAt: "2026-01-15",
    updatedAt: "2026-04-05",
    surveysCount: 3,
    participantsCount: 38,
  },
  {
    id: "study-3",
    name: "Brand Identity Assessment",
    description:
      "Explores how visual brand elements influence trust, familiarity, and purchase intention among university students.",
    status: "draft",
    conditions: [
      { id: "c3-1", name: "Established brands", description: "Well-known national brands" },
      { id: "c3-2", name: "Emerging brands", description: "New or local brands" },
      { id: "c3-3", name: "No brand (control)", description: "Unbranded stimuli" },
    ],
    createdAt: "2026-03-20",
    updatedAt: "2026-04-12",
    surveysCount: 5,
    participantsCount: 0,
  },
  {
    id: "study-4",
    name: "Sound–Image Congruence",
    description:
      "Investigates the effect of auditory stimuli on visual aesthetic judgments for interior design scenes.",
    status: "completed",
    conditions: [
      { id: "c4-1", name: "Congruent audio", description: "Audio matches visual mood" },
      { id: "c4-2", name: "Incongruent audio", description: "Audio contradicts visual mood" },
      { id: "c4-3", name: "No audio (control)", description: "Silent condition" },
    ],
    createdAt: "2025-09-05",
    updatedAt: "2026-01-30",
    surveysCount: 6,
    participantsCount: 64,
  },
];
