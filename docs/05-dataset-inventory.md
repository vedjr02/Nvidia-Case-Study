# Dataset inventory

Published datasets in `data/`. Working extracts in `research/raw/` (gitignored).

## `data/financials.json`

- 45 fiscal quarters, FY2016 Q1 – FY2027 Q1
- Fields: revenue, segment markets, gross margin, opex, operating income, net
  income, diluted EPS (as reported), R&D, and where disclosed FCF / inventory /
  supply commitments / networking split
- FY2027 fields: Hyperscale, ACIE, Edge Computing
- Citations per quarter

## `data/stock.json`

- Monthly split-adjusted closes: NVDA, AMD, INTC, GSPC (Jan 2015 – Jun 2026)
- Event reactions including FY2023+ earnings and named shock dates
- Market-cap milestones $1T–$5T (first *close*)
- Current market cap method note (computed from shares × price)

## `data/timeline.json`

- 68 events across product, ecosystem, corporate, competitive, regulatory,
  market-shock
- Rejected-claims array
- Marked events used as chart annotations

## `data/capex.json`

- Hyperscaler annual capex (Microsoft, Alphabet, Amazon, Meta)
- Guidance and caveats (Amazon fulfilment, Alphabet revision)

## `data/competition.json`

- AMD / Intel / Broadcom financials
- Discrete GPU share (JPR) with estimate labels
- AI accelerator share estimates by market definition
- Competitor programme status as of mid-2026
- Rejected claims

## `data/moat.json`

- CUDA developer counts with definition labels (not a continuous series)
- R&D comparisons

## Derived series (`lib/data.ts`)

- Segment mix, rest-of-business bridge for FY2027, YoY growth, indexed prices,
  crossover detection, tooltip context strings
