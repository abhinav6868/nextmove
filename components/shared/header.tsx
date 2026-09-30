"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Plus, RefreshCw, Zap, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NextmoveLogo } from "./logo";

interface HeaderProps {
  onOpenCommand?: () => void;
  onAddCompany?: () => void;
  focusMode?: boolean;
  onToggleFocus?: () => void;
  isRefreshing?: boolean;
  onRefreshAll?: () => void;
}

export function Header({
  onOpenCommand,
  onAddCompany,
  focusMode = false,
  onToggleFocus,
  isRefreshing = false,
  onRefreshAll,
}: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/today", label: "Today" },
    { href: "/pipeline", label: "Pipeline" },
    { href: "/changes", label: "Changes" },
    { href: "/runs", label: "Runs" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand + Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/today"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <NextmoveLogo size={22} showText />
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/today" && pathname === "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                    isActive
                      ? "text-text bg-surface-2"
                      : "text-text-muted hover:text-text hover:bg-surface-2/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-2/80 border border-hairline text-[11px] font-mono text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Assessment Evaluation Dataset</span>
          </div>
        </div>

        {/* Right: Actions, Command Palette, Focus Toggle, Theme */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Action */}
          {onRefreshAll && (
            <button
              onClick={onRefreshAll}
              disabled={isRefreshing}
              title="Refresh intelligence"
              className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")}
              />
            </button>
          )}

          {/* Command Palette Trigger (Desktop pill, Mobile icon) */}
          <button
            onClick={onOpenCommand}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border border-hairline bg-surface hover:bg-surface-2 text-[12px] text-text-muted transition-colors cursor-pointer"
          >
            <span>Search & actions</span>
            <div className="flex items-center gap-1">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </div>
          </button>

          <button
            onClick={onOpenCommand}
            aria-label="Search and actions"
            className="md:hidden p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Focus Mode Pill Toggle */}
          {onToggleFocus && (
            <button
              onClick={onToggleFocus}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-medium border transition-colors cursor-pointer",
                focusMode
                  ? "bg-accent/10 border-accent/40 text-accent font-semibold"
                  : "bg-surface border-hairline text-text-muted hover:bg-surface-2"
              )}
            >
              <Zap className="w-3 h-3" />
              <span>{focusMode ? "Top 5" : "Top 10"}</span>
            </button>
          )}

          {/* Add Company Action */}
          {onAddCompany && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={onAddCompany}
                className="hidden sm:inline-flex gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add company</span>
              </Button>
              <button
                onClick={onAddCompany}
                aria-label="Add company"
                className="sm:hidden p-1.5 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
