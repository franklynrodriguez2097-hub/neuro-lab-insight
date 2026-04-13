import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { MOCK_STUDIES, STUDY_STATUS_OPTIONS, STUDY_OWNERS, type Study } from "@/data/studies";
import {
  FlaskConical,
  Plus,
  Search,
  ClipboardList,
  Users,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Studies() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");

  const filtered = MOCK_STUDIES.filter((study) => {
    const matchesSearch =
      study.title.toLowerCase().includes(search.toLowerCase()) ||
      study.code.toLowerCase().includes(search.toLowerCase()) ||
      study.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || study.status === statusFilter;
    const matchesOwner = ownerFilter === "all" || study.owner === ownerFilter;
    return matchesSearch && matchesStatus && matchesOwner;
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-foreground">Studies</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage perception studies.
            </p>
          </div>
          <Button asChild>
            <Link to="/studies/new">
              <Plus className="h-4 w-4 mr-1" />
              New Study
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search studies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STUDY_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-48 h-10">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All owners</SelectItem>
              {STUDY_OWNERS.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Studies List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FlaskConical className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No studies found.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StudyCard({ study }: { study: Study }) {
  return (
    <Link to={`/studies/${study.id}`}>
      <Card className="border border-border hover:border-accent/40 transition-colors group cursor-pointer">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="h-11 w-11 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="font-semibold text-sm font-body group-hover:text-primary transition-colors">
                  {study.title}
                </h3>
                <StatusBadge status={study.status} />
              </div>
              <p className="text-xs text-muted-foreground/70 font-mono">{study.code}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                {study.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" />{study.surveysCount} surveys
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />{study.participantsCount} participants
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />{study.conditions.length} conditions
                </span>
                <span>v{study.version}</span>
                <span className="text-muted-foreground/50">{study.owner}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
