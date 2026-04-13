import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { STUDY_OWNERS, STUDY_STATUS_OPTIONS } from "@/data/studies";

interface ConditionDraft {
  id: string;
  name: string;
  description: string;
}

const newCondition = (): ConditionDraft => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
});

export default function CreateStudy() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [constructs, setConstructs] = useState("");
  const [owner, setOwner] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [version, setVersion] = useState("0.1");
  const [conditions, setConditions] = useState<ConditionDraft[]>([
    newCondition(),
    newCondition(),
  ]);

  const updateCondition = (id: string, field: keyof ConditionDraft, value: string) => {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeCondition = (id: string) => {
    if (conditions.length <= 1) return;
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Study title is required."); return; }
    if (!code.trim()) { toast.error("Study code is required."); return; }
    if (conditions.some((c) => !c.name.trim())) { toast.error("All conditions must have a name."); return; }
    toast.success("Study created successfully (mock).");
    navigate("/studies");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/studies")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Studies
        </button>

        <div>
          <h1 className="text-3xl font-heading text-foreground">New Study</h1>
          <p className="text-muted-foreground mt-1">
            Define a new perception study and its experimental conditions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-body font-semibold">Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Study Title *</Label>
                  <Input id="title" placeholder="e.g., Packaging Color Perception" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Internal Code *</Label>
                  <Input id="code" placeholder="e.g., PCP-2026-01" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the study background and scope…" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective">Research Objective</Label>
                <Textarea id="objective" placeholder="What is the primary research question or hypothesis?" rows={2} value={objective} onChange={(e) => setObjective(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="constructs">Main Construct(s)</Label>
                <Input id="constructs" placeholder="e.g., Perceived quality, Freshness (comma-separated)" value={constructs} onChange={(e) => setConstructs(e.target.value)} />
                <p className="text-[11px] text-muted-foreground">Separate multiple constructs with commas.</p>
              </div>
            </CardContent>
          </Card>

          {/* Administration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-body font-semibold">Administration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Select value={owner} onValueChange={setOwner}>
                    <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                    <SelectContent>
                      {STUDY_OWNERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STUDY_STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-body font-semibold">Experimental Conditions</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Define conditions participants will be assigned to.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setConditions((prev) => [...prev, newCondition()])}>
                <Plus className="h-3.5 w-3.5 mr-1" />Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="flex gap-3 items-start p-3 rounded-lg bg-secondary/50">
                  <span className="text-xs text-muted-foreground font-mono mt-2.5 shrink-0 w-5 text-center">{index + 1}</span>
                  <div className="flex-1 space-y-2">
                    <Input placeholder="Condition name" value={condition.name} onChange={(e) => updateCondition(condition.id, "name", e.target.value)} />
                    <Input placeholder="Brief description (optional)" value={condition.description} onChange={(e) => updateCondition(condition.id, "description", e.target.value)} className="text-sm" />
                  </div>
                  <button type="button" onClick={() => removeCondition(condition.id)} disabled={conditions.length <= 1} className="mt-2.5 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate("/studies")}>Cancel</Button>
            <Button type="submit">Create Study</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
