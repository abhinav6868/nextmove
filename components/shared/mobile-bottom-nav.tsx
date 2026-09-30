"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Layers, Activity, Clock, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  onOpenCommand: () => void;
  onAddCompany?: () => void;
}

export function MobileBottomNav({
  onOpenCommand,
  onAddCompany,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/today",
      label: "Today",
      icon: Zap,
      isActive: pathname === "/today" || pathname === "/",
    },
    {
      href: "/pipeline",
      label: "Pipeline",
      icon: Layers,
      isActive: pathname === "/pipeline",
    },
    {
      href: "/changes",
      label: "Changes",
      icon: Activity,
      isActive: pathname === "/changes",
    },
    {
      href: "/runs",
      label: "Runs",
      icon: Clock,
      isActive: pathname === "/runs",
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-hairline px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px]",
                item.isActive
                  ? "text-accent font-semibold"
                  : "text-text-muted hover:text-text active:scale-95"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  item.isActive ? "bg-accent/10" : ""
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Quick Search / Command Button */}
        <button
          onClick={onOpenCommand}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-text-muted hover:text-text active:scale-95 transition-all min-w-[54px]"
        >
          <div className="p-1 rounded-lg bg-surface-2/80 border border-hairline">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            Search
          </span>
        </button>

        {/* Quick Add Company Button (if provided) */}
        {onAddCompany && (
          <button
            onClick={onAddCompany}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-accent active:scale-95 transition-all min-w-[54px]"
          >
            <div className="p-1 rounded-lg bg-accent text-white shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              Add
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
