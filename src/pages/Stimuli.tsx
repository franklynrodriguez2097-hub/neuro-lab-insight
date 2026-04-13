import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_STIMULI, STIMULUS_TYPE_LABELS, type Stimulus } from "@/data/stimuli";
import { MOCK_STUDIES } from "@/data/studies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Image, FileText, Palette, Type, Eye } from "lucide-react";

const TYPE_ICONS: Record<string, React.ElementType> = {
  image: Image,
  text: FileText,
  visual_design: Eye,
  typographic_sample: Type,
  color_sample: Palette,
};

export default function Stimuli() {
  const [search, setSearch] = useState("");
  const [studyFilter, setStudyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = MOCK_STIMULI.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchStudy = studyFilter === "all" || s.studyId === studyFilter;
    const matchType = typeFilter === "all" || s.type === typeFilter;
    return matchSearch && matchStudy && matchType;
  });

  // Group by condition
  const grouped = filtered.reduce<Record<string, Stimulus[]>>((acc, s) => {
    const key = `${s.conditionLabel}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Stimuli Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage research stimuli organized by condition.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search stimuli…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={studyFilter} onValueChange={setStudyFilter}>
            <SelectTrigger className="w-52 h-10"><SelectValue placeholder="Study" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All studies</SelectItem>
              {MOCK_STUDIES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.code} — {s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44 h-10"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {Object.entries(STIMULUS_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grouped by condition */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <Image className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No stimuli found.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([condition, items]) => (
            <div key={condition}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <h2 className="text-sm font-semibold font-body uppercase tracking-wider text-muted-foreground">
                  {condition}
                </h2>
                <span className="text-xs text-muted-foreground/50">({items.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {items.map((stimulus) => {
                  const Icon = TYPE_ICONS[stimulus.type] || Image;
                  return (
                    <Card key={stimulus.id} className="border border-border hover:border-accent/30 transition-colors">
                      <CardContent className="p-4 space-y-3">
                        {/* Preview area */}
                        <div className="aspect-video rounded-md bg-secondary/60 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{stimulus.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {STIMULUS_TYPE_LABELS[stimulus.type]}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{stimulus.description}</p>
                        {stimulus.internalNotes && (
                          <p className="text-[11px] text-muted-foreground/60 italic border-t border-border pt-2">
                            Note: {stimulus.internalNotes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
