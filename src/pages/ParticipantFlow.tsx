import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VASScale } from "@/components/VASScale";
import { MOCK_SURVEYS } from "@/data/surveys";
import { FlaskConical, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { SurveyQuestion, ChoiceOption } from "@/data/surveys";

type FlowStep =
  | "welcome"
  | "consent"
  | "identify"
  | "instructions"
  | "question"
  | "review"
  | "complete";

interface ResponseDraft {
  questionId: string;
  vasValue?: number;
  textValue?: string;
  selectedOptionIds?: string[];
}

export default function ParticipantFlow() {
  const survey = MOCK_SURVEYS[0]; // demo with first survey
  const [step, setStep] = useState<FlowStep>("welcome");
  const [participantCode, setParticipantCode] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ResponseDraft>>({});

  const questions = survey.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const updateResponse = (questionId: string, updates: Partial<ResponseDraft>) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], questionId, ...updates },
    }));
  };

  const canProceedQuestion = () => {
    if (!currentQuestion) return false;
    const r = responses[currentQuestion.id];
    if (!currentQuestion.required) return true;
    if (!r) return false;
    switch (currentQuestion.type) {
      case "vas": return r.vasValue !== undefined && r.vasValue !== null;
      case "open_ended": return !!r.textValue?.trim();
      case "single_choice": return (r.selectedOptionIds?.length ?? 0) === 1;
      case "multiple_choice": return (r.selectedOptionIds?.length ?? 0) > 0;
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setStep("review");
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    } else {
      setStep("instructions");
    }
  };

  // Participant-facing: clean, distraction-free layout
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {step === "welcome" && (
          <div className="text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <FlaskConical className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-heading text-foreground">Welcome</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                You have been invited to participate in a perception study conducted by Neuro Smart Lab, Universidad de La Sabana.
              </p>
              <p className="text-muted-foreground mt-2 text-sm font-medium">{survey.title}</p>
            </div>
            <Button onClick={() => setStep("consent")} className="w-full max-w-xs">
              Begin <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {step === "consent" && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h2 className="text-xl font-heading text-foreground">Informed Consent</h2>
              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>This study is conducted for academic research purposes by Neuro Smart Lab at Universidad de La Sabana.</p>
                <p>Your participation is voluntary. You may withdraw at any time without consequence. Your responses will be anonymized and used exclusively for research analysis.</p>
                <p>There are no known risks associated with this study. By proceeding, you acknowledge that you have read and understood this information.</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <Checkbox id="consent" checked={consentGiven} onCheckedChange={(c) => setConsentGiven(!!c)} className="mt-0.5" />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I have read and understood the information above, and I agree to participate in this study.
                </Label>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("welcome")} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" />Back
                </Button>
                <Button onClick={() => setStep("identify")} disabled={!consentGiven} className="flex-1">
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "identify" && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h2 className="text-xl font-heading text-foreground">Participant Identification</h2>
              <p className="text-sm text-muted-foreground">
                Enter the participant code provided by the researcher.
              </p>
              <div className="space-y-2">
                <Label htmlFor="pcode">Participant Code</Label>
                <Input id="pcode" placeholder="e.g., P001" value={participantCode} onChange={(e) => setParticipantCode(e.target.value)} className="text-center text-lg font-mono" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("consent")} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" />Back
                </Button>
                <Button onClick={() => setStep("instructions")} disabled={!participantCode.trim()} className="flex-1">
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "instructions" && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h2 className="text-xl font-heading text-foreground">Instructions</h2>
              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>You will be presented with a series of visual stimuli and asked to evaluate them.</p>
                <p>For scale questions, drag or tap the slider to indicate your response. There are no right or wrong answers — we are interested in your personal perception.</p>
                <p>Please respond as honestly and intuitively as possible. Take your time but do not overthink.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("identify")} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" />Back
                </Button>
                <Button onClick={() => { setCurrentQuestionIndex(0); setStep("question"); }} className="flex-1">
                  Start Survey <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "question" && currentQuestion && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Stimulus placeholder */}
                {currentQuestion.linkedStimulusId && (
                  <div className="aspect-video rounded-lg bg-secondary/60 flex items-center justify-center border border-border">
                    <p className="text-xs text-muted-foreground">Stimulus preview area</p>
                  </div>
                )}

                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {currentQuestion.prompt}
                </p>

                {/* Question renderers */}
                {currentQuestion.type === "vas" && currentQuestion.vasConfig && (
                  <VASScale
                    leftAnchor={currentQuestion.vasConfig.leftAnchor}
                    rightAnchor={currentQuestion.vasConfig.rightAnchor}
                    value={responses[currentQuestion.id]?.vasValue ?? null}
                    onChange={(v) => updateResponse(currentQuestion.id, { vasValue: v })}
                  />
                )}

                {currentQuestion.type === "open_ended" && (
                  <Textarea
                    placeholder="Type your response…"
                    rows={4}
                    value={responses[currentQuestion.id]?.textValue || ""}
                    onChange={(e) => updateResponse(currentQuestion.id, { textValue: e.target.value })}
                  />
                )}

                {currentQuestion.type === "single_choice" && currentQuestion.choices && (
                  <RadioGroup
                    value={responses[currentQuestion.id]?.selectedOptionIds?.[0] || ""}
                    onValueChange={(v) => updateResponse(currentQuestion.id, { selectedOptionIds: [v] })}
                    className="space-y-2"
                  >
                    {currentQuestion.choices.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/30 transition-colors">
                        <RadioGroupItem value={c.id} id={c.id} />
                        <Label htmlFor={c.id} className="text-sm cursor-pointer flex-1">{c.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "multiple_choice" && currentQuestion.choices && (
                  <div className="space-y-2">
                    {currentQuestion.choices.map((c) => {
                      const selected = responses[currentQuestion.id]?.selectedOptionIds || [];
                      return (
                        <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/30 transition-colors">
                          <Checkbox
                            id={c.id}
                            checked={selected.includes(c.id)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...selected, c.id]
                                : selected.filter((id) => id !== c.id);
                              updateResponse(currentQuestion.id, { selectedOptionIds: updated });
                            }}
                          />
                          <Label htmlFor={c.id} className="text-sm cursor-pointer flex-1">{c.label}</Label>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.required && (
                  <p className="text-[11px] text-muted-foreground/60">* This question is required</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={prevQuestion} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-1" />Back
                  </Button>
                  <Button onClick={nextQuestion} disabled={!canProceedQuestion()} className="flex-1">
                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Review"}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "review" && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h2 className="text-xl font-heading text-foreground">Review Your Responses</h2>
              <p className="text-sm text-muted-foreground">
                Please review your responses before submitting. You may go back to change any answer.
              </p>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const r = responses[q.id];
                  let displayValue = "—";
                  if (r) {
                    if (q.type === "vas" && r.vasValue !== undefined) displayValue = "Response recorded";
                    else if (q.type === "open_ended" && r.textValue) displayValue = r.textValue.slice(0, 60) + (r.textValue.length > 60 ? "…" : "");
                    else if (r.selectedOptionIds?.length) displayValue = `${r.selectedOptionIds.length} option(s) selected`;
                  }
                  return (
                    <div key={q.id} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-secondary/30">
                      <span className="text-xs font-mono text-muted-foreground w-5 mt-0.5">Q{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-xs">{q.prompt}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{displayValue}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setCurrentQuestionIndex(questions.length - 1); setStep("question"); }} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" />Go Back
                </Button>
                <Button onClick={() => setStep("complete")} className="flex-1">
                  Submit Responses
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <div className="text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-heading text-foreground">Thank You</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Your responses have been recorded successfully. You may now close this window.
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Participant: {participantCode} · Survey: {survey.title}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
