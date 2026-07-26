/**
 * Curates the competitive research into the focused datasets the app imports.
 *
 * Split into three files so a chapter only pulls the bytes it actually renders.
 * Every confidence flag, market definition and caveat is carried through — the
 * charts are required to display them.
 */
import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync("research/raw/competitive.json", "utf8"));

const normaliseCapex = (company) =>
  (company.series ?? []).map((entry) => ({
    year: entry.fiscalYear ?? String(entry.year ?? ""),
    calendarYear:
      entry.year ??
      Number(String(entry.fiscalYear ?? "").replace(/\D/g, "")) ??
      null,
    periodEnd: entry.periodEnd ?? null,
    usdBillions: Number((entry.valueUsd / 1e9).toFixed(2)),
    confidence: entry.confidence ?? "reported",
  }));

const capex = {
  meta: {
    description:
      "Annual cash purchases of property and equipment for the four largest hyperscalers.",
    marketDefinition: raw.hyperscalerCapex.marketDefinition,
    caveats: raw.hyperscalerCapex.universalCaveats,
    sources: {
      microsoft: raw.hyperscalerCapex.microsoft.sourceApi,
      alphabet: raw.hyperscalerCapex.alphabet.sourceApi,
      amazon: raw.hyperscalerCapex.amazon.sourceApi,
      meta: raw.hyperscalerCapex.meta.sourceApi,
    },
    fiscalYearNotes: {
      microsoft: raw.hyperscalerCapex.microsoft.fiscalYearEnd,
    },
  },
  companies: {
    microsoft: normaliseCapex(raw.hyperscalerCapex.microsoft),
    alphabet: normaliseCapex(raw.hyperscalerCapex.alphabet),
    amazon: normaliseCapex(raw.hyperscalerCapex.amazon),
    meta: normaliseCapex(raw.hyperscalerCapex.meta),
  },
  combined: (raw.hyperscalerCapex.combinedActuals?.series ?? []).map((e) => ({
    year: e.year,
    usdBillions: Number((e.valueUsd / 1e9).toFixed(1)),
    components: Object.fromEntries(
      Object.entries(e.components).map(([k, v]) => [
        k,
        Number((v / 1e9).toFixed(1)),
      ]),
    ),
    confidence: e.confidence,
  })),
  combinedNote: raw.hyperscalerCapex.combinedActuals?.note ?? null,
  guidance2026: raw.hyperscalerCapex.guidance2026 ?? null,
};

const moat = {
  meta: {
    description:
      "Evidence on the durability of NVIDIA's software position, and comparative R&D.",
  },
  cudaDevelopers: {
    definitionalWarning: raw.moatEvidence.cudaDeveloperCount.definitionalWarning,
    // Explicitly discrete points, never a curve: each is a different metric.
    points: raw.moatEvidence.cudaDeveloperCount.series.map((p) => ({
      date: p.date,
      value: p.value,
      metric: p.metric,
      confidence: p.confidence ?? "reported",
      sourceQuality: p.sourceQuality ?? "primary",
      url: p.url ?? null,
      supportingDetail: p.supportingDetail ?? null,
    })),
  },
  rAndD: {
    definitionalWarning: raw.moatEvidence.rAndDComparison.definitionalWarning,
    confidence: raw.moatEvidence.rAndDComparison.confidence,
    series: raw.moatEvidence.rAndDComparison.alignedComparison.map((r) => ({
      year: r.calendarYearApprox,
      nvidiaFiscalLabel: r.nvidiaFiscalLabel,
      nvidia: r.nvidiaUsd === null ? null : Number((r.nvidiaUsd / 1e9).toFixed(2)),
      amd: r.amdUsd === null ? null : Number((r.amdUsd / 1e9).toFixed(2)),
      intel: r.intelUsd === null ? null : Number((r.intelUsd / 1e9).toFixed(2)),
    })),
  },
};

const competition = {
  meta: {
    description:
      "Market-share estimates and competitor accelerator programmes. Share figures are definition-dependent and must always be displayed with their definition.",
    confidenceFieldDefinition: raw.meta.confidenceFieldDefinition,
  },
  aiAcceleratorShare: {
    criticalWarning: raw.aiAcceleratorShare.criticalWarning,
    definitions: raw.aiAcceleratorShare.definitionsEncountered,
    estimates: raw.aiAcceleratorShare.estimates.map((e) => ({
      year: e.year,
      nvidiaSharePct: e.nvidiaSharePct,
      marketDefinition: e.marketDefinition,
      firm: e.firm,
      confidence: e.confidence,
      asOf: e.asOf ?? null,
      sourceQuality: e.sourceQuality ?? null,
      url: e.url ?? null,
      notes: e.notes ?? null,
    })),
  },
  gpuMarketShare: {
    marketDefinition: raw.gpuMarketShare.marketDefinition,
    dataQualityWarning: raw.gpuMarketShare.dataQualityWarning,
    points: raw.gpuMarketShare.dataPoints.map((p) => ({
      quarter: p.quarter,
      nvidiaSharePct: p.nvidiaSharePct,
      confidence: p.confidence,
      firm: p.firm,
      url: p.url ?? null,
      notes: p.notes ?? null,
    })),
  },
  programmes: Object.fromEntries(
    Object.entries(raw.competitorPrograms).map(([key, value]) => [
      key,
      {
        programme: value.programme ?? null,
        currentStatus: value.currentStatusMid2026 ?? null,
        disclosedDeploymentScale: value.disclosedDeploymentScale ?? null,
        disclosedRevenue: value.disclosedRevenue ?? null,
        roadmap: value.roadmap ?? null,
        software: value.software ?? null,
        milestones: value.milestones ?? null,
      },
    ]),
  ),
  rejected: raw.rejected,
};

writeFileSync("data/capex.json", JSON.stringify(capex, null, 2));
writeFileSync("data/moat.json", JSON.stringify(moat, null, 2));
writeFileSync("data/competition.json", JSON.stringify(competition, null, 2));

console.log("capex companies:", Object.keys(capex.companies).map((k) => `${k}:${capex.companies[k].length}`).join(" "));
console.log("capex combined years:", capex.combined.map((c) => c.year).join(", "));
console.log("cuda points:", moat.cudaDevelopers.points.length);
console.log("rAndD years:", moat.rAndD.series.length, moat.rAndD.series[0]?.year, "->", moat.rAndD.series.at(-1)?.year);
console.log("share estimates:", competition.aiAcceleratorShare.estimates.length);
console.log("gpu share points:", competition.gpuMarketShare.points.length);
console.log("programmes:", Object.keys(competition.programmes).join(", "));
console.log("rejected:", competition.rejected.length);
