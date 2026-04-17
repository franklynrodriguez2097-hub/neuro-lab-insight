import { useQuery } from "@tanstack/react-query";
import { fetchStudies, fetchStudyById, fetchStimuliByStudy } from "@/services/studies";
import { fetchSurveysByStudy, fetchAllSurveys, fetchSurveyWithQuestions } from "@/services/surveys";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_SURVEYS } from "@/data/surveys";
import { MOCK_STIMULI } from "@/data/stimuli";
import { MOCK_SESSIONS } from "@/data/participants";
import type { Study } from "@/data/studies";
import type { Survey } from "@/data/surveys";

/**
 * Result wrapper that flags whether data came from the database or fell back
 * to mock fixtures. Used so the UI can render a transparent "mock" indicator
 * instead of silently masking DB failures.
 */
export type DataSource = "db" | "mock";
export interface Sourced<T> {
  data: T;
  source: DataSource;
}

export function useStudies() {
  return useQuery<Sourced<Study[]>>({
    queryKey: ["studies"],
    queryFn: async () => {
      const studies = await fetchStudies();
      if (studies.length > 0) return { data: studies, source: "db" };
      return { data: MOCK_STUDIES, source: "mock" };
    },
  });
}

export function useStudy(id: string | undefined) {
  return useQuery<Sourced<Study> | null>({
    queryKey: ["study", id],
    queryFn: async () => {
      if (!id) return null;
      const study = await fetchStudyById(id);
      if (study) return { data: study, source: "db" };
      const mock = MOCK_STUDIES.find((s) => s.id === id);
      return mock ? { data: mock, source: "mock" } : null;
    },
    enabled: !!id,
  });
}

export function useSurveysByStudy(studyId: string | undefined) {
  return useQuery<Sourced<Survey[]>>({
    queryKey: ["surveys", "byStudy", studyId],
    queryFn: async () => {
      if (!studyId) return { data: [], source: "db" };
      const surveys = await fetchSurveysByStudy(studyId);
      if (surveys.length > 0) return { data: surveys, source: "db" };
      const mocks = MOCK_SURVEYS.filter((s) => s.studyId === studyId);
      return { data: mocks, source: mocks.length > 0 ? "mock" : "db" };
    },
    enabled: !!studyId,
  });
}

export function useAllSurveys() {
  return useQuery<Sourced<Survey[]>>({
    queryKey: ["surveys", "all"],
    queryFn: async () => {
      const surveys = await fetchAllSurveys();
      if (surveys.length > 0) return { data: surveys, source: "db" };
      return { data: MOCK_SURVEYS, source: "mock" };
    },
  });
}

export function useSurveyWithQuestions(surveyId: string | undefined) {
  return useQuery<Sourced<Survey> | null>({
    queryKey: ["survey", surveyId],
    queryFn: async () => {
      if (!surveyId) return null;
      const survey = await fetchSurveyWithQuestions(surveyId);
      if (survey) return { data: survey, source: "db" };
      const mock = MOCK_SURVEYS.find((s) => s.id === surveyId);
      return mock ? { data: mock, source: "mock" } : null;
    },
    enabled: !!surveyId,
    retry: 1,
  });
}

export function useStimuliByStudy(studyId: string | undefined) {
  return useQuery({
    queryKey: ["stimuli", "byStudy", studyId],
    queryFn: async () => {
      if (!studyId) return [];
      const stimuli = await fetchStimuliByStudy(studyId);
      if (stimuli.length > 0) return stimuli;
      return MOCK_STIMULI.filter((s) => s.studyId === studyId);
    },
    enabled: !!studyId,
  });
}

export function useSessionsByStudy(studyId: string | undefined) {
  return useQuery({
    queryKey: ["sessions", "byStudy", studyId],
    queryFn: () => MOCK_SESSIONS.filter((s) => s.studyId === studyId),
    enabled: !!studyId,
  });
}
