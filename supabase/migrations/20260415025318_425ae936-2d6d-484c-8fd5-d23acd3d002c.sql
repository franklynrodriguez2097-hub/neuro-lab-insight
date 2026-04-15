-- Add factors (JSONB array) and attributes (text array) to studies
ALTER TABLE public.studies
  ADD COLUMN IF NOT EXISTS factors jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS attributes text[] NOT NULL DEFAULT '{}'::text[];