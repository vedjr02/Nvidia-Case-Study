/**
 * Typed accessors and derived series.
 *
 * Every derivation lives here rather than inside a chart, so two exhibits can
 * never disagree about the same computation. All of it is pure and evaluated at
 * module scope, which means it runs at build time and costs nothing at runtime.
 */
import capexData from "@/data/capex.json";
import competitionData from "@/data/competition.json";
import financialsData from "@/data/financials.json";
import moatData from "@/data/moat.json";
import stockData from "@/data/stock.json";
import timelineData from "@/data/timeline.json";
import { toTimeValue } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/* Financials                                                                  */
/* -------------------------------------------------------------------------- */

export type Quarter = {
  fiscalQuarter: string;
  quarterEnd: string;
  revenue: number;
  dataCenter: number | null;
  gaming: number | null;
  proVisualization: number | null;
  automotive: number | null;
  oemAndOther: number | null;
  dataCenterHyperscale: number | null;
  dataCenterAcie: number | null;
  edgeComputing: number | null;
  edgeComputingIsDerived: boolean;
  grossMarginPct: number | null;
  operatingExpenses: number | null;
  operatingIncome: number | null;
  operatingMarginPct: number | null;
  netIncome: number | null;
  rndExpense: number | null;
  rndIntensityPct: number | null;
  dataCenterSharePct: number | null;
  freeCashFlow: number | null;
  operatingCashFlow: number | null;
  revenueYoyPct: number | null;
  sources: string[];
  notes: string;
};

export const quarters = financialsData.quarters as Quarter[];
export const financialsMeta = financialsData.meta;

export const latestQuarter = quarters[quarters.length - 1];
export const firstQuarter = quarters[0];

/** Every quarter with a numeric time value, ready for a continuous time axis. */
export type QuarterPoint = Quarter & { t: number };

export const quarterPoints: QuarterPoint[] = quarters.map((q) => ({
  ...q,
  t: toTimeValue(q.quarterEnd),
}));

/**
 * The flagship series: Data Center against the rest of the business, continuous
 * across the fiscal 2027 reporting change.
 *
 * NVIDIA restated two quarters onto the new basis and in both, Edge Computing
 * equalled the exact sum of the four markets it replaced, and Data Center was
 * unchanged. The bridge is therefore a reconciliation of disclosed figures, not
 * an estimate, and the series can be plotted unbroken.
 */
export type SegmentPoint = {
  t: number;
  quarterEnd: string;
  fiscalQuarter: string;
  dataCenter: number;
  rest: number;
  revenue: number;
  dataCenterSharePct: number;
  gaming: number | null;
  restIsDerived: boolean;
};

export const segmentSeries: SegmentPoint[] = quarterPoints
  .filter((q) => q.dataCenter !== null && q.edgeComputing !== null)
  .map((q) => ({
    t: q.t,
    quarterEnd: q.quarterEnd,
    fiscalQuarter: q.fiscalQuarter,
    dataCenter: q.dataCenter as number,
    rest: q.edgeComputing as number,
    revenue: q.revenue,
    dataCenterSharePct: q.dataCenterSharePct as number,
    gaming: q.gaming,
    restIsDerived: q.edgeComputingIsDerived,
  }));

/**
 * The crossover, told honestly.
 *
 * Data Center first out-earned Gaming in the quarter ended 26 July 2020, then
 * fell back behind for two quarters, and only led permanently from the quarter
 * ended 1 May 2022. The first crossing was also partly inorganic: Mellanox
 * closed on 27 April 2020, inside that quarter.
 */
function findCrossovers() {
  const withGaming = quarters.filter(
    (q) => q.gaming !== null && q.dataCenter !== null,
  );

  const firstIndex = withGaming.findIndex(
    (q) => (q.dataCenter as number) > (q.gaming as number),
  );

  let permanentIndex = -1;
  for (let i = 0; i < withGaming.length; i += 1) {
    if ((withGaming[i].dataCenter as number) <= (withGaming[i].gaming as number))
      continue;
    if (
      withGaming
        .slice(i)
        .every((q) => (q.dataCenter as number) > (q.gaming as number))
    ) {
      permanentIndex = i;
      break;
    }
  }

  const reversals = withGaming
    .slice(firstIndex + 1, permanentIndex)
    .filter((q) => (q.dataCenter as number) <= (q.gaming as number));

  return {
    first: withGaming[firstIndex],
    permanent: withGaming[permanentIndex],
    reversals,
  };
}

export const crossover = findCrossovers();

