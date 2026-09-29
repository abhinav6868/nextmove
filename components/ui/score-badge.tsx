import * as React from "react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  className?: string;
  showBar?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({
  score,
  className,
  showBar = true,
  size = "md",
}: ScoreBadgeProps) {
  // Score is 0–100
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className={cn("inline-flex flex-col items-end", className)}>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium">
          Score
        </span>
        <span
          className={cn(
            "font-mono font-semibold tracking-tight text-text",
            size === "sm" && "text-sm",
            size === "md" && "text-base",
            size === "lg" && "text-xl"
          )}
        >
          {normalized}
        </span>
      </div>
      {showBar && (
        <div className="w-full h-[3px] bg-surface-2 rounded-full overflow-hidden mt-1 border border-border/50">
          <div
            className="h-full bg-text transition-all duration-300"
            style={{ width: `${normalized}%` }}
          />
        </div>
      )}
    </div>
  );
}
