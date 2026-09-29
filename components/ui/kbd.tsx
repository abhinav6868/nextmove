import * as React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "font-mono text-[11px] leading-none px-1.5 py-1 rounded-[4px] border border-hairline bg-surface-2 text-text-muted select-none tracking-tight inline-flex items-center justify-center font-medium",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