/** Margin history. Gross margin is disclosed; operating margin is derived. */
export const marginSeries = quarterPoints
  .filter((q) => q.grossMarginPct !== null)
  .map((q) => ({
    t: q.t,
    quarterEnd: q.quarterEnd,
    fiscalQuarter: q.fiscalQuarter,
    grossMarginPct: q.grossMarginPct as number,
    operatingMarginPct: q.operatingMarginPct,
    rndIntensityPct: q.rndIntensityPct,
    revenue: q.revenue,
  }));

export const marginExtremes = {
  lowest: marginSeries.reduce((a, b) =>
    a.grossMarginPct <= b.grossMarginPct ? a : b,
  ),
  highest: marginSeries.reduce((a, b) =>
    a.grossMarginPct >= b.grossMarginPct ? a : b,
  ),
};

/** Free cash flow, where disclosed. */
export const cashFlowSeries = quarterPoints
  .filter((q) => q.freeCashFlow !== null)
  .map((q) => ({
    t: q.t,
    quarterEnd: q.quarterEnd,
    fiscalQuarter: q.fiscalQuarter,
    freeCashFlow: q.freeCashFlow as number,
    revenue: q.revenue,
  }));

/**
 * NVIDIA's guidance for the quarter that has not yet been reported. Kept
 * separate from the actuals so no chart can accidentally plot it as one.
 */
export const nextQuarterGuidance = {
  fiscalQuarter: "FY2027 Q2",
  revenueMidpoint: 91000,
  tolerancePct: 2,
  basis: "Company guidance issued 20 May 2026, plus or minus 2 per cent.",
  note: "NVIDIA stated it assumes no Data Center compute revenue from China.",
  source:
    "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000051/q1fy27pr.htm",
};

/* -------------------------------------------------------------------------- */
/* Stock                                                                       */
/* -------------------------------------------------------------------------- */

export type PricePoint = { date: string; close: number };

export const stockMeta = stockData.meta;
export const monthly = stockData.monthly as Record<string, PricePoint[]>;

export type IndexedPoint = {
  t: number;
  date: string;
  NVDA: number | null;
  AMD: number | null;
  INTC: number | null;
  GSPC: number | null;
};

/**
 * All four series rebased to 100 at January 2015, which is the only way to
 * compare instruments whose absolute prices differ by three orders of
 * magnitude.
 */
export const indexedPerformance: IndexedPoint[] = (() => {
  const tickers = ["NVDA", "AMD", "INTC", "GSPC"] as const;
  const bases = Object.fromEntries(
    tickers.map((ticker) => [ticker, monthly[ticker][0].close]),
  ) as Record<(typeof tickers)[number], number>;

  return monthly.NVDA.map((point, index) => {
    const row: IndexedPoint = {
      t: toTimeValue(point.date),
      date: point.date,
      NVDA: null,
      AMD: null,
      INTC: null,
      GSPC: null,
    };
    for (const ticker of tickers) {
      const value = monthly[ticker][index];
      row[ticker] = value ? Number(((value.close / bases[ticker]) * 100).toFixed(1)) : null;
    }
    return row;
  });
})();

export const nvdaSeries = monthly.NVDA.map((p) => ({
  t: toTimeValue(p.date),
  date: p.date,
  close: p.close,
}));

export const priceExtremes = {
  first: monthly.NVDA[0],
  last: monthly.NVDA[monthly.NVDA.length - 1],
  peak: monthly.NVDA.reduce((a, b) => (a.close >= b.close ? a : b)),
};

export const totalReturnMultiple =
  priceExtremes.last.close / priceExtremes.first.close;

export const marketCapMilestones = stockData.marketCapMilestones as {
  threshold: string;
  date: string;
  note: string;
  closeOnDate: number;
  source: string;
}[];

export const currentMarketCap = stockData.currentMarketCap;

export type EventReaction = {
  date: string;
  event: string;
  reactionPct: number;
  reactionSession: string;
  closeOnDate: number;
  source: string;
};

export const eventReactions = stockData.eventReactions as EventReaction[];

/** Earnings-day reactions only, for the "expectations" exhibit. */
export const earningsReactions = eventReactions.filter((e) =>
  /earnings/i.test(e.event),
);

/**
 * Each earnings reaction joined to the quarter it reported.
 *
 * NVIDIA reports after the closing bell, so the reaction is the following
 * session — which is what `reactionPct` already measures for earnings entries.
 * The quarter being reported is the most recent one to have ended before the
 * release date.
 *
 * The pairing is the point: it lets the reader see revenue growth and the
 * market's response to it on the same time axis, which is the only way to show
 * that the two decoupled.
 */
