# Tech Stack & Build Instructions — Nextmove

> For Antigravity (or any AI coding agent). Read `01_PRD.md` and `02_DESIGN.md` first. This file says *how* to build, and the other two say *what* and *how it looks*.

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Full-stack in one repo, deploys to Vercel |
| Styling | **Tailwind CSS** + CSS variables from `02_DESIGN.md` | Tokens map 1:1 |
| Components | **shadcn/ui primitives, restyled** (Radix underneath) | Accessible, but must be re-skinned to our tokens |
| Fonts | **Geist Sans + Geist Mono** (`geist` npm package) | Per design doc |
| Icons | **Lucide**, 1.5px stroke, 16px, never in coloured circles | |
| DB | **Postgres on Supabase** | |
| ORM | **Drizzle** | Typed, simple migrations |
| LLM | **Claude API** (structured JSON output, validated with **Zod**) | |
| Research | **Tavily** (search) + **Firecrawl** or **Jina Reader** (page to markdown) | Pick one scraper, keep a fallback |
| Automation | **n8n** (cloud or self-hosted) | Webhook + schedule trigger |
| Command palette | **cmdk** | |
| Charts | Minimal inline SVG. Avoid chart libs unless needed | |
| Hosting | **Vercel** (app), **Supabase** (DB), **n8n cloud** | |

## 2. Repo structure

```
/app
  /(app)/today/page.tsx
  /(app)/company/[id]/page.tsx
  /(app)/pipeline/page.tsx
  /(app)/changes/page.tsx
  /(app)/runs/page.tsx
  /(app)/settings/page.tsx
  /api
    /ingest/route.ts        # webhook: { url } -> starts pipeline
    /refresh/route.ts       # re-run one/all companies
    /webhooks/n8n/route.ts  # n8n callback, verifies secret
/components
  /ui                       # restyled primitives
  /today  /company  /shared
/lib
  /pipeline
    research.ts             # search + scrape, returns sourced docs
    extract.ts              # LLM -> CompanyIntel (Zod)
    diff.ts                 # snapshot A vs B -> changes[]
    classify.ts             # LLM -> signal | noise + reason
    score.ts                # pure function, no LLM math
    people.ts               # personas + reasoning
    outreach.ts             # draft + why_note
    reliability.ts          # source tiers + conflict resolution
  /db  schema.ts  client.ts  queries.ts
  /llm  claude.ts  prompts/*.ts  schemas.ts
  config.ts                 # top_n, weights, ICP
/drizzle                    # migrations
/scripts  seed.ts
/docs     01_PRD.md  02_DESIGN.md  03_TECH_STACK.md
/n8n      workflow.json     # exported workflow, committed
README.md
```

## 3. Environment variables

```
DATABASE_URL=
ANTHROPIC_API_KEY=
TAVILY_API_KEY=
FIRECRAWL_API_KEY=          # or JINA_API_KEY
N8N_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```
Never commit `.env`. Provide `.env.example`.

## 4. Pipeline (per company)

1. **Research:** search `"<company> funding"`, `"<company> hiring"`, `"<company> news"`, and scrape site, `/about`, `/careers`, `/blog`, `/pricing`. Return `{url, tier, fetched_at, text}[]`.
2. **Extract:** Claude turns docs into `CompanyIntel` JSON. **Every field must include `source_url`.** Fields without a source are dropped.
3. **Reliability:** resolve conflicts with the tier and date rules in the PRD, and emit `{value, confidence, alternatives[]}`.
4. **Snapshot:** insert a row into `snapshots` (never update).
5. **Diff:** compare against the previous snapshot and list field-level changes.
6. **Classify:** Claude labels each change `{type, is_meaningful, reason, urgency}`. Default to Noise when unsure.
7. **Score:** `score.ts` computes the formula from the PRD. Claude supplies evidence and sub-score suggestions, and code does the maths.
8. **People:** personas by company size, with `persona_reason` and `source_url`. Don't invent names. If no named person is found, output the role only and set low confidence.
9. **Outreach:** generate only if there is a meaningful signal and a target person or role.
10. **Log:** write step status to `runs` so the Runs page is real.

Each step is a pure function with typed input and output so it can be tested and called from n8n or the UI.

## 5. LLM rules

