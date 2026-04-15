import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { InfoTooltip } from "@/components/InfoTooltip";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_STIMULI } from "@/data/stimuli";
import { MOCK_SURVEYS } from "@/data/surveys";
import { MOCK_SESSIONS } from "@/data/participants";
import {
  ArrowLeft,
  Edit,
  ClipboardList,
  Image,
  Users,
  Eye,
  BarChart3,
  Layers,
  Target,
  Box,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function StudyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const study = MOCK_STUDIES.find((s) => s.id === id);

  if (!study) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto text-center py-16">
          <p className="text-muted-foreground">Study not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/studies")}>Back to Studies</Button>
        </div>
      </AppLayout>
    );
  }

  const stimuli = MOCK_STIMULI.filter((s) => s.studyId === study.id);
  const surveys = MOCK_SURVEYS.filter((s) => s.studyId === study.id);
  const sessions = MOCK_SESSIONS.filter((s) => s.studyId === study.id);

  // Generate variant descriptions from factors
  const variantCount = study.factors.length > 0
    ? study.factors.reduce((acc, f) => acc * f.levels.length, 1)
    : study.conditions.length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <button onClick={() => navigate("/studies")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Studies
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-heading text-foreground">{study.title}</h1>
              <StatusBadge status={study.status} />
            </div>
            <p className="text-sm text-muted-foreground font-mono">{study.code} · v{study.version}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/studies/${study.id}/edit`}><Edit className="h-3.5 w-3.5 mr-1" />Edit Study</Link>
          </Button>
        </div>

        {/* Quick Actions — Primary workflow CTAs */}
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardContent className="py-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-4">Research Workflow</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4" onClick={() => navigate(`/surveys?studyId=${study.id}`)}>
                <ClipboardList className="h-4 w-4 mr-2.5 text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium">Open Survey Builder</p>
                  <p className="text-[11px] text-muted-foreground font-normal">Configure VAS and other survey questions for this study.</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4" onClick={() => navigate(`/participate?studyId=${study.id}&preview=true`)}>
                <Eye className="h-4 w-4 mr-2.5 text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium">Preview as Participant</p>
                  <p className="text-[11px] text-muted-foreground font-normal">See how the survey looks from the participant's perspective.</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4" onClick={() => navigate(`/analytics?studyId=${study.id}`)}>
                <BarChart3 className="h-4 w-4 mr-2.5 text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium">View Results</p>
                  <p className="text-[11px] text-muted-foreground font-normal">Review responses and compare perceptions across variants.</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Study Overview */}
        <div className="space-y-4">
          <SectionHeader title="Study Overview" description="Background, objective, and administrative details." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">Description</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{study.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">Research Objective</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{study.objective}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Owner</p>
                  <p className="font-medium">{study.owner}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Period</p>
                  <p className="font-medium">{study.startDate} → {study.endDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Version</p>
                  <p className="font-medium">v{study.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Updated</p>
                  <p className="font-medium">{study.updatedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Factors */}
        <div className="space-y-4">
          <SectionHeader
            title="Factors"
            tooltip="A factor is a design variable that changes across stimulus versions, such as color, shape, or typography."
            description="Design variables that change across your stimulus variants."
            counter={`${study.factors.length} / 8`}
          />
          {study.factors.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Layers className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No factors defined yet.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Add factors like <span className="font-medium">color</span>, <span className="font-medium">shape</span>, or <span className="font-medium">typography</span> to describe what varies across your stimuli.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-2">
              {study.factors.map((factor) => (
                <Card key={factor.id}>
                  <CardContent className="py-3 flex items-start gap-3">
                    <div className="h-8 w-8 rounded bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{factor.name}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {factor.levels.map((level) => (
                          <span key={level} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 font-mono">{factor.levels.length} levels</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Attributes */}
        <div className="space-y-4">
          <SectionHeader
            title="Attributes"
            tooltip="An attribute is the perception measured from the participant, such as natural, healthy, chemical, or safe. Each attribute will be measured using a VAS question."
            description="Perceptions measured via VAS — one question per attribute."
            counter={`${study.attributes.length} / 8`}
          />
          {study.attributes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Target className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No attributes defined yet.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Add attributes like <span className="font-medium">natural</span>, <span className="font-medium">healthy</span>, or <span className="font-medium">safe</span> — these are the perceptions participants will rate.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-wrap gap-2">
              {study.attributes.map((attr) => (
                <div key={attr} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-sm">
                  <Target className="h-3.5 w-3.5 text-accent" />
                  {attr}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Variants / Conditions */}
        <div className="space-y-4">
          <SectionHeader
            title="Stimulus Variants"
            tooltip="A variant is one specific combination of factor levels, such as green + rounded triangle + font A. Participants evaluate variants, and results compare perceptions across them."
            description="Each variant represents a unique combination of factor levels that participants will evaluate."
            counter={`${variantCount} variants`}
          />
          <div className="grid gap-2">
            {study.conditions.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="h-7 w-7 rounded bg-primary/5 flex items-center justify-center shrink-0">
                  <Box className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Linked Content Summary */}
        <div className="space-y-4">
          <SectionHeader title="Study Resources" description="Stimuli, surveys, and participant sessions linked to this study." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:border-accent/40 transition-colors" onClick={() => navigate("/stimuli")}>
              <CardContent className="py-4 flex items-center gap-3">
                <Image className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-lg font-semibold">{stimuli.length}</p>
                  <p className="text-xs text-muted-foreground">Stimuli</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-accent/40 transition-colors" onClick={() => navigate("/surveys")}>
              <CardContent className="py-4 flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-lg font-semibold">{surveys.length}</p>
                  <p className="text-xs text-muted-foreground">Surveys</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-accent/40 transition-colors" onClick={() => navigate("/sessions")}>
              <CardContent className="py-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-lg font-semibold">{sessions.length}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
