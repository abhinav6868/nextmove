# Nextmove — Decisions & Tradeoffs Log

Running log of technical and architectural decisions, why they were made, and what was cut.

| Decision | Why | What was cut / avoided | Date |
|---|---|---|---|
| **PostgreSQL + Drizzle ORM** | Schema matches PRD section 10; provides type-safe queries, fast migrations, and 100% compatibility with Supabase. Local postgres runs on port 5432. | Cut SQLite/mock DBs to prevent SQL dialect mismatches between local and Supabase. | 2026-09-29 |
| **Tailwind v4 with strict CSS Variables** | Implements exact tokens from `02_DESIGN.md` (`--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--accent`, `--ink`, signal colors). Supports native light/dark toggle. | Cut generic Tailwind utilities (e.g. `bg-blue-500`, `rounded-full` pastel icon blobs) and banned purple gradients. | 2026-09-29 |
| **Geist Sans & Geist Mono via next/font** | Direct compliance with Design Doc typography: `-0.03em` tight tracking on headings, tabular numbers on tables. | Cut Inter, Roboto, and default browser sans-serifs. | 2026-09-29 |
| **Pure functional pipeline stages** | Research, extraction, reliability conflict resolution, diffing, classification, scoring, people, and outreach are isolated pure functions in `/lib/pipeline`. | Cut monolithic pipeline scripts to enable standalone unit testing and n8n webhook invocation. | 2026-09-29 |
| **Code-driven scoring (No LLM math)** | Scoring formula `base = 0.35·Timing + 0.35·Fit + 0.30·Reach; total = base × (0.6 + 0.4·Confidence)` is computed deterministically in TypeScript. | Cut black-box LLM numerical generation to guarantee explainability and reproducibility. | 2026-09-29 |
| **Append-only snapshots** | Snapshots are never overwritten; every ingestion creates a dated snapshot row. | Cut mutable company records to ensure historical trigger diffing works across time. | 2026-09-29 |
| **Strict Anti-Slop outreach guardrails** | Outreach generator enforces 3-sentence limits, anchor to a dated trigger, and hard bans on buzzwords ("synergy", "game-changing") and generic openers ("I hope this finds you well"). | Cut long template emails and automated email sending (drafts only per PRD). | 2026-09-29 |
| **Focus mode with "Dropped today" rationale** | Allows solo seller to view Top 5 immediate actions while giving explicit 1-line reasons for rank 6+ companies that missed the cut. | Cut arbitrary cutoffs without rationale. | 2026-09-29 |
| **Dual-engine extraction & evaluation fallback** | Live crawler fetches public domains with cheerio and parses real data. When LLM keys are present, structured extraction runs via Gemini/Claude with Zod schema validation; when absent, deterministic parser processes the seeded evaluation dataset without stalling. | Cut mock/lorem ipsum placeholder data completely while keeping live vs seeded evaluation transparent. | 2026-09-29 |
