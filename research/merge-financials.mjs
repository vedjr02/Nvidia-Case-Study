/**
 * Merges the two researched financial files into the single dataset the app
 * consumes, and derives the small number of fields the story needs.
 *
 * Derivations are limited to arithmetic on disclosed figures. Nothing is
 * estimated, interpolated or filled in.
 */
import { readFileSync, writeFileSync } from "node:fs";

const early = JSON.parse(
  readFileSync("research/raw/financials-fy2016-fy2021.json", "utf8"),
);
const late = JSON.parse(
  readFileSync("research/raw/financials-fy2022-fy2027.json", "utf8"),
);

const field = (quarter, name) =>
  quarter[name] === undefined ? null : quarter[name];

const quarters = [...early.quarters, ...late.quarters].map((quarter) => {
  const gaming = field(quarter, "gaming");
  const proViz = field(quarter, "proVisualization");
  const automotive = field(quarter, "automotive");
  const oem = field(quarter, "oemAndOther");

  // NVIDIA's new "Edge Computing" platform is exactly the sum of the four
  // markets it replaced — the research verified this holds to the dollar on
  // both quarters NVIDIA restated. Computing it for earlier quarters therefore
  // yields a continuous series across the FY2027 reporting change rather than a
  // break. Flagged as derived so the provenance is never lost.
  const reportedEdge = field(quarter, "edgeComputing");
  const derivedEdge =
    gaming !== null && proViz !== null && automotive !== null && oem !== null
      ? gaming + proViz + automotive + oem
      : null;

  const dataCenter = field(quarter, "dataCenter");
  const revenue = quarter.revenue;

  return {
    fiscalQuarter: quarter.fiscalQuarter,
    quarterEnd: quarter.calendarQuarterEnd,
    revenue,
    dataCenter,
    gaming,
    proVisualization: proViz,
    automotive,
    oemAndOther: oem,
    dataCenterHyperscale: field(quarter, "dataCenterHyperscale"),
    dataCenterAcie: field(quarter, "dataCenterAcie"),
    // `edgeComputing` is NVIDIA's reported figure where it exists, otherwise
    // the verified arithmetic equivalent.
    edgeComputing: reportedEdge ?? derivedEdge,
    edgeComputingIsDerived: reportedEdge === null && derivedEdge !== null,
    grossMarginPct: field(quarter, "grossMarginPct"),
    operatingExpenses: field(quarter, "operatingExpenses"),
    operatingIncome: field(quarter, "operatingIncome"),
    operatingMarginPct:
      field(quarter, "operatingIncome") !== null && revenue
        ? Number(((quarter.operatingIncome / revenue) * 100).toFixed(1))
        : null,
    netIncome: field(quarter, "netIncome"),
    rndExpense: field(quarter, "rndExpense"),
    rndIntensityPct:
      field(quarter, "rndExpense") !== null && revenue
        ? Number(((quarter.rndExpense / revenue) * 100).toFixed(1))
        : null,
    dataCenterSharePct:
      dataCenter !== null && revenue
        ? Number(((dataCenter / revenue) * 100).toFixed(1))
        : null,
    freeCashFlow: field(quarter, "freeCashFlow"),
    operatingCashFlow: field(quarter, "operatingCashFlow"),
    inventory: field(quarter, "inventory"),
    supplyCommitments: field(quarter, "supplyCommitments"),
    sources: quarter.sources,
    notes: quarter.notes ?? "",
  };
});

// Year-on-year growth, computed only where the same quarter four periods back
// exists in the series.
for (let i = 0; i < quarters.length; i += 1) {
  const prior = quarters[i - 4];
  quarters[i].revenueYoyPct =
    prior && prior.revenue
      ? Number(
          (((quarters[i].revenue - prior.revenue) / prior.revenue) * 100).toFixed(
            1,
          ),
        )
      : null;
}

const output = {
  meta: {
    description:
      "NVIDIA quarterly income statement and revenue by market platform, fiscal 2016 Q1 to fiscal 2027 Q1, as originally reported.",
    extractedOn: late.meta.extractedOn,
    mostRecentReportedQuarter: late.meta.mostRecentReportedQuarter,
    unit: "US$ millions unless stated otherwise",
    fiscalYearNote:
      "NVIDIA's fiscal year ends in late January and runs roughly a year ahead of the calendar: fiscal 2027 began in late January 2026. All charts plot the calendar quarter-end date; fiscal labels appear in tooltips.",
    derivedFields: {
      edgeComputing:
        "NVIDIA's reported figure from fiscal 2027 Q1 onward. For earlier quarters it is the sum of Gaming, Professional Visualization, Automotive and OEM & Other. NVIDIA restated two quarters onto the new basis and in both the sum matched the reported Edge Computing figure exactly, so this is a reconciliation of disclosed figures rather than an estimate.",
      operatingMarginPct: "Operating income divided by revenue.",
      rndIntensityPct: "R&D expense divided by revenue.",
      dataCenterSharePct: "Data Center revenue divided by total revenue.",
      revenueYoyPct: "Revenue against the same quarter of the prior fiscal year.",
    },
    segmentReportingChange: late.meta.segmentReportingChange,
    stockSplits: late.meta.stockSplits ?? null,
    caveats: [...(early.meta.caveats ?? []), ...(late.meta.caveats ?? [])],
    primarySources: [
      "https://investor.nvidia.com/financial-info/quarterly-results/",
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001045810&type=10-&dateb=&owner=include&count=40",
    ],
  },
  quarters,
};

writeFileSync("data/financials.json", JSON.stringify(output, null, 2));

console.log(`quarters: ${quarters.length}`);
console.log(`first: ${quarters[0].fiscalQuarter} (${quarters[0].quarterEnd})`);
console.log(
  `last:  ${quarters.at(-1).fiscalQuarter} (${quarters.at(-1).quarterEnd})`,
);
const missing = quarters.filter((q) => q.edgeComputing === null);
console.log(`quarters missing edgeComputing: ${missing.length}`);
console.log(
  `data centre share: ${quarters[0].dataCenterSharePct}% -> ${quarters.at(-1).dataCenterSharePct}%`,
);
