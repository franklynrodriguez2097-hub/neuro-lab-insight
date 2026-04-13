import { AppLayout } from "@/components/AppLayout";

export default function Participants() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading text-foreground">Participants</h1>
        <p className="text-muted-foreground mt-1">
          View and manage participant sessions.
        </p>
      </div>
    </AppLayout>
  );
}
