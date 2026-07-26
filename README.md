# How NVIDIA Became the Backbone of the AI Economy

An interactive business case study — editorial scroll story, not a dashboard —
exploring the strategic decisions, financial performance and industry shifts that
turned NVIDIA from a gaming GPU manufacturer into the world's AI infrastructure
layer.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS 4 · Motion · Recharts · Lucide

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
app/                 Route and design tokens
components/          Chapters, charts, shared editorial primitives
data/                Verified, cited datasets (source of truth)
docs/                Architecture, design system, wireframes, research notes
lib/                 Data accessors, formatting, story clock
research/raw/        Working research extracts (gitignored)
```

## Data integrity

Every number on the page comes from a primary source (SEC filings, NVIDIA CFO
commentary, Yahoo Finance, named research firms). Claims that could not be
verified are listed in Sources and under `docs/research/rejected/`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local preview |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## License

Private case-study project.
