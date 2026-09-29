import * as React from "react";
import { cn } from "@/lib/utils";

export type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceDotProps {
  level: ConfidenceLevel | string;
  showText?: boolean;
  className?: string;
}

export function ConfidenceDot({
  level,
  showText = true,
  className,
}: ConfidenceDotProps) {
  const normalized = (level || "medium").toLowerCase() as ConfidenceLevel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] text-text-muted font-normal",
        className
      )}
    >
      {normalized === "high" && (
        <span
          className="w-2 h-2 rounded-full bg-text flex-shrink-0"
          title="High confidence"
        />
      )}
      {normalized === "medium" && (
        <span
          className="w-2 h-2 rounded-full border border-text flex-shrink-0 relative overflow-hidden bg-surface"
          title="Medium confidence"
        >
          <span className="absolute inset-y-0 left-0 w-1/2 bg-text" />
        </span>
      )}
      {normalized === "low" && (
        <span
          className="w-2 h-2 rounded-full border border-text-faint flex-shrink-0 bg-transparent"
          title="Low confidence"
        />
      )}
      {showText && (
        <span className="capitalize text-[11px] tracking-tight">
          {normalized} confidence
        </span>
      )}
    </span>
  );
}