- Use structured output. Validate with Zod. On failure, retry once with the validation error, then mark the run step `failed`.
- Temperature low (0–0.3) for extraction and classification, slightly higher for outreach.
- Prompts live in `/lib/llm/prompts/*.ts` as versioned constants.
- **System-prompt guardrails for outreach:**
  - 3–4 sentences.
  - First sentence references one specific, dated trigger.
  - One clear ask, low friction.
  - Banned openers: "I hope this finds you well", "I came across", "I'm reaching out".
  - Banned words: "leverage", "synergy", "cutting-edge", "game-changing".
  - Output includes `why_note`: why this person, why now, in one line.

## 6. n8n workflow

```
[Schedule 06:00 IST] ─┐
                      ├─> [Get companies (HTTP -> /api/companies)]
[Webhook: add URL] ───┘        │
                               ▼
                     [Loop] -> [HTTP POST /api/refresh?id=]
                               │
                               ▼
                   [On finish: HTTP -> /api/webhooks/n8n (secret header)]
                               │
                               ▼
                  [Optional: Slack/Email "Today's Top 5" digest]
```
Export the workflow JSON into `/n8n/workflow.json`. The Runs page must show what n8n triggered.

## 7. Database

Schema is in the PRD section 10. Use Drizzle migrations. Add indexes on `snapshots(company_id, captured_at desc)` and `scores(company_id, computed_at desc)`. Use a view or query `latest_scores` for the Today page.

**Top N is a query parameter:**
```sql
SELECT * FROM latest_scores ORDER BY total DESC, urgency DESC, confidence DESC LIMIT :top_n;
```

## 8. Seed data

- 15–20 **real** companies matching the ICP in the PRD, gathered by running the actual pipeline.
- For the diff demo: run once, store a snapshot, then either re-run later or insert a second, dated snapshot that is clearly labelled as seeded in the README. Be transparent about it.
- Do not fabricate facts about real companies. If data is missing, show it as missing.

## 9. Quality bar

- TypeScript strict. No `any` in `/lib/pipeline`.
- Unit tests for `score.ts`, `diff.ts`, and `reliability.ts` (pure functions, quick wins).
- Lint and format on commit.
- Every network call has a timeout and error state in the UI.
- Accessible focus states and keyboard nav (see design doc).

## 10. Deployment

1. Push to GitHub (public repo).
2. Create the Supabase project, run migrations, seed.
3. Deploy to Vercel with the env vars.
4. Point n8n at the deployed URLs.
5. Verify: add a company from the live URL and confirm a full card appears.

## 11. Antigravity working instructions

Paste this into your rules or first message:

```
You are building "Nextmove" as specified in /docs/01_PRD.md, /docs/02_DESIGN.md and /docs/03_TECH_STACK.md.

Rules:
1. Follow 02_DESIGN.md exactly. The section 3 ban list is non-negotiable. Do not produce a generic AI-dashboard look.
2. Use Geist Sans + Geist Mono, the tokens in section 4, black pill primary buttons, hairline borders, one accent.
3. Never use placeholder data in any screen. If real data isn't available yet, build the pipeline first and seed real data.
4. Build in this order: schema -> one-company pipeline -> scoring -> people/outreach -> snapshots/diff -> Today view -> Focus mode (Top N) -> polish.
5. Keep pipeline steps as pure, typed functions in /lib/pipeline.
6. After each milestone, run the app, open it in the browser, take a screenshot, and compare it against the design doc. Fix deviations before moving on.
7. Ask me only when a decision is blocking. Otherwise make an assumption, record it in /docs/ASSUMPTIONS.md, and continue.
8. Keep a running /docs/DECISIONS.md with one line per tradeoff (what, why, what was cut).
```

**Suggested first prompt:**
```
Read /docs. Scaffold the Next.js + TS + Tailwind + Drizzle project, set up Geist fonts and the design tokens as CSS variables (light + dark), create the DB schema from the PRD, and build the restyled Button, Kbd, ScoreBadge, SignalPill and Card components. Then render a static Today page shell using a hardcoded layout only for spacing, and screenshot it for review. Do not add sample company data.
```
(Note: the shell is for layout check only. Replace it with real data before any milestone is considered done.)

## 12. README checklist (this is judged)

- [ ] What it is and a live link
- [ ] Assumptions (A1–A6 and any new ones)
- [ ] Architecture diagram (one image)
- [ ] How each of the 9 tasks is answered, with screenshots
- [ ] Scoring model and why timing is weighted highest
- [ ] Reliability rules and an example conflict
- [ ] Limits and honest failures (blocked scrapes, seeded snapshots)
- [ ] What I'd do next
- [ ] How AI tools were used (Antigravity, Claude)
