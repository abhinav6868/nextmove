"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Kbd } from "@/components/ui/kbd";
import {
  Search,
  Plus,
  RefreshCw,
  Zap,
  Building2,
  Calendar,
  Layers,
  Activity,
  Copy,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCompany?: () => void;
  onToggleFocus?: () => void;
  onRefreshAll?: () => void;
  focusMode?: boolean;
}

export function CommandPalette({
  open,
  onOpenChange,
  onAddCompany,
  onToggleFocus,
  onRefreshAll,
  focusMode,
}: CommandPaletteProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-[14px] bg-surface border border-hairline shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <Command label="Command Menu" className="w-full">
          <div className="flex items-center px-3.5 border-b border-hairline">
            <Search className="w-4 h-4 text-text-faint mr-2.5 flex-shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search companies..."
              className="w-full py-3 text-[14px] bg-transparent outline-none text-text placeholder:text-text-faint font-normal"
            />
            <Kbd className="ml-2">ESC</Kbd>
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2 text-[13px]">
            <Command.Empty className="py-6 text-center text-text-muted text-[13px]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Actions" className="text-text-faint px-2 py-1 text-[11px] font-semibold uppercase tracking-wider">
              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  onAddCompany?.();
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-3.5 h-3.5 text-text-muted" />
                  <span>Add new company URL</span>
                </div>
                <Kbd>A</Kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  onToggleFocus?.();
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-3.5 h-3.5 text-text-muted" />
                  <span>{focusMode ? "Switch to Top 10" : "Switch to Focus Mode (Top 5)"}</span>
                </div>
                <Kbd>F</Kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  onRefreshAll?.();
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
                  <span>Refresh all intelligence runs</span>
                </div>
                <Kbd>R</Kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigation" className="text-text-faint px-2 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider">
              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  router.push("/today");
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  <span>Go to Today Brief</span>
                </div>
                <Kbd>1</Kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  router.push("/pipeline");
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-3.5 h-3.5 text-text-muted" />
                  <span>Go to Pipeline Table</span>
                </div>
                <Kbd>2</Kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  router.push("/changes");
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-3.5 h-3.5 text-text-muted" />
                  <span>Go to Changes Feed</span>
                </div>
                <Kbd>3</Kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  router.push("/runs");
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-3.5 h-3.5 text-text-muted" />
                  <span>Go to Runs & Automation Log</span>
                </div>
                <Kbd>4</Kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onOpenChange(false);
                  router.push("/settings");
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-surface-2 cursor-pointer text-text transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-3.5 h-3.5 text-text-muted" />
                  <span>Go to Settings & ICP</span>
                </div>
                <Kbd>5</Kbd>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
