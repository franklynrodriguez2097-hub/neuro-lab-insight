import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ConditionDraft {
  id: string;
  name: string;
  description: string;
}

let conditionCounter = 0;
const newCondition = (): ConditionDraft => ({
  id: `new-${++conditionCounter}`,
  name: "",
  description: "",
});

export default function CreateStudy() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [conditions, setConditions] = useState<ConditionDraft[]>([
    newCondition(),
    newCondition(),
  ]);

  const updateCondition = (
    id: string,
    field: keyof ConditionDraft,
    value: string
  ) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeCondition = (id: string) => {
    if (conditions.length <= 1) return;
    setConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a study name.");
      return;
    }
    if (conditions.some((c) => !c.name.trim())) {
      toast.error("All conditions must have a name.");
      return;
    }
    // Mock save
    toast.success("Study created successfully (mock).");
    navigate("/studies");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/studies")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Studies
        </button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading text-foreground">
            New Study
          </h1>
          <p className="text-muted-foreground mt-1">
            Define a new perception study and its experimental conditions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-body font-semibold">
                Study Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Study Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Packaging Color Perception"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and methodology of this study…"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-body font-semibold">
                  Experimental Conditions
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Define the conditions participants will be assigned to.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setConditions((prev) => [...prev, newCondition()])
                }
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {conditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className="flex gap-3 items-start p-3 rounded-lg bg-secondary/50"
                >
                  <span className="text-xs text-muted-foreground font-mono mt-2.5 shrink-0 w-5 text-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Condition name"
                      value={condition.name}
                      onChange={(e) =>
                        updateCondition(condition.id, "name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Brief description (optional)"
                      value={condition.description}
                      onChange={(e) =>
                        updateCondition(
                          condition.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCondition(condition.id)}
                    disabled={conditions.length <= 1}
                    className="mt-2.5 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/studies")}
            >
              Cancel
            </Button>
            <Button type="submit">Create Study</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
