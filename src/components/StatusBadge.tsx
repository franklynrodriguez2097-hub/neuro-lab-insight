import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-body transition-colors",
  {
    variants: {
      status: {
        draft: "bg-muted text-muted-foreground",
        active: "bg-primary/10 text-primary",
        completed: "bg-accent/15 text-accent",
        archived: "bg-muted text-muted-foreground/60",
      },
    },
    defaultVariants: {
      status: "draft",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {children}
    </span>
  );
}
