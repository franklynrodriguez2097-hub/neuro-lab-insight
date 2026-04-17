/**
 * UUID utilities. Mock data uses non-UUID ids like "study-1" which would
 * otherwise be sent to Supabase and produce 22P02 errors. We use this guard
 * to skip DB calls cleanly when the id can't possibly be in the database.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(id: string | null | undefined): id is string {
  return !!id && UUID_RE.test(id);
}
