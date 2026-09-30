"use client";

import * as React from "react";
import Link from "next/link";
import { ScoreBadge } from "@/components/ui/score-badge";
import { SignalPill } from "@/components/ui/signal-pill";
import { ConfidenceDot } from "@/components/ui/confidence-dot";
import { ExternalLink, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineCompany {
  id: number;
  name: string;
  url: string;
  stage: string;
  size_band: string;
  industry: string;
  lastChecked: Date;
  score: {
    total: number;
    fit: number;
    timing: number;
    reach: number;
    confidence: string;
  } | null;
  topSignal: {
    type: string;
    description: string;
    is_meaningful: boolean;
  } | null;
}

interface PipelineViewProps {
  companies: PipelineCompany[];
}

export function PipelineView({ companies }: PipelineViewProps) {
  const [filterStage, setFilterStage] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const stages = ["all", "Series A", "Series B", "Seed"];

  const filtered = companies.filter((c) => {
    const matchesStage =
      filterStage === "all" ||
      c.stage.toLowerCase() === filterStage.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-hairline gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text tracking-tight">
            Pipeline Intelligence
          </h1>
          <p className="text-[12px] text-text-muted mt-0.5 font-mono">
            {companies.length} watched companies · ranked by opportunity score
          </p>
        </div>

        {/* Filter Chips & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-faint absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-[12px] rounded-full border border-hairline bg-surface text-text focus:border-accent outline-none w-44 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 border border-hairline p-0.5 rounded-full bg-surface">
            {stages.map((st) => (
              <button
                key={st}
                onClick={() => setFilterStage(st)}
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer capitalize",
                  filterStage === st
                    ? "bg-text text-surface font-semibold"
                    : "text-text-muted hover:text-text"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card List (< sm) */}
      <div className="sm:hidden space-y-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-[12px] border border-hairline bg-surface p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/company/${c.id}`}
                  className="font-semibold text-[16px] text-text hover:text-accent transition-colors tracking-tight"
                >
                  {c.name}
                </Link>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono text-text-muted">
                  <span>{c.stage}</span>
                  <span>·</span>
                  <span>{c.size_band}</span>
                  <span>·</span>
                  <span>{c.industry}</span>
                </div>
              </div>

              {c.score && (
                <ScoreBadge score={c.score.total} size="sm" />
              )}
            </div>

            {c.topSignal && (
              <div className="pt-2 border-t border-hairline/60 flex items-center justify-between gap-2">
                <SignalPill
                  type={c.topSignal.type}
                  label={c.topSignal.description.length > 30 ? c.topSignal.description.slice(0, 30) + "..." : c.topSignal.description}
                />
                <span className="font-mono text-[10px] text-text-faint shrink-0">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(c.lastChecked))}
                </span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-[12px]">
              <Link
                href={`/company/${c.id}`}
                className="text-accent hover:underline font-medium text-[12px]"
              >
                View Full Intel →
              </Link>
              <a
                href={c.url.startsWith("http") ? c.url : `https://${c.url}`}
                target="_blank"
                rel="noreferrer"
                className="text-text-faint hover:text-text text-[11px] font-mono flex items-center gap-1"
              >
                <span>Visit site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Dense Table (Desktop only sm:) */}
      <div className="hidden sm:block rounded-[12px] border border-hairline bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-surface-2 text-[11px] uppercase tracking-wider font-mono text-text-muted font-semibold h-10 select-none">
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Stage</th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Top Signal</th>
                <th className="px-4 py-2 text-right">Confidence</th>
                <th className="px-4 py-2 text-right">Score</th>
                <th className="px-4 py-2 text-right">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-[13px]">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="h-11 hover:bg-surface-2/60 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-2 font-medium text-text">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/company/${c.id}`}
                        className="hover:text-accent font-semibold tracking-tight transition-colors"
                      >
                        {c.name}
                      </Link>
                      <a
                        href={c.url.startsWith("http") ? c.url : `https://${c.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-faint hover:text-text opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-2 font-mono text-[12px] text-text-muted">
                    {c.stage}
                  </td>
                  <td className="px-4 py-2 font-mono text-[12px] text-text-muted">
                    {c.size_band}
                  </td>
                  <td className="px-4 py-2">
                    {c.topSignal ? (
                      <SignalPill
                        type={c.topSignal.type}
                        label={c.topSignal.description.slice(0, 36) + "..."}
                      />
                    ) : (
                      <span className="font-mono text-[11px] text-text-faint">
                        None
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <ConfidenceDot
                      level={
                        Number(c.score?.confidence || 0.8) > 0.85
                          ? "high"
                          : "medium"
                      }
                      showText={false}
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-text">
                    {c.score ? c.score.total : "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-[11px] text-text-faint">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(c.lastChecked))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
