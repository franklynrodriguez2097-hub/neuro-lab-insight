import { AppLayout } from "@/components/AppLayout";

export default function Studies() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading text-foreground">Studies</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage perception studies.
        </p>
      </div>
    </AppLayout>
  );
}
