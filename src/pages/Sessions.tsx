import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SESSIONS } from "@/data/participants";
import { MOCK_STUDIES } from "@/data/studies";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users } from "lucide-react";

export default function Sessions() {
  const [search, setSearch] = useState("");
  const [studyFilter, setStudyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = MOCK_SESSIONS.filter((s) => {
    const matchSearch = s.participantCode.toLowerCase().includes(search.toLowerCase());
    const matchStudy = studyFilter === "all" || s.studyId === studyFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStudy && matchStatus;
  });

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
            <Input placeholder="Search by participant code…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={studyFilter} onValueChange={setStudyFilter}>
            <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Study" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All studies</SelectItem>
              {MOCK_STUDIES.map((s) => <SelectItem key={s.id} value={s.id}>{s.code}</SelectItem>)}
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

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No sessions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Study</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condition</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Responses</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Started</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((session) => {
                  const study = MOCK_STUDIES.find((s) => s.id === session.studyId);
                  return (
                    <tr key={session.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs">{session.participantCode}</td>
                      <td className="py-3 px-3 text-xs">{study?.code}</td>
                      <td className="py-3 px-3 text-xs">{session.conditionLabel}</td>
                      <td className="py-3 px-3"><StatusBadge status={session.status} /></td>
                      <td className="py-3 px-3 text-xs">{session.responses.length}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground">
                        {new Date(session.startedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
