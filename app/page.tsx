import Link from "next/link";
import { ScoreBadge } from "@/components/ui/score-badge";
import { SignalPill, SIGNAL_COLORS } from "@/components/ui/signal-pill";
import { ConfidenceDot } from "@/components/ui/confidence-dot";
import { Kbd } from "@/components/ui/kbd";
import {
  ExternalLink,
  Search,
  Zap,
  ArrowRight,
  CheckCircle2,
  Layers,
  Activity,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Cpu,
  Globe,
  CornerDownLeft,
  ChevronRight,
  FileCode,
  Terminal,
  Database,
  Sliders,
  Flame,
} from "lucide-react";
import { getTodayRankedCompanies } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getTodayRankedCompanies(5);
  const topFive = data.top;

  return (
    <div className="min-h-screen bg-bg text-text antialiased selection:bg-accent/20">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER (Exact GitNimble Style)                */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="font-semibold text-[15px] tracking-tight text-text">
                Nextmove
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[13px] text-text-muted">
              <Link href="#features" className="hover:text-text transition-colors">
                Features
              </Link>
              <Link href="#quick-intel" className="hover:text-text transition-colors">
                Quick Intel
              </Link>
              <Link href="#palette" className="hover:text-text transition-colors">
                Command palette
              </Link>
              <Link href="#scoring" className="hover:text-text transition-colors">
                Scoring
              </Link>
              <Link href="/changes" className="hover:text-text transition-colors">
                Diff feed
              </Link>
              <Link href="/pipeline" className="hover:text-text transition-colors">
                Pipeline
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/pipeline"
              className="hidden sm:inline-block text-[13px] text-text-muted hover:text-text transition-colors px-2 py-1"
            >
              Pipeline (16)
            </Link>
            <Link
              href="/today"
              className="inline-flex items-center justify-center h-8 px-3.5 sm:px-4 rounded-full bg-accent hover:bg-accent/90 text-white text-[12px] sm:text-[13px] font-medium transition-all shadow-xs active:scale-95"
            >
              <span className="sm:hidden">Today</span>
              <span className="hidden sm:inline">Open Today&apos;s Brief</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION WITH GITNIMBLE ROUTED CIRCUIT LINES  */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-14 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* SVG Circuit Routing Lines (Framing the hero like GitNimble Image 3) */}
        <div
          className="absolute inset-x-0 top-0 h-[620px] pointer-events-none hidden xl:block z-0 max-w-7xl mx-auto"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Route 1: Funding (Teal #14B8A6) */}
            <path
              d="M 30 110 H 140 Q 160 110 160 130 V 480 Q 160 500 140 500 V 525"
              stroke="#14B8A6"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="opacity-70"
            />
            <circle cx="30" cy="110" r="4.5" fill="#14B8A6" />
            <text
              x="45"
              y="104"
              fill="#14B8A6"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              ● Funding $20M
            </text>

            {/* Route 2: Leadership (Purple #8B5CF6) */}
            <path
              d="M 50 200 H 110 Q 130 200 130 220 V 480 Q 130 500 110 500 V 525"
              stroke="#8B5CF6"
              strokeWidth="1.5"
              className="opacity-60"
            />
            <circle cx="50" cy="200" r="4.5" fill="#8B5CF6" />
            <text
              x="65"
              y="194"
              fill="#8B5CF6"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              ● New Head of Ops
            </text>

            {/* Route 3: Hiring (Blue #2563EB) */}
            <path
              d="M 30 430 H 80 Q 100 430 100 450 V 525"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="opacity-70"
            />
            <circle cx="30" cy="430" r="4.5" fill="#2563EB" />
            <text
              x="45"
              y="424"
              fill="#2563EB"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              ● Hiring surge (3 ops)
            </text>

            {/* Route 4: Product (Pink #EC4899) */}
            <path
              d="M 1170 130 H 1060 Q 1040 130 1040 150 V 480 Q 1040 500 1060 500 V 525"
              stroke="#EC4899"
              strokeWidth="1.5"
              className="opacity-60"
            />
            <circle cx="1170" cy="130" r="4.5" fill="#EC4899" />
            <text
              x="1055"
              y="124"
              fill="#EC4899"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              ● Product Launch
            </text>

            {/* Route 5: Expansion (Orange #F59E0B) */}
            <path
              d="M 1140 250 H 1080 Q 1065 250 1065 270 V 480 Q 1065 500 1085 500 V 525"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="opacity-70"
            />
            <circle cx="1140" cy="250" r="4.5" fill="#F59E0B" />
            <text
              x="1010"
              y="244"
              fill="#F59E0B"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="500"
            >
              ● Series B expansion
            </text>
          </svg>
        </div>

        {/* Centered Hero Text (Exact GitNimble Layout) */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] text-text leading-[1.06]">
            The sales intelligence brief built for AI.
          </h1>

          <p className="mt-5 text-[16px] sm:text-[18px] text-text-muted leading-relaxed max-w-2xl mx-auto font-normal">
            Nextmove is a 100% signal-driven intelligence engine built to live alongside your AI
            automation outreach. Identify active company triggers, extract decision-makers, and copy
            grounded 3-sentence pitches without breaking flow. No guessing, no generic AI slop.
          </p>

          {/* Centered Pill Buttons (GitNimble style: Solid Blue Pill + Outline Pill) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/today"
              className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-accent hover:bg-accent/90 text-white text-[14px] font-medium transition-all shadow-md active:scale-98"
            >
              Open Today&apos;s Brief
            </Link>

            <Link
              href="/pipeline"
              className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-surface hover:bg-surface-2 border border-hairline text-text text-[14px] font-medium transition-all shadow-xs active:scale-98"
            >
              Explore Pipeline Table
            </Link>
          </div>

          {/* GitNimble Meta Line */}
          <p className="mt-4 text-[12px] font-mono text-text-faint">
            Focus mode (Top 5) · Indian B2B SaaS (Series A–B) · 100% public data · 1-click clipboard copy
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CENTERED MAC WINDOW PRODUCT MOCKUP (Exact 3-Pane)    */}
        {/* ---------------------------------------------------- */}
        <div className="relative z-10 max-w-5xl mx-auto mt-12">
          <div className="rounded-[16px] border border-hairline bg-surface shadow-[0_1px_2px_rgba(0,0,0,.04),0_16px_40px_-12px_rgba(0,0,0,.14)] overflow-hidden">
            {/* macOS Chrome Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface-2/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] dark:bg-[#333333] border border-black/10 dark:border-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] dark:bg-[#333333] border border-black/10 dark:border-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5] dark:bg-[#333333] border border-black/10 dark:border-white/10" />
              </div>

              <div className="font-mono text-[11px] text-text-muted font-medium flex items-center gap-2">
                <span>nextmove — today brief</span>
                <span className="text-text-faint">·</span>
                <span className="text-accent font-semibold">Focus: Top 5 Active</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-faint">
                <Kbd>⌘K</Kbd>
                <Kbd>J/K</Kbd>
              </div>
            </div>

            {/* 3-Pane Native App Window Layout (GitNimble style) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] divide-y lg:divide-y-0 lg:divide-x divide-hairline bg-surface">
              {/* Left Pane: Sidebar (3 cols) */}
              <div className="lg:col-span-3 p-3 bg-surface-2/30 space-y-4 text-[12px]">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-faint font-semibold px-2 mb-1.5">
                    Intelligence Deck
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-surface text-text font-medium border border-hairline shadow-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        Today&apos;s Focus
                      </span>
                      <span className="font-mono text-[10px] text-text-faint bg-surface-2 px-1 rounded">
                        5
                      </span>
                    </div>
                    <Link
                      href="/pipeline"
                      className="flex items-center justify-between px-2 py-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-2/50 transition-colors"
                    >
                      <span>Monitored SaaS</span>
                      <span className="font-mono text-[10px] text-text-faint">16</span>
                    </Link>
                    <Link
                      href="/changes"
                      className="flex items-center justify-between px-2 py-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-2/50 transition-colors"
                    >
                      <span>Diff Stream</span>
                      <span className="font-mono text-[10px] text-text-faint">24</span>
                    </Link>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-faint font-semibold px-2 mb-1.5">
                    Signal Feeds
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-text-muted px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                      <span>Funding rounds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>Leadership changes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      <span>Ops hiring surge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
                      <span>Product launches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      <span>Series B expansions</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-hairline/60">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-faint font-semibold px-2 mb-1.5">
                    Truth Verification
                  </div>
                  <div className="px-2 text-[11px] text-text-muted space-y-1 font-mono">
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <Check className="w-3 h-3" />
                      <span>Tier 1 Registries (MCA)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <Check className="w-3 h-3" />
                      <span>Tier 2 Primary Press</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-faint">
                      <span>• Conflict engine: 0 clash</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Pane: Staged Ranked Accounts (4 cols) */}
              <div className="lg:col-span-4 p-3 bg-surface space-y-2">
                <div className="flex items-center justify-between px-2 py-1 border-b border-hairline pb-2 font-mono text-[11px] text-text-faint">
                  <span>RANKED ACCOUNTS</span>
                  <span>SCORE / 100</span>
                </div>

                <div className="space-y-1.5">
                  {topFive.slice(0, 5).map((comp, idx) => {
                    const isSelected = idx === 0;
                    return (
                      <div
                        key={comp.id}
                        className={`p-2.5 rounded-[8px] border transition-all cursor-pointer ${
                          isSelected
                            ? "border-accent/40 bg-accent/5 shadow-xs"
                            : "border-hairline bg-surface hover:bg-surface-2/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-text-faint">
                              [{String(comp.rank).padStart(2, "0")}]
                            </span>
                            <span className="font-semibold text-[13px] text-text">
                              {comp.name}
                            </span>
                            <span className="font-mono text-[10px] text-text-muted">
                              {comp.stage}
                            </span>
                          </div>
                          <ScoreBadge score={comp.score?.total || 88} size="sm" />
                        </div>

                        <div className="mt-1 text-[11px] text-text-muted line-clamp-1">
                          {comp.score?.reasoning || "High actionability trigger detected."}
                        </div>

                        <div className="mt-1.5 flex items-center gap-1.5">
                          {comp.topSignal && (
                            <SignalPill type={comp.topSignal.type} label={comp.topSignal.type} />
                          )}
                          <span className="font-mono text-[10px] text-text-faint">
                            {comp.size_band}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Pane: Monospace Diff & 3-Sentence Draft (5 cols) */}
              <div className="lg:col-span-5 p-4 bg-surface-2/20 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-hairline font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-text">Sprinto · Snapshot Diff</span>
                      <span className="text-text-faint">#018 vs #019</span>
                    </div>
                    <span className="text-[#14B8A6] font-semibold">+3 additions</span>
                  </div>

                  {/* Monospace Diff Chunk (like GitNimble right panel) */}
                  <div className="mt-3 rounded-[8px] bg-surface border border-hairline p-3 font-mono text-[11px] leading-relaxed">
                    <div className="text-text-faint text-[10px] mb-1.5">
                      Chunk 1: Lines 14 – 20 (Snapshot Extracted Diff)
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-text-muted">
                        14  14  &gt; company: Sprinto (Security Compliance)
                      </div>
                      <div className="bg-red-500/10 text-red-700 dark:text-red-400 px-1.5 rounded -mx-1.5 text-[10px]">
                        15     - STAGE: Series A ($10M, Accel)
                      </div>
                      <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 rounded -mx-1.5 text-[10px] font-medium">
                        15  16 + STAGE: Series B ($20M, Accel) · 6w ago
                      </div>
                      <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 rounded -mx-1.5 text-[10px] font-medium">
                        16  17 + OPEN_ROLE: Lead Operations Manager
                      </div>
                      <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 rounded -mx-1.5 text-[10px] font-medium">
                        17  18 + OPEN_ROLE: AI Automation Specialist
                      </div>
                      <div className="text-text-muted text-[10px]">
                        18  19  &gt; confidence: 0.92 (Tier 1 MCA + TechCrunch)
                      </div>
                    </div>
                  </div>

                  {/* Verified Persona Box */}
                  <div className="mt-3 p-3 rounded-[8px] bg-surface border border-hairline text-[12px]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-text-faint">
                      <span>VERIFIED DECISION-MAKER</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ● High Reach (30/30)
                      </span>
                    </div>
                    <div className="mt-1 font-semibold text-text">
                      Girish Redekar
                      <span className="ml-2 font-normal text-text-muted text-[11px]">
                        Co-Founder &amp; CEO (ex-Recruiterbox)
                      </span>
                    </div>
                  </div>

                  {/* 3-Sentence Outreach Pitch */}
                  <div className="mt-3 p-3 rounded-[8px] bg-surface border border-hairline text-[12px]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold mb-1">
                      Trigger-Anchored Pitch (Strict 3-Sentence Rule)
                    </div>
                    <p className="text-text text-[12px] leading-relaxed italic">
                      &quot;Noticed Sprinto announced a $20M Series B lead by Accel and is scaling compliance ops roles. Given your surge in mid-market SOC2 audits, manual reviewer queues become the primary scaling choke point. We built an AI automation module that pre-triages audit evidence—worth 10 minutes next Tuesday?&quot;
                    </p>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3 border-t border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-faint">
                    <Kbd>C</Kbd>
                    <span>Copy pitch</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/company/1"
                      className="px-3 py-1 rounded-full bg-surface hover:bg-surface-2 border border-hairline text-[12px] font-medium text-text transition-colors"
                    >
                      View full intel
                    </Link>
                    <Link
                      href="/today"
                      className="px-3 py-1 rounded-full bg-accent hover:bg-accent/90 text-[12px] font-medium text-white transition-colors"
                    >
                      Open in Deck
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. SECTION 2: TRIGGER DETECTION (GITNIMBLE IMAGE 1)  */}
      {/* ---------------------------------------------------- */}
      <section
        id="quick-intel"
        className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-hairline"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-text">
            Trigger detection already knows the right angle.
          </h2>
          <p className="mt-4 text-[16px] text-text-muted leading-relaxed">
            Open it from Claude or ChatGPT chat, your CRM, terminal, or browser. Nextmove identifies
            the active company signal, computes the diff, and writes the 3-sentence pitch anchored in
            verified public evidence. No tab hunting. No window switching.
          </p>
        </div>

        {/* GitNimble Image 1 Layout: Floating Modal + Floating Brand Badges */}
        <div className="relative max-w-4xl mx-auto py-8">
          {/* Floating Integration Badge 1: Claude (Left) */}
          <div className="hidden md:flex absolute -left-10 top-16 z-20 items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] bg-surface border border-hairline shadow-lg transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 font-bold text-[14px]">
              ✳
            </div>
            <div className="text-left font-mono">
              <div className="text-[11px] font-semibold text-text">Claude chat</div>
              <div className="text-[9px] text-text-faint">Active context</div>
            </div>
          </div>

          {/* Floating Integration Badge 2: ChatGPT (Right) */}
          <div className="hidden md:flex absolute -right-8 top-32 z-20 items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] bg-surface border border-hairline shadow-lg transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-[14px]">
              ✿
            </div>
            <div className="text-left font-mono">
              <div className="text-[11px] font-semibold text-text">ChatGPT Plus</div>
              <div className="text-[9px] text-text-faint">Linked repo</div>
            </div>
          </div>

          {/* Floating Integration Badge 3: MCA Registry (Bottom Left) */}
          <div className="hidden md:flex absolute -left-6 bottom-10 z-20 items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] bg-surface border border-hairline shadow-lg transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-[14px]">
              🏛
            </div>
            <div className="text-left font-mono">
              <div className="text-[11px] font-semibold text-text">MCA Registry</div>
              <div className="text-[9px] text-text-faint">Tier 1 verified</div>
            </div>
          </div>

          {/* Floating Integration Badge 4: n8n Automation (Bottom Right) */}
          <div className="hidden md:flex absolute -right-6 bottom-8 z-20 items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] bg-surface border border-hairline shadow-lg transition-transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold text-[14px]">
              ⚡
            </div>
            <div className="text-left font-mono">
              <div className="text-[11px] font-semibold text-text">n8n Schedule</div>
              <div className="text-[9px] text-text-faint">Daily 06:00 IST</div>
            </div>
          </div>

          {/* The Central Quick Commit / Quick Pitch Floating Modal */}
          <div className="rounded-[16px] border border-hairline bg-surface p-5 sm:p-7 shadow-2xl relative z-10">
            {/* Header with repo dropdown and diff stats */}
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 rounded-[6px] bg-surface-2 border border-hairline font-mono text-[12px] font-medium text-text flex items-center gap-1.5 cursor-pointer">
                  <span>Sprinto Intelligence</span>
                  <span className="text-text-faint text-[10px]">⌄</span>
                </div>
                <span className="font-mono text-[11px] text-text-faint">stage: series-b</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-[#14B8A6] font-semibold">+3</span>
                <span className="text-red-500 font-semibold">-1</span>
                <span className="text-text-faint">•••••</span>
              </div>
            </div>

            {/* Middle Grid: Staged Signals Checklist + Monospace Diff */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-5">
              {/* Left side: Checklist of staged items */}
              <div className="md:col-span-5 space-y-2 text-[12px]">
                <div className="flex items-center justify-between text-[11px] font-mono text-text-faint mb-2">
                  <span>STAGED SIGNALS 4</span>
                  <span className="text-accent cursor-pointer">All ✓</span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 p-1.5 rounded bg-surface-2/60 border border-hairline">
                    <span className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span className="text-text truncate">Series B ($20M) lead by Accel</span>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded bg-surface-2/60 border border-hairline">
                    <span className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span className="text-text truncate">Lead Operations Manager role</span>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded bg-surface-2/60 border border-hairline">
                    <span className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span className="text-text truncate">AI Automation Specialist role</span>
                  </div>

                  <div className="flex items-center gap-2 p-1.5 rounded bg-surface-2/60 border border-hairline">
                    <span className="w-3.5 h-3.5 rounded bg-accent text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span className="text-text truncate">Girish Redekar (CEO verified)</span>
                  </div>
                </div>
              </div>

              {/* Right side: Monospace Diff preview */}
              <div className="md:col-span-7 rounded-[8px] bg-surface-2/40 border border-hairline p-3 font-mono text-[11px] leading-relaxed">
                <div className="flex items-center justify-between text-text-faint text-[10px] mb-1.5">
                  <span>Chunk 1: Lines 16 – 35</span>
                  <span className="text-text-muted">Unstage chunk</span>
                </div>
                <div className="space-y-0.5 text-[11px]">
                  <div className="text-text-muted">16  16  &gt; ADDED: local snapshot diff detected</div>
                  <div className="text-text-muted">17  17  &gt; Background refresh stays quiet until signal</div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-1 rounded -mx-1 font-medium">
                    19  + &gt; ADDED: Series B capital ($20M, Accel)
                  </div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-1 rounded -mx-1 font-medium">
                    20  + &gt; ADDED: Ops scaling bottleneck identified
                  </div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-1 rounded -mx-1 font-medium">
                    21  + &gt; FIXED: 3-sentence prompt strictly anchored
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Generated Pitch Input + Commit Button */}
            <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[12px] text-text-muted font-mono truncate max-w-md">
                Draft 3-sentence pitch: Sprinto Series B + 3 ops hires
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-hairline text-accent focus:ring-0"
                  />
                  <span>Push to CRM</span>
                </label>

                <button
                  type="button"
                  className="px-5 py-2 rounded-full bg-accent hover:bg-accent/90 text-white font-medium text-[13px] shadow-xs active:scale-95 transition-all"
                >
                  Commit &amp; Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Columns Beside / Stacked (GitNimble Image 1 Right Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
          {/* Card 1: Registries & Truth Hierarchy */}
          <div className="p-6 rounded-[16px] border border-hairline bg-surface space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-text tracking-tight">
                MCA and LinkedIn, built in.
              </h3>
              <p className="mt-1.5 text-[13px] text-text-muted leading-relaxed">
                Work with hosted public registries without breaking your flow. MCA India, LinkedIn
                Jobs, and primary tech press are part of the same fast, native truth hierarchy.
              </p>
            </div>

            <div className="space-y-2 text-[12px] text-text">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Tier 1 official MCA filings override aggregated tech blogs</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Automated conflict detection when dates or amounts clash</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Search company snapshot diffs quickly from the ⌘K command palette</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Mathematical confidence dampening prevents hallucinated outreach</span>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-text-faint">
              <span>Connected registries</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                MCA India ✓ · LinkedIn ✓ · GitHub ✓
              </span>
            </div>
          </div>

          {/* Card 2: 3-Sentence Pitches */}
          <div className="p-6 rounded-[16px] border border-hairline bg-surface space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-text tracking-tight">
                Turn snapshot diffs into 3-sentence pitches.
              </h3>
              <p className="mt-1.5 text-[13px] text-text-muted leading-relaxed">
                Keep sales outreach concise and impossible to ignore. No 5-paragraph flattery
                essays. Create high-converting pitches anchored directly in new hires and funding.
              </p>
            </div>

            <div className="space-y-2 text-[12px] text-text">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>3-sentence rule strictly enforced by code, not prompt hints</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Sentence 1: The trigger · Sentence 2: Choke point · Sentence 3: Low-friction ask</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Zero fabricated names or fake job titles</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>1-click copy to clipboard with keyboard shortcut (C)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-text-faint">
              <span>Outreach style</span>
              <span className="text-text font-semibold">Strict 3 sentences · No slop</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. SECTION 3: COMMAND PALETTE (GITNIMBLE IMAGE 2)    */}
      {/* ---------------------------------------------------- */}
      <section id="palette" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-hairline">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-text">
            Your entire workflow, one command palette.
          </h2>
          <p className="mt-4 text-[16px] text-text-muted leading-relaxed">
            Press <Kbd>⌘K</Kbd> to perform every intelligence action or enter a company name
            straight in. Switch accounts, toggle Focus mode, copy pitches, run research pipelines,
            and inspect diffs, all without leaving the keyboard.
          </p>
        </div>

        {/* Command Palette Mockup (Exact GitNimble Image 2 Replica) */}
        <div className="rounded-[16px] border border-hairline bg-surface shadow-2xl overflow-hidden max-w-xl mx-auto">
          {/* Search bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-hairline bg-surface">
            <Search className="w-4 h-4 text-text-faint mr-3 flex-shrink-0" />
            <span className="font-mono text-[13px] text-text">
              Search for commands or enter a company name...
            </span>
          </div>

          {/* List of actions with GitNimble-style icons and kbd shortcuts */}
          <div className="p-2 space-y-0.5 text-[13px] bg-surface">
            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-surface-2 text-text font-medium cursor-pointer">
              <div className="flex items-center gap-3">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span>AI 3-sentence pitch</span>
              </div>
              <Kbd>tab</Kbd>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Sparkles className="w-3.5 h-3.5 text-text-faint" />
                <span>AI stage and commit to CRM</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>⇧</Kbd>
                <Kbd>tab</Kbd>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <ArrowRight className="w-3.5 h-3.5 text-text-faint" />
                <span>AI stage, commit, and send</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>⌥</Kbd>
                <Kbd>⇧</Kbd>
                <Kbd>tab</Kbd>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Activity className="w-3.5 h-3.5 text-text-faint" />
                <span>Toggle Focus mode (Top 5 vs 10)</span>
              </div>
              <Kbd>F</Kbd>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Layers className="w-3.5 h-3.5 text-text-faint" />
                <span>Reset stage filters</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>⌥</Kbd>
                <Kbd>⌘</Kbd>
                <Kbd>S</Kbd>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="w-3.5 h-3.5 text-text-faint" />
                <span>Jump to Sprinto (Score 92)</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>1</Kbd>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="w-3.5 h-3.5 text-text-faint" />
                <span>Jump to Rocketlane (Score 91)</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>2</Kbd>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-[8px] hover:bg-surface-2 text-text-muted hover:text-text cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Database className="w-3.5 h-3.5 text-text-faint" />
                <span>Trigger scheduled intelligence refresh</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>⌘</Kbd>
                <Kbd>R</Kbd>
              </div>
            </div>
          </div>

          {/* Bottom command palette action bar (matching GitNimble Image 2 footer) */}
          <div className="px-4 py-2.5 border-t border-hairline bg-surface-2/40 flex items-center justify-between text-[11px] font-mono text-text-faint">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Kbd>tab</Kbd>
                <span>Commit</span>
              </span>
              <span className="flex items-center gap-1">
                <Kbd>⌥</Kbd>
                <Kbd>tab</Kbd>
                <span>Commit and push</span>
              </span>
            </div>
            <span>Esc to close</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. SECTION 4: EXPLAINABLE SCORING FORMULA            */}
      {/* ---------------------------------------------------- */}
      <section id="scoring" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-hairline">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
            PRD Section 7 · Mathematical Rigor
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-text mt-1.5">
            Explainable scoring. No black box math.
          </h2>
          <p className="mt-4 text-[16px] text-text-muted leading-relaxed">
            The LLM proposes evidence, and pure code does the math. If a score can&apos;t be
            explained in one sentence, it doesn&apos;t ship.
          </p>
        </div>

        {/* Formula Visual Card */}
        <div className="rounded-[16px] border border-hairline bg-surface p-6 sm:p-8 shadow-xs">
          <div className="font-mono text-center text-[15px] sm:text-[18px] font-semibold text-text p-4 rounded-[12px] bg-surface-2 border border-hairline">
            base = 0.35·Timing + 0.35·Fit + 0.30·Reach
            <div className="text-[13px] text-text-muted mt-1.5 font-normal">
              total = base × (0.6 + 0.4·Confidence)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-[13px]">
            <div className="p-4 rounded-[10px] bg-surface-2/40 border border-hairline">
              <div className="font-mono text-[11px] font-semibold uppercase text-accent">
                Timing (35%)
              </div>
              <div className="font-semibold text-text mt-1 text-[14px]">
                Fresh, Actionable Trigger
              </div>
              <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                Funding in last 90d, hiring surge in ops/AI, exec hire, or product launch.
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-surface-2/40 border border-hairline">
              <div className="font-mono text-[11px] font-semibold uppercase text-accent">
                Fit (35%)
              </div>
              <div className="font-semibold text-text mt-1 text-[14px]">
                ICP Sweet Spot
              </div>
              <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                Indian B2B SaaS, Series A–B, 20–200 headcount, Bengaluru first.
              </p>
            </div>

            <div className="p-4 rounded-[10px] bg-surface-2/40 border border-hairline">
              <div className="font-mono text-[11px] font-semibold uppercase text-accent">
                Reach (30%)
              </div>
              <div className="font-semibold text-text mt-1 text-[14px]">
                Identified Decision-Maker
              </div>
              <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                Named Head of Operations, CTO, or CEO with verified source path.
              </p>
            </div>
          </div>

          {/* Anti-Slop Discipline Guarantee */}
          <div className="mt-8 pt-6 border-t border-hairline">
            <div className="text-[11px] font-mono uppercase tracking-wider text-text-faint font-semibold mb-3">
              Design Doc Guarantee · Zero Anti-Slop Violations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              <div className="flex items-center gap-2 text-text">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>No emojis as icons or bullets anywhere in the app</span>
              </div>
              <div className="flex items-center gap-2 text-text">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>No purple-to-blue gradient fills or AI sparkles slop</span>
              </div>
              <div className="flex items-center gap-2 text-text">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>No fabricated names (e.g. John Doe, Sarah Smith)</span>
              </div>
              <div className="flex items-center gap-2 text-text">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Hairline 1px borders, solid blue pills, Geist typography</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. BOTTOM CTA SECTION                                */}
      {/* ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 text-center max-w-3xl mx-auto border-t border-hairline">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-text">
          Ready to act on today&apos;s highest-conviction accounts?
        </h2>
        <p className="mt-4 text-[16px] text-text-muted max-w-xl mx-auto leading-relaxed">
          Open Nextmove and review today&apos;s verified sales-intelligence deck in under 5 minutes.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3.5">
          <Link
            href="/today"
            className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-accent hover:bg-accent/90 text-white text-[14px] font-medium transition-all shadow-md active:scale-98"
          >
            Launch Today&apos;s Brief
          </Link>
          <Link
            href="/pipeline"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-surface hover:bg-surface-2 border border-hairline text-text text-[14px] font-medium transition-all active:scale-98"
          >
            View Pipeline Table
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. FOOTER                                            */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-hairline px-4 sm:px-6 py-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[12px] text-text-muted gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-medium text-text">Nextmove</span>
          <span>— Candidate Test Build for Product Engineer</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <Link href="/today" className="hover:text-text transition-colors">
            Today
          </Link>
          <Link href="/pipeline" className="hover:text-text transition-colors">
            Pipeline
          </Link>
          <Link href="/changes" className="hover:text-text transition-colors">
            Changes
          </Link>
          <Link href="/runs" className="hover:text-text transition-colors">
            Runs
          </Link>
          <Link href="/settings" className="hover:text-text transition-colors">
            Settings
          </Link>
        </div>
      </footer>
    </div>
  );
}
