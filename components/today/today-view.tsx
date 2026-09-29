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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
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
          </div>
        </div>
      </div>

      {/* Main List of Ranked Cards */}
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
