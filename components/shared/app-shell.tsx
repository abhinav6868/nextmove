"use client";

import * as React from "react";
import { Header } from "./header";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { CommandPalette } from "./command-palette";
import { AddCompanyModal } from "./add-company-modal";
import { useRouter, usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [addCompanyOpen, setAddCompanyOpen] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const isHome = pathname === "/";

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/refresh", { method: "POST" });
      router.refresh();
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text antialiased selection:bg-accent/20">
      {!isHome && (
        <Header
          onOpenCommand={() => setCommandOpen(true)}
          onAddCompany={() => setAddCompanyOpen(true)}
          isRefreshing={isRefreshing}
          onRefreshAll={handleRefreshAll}
        />
      )}

      <main className="flex-1 w-full pb-20 sm:pb-8">{children}</main>

      {!isHome && (
        <MobileBottomNav
          onOpenCommand={() => setCommandOpen(true)}
          onAddCompany={() => setAddCompanyOpen(true)}
        />
      )}

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onAddCompany={() => setAddCompanyOpen(true)}
        onRefreshAll={handleRefreshAll}
      />

      <AddCompanyModal
        open={addCompanyOpen}
        onOpenChange={setAddCompanyOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
