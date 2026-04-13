import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, ClipboardList, Users, BarChart3 } from "lucide-react";

const stats = [
  { label: "Active Studies", value: "3", icon: FlaskConical, change: "+1 this month" },
  { label: "Surveys", value: "12", icon: ClipboardList, change: "4 drafts" },
  { label: "Participants", value: "128", icon: Users, change: "32 this week" },
  { label: "Responses", value: "1,847", icon: BarChart3, change: "94% completion" },
];

const recentStudies = [
  { name: "Packaging Color Perception", status: "Active", surveys: 4, participants: 42 },
  { name: "Typography Legibility Study", status: "Active", surveys: 3, participants: 38 },
  { name: "Brand Identity Assessment", status: "Draft", surveys: 5, participants: 0 },
];

export default function Index() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
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
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Studies */}
        <div>
          <h2 className="text-xl font-heading text-foreground mb-4">Recent Studies</h2>
          <div className="grid gap-3">
            {recentStudies.map((study) => (
              <Card key={study.name} className="border border-border hover:border-accent/40 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{study.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {study.surveys} surveys · {study.participants} participants
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      study.status === "Active"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {study.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
