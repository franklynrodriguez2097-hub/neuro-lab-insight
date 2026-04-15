import { useQuery } from "@tanstack/react-query";
import { fetchStudies, fetchStudyById, fetchStimuliByStudy } from "@/services/studies";
import { fetchSurveysByStudy, fetchAllSurveys, fetchSurveyWithQuestions } from "@/services/surveys";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_SURVEYS } from "@/data/surveys";
import { MOCK_STIMULI } from "@/data/stimuli";
import { MOCK_SESSIONS } from "@/data/participants";

/**
 * Loads studies from Supabase, falling back to mock data when DB is empty.
 */
export function useStudies() {
  return useQuery({
    queryKey: ["studies"],
    queryFn: async () => {
      const studies = await fetchStudies();
      return studies.length > 0 ? studies : MOCK_STUDIES;
    },
  });
}

export function useStudy(id: string | undefined) {
  return useQuery({
    queryKey: ["study", id],
    queryFn: async () => {
      if (!id) return null;
      const study = await fetchStudyById(id);
      if (study) return study;
      // Fallback to mock
      return MOCK_STUDIES.find((s) => s.id === id) ?? null;
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
      if (surveys.length > 0) return surveys;
      return MOCK_SURVEYS.filter((s) => s.studyId === studyId);
    },
    enabled: !!studyId,
  });
}

export function useAllSurveys() {
  return useQuery({
    queryKey: ["surveys", "all"],
    queryFn: async () => {
      const surveys = await fetchAllSurveys();
      return surveys.length > 0 ? surveys : MOCK_SURVEYS;
    },
  });
}

export function useSurveyWithQuestions(surveyId: string | undefined) {
  return useQuery({
    queryKey: ["survey", surveyId],
    queryFn: async () => {
      if (!surveyId) return null;
      const survey = await fetchSurveyWithQuestions(surveyId);
      if (survey) return survey;
      return MOCK_SURVEYS.find((s) => s.id === surveyId) ?? null;
    },
    enabled: !!surveyId,
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
  // Sessions remain fully mocked for now
  return useQuery({
    queryKey: ["sessions", "byStudy", studyId],
    queryFn: () => MOCK_SESSIONS.filter((s) => s.studyId === studyId),
    enabled: !!studyId,
  });
}
