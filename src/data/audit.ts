export interface AuditEntry {
  id: string;
  entityType: "study" | "survey" | "stimulus" | "session";
  entityId: string;
  entityLabel: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export const MOCK_AUDIT: AuditEntry[] = [
  { id: "a1", entityType: "study", entityId: "study-1", entityLabel: "PCP-2026-01", action: "Status changed", performedBy: "Dr. Alejandra Vásquez", timestamp: "2026-04-08T14:30:00Z", details: "Changed from 'in_review' to 'published'" },
  { id: "a2", entityType: "survey", entityId: "survey-1", entityLabel: "Packaging Quality — Warm", action: "Question added", performedBy: "Dr. Alejandra Vásquez", timestamp: "2026-03-15T09:15:00Z", details: "Added VAS question: 'How fresh does this product appear?'" },
  { id: "a3", entityType: "stimulus", entityId: "stim-4", entityLabel: "Warm juice bottle label", action: "Stimulus uploaded", performedBy: "Prof. Carlos Mendoza", timestamp: "2026-02-20T16:00:00Z", details: "New visual_design stimulus for warm palette condition" },
  { id: "a4", entityType: "study", entityId: "study-3", entityLabel: "BIA-2026-03", action: "Study created", performedBy: "Dr. Laura Sánchez", timestamp: "2026-03-20T10:00:00Z", details: "New study: Brand Identity Assessment" },
  { id: "a5", entityType: "session", entityId: "sess-1", entityLabel: "P001", action: "Session completed", performedBy: "System", timestamp: "2026-03-01T10:18:00Z", details: "Participant P001 completed survey-1 in 18 minutes" },
  { id: "a6", entityType: "study", entityId: "study-5", entityLabel: "SPP-2026-05", action: "Submitted for review", performedBy: "Dr. Alejandra Vásquez", timestamp: "2026-04-10T11:00:00Z", details: "Sustainable Packaging Perception submitted for peer review" },
  { id: "a7", entityType: "study", entityId: "study-4", entityLabel: "SIC-2025-04", action: "Study closed", performedBy: "Prof. Miguel Torres", timestamp: "2026-01-30T17:00:00Z", details: "Data collection complete. 64 participants." },
  { id: "a8", entityType: "survey", entityId: "survey-3", entityLabel: "Typeface Legibility Assessment", action: "Survey activated", performedBy: "Prof. Carlos Mendoza", timestamp: "2026-02-28T08:00:00Z", details: "Survey is now active for participant sessions" },
];
