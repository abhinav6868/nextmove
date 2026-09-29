"use client";

import * as React from "react";
import Link from "next/link";
import { SignalPill } from "@/components/ui/signal-pill";
import { cn } from "@/lib/utils";

interface ChangeFeedItem {
  id: number;
  company_id: number;
  type: string;
  description: string;
  is_meaningful: boolean;
  reason: string;
  urgency: string;
  detected_at: Date;
  company?: {
    id: number;
    name: string;
    stage: string;
  };
}

interface ChangesViewProps {
  signals: ChangeFeedItem[];
}

export function ChangesView({ signals }: ChangesViewProps) {
  const [filterType, setFilterType] = React.useState<"all" | "signals" | "noise">("all");

  const filtered = signals.filter((s) => {
    if (filterType === "signals") return s.is_meaningful;
    if (filterType === "noise") return !s.is_meaningful;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-hairline gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text tracking-tight">
            Trigger Detection & Changes Feed
          </h1>
          <p className="text-[12px] text-text-muted mt-0.5 font-mono">
            Snapshot A vs B diffs · Classified into actionable Signals vs Noise
          </p>
        </div>

        <div className="flex items-center gap-1 border border-hairline p-0.5 rounded-full bg-surface">
          <button
            onClick={() => setFilterType("all")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer",
              filterType === "all"
                ? "bg-text text-surface font-semibold"
                : "text-text-muted hover:text-text"
            )}
          >
            All Changes ({signals.length})
          </button>
          <button
            onClick={() => setFilterType("signals")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer",
              filterType === "signals"
                ? "bg-text text-surface font-semibold"
                : "text-text-muted hover:text-text"
            )}
          >
            Signals Only ({signals.filter((s) => s.is_meaningful).length})
          </button>
          <button
            onClick={() => setFilterType("noise")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer",
              filterType === "noise"
                ? "bg-text text-surface font-semibold"
                : "text-text-muted hover:text-text"
            )}
          >
            Noise ({signals.filter((s) => !s.is_meaningful).length})
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
          }).format(new Date(item.detected_at));

          return (
            <div
              key={item.id}
              className="rounded-[12px] border border-hairline bg-surface p-4 hover:border-border-strong transition-colors"
            >
              {/* Header: Company, Date, Signal/Noise Tag */}
              <div className="flex items-start justify-between gap-4 pb-2.5 border-b border-hairline/60">
                <div className="flex items-center gap-2">
                  {item.company ? (
                    <Link
                      href={`/company/${item.company.id}`}
                      className="font-semibold text-[15px] text-text hover:text-accent transition-colors tracking-tight"
                    >
                      {item.company.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[15px] text-text">
                      Company #{item.company_id}
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-text-faint">
                    · {formattedDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <SignalPill type={item.type} label={item.type} />
                  <span
                    className={cn(
                      "font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                      item.is_meaningful
                        ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30"
                        : "bg-surface-2 text-text-faint border-border"
                    )}
                  >
                    {item.is_meaningful ? "Signal" : "Noise"}
                  </span>
                </div>
              </div>

              {/* Diff Chunk (Nimble Style in Mono with Red/Green Tint) */}
              <div className="mt-3 p-3 rounded-[8px] bg-surface-2 font-mono text-[12px] border border-hairline space-y-1">
                <div className="text-text font-medium">{item.description}</div>
                <div className="text-text-muted text-[11px]">
                  <span className="text-text-faint">Reason:</span> {item.reason}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
