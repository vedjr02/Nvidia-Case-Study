import { Reveal, RevealGroup, RevealItem } from "@/components/shared/AnimatedContainer";
import { StatBlock } from "@/components/shared/AnimatedNumber";
import { Band, Column, Rule } from "@/components/shared/Section";
import { Kicker, Lede, Prose } from "@/components/shared/Typography";
import { latestQuarter } from "@/lib/data";
import { usdBillions } from "@/lib/format";

/**
 * The thesis, stated before the evidence.
 *
 * A reader who stops here should still leave with the argument. Everything
 * after this section is the case for it.
 */
export function Intro() {
  return (
    <Band as="section" className="py-[14vh]">
      <Column>
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <Kicker>The argument</Kicker>
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
              Analysis by Vedant Ambre
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Lede className="mt-6">
            Between fiscal 2016 and fiscal 2026, NVIDIA&rsquo;s annual revenue
            grew from {usdBillions(5010, 1)} to {usdBillions(215938, 1)}. The
            interesting question is not how fast that happened. It is why the
            company was in a position to capture it at all when it did.
          </Lede>
        </Reveal>

        <Reveal delay={0.1}>
          <Prose className="mt-8">
            The conventional account credits ChatGPT. It is the wrong causal
            story. By the time OpenAI released ChatGPT in November 2022,
            NVIDIA&rsquo;s data-centre business had already overtaken gaming
            permanently, its accelerators were already the default hardware for
            training large models, and the software layer that made them
            difficult to replace was already sixteen years old.
          </Prose>
        </Reveal>

        <Reveal delay={0.15}>
          <Prose className="mt-6">
            What follows traces four decisions and the financial evidence for
            each. Three of them were made when the market they addressed did not
            yet exist, and they were expensive at the time. That is the pattern
            worth extracting — not the growth rate, which is not repeatable, but
            the sequence of choices that made the company the only available
            supplier at the moment demand arrived.
          </Prose>
        </Reveal>
      </Column>

      <Column width="wide" className="mt-20">
        <Rule />
        <RevealGroup className="grid grid-cols-1 gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <RevealItem>
            <StatBlock
              value={43.1}
              format={{ kind: "multiple" }}
              label="Revenue growth"
              context="Fiscal 2016 to fiscal 2026, from $5.0bn to $215.9bn."
            />
          </RevealItem>
          <RevealItem>
            <StatBlock
              value={latestQuarter.dataCenterSharePct ?? 0}
              format={{ kind: "percent" }}
              label="From data centre"
              context="Share of revenue in the quarter ended April 2026. It was 6.8% in fiscal 2016."
            />
          </RevealItem>
          <RevealItem>
            <StatBlock
              value={74.9}
              format={{ kind: "percent" }}
              label="Gross margin"
              context="Up from the mid-fifties for most of the previous decade."
            />
          </RevealItem>
          <RevealItem>
            <StatBlock
              value={5.0}
              format={{ kind: "usdTrillions" }}
              label="Market value"
              context="Approximate, as of 24 July 2026. First company to pass $5tn, in October 2025."
            />
          </RevealItem>
        </RevealGroup>
      </Column>
    </Band>
  );
}
