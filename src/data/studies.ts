export type StudyStatus = "draft" | "in_review" | "published" | "closed" | "archived";

export interface StudyCondition {
  id: string;
  name: string;
  description: string;
}

export interface StudyFactor {
  id: string;
  name: string;
  levels: string[];
}

export interface Study {
  id: string;
  title: string;
  code: string;
  description: string;
  objective: string;
  constructs: string[];
  factors: StudyFactor[];
  attributes: string[];
  owner: string;
  startDate: string;
  endDate: string;
  status: StudyStatus;
  version: string;
  conditions: StudyCondition[];
  createdAt: string;
  updatedAt: string;
  surveysCount: number;
  participantsCount: number;
}

export const STUDY_STATUS_OPTIONS: StudyStatus[] = [
  "draft",
  "in_review",
  "published",
  "closed",
  "archived",
];

export const STUDY_OWNERS = [
  "Dr. Alejandra Vásquez",
  "Prof. Carlos Mendoza",
  "Dr. Laura Sánchez",
  "Prof. Miguel Torres",
];

export const MAX_FACTORS = 8;
export const MIN_ATTRIBUTES = 2;
export const MAX_ATTRIBUTES = 8;

export const MOCK_STUDIES: Study[] = [
  {
    id: "study-1",
    title: "Packaging Color Perception",
    code: "PCP-2026-01",
    description:
      "Evaluates how color variations in product packaging affect consumer perception of quality, freshness, and premium positioning across different product categories.",
    objective:
      "Determine whether warm vs. cool vs. neutral color palettes significantly shift perceived quality.",
    constructs: ["Perceived quality", "Freshness", "Premium positioning"],
    factors: [
      { id: "f1-1", name: "Color palette", levels: ["Warm", "Cool", "Neutral"] },
      { id: "f1-2", name: "Product category", levels: ["Cereal", "Juice"] },
    ],
    attributes: ["Perceived quality", "Freshness", "Premium positioning"],
    owner: "Dr. Alejandra Vásquez",
    startDate: "2026-02-10",
    endDate: "2026-06-30",
    status: "published",
    version: "1.2",
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
    title: "Typography Legibility Study",
    code: "TLS-2026-02",
    description:
      "Assesses legibility and perceived professionalism of serif versus sans-serif typefaces in academic and commercial contexts.",
    objective:
      "Compare serif vs sans-serif readability and professionalism judgments.",
    constructs: ["Legibility", "Perceived professionalism"],
    factors: [
      { id: "f2-1", name: "Typeface category", levels: ["Serif", "Sans-serif"] },
    ],
    attributes: ["Legibility", "Perceived professionalism"],
    owner: "Prof. Carlos Mendoza",
    startDate: "2026-01-15",
    endDate: "2026-05-15",
    status: "published",
    version: "1.0",
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
    title: "Brand Identity Assessment",
    code: "BIA-2026-03",
    description:
      "Explores how visual brand elements influence trust, familiarity, and purchase intention among university students.",
    objective: "Map trust and familiarity across established, emerging, and unbranded conditions.",
    constructs: ["Trust", "Familiarity", "Purchase intention"],
    factors: [
      { id: "f3-1", name: "Brand status", levels: ["Established", "Emerging", "Unbranded"] },
    ],
    attributes: ["Trust", "Familiarity", "Purchase intention"],
    owner: "Dr. Laura Sánchez",
    startDate: "2026-03-20",
    endDate: "2026-08-20",
    status: "draft",
    version: "0.1",
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
    title: "Sound–Image Congruence",
    code: "SIC-2025-04",
    description:
      "Investigates the effect of auditory stimuli on visual aesthetic judgments for interior design scenes.",
    objective: "Test whether congruent audio enhances aesthetic ratings of interior design stimuli.",
    constructs: ["Aesthetic judgment", "Audio-visual congruence"],
    factors: [
      { id: "f4-1", name: "Audio condition", levels: ["Congruent", "Incongruent", "Silent"] },
    ],
    attributes: ["Aesthetic judgment", "Audio-visual congruence"],
    owner: "Prof. Miguel Torres",
    startDate: "2025-09-05",
    endDate: "2026-01-30",
    status: "closed",
    version: "2.0",
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
  {
    id: "study-5",
    title: "Sustainable Packaging Perception",
    code: "SPP-2026-05",
    description: "Evaluates how eco-friendly packaging design affects willingness to pay and perceived brand responsibility.",
    objective: "Compare perceived brand responsibility across sustainable vs traditional packaging.",
    constructs: ["Willingness to pay", "Brand responsibility"],
    factors: [
      { id: "f5-1", name: "Packaging type", levels: ["Eco-friendly", "Traditional"] },
    ],
    attributes: ["Willingness to pay", "Brand responsibility"],
    owner: "Dr. Alejandra Vásquez",
    startDate: "2026-04-01",
    endDate: "2026-09-01",
    status: "in_review",
    version: "0.3",
    conditions: [
      { id: "c5-1", name: "Eco-friendly packaging", description: "Recycled materials, earth tones" },
      { id: "c5-2", name: "Traditional packaging", description: "Standard commercial packaging" },
    ],
    createdAt: "2026-04-01",
    updatedAt: "2026-04-10",
    surveysCount: 2,
    participantsCount: 0,
  },
];
