"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { X, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PIPELINE_STEPS = [
  "Fetching site & careers page",
  "Extracting structured company intel",
  "Generating append-only snapshot",
  "Computing field diffs & classifying signals",
  "Mapping decision-maker personas",
  "Computing explainable opportunity score",
  "Drafting trigger-anchored outreach",
];

export function AddCompanyModal({
  open,
  onOpenChange,
  onSuccess,
}: AddCompanyModalProps) {
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [currentStepIdx, setCurrentStepIdx] = React.useState(-1);
  const [error, setError] = React.useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentStepIdx(0);

    // Simulate progressive checklist UI for feedback while API executes
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), name: name.trim() || undefined }),
      });

      clearInterval(interval);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process company pipeline");
      }

      setCurrentStepIdx(PIPELINE_STEPS.length);
      setTimeout(() => {
        setLoading(false);
        setUrl("");
        setName("");
        setCurrentStepIdx(-1);
        onOpenChange(false);
        onSuccess?.();
      }, 800);
    } catch (err: unknown) {
      clearInterval(interval);
      setLoading(false);
      setError(err instanceof Error ? err.message : "Ingestion failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="fixed inset-0"
        onClick={() => !loading && onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-[14px] bg-surface border border-hairline shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div>
            <h3 className="text-[16px] font-semibold text-text tracking-tight">
              Ingest Company URL
            </h3>
            <p className="text-[12px] text-text-muted mt-0.5">
              Runs real crawler, diffing engine, and opportunity scoring
            </p>
          </div>
          <button
            onClick={() => !loading && onOpenChange(false)}
            className="text-text-muted hover:text-text p-1 rounded-full hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!loading && currentStepIdx === -1 ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-1.5">
                Company Website URL <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] border border-border-strong bg-surface text-text text-[14px] focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-1.5">
                Company Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Auto-detected if left blank"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] border border-hairline bg-surface text-text text-[14px] focus:border-accent outline-none"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-600 text-[12px]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Run Pipeline
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="font-mono text-[11px] text-text-faint uppercase tracking-wider mb-2">
              Pipeline Checklist
            </div>
            {PIPELINE_STEPS.map((step, idx) => {
              const isDone = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <div
                  key={step}
                  className="flex items-center justify-between text-[12px]"
                >
                  <span
                    className={cn(
                      "font-mono transition-colors",
                      isDone && "text-text font-medium",
                      isCurrent && "text-accent font-semibold",
                      !isDone && !isCurrent && "text-text-faint"
                    )}
                  >
                    {step}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    {isDone ? (
                      <span className="text-green-600 flex items-center gap-0.5">
                        <Check className="w-3.5 h-3.5" /> done
                      </span>
                    ) : isCurrent ? (
                      <span className="text-accent flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> running
                      </span>
                    ) : (
                      <span className="text-text-faint">waiting</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
