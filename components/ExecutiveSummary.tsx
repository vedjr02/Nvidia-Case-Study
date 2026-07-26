import { Reveal } from "@/components/shared/AnimatedContainer";
import { Band, Column, Rule } from "@/components/shared/Section";
import { Kicker } from "@/components/shared/Typography";
import { latestQuarter } from "@/lib/data";
import { percent, usdBillions } from "@/lib/format";

const ROWS: { period: string; heading: string; detail: string }[] = [
  {
    period: "2006 – 2016",
    heading: "The platform is built before the market exists",
    detail:
      "CUDA makes the GPU programmable for general work. NVIDIA carries the cost of the software layer for a decade, spending over a quarter of revenue on R&D while data centre remains under seven per cent of the business.",
  },
  {
    period: "2017 – 2022",
    heading: "The mix inverts, largely unnoticed",
    detail:
      "Cryptocurrency demand obscures the underlying shift and then collapses. Mellanox is acquired in 2020, adding the networking half of the rack. Data Center passes Gaming permanently in May 2022 — six months before ChatGPT.",
  },
  {
    period: "2022 – 2024",
    heading: "Demand arrives all at once, and price rises with it",
    detail:
      "The May 2023 guidance repriced the sector in a session. Data Center revenue grows 4.3× in four quarters while gross margin expands 11.4 points — the signature of a supplier with no substitute.",
  },
  {
    period: "2024 – 2026",
    heading: "The company becomes a dependency of an industry",
    detail:
      "Blackwell and Rubin ramp against hyperscaler capital budgets that reached $358bn in 2025. NVIDIA passes $5tn. China falls to around nine per cent of revenue, and strong results stop moving the share price.",
  },
];

/**
 * The one-page version, placed after the argument rather than before it. A
 * reader who has read the chapters gets a recapitulation; a reader who scrolled
 * gets the whole case.
 */
export function ExecutiveSummary() {
  return (
    <Band as="section" tone="pitch" className="py-[14vh]" id="summary">
      <Column width="wide">
        <Reveal>
          <Kicker tone="pitch">In summary</Kicker>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-[22ch] text-balance font-serif text-[clamp(1.875rem,4vw,3rem)] font-normal leading-[1.06] tracking-[-0.024em] text-ink-inverse">
            Four decisions, twenty years, and one very fast three years
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[54ch] font-serif text-[1.125rem] leading-[1.6] text-ink-inverse-muted">
            NVIDIA reached {usdBillions(latestQuarter.revenue, 1)} of quarterly
            revenue at a {percent(latestQuarter.grossMarginPct ?? 0)} gross
            margin because it spent the previous fifteen years making a
            general-purpose computing platform out of a graphics part, and
            because the workload that eventually needed that platform arrived
            with no viable alternative supplier.
          </p>
        </Reveal>

        <div className="mt-16">
          {ROWS.map((row, index) => (
            <Reveal key={row.period} delay={index * 0.05}>
              <div className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-t-rule-inverse py-8 sm:grid-cols-[9rem_1fr] lg:grid-cols-[10rem_22rem_1fr]">
                <p className="tabular font-sans text-[0.75rem] uppercase tracking-[0.14em] text-accent">
                  {row.period}
                </p>
                <h3 className="text-balance font-serif text-[1.1875rem] font-semibold leading-[1.3] text-ink-inverse">
                  {row.heading}
                </h3>
                <p className="max-w-[52ch] font-sans text-[0.9375rem] leading-[1.65] text-ink-inverse-muted">
                  {row.detail}
                </p>
              </div>
            </Reveal>
          ))}
          <Rule tone="pitch" />
        </div>
      </Column>
    </Band>
  );
}
