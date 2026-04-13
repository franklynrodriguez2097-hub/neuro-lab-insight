export interface ParticipantSession {
  id: string;
  studyId: string;
  surveyId: string;
  participantCode: string;
  conditionId: string;
  conditionLabel: string;
  status: "in_progress" | "completed" | "abandoned";
  startedAt: string;
  completedAt: string | null;
  responses: ParticipantResponse[];
}

export interface ParticipantResponse {
  id: string;
  sessionId: string;
  questionId: string;
  questionType: string;
  vasValue?: number;
  textValue?: string;
  selectedOptionIds?: string[];
  answeredAt: string;
}

export const MOCK_SESSIONS: ParticipantSession[] = [
  {
    id: "sess-1",
    studyId: "study-1",
    surveyId: "survey-1",
    participantCode: "P001",
    conditionId: "c1-1",
    conditionLabel: "Warm palette",
    status: "completed",
    startedAt: "2026-03-01T10:00:00Z",
    completedAt: "2026-03-01T10:18:00Z",
    responses: [
      { id: "r1", sessionId: "sess-1", questionId: "q1-1", questionType: "vas", vasValue: 72, answeredAt: "2026-03-01T10:05:00Z" },
      { id: "r2", sessionId: "sess-1", questionId: "q1-2", questionType: "vas", vasValue: 65, answeredAt: "2026-03-01T10:07:00Z" },
      { id: "r3", sessionId: "sess-1", questionId: "q1-3", questionType: "single_choice", selectedOptionIds: ["opt-1"], answeredAt: "2026-03-01T10:09:00Z" },
      { id: "r4", sessionId: "sess-1", questionId: "q1-4", questionType: "open_ended", textValue: "It looks premium and fresh, reminds me of organic products.", answeredAt: "2026-03-01T10:12:00Z" },
      { id: "r5", sessionId: "sess-1", questionId: "q1-5", questionType: "multiple_choice", selectedOptionIds: ["mc-1", "mc-4"], answeredAt: "2026-03-01T10:14:00Z" },
    ],
  },
  {
    id: "sess-2",
    studyId: "study-1",
    surveyId: "survey-1",
    participantCode: "P002",
    conditionId: "c1-1",
    conditionLabel: "Warm palette",
    status: "completed",
    startedAt: "2026-03-01T11:00:00Z",
    completedAt: "2026-03-01T11:20:00Z",
    responses: [
      { id: "r6", sessionId: "sess-2", questionId: "q1-1", questionType: "vas", vasValue: 58, answeredAt: "2026-03-01T11:05:00Z" },
      { id: "r7", sessionId: "sess-2", questionId: "q1-2", questionType: "vas", vasValue: 80, answeredAt: "2026-03-01T11:08:00Z" },
      { id: "r8", sessionId: "sess-2", questionId: "q1-3", questionType: "single_choice", selectedOptionIds: ["opt-3"], answeredAt: "2026-03-01T11:10:00Z" },
      { id: "r9", sessionId: "sess-2", questionId: "q1-4", questionType: "open_ended", textValue: "The colors make me think of summer and sunshine.", answeredAt: "2026-03-01T11:14:00Z" },
      { id: "r10", sessionId: "sess-2", questionId: "q1-5", questionType: "multiple_choice", selectedOptionIds: ["mc-2", "mc-1"], answeredAt: "2026-03-01T11:16:00Z" },
    ],
  },
  {
    id: "sess-3",
    studyId: "study-1",
    surveyId: "survey-1",
    participantCode: "P003",
    conditionId: "c1-2",
    conditionLabel: "Cool palette",
    status: "completed",
    startedAt: "2026-03-02T09:00:00Z",
    completedAt: "2026-03-02T09:15:00Z",
    responses: [
      { id: "r11", sessionId: "sess-3", questionId: "q1-1", questionType: "vas", vasValue: 82, answeredAt: "2026-03-02T09:04:00Z" },
      { id: "r12", sessionId: "sess-3", questionId: "q1-2", questionType: "vas", vasValue: 45, answeredAt: "2026-03-02T09:06:00Z" },
      { id: "r13", sessionId: "sess-3", questionId: "q1-3", questionType: "single_choice", selectedOptionIds: ["opt-1"], answeredAt: "2026-03-02T09:08:00Z" },
      { id: "r14", sessionId: "sess-3", questionId: "q1-4", questionType: "open_ended", textValue: "Clean and professional. Looks like a store brand.", answeredAt: "2026-03-02T09:11:00Z" },
      { id: "r15", sessionId: "sess-3", questionId: "q1-5", questionType: "multiple_choice", selectedOptionIds: ["mc-3", "mc-4"], answeredAt: "2026-03-02T09:13:00Z" },
    ],
  },
  {
    id: "sess-4",
    studyId: "study-1",
    surveyId: "survey-1",
    participantCode: "P004",
    conditionId: "c1-2",
    conditionLabel: "Cool palette",
    status: "completed",
    startedAt: "2026-03-02T14:00:00Z",
    completedAt: "2026-03-02T14:22:00Z",
    responses: [
      { id: "r16", sessionId: "sess-4", questionId: "q1-1", questionType: "vas", vasValue: 76, answeredAt: "2026-03-02T14:05:00Z" },
      { id: "r17", sessionId: "sess-4", questionId: "q1-2", questionType: "vas", vasValue: 38, answeredAt: "2026-03-02T14:08:00Z" },
      { id: "r18", sessionId: "sess-4", questionId: "q1-3", questionType: "single_choice", selectedOptionIds: ["opt-2"], answeredAt: "2026-03-02T14:10:00Z" },
      { id: "r19", sessionId: "sess-4", questionId: "q1-4", questionType: "open_ended", textValue: "Calm colors. Maybe too cold for food.", answeredAt: "2026-03-02T14:15:00Z" },
      { id: "r20", sessionId: "sess-4", questionId: "q1-5", questionType: "multiple_choice", selectedOptionIds: ["mc-5"], answeredAt: "2026-03-02T14:18:00Z" },
    ],
  },
  {
    id: "sess-5",
    studyId: "study-1",
    surveyId: "survey-1",
    participantCode: "P005",
    conditionId: "c1-3",
    conditionLabel: "Neutral palette",
    status: "completed",
    startedAt: "2026-03-03T10:00:00Z",
    completedAt: "2026-03-03T10:17:00Z",
    responses: [
      { id: "r21", sessionId: "sess-5", questionId: "q1-1", questionType: "vas", vasValue: 41, answeredAt: "2026-03-03T10:04:00Z" },
      { id: "r22", sessionId: "sess-5", questionId: "q1-2", questionType: "vas", vasValue: 30, answeredAt: "2026-03-03T10:07:00Z" },
      { id: "r23", sessionId: "sess-5", questionId: "q1-3", questionType: "single_choice", selectedOptionIds: ["opt-4"], answeredAt: "2026-03-03T10:09:00Z" },
      { id: "r24", sessionId: "sess-5", questionId: "q1-4", questionType: "open_ended", textValue: "Looks plain and uninteresting. Like a generic store product.", answeredAt: "2026-03-03T10:13:00Z" },
      { id: "r25", sessionId: "sess-5", questionId: "q1-5", questionType: "multiple_choice", selectedOptionIds: ["mc-5", "mc-3"], answeredAt: "2026-03-03T10:15:00Z" },
    ],
  },
  {
    id: "sess-6",
    studyId: "study-1",
    surveyId: "survey-1",
    participantCode: "P006",
    conditionId: "c1-3",
    conditionLabel: "Neutral palette",
    status: "in_progress",
    startedAt: "2026-03-03T14:00:00Z",
    completedAt: null,
    responses: [
      { id: "r26", sessionId: "sess-6", questionId: "q1-1", questionType: "vas", vasValue: 55, answeredAt: "2026-03-03T14:05:00Z" },
    ],
  },
];
