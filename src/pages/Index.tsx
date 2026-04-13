import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, ClipboardList, Users, BarChart3, Clock } from "lucide-react";
import { MOCK_STUDIES } from "@/data/studies";
import { MOCK_SESSIONS } from "@/data/participants";
import { MOCK_AUDIT } from "@/data/audit";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Active Studies",
    value: MOCK_STUDIES.filter((s) => s.status === "published").length.toString(),
    icon: FlaskConical,
    sub: `${MOCK_STUDIES.filter((s) => s.status === "draft").length} drafts`,
  },
  {
    label: "Total Surveys",
    value: MOCK_STUDIES.reduce((a, s) => a + s.surveysCount, 0).toString(),
    icon: ClipboardList,
    sub: "across all studies",
  },
  {
    label: "Participants",
    value: MOCK_SESSIONS.length.toString(),
    icon: Users,
    sub: `${MOCK_SESSIONS.filter((s) => s.status === "completed").length} completed`,
  },
  {
    label: "Completion Rate",
    value: `${Math.round(
      (MOCK_SESSIONS.filter((s) => s.status === "completed").length /
        Math.max(MOCK_SESSIONS.length, 1)) *
        100
    )}%`,
    icon: BarChart3,
    sub: "overall",
  },
];

export default function Index() {
  const recentStudies = MOCK_STUDIES.slice(0, 4);
  const recentActivity = MOCK_AUDIT.slice(0, 5);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Neuro Smart Lab — Universidad de La Sabana
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-body font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold font-body">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Studies */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-heading text-foreground mb-4">Recent Studies</h2>
            <div className="grid gap-3">
              {recentStudies.map((study) => (
                <Link to="/studies" key={study.id}>
                  <Card className="border border-border hover:border-accent/40 transition-colors cursor-pointer">
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                          <FlaskConical className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{study.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {study.code} · {study.conditions.length} conditions · {study.participantsCount} participants
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={study.status} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-heading text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="flex gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-foreground text-xs font-medium">{entry.action}</p>
                    <p className="text-muted-foreground text-xs truncate">{entry.entityLabel} — {entry.performedBy}</p>
                    <p className="text-muted-foreground/50 text-[10px] mt-0.5">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
