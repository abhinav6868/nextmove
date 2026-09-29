# Design Doc — Nextmove

> Read this before writing any UI. If a choice isn't covered here, pick the more restrained option.

## 1. Direction in one line

**Quiet, precise, product-first.** Looks like a tool a small team ships and is proud of, not an "AI app". Real data density, hairline borders, one confident accent, and the actual UI as the hero.

## 2. What we're borrowing from the references

**Gumloop (godly.design/website/gumloop)**
- The hero *is* the product screenshot, inside a soft gray rounded frame.
- Big, tight-tracked sans headline. Almost no decoration.
- Primary CTA is a **solid black pill**. Secondary is a white pill with a hairline border.
- Tiny, real UI text (triggers, connectors, adoption rows). Dense but calm.
- Muted gray secondary text. Colour appears only in small marks and logos.

**Nimble (godly.design/website/gitnimble)**
- Centered hero, very large bold headline, one line of gray meta text under the CTAs.
- Colour used as **structure**: thin routed lines with dot nodes (purple, teal, blue, pink, orange).
- Window chrome with macOS traffic lights around the product UI.
- **Command palette** with keyboard key chips as a feature. Monospace for code/diff.
- Light and dark toggle in the header.

**What we take:** product-as-hero, pill buttons, hairline borders, keyboard-first feel, colour as data (not decoration), small-text density.

## 3. Anti-slop rules (hard bans)

The default "AI product" look is what we're avoiding. Do **not**:

1. Use purple-to-blue gradients, glow blobs, or glassmorphism.
2. Use emoji as icons or as bullets.
3. Put icons inside pastel circles in a 3-column feature grid.
4. Ship default shadcn styling untouched. Restyle radius, borders, and colours to the tokens below.
5. Use Inter as the display font. Use the fonts in section 4.
6. Write copy like "Unlock the power of…", "Supercharge…", "Seamlessly…", "Welcome back 👋".
7. Use lorem ipsum, "Company A", "John Doe", or placeholder charts. Every screen shows real seeded data.
8. Centre everything. The app UI is left-aligned and grid-based. Only a marketing hero is centred.
9. Use big drop shadows or heavy rounded corners (max radius 16px on large containers).
10. Use more than **one** accent colour in the UI chrome.
11. Add animation that doesn't communicate state.
12. Show a generic "AI is thinking…" spinner. Show the real pipeline steps instead (section 8).

## 4. Tokens

### Colour (light)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF9` | App background |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-2` | `#F4F4F2` | Frames, table headers, screenshot container |
| `--border` | `#E7E7E4` | Hairlines (1px) |
| `--border-strong` | `#D6D6D2` | Inputs, hover |
| `--text` | `#0B0B0C` | Primary text |
| `--text-muted` | `#6E6E6A` | Secondary text |
| `--text-faint` | `#A1A19C` | Meta, timestamps |
| `--accent` | `#2A5CFF` | Links, focus ring, selected state (Nimble-style blue) |
| `--ink` | `#0B0B0C` | Primary button (solid black pill, Gumloop-style) |

### Colour (dark)

| Token | Value |
|---|---|
| `--bg` | `#0A0A0B` |
| `--surface` | `#111113` |
| `--surface-2` | `#18181B` |
| `--border` | `#26262A` |
| `--text` | `#F5F5F4` |
| `--text-muted` | `#9A9A96` |
| `--accent` | `#5B82FF` |

### Signal colours (from Nimble's route lines, used as data only)

| Signal | Colour |
|---|---|
| Funding | `#14B8A6` teal |
| Hiring | `#2563EB` blue |
| Leadership | `#8B5CF6` purple |
| Product/launch | `#EC4899` pink |
| Expansion/pricing | `#F59E0B` orange |
| Noise | `--text-faint` gray |

Use them as **6px dots, 2px left borders, and timeline nodes**. Never as large fills.

### Confidence

High = solid dot, Medium = half dot, Low = hollow dot. Always paired with text, never colour alone.

### Type

| Role | Font | Notes |
|---|---|---|
| Display + UI | **Geist Sans** | Tight tracking on headlines (`-0.03em`) |
| Data, IDs, diffs, kbd | **Geist Mono** | Numbers in tables use tabular figures |

| Style | Size / line | Weight |
|---|---|---|
| Hero | 56 / 1.02 | 600 |
| H1 | 32 / 1.1 | 600 |
| H2 | 20 / 1.25 | 600 |
| Body | 14 / 1.5 | 400 |
| Small (UI text like the references) | 12 / 1.4 | 400–500 |
| Label | 11 / 1 uppercase, `+0.04em` | 500 |

### Space, radius, elevation

