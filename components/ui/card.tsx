import * as React from "react";
import { cn } from "@/lib/utils";
import { SIGNAL_COLORS, SignalType } from "./signal-pill";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  signalType?: SignalType | string;
  selected?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, signalType, selected, style, children, ...props }, ref) => {
    const borderColor = signalType
      ? SIGNAL_COLORS[signalType.toLowerCase() as SignalType] || "transparent"
      : undefined;

    return (
      <div
        ref={ref}
        style={{
          borderLeftColor: borderColor,
          ...style,
        }}
        className={cn(
          "relative rounded-[12px] bg-surface border border-hairline p-5 transition-all duration-150",
          signalType && "border-l-[2px]",
          selected && "ring-1 ring-accent border-accent/40 shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
