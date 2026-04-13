import { AppLayout } from "@/components/AppLayout";

export default function Analytics() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Compare conditions and stimuli across studies.
        </p>
      </div>
    </AppLayout>
  );
}
