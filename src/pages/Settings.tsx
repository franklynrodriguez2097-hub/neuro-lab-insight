import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";

export default function Settings() {
  const { roleName } = useRole();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Platform configuration and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-body">Current Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">{roleName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Switch roles using the selector in the top bar. This is a mock role system for prototype testing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-body">Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">NeuroSmart App v0.1</p>
              <p className="text-xs text-muted-foreground mt-1">
                Neuro Smart Lab · Universidad de La Sabana
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Internal research platform prototype.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-body">Data Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">Mock Data</p>
              <p className="text-xs text-muted-foreground mt-1">
                All data shown is synthetic. No real participant data is stored. The platform is prepared for Supabase integration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-body">Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">Not Connected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supabase integration is planned. Data types and structures are ready for migration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
