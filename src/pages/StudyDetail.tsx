import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_STIMULI } from "@/data/stimuli";
import { MOCK_SURVEYS } from "@/data/surveys";
import { MOCK_SESSIONS } from "@/data/participants";
import { ArrowLeft, Edit, ClipboardList, Image, Users } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm font-body">Description</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{study.description}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm font-body">Objective</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{study.objective}</p></CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <Card>
          <CardContent className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Owner</p>
                <p className="font-medium">{study.owner}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Constructs</p>
                <p className="font-medium">{study.constructs.join(", ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Period</p>
                <p className="font-medium">{study.startDate} → {study.endDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Updated</p>
                <p className="font-medium">{study.updatedAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <div>
          <h2 className="text-lg font-heading text-foreground mb-3">Conditions</h2>
          <div className="grid gap-2">
            {study.conditions.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <span className="text-xs font-mono text-muted-foreground w-5 text-center">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Content Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:border-accent/40 transition-colors">
            <CardContent className="py-4 flex items-center gap-3">
              <Image className="h-5 w-5 text-accent" />
              <div>
                <p className="text-lg font-semibold">{stimuli.length}</p>
                <p className="text-xs text-muted-foreground">Stimuli</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-accent/40 transition-colors">
            <CardContent className="py-4 flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-accent" />
              <div>
                <p className="text-lg font-semibold">{surveys.length}</p>
                <p className="text-xs text-muted-foreground">Surveys</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-accent/40 transition-colors">
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
    </AppLayout>
  );
}
