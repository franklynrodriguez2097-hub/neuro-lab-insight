import { InfoTooltip } from "@/components/InfoTooltip";

interface SectionHeaderProps {
  title: string;
  description?: string;
  tooltip?: string;
  counter?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, description, tooltip, counter, children }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-body font-semibold text-foreground">{title}</h3>
          {tooltip && <InfoTooltip text={tooltip} />}
          {counter && (
            <span className="text-[10px] font-mono text-muted-foreground/60 bg-secondary px-1.5 py-0.5 rounded">
              {counter}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
