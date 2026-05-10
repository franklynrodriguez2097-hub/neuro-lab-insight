import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useStudies, useStudy, useStudyAnalytics, useDataSource } from "@/hooks/useStudies";
import { isUuid } from "@/lib/ids";
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
import { Users, CheckCircle2, Clock, MessageSquare, AlertCircle } from "lucide-react";

const CHART_COLORS = ["hsl(219, 100%, 18%)", "hsl(42, 29%, 41%)", "hsl(25, 90%, 55%)", "hsl(220, 10%, 46%)"];

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStudyId = searchParams.get("studyId") || "";
  const [studyId, setStudyId] = useState(initialStudyId);

  const { data: studies = [], isLoading: studiesLoading } = useStudies();
  const effectiveStudyId = studyId || studies[0]?.id || "";
  const { data: study } = useStudy(effectiveStudyId);
  const isRealStudy = isUuid(effectiveStudyId);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError,
    error,
  } = useStudyAnalytics(isRealStudy ? effectiveStudyId : undefined);
  const analyticsSource = useDataSource(`analytics:${effectiveStudyId}`);

  const sessions = analytics?.sessions ?? [];
  const answers = analytics?.answers ?? [];
  const questions = analytics?.questions ?? [];
  const conditions = analytics?.conditions ?? [];

  const completedSessions = sessions.filter((s) => s.status === "completed");
  const completionRate =
    sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0;

  const completedSessionIds = useMemo(
    () => new Set(completedSessions.map((s) => s.id)),
    [completedSessions],
  );
  const completedAnswers = useMemo(
    () => answers.filter((a) => completedSessionIds.has(a.session_id)),
    [answers, completedSessionIds],
  );

  // VAS averages by question / construct
  const vasAverages = useMemo(() => {
    const vasQuestions = questions.filter((q) => q.type === "vas");
    return vasQuestions
      .map((q) => {
        const values = completedAnswers
          .filter((a) => a.question_id === q.id && a.vas_value !== null)
          .map((a) => a.vas_value as number);
        const avg =
          values.length > 0 ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0;
        return {
          name: q.construct_label || q.prompt.slice(0, 30),
          average: avg,
          n: values.length,
        };
      })
      .filter((row) => row.n > 0);
  }, [questions, completedAnswers]);

  // VAS by condition
  const conditionComparison = useMemo(() => {
    return conditions.map((cond, ci) => {
      const condSessionIds = new Set(
        completedSessions.filter((s) => s.condition_id === cond.id).map((s) => s.id),
      );
      const vasValues = completedAnswers
        .filter((a) => a.question_type === "vas" && a.vas_value !== null && condSessionIds.has(a.session_id))
        .map((a) => a.vas_value as number);
      const avg =
        vasValues.length > 0
          ? Math.round(vasValues.reduce((s, v) => s + v, 0) / vasValues.length)
          : 0;
      return {
        name: cond.name,
        average: avg,
        n: condSessionIds.size,
        color: CHART_COLORS[ci % CHART_COLORS.length],
      };
    });
  }, [conditions, completedSessions, completedAnswers]);

  // Open-ended responses
  const conditionNameById = useMemo(
    () => new Map(conditions.map((c) => [c.id, c.name])),
    [conditions],
  );
  const sessionById = useMemo(() => new Map(sessions.map((s) => [s.id, s])), [sessions]);
  const openEndedResponses = useMemo(() => {
    return completedAnswers
      .filter((a) => a.question_type === "open_ended" && a.text_value)
      .map((a) => {
        const sess = sessionById.get(a.session_id);
        return {
          participant: sess?.participant_code ?? "—",
          condition: conditionNameById.get(a.condition_id) ?? "—",
          text: a.text_value as string,
        };
      });
  }, [completedAnswers, sessionById, conditionNameById]);

  const handleStudyChange = (value: string) => {
    setStudyId(value);
    const next = new URLSearchParams(searchParams);
    next.set("studyId", value);
    setSearchParams(next, { replace: true });
  };

  const hasNoData = isRealStudy && !analyticsLoading && sessions.length === 0;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Study performance and response analysis.
              {study && (
                <span className="ml-2 text-xs font-mono text-muted-foreground/70">
                  Context: {study.code} — {study.title}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {analyticsSource === "mock" && (
              <Badge variant="outline" className="text-[10px]">
                mock data
              </Badge>
            )}
            {!isRealStudy && effectiveStudyId && (
              <Badge variant="outline" className="text-[10px]">
                local study
              </Badge>
            )}
            <Select value={effectiveStudyId} onValueChange={handleStudyChange} disabled={studiesLoading}>
              <SelectTrigger className="w-56 h-10">
                <SelectValue placeholder="Select study" />
              </SelectTrigger>
              <SelectContent>
                {studies.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.code} — {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!isRealStudy && effectiveStudyId && (
          <Card>
            <CardContent className="py-6 flex items-start gap-3 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Local-only study</p>
                <p className="text-muted-foreground">
                  This study exists only in mock fixtures. Real analytics are computed from
                  participant sessions stored in the backend. Create a real study and collect at
                  least one session to see results here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card>
            <CardContent className="py-6 flex items-start gap-3 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Could not load analytics</p>
                <p className="text-muted-foreground">{(error as Error)?.message ?? "Unknown error."}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {analyticsLoading && isRealStudy && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        )}

        {isRealStudy && !analyticsLoading && !isError && (
          <>
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

            {hasNoData && (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No participant sessions yet. Run a survey to start collecting data.
                </CardContent>
              </Card>
            )}

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
                          formatter={(value: number, _: any, entry: any) => [
                            `${value}/100 (n=${entry.payload.n})`,
                            "Mean",
                          ]}
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
            {conditionComparison.length > 0 && completedSessions.length > 0 && (
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
          </>
        )}
      </div>
    </AppLayout>
  );
}
