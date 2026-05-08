-- Allow anonymous participants to create sessions and submit answers.
-- Reads remain restricted to authenticated users.

DROP POLICY IF EXISTS "Admins can create sessions" ON public.participant_sessions;
DROP POLICY IF EXISTS "Admins can update sessions" ON public.participant_sessions;

CREATE POLICY "Anyone can create participant sessions"
ON public.participant_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update participant sessions"
ON public.participant_sessions
FOR UPDATE
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can insert answers" ON public.answers;

CREATE POLICY "Anyone can insert answers"
ON public.answers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