export const earningsWithGrowth = earningsReactions
  .map((reaction) => {
    const reported = [...quarters]
      .filter((q) => q.quarterEnd < reaction.date)
      .sort((a, b) => (a.quarterEnd < b.quarterEnd ? 1 : -1))[0];

    if (!reported) return null;

    return {
      t: toTimeValue(reaction.date),
      date: reaction.date,
      fiscalQuarter: reported.fiscalQuarter,
      reactionPct: reaction.reactionPct,
      revenueYoyPct: reported.revenueYoyPct,
      revenue: reported.revenue,
      source: reaction.source,
    };
  })
  .filter((row): row is NonNullable<typeof row> => row !== null);

/* -------------------------------------------------------------------------- */
/* Timeline                                                                    */
/* -------------------------------------------------------------------------- */

export type TimelineEvent = {
  id: string;
  date: string;
  datePrecision: string;
  title: string;
  category:
    | "product"
    | "ecosystem"
    | "market-shock"
    | "corporate"
    | "regulatory"
    | "competitive";
  description: string;
  businessSignificance: string;
  quantifiedImpact: string | null;
  marked: boolean;
  sources: string[];
};

export const timelineEvents = timelineData.events as TimelineEvent[];
export const markedEvents = timelineEvents.filter((e) => e.marked);
export const rejectedTimelineClaims = timelineData.rejected as {
  claim: string;
  reason: string;
}[];

export function eventsBetween(startIso: string, endIso: string) {
  return timelineEvents.filter((e) => e.date >= startIso && e.date <= endIso);
}

export function eventById(id: string) {
  return timelineEvents.find((e) => e.id === id);
}

export const categoryLabels: Record<TimelineEvent["category"], string> = {
  product: "Product",
  ecosystem: "AI ecosystem",
  "market-shock": "Market shock",
  corporate: "Corporate",
  regulatory: "Regulatory",
  competitive: "Competitive",
};

/* -------------------------------------------------------------------------- */
/* Demand side and competition                                                 */
/* -------------------------------------------------------------------------- */

export const capexMeta = capexData.meta;
export const capexCombined = capexData.combined;
export const capexCompanies = capexData.companies;

/** Calendar-year capex for the four hyperscalers, aligned for a stacked view. */
export const capexByYear = (() => {
  const years = new Set<number>();
  for (const series of Object.values(capexCompanies)) {
    for (const point of series) {
      if (point.calendarYear) years.add(point.calendarYear);
    }
  }

  return [...years]
    .sort((a, b) => a - b)
    .map((year) => {
      const find = (key: keyof typeof capexCompanies) =>
        capexCompanies[key].find((p) => p.calendarYear === year)?.usdBillions ??
        null;
      return {
        year,
        microsoft: find("microsoft"),
        alphabet: find("alphabet"),
        amazon: find("amazon"),
        meta: find("meta"),
      };
    })
    .filter(
      (row) =>
        row.microsoft !== null ||
        row.alphabet !== null ||
        row.amazon !== null ||
        row.meta !== null,
    );
})();

export const moat = moatData;

/** CUDA figures are three different metrics — discrete points, never a curve. */
export const cudaPoints = moatData.cudaDevelopers.points.filter(
  (p) => p.value !== null,
);

export const rndComparison = moatData.rAndD.series;

export const competition = competitionData;
export const acceleratorShareEstimates =
  competitionData.aiAcceleratorShare.estimates;
export const shareDefinitions = competitionData.aiAcceleratorShare.definitions;
export const competitorProgrammes = competitionData.programmes;
export const rejectedCompetitiveClaims = competitionData.rejected as {
  claim: string;
  reason: string;
}[];

/* -------------------------------------------------------------------------- */
/* Helpers used by the narrative                                               */
/* -------------------------------------------------------------------------- */

export function quarterByFiscal(label: string) {
  return quarters.find((q) => q.fiscalQuarter === label);
}

/**
 * Sum of a field across a fiscal year, for annual framing in prose.
 *
 * Returns null unless all four quarters disclose the field. Treating an
 * undisclosed quarter as zero would silently understate the year — free cash
 * flow, for instance, is not in the pre-fiscal-2022 dataset at all.
 */
export function fiscalYearTotal(
  fiscalYear: string,
  field: "revenue" | "dataCenter" | "freeCashFlow" | "netIncome",
): number | null {
  const rows = quarters.filter((q) => q.fiscalQuarter.startsWith(fiscalYear));
  if (rows.length !== 4) return null;
  if (rows.some((q) => q[field] === null || q[field] === undefined)) return null;
  return rows.reduce((sum, q) => sum + (q[field] as number), 0);
}
