"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { ScoreBadge } from "@/components/ui/score-badge";
import { SignalPill, SignalType } from "@/components/ui/signal-pill";
import { OutreachModal } from "./outreach-modal";
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyCardData {
  id: number;
  rank: number;
  name: string;
  url: string;
  industry: string;
  size_band: string;
  stage: string;
  location: string | null;
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
    is_meaningful: boolean;
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

interface DroppedCompanyData {
  id: number;
  rank: number;
  name: string;
  stage: string;
  size_band: string;
  dropReason: string;
  score: {
    total: number;
  } | null;
}

interface TodayViewProps {
  top: CompanyCardData[];
  dropped: DroppedCompanyData[];
  topN: number;
  totalWatched: number;
  lastRunTime?: string;
  onRefresh?: () => void;
  onAddCompany?: () => void;
}

export function TodayView({
  top,
  dropped,
  topN,
  totalWatched,
  lastRunTime = "06:02",
  onRefresh,
  onAddCompany,
}: TodayViewProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [isFocusMode, setIsFocusMode] = React.useState<boolean>(topN === 5);
  const [showDropped, setShowDropped] = React.useState<boolean>(false);
  const [activeModalData, setActiveModalData] = React.useState<{
    companyName: string;
    recipientName: string | null;
    recipientRole: string;
    draft: string;
    whyNote: string;
  } | null>(null);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  const [snoozedIds, setSnoozedIds] = React.useState<Set<number>>(new Set());

  // Format today's date: e.g. "Tue 29 Sep"
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(top.length - 1, prev + 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Enter" && top[selectedIndex]) {
        e.preventDefault();
        router.push(`/company/${top[selectedIndex].id}`);
      } else if (e.key === "c" && top[selectedIndex]?.outreach) {
        e.preventDefault();
        handleCopyDraft(
          top[selectedIndex].id,
          top[selectedIndex].outreach!.draft
        );
      } else if (e.key === "f") {
        e.preventDefault();
        handleToggleFocus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [top, selectedIndex, router, isFocusMode]);

  const handleToggleFocus = async () => {
    const nextLimit = isFocusMode ? 10 : 5;
    setIsFocusMode(!isFocusMode);
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "top_n", value: nextLimit }),
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to save focus mode:", err);
    }
  };

  const handleCopyDraft = (companyId: number, draftText: string) => {
    navigator.clipboard.writeText(draftText);
    setCopiedId(companyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSnooze = (companyId: number) => {
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      next.add(companyId);
      return next;
    });
  };

  const activeTop = top.filter((c) => !snoozedIds.has(c.id));
  const selected = activeTop[selectedIndex] || activeTop[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sub Header / Context Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-hairline gap-3">
        <div className="font-mono text-[12px] text-text-faint tracking-tight">
          <span className="text-text font-medium">{formattedDate}</span> ·{" "}
          <span className="text-text font-medium">{activeTop.length} to act on</span> ·{" "}
          <span>{totalWatched} watched</span> ·{" "}
          <span>last run {lastRunTime}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleFocus}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border transition-colors cursor-pointer",
              isFocusMode
                ? "bg-accent/10 border-accent/40 text-accent font-semibold"
                : "bg-surface border-hairline text-text-muted hover:bg-surface-2"
            )}
          >
            <Zap className="w-3 h-3" />
            <span>{isFocusMode ? "Focus mode (Top 5)" : "Standard (Top 10)"}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-text-faint">
            <Kbd>J</Kbd>
            <Kbd>K</Kbd>
            <span>to move</span>
            <span className="mx-1">·</span>
            <Kbd>C</Kbd>
            <span>to copy</span>
            <span className="mx-1">·</span>
            <Kbd>↵</Kbd>
            <span>intel</span>
          </div>
        </div>
      </div>

      {/* Dual Column Layout: Left Cards (7 cols) + Right Live Intel Drawer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ranked Cards Stream & Dropped Today */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            {activeTop.length === 0 ? (
          <div className="rounded-[12px] border border-hairline bg-surface p-12 text-center">
            <p className="text-text-muted text-[14px]">
              No companies yet. Paste a URL or press <Kbd>⌘K</Kbd>.
            </p>
            {onAddCompany && (
              <div className="mt-4">
                <Button size="sm" onClick={onAddCompany}>
                  Add company
                </Button>
              </div>
            )}
          </div>
        ) : (
          activeTop.map((company, index) => {
            const isSelected = selectedIndex === index;
            const topSignalType = (company.topSignal?.type || "funding") as SignalType;
            const rankFormatted = String(company.rank).padStart(2, "0");

            return (
              <Card
                key={company.id}
                signalType={topSignalType}
                selected={isSelected}
                onClick={() => setSelectedIndex(index)}
                className="group cursor-pointer hover:border-border-strong"
              >
                {/* Header Row: Rank, Company Name, External Link, Score Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px] text-text-muted font-medium select-none">
                      [{rankFormatted}]
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/company/${company.id}`}
                          className="font-semibold text-[17px] text-text hover:text-accent transition-colors tracking-tight"
                        >
                          {company.name}
                        </Link>
                        <a
                          href={
                            company.url.startsWith("http")
                              ? company.url
                              : `https://${company.url}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-text-faint hover:text-text transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[12px] text-text-muted font-mono">
                        <span>{company.stage}</span>
                        <span>·</span>
                        <span>{company.size_band}</span>
                        <span>·</span>
                        <span>{company.industry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {company.score && (
                      <ScoreBadge score={company.score.total} size="md" />
                    )}
                  </div>
                </div>

                {/* Trigger & Signals Row */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  <p className="text-[14px] text-text font-medium leading-snug">
                    {company.score?.reasoning ||
                      company.topSignal?.description ||
                      "Active market signals in B2B workflow scaling."}
                  </p>
                  <div className="flex items-center gap-1.5 ml-auto">
                    {company.topSignal && (
                      <SignalPill
                        type={company.topSignal.type}
                        label={company.topSignal.type}
                      />
                    )}
                    {company.stage && (
                      <SignalPill type="expansion" label={company.stage} />
                    )}
                  </div>
                </div>

                {/* Contact & Person Persona */}
                <div className="mt-3 pt-3 border-t border-hairline/60 flex items-baseline justify-between text-[13px]">
                  <div className="text-text-muted">
                    <span className="text-text-faint font-mono text-[11px] uppercase tracking-wider mr-1.5 font-medium">
                      Contact:
                    </span>
                    <span className="font-medium text-text">
                      {company.person?.name
                        ? `${company.person.name} (${company.person.role})`
                        : company.person?.role || "Head of Operations"}
                    </span>
                    <span className="text-text-muted text-[12px] ml-2">
                      — why: {company.person?.persona_reason || "owns the operational bottlenecks"}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {company.outreach && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalData({
                              companyName: company.name,
                              recipientName: company.person?.name || null,
                              recipientRole:
                                company.person?.role || "Head of Operations",
                              draft: company.outreach!.draft,
                              whyNote: company.outreach!.why_note,
                            });
                          }}
                        >
                          View draft
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyDraft(company.id, company.outreach!.draft);
                          }}
                          className="gap-1"
                        >
                          {copiedId === company.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSnooze(company.id);
                      }}
                    >
                      Snooze
                    </Button>
                  </div>

                  <Link
                    href={`/company/${company.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[12px] text-text-muted hover:text-text font-mono inline-flex items-center gap-1 group-hover:text-accent transition-colors"
                  >
                    <span>Full intelligence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Mobile Inline Intel Panel (revealed on mobile when selected) */}
                {isSelected && (
                  <div className="lg:hidden mt-4 pt-4 border-t border-hairline/70 space-y-3.5">
                    {/* Scoring Breakdown */}
                    <div className="p-3.5 rounded-[10px] bg-surface-2/60 border border-hairline space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-text-faint">
                        <span className="uppercase font-semibold tracking-wider">
                          Opportunity Scoring
                        </span>
                        <span>Confidence: {company.score?.confidence || "Medium"}</span>
                      </div>

                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="flex justify-between text-text-muted">
                          <span>Timing (35%): {company.score?.timing || 85}/100</span>
                          <span>Fit (35%): {company.score?.fit || 80}/100</span>
                          <span>Reach (30%): {company.score?.reach || 80}/100</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden flex">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${company.score?.timing || 85}%` }}
                          />
                        </div>
                      </div>

                      {company.score?.reasoning && (
                        <p className="text-[12px] text-text-muted italic leading-relaxed pt-1">
                          &quot;{company.score.reasoning}&quot;
                        </p>
                      )}
                    </div>

                    {/* Decision Maker Persona */}
                    {company.person && (
                      <div className="p-3.5 rounded-[10px] bg-surface-2/40 border border-hairline space-y-1 text-[12px]">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-text-faint font-semibold">
                          Identified Decision-Maker
                        </div>
                        <div className="font-semibold text-text">
                          {company.person.name || company.person.role}
                        </div>
                        <div className="text-[11px] font-mono text-text-muted">
                          {company.person.role} · {company.person.persona}
                        </div>
                        <div className="text-text-muted text-[12px] leading-relaxed pt-1">
                          {company.person.persona_reason}
                        </div>
                      </div>
                    )}

                    {/* Outreach Pitch Draft */}
                    {company.outreach && (
                      <div className="p-3.5 rounded-[10px] bg-accent/5 border border-accent/20 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                          <span>3-Sentence Outreach Pitch</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyDraft(company.id, company.outreach!.draft);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-mono normal-case cursor-pointer"
                          >
                            {copiedId === company.id ? (
                              <>
                                <Check className="w-3 h-3 text-green-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Draft</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[12px] text-text font-serif leading-relaxed whitespace-pre-wrap bg-surface/80 p-2.5 rounded-[6px] border border-hairline/60">
                          {company.outreach.draft}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Dropped Today Section (PRD Section 12) */}
      {dropped.length > 0 && (
        <div className="mt-10 pt-6 border-t border-hairline">
          <button
            onClick={() => setShowDropped(!showDropped)}
            className="w-full flex items-center justify-between text-left text-text-muted hover:text-text transition-colors py-2 cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px] text-text">
                Dropped today ({dropped.length})
              </span>
              <span className="text-[12px] text-text-faint font-mono">
                missed the top {topN} cut
              </span>
            </div>
            <div className="flex items-center gap-1 text-[12px] font-mono text-text-faint">
              <span>{showDropped ? "Hide" : "Show reasons"}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  showDropped && "rotate-180"
                )}
              />
            </div>
          </button>

          {showDropped && (
            <div className="mt-3 divide-y divide-hairline border border-hairline rounded-[12px] bg-surface overflow-hidden">
              {dropped.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-2/60 transition-colors text-[13px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-text-faint">
                      #{item.rank}
                    </span>
                    <Link
                      href={`/company/${item.id}`}
                      className="font-medium text-text hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="font-mono text-[11px] text-text-muted">
                      ({item.stage} · {item.size_band})
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-text-muted">
                    <span className="text-[12px] text-text-faint">
                      {item.dropReason}
                    </span>
                    {item.score && (
                      <span className="font-mono text-[12px] text-text-muted font-medium">
                        Score {item.score.total}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
        </div>

        {/* Right Column: Sticky Live Detail & Intelligence Drawer */}
        <div className="hidden lg:block lg:col-span-5 sticky top-20">
          {selected ? (
            <div className="rounded-[16px] border border-hairline bg-surface p-6 shadow-xs space-y-6">
                  {/* Selected Company Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-hairline">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-text-faint">
                          RANK #{String(selected.rank).padStart(2, "0")}
                        </span>
                        <span className="text-text-faint font-mono">·</span>
                        <span className="font-mono text-[11px] text-accent font-semibold">
                          Active Selection
                        </span>
                      </div>
                      <h2 className="text-[20px] font-semibold text-text tracking-tight mt-1">
                        {selected.name}
                      </h2>
                      <div className="font-mono text-[12px] text-text-muted mt-0.5">
                        {selected.stage} · {selected.size_band} · {selected.industry}
                      </div>
                    </div>

                    <ScoreBadge score={selected.score?.total || 0} size="lg" />
                  </div>

                  {/* Explainable Scoring Breakdown */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-text-faint mb-2">
                      <span className="uppercase font-semibold tracking-wider">
                        Opportunity Scoring
                      </span>
                      <span>Confidence: {selected.score?.confidence || "Medium"}</span>
                    </div>

                    <div className="space-y-2 text-[12px]">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-text-muted mb-1">
                          <span>Timing (35%)</span>
                          <span className="font-semibold text-text">
                            {selected.score?.timing || 85} / 100
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${selected.score?.timing || 85}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-text-muted mb-1">
                          <span>Fit (35%)</span>
                          <span className="font-semibold text-text">
                            {selected.score?.fit || 80} / 100
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${selected.score?.fit || 80}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-text-muted mb-1">
                          <span>Reach (30%)</span>
                          <span className="font-semibold text-text">
                            {selected.score?.reach || 80} / 100
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${selected.score?.reach || 80}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {selected.score?.reasoning && (
                      <p className="mt-3 text-[12px] text-text-muted italic bg-surface-2/40 p-2.5 rounded-[8px] border border-hairline/80 leading-relaxed">
                        &quot;{selected.score.reasoning}&quot;
                      </p>
                    )}
                  </div>

                  {/* Target Person */}
                  {selected.person && (
                    <div className="pt-4 border-t border-hairline space-y-1.5">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-text-faint font-semibold">
                        Target Decision-Maker
                      </div>
                      <div className="text-[14px] font-semibold text-text">
                        {selected.person.name || selected.person.role}
                      </div>
                      <div className="text-[12px] font-mono text-text-muted">
                        {selected.person.role} · {selected.person.persona}
                      </div>
                      <div className="text-[12px] text-text-muted leading-relaxed">
                        {selected.person.persona_reason}
                      </div>
                    </div>
                  )}

                  {/* 3-Sentence Outreach Pitch */}
                  {selected.outreach && (
                    <div className="pt-4 border-t border-hairline space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                          3-Sentence Outreach Draft
                        </span>
                        <button
                          onClick={() =>
                            handleCopyDraft(selected.id, selected.outreach!.draft)
                          }
                          className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === selected.id ? "Copied!" : "Copy (C)"}</span>
                        </button>
                      </div>

                      <div className="p-3.5 rounded-[10px] bg-surface-2/60 border border-hairline text-[12px] text-text leading-relaxed">
                        {selected.outreach.draft}
                      </div>

                      {selected.outreach.why_note && (
                        <div className="text-[11px] text-text-faint font-mono">
                          <span className="font-semibold text-text-muted mr-1">
                            Why now:
                          </span>
                          {selected.outreach.why_note}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-hairline flex items-center justify-between">
                    <Link
                      href={`/company/${selected.id}`}
                      className="w-full inline-flex items-center justify-center h-9 px-4 rounded-full bg-accent hover:bg-accent/90 text-white text-[13px] font-medium transition-all shadow-xs"
                    >
                      Open Full Intelligence Profile →
                    </Link>
                  </div>
                </div>
          ) : (
            <div className="rounded-[16px] border border-hairline bg-surface p-8 text-center text-text-muted text-[13px]">
              Select a company to view intelligence details.
            </div>
          )}
        </div>
      </div>

      {/* Outreach Preview & Copy Modal */}
      {activeModalData && (
        <OutreachModal
          open={!!activeModalData}
          onOpenChange={(open) => !open && setActiveModalData(null)}
          companyName={activeModalData.companyName}
          recipientName={activeModalData.recipientName}
          recipientRole={activeModalData.recipientRole}
          draft={activeModalData.draft}
          whyNote={activeModalData.whyNote}
        />
      )}
    </div>
  );
}
