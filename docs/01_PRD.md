# PRD — Nextmove (working title)

> A daily sales-intelligence brief. It tells one person which companies to act on today, who to contact, and what to say, and shows its reasoning.

## 1. Context

This is the build for the Product Engineer candidate test. The brief gives no spec on purpose. The nine tasks are nine views of **one product**. Every assumption below is written down so it can be defended in the README.

## 2. Assumptions (editable, but pick and commit)

| # | Assumption | Why |
|---|---|---|
| A1 | **The user is a solo seller of AI automation services** to Indian B2B SaaS startups (Series A–B, 20–200 people, Bengaluru first). | The test needs an ICP to score against. This one matches the role's own world. |
| A2 | Only **public data** is used: company site, careers page, news, blog, public filings/directories. | Task 1 says public info. |
| A3 | **Timing outweighs fit** in scoring. | The product answers "what should I act on *today*". |
| A4 | Data is stored as **dated snapshots**, never overwritten. | Trigger detection (task 6) needs history. |
| A5 | Every claim carries a **source and confidence**. | Task 7. |
| A6 | Output size (Top N) is **config**, not code. | Task 9 will change it. |

## 3. Problem

Seller research is slow and scattered. Tabs, LinkedIn, news, guesswork. Result: they chase the wrong companies, at the wrong time, with generic messages.

## 4. Goal and non-goals

**Goal:** open the app, see 5–10 companies, each with *why now / who / what to say*, and trust it enough to act in under 5 minutes.

**Non-goals (say these out loud in the README):**
- No sending emails. Drafts only.
- No scraping behind logins, no LinkedIn scraping.
- No multi-user auth or billing.
- No CRM sync.

## 5. Core loop

```
Company URL → Research (search + scrape) → LLM extraction (JSON) → Snapshot saved
→ Diff vs previous snapshot → Signals classified → Score → People + Outreach → Dashboard
```

Triggered by: a webhook (add a company), a daily schedule (n8n), or a manual "Refresh" button.

## 6. Features mapped to the 9 tasks

| Task | Feature | Priority |
|---|---|---|
| 1. Company intelligence | **Company page**: what they do, stage, size, tech signals, recent news, likely pains, "what to know before approaching". | P0 |
| 2. Opportunity scoring | **Ranked list** of 15–20 companies with a score breakdown and one-line "why". | P0 |
| 3. Right person | **People panel**: 2–3 personas per company with role, reason, and where the name came from. | P0 |
| 4. Outreach | **Draft panel**: 3–4 sentences, one specific trigger, one clear ask, plus a "why this person, why now" note. | P0 |
| 5. Automation | **n8n workflow**: webhook → research → AI → DB. Plus a run log in the UI. | P0 |
| 6. Trigger detection | **Change feed**: snapshot A vs B, each change tagged Signal or Noise, with a reason. | P0 |
| 7. Data reliability | **Conflict display**: fields with disagreeing sources show both, the chosen value, and confidence. | P0 |
| 8. Dashboard | **Today view**. | P0 |
| 9. Requirement change | **Focus mode**: Top 5 only, plus "Dropped today" list with reasons. | P0 (build the switch now) |
| — | Demo mode: seed two time points for every company so diffs work on day one. | P1 |

## 7. Scoring model (explainable, no black box)

Each sub-score is 0–100. The LLM proposes evidence, and **code** does the math.

```
base  = 0.35·Timing + 0.35·Fit + 0.30·Reach
total = base × (0.6 + 0.4·Confidence)      // Confidence 0–1
```

| Sub-score | Measures | Evidence examples |
|---|---|---|
| **Fit** | Match to the ICP in A1 | Industry, size band, hiring for ops/AI roles, tech stack, geography |
| **Timing** | A fresh, relevant trigger | Funding in the last 90d, hiring spike, new exec, product launch, expansion |
| **Reach** | Can we identify a real decision-maker? | Named founder/head-of, public contact path |
| **Confidence** | Source quality and agreement | See section 8 |

Every score row stores a `reasoning` string that is shown in the UI. If a number can't be explained in one sentence, it doesn't ship.

