import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Layers, Target } from "lucide-react";
import { toast } from "sonner";
import { STUDY_OWNERS, STUDY_STATUS_OPTIONS, MAX_FACTORS, MIN_ATTRIBUTES, MAX_ATTRIBUTES } from "@/data/studies";
import type { StudyFactor } from "@/data/studies";

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

const newFactor = (): StudyFactor => ({
  id: crypto.randomUUID(),
  name: "",
  levels: ["", ""],
});

export default function CreateStudy() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [owner, setOwner] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [version, setVersion] = useState("0.1");
  const [conditions, setConditions] = useState<ConditionDraft[]>([newCondition(), newCondition()]);
  const [factors, setFactors] = useState<StudyFactor[]>([newFactor()]);
  const [attributes, setAttributes] = useState<string[]>(["", ""]);

  const updateCondition = (id: string, field: keyof ConditionDraft, value: string) => {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeCondition = (id: string) => {
    if (conditions.length <= 1) return;
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const updateFactor = (id: string, name: string) => {
    setFactors((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const updateFactorLevel = (factorId: string, levelIndex: number, value: string) => {
    setFactors((prev) =>
      prev.map((f) => {
        if (f.id !== factorId) return f;
        const levels = [...f.levels];
        levels[levelIndex] = value;
        return { ...f, levels };
      })
    );
  };

  const addFactorLevel = (factorId: string) => {
    setFactors((prev) =>
      prev.map((f) => (f.id === factorId ? { ...f, levels: [...f.levels, ""] } : f))
    );
  };

  const removeFactorLevel = (factorId: string, levelIndex: number) => {
    setFactors((prev) =>
      prev.map((f) => {
        if (f.id !== factorId || f.levels.length <= 2) return f;
        return { ...f, levels: f.levels.filter((_, i) => i !== levelIndex) };
      })
    );
  };

  const removeFactor = (id: string) => {
    if (factors.length <= 1) return;
    setFactors((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Study title is required."); return; }
    if (!code.trim()) { toast.error("Study code is required."); return; }
    if (conditions.some((c) => !c.name.trim())) { toast.error("All conditions must have a name."); return; }
    const validAttrs = attributes.filter((a) => a.trim());
    if (validAttrs.length < MIN_ATTRIBUTES) { toast.error(`Define at least ${MIN_ATTRIBUTES} attributes.`); return; }
    toast.success("Study created successfully (mock).");
    navigate("/studies");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => navigate("/studies")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Studies
        </button>

        <div>
          <h1 className="text-3xl font-heading text-foreground">New Study</h1>
          <p className="text-muted-foreground mt-1">
            Define a comparative perception study with factors, attributes, and experimental conditions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identification */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <SectionHeader title="Identification" description="Basic study metadata and research scope." />
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
            </CardContent>
          </Card>

          {/* Factors */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <SectionHeader
                title="Factors"
                tooltip="A factor is a design variable that changes across stimulus versions, such as color, shape, or typography. Each factor has multiple levels."
                description="Define the design variables that change across your stimulus variants."
                counter={`${factors.length} / ${MAX_FACTORS}`}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={factors.length >= MAX_FACTORS}
                  onClick={() => setFactors((prev) => [...prev, newFactor()])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />Add Factor
                </Button>
              </SectionHeader>

              <div className="space-y-4">
                {factors.map((factor, fi) => (
                  <div key={factor.id} className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Layers className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Factor name (e.g., color, shape, typography)"
                          value={factor.name}
                          onChange={(e) => updateFactor(factor.id, e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFactor(factor.id)}
                        disabled={factors.length <= 1}
                        className="mt-2 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="ml-10 space-y-2">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Levels</p>
                      {factor.levels.map((level, li) => (
                        <div key={li} className="flex gap-2 items-center">
                          <span className="text-[10px] text-muted-foreground/50 w-4 text-center font-mono">{li + 1}</span>
                          <Input
                            placeholder={li === 0 ? "e.g., green" : li === 1 ? "e.g., orange" : "e.g., blue"}
                            value={level}
                            onChange={(e) => updateFactorLevel(factor.id, li, e.target.value)}
                            className="flex-1 h-8 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeFactorLevel(factor.id, li)}
                            disabled={factor.levels.length <= 2}
                            className="text-muted-foreground hover:text-destructive disabled:opacity-20 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <Button type="button" variant="ghost" size="sm" className="text-xs h-7" onClick={() => addFactorLevel(factor.id)}>
                        <Plus className="h-3 w-3 mr-1" />Add Level
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">You can define up to {MAX_FACTORS} factors. Each factor must have at least 2 levels.</p>
            </CardContent>
          </Card>

          {/* Attributes */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <SectionHeader
                title="Attributes"
                tooltip="An attribute is the perception measured from the participant, such as natural, healthy, chemical, or safe. Each attribute will become a VAS question in your survey."
                description="Define the perceptions you want participants to rate using VAS."
                counter={`${attributes.filter((a) => a.trim()).length} / ${MAX_ATTRIBUTES}`}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={attributes.length >= MAX_ATTRIBUTES}
                  onClick={() => setAttributes((prev) => [...prev, ""])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />Add Attribute
                </Button>
              </SectionHeader>

              <div className="space-y-2">
                {attributes.map((attr, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="h-7 w-7 rounded bg-accent/10 flex items-center justify-center shrink-0">
                      <Target className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <Input
                      placeholder={i === 0 ? "e.g., natural" : i === 1 ? "e.g., healthy" : i === 2 ? "e.g., chemical" : "e.g., safe"}
                      value={attr}
                      onChange={(e) => {
                        const updated = [...attributes];
                        updated[i] = e.target.value;
                        setAttributes(updated);
                      }}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (attributes.length <= MIN_ATTRIBUTES) return;
                        setAttributes((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      disabled={attributes.length <= MIN_ATTRIBUTES}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">Define between {MIN_ATTRIBUTES} and {MAX_ATTRIBUTES} attributes. Each attribute maps to one VAS question.</p>
            </CardContent>
          </Card>

          {/* Administration */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <SectionHeader title="Administration" description="Study ownership, timeline, and status." />
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
            <CardContent className="pt-5 space-y-4">
              <SectionHeader
                title="Experimental Conditions"
                tooltip="Conditions define how participants are grouped or assigned. Each condition typically maps to a variant or combination of factor levels."
                description="Define the conditions participants will be assigned to."
              >
                <Button type="button" variant="outline" size="sm" onClick={() => setConditions((prev) => [...prev, newCondition()])}>
                  <Plus className="h-3.5 w-3.5 mr-1" />Add
                </Button>
              </SectionHeader>
              <div className="space-y-3">
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
              </div>
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
