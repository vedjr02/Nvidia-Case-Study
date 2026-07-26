# Architecture

## Stack

| Concern | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js 16.2 (App Router) | The brief specified Next.js 14; 16.2 uses the identical App Router / Server Component model but is the actively supported line. No architectural difference to the component design below. |
| Language | TypeScript 5, `strict` | The datasets are the product. Typing them catches a mislabelled series at compile time rather than in a published chart. |
| Styling | Tailwind CSS 4 | CSS-first `@theme` tokens mean the design system lives in one file and is readable as a design document, not scattered across a JS config. |
| Charts | Recharts 3.10 | SVG output, composable primitives, and — critically — it lets us draw custom reference lines, annotations and axes rather than accepting dashboard defaults. |
| Motion | Motion 12.4 (`motion`, the successor package to `framer-motion`) | Same API as `framer-motion`; `framer-motion` is now a deprecated alias. First-class `useReducedMotion`. |
| Icons | Lucide | Used sparingly — only where an icon genuinely disambiguates. |

## Rendering strategy

The story is static. Nothing is fetched at runtime, nothing is personalised, and
the datasets are frozen at publication. Consequently:

- **Every narrative component is a Server Component.** Prose, headings, layout
  and source lines ship as HTML with zero client JavaScript.
- **Only interactivity is a Client Component.** That means charts (Recharts
  needs the DOM), scroll reveals, the synchronised timeline scrubber, and the
  animated figures. Each is marked `"use client"` at the leaf, so the boundary
  sits as low in the tree as possible.
- **Charts are lazily imported.** Each chart is loaded via
  `next/dynamic` from a Server Component parent, so Recharts is not in the
  initial bundle. A skeleton with the correct aspect ratio holds the space,
  which also prevents layout shift.

## Data flow

```
data/*.json          Frozen, cited datasets. The single source of truth.
   │
   ├─ lib/data.ts    Typed accessors + derived series (mix %, YoY, indexing to 100).
   │                 Derivations live here, never inside a chart component, so
   │                 the same computation cannot drift between two exhibits.
   │
   └─ components/charts/*   Presentation only. Receives typed props, renders SVG.
```

Derived values (revenue mix, year-on-year growth, crossover dates, indexed
performance) are computed once in `lib/data.ts` at module scope. They are pure
functions of the frozen JSON, so they are evaluated at build time and cost
nothing at runtime.

## Folder structure

```
app/
  layout.tsx                 Fonts, metadata, skip link
  page.tsx                   Composes the chapters in reading order
  globals.css                Design tokens (@theme) and base typography

components/
  Hero.tsx                   Title, standfirst, the single orienting figure
  Intro.tsx                  The thesis, stated up front
  IndustryContext.tsx        The market NVIDIA was operating in before AI
  TurningPointOne.tsx        Chapter 1
  TurningPointTwo.tsx        Chapter 2
  TurningPointThree.tsx      Chapter 3
  TurningPointFour.tsx       Chapter 4
  KeyTakeaways.tsx           Transferable lessons
  ExecutiveSummary.tsx       The one-page version, for the reader who scrolled
  Sources.tsx                Full citation list
  ReadingProgress.tsx        Thin progress rule + chapter marker

  charts/
    RevenueChart.tsx         Quarterly revenue, total
    SegmentChart.tsx         Revenue mix, stacked — the crossover exhibit
    MarginChart.tsx          Gross and operating margin
    StockChart.tsx           Indexed price vs comparators, annotated
    TimelineChart.tsx        Event timeline bound to the scroll position
    CompetitorTimeline.tsx   Competitive response, as a Gantt-style exhibit
    CapexChart.tsx           Hyperscaler capital expenditure — the demand side
    ConcentrationChart.tsx   Customer concentration — the risk side

  shared/
    Typography.tsx           Kicker, DisplayTitle, ChapterTitle, Lede, Prose,
                             PullQuote, Caption, MarginNote
    Section.tsx              Band (full-bleed tone), Column (measure), Stack, Rule
    ChartWrapper.tsx         Exhibit frame: question, chart, reading, source,
                             accessible data table
    AnimatedContainer.tsx    Reveal, RevealGroup, StickyExhibit
    AnimatedNumber.tsx       Count-up figures and StatBlock
    ChartFrame.tsx           Responsive container, shared axis/tooltip config

lib/
  data.ts                    Typed accessors and derived series
  format.ts                  Currency, percentage and date formatting
  utils.ts                   cn()
  sources.ts                 Citation registry, keyed and reused

data/
  financials.json            Quarterly income statement + segments
  stock.json                 Monthly prices, event reactions, valuation milestones
  timeline.json              Sourced event timeline
  competitive.json           Market share, competitor programmes, hyperscaler capex
  sources.json               Master citation list

docs/                        Phase 1–3 deliverables
```

## Why chapters are components rather than routes

The piece is one continuous scroll. Splitting it across routes would break the
reading experience, the scroll-linked timeline and the progress indicator. A
single route composed of chapter components keeps the narrative continuous
while keeping each chapter independently editable and reviewable — the
modularity requirement is met at the component boundary, not the route
boundary.

## Accessibility contract

Every chart component must supply:

1. A `question` — which becomes the exhibit's `<h3>`.
2. A `reading` — the answer in prose, so the insight does not depend on seeing
   the chart.
3. A `dataTable` — the underlying series as a real `<table>`, in a `<details>`.
4. `role="img"` plus an `aria-label` on the SVG container summarising the shape
   of the data.

Colour never encodes a distinction on its own: series are also separated by
position, direct labelling, or line style.