## 8. Data reliability rules (task 7)

**Source tiers**

| Tier | Source | Weight |
|---|---|---|
| 1 | Company's own site, official filings | 1.0 |
| 2 | Reputable news, official press | 0.8 |
| 3 | Directories/databases (Crunchbase-style, job boards) | 0.6 |
| 4 | Social posts, forums, scraped guesses | 0.3 |

**Conflict rule:** prefer the higher tier, then the newer date. If two tier-1/2 sources disagree, show both and mark `needs_review`.

**Display pattern:**
`Employees: 200 · Tier 2 · Sep 2026 · Medium confidence` with an expandable "Other values: 500 (press release, 2024, superseded)".

## 9. Signals (task 6)

| Signal (worth acting) | Noise (ignore) |
|---|---|
| Funding round | Copy tweaks |
| Exec hire or exit | Routine blog posts |
| Hiring surge in relevant roles | Minor redesign |
| New product/launch | Footer or legal edits |
| Pricing or packaging change | Social follower count |
| Expansion (new office, market) | Reworded About page |

The LLM classifies each diff item into `{type, is_meaningful, reason, urgency}`. Unclear items default to Noise.

## 10. Data model

```sql
companies(id, name, url, industry, size_band, stage, created_at)
snapshots(id, company_id, captured_at, raw jsonb, extracted jsonb, source_map jsonb)
signals(id, company_id, snapshot_from, snapshot_to, type, description,
        is_meaningful bool, reason, urgency, detected_at)
people(id, company_id, name, role, persona, persona_reason, source_url, confidence)
scores(id, company_id, computed_at, fit, timing, reach, confidence, total, reasoning)
outreach(id, company_id, person_id, trigger_signal_id, draft, why_note, created_at)
runs(id, company_id, started_at, finished_at, status, log jsonb)
config(key, value)   -- top_n, weights, icp
```

## 11. Screens

1. **Today**: the hero. Ranked cards (default Top 10, Focus mode Top 5).
2. **Company**: intel, score breakdown, signals timeline, people, draft.
3. **Pipeline**: all companies in a dense table, sortable, with filters.
4. **Changes**: feed of signals vs noise across all companies.
5. **Runs / Automation**: log of n8n runs and status.
6. **Settings**: ICP, weights, Top N.

Visual direction lives in `02_DESIGN.md`.

## 12. Requirement change plan (task 9)

The change: *"I only want the 5 things worth acting on today."*

- `config.top_n = 5` and a UI toggle. The query is `ORDER BY total DESC LIMIT top_n`.
- A **Dropped today** section lists rank 6+ with the single reason each missed the cut. Cutting well is the product thinking.
- Ties break by urgency, then confidence.
- Each of the 5 cards shows: company, why now, who, draft, one action button.

## 13. Success criteria

- Deployed live URL. No localhost demo.
- One company goes from URL to a full card in under 2 minutes, automated.
- 15+ companies seeded with real data and two time points.
- Flipping to Top 5 takes one click and no redeploy.
- README with assumptions, tradeoffs, limits, and "what I'd do next".

## 14. Risks

| Risk | Handling |
|---|---|
| Scrapes fail or are blocked | Fall back to search snippets, mark low confidence, and show this honestly |
| LLM hallucinates facts | Extraction must cite a source URL per field, and fields without one are dropped |
| Generic outreach | Draft requires a trigger and a named person, or it doesn't generate |
| Scope creep | P0 list above is the whole scope |

## 15. Build order

1. Schema, one company end to end (tasks 1, 5)
2. Seed 15 companies, scoring, reasoning (2, 7)
3. People and outreach (3, 4)
4. Snapshots, diffs, signals (6)
5. Today view, Focus mode (8, 9)
6. Polish, README, 2–3 min demo video

## 16. Demo script (for the video)

1. Paste a new URL and watch the pipeline run.
2. Show Today, then open the top card and explain the score.
3. Show a conflict where sources disagree.
4. Show a signal vs noise diff.
5. Click Focus mode and show the Top 5 and Dropped list.
