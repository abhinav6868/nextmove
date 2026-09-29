import * as React from "react";
import { cn } from "@/lib/utils";

interface WindowFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function WindowFrame({
  title,
  className,
  children,
  ...props
}: WindowFrameProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-hairline bg-surface-2 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
        </div>
        {title && (
          <span className="font-mono text-[11px] text-text-faint">{title}</span>
        )}
        <div className="w-10" />
      </div>
      <div className="p-4 sm:p-6 bg-surface">{children}</div>
    </div>
  );
}
