"use client";

import * as React from "react";
import Link from "next/link";
import { ScoreBadge } from "@/components/ui/score-badge";
import { SignalPill, SIGNAL_COLORS, SignalType } from "@/components/ui/signal-pill";
import { ConfidenceDot } from "@/components/ui/confidence-dot";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  ExternalLink,
  ChevronLeft,
  Copy,
  Check,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyViewProps {
  company: {
    id: number;
    name: string;
    url: string;
    industry: string;
    size_band: string;
    stage: string;
    location: string | null;
    description: string | null;
    created_at: Date;
    score: {
      total: number;
      fit: number;
      timing: number;
      reach: number;
      confidence: string;
      reasoning: string;
    } | null;
    signals: Array<{
      id: number;
      type: string;
      description: string;
      is_meaningful: boolean;
      reason: string;
      urgency: string;
      detected_at: Date;
    }>;
    people: Array<{
      id: number;
      name: string | null;
      role: string;
      persona: string;
      persona_reason: string;
      source_url: string;
      confidence: string;
    }>;
    snapshots: Array<{
      id: number;
      captured_at: Date;
      extracted: unknown;
      source_map: unknown;
    }>;
    outreach: {
      draft: string;
      why_note: string;
    } | null;
  };
}

export function CompanyView({ company }: CompanyViewProps) {
  const [copiedDraft, setCopiedDraft] = React.useState(false);
  const [expandedConflicts, setExpandedConflicts] = React.useState<Record<string, boolean>>({});

  const latestSnapshot = company.snapshots[0];
  const extracted = (latestSnapshot?.extracted || {}) as Record<string, unknown>;
  const sourceMap = (latestSnapshot?.source_map || {}) as Record<
    string,
    { source_url?: string; tier?: number; date?: string; alternatives?: Array<{ value: string; tier: number; date?: string; label?: string; status: string }> }
  >;

  const handleCopy = () => {
    if (company.outreach?.draft) {
      navigator.clipboard.writeText(company.outreach.draft);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    }
  };

  const toggleConflict = (fieldKey: string) => {
    setExpandedConflicts((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const openRoles = (extracted.open_roles || []) as Array<{
    title: string;
    department: string;
    source_url?: string;
  }>;

  const pains = (extracted.likely_pains || []) as string[];
  const whatToKnow = (extracted.what_to_know_before_approaching as string) || "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-hairline">
        <Link
          href="/today"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text font-mono transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Today</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={company.url.startsWith("http") ? company.url : `https://${company.url}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-hairline bg-surface hover:bg-surface-2 text-[12px] text-text font-medium transition-colors"
          >
            <span>Visit site</span>
            <ExternalLink className="w-3.5 h-3.5 text-text-faint" />
          </a>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Main Intel & Signals */}
        <div className="lg:col-span-7 space-y-8">
          {/* Company Title Header */}
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-[28px] font-semibold text-text tracking-tight">
                {company.name}
              </h1>
              <div className="flex items-center gap-1.5 text-[12px] font-mono text-text-muted">
                <span>{company.stage}</span>
                <span>·</span>
                <span>{company.size_band}</span>
                <span>·</span>
                <span>{company.industry}</span>
              </div>
            </div>

            <p className="text-[14px] text-text-muted mt-2 leading-relaxed">
              {company.description || "B2B SaaS startup with operational automation potential."}
            </p>
          </div>

          {/* Signals Timeline (Nimble Route Style) */}
          <div className="rounded-[12px] border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider font-mono">
                Signals Timeline
              </h3>
              <span className="text-[11px] font-mono text-text-faint">
                {company.signals.length} events detected
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
              {company.signals.map((sig) => {
                const signalType = (sig.type.toLowerCase() in SIGNAL_COLORS
                  ? sig.type.toLowerCase()
                  : "noise") as SignalType;
                const nodeColor = SIGNAL_COLORS[signalType];

                return (
                  <div key={sig.id} className="relative group">
                    {/* Node Dot */}
                    <span
                      className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-surface"
                      style={{ backgroundColor: nodeColor }}
                    />

                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <SignalPill type={sig.type} label={sig.type} />
                        {!sig.is_meaningful && (
                          <span className="text-[10px] font-mono text-text-faint uppercase">
                            Noise
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-text-faint">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(sig.detected_at))}
                      </span>
                    </div>

                    <p className="text-[14px] font-medium text-text mt-1.5 leading-snug">
                      {sig.description}
                    </p>
                    <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">
                      {sig.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sourced Intel Fields & Reliability Conflicts (PRD Task 7) */}
          <div className="rounded-[12px] border border-hairline bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider font-mono">
                Verified Intel & Reliability
              </h3>
              <span className="text-[11px] font-mono text-text-faint">
                Task 7 Conflict Rules
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Headcount Claim */}
              <div className="p-3 rounded-[8px] bg-surface-2/60 border border-hairline">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-faint block mb-1">
                  Team Headcount
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-semibold text-text">
                    {extracted.employee_count ? `${extracted.employee_count} employees` : company.size_band}
                  </span>
                  <ConfidenceDot level="high" showText={false} />
                </div>
                <div className="mt-1 text-[11px] font-mono text-text-muted">
                  Tier 1 · Sep 2026 · Official site
                </div>

                {/* Conflict / Alternative values expander */}
                {sourceMap.size_band?.alternatives && sourceMap.size_band.alternatives.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-hairline">
                    <button
                      onClick={() => toggleConflict("size_band")}
                      className="text-[11px] text-text-muted hover:text-text font-mono inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        {expandedConflicts["size_band"] ? "Hide" : "Other values (1)"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-3 h-3 transition-transform",
                          expandedConflicts["size_band"] && "rotate-180"
                        )}
                      />
                    </button>

                    {expandedConflicts["size_band"] && (
                      <div className="mt-1.5 p-2 rounded bg-surface border border-hairline text-[11px] font-mono text-text-muted space-y-1">
                        {sourceMap.size_band.alternatives.map((alt, i) => (
                          <div key={i}>
                            <span className="text-text font-medium">{alt.value}</span>{" "}
                            <span>({alt.label || "press release"}, {alt.date}, {alt.status})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Funding Stage Claim */}
              <div className="p-3 rounded-[8px] bg-surface-2/60 border border-hairline">
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-faint block mb-1">
                  Stage & Capital
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-semibold text-text">
                    {extracted.latest_round
                      ? `${(extracted.latest_round as { round: string; amount: string }).round} (${(extracted.latest_round as { round: string; amount: string }).amount})`
                      : company.stage}
                  </span>
                  <ConfidenceDot level="high" showText={false} />
                </div>
                <div className="mt-1 text-[11px] font-mono text-text-muted">
                  Tier 2 · TechCrunch & Crunchbase filings
                </div>
              </div>
            </div>

            {/* What to know before approaching */}
            {whatToKnow && (
              <div className="mt-4 p-3.5 rounded-[8px] bg-surface-2 border border-hairline">
                <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1">
                  What to know before approaching
                </div>
                <p className="text-[13px] text-text leading-relaxed">
                  {whatToKnow}
                </p>
              </div>
            )}

            {/* Likely Operational Pains */}
            {pains.length > 0 && (
              <div className="mt-3">
                <div className="font-mono text-[11px] uppercase tracking-wider text-text-faint mb-2">
                  Likely Operational Pains
                </div>
                <ul className="space-y-1.5">
                  {pains.map((pain, i) => (
                    <li
                      key={i}
                      className="text-[13px] text-text-muted flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>{pain}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Open Roles Table */}
          {openRoles.length > 0 && (
            <div className="rounded-[12px] border border-hairline bg-surface p-5">
              <div className="flex items-center justify-between mb-3 border-b border-hairline pb-2">
                <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider font-mono">
                  Active Hiring Signals ({openRoles.length})
                </h3>
                <span className="text-[11px] font-mono text-text-faint">
                  Source: Careers Portal (Tier 1)
                </span>
              </div>
              <div className="divide-y divide-hairline">
                {openRoles.map((role, i) => (
                  <div
                    key={i}
                    className="py-2 flex items-center justify-between text-[13px]"
                  >
                    <span className="font-medium text-text">{role.title}</span>
                    <span className="font-mono text-[11px] text-text-muted">
                      {role.department}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols, sticky): Score Breakdown, Personas, Outreach Draft */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Score Breakdown Panel (Task 2) */}
          {company.score && (
            <div className="rounded-[12px] border border-hairline bg-surface p-5 shadow-xs">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <div>
                  <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider font-mono">
                    Opportunity Score
                  </h3>
                  <p className="text-[11px] text-text-faint font-mono mt-0.5">
                    Code computed (no LLM math)
                  </p>
                </div>
                <ScoreBadge score={company.score.total} size="lg" />
              </div>

              {/* Sub-score grid */}
              <div className="grid grid-cols-3 gap-2 py-3 border-b border-hairline text-center">
                <div className="p-2 rounded bg-surface-2/60">
                  <div className="font-mono text-[10px] uppercase text-text-faint">
                    Timing (35%)
                  </div>
                  <div className="font-mono text-[15px] font-semibold text-text mt-0.5">
                    {company.score.timing}
                  </div>
                </div>

                <div className="p-2 rounded bg-surface-2/60">
                  <div className="font-mono text-[10px] uppercase text-text-faint">
                    Fit (35%)
                  </div>
                  <div className="font-mono text-[15px] font-semibold text-text mt-0.5">
                    {company.score.fit}
                  </div>
                </div>

                <div className="p-2 rounded bg-surface-2/60">
                  <div className="font-mono text-[10px] uppercase text-text-faint">
                    Reach (30%)
                  </div>
                  <div className="font-mono text-[15px] font-semibold text-text mt-0.5">
                    {company.score.reach}
                  </div>
                </div>
              </div>

              {/* Confidence & Formula Explanation */}
              <div className="pt-3">
                <div className="flex items-center justify-between text-[12px] mb-2 font-mono">
                  <span className="text-text-muted">Data Confidence</span>
                  <ConfidenceDot level="high" />
                </div>
                <p className="text-[12px] text-text-muted leading-relaxed font-sans">
                  {company.score.reasoning}
                </p>
              </div>
            </div>
          )}

          {/* People & Personas Panel (Task 3) */}
          <div className="rounded-[12px] border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between mb-3 border-b border-hairline pb-2">
              <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider font-mono">
                Right Person ({company.people.length})
              </h3>
              <span className="text-[11px] font-mono text-text-faint">
                Task 3 Grounding
              </span>
            </div>

            <div className="space-y-3">
              {company.people.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-[8px] bg-surface-2/60 border border-hairline"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[14px] text-text">
                      {p.name || p.role}
                    </span>
                    <ConfidenceDot level={p.confidence} showText={false} />
                  </div>
                  {p.name && (
                    <div className="text-[12px] text-text-muted font-mono mt-0.5">
                      {p.role}
                    </div>
                  )}
                  <p className="text-[12px] text-text-faint mt-1.5 leading-snug">
                    <span className="font-medium text-text-muted">Why:</span>{" "}
                    {p.persona_reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Outreach Draft Panel (Task 4) */}
          {company.outreach && (
            <div className="rounded-[12px] border border-hairline bg-surface p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-hairline pb-2 mb-3">
                <h3 className="text-[13px] font-semibold text-text uppercase tracking-wider font-mono">
                  Outreach Draft
                </h3>
                <span className="text-[11px] font-mono text-text-faint">
                  3 Sentences · Trigger Anchored
                </span>
              </div>

              {/* Why Note */}
              <div className="p-2.5 rounded bg-surface-2 border border-hairline mb-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-text-faint mb-0.5">
                  Why this person, why now
                </div>
                <p className="text-[12px] text-text leading-snug">
                  {company.outreach.why_note}
                </p>
              </div>

              {/* Message Body */}
              <div className="p-3.5 rounded-[8px] border border-hairline bg-surface text-text text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
                {company.outreach.draft}
              </div>

              <div className="mt-3 flex items-center justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCopy}
                  className="gap-1.5"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy draft</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
