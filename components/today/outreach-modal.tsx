"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { X, Copy, Check } from "lucide-react";

interface OutreachModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
  recipientName: string | null;
  recipientRole: string;
  draft: string;
  whyNote: string;
}

export function OutreachModal({
  open,
  onOpenChange,
  companyName,
  recipientName,
  recipientRole,
  draft,
  whyNote,
}: OutreachModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-[14px] bg-surface border border-hairline shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start justify-between pb-4 border-b border-hairline">
          <div>
            <span className="font-mono text-[11px] text-text-faint uppercase tracking-wider">
              Outreach Draft · {companyName}
            </span>
            <h3 className="text-[16px] font-semibold text-text tracking-tight mt-0.5">
              To: {recipientName ? `${recipientName} (${recipientRole})` : recipientRole}
            </h3>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-text-muted hover:text-text p-1 rounded-full hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Why this person, why now */}
        <div className="mt-4 p-3 rounded-[8px] bg-surface-2 border border-hairline">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1">
            Why this person, why now
          </div>
          <p className="text-[13px] text-text leading-relaxed">
            {whyNote}
          </p>
        </div>

        {/* Draft Message Body */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-medium">
              3-Sentence Draft (Restrained, no buzzwords)
            </span>
            <span className="font-mono text-[11px] text-text-faint">
              {draft.split("\n\n")[1]?.split(". ").length || 3} sentences
            </span>
          </div>
          <div className="p-4 rounded-[8px] border border-border-strong bg-surface text-text text-[14px] leading-relaxed whitespace-pre-wrap font-sans">
            {draft}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-hairline">
          <div className="flex items-center gap-1.5 text-text-faint text-[12px]">
            <span>Press</span>
            <Kbd>ESC</Kbd>
            <span>to close</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>Copied to clipboard</span>
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
      </div>
    </div>
  );
}
