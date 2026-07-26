import { ChapterOpener } from "@/components/ChapterOpener";
import { CapexChart } from "@/components/charts/CapexChart";
import { ReactionChart } from "@/components/charts/ReactionChart";
import { StockChart } from "@/components/charts/StockChart";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/AnimatedContainer";
import { StatBlock } from "@/components/shared/AnimatedNumber";
import { ChartWrapper } from "@/components/shared/ChartWrapper";
import { Band, Column, Rule } from "@/components/shared/Section";
import { Kicker, Prose, PullQuote } from "@/components/shared/Typography";
import { capexMeta, latestQuarter } from "@/lib/data";
import { percent, usdAuto } from "@/lib/format";

export function TurningPointFour() {
  const hyperscaleShare =
    latestQuarter.dataCenterHyperscale && latestQuarter.dataCenter
      ? (latestQuarter.dataCenterHyperscale / latestQuarter.dataCenter) * 100
      : null;

  return (
    <>
      <ChapterOpener
        id="chapter-4"
        number="Chapter Four"
        title="Becoming Infrastructure"
        standfirst="A company whose revenue is four other companies' capital budgets is no longer a supplier to an industry. It is a dependency of one — and it inherits that industry's risks."
        period="2024 – 2026"
      />

      <Band as="section" labelledBy="chapter-4-title" className="py-16 sm:py-24">
        <Column>
          <Reveal>
            <Kicker>Where the money comes from</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              NVIDIA&rsquo;s revenue is, to a first approximation, a share of
              what a small number of companies choose to spend on data centres.
              That spending is disclosed, so the demand side of this business
              can be examined directly rather than inferred.
            </Prose>
          </Reveal>
        </Column>

        <Column width="wide" className="mt-16">
          <ChartWrapper
            exhibit="Exhibit 4"
            question="Who is actually paying for all of this?"
            unit="Annual purchases of property and equipment, US$ billions, from each company's consolidated cash flow statement."
            sources={[
              {
                label: "SEC EDGAR XBRL, PaymentsToAcquirePropertyPlantAndEquipment",
                href: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789019&type=10-K",
              },
            ]}
            reading={
              <>
                Combined capital expenditure at the four largest hyperscalers
                went from $140bn in 2023 to $358bn in 2025. NVIDIA&rsquo;s
                growth is not a mystery: it is a large and rising share of that
                number.
              </>
            }
            note={`${capexMeta.caveats[0]} Microsoft's fiscal year ends in June, so its series is not calendar-aligned with the other three.`}
          >
            <CapexChart />
          </ChartWrapper>
        </Column>

        <Column className="mt-24">
          <Reveal>
            <Kicker>The concentration question</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              This is the obvious objection, and NVIDIA has been answering it
              with its disclosure. From fiscal 2027 the company splits Data
              Center into Hyperscale and everything else — AI clouds, industrial
              customers, enterprises and governments.
            </Prose>
          </Reveal>
          {hyperscaleShare !== null ? (
            <Reveal delay={0.1}>
              <Prose className="mt-6">
                In the most recent quarter, hyperscalers were{" "}
                {percent(hyperscaleShare)} of Data Center revenue —{" "}
                {usdAuto(latestQuarter.dataCenterHyperscale as number)} of{" "}
                {usdAuto(latestQuarter.dataCenter as number)}. That NVIDIA chose
                to start reporting this split is itself informative: it is the
                metric the company expects to be judged on.
              </Prose>
            </Reveal>
          ) : null}
        </Column>

        <Column width="wide" className="mt-16">
          <Rule />
          <RevealGroup className="grid grid-cols-1 gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            <RevealItem>
              <StatBlock
                value={hyperscaleShare ?? 0}
                format={{ kind: "percent" }}
                label="From hyperscalers"
                context="Share of Data Center revenue in the quarter ended April 2026. The remainder is AI clouds, industrial, enterprise and sovereign customers."
              />
            </RevealItem>
            <RevealItem>
              <StatBlock
                value={119}
                format={{ kind: "usdBillions", decimals: 0 }}
                label="Supply commitments"
                context="Manufacturing, supply and capacity commitments at April 2026. NVIDIA has changed the basis of this disclosure repeatedly, so it is not a comparable series."
              />
            </RevealItem>
            <RevealItem>
              <StatBlock
                value={9}
                format={{ kind: "percent", decimals: 0 }}
                label="From China"
                context="Down from a fifth of revenue before the 2022 export controls, after successive restrictions and a $4.5bn H20 charge."
              />
            </RevealItem>
            <RevealItem>
              <StatBlock
                value={65.6}
                format={{ kind: "percent" }}
                label="Operating margin"
                context="Quarter ended April 2026. Operating income of $53.5bn on revenue of $81.6bn."
              />
            </RevealItem>
          </RevealGroup>
        </Column>

        <Column className="mt-24">
          <Reveal>
            <Kicker>What the market now expects</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              The most telling recent development is not in the revenue line. It
              is in how little the revenue line now moves the share price.
            </Prose>
          </Reveal>
        </Column>

        <Column width="wide" className="mt-16">
          <ChartWrapper
            exhibit="Exhibit 5"
            question="Is exceptional growth still good news?"
            unit="Share price move on the session after each quarterly report, against the year-on-year revenue growth reported."
            sources={[
              {
                label: "Yahoo Finance daily closes; NVIDIA quarterly results",
                href: "https://investor.nvidia.com/financial-info/quarterly-results/",
              },
            ]}
            reading={
              <>
                No longer. Through 2023 the two moved together. Since then they
                have separated: NVIDIA reported 85 per cent year-on-year growth
                in May 2026 and the shares fell. Growth is now the expectation
                rather than the surprise, which is the ordinary fate of a
                company that has become infrastructure.
              </>
            }
          >
            <ReactionChart />
          </ChartWrapper>
        </Column>

        <Column className="mt-24">
          <Reveal>
            <Kicker>The whole picture</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              NVIDIA passed a $5tn valuation in October 2025, the first company
              to do so. It peaked near $5.7tn in May 2026 and has since traded
              back to roughly $5.0tn. It is currently the most valuable company
              in the world, though the position has changed hands with Apple
              several times.
            </Prose>
          </Reveal>
        </Column>

        <Column width="wide" className="mt-16">
          <ChartWrapper
            exhibit="Exhibit 6"
            question="How much of this story is visible in the share price — and does the axis change the answer?"
            unit="Total return index, January 2015 = 100, split-adjusted. Switch the vertical scale to compare readings."
            sources={[
              {
                label: "Yahoo Finance daily closes, split-adjusted",
                href: "https://finance.yahoo.com/quote/NVDA/history/",
              },
              {
                label: "Reuters, market capitalisation milestones",
                href: "https://www.reuters.com/business/nvidia-poised-record-5-trillion-market-valuation-2025-10-29/",
              },
            ]}
            reading={
              <>
                On a linear scale the last three years look like a
                discontinuity. On a logarithmic scale, where equal distances are
                equal percentage moves, the same data shows steady compounding
                from 2016 interrupted by two severe drawdowns. Both readings are
                true; the linear one is the one usually published. Note also
                that AMD&rsquo;s return over the full period is of the same
                order as NVIDIA&rsquo;s, from a 2015 base close to bankruptcy.
              </>
            }
            note="Prices are adjusted for the 4-for-1 split of July 2021 and the 10-for-1 split of June 2024, but not for dividends."
          >
            <StockChart />
          </ChartWrapper>
        </Column>

        <Column className="mt-24">
          <Reveal>
            <PullQuote>
              Becoming critical infrastructure is not the end of strategic risk.
              It is the point at which a company&rsquo;s risks stop being
              competitive and start being macroeconomic and political.
            </PullQuote>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-10">
              The threats to NVIDIA&rsquo;s position are no longer chiefly about
              chips. They are the possibility that hyperscaler capital budgets
              normalise; that custom accelerators — Google&rsquo;s TPUs,
              Amazon&rsquo;s Trainium, the designs Broadcom builds for others —
              absorb the predictable inference workloads while NVIDIA keeps the
              frontier training ones; and that export policy continues to
              redraw the map of who may buy what. China has already fallen to
              around nine per cent of revenue.
            </Prose>
          </Reveal>
        </Column>
      </Band>
    </>
  );
}
