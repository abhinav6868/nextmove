"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineLogItem {
  step: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: string;
  duration_ms?: number;
  details?: string;
}

interface RunItem {
  id: number;
  company_id: number | null;
  started_at: Date;
  finished_at: Date | null;
  status: string;
  log: PipelineLogItem[] | unknown;
  company?: {
    id: number;
    name: string;
    url: string;
  } | null;
}

interface RunsViewProps {
  runs: RunItem[];
}

export function RunsView({ runs }: RunsViewProps) {
  const [expandedRunId, setExpandedRunId] = React.useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedRunId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-hairline">
        <h1 className="text-[22px] font-semibold text-text tracking-tight">
          Pipeline Automation Runs
        </h1>
        <p className="text-[12px] text-text-muted mt-0.5 font-mono">
          Execution log for n8n webhooks, schedules, and manual triggers
        </p>
      </div>

      {/* Runs Table */}
      <div className="rounded-[12px] border border-hairline bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-surface-2 text-[11px] uppercase tracking-wider font-mono text-text-muted font-semibold h-10 select-none">
                <th className="px-4 py-2">Run ID</th>
                <th className="px-4 py-2">Company Target</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Started At</th>
                <th className="px-4 py-2">Execution Steps</th>
                <th className="px-4 py-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-[13px]">
              {runs.map((r) => {
                const logs = (Array.isArray(r.log) ? r.log : []) as PipelineLogItem[];
                const isExpanded = expandedRunId === r.id;
                const formattedDate = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(r.started_at));

                return (
                  <React.Fragment key={r.id}>
                    <tr
                      onClick={() => toggleExpand(r.id)}
                      className="h-11 hover:bg-surface-2/60 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-2 font-mono text-[12px] text-text-faint font-medium">
                        #{String(r.id).padStart(4, "0")}
                      </td>

                      <td className="px-4 py-2 font-medium text-text">
                        {r.company ? (
                          <Link
                            href={`/company/${r.company.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-accent font-semibold tracking-tight transition-colors"
                          >
                            {r.company.name}
                          </Link>
                        ) : (
                          <span className="text-text-muted font-mono text-[12px]">
                            Batch Refresh
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border",
                            r.status === "completed" &&
                              "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
                            r.status === "running" &&
                              "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
                            r.status === "failed" &&
                              "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30"
                          )}
                        >
                          {r.status === "completed" && (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          )}
                          {r.status === "running" && (
                            <Clock className="w-3 h-3 animate-spin text-blue-500" />
                          )}
                          {r.status === "failed" && (
                            <AlertCircle className="w-3 h-3 text-red-500" />
                          )}
                          <span className="capitalize">{r.status}</span>
                        </span>
                      </td>

                      <td className="px-4 py-2 font-mono text-[12px] text-text-muted">
                        {formattedDate}
                      </td>

                      <td className="px-4 py-2 font-mono text-[11px] text-text-muted">
                        {logs.length > 0
                          ? `${logs.filter((l) => l.status === "completed").length}/${logs.length} steps passed`
                          : "7 pipeline steps"}
                      </td>

                      <td className="px-4 py-2 text-right">
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-text-faint inline-block transition-transform duration-200",
                            isExpanded && "rotate-180 text-text"
                          )}
                        />
                      </td>
                    </tr>

                    {/* Expanded Steps View */}
                    {isExpanded && (
                      <tr className="bg-surface-2/40">
                        <td colSpan={6} className="p-4">
                          <div className="rounded-[8px] border border-hairline bg-surface p-4 space-y-2">
                            <div className="font-mono text-[11px] uppercase tracking-wider text-text-faint font-semibold mb-3">
                              Step-by-step Execution Log
                            </div>

                            {logs.length === 0 ? (
                              <p className="text-[12px] text-text-muted font-mono">
                                Standard automated workflow execution.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {logs.map((step, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start justify-between font-mono text-[12px] py-1 border-b border-hairline/50 last:border-0"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-green-600">✓</span>
                                      <span className="font-semibold text-text">
                                        {step.step}
                                      </span>
                                      {step.details && (
                                        <span className="text-text-muted text-[11px]">
                                          — {step.details}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-text-faint text-[11px]">
                                      {step.duration_ms
                                        ? `${step.duration_ms}ms`
                                        : "—"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
