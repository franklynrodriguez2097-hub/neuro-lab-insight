
-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'participant');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- STUDIES
-- ============================================================
CREATE TYPE public.study_status AS ENUM ('draft', 'in_review', 'published', 'closed', 'archived');

CREATE TABLE public.studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  objective TEXT DEFAULT '',
  constructs TEXT[] DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id),
  owner_name TEXT DEFAULT '',
  start_date DATE,
  end_date DATE,
  status study_status NOT NULL DEFAULT 'draft',
  version TEXT NOT NULL DEFAULT '0.1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read studies" ON public.studies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage studies" ON public.studies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_studies_updated_at BEFORE UPDATE ON public.studies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- STUDY CONDITIONS
-- ============================================================
CREATE TABLE public.study_conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read conditions" ON public.study_conditions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage conditions" ON public.study_conditions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- STIMULI
-- ============================================================
CREATE TYPE public.stimulus_type AS ENUM ('image', 'text', 'visual_design', 'typographic_sample', 'color_sample');

CREATE TABLE public.stimuli (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  condition_id UUID NOT NULL REFERENCES public.study_conditions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type stimulus_type NOT NULL,
  description TEXT DEFAULT '',
  internal_notes TEXT DEFAULT '',
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stimuli ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read stimuli" ON public.stimuli FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage stimuli" ON public.stimuli FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_stimuli_updated_at BEFORE UPDATE ON public.stimuli FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- SURVEYS
-- ============================================================
CREATE TYPE public.survey_status AS ENUM ('draft', 'active', 'closed');

CREATE TABLE public.surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status survey_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read surveys" ON public.surveys FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage surveys" ON public.surveys FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON public.surveys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TYPE public.question_type AS ENUM ('vas', 'open_ended', 'single_choice', 'multiple_choice');

CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  type question_type NOT NULL,
  prompt TEXT NOT NULL,
  construct_label TEXT DEFAULT '',
  required BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  linked_stimulus_id UUID REFERENCES public.stimuli(id) ON DELETE SET NULL,
  internal_note TEXT DEFAULT '',
  vas_left_anchor TEXT,
  vas_right_anchor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read questions" ON public.questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage questions" ON public.questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- QUESTION OPTIONS (for single/multiple choice)
-- ============================================================
CREATE TABLE public.question_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read options" ON public.question_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage options" ON public.question_options FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- PARTICIPANT SESSIONS
-- ============================================================
CREATE TYPE public.session_status AS ENUM ('in_progress', 'completed', 'abandoned');

CREATE TABLE public.participant_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  study_id UUID NOT NULL REFERENCES public.studies(id) ON DELETE CASCADE,
  survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  condition_id UUID NOT NULL REFERENCES public.study_conditions(id) ON DELETE CASCADE,
  participant_code TEXT NOT NULL,
  status session_status NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
ALTER TABLE public.participant_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read sessions" ON public.participant_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create sessions" ON public.participant_sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update sessions" ON public.participant_sessions FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- ANSWERS
-- ============================================================
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.participant_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  stimulus_id UUID REFERENCES public.stimuli(id) ON DELETE SET NULL,
  condition_id UUID NOT NULL REFERENCES public.study_conditions(id) ON DELETE CASCADE,
  question_type question_type NOT NULL,
  vas_value INT CHECK (vas_value >= 0 AND vas_value <= 100),
  text_value TEXT,
  selected_option_ids UUID[],
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read answers" ON public.answers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert answers" ON public.answers FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_label TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  performed_by_name TEXT DEFAULT '',
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_study_conditions_study ON public.study_conditions(study_id);
CREATE INDEX idx_stimuli_study ON public.stimuli(study_id);
CREATE INDEX idx_stimuli_condition ON public.stimuli(condition_id);
CREATE INDEX idx_surveys_study ON public.surveys(study_id);
CREATE INDEX idx_questions_survey ON public.questions(survey_id);
CREATE INDEX idx_question_options_question ON public.question_options(question_id);
CREATE INDEX idx_sessions_study ON public.participant_sessions(study_id);
CREATE INDEX idx_sessions_survey ON public.participant_sessions(survey_id);
CREATE INDEX idx_answers_session ON public.answers(session_id);
CREATE INDEX idx_answers_question ON public.answers(question_id);
CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type, entity_id);
