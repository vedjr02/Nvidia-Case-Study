import { Reveal } from "@/components/shared/AnimatedContainer";
import { Band, Column, Rule } from "@/components/shared/Section";
import { Kicker, Prose } from "@/components/shared/Typography";
import {
  financialsMeta,
  rejectedCompetitiveClaims,
  rejectedTimelineClaims,
  stockMeta,
} from "@/lib/data";

const PRIMARY_SOURCES = [
  {
    group: "Company filings and disclosure",
    items: [
      {
        label: "NVIDIA Investor Relations — quarterly results, CFO commentary and revenue trend",
        href: "https://investor.nvidia.com/financial-info/quarterly-results/",
      },
      {
        label: "SEC EDGAR — NVIDIA Corporation (CIK 0001045810), Forms 10-K, 10-Q and 8-K",
        href: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001045810&type=10-&dateb=&owner=include&count=40",
      },
      {
        label: "SEC XBRL company concept API — income statement and cash flow lines for NVIDIA, AMD, Intel, Microsoft, Alphabet, Amazon and Meta",
        href: "https://data.sec.gov/api/xbrl/companyconcept/CIK0001045810/us-gaap/NetIncomeLoss.json",
      },
    ],
  },
  {
    group: "Market data",
    items: [
      {
        label: "Yahoo Finance chart API — daily split-adjusted closes for NVDA, AMD, INTC and the S&P 500",
        href: "https://finance.yahoo.com/quote/NVDA/history/",
      },
      {
        label: "Reuters — market capitalisation milestones",
        href: "https://www.reuters.com/business/nvidia-poised-record-5-trillion-market-valuation-2025-10-29/",
      },
    ],
  },
  {
    group: "Industry and competitive",
    items: [
      {
        label: "Jon Peddie Research — quarterly add-in-board market share releases",
        href: "https://www.jonpeddie.com/news/",
      },
      {
        label: "TechInsights — AI accelerator market estimates, as reported",
        href: "https://www.techinsights.com/",
      },
      {
        label: "US Bureau of Industry and Security — export control rules and amendments",
        href: "https://www.bis.gov/",
      },
      {
        label: "NVIDIA newsroom and GTC keynotes — product announcements and developer figures",
        href: "https://nvidianews.nvidia.com/",
      },
    ],
  },
];

const METHOD = [
  "Every figure is taken from a primary source: an SEC filing, a company press release or CFO commentary, an exchange price feed, or a named research firm. Nothing is estimated or interpolated.",
  "Financial figures are as originally reported in the quarter they were disclosed, so each quarter is internally consistent with the segment data published alongside it. Restatements are noted rather than applied silently.",
  "Derived values are limited to arithmetic on disclosed figures — operating margin, R&D intensity, revenue mix, year-on-year growth, and rebasing prices to an index. Each is defined in the dataset.",
  "Where sources disagree, both are recorded and the disagreement is stated rather than resolved by preference.",
  "Analyst estimates are labelled as estimates and attributed to the named firm. Market-share figures are shown only alongside the market definition they use, because those definitions vary enough to move NVIDIA's apparent share by more than thirty percentage points.",
];

export function Sources() {
  const rejected = [...rejectedTimelineClaims, ...rejectedCompetitiveClaims];

  return (
    <Band as="footer" className="py-[12vh]" id="sources">
      <Column width="wide">
        <Reveal>
          <Kicker>Sources and method</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-[20ch] text-balance font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-normal leading-[1.08] tracking-[-0.022em]">
            How this was verified
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-14 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal>
            <div>
              <h3 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Method
              </h3>
              <ul className="mt-5 space-y-4">
                {METHOD.map((item) => (
                  <li
                    key={item}
                    className="border-l border-l-rule-strong pl-5 font-sans text-[0.875rem] leading-[1.65] text-ink-secondary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div>
              <h3 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Known limitations
              </h3>
              <ul className="mt-5 space-y-4 font-sans text-[0.875rem] leading-[1.65] text-ink-secondary">
                <li className="border-l border-l-rule-strong pl-5">
                  {financialsMeta.fiscalYearNote}
                </li>
                <li className="border-l border-l-rule-strong pl-5">
                  Diluted earnings per share spans three share bases as
                  reported, following the 4-for-1 split of July 2021 and the
                  10-for-1 split of June 2024. It is deliberately not charted as
                  a continuous series anywhere in this piece.
                </li>
                <li className="border-l border-l-rule-strong pl-5">
                  Share prices are adjusted for splits but not for dividends.
                  {" "}
                  {stockMeta.caveats[0]}
                </li>
                <li className="border-l border-l-rule-strong pl-5">
                  NVIDIA&rsquo;s current market capitalisation is computed from
                  the share count on the latest 10-Q cover page multiplied by
                  the closing price, so it is precise to roughly ±$0.02tn. Its
                  rank as the world&rsquo;s most valuable company was genuinely
                  contested with Apple through July 2026.
                </li>
                <li className="border-l border-l-rule-strong pl-5">
                  Hyperscaler capital expenditure is total purchases of property
                  and equipment. None of the four companies discloses an
                  AI-only or GPU-only figure, and Amazon&rsquo;s line includes
                  substantial fulfilment and logistics spending.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Rule className="mt-20" />

        <Reveal>
          <div className="pt-12">
            <h3 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Claims investigated and not used
            </h3>
            <Prose className="mt-5 max-w-[58ch] text-[1.0625rem] text-ink-secondary">
              These are widely repeated statements about NVIDIA that could not
              be traced to a primary source, or that turned out to describe
              something different from what they are usually taken to mean. None
              of them appears anywhere in this piece. Publishing what was
              refused is a better test of a dataset than publishing what
              survived.
            </Prose>

            <ol className="mt-10 grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-2">
              {rejected.map((item, index) => (
                <li
                  key={`${item.claim}-${index}`}
                  className="border-t border-t-rule pt-5"
                >
                  <p className="font-serif text-[1.0625rem] leading-[1.4] text-ink line-through decoration-negative/50 decoration-1">
                    {item.claim}
                  </p>
                  <p className="mt-3 font-sans text-[0.8125rem] leading-[1.6] text-ink-muted">
                    {item.reason}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Rule className="mt-20" />

        <div className="grid grid-cols-1 gap-x-14 gap-y-12 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {PRIMARY_SOURCES.map((group) => (
            <Reveal key={group.group}>
              <div>
                <h3 className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {group.group}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-block font-sans text-[0.875rem] leading-[1.55] text-ink-secondary transition-colors hover:text-ink"
                      >
                        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
                          {item.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Rule className="mt-20" />

        <p className="pt-10 font-sans text-[0.75rem] leading-[1.7] text-ink-faint">
          Data extracted {financialsMeta.extractedOn}. Most recent reported
          quarter: {financialsMeta.mostRecentReportedQuarter}. This is an
          independent analysis for educational purposes and is not affiliated
          with, endorsed by, or produced in cooperation with NVIDIA Corporation.
          It is not investment advice.
        </p>
      </Column>
    </Band>
  );
}
