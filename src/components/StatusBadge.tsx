import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { StudyStatus } from "@/data/studies";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-body transition-colors capitalize",
  {
    variants: {
      status: {
        draft: "bg-muted text-muted-foreground",
        in_review: "bg-highlight/10 text-highlight",
        published: "bg-primary/10 text-primary",
        active: "bg-primary/10 text-primary",
        closed: "bg-accent/15 text-accent",
        completed: "bg-accent/15 text-accent",
        archived: "bg-muted text-muted-foreground/60",
        in_progress: "bg-highlight/10 text-highlight",
        abandoned: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      status: "draft",
    },
  }
);

type StatusValue = "draft" | "in_review" | "published" | "active" | "closed" | "completed" | "archived" | "in_progress" | "abandoned";

interface StatusBadgeProps {
  status: StatusValue;
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const label = children || status.replace("_", " ");
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {label}
    </span>
  );
}
