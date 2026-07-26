import { ChapterOpener } from "@/components/ChapterOpener";
import { SegmentChart } from "@/components/charts/SegmentChart";
import { ChartWrapper, DataTable } from "@/components/shared/ChartWrapper";
import {
  ScrollStage,
  StageAnnouncer,
  StagePin,
  StageSteps,
  Step,
} from "@/components/shared/ScrollStage";
import { Band } from "@/components/shared/Section";
import { Kicker, Prose, PullQuote } from "@/components/shared/Typography";
import { crossover, latestQuarter, quarterByFiscal } from "@/lib/data";
import { formatLongDate, percent, usdAuto, usdBillions } from "@/lib/format";

const SOURCES = [
  {
    label: "NVIDIA CFO Commentary and quarterly results, fiscal 2016–2027",
    href: "https://investor.nvidia.com/financial-info/quarterly-results/",
  },
  {
    label: "SEC EDGAR, NVIDIA Corporation filings",
    href: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001045810&type=10-&dateb=&owner=include&count=40",
  },
];

const STAGE_DESCRIPTIONS = [
  "Chart showing fiscal 2016 to 2017. Gaming and the other non-data-centre markets are far larger than Data Center, which is close to the axis.",
  "Chart extended through fiscal 2019. The non-data-centre line rises sharply through the cryptocurrency boom and then falls back steeply.",
  "Chart extended through fiscal 2021. The Data Center line crosses above the rest of the business for the first time in the quarter ended July 2020.",
  "Chart extended through mid-fiscal 2023. A shaded band marks the six quarters in which the rest of the business retook the lead, ending with a permanent crossover in May 2022.",
  "Chart extended through late fiscal 2024 with the vertical axis rescaled roughly fourfold. The Data Center line rises almost vertically after the ChatGPT marker.",
  "Chart extended to the present with the vertical axis rescaled to eighty billion dollars. The rest of the business is now a flat line near zero.",
];

