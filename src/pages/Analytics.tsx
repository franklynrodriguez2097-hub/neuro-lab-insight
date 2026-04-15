import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_SURVEYS } from "@/data/surveys";
import { MOCK_SESSIONS } from "@/data/participants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Users, CheckCircle2, Clock, MessageSquare } from "lucide-react";

const CHART_COLORS = ["hsl(219, 100%, 18%)", "hsl(42, 29%, 41%)", "hsl(25, 90%, 55%)", "hsl(220, 10%, 46%)"];

export default function Analytics() {
  const [searchParams] = useSearchParams();
  const initialStudyId = searchParams.get("studyId") || "study-1";
  const [studyId, setStudyId] = useState(initialStudyId);
  const study = MOCK_STUDIES.find((s) => s.id === studyId)!;
  const sessions = MOCK_SESSIONS.filter((s) => s.studyId === studyId);
  const surveys = MOCK_SURVEYS.filter((s) => s.studyId === studyId);

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const completionRate = sessions.length > 0
    ? Math.round((completedSessions.length / sessions.length) * 100)
    : 0;

  // VAS averages by question
  const vasAverages = useMemo(() => {
    const vasQuestions = surveys.flatMap((s) => s.questions).filter((q) => q.type === "vas");
    return vasQuestions.map((q) => {
      const values = completedSessions
        .flatMap((s) => s.responses)
        .filter((r) => r.questionId === q.id && r.vasValue !== undefined)
        .map((r) => r.vasValue!);
      const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
      return {
        name: q.constructLabel || q.prompt.slice(0, 30),
        average: avg,
        n: values.length,
      };
    });
  }, [surveys, completedSessions]);

  // VAS by condition
  const conditionComparison = useMemo(() => {
    return study.conditions.map((cond, ci) => {
      const condSessions = completedSessions.filter((s) => s.conditionId === cond.id);
      const allVasResponses = condSessions.flatMap((s) =>
        s.responses.filter((r) => r.questionType === "vas" && r.vasValue !== undefined)
      );
      const avg = allVasResponses.length > 0
        ? Math.round(allVasResponses.reduce((a, r) => a + r.vasValue!, 0) / allVasResponses.length)
        : 0;
      return {
        name: cond.name,
        average: avg,
        n: condSessions.length,
        color: CHART_COLORS[ci % CHART_COLORS.length],
      };
    });
  }, [study, completedSessions]);

  // Open-ended responses
  const openEndedResponses = useMemo(() => {
    return completedSessions
      .flatMap((s) =>
        s.responses
          .filter((r) => r.questionType === "open_ended" && r.textValue)
          .map((r) => ({
            participant: s.participantCode,
            condition: s.conditionLabel,
            text: r.textValue!,
          }))
      );
  }, [completedSessions]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Study performance and response analysis.</p>
          </div>
          <Select value={studyId} onValueChange={setStudyId}>
            <SelectTrigger className="w-56 h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MOCK_STUDIES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.code} — {s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xl font-semibold">{sessions.length}</p>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xl font-semibold">{completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xl font-semibold">{completedSessions.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-highlight" />
              <div>
                <p className="text-xl font-semibold">{openEndedResponses.length}</p>
                <p className="text-xs text-muted-foreground">Open Responses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VAS Averages by Question */}
        {vasAverages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-body font-semibold">VAS Averages by Construct</CardTitle>
              <p className="text-xs text-muted-foreground">Mean scores on a continuous 0–100 scale.</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vasAverages} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip
                      formatter={(value: number) => [`${value}/100`, "Mean"]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="average" fill="hsl(219, 100%, 18%)" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Condition Comparison */}
        {conditionComparison.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-body font-semibold">Comparison by Condition</CardTitle>
              <p className="text-xs text-muted-foreground">Average VAS scores across experimental conditions.</p>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conditionComparison} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number, _: any, entry: any) => [
                        `${value}/100 (n=${entry.payload.n})`,
                        "Mean VAS",
                      ]}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Bar dataKey="average" radius={[4, 4, 0, 0]} barSize={48}>
                      {conditionComparison.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Open-ended responses */}
        {openEndedResponses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-body font-semibold">Open-Ended Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {openEndedResponses.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30 text-sm">
                    <p className="text-foreground italic">"{r.text}"</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.participant} · {r.condition}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
