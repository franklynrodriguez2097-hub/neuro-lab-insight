import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { MOCK_SURVEYS, QUESTION_TYPE_LABELS, checkMultiConstruct, validateVASQuestion, type SurveyQuestion, type QuestionType, type Survey } from "@/data/surveys";
import { MOCK_STUDIES } from "@/data/studies";
import { Plus, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export default function Surveys() {
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  const selectedSurvey = MOCK_SURVEYS.find((s) => s.id === selectedSurveyId);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Survey Builder</h1>
          <p className="text-muted-foreground mt-1">
            Design perception surveys with VAS, open-ended, and choice questions.
          </p>
        </div>

        {!selectedSurvey ? (
          <SurveyList onSelect={setSelectedSurveyId} />
        ) : (
          <SurveyEditor survey={selectedSurvey} onBack={() => setSelectedSurveyId(null)} />
        )}
      </div>
    </AppLayout>
  );
}

function SurveyList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="grid gap-3">
      {MOCK_SURVEYS.map((survey) => {
        const study = MOCK_STUDIES.find((s) => s.id === survey.studyId);
        return (
          <Card
            key={survey.id}
            className="border border-border hover:border-accent/40 transition-colors cursor-pointer"
            onClick={() => onSelect(survey.id)}
          >
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{survey.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {study?.code} · {survey.questions.length} questions
                </p>
              </div>
              <StatusBadge status={survey.status} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SurveyEditor({ survey, onBack }: { survey: Survey; onBack: () => void }) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>(survey.questions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addQuestion = (type: QuestionType) => {
    const newQ: SurveyQuestion = {
      id: `new-q-${Date.now()}`,
      surveyId: survey.id,
      type,
      prompt: "",
      constructLabel: "",
      required: true,
      order: questions.length + 1,
      linkedStimulusId: null,
      internalNote: "",
      ...(type === "vas" ? { vasConfig: { leftAnchor: "", rightAnchor: "" } } : {}),
      ...(type === "single_choice" || type === "multiple_choice" ? { choices: [{ id: "opt-1", label: "" }] } : {}),
    };
    setQuestions((prev) => [...prev, newQ]);
    setExpandedId(newQ.id);
  };

  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= questions.length) return;
    const updated = [...questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setQuestions(updated.map((q, i) => ({ ...q, order: i + 1 })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
            ← Back to surveys
          </button>
          <h2 className="text-xl font-heading">{survey.title}</h2>
          <p className="text-xs text-muted-foreground">{survey.description}</p>
        </div>
        <Button onClick={() => {
          // Validate VAS questions before saving
          const vasErrors = questions
            .filter((q) => q.type === "vas")
            .flatMap((q) => validateVASQuestion(q));
          if (vasErrors.length > 0) {
            toast.error(vasErrors[0]);
            return;
          }
          toast.success("Survey saved (mock).");
        }} size="sm">
          Save Survey
        </Button>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, index) => {
          const isExpanded = expandedId === q.id;
          const hasMultiConstruct = q.type === "vas" && checkMultiConstruct(q.prompt);
          const vasErrors = q.type === "vas" ? validateVASQuestion(q) : [];

          return (
            <Card key={q.id} className={`border ${hasMultiConstruct ? "border-highlight/50" : "border-border"}`}>
              <CardContent className="p-4">
                {/* Collapsed header */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : q.id)}>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={(e) => { e.stopPropagation(); moveQuestion(index, -1); }} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); moveQuestion(index, 1); }} disabled={index === questions.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-6">Q{q.order}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{q.prompt || "(no prompt)"}</p>
                    <p className="text-xs text-muted-foreground">{QUESTION_TYPE_LABELS[q.type]}{q.constructLabel && ` · ${q.constructLabel}`}</p>
                  </div>
                  {hasMultiConstruct && (
                    <span className="flex items-center gap-1 text-highlight text-xs">
                      <AlertTriangle className="h-3.5 w-3.5" />Multi-construct
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    {hasMultiConstruct && (
                      <div className="flex items-start gap-2 p-3 rounded-md bg-highlight/5 border border-highlight/20">
                        <AlertTriangle className="h-4 w-4 text-highlight shrink-0 mt-0.5" />
                        <div className="text-xs text-highlight">
                          <p className="font-medium">Multi-construct warning</p>
                          <p>This prompt may measure more than one construct. Each VAS should assess a single dimension. Consider splitting into separate questions.</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Prompt</Label>
                      <Textarea value={q.prompt} onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })} rows={2} placeholder="Enter the question prompt…" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Construct Label</Label>
                        <Input value={q.constructLabel} onChange={(e) => updateQuestion(q.id, { constructLabel: e.target.value })} placeholder="e.g., Perceived quality" />
                      </div>
                      <div className="space-y-2">
                        <Label>Internal Note</Label>
                        <Input value={q.internalNote} onChange={(e) => updateQuestion(q.id, { internalNote: e.target.value })} placeholder="Note for researchers" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch checked={q.required} onCheckedChange={(checked) => updateQuestion(q.id, { required: checked })} />
                      <Label className="text-sm">Required</Label>
                    </div>

                    {/* VAS-specific fields */}
                    {q.type === "vas" && q.vasConfig && (
                      <div className="p-3 rounded-lg bg-secondary/50 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">VAS Configuration</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Left Anchor</Label>
                            <Input value={q.vasConfig.leftAnchor} onChange={(e) => updateQuestion(q.id, { vasConfig: { ...q.vasConfig!, leftAnchor: e.target.value } })} placeholder="e.g., Not at all" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Right Anchor</Label>
                            <Input value={q.vasConfig.rightAnchor} onChange={(e) => updateQuestion(q.id, { vasConfig: { ...q.vasConfig!, rightAnchor: e.target.value } })} placeholder="e.g., Extremely" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Choice-specific fields */}
                    {(q.type === "single_choice" || q.type === "multiple_choice") && q.choices && (
                      <div className="p-3 rounded-lg bg-secondary/50 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Options</p>
                        {q.choices.map((choice, ci) => (
                          <div key={choice.id} className="flex gap-2 items-center">
                            <span className="text-xs text-muted-foreground w-5 text-center">{ci + 1}</span>
                            <Input
                              value={choice.label}
                              onChange={(e) => {
                                const newChoices = [...q.choices!];
                                newChoices[ci] = { ...newChoices[ci], label: e.target.value };
                                updateQuestion(q.id, { choices: newChoices });
                              }}
                              placeholder="Option label"
                              className="flex-1"
                            />
                            <button
                              onClick={() => {
                                if (q.choices!.length <= 1) return;
                                updateQuestion(q.id, { choices: q.choices!.filter((_, i) => i !== ci) });
                              }}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateQuestion(q.id, {
                              choices: [...q.choices!, { id: `opt-${Date.now()}`, label: "" }],
                            });
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />Add Option
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add question */}
      <Card className="border-dashed border-2 border-border">
        <CardContent className="py-4 flex flex-wrap gap-2 justify-center">
          <span className="text-xs text-muted-foreground self-center mr-2">Add question:</span>
          {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => (
            <Button key={type} variant="outline" size="sm" onClick={() => addQuestion(type)} className="text-xs">
              <Plus className="h-3 w-3 mr-1" />{QUESTION_TYPE_LABELS[type]}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