export function TurningPointTwo() {
  const first = crossover.first;
  const permanent = crossover.permanent;
  const fy2016q1 = quarterByFiscal("FY2016 Q1");
  const cryptoBust = quarterByFiscal("FY2019 Q4");

  return (
    <>
      <ChapterOpener
        id="chapter-2"
        number="Chapter Two"
        title="The Quiet Shift"
        standfirst="NVIDIA became a data-centre company before anyone was watching — and six months before the event that is usually credited with causing it."
        period="2016 – 2022"
        beatDate="2016-04-05"
      />

      <Band as="section" labelledBy="chapter-2-title" className="py-16 sm:py-24">
        <ScrollStage>
          <StagePin>
            <ChartWrapper
              exhibit="Exhibit 2"
              question="When did NVIDIA stop being a graphics company?"
              unit="Quarterly revenue, US$ billions. 45 quarters, fiscal 2016 Q1 to fiscal 2027 Q1."
              sources={SOURCES}
              note="One continuous series across NVIDIA's fiscal 2027 reporting change. NVIDIA restated two quarters onto the new basis: Data Center was unchanged and Edge Computing equalled the exact sum of Gaming, Professional Visualization, Automotive and OEM & Other. 'Everything else' is that sum throughout."
              dataTable={
                <DataTable
                  caption="Quarterly Data Center revenue against all other markets"
                  columns={[
                    "Quarter",
                    "Data Center ($m)",
                    "Everything else ($m)",
                    "Data Center share",
                  ]}
                  rows={[
                    ["FY2016 Q1", "88", "1,063", "7.6%"],
                    ["FY2021 Q2", "1,752", "2,114", "45.3%"],
                    ["FY2023 Q1", "3,750", "4,538", "45.2%"],
                    ["FY2024 Q2", "10,323", "3,184", "76.4%"],
                    ["FY2027 Q1", "75,246", "6,369", "92.2%"],
                  ]}
                />
              }
            >
              <SegmentChart />
              <StageAnnouncer descriptions={STAGE_DESCRIPTIONS} />
            </ChartWrapper>
          </StagePin>

          <StageSteps>
            <Step index={0}>
              <Kicker className="mb-4">Fiscal 2016</Kicker>
              <Prose>
                In the year to January 2016, NVIDIA&rsquo;s data-centre business
                took {usdAuto(339)} of {usdBillions(5010)} in revenue — under
                seven per cent. The company sold graphics cards to people who
                played games. Its data-centre line was small enough that a bad
                quarter in Gaming could erase it entirely.
              </Prose>
              {fy2016q1 ? (
                <Prose className="mt-5 text-ink-secondary">
                  What that figure conceals is the spending behind it. In the
                  same quarter NVIDIA put {usdAuto(fy2016q1.rndExpense ?? 0)}{" "}
                  into research and development — {percent(fy2016q1.rndIntensityPct ?? 0)}{" "}
                  of revenue. Most of it went towards a market that did not yet
                  exist.
                </Prose>
              ) : null}
            </Step>

            <Step index={1}>
              <Kicker className="mb-4">2017 – 2019</Kicker>
              <Prose>
                Then cryptocurrency mining arrived and made the numbers
                unreadable. Gaming revenue climbed steeply through 2017 and
                2018, and neither NVIDIA nor its investors could reliably
                separate demand from gamers, demand from miners, and demand from
                the early machine-learning researchers who had started buying
                the same silicon.
              </Prose>
              {cryptoBust ? (
                <Prose className="mt-5 text-ink-secondary">
                  The answer arrived in the quarter ended{" "}
                  {formatLongDate(cryptoBust.quarterEnd)}. Gaming revenue fell
                  46 per cent in three months, gross margin dropped to{" "}
                  {percent(cryptoBust.grossMarginPct ?? 0)}, and the shares fell
                  18.8 per cent in a single session. NVIDIA later paid a
                  $5.5m SEC penalty for inadequate disclosure of how much of its
                  gaming growth had come from mining.
                </Prose>
              ) : null}
            </Step>

            <Step index={2}>
              <Kicker className="mb-4">July 2020</Kicker>
              <Prose>
                In the quarter ended {formatLongDate(first.quarterEnd)}, Data
                Center out-earned Gaming for the first time —{" "}
                {usdAuto(first.dataCenter as number)} against{" "}
                {usdAuto(first.gaming as number)}.
              </Prose>
              <Prose className="mt-5 text-ink-secondary">
                This is the moment usually cited as the turning point. It
                deserves an asterisk. NVIDIA completed its $7bn acquisition of
                Mellanox on 27 April 2020, three months into that quarter, and
                the networking revenue it brought is inside the figure. The
                first crossing was partly bought.
              </Prose>
            </Step>

            <Step index={3}>
              <Kicker className="mb-4">The reversal</Kicker>
              <Prose>
                It also did not hold. Gaming retook the lead the following
                quarter and kept it for six consecutive quarters, through the
                pandemic demand surge that pushed graphics cards into shortage.
              </Prose>
              <Prose className="mt-5 text-ink-secondary">
                Data Center led permanently only from the quarter ended{" "}
                {formatLongDate(permanent.quarterEnd)} —{" "}
                {usdAuto(permanent.dataCenter as number)} against{" "}
                {usdAuto(permanent.gaming as number)}. That date matters more
                than it looks.
              </Prose>
            </Step>

            <Step index={4}>
              <Kicker className="mb-4">The date that matters</Kicker>
              <PullQuote>
                NVIDIA became a data-centre company in May 2022. ChatGPT was
                released in November 2022.
              </PullQuote>
              <Prose className="mt-8">
                The transformation was complete six months before the event that
                is usually credited with causing it. What ChatGPT changed was
                not NVIDIA&rsquo;s direction but its scale — and the number of
                people who understood what the company had already become.
              </Prose>
            </Step>

            <Step index={5}>
              <Kicker className="mb-4">Fiscal 2027</Kicker>
              <Prose>
                Data Center is now {percent(latestQuarter.dataCenterSharePct ?? 0)}{" "}
                of revenue. In the first quarter of fiscal 2027, NVIDIA stopped
                reporting Gaming as a market at all, folding it into a new
                &ldquo;Edge Computing&rdquo; platform alongside robotics,
                automotive and workstations.
              </Prose>
              <Prose className="mt-5 text-ink-secondary">
                The company&rsquo;s stated reason was that it was
                &ldquo;transitioning to a new reporting framework that better
                reflects our current and future growth drivers.&rdquo; Read
                plainly: the business that gave NVIDIA its name is no longer
                large enough to be one of its reportable markets.
              </Prose>
            </Step>
          </StageSteps>
        </ScrollStage>
      </Band>
    </>
  );
}
