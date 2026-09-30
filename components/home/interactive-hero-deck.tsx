"use client";

import * as React from "react";
import Link from "next/link";
import { ScoreBadge } from "@/components/ui/score-badge";
import { SignalPill, SignalType } from "@/components/ui/signal-pill";
import { Kbd } from "@/components/ui/kbd";
import { Copy, Check, ArrowRight, ExternalLink, ShieldCheck, Zap } from "lucide-react";

interface CompanyData {
  id: number;
  rank: number;
  name: string;
  url: string;
  industry: string;
  size_band: string;
  stage: string;
  score: {
    total: number;
    fit: number;
    timing: number;
    reach: number;
    confidence: string;
    reasoning: string;
  } | null;
  topSignal: {
    type: string;
    description: string;
    urgency: string;
  } | null;
  person: {
    name: string | null;
    role: string;
    persona: string;
    persona_reason: string;
  } | null;
  outreach: {
    draft: string;
    why_note: string;
  } | null;
}

interface InteractiveHeroDeckProps {
  companies: CompanyData[];
}

export function InteractiveHeroDeck({ companies }: InteractiveHeroDeckProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const selected = companies[selectedIndex] || companies[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selected) return null;

  return (
    <div className="w-full rounded-[20px] border border-hairline bg-surface shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Deck Toolbar */}
      <div className="px-5 py-3.5 border-b border-hairline bg-surface-2/40 flex flex-wrap items-center justify-between gap-3 text-[12px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold text-text tracking-tight">
              Live Intelligence Deck
            </span>
          </div>
          <span className="text-text-faint font-mono">|</span>
          <span className="font-mono text-text-muted text-[11px]">
            {companies.length} high-conviction accounts today
          </span>
        </div>

        <div className="flex items-center gap-2 text-text-faint font-mono text-[11px]">
          <span>Click any card to inspect</span>
          <span className="text-text-faint">·</span>
          <Link
            href="/today"
            className="text-accent hover:underline flex items-center gap-1 font-medium"
          >
            <span>Open full brief</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2-Column Responsive Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-hairline">
        {/* Left Column: Ranked Accounts Stream (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 space-y-2.5 bg-surface max-h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between px-1 pb-1 text-[11px] font-mono text-text-faint uppercase tracking-wider font-semibold">
            <span>Ranked Today</span>
            <span>Score / 100</span>
          </div>

          {companies.map((comp, idx) => {
            const isSelected = idx === selectedIndex;
            const topSignalType = (comp.topSignal?.type || "funding") as SignalType;

            return (
              <div
                key={comp.id}
                onClick={() => setSelectedIndex(idx)}
                className={`p-3.5 rounded-[12px] border transition-all cursor-pointer text-left ${
                  isSelected
                    ? "border-accent bg-accent/5 shadow-xs"
                    : "border-hairline bg-surface hover:bg-surface-2/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[12px] text-text-faint font-semibold">
                      [{String(comp.rank).padStart(2, "0")}]
                    </span>
                    <div>
                      <div className="font-semibold text-[15px] text-text tracking-tight flex items-center gap-2">
                        <span>{comp.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-mono font-medium text-accent bg-accent/10 px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-text-muted mt-0.5">
                        {comp.stage} · {comp.size_band} · {comp.industry}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <ScoreBadge score={comp.score?.total || 80} size="sm" />
                  </div>
                </div>

                <p className="mt-2 text-[12px] text-text leading-snug line-clamp-2">
                  {comp.score?.reasoning || "High actionability trigger detected."}
                </p>

                <div className="mt-2.5 flex items-center gap-2">
                  {comp.topSignal && (
                    <SignalPill type={topSignalType} label={comp.topSignal.type} />
                  )}
                  <span className="font-mono text-[10px] text-text-faint">
                    {comp.person?.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Intel, Diff, & Outreach Draft (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 bg-surface-2/30 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header of selected startup */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-hairline">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-text-faint">
                    RANK #{String(selected.rank).padStart(2, "0")} OF {companies.length}
                  </span>
                  <span className="text-text-faint font-mono">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Tier 1 Verified</span>
                  </span>
                </div>
                <h3 className="text-[22px] font-semibold text-text tracking-tight mt-1">
                  {selected.name}
                </h3>
                <div className="font-mono text-[12px] text-text-muted mt-0.5">
                  {selected.stage} · {selected.size_band} · {selected.industry}
                </div>
              </div>

              <div className="text-right">
                <ScoreBadge score={selected.score?.total || 85} size="lg" />
                <div className="text-[10px] font-mono text-text-faint mt-1">
                  {selected.score?.confidence || "High"} Confidence
                </div>
              </div>
            </div>

            {/* Opportunity Scoring Math Breakdown */}
            <div className="p-4 rounded-[12px] bg-surface border border-hairline space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-text-faint">
                <span className="uppercase tracking-wider font-semibold">
                  Scoring Breakdown (PRD Section 7)
                </span>
                <span>Formula: 0.35·Timing + 0.35·Fit + 0.30·Reach</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[12px]">
                <div className="p-2.5 rounded-[8px] bg-surface-2/60 border border-hairline/60">
                  <div className="text-[10px] font-mono text-text-faint">Timing (35%)</div>
                  <div className="font-semibold text-text mt-0.5">
                    {selected.score?.timing || 90}/100
                  </div>
                  <div className="w-full h-1 bg-surface-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${selected.score?.timing || 90}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-[8px] bg-surface-2/60 border border-hairline/60">
                  <div className="text-[10px] font-mono text-text-faint">Fit (35%)</div>
                  <div className="font-semibold text-text mt-0.5">
                    {selected.score?.fit || 85}/100
                  </div>
                  <div className="w-full h-1 bg-surface-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${selected.score?.fit || 85}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-[8px] bg-surface-2/60 border border-hairline/60">
                  <div className="text-[10px] font-mono text-text-faint">Reach (30%)</div>
                  <div className="font-semibold text-text mt-0.5">
                    {selected.score?.reach || 85}/100
                  </div>
                  <div className="w-full h-1 bg-surface-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${selected.score?.reach || 85}%` }}
                    />
                  </div>
                </div>
              </div>

              {selected.score?.reasoning && (
                <p className="text-[12px] text-text-muted leading-relaxed font-mono">
                  {selected.score.reasoning}
                </p>
              )}
            </div>

            {/* Target Person */}
            {selected.person && (
              <div className="p-4 rounded-[12px] bg-surface border border-hairline text-[12px] space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-text-faint font-semibold">
                  Verified Contact
                </div>
                <div className="text-[14px] font-semibold text-text">
                  {selected.person.name || selected.person.role}
                </div>
                <div className="font-mono text-[11px] text-text-muted">
                  {selected.person.role} · {selected.person.persona}
                </div>
                <div className="text-[12px] text-text-muted leading-relaxed mt-1">
                  {selected.person.persona_reason}
                </div>
              </div>
            )}

            {/* 3-Sentence Trigger-Anchored Pitch with Working 1-Click Copy */}
            {selected.outreach && (
              <div className="p-4 rounded-[12px] bg-surface border border-hairline space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                    3-Sentence Trigger-Anchored Pitch
                  </span>
                  <button
                    onClick={() => handleCopy(selected.outreach!.draft)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-accent hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span>Copied to clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-[8px] bg-surface-2/60 border border-hairline text-[12.5px] text-text leading-relaxed font-normal">
                  {selected.outreach.draft}
                </div>

                {selected.outreach.why_note && (
                  <div className="text-[11px] text-text-faint font-mono">
                    <span className="font-semibold text-text-muted mr-1">Why this trigger:</span>
                    {selected.outreach.why_note}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Card Navigation */}
          <div className="pt-4 border-t border-hairline flex items-center justify-between">
            <Link
              href={`/company/${selected.id}`}
              className="text-[12px] font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>View company detail profile</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <Link
              href="/today"
              className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-accent hover:bg-accent/90 text-white text-[12px] font-medium transition-all shadow-xs"
            >
              Launch Today&apos;s Deck
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
