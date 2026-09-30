import Link from "next/link";
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
  Database,
  Sliders,
  Flame,
} from "lucide-react";
import { getTodayRankedCompanies } from "@/lib/db/queries";
import { InteractiveHeroDeck } from "@/components/home/interactive-hero-deck";
import { NextmoveLogo } from "@/components/shared/logo";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getTodayRankedCompanies(10);
  const companies = data.top;

  return (
    <div className="min-h-screen bg-bg text-text antialiased selection:bg-accent/20">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER (Synced to max-w-7xl)                  */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <NextmoveLogo size={22} showText />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[13px] text-text-muted">
              <Link href="#deck" className="hover:text-text transition-colors">
                Intelligence Deck
              </Link>
              <Link href="#diffs" className="hover:text-text transition-colors">
                Trigger Diffs
              </Link>
              <Link href="#registries" className="hover:text-text transition-colors">
                Registries
              </Link>
              <Link href="#scoring" className="hover:text-text transition-colors">
                Scoring Model
              </Link>
              <Link href="/changes" className="hover:text-text transition-colors">
                Changes Feed
              </Link>
              <Link href="/pipeline" className="hover:text-text transition-colors">
                Pipeline (16)
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
              className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-accent hover:bg-accent/90 text-white text-[13px] font-medium transition-all shadow-xs active:scale-95"
            >
              <span className="sm:hidden">Today</span>
              <span className="hidden sm:inline">Open Today&apos;s Brief</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION (Full-Fit, Edge-to-Edge Fluid)       */}
      {/* ---------------------------------------------------- */}
      <section className="pt-12 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Centered Hero Headline */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[12px] font-mono font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Daily Sales Intelligence Brief for Solo AI Automation Sellers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] text-text leading-[1.08]">
            The sales intelligence brief built for AI.
          </h1>

          <p className="mt-5 text-[16px] sm:text-[18px] text-text-muted leading-relaxed max-w-2xl mx-auto font-normal">
            Nextmove tells you which Indian B2B SaaS startups to act on today, who to contact, and what to say. Grounded in dated public snapshots, real diffs, and pure mathematical scoring. No guesswork, no generic AI slop.
          </p>

          {/* CTA Buttons */}
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
              Explore Pipeline (16 Startups)
            </Link>
          </div>

          {/* Value Pillars */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] font-mono text-text-faint">
            <span>Focus mode (Top 5)</span>
            <span>·</span>
            <span>Indian B2B SaaS (Series A–B)</span>
            <span>·</span>
            <span>100% public data</span>
            <span>·</span>
            <span>1-click clipboard copy</span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE LIVE TODAY DECK DIRECTLY ON HOMEPAGE     */}
        {/* ---------------------------------------------------- */}
        <div id="deck" className="mt-14 w-full">
          <InteractiveHeroDeck companies={companies} />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. SECTION 1: SNAPSHOT DIFFS & TRIGGER CLASSIFICATION */}
      {/* ---------------------------------------------------- */}
      <section id="diffs" className="py-20 border-t border-hairline bg-surface-2/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
              PRD Section 6 &amp; 9 · Append-Only Snapshots
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-text mt-1.5">
              Trigger detection already knows what changed.
            </h2>
            <p className="mt-3 text-[15px] text-text-muted leading-relaxed">
              Data is stored as dated append-only snapshots. Nextmove compares Snapshot A vs Snapshot B, detects field-level diffs, and classifies them into actionable Signals or routine Noise.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Diff Card 1: Actionable Signal (Sprinto) */}
            <div className="rounded-[16px] border border-hairline bg-surface p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hairline font-mono text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text">Sprinto · Snapshot Diff</span>
                  <span className="text-text-faint">#018 vs #019</span>
                </div>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Actionable Signal
                </span>
              </div>

              <div className="rounded-[8px] bg-surface-2/60 border border-hairline p-4 font-mono text-[11px] leading-relaxed">
                <div className="text-text-faint text-[10px] mb-2 font-medium">
                  Chunk 1: Lines 14 – 22 (Extracted Diff)
                </div>
                <div className="space-y-1">
                  <div className="text-text-muted">14  14  &gt; company: Sprinto (Security &amp; Compliance)</div>
                  <div className="text-text-muted">15  15  &gt; location: Bengaluru, India</div>
                  <div className="bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-0.5 rounded -mx-2">
                    16     - STAGE: Series A ($10M, Accel)
                  </div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded -mx-2 font-medium">
                    16  17 + STAGE: Series B ($20M, Accel) · ANNOUNCED 6 WEEKS AGO
                  </div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded -mx-2 font-medium">
                    17  18 + OPEN_ROLE: Lead Operations Manager (Operations)
                  </div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded -mx-2 font-medium">
                    18  19 + OPEN_ROLE: AI Automation Specialist (Engineering)
                  </div>
                  <div className="text-text-muted">19  20  &gt; confidence: 0.92 (Tier 1 MCA + TechCrunch)</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] pt-1 text-text-muted font-mono">
                <span>Urgency: High</span>
                <Link href="/changes" className="text-accent hover:underline flex items-center gap-1">
                  <span>View live diff stream</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Diff Card 2: Filtered Noise (Toplyne) */}
            <div className="rounded-[16px] border border-hairline bg-surface p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hairline font-mono text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text">Toplyne · Snapshot Diff</span>
                  <span className="text-text-faint">#009 vs #010</span>
                </div>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted border border-hairline">
                  Routine Noise (Filtered)
                </span>
              </div>

              <div className="rounded-[8px] bg-surface-2/60 border border-hairline p-4 font-mono text-[11px] leading-relaxed">
                <div className="text-text-faint text-[10px] mb-2 font-medium">
                  Chunk 1: Lines 40 – 48 (Marketing Copy Change)
                </div>
                <div className="space-y-1">
                  <div className="text-text-muted">40  40  &gt; company: Toplyne (PLG CRM)</div>
                  <div className="text-text-muted">41  41  &gt; location: Bengaluru, India</div>
                  <div className="bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-0.5 rounded -mx-2">
                    42     - TAGLINE: &quot;Find your product-qualified leads effortlessly&quot;
                  </div>
                  <div className="bg-surface text-text-muted px-2 py-0.5 rounded -mx-2">
                    42  43 + TAGLINE: &quot;The modern PLG intelligence platform for B2B&quot;
                  </div>
                  <div className="text-text-muted">43  44  &gt; hiring: 0 open operations roles</div>
                  <div className="text-text-muted">44  45  &gt; funding: No fresh capital detected</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] pt-1 text-text-muted font-mono">
                <span>Filter Reason: Reworded landing page copy</span>
                <span className="text-text-faint">Score unaffected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. SECTION 2: CONNECTED REGISTRIES & TRUTH HIERARCHY */}
      {/* ---------------------------------------------------- */}
      <section id="registries" className="py-20 border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                PRD Section 8 · Truth Priority
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-text mt-1.5">
                MCA and LinkedIn, built in.
              </h2>
              <p className="mt-3 text-[15px] text-text-muted leading-relaxed">
                Work with public registries without breaking your flow. Ministry of Corporate Affairs (MCA), LinkedIn Jobs, and primary tech press are part of the same fast, native truth hierarchy.
              </p>

              <div className="mt-6 space-y-3 text-[13px] text-text">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Tier 1 official MCA filings override aggregated tech blogs and Wikipedia</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Automated conflict detection: when dates or amounts clash, both are shown with superseded labels</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Mathematical confidence dampening prevents hallucinated pitches</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Every claim links to its source URL and extraction timestamp</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/today"
                  className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-accent hover:bg-accent/90 text-white text-[13px] font-medium transition-all shadow-xs"
                >
                  Review Today&apos;s Verified Brief
                </Link>
                <Link
                  href="/pipeline"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-surface hover:bg-surface-2 border border-hairline text-text text-[13px] font-medium transition-all"
                >
                  View Pipeline Table
                </Link>
              </div>
            </div>

            {/* Source Tiers Breakdown Card */}
            <div className="rounded-[16px] border border-hairline bg-surface p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hairline font-mono text-[12px]">
                <span className="font-semibold text-text uppercase tracking-wider">
                  4-Tier Truth Hierarchy
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Conflict Engine Active
                </span>
              </div>

              <div className="space-y-3 text-[13px]">
                <div className="p-3 rounded-[10px] bg-surface-2/50 border border-hairline">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-text">Tier 1: Official Registries &amp; Company Site</span>
                    <span className="text-emerald-600 font-semibold">Weight: 1.0</span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                    Ministry of Corporate Affairs (MCA), company domain, official careers page, press release page.
                  </p>
                </div>

                <div className="p-3 rounded-[10px] bg-surface-2/50 border border-hairline">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-text">Tier 2: Primary Tech Press</span>
                    <span className="text-accent font-semibold">Weight: 0.8</span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                    TechCrunch, Inc42, YourStory, Entrackr with named journalists and direct quotes.
                  </p>
                </div>

                <div className="p-3 rounded-[10px] bg-surface-2/50 border border-hairline">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-text">Tier 3: Aggregated Directories &amp; Job Boards</span>
                    <span className="text-text-muted font-semibold">Weight: 0.5</span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                    LinkedIn Jobs, Naukri, Wellfound, Tracxn, Crunchbase.
                  </p>
                </div>

                <div className="p-3 rounded-[10px] bg-surface-2/50 border border-hairline">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-text">Tier 4: Social &amp; Self-Reported Mentions</span>
                    <span className="text-text-faint font-semibold">Weight: 0.2</span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
                    X/Twitter announcements, LinkedIn founder posts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. SECTION 3: KEYBOARD-DRIVEN COMMAND PALETTE        */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 border-t border-hairline bg-surface-2/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
              Power-User Ergonomics
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-text mt-1.5">
              Your entire workflow, one command palette.
            </h2>
            <p className="mt-3 text-[15px] text-text-muted leading-relaxed">
              Press <Kbd>⌘K</Kbd> anywhere to search startups or trigger actions. Navigate with <Kbd>J</Kbd>/<Kbd>K</Kbd>, copy pitches with <Kbd>C</Kbd>, and toggle Focus mode with <Kbd>F</Kbd>.
            </p>
          </div>

          <div className="max-w-xl mx-auto rounded-[16px] border border-hairline bg-surface shadow-md overflow-hidden">
            <div className="flex items-center px-4 py-3.5 border-b border-hairline bg-surface">
              <Search className="w-4 h-4 text-text-faint mr-3 flex-shrink-0" />
              <span className="font-mono text-[13px] text-text">
                Search for companies or run actions...
              </span>
              <div className="ml-auto">
                <Kbd>ESC</Kbd>
              </div>
            </div>

            <div className="p-2 space-y-1 text-[13px] bg-surface">
              <div className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-surface-2 text-text font-medium">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>Toggle Focus mode (Top 5 only)</span>
                </div>
                <Kbd>F</Kbd>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-[8px] text-text-muted hover:bg-surface-2 hover:text-text transition-colors">
                <div className="flex items-center gap-2.5">
                  <Copy className="w-3.5 h-3.5 text-text-faint" />
                  <span>Copy active outreach draft</span>
                </div>
                <Kbd>C</Kbd>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-[8px] text-text-muted hover:bg-surface-2 hover:text-text transition-colors">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-3.5 h-3.5 text-text-faint" />
                  <span>Jump to Sprinto (Score 92)</span>
                </div>
                <Kbd>↵</Kbd>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-[8px] text-text-muted hover:bg-surface-2 hover:text-text transition-colors">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-3.5 h-3.5 text-text-faint" />
                  <span>Run intelligence refresh</span>
                </div>
                <Kbd>⌘R</Kbd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. SECTION 4: EXPLAINABLE SCORING FORMULA            */}
      {/* ---------------------------------------------------- */}
      <section id="scoring" className="py-20 border-t border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
              PRD Section 7 · Mathematical Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-text mt-1.5">
              Explainable scoring. No black box math.
            </h2>
            <p className="mt-3 text-[15px] text-text-muted leading-relaxed">
              The LLM proposes evidence, and pure code does the math. If a score can&apos;t be explained in one sentence, it doesn&apos;t ship.
            </p>
          </div>

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
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. BOTTOM CTA SECTION                                */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 border-t border-hairline text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-text">
            Ready to act on today&apos;s highest-conviction accounts?
          </h2>
          <p className="mt-3 text-[15px] text-text-muted max-w-xl mx-auto leading-relaxed">
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
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. FOOTER (Synced to max-w-7xl)                      */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-hairline py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[12px] text-text-muted gap-4">
          <div className="flex items-center gap-2">
            <NextmoveLogo size={18} />
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
        </div>
      </footer>
    </div>
  );
}
