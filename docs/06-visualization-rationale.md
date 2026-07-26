# Visualization rationale

Every chart answers one business question. If it cannot, it is cut.

## Hero curve

**Question.** What does twenty years of equity value look like when the company
becomes infrastructure?

**Why this form.** A single continuous price series, lightly annotated at
valuation milestones, is the fastest way to establish stakes without a dashboard
of cards. Linear scale keeps late-period growth honest; the mid-2026 drawdown is
left in.

## Segment crossover (Chapter 2)

**Question.** When did Data Center permanently overtake the rest of the business?

**Why this form.** Dual-line (or stacked-to-lines) time series with the FY2021
false start visible. A single “crossed here” annotation would be false. The
FY2027 reporting change is an annotation on a continuous bridged series, not a
break in the data.

## Margin chart

**Question.** Did profitability improve with the mix shift?

**Why this form.** Dual series of gross and operating margin. Absolute dollars
would hide the quality-of-earnings story.

## R&D and CUDA datapoints (Chapter 1)

**Question.** Did investment precede revenue?

**Why this form.** R&D as a continuous series; CUDA developer counts as discrete
labelled points with definition text — they are three different metrics and must
not be drawn as one growth curve.

## Stock / reaction charts (Chapter 3)

**Question.** How did investors reprice the thesis around key events?

**Why this form.** Indexed comparative performance for the long view; event
reaction bars for earnings vs shocks. DeepSeek uses `reactionPct` (intraday
crash), not next-day rebound.

## Capex chart

**Question.** Did customer capital budgets accelerate ahead of NVIDIA’s revenue?

**Why this form.** Small-multiples or grouped bars by hyperscaler, with Amazon’s
fulfilment caveat on the exhibit itself.

## Timeline swimlanes (Event record)

**Question.** Did product strategy lead ecosystem demand?

**Why this form.** Category lanes make sequencing legible. Empty early decades
are the point of Chapter 1, not wasted space.

## What was not charted

- Continuous diluted EPS (three share bases as reported).
- Supply commitments as a trend (scope changed three times).
- A single “AI accelerator market share” number without a denominator.
- Intel data-centre revenue as one 2015–2025 line (three incompatible bases).
