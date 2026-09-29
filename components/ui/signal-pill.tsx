import * as React from "react";
import { cn } from "@/lib/utils";

export type SignalType =
  | "funding"
  | "hiring"
  | "leadership"
  | "product"
  | "expansion"
  | "noise";

export const SIGNAL_COLORS: Record<SignalType, string> = {
  funding: "#14B8A6",
  hiring: "#2563EB",
  leadership: "#8B5CF6",
  product: "#EC4899",
  expansion: "#F59E0B",
  noise: "#A1A19C",
};

export const SIGNAL_LABELS: Record<SignalType, string> = {
  funding: "Funding",
  hiring: "Hiring",
  leadership: "Leadership",
  product: "Product",
  expansion: "Expansion",
  noise: "Noise",
};

interface SignalPillProps {
  type: SignalType | string;
  label?: string;
  className?: string;
}

export function SignalPill({ type, label, className }: SignalPillProps) {
  const normalizedType = (type.toLowerCase() in SIGNAL_COLORS
    ? type.toLowerCase()
    : "noise") as SignalType;
  const color = SIGNAL_COLORS[normalizedType];
  const displayLabel = label || SIGNAL_LABELS[normalizedType] || type;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-hairline bg-transparent text-[11px] font-medium text-text-muted select-none",
        className
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
    </span>
  );
}