- Base unit 4px. Common steps: 4, 8, 12, 16, 24, 32, 48.
- Radius: buttons `999px` (pill), inputs `8px`, cards `12px`, large frames `16px`.
- Borders: 1px hairline everywhere. Elevation is **border first, shadow second**.
- Shadow (only for overlays and the hero frame): `0 1px 2px rgba(0,0,0,.04), 0 12px 32px -12px rgba(0,0,0,.12)`.

## 5. Components

**Buttons**
- Primary: black pill, white text, 36px high, 14px medium.
- Secondary: white pill, 1px border, black text.
- Ghost: text only, muted, underline on hover.

**Kbd chip:** mono 11px, 1px border, 4px radius, `--surface-2` background. Used for shortcuts everywhere (`⌘K`, `J/K` to move, `E` to open).

**Score badge:** mono number `0–100` and a thin 3px bar underneath. No coloured rings or gauges.

**Signal pill:** 6px coloured dot plus label text, gray border, no fill.

**Table:** 40px rows, sticky header on `--surface-2`, hover row `--surface-2`, numbers right-aligned in mono.

**Card (Today view):** hairline border, 12px radius, left 2px border in the top signal's colour. Contents: rank, company, score, why-now line, person, actions.

**Window frame:** used for screenshots and the empty state. Three small dots (neutral gray, not red/yellow/green), a hairline top bar.

**Command palette (`⌘K`):** Nimble-style. Search field on top, rows with icon, label, and kbd chips at the right. Commands: Add company, Refresh all, Focus mode, Go to company…, Copy draft.

## 6. Screens

### Today (home)
```
Header:  Logo · Today  Pipeline  Changes  Runs  ─────  ⌘K  [Focus: Top 5]  ☾
Sub:     "Tue 29 Sep · 5 to act on · 14 watched · last run 06:02"    (mono, faint)

[ 01 ]  Company name                          Score 82 ▬▬▬▬▬▬▬▬░░
        Raised Series B 6 days ago; hiring 3 ops roles.   ● Funding ● Hiring
        Contact: Head of Ops — why: owns the workflow you'd automate
        [ View draft ]  [ Copy ]  [ Snooze ]                      J/K to move

[ 02 ] …

Dropped today (9)  ▸  each row: name · one-line reason it missed the cut
```
No hero banner and no illustration. The header line is the only "intro".

### Company
Two columns. **Left (main):** summary, signals timeline (vertical line with coloured nodes, like Nimble's routes), intel fields with source/confidence. **Right (sticky):** score breakdown, people, draft with "why this person, why now".

### Pipeline
Dense table. Columns: Company, Stage, Size, Score, Top signal, Last checked, Confidence. Filter chips above.

### Changes
Feed grouped by day. Each row shows a diff: `- old` / `+ new` in mono with green/red tint like Nimble's code chunk. Right side has a **Signal** or **Noise** tag and the reason.

### Runs
Table of automation runs with per-step status. This is proof that the automation is real.

### Landing/README hero (optional, one page)
Gumloop-style: headline, two pills (Open app / View repo), then a **real screenshot of Today** inside a `--surface-2` rounded frame. Add a thin routed-line background like Nimble, drawn in SVG with 5 signal colours at low opacity.

## 7. Content voice

- Short, factual, specific. Numbers and dates over adjectives.
- "Raised ₹__ Series B on 23 Sep" beats "recently secured funding".
- Reasons are one sentence. Say why, not how great.
- Empty states say what to do next: "No companies yet. Paste a URL or press ⌘K."
- Errors are plain: "Couldn't read careers page (blocked). Using search snippets, low confidence."

## 8. Motion and loading

- 120–160ms ease-out for hover and focus. Nothing bouncy.
- Pipeline progress shows the real steps as a checklist: `Fetching site → Searching news → Extracting → Diffing → Scoring → Drafting`. Each step gets a tick or a timer in mono.
- Cards appear in place, with no staggered entrance animations.

## 9. Interaction

- Keyboard first: `⌘K` palette, `J/K` move, `Enter` open, `C` copy draft, `F` toggle Focus mode.
- Focus mode is a header pill toggle (`Top 5`). State persists in `config`.
- Every confidence dot and score opens a popover with its evidence.

## 10. Responsive and accessibility

- Desktop-first, works down to 375px. Cards stack, and the table becomes a card list.
- Contrast AA minimum. Focus ring `2px --accent` with 2px offset.
- Never rely on colour alone. Signals have labels.

## 11. Definition of done (design)

- [ ] Zero items from the section 3 ban list appear.
- [ ] Every screen shows real data.
- [ ] Fonts are Geist Sans and Geist Mono.
- [ ] One accent, black primary pill, hairline borders.
- [ ] `⌘K` works and shows kbd chips.
- [ ] Light and dark both pass.
- [ ] Screenshot of Today would look at home next to the Gumloop and Nimble references.
