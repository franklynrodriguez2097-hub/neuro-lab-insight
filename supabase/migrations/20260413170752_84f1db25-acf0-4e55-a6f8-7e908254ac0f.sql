
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can create sessions" ON public.participant_sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.participant_sessions;
DROP POLICY IF EXISTS "Anyone can insert answers" ON public.answers;
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

-- Participant sessions: admins and supervisors manage sessions
CREATE POLICY "Admins can create sessions" ON public.participant_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'supervisor')
  );

CREATE POLICY "Admins can update sessions" ON public.participant_sessions
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'supervisor')
  );

-- Answers: admins and supervisors can insert
CREATE POLICY "Admins can insert answers" ON public.answers
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'supervisor')
  );

-- Audit logs: admins only insert
CREATE POLICY "Admins can insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'supervisor')
  );
