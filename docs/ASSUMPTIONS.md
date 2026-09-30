# Nextmove — Assumptions Log

All assumptions made during product build, defense, and trade-offs.

| ID | Assumption | Rationale / Detail | Date |
|---|---|---|---|
| A1 | **Target Persona**: Solo seller of AI automation services to Indian B2B SaaS startups (Series A–B, 20–200 people, Bengaluru first). | Per PRD section 2. Grounds all Fit scoring and outreach tone. | 2026-09-29 |
| A2 | **Public data only**: Company sites, careers, blogs, public filings/directories, and search snippets. | Compliance with public information mandate. No logins or scraping behind paywalls. | 2026-09-29 |
| A3 | **Timing outweighs Fit in scoring**: Fresh signals (funding in last 90d, hiring spike, exec change, product launch) give higher immediate actionability than static fit. | Formula: `base = 0.35 * Timing + 0.35 * Fit + 0.30 * Reach; total = base * (0.6 + 0.4 * Confidence)`. | 2026-09-29 |
| A4 | **Snapshots are append-only**: Data is stored as dated snapshots and never overwritten. | Diffing and trigger classification require historical comparison between snapshot $A$ and $B$. | 2026-09-29 |
| A5 | **Source attribution & confidence**: Every extracted claim stores a source URL and confidence level. Disagreements between sources are highlighted as conflicts. | Required by Task 7 reliability rules. | 2026-09-29 |
| A6 | **Output size is dynamic config**: Focus mode (Top 5) and default (Top 10) are stored in `config` table and toggled client-side without redeployment. | Allows user to focus on 5 highest-urgency targets with "Dropped today" explaining the rest. | 2026-09-29 |
| A7 | **Database connectivity**: Local PostgreSQL `postgresql://localhost:5432/nextmove` is used for development, seamlessly transitioning to Supabase Postgres via `DATABASE_URL`. | Avoids mock/in-memory DBs; runs identical SQL and Drizzle migrations locally and in production. | 2026-09-29 |
| A8 | **Dual-Engine Pipeline**: Pipeline executes live web scrapes + search queries with robust parsing. If LLM keys are configured, it uses Google Gemini / Claude for structured JSON extraction & classification with Zod validation. If unconfigured, a deterministic rule-based extractor provides immediate processing over the seeded evaluation dataset without stalling. | Ensures zero placeholder data and uninterrupted pipeline execution while keeping live vs seeded evaluation transparent. | 2026-09-29 |
