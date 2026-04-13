import { AppLayout } from "@/components/AppLayout";

export default function Stimuli() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading text-foreground">Stimuli</h1>
        <p className="text-muted-foreground mt-1">
          Manage visual stimuli for your studies.
        </p>
      </div>
    </AppLayout>
  );
}
