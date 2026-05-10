import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useAllSessions, useStudies } from "@/hooks/useStudies";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, AlertCircle } from "lucide-react";

export default function Sessions() {
  const [searchParams] = useSearchParams();
  const initialStudy = searchParams.get("studyId") ?? "all";

  const [search, setSearch] = useState("");
  const [studyFilter, setStudyFilter] = useState(initialStudy);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: sessions, isLoading, error } = useAllSessions();
  const { data: studies } = useStudies();

  const filtered = useMemo(() => {
    if (!sessions) return [];
    const q = search.trim().toLowerCase();
    return sessions.filter((s) => {
      const matchSearch = !q || s.participantCode.toLowerCase().includes(q);
      const matchStudy = studyFilter === "all" || s.studyId === studyFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStudy && matchStatus;
    });
  }, [sessions, search, studyFilter, statusFilter]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Participant Sessions</h1>
          <p className="text-muted-foreground mt-1">Track and review participant responses.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by participant code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={studyFilter} onValueChange={setStudyFilter}>
            <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Study" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All studies</SelectItem>
              {studies?.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-10"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="abandoned">Abandoned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-destructive/30 rounded-md bg-destructive/5">
            <AlertCircle className="h-10 w-10 mx-auto text-destructive/70 mb-3" />
            <p className="text-destructive font-medium">Failed to load sessions.</p>
            <p className="text-sm text-muted-foreground mt-1">{(error as Error).message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">
              {sessions && sessions.length === 0
                ? "No participant sessions recorded yet."
                : "No sessions match the current filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Study</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Survey</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condition</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Responses</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Started</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((session) => (
                  <tr key={session.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs">{session.participantCode}</td>
                    <td className="py-3 px-3 text-xs">{session.studyCode}</td>
                    <td className="py-3 px-3 text-xs text-muted-foreground">{session.surveyTitle}</td>
                    <td className="py-3 px-3 text-xs">{session.conditionLabel}</td>
                    <td className="py-3 px-3"><StatusBadge status={session.status} /></td>
                    <td className="py-3 px-3 text-xs">{session.responseCount}</td>
                    <td className="py-3 px-3 text-xs text-muted-foreground">
                      {new Date(session.startedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-xs text-muted-foreground">
                      {session.completedAt ? new Date(session.completedAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
