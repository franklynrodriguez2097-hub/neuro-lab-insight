import { AppLayout } from "@/components/AppLayout";

export default function Surveys() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading text-foreground">Surveys</h1>
        <p className="text-muted-foreground mt-1">
          Build and configure perception surveys.
        </p>
      </div>
    </AppLayout>
  );
}
