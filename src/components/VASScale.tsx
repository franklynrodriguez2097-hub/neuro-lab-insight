import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface VASScaleProps {
  leftAnchor: string;
  rightAnchor: string;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function VASScale({
  leftAnchor,
  rightAnchor,
  value,
  onChange,
  disabled = false,
  className,
}: VASScaleProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, x / rect.width));
      const rounded = Math.round(ratio * 100);
      onChange(rounded);
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    calculateValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled) return;
    calculateValue(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={cn("select-none", className)}>
      {/* Track area */}
      <div
        ref={trackRef}
        className={cn(
          "relative h-12 flex items-center cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Track line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-border rounded-full" />

        {/* Filled portion */}
        {value !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-primary rounded-full transition-all duration-75"
            style={{ left: 0, width: `${value}%` }}
          />
        )}

        {/* Thumb */}
        {value !== null && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground shadow-md transition-all duration-75",
              isDragging && "scale-125 shadow-lg"
            )}
            style={{ left: `${value}%` }}
          />
        )}

        {/* Tap hint when no value */}
        {value === null && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground/60 pointer-events-none">
              Tap or drag to respond
            </span>
          </div>
        )}
      </div>

      {/* Anchors */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-muted-foreground max-w-[40%]">
          {leftAnchor}
        </span>
        <span className="text-xs text-muted-foreground max-w-[40%] text-right">
          {rightAnchor}
        </span>
      </div>
    </div>
  );
}
