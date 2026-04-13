import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_AUDIT } from "@/data/audit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileSpreadsheet, FileText, Clock, FlaskConical, ClipboardList, Image, Users } from "lucide-react";
import { toast } from "sonner";

const EXPORT_OPTIONS = [
  { id: "raw", label: "Raw Responses", description: "All participant responses with metadata.", icon: FileSpreadsheet, format: "CSV" },
  { id: "aggregated", label: "Aggregated Results", description: "Summary statistics by question, condition, and study.", icon: FileText, format: "CSV" },
  { id: "open_ended", label: "Open-Ended Responses", description: "All free-text responses for qualitative analysis.", icon: FileText, format: "CSV" },
];

const ENTITY_ICONS: Record<string, React.ElementType> = {
  study: FlaskConical,
  survey: ClipboardList,
  stimulus: Image,
  session: Users,
};

export default function Export() {
  const [studyFilter, setStudyFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  const filteredAudit = MOCK_AUDIT.filter((a) => {
    const matchEntity = entityFilter === "all" || a.entityType === entityFilter;
    return matchEntity;
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Export Section */}
        <div>
          <h1 className="text-3xl font-heading text-foreground">Export</h1>
          <p className="text-muted-foreground mt-1">Download data for academic analysis.</p>
        </div>

        <div className="flex gap-3 items-end">
          <Select value={studyFilter} onValueChange={setStudyFilter}>
            <SelectTrigger className="w-56 h-10"><SelectValue placeholder="Study" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All studies</SelectItem>
              {MOCK_STUDIES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.code} — {s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {EXPORT_OPTIONS.map((opt) => (
            <Card key={opt.id} className="border border-border">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <opt.icon className="h-5 w-5 text-accent" />
                  <h3 className="text-sm font-semibold">{opt.label}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => toast.info(`Export "${opt.label}" is not available yet (mock).`)}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download {opt.format}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Audit Trail */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-heading text-foreground">Activity History</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Research traceability and audit trail.</p>
            </div>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Filter" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="study">Studies</SelectItem>
                <SelectItem value="survey">Surveys</SelectItem>
                <SelectItem value="stimulus">Stimuli</SelectItem>
                <SelectItem value="session">Sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Entity</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">By</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="py-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudit.map((entry) => {
                  const Icon = ENTITY_ICONS[entry.entityType] || Clock;
                  return (
                    <tr key={entry.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs capitalize">{entry.entityType}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs font-mono">{entry.entityLabel}</td>
                      <td className="py-3 px-3 text-xs">{entry.action}</td>
                      <td className="py-3 px-3 text-xs">{entry.performedBy}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-xs">
                        {entry.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
