import Link from "next/link";
import Image from "next/image";
import { ScoreBadge } from "@/components/ui/score-badge";
import { SignalPill } from "@/components/ui/signal-pill";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  ArrowRight,
  Check,
  Zap,
  Activity,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getTodayRankedCompanies } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getTodayRankedCompanies(3);
  const topThree = data.top;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F4] antialiased selection:bg-[#2A5CFF]/30 overflow-x-hidden w-full">
      {/* ---------------------------------------------------- */}
      {/* 1. CINEMATIC HERO (Inspired by Superpower on Godly)  */}
      {/* ---------------------------------------------------- */}
      <section className="relative px-3 sm:px-6 pt-3 sm:pt-4 pb-16 max-w-7xl mx-auto w-full">
        {/* Outer Frame with Rounded Corners & Hairline Border */}
        <div className="relative rounded-[20px] sm:rounded-[32px] border border-[#26262A] overflow-hidden bg-[#111113] min-h-[600px] sm:min-h-[720px] flex flex-col justify-between w-full">
          {/* Background Cinematic Artwork with Solar Disc & Silhouette */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-art.jpg"
              alt="Cinematic solar silhouette backdrop"
              fill
              priority
              className="object-cover object-center sm:object-right opacity-80 mix-blend-screen scale-105 transition-transform duration-1000"
            />
            {/* Dark vignette gradient overlay for high contrast text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/85 to-transparent sm:w-2/3" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/30" />
          </div>

          {/* Sub Navigation Bar inside frame */}
          <div className="relative z-10 flex items-center justify-between px-3 sm:px-10 py-3.5 sm:py-5 border-b border-white/10 backdrop-blur-xs w-full">
            <div className="flex items-center gap-3 sm:gap-8">
              <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B82FF]" />
                <span className="font-semibold text-[15px] sm:text-[17px] tracking-tight text-white">
                  nextmove
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-6 text-[13px] text-[#9A9A96]">
                <Link href="#how-it-works" className="hover:text-white transition-colors">
                  How it works
                </Link>
                <Link href="#scoring" className="hover:text-white transition-colors">
                  Scoring model
                </Link>
                <Link href="#preview" className="hover:text-white transition-colors">
                  Daily cards
                </Link>
                <Link href="/changes" className="hover:text-white transition-colors">
                  Diff feed
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/today"
                className="hidden sm:inline-flex text-[13px] text-[#9A9A96] hover:text-white transition-colors px-2 py-1"
              >
                Log in
              </Link>
              <Link
                href="/today"
                className="inline-flex items-center justify-center h-8 sm:h-9 px-3.5 sm:px-5 rounded-full bg-white text-[#0B0B0C] text-[12px] sm:text-[13px] font-medium hover:bg-neutral-200 transition-all active:scale-95 shadow-sm whitespace-nowrap"
              >
                Launch app
              </Link>
            </div>
          </div>

          {/* Hero Main Copy */}
          <div className="relative z-10 px-4 sm:px-12 py-12 sm:py-24 max-w-2xl">
            {/* Top Badge Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-[12px] text-white/90 font-mono mb-5 backdrop-blur-md">
              <Check className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Verified public data · Indian B2B SaaS</span>
            </div>

            {/* Large Bold Sans Headline */}
            <h1 className="text-3xl sm:text-6xl font-semibold tracking-[-0.03em] text-white leading-[1.08] break-words">
              Your daily sales intelligence brief.
            </h1>

            {/* Subhead */}
            <p className="mt-5 text-[15px] sm:text-[17px] text-[#9A9A96] leading-relaxed max-w-xl font-normal">
              It tells one person which companies to act on today, who to contact, and what to say. Grounded in real public evidence with zero AI slop.
            </p>

            {/* CTAs matching Superpower pills */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/today"
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-white text-[#0B0B0C] text-[14px] font-medium hover:bg-neutral-200 transition-all shadow-md active:scale-98 text-center"
              >
                Open Today&apos;s Brief
              </Link>

              <Link
                href="/pipeline"
                className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[14px] font-medium transition-all backdrop-blur-md active:scale-98 gap-1.5 text-center"
              >
                <span>View Live Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bottom 3-Column Metrics Bar (Exactly like Superpower) */}
          <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md px-4 sm:px-12 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-[13px]">
            <div>
              <div className="font-semibold text-white tracking-tight">
                16+ Verified Startups
              </div>
              <div className="text-[12px] text-[#9A9A96] mt-0.5 font-mono">
                Bengaluru Series A–B sweet spot
              </div>
            </div>

            <div>
              <div className="font-semibold text-white tracking-tight">
                Explainable Scoring
              </div>
              <div className="text-[12px] text-[#9A9A96] mt-0.5 font-mono">
                0.35 Timing · 0.35 Fit · 0.30 Reach
              </div>
            </div>

            <div>
              <div className="font-semibold text-white tracking-tight">
                Append-Only Snapshots
              </div>
              <div className="text-[12px] text-[#9A9A96] mt-0.5 font-mono">
                Real diffs & trigger classification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. LIVE TODAY BRIEF PREVIEW (Product-as-Hero)         */}
      {/* ---------------------------------------------------- */}
      <section id="preview" className="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#5B82FF] font-semibold mb-2">
            Task 8 · The Today View
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Quiet, dense cards that take under 5 minutes to act on.
          </h2>
          <p className="text-[14px] text-[#9A9A96] mt-2">
            No endless scrolling through LinkedIn feeds. Each card delivers the specific trigger, the right contact, and a trigger-anchored draft.
          </p>
        </div>

        {/* Desktop Mockup Frame with macOS Neutral Dots */}
        <div className="rounded-[16px] border border-[#26262A] bg-[#111113] p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#26262A] mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26262A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#26262A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#26262A]" />
            </div>
            <span className="font-mono text-[11px] text-[#6E6E6A]">
              nextmove.app/today · Focus mode (Top 5)
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6E6E6A]">
              <Kbd className="bg-[#18181B] text-[#9A9A96] border-[#26262A]">J</Kbd>
              <Kbd className="bg-[#18181B] text-[#9A9A96] border-[#26262A]">K</Kbd>
            </div>
          </div>

          {/* Render Sample Live Cards */}
          <div className="space-y-4">
            {topThree.map((comp) => (
              <div
                key={comp.id}
                className="rounded-[12px] bg-[#18181B] border border-[#26262A] p-5 hover:border-[#38383D] transition-colors"
                style={{
                  borderLeftColor: comp.topSignal?.type === "leadership" ? "#8B5CF6" : "#14B8A6",
                  borderLeftWidth: "2px",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-[12px] text-[#6E6E6A] font-medium">
                        [{String(comp.rank).padStart(2, "0")}]
                      </span>
                      <span className="text-[17px] font-semibold text-white tracking-tight">
                        {comp.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#9A9A96]">
                        {comp.stage} · {comp.size_band} · {comp.industry}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#F5F5F4] font-medium mt-2 leading-snug">
                      {comp.score?.reasoning || "High actionability trigger detected."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {comp.topSignal && (
                        <SignalPill type={comp.topSignal.type} label={comp.topSignal.type} />
                      )}
                      <SignalPill type="expansion" label={comp.stage} />
                    </div>
                  </div>

                  <div className="flex-shrink-0 sm:text-right">
                    <ScoreBadge score={comp.score?.total || 80} size="md" />
                  </div>
                </div>

                {/* Contact & Actions */}
                <div className="mt-4 pt-3 border-t border-[#26262A] flex flex-col sm:flex-row sm:items-center justify-between text-[12px] gap-3">
                  <div className="text-[#9A9A96]">
                    <span className="text-[#6E6E6A] font-mono uppercase tracking-wider mr-1.5">
                      Contact:
                    </span>
                    <span className="text-white font-medium">
                      {comp.person?.name ? `${comp.person.name} (${comp.person.role})` : comp.person?.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/company/${comp.id}`}
                      className="px-3 py-1 rounded-full bg-white text-[#0B0B0C] text-[12px] font-medium hover:bg-neutral-200 transition-colors"
                    >
                      View draft
                    </Link>
                    <Link
                      href={`/company/${comp.id}`}
                      className="px-3 py-1 rounded-full bg-[#18181B] border border-[#26262A] text-[#9A9A96] hover:text-white text-[12px] font-medium transition-colors"
                    >
                      Full intel →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/today"
              className="inline-flex items-center gap-1.5 text-[13px] font-mono text-[#5B82FF] hover:underline"
            >
              <span>Explore all 16 ranked companies in Today view</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. 9 TASKS IN ONE PRODUCT ARCHITECTURE GRID           */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="px-4 sm:px-6 py-16 max-w-6xl mx-auto border-t border-[#26262A]">
        <div className="max-w-xl mb-12">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#5B82FF] font-semibold">
            Product Engineering Brief
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Nine views of one unified product.
          </h2>
          <p className="text-[14px] text-[#9A9A96] mt-2">
            Every feature connects directly to the core loop: from public domain ingestion to trigger-anchored outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[13px]">
          {/* Card 1: Scoring */}
          <div className="p-5 rounded-[16px] bg-[#111113] border border-[#26262A] flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center font-mono text-[12px] text-white font-semibold mb-3">
                02
              </div>
              <h3 className="font-semibold text-white text-[15px] tracking-tight">
                Explainable Scoring
              </h3>
              <p className="text-[#9A9A96] mt-2 leading-relaxed">
                Code does the math, never the LLM. 35% Timing + 35% Fit + 30% Reach multiplied by source confidence. Every number carries a one-sentence proof.
              </p>
            </div>
            <div className="mt-5 font-mono text-[11px] text-[#6E6E6A] pt-3 border-t border-[#26262A]">
              PRD Task 2 · /today & /settings
            </div>
          </div>

          {/* Card 2: Trigger Detection */}
          <div className="p-5 rounded-[16px] bg-[#111113] border border-[#26262A] flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center font-mono text-[12px] text-white font-semibold mb-3">
                06
              </div>
              <h3 className="font-semibold text-white text-[15px] tracking-tight">
                Trigger Detection & Diffing
              </h3>
              <p className="text-[#9A9A96] mt-2 leading-relaxed">
                Dated snapshots are never overwritten. Snapshot A vs B diffs are classified into actionable Signals (funding, exec hires) vs Noise (copy tweaks).
              </p>
            </div>
            <div className="mt-5 font-mono text-[11px] text-[#6E6E6A] pt-3 border-t border-[#26262A]">
              PRD Task 6 · /changes
            </div>
          </div>

          {/* Card 3: Data Reliability */}
          <div className="p-5 rounded-[16px] bg-[#111113] border border-[#26262A] flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center font-mono text-[12px] text-white font-semibold mb-3">
                07
              </div>
              <h3 className="font-semibold text-white text-[15px] tracking-tight">
                Source Tiers & Conflict Rules
              </h3>
              <p className="text-[#9A9A96] mt-2 leading-relaxed">
                Every claim cites a source tier (1–4) and date. Disagreeing reports display competing values side-by-side with superseded tags.
              </p>
            </div>
            <div className="mt-5 font-mono text-[11px] text-[#6E6E6A] pt-3 border-t border-[#26262A]">
              PRD Task 7 · /company/[id]
            </div>
          </div>

          {/* Card 4: Focus Mode */}
          <div className="p-5 rounded-[16px] bg-[#111113] border border-[#26262A] flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center font-mono text-[12px] text-white font-semibold mb-3">
                09
              </div>
              <h3 className="font-semibold text-white text-[15px] tracking-tight">
                Focus Mode & Dropped List
              </h3>
              <p className="text-[#9A9A96] mt-2 leading-relaxed">
                Flipping to Top 5 takes one click. Rank 6+ targets are moved to the &quot;Dropped today&quot; section with the exact reason each missed the cut.
              </p>
            </div>
            <div className="mt-5 font-mono text-[11px] text-[#6E6E6A] pt-3 border-t border-[#26262A]">
              PRD Task 9 · Config-driven
            </div>
          </div>

          {/* Card 5: Outreach */}
          <div className="p-5 rounded-[16px] bg-[#111113] border border-[#26262A] flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center font-mono text-[12px] text-white font-semibold mb-3">
                04
              </div>
              <h3 className="font-semibold text-white text-[15px] tracking-tight">
                3-Sentence Outreach
              </h3>
              <p className="text-[#9A9A96] mt-2 leading-relaxed">
                Strict anti-slop rules: zero generic openers, zero buzzwords (&quot;synergy&quot;, &quot;game-changing&quot;). Anchored directly to a dated trigger.
              </p>
            </div>
            <div className="mt-5 font-mono text-[11px] text-[#6E6E6A] pt-3 border-t border-[#26262A]">
              PRD Task 4 · 1-click clipboard copy
            </div>
          </div>

          {/* Card 6: Automation */}
          <div className="p-5 rounded-[16px] bg-[#111113] border border-[#26262A] flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#26262A] flex items-center justify-center font-mono text-[12px] text-white font-semibold mb-3">
                05
              </div>
              <h3 className="font-semibold text-white text-[15px] tracking-tight">
                n8n Scheduled Runs
              </h3>
              <p className="text-[#9A9A96] mt-2 leading-relaxed">
                06:00 IST cron schedule + webhook trigger. The /runs dashboard records immutable step checklist logs with millisecond timings.
              </p>
            </div>
            <div className="mt-5 font-mono text-[11px] text-[#6E6E6A] pt-3 border-t border-[#26262A]">
              PRD Task 5 · /runs & n8n/workflow.json
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. ANTI-SLOP COMPARISON SECTION                       */}
      {/* ---------------------------------------------------- */}
      <section className="px-4 sm:px-6 py-16 max-w-4xl mx-auto border-t border-[#26262A]">
        <div className="text-center mb-10">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#14B8A6] font-semibold">
            Strict 02_DESIGN.md Anti-Slop Discipline
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Built like an operational tool, not a generic AI app.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
          <div className="p-5 rounded-[14px] bg-[#18181B] border border-red-500/20">
            <div className="font-mono text-[11px] uppercase tracking-wider text-red-400 font-semibold mb-2">
              ✕ Generic AI App Slop (Hard Banned)
            </div>
            <ul className="space-y-2 text-[#9A9A96]">
              <li>• Purple-to-blue glow blobs and glassy blur overlays</li>
              <li>• Emojis as icons and bullet points (👋, 🚀, ✨)</li>
              <li>• &quot;I hope this email finds you well...&quot; generic cold outreach</li>
              <li>• Lorem ipsum or &quot;Company A&quot; placeholder charts</li>
              <li>• Vague &quot;AI is thinking...&quot; spinners hiding fake pipelines</li>
            </ul>
          </div>

          <div className="p-5 rounded-[14px] bg-[#18181B] border border-green-500/20">
            <div className="font-mono text-[11px] uppercase tracking-wider text-green-400 font-semibold mb-2">
              ✓ Nextmove Restraint & Density
            </div>
            <ul className="space-y-2 text-[#F5F5F4]">
              <li>• Hairline 1px borders, solid black/white pills, one accent</li>
              <li>• Geist Sans tight tracking (`-0.03em`) and Geist Mono tabular data</li>
              <li>• 3-sentence outreach anchored strictly to a dated trigger</li>
              <li>• 16 real Indian B2B SaaS companies seeded with 2 time points</li>
              <li>• Real pipeline step checklist with duration in milliseconds</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. FOOTER                                            */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-[#26262A] px-4 sm:px-6 py-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#6E6E6A] gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5B82FF]" />
          <span className="font-medium text-white">Nextmove</span>
          <span>— Candidate Test Build for Product Engineer</span>
        </div>

        <div className="flex items-center gap-6 font-mono">
          <Link href="/today" className="hover:text-white transition-colors">
            Today
          </Link>
          <Link href="/pipeline" className="hover:text-white transition-colors">
            Pipeline
          </Link>
          <Link href="/changes" className="hover:text-white transition-colors">
            Changes
          </Link>
          <Link href="/runs" className="hover:text-white transition-colors">
            Runs
          </Link>
          <Link href="/settings" className="hover:text-white transition-colors">
            Settings
          </Link>
        </div>
      </footer>
    </div>
  );
}
