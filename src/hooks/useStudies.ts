import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import {
  fetchStudies,
  fetchStudyById,
  fetchStimuliByStudy,
  createStudy,
  updateStudy,
  type StudyInput,
} from "@/services/studies";
import { fetchSurveysByStudy, fetchAllSurveys, fetchSurveyWithQuestions } from "@/services/surveys";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_SURVEYS } from "@/data/surveys";
import { MOCK_STIMULI } from "@/data/stimuli";
import { MOCK_SESSIONS } from "@/data/participants";

/**
 * Tracks per-query-key whether the most recent successful load came from the
 * database or from local mock fixtures. Lets the UI surface a clear "mock
 * data" indicator instead of silently masking DB failures.
 */
export type DataSource = "db" | "mock";
const sourceMap = new Map<string, DataSource>();
const listeners = new Set<() => void>();
function setSource(key: string, source: DataSource) {
  if (sourceMap.get(key) === source) return;
  sourceMap.set(key, source);
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function useDataSource(key: string): DataSource | undefined {
  return useSyncExternalStore(
    subscribe,
    () => sourceMap.get(key),
    () => undefined,
  );
}

export function useStudies() {
  return useQuery({
    queryKey: ["studies"],
    queryFn: async () => {
      const studies = await fetchStudies();
      if (studies.length > 0) {
        setSource("studies", "db");
        return studies;
      }
      setSource("studies", "mock");
      return MOCK_STUDIES;
    },
  });
}

export function useStudy(id: string | undefined) {
  return useQuery({
    queryKey: ["study", id],
    queryFn: async () => {
      if (!id) return null;
      const study = await fetchStudyById(id);
      if (study) {
        setSource(`study:${id}`, "db");
        return study;
      }
      const mock = MOCK_STUDIES.find((s) => s.id === id);
      if (mock) setSource(`study:${id}`, "mock");
      return mock ?? null;
    },
    enabled: !!id,
  });
}

export function useSurveysByStudy(studyId: string | undefined) {
  return useQuery({
    queryKey: ["surveys", "byStudy", studyId],
    queryFn: async () => {
      if (!studyId) return [];
      const surveys = await fetchSurveysByStudy(studyId);
      if (surveys.length > 0) {
        setSource(`surveys:byStudy:${studyId}`, "db");
        return surveys;
      }
      const mocks = MOCK_SURVEYS.filter((s) => s.studyId === studyId);
      setSource(`surveys:byStudy:${studyId}`, mocks.length > 0 ? "mock" : "db");
      return mocks;
    },
    enabled: !!studyId,
  });
}

export function useAllSurveys() {
  return useQuery({
    queryKey: ["surveys", "all"],
    queryFn: async () => {
      const surveys = await fetchAllSurveys();
      if (surveys.length > 0) {
        setSource("surveys:all", "db");
        return surveys;
      }
      setSource("surveys:all", "mock");
      return MOCK_SURVEYS;
    },
  });
}

export function useSurveyWithQuestions(surveyId: string | undefined) {
  return useQuery({
    queryKey: ["survey", surveyId],
    queryFn: async () => {
      if (!surveyId) return null;
      const survey = await fetchSurveyWithQuestions(surveyId);
      if (survey) {
        setSource(`survey:${surveyId}`, "db");
        return survey;
      }
      const mock = MOCK_SURVEYS.find((s) => s.id === surveyId);
      if (mock) setSource(`survey:${surveyId}`, "mock");
      return mock ?? null;
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
