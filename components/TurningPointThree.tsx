import { ChapterOpener } from "@/components/ChapterOpener";
import { MarginChart } from "@/components/charts/MarginChart";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/AnimatedContainer";
import { StatBlock } from "@/components/shared/AnimatedNumber";
import { ChartWrapper } from "@/components/shared/ChartWrapper";
import { Band, Column, Rule } from "@/components/shared/Section";
import { Kicker, Prose, PullQuote } from "@/components/shared/Typography";
import { percent, usdAuto } from "@/lib/format";

const SOURCES = [
  {
    label: "NVIDIA CFO Commentary, fiscal 2016–2027",
    href: "https://investor.nvidia.com/financial-info/quarterly-results/",
  },
];

export function TurningPointThree() {
  return (
    <>
      <ChapterOpener
        id="chapter-3"
        number="Chapter Three"
        title="The Demand Shock"
        standfirst="ChatGPT did not change what NVIDIA was. It changed how many organisations concluded, simultaneously, that they needed to buy what NVIDIA already sold."
        period="2022 – 2024"
        beatDate="2022-11-30"
      />

      <Band as="section" labelledBy="chapter-3-title" className="py-16 sm:py-24">
        <Column>
          <Reveal>
            <Kicker>What happened</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              On 24 May 2023, NVIDIA guided to roughly $11bn of revenue for the
              following quarter. Analysts had expected around $7bn. The shares
              rose 24.4 per cent the next session. It remains the clearest
              example of a company telling the market that its own model of the
              business was wrong by half.
            </Prose>
          </Reveal>
          <Reveal delay={0.1}>
            <Prose className="mt-6">
              What followed was not a gradual acceleration. Data Center revenue
              went from {usdAuto(4284)} to {usdAuto(18404)} in four quarters.
              Crucially, gross margin rose at the same time — from{" "}
              {percent(64.6)} to {percent(76.0)}. Volume and price moved
              together, which happens only when the buyer has nowhere else to
              go.
            </Prose>
          </Reveal>
        </Column>

        <Column width="wide" className="mt-16">
          <Rule />
          <RevealGroup className="grid grid-cols-1 gap-10 pt-10 sm:grid-cols-3">
            <RevealItem>
              <StatBlock
                value={24.4}
                format={{ kind: "signedPercent" }}
                label="One session"
                context="Share price move on 25 May 2023, after the guidance that repriced the AI trade."
              />
            </RevealItem>
            <RevealItem>
              <StatBlock
                value={4.3}
                format={{ kind: "multiple" }}
                label="Four quarters"
                context="Growth in quarterly Data Center revenue between April 2023 and January 2024."
              />
            </RevealItem>
            <RevealItem>
              <StatBlock
                value={11.4}
                format={{ kind: "points" }}
                label="Gross margin"
                context="Expansion over the same four quarters, from 64.6% to 76.0%."
              />
            </RevealItem>
          </RevealGroup>
        </Column>

        <Column width="wide" className="mt-24">
          <ChartWrapper
            exhibit="Exhibit 3"
            question="Did NVIDIA sell more, or did it charge more?"
            unit="GAAP gross and operating margin, quarterly, fiscal 2016 to fiscal 2027."
            sources={SOURCES}
            reading={
              <>
                Both, at once. Gross margin had sat in the mid-fifties to
                mid-sixties for seven years; it reached {percent(78.4)} by April
                2024. Rising margin alongside rising volume is the financial
                signature of a supplier without a substitute — and the two
                collapses show what happens when that condition briefly fails.
              </>
            }
            note="The two ringed points are the $1.32bn gaming inventory charge in July 2022, and the $4.5bn H20 charge in April 2025 following the China licence requirement."
          >
            <MarginChart />
          </ChartWrapper>
        </Column>

        <Column className="mt-24">
          <Reveal>
            <Kicker>Why the response was so slow</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              AMD launched the Instinct MI300X in December 2023, roughly a year
              after the demand became obvious. The hardware was competitive on
              specification. It did not meaningfully change the allocation of
              orders, because the constraint buyers faced was not finding a chip
              — it was finding a chip their existing code, their existing
              networking and their existing operations staff could use at scale
              immediately.
            </Prose>
          </Reveal>
          <Reveal delay={0.1}>
            <Prose className="mt-6">
              Mellanox turned out to matter here as much as CUDA. Training a
              large model is a networking problem as much as a compute problem,
              and NVIDIA was the only vendor selling the whole rack.
            </Prose>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <PullQuote>
              When you are the bottleneck, you set the price. The strategic task
              is not to reach that position — it is to notice how temporary it
              usually is.
            </PullQuote>
          </Reveal>
        </Column>
      </Band>
    </>
  );
}
