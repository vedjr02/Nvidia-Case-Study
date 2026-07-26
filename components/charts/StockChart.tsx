"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartControls,
  CrosshairCursor,
  TooltipCard,
  useDrawAnimation,
} from "@/components/charts/kit";
import {
  indexedPerformance,
  marketCapMilestones,
  priceExtremes,
} from "@/lib/data";
import { formatMonthYear, toTimeValue } from "@/lib/format";

/**
 * Relative shareholder return, and the axis argument.
 *
 * The scale control is the exhibit. On a linear axis the series is a wall: it
 * says the last three years were unlike anything before them, which is true of
 * the outcome. On a logarithmic axis, where equal vertical distances are equal
 * percentage moves, the same data shows steady compounding from 2016 with two
 * severe drawdowns — which is true of the process.
 *
 * Both readings are correct. Most published versions of this chart show only
 * the first, which is why the second is the default here.
 */

const SERIES = [
  { key: "NVDA", label: "NVIDIA", colour: "var(--color-series-datacenter)", width: 2.25 },
  { key: "AMD", label: "AMD", colour: "var(--color-series-amd)", width: 1.5 },
  { key: "INTC", label: "Intel", colour: "var(--color-series-intel)", width: 1.5 },
  { key: "GSPC", label: "S&P 500", colour: "var(--color-series-market)", width: 1.5 },
] as const;

export function StockChart() {
  const [scale, setScale] = useState<"log" | "linear">("log");
  const draw = useDrawAnimation();

  const isLog = scale === "log";

  return (
    <div className="w-full">
      <ChartControls
        label="Vertical scale"
        value={scale}
        onChange={(value) => setScale(value as "log" | "linear")}
        options={[
          {
            value: "log",
            label: "Logarithmic",
            hint: "Equal vertical distance is equal percentage change",
          },
          {
            value: "linear",
            label: "Linear",
            hint: "Equal vertical distance is equal index points",
          },
        ]}
        className="mb-6"
      />

      <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={indexedPerformance}
            margin={{ top: 20, right: 14, bottom: 8, left: 4 }}
            accessibilityLayer
          >
            <CartesianGrid
              stroke="var(--color-rule)"
              vertical={false}
              strokeDasharray="0"
            />

            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(t: number) => String(new Date(t).getUTCFullYear())}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-rule-strong)" }}
              tickMargin={10}
              minTickGap={30}
            />

            <YAxis
              scale={isLog ? "log" : "linear"}
              domain={isLog ? [80, "dataMax"] : [0, "dataMax"]}
              allowDataOverflow
              tickFormatter={(v: number) => v.toLocaleString("en-US")}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={52}
            />

            <ReferenceLine
              y={100}
              stroke="var(--color-rule-strong)"
              strokeDasharray="4 4"
            />

            {marketCapMilestones.map((milestone) => (
              <ReferenceLine
                key={milestone.threshold}
                x={toTimeValue(milestone.date)}
                stroke="var(--color-ink-faint)"
                strokeDasharray="2 4"
                strokeOpacity={0.7}
                label={{
                  value: milestone.threshold,
                  position: "top",
                  fill: "var(--color-ink-muted)",
                  fontSize: 10,
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                }}
              />
            ))}

            {/* The peak, and the fact that the series does not end there. */}
            <ReferenceDot
              x={toTimeValue("2026-05-31")}
              y={
                indexedPerformance.find((p) => p.date.startsWith("2026-05"))
                  ?.NVDA ?? 0
              }
              r={3.5}
              fill="var(--color-paper)"
              stroke="var(--color-accent-deep)"
              strokeWidth={2}
            />

            {SERIES.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                name={series.label}
                stroke={series.colour}
                strokeWidth={series.width}
                dot={false}
                activeDot={{
                  r: 3.5,
                  fill: series.colour,
                  stroke: "var(--color-paper)",
                  strokeWidth: 2,
                }}
                {...draw}
              />
            ))}

            <Tooltip
              cursor={<CrosshairCursor />}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
              content={<StockTooltip />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.75rem] text-ink-muted">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-[3px] w-4 rounded-full"
              style={{ backgroundColor: series.colour }}
            />
            {series.label}
          </span>
        ))}
        <span className="text-ink-faint">
          Rebased to 100 at January 2015{isLog ? ", logarithmic scale" : ", linear scale"}
        </span>
      </div>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: { payload: (typeof indexedPerformance)[number] }[];
};

function StockTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  const rows = SERIES.map((series) => ({
    label: series.label,
    value:
      point[series.key] === null
        ? "—"
        : `${(point[series.key] as number).toLocaleString("en-US")}`,
    colour: series.colour,
  }));

  return (
    <TooltipCard
      title={formatMonthYear(point.date)}
      subtitle="Index, January 2015 = 100"
      rows={rows}
      context={contextFor(point.date, point.NVDA)}
    />
  );
}

function contextFor(date: string, nvda: number | null): string | undefined {
  if (date.startsWith("2018-10") || date.startsWith("2018-11")) {
    return "The post-crypto correction. NVIDIA fell 18.8% in one session on 15 November 2018.";
  }
  if (date.startsWith("2022-11")) {
    return "ChatGPT is released on 30 November 2022. NVIDIA is trading roughly 60% below its late-2021 high.";
  }
  if (date.startsWith("2023-05")) {
    return "NVIDIA guides to $11bn of quarterly revenue against roughly $7bn expected. The shares rise 24.4% the next session.";
  }
  if (date.startsWith("2025-01")) {
    return "DeepSeek R1. NVIDIA falls 17.0% in a session — the largest single-day loss of market value on record at the time.";
  }
  if (date.startsWith("2026-05")) {
    return "The peak. NVIDIA closed at a record $235.74 on 14 May 2026, valuing it near $5.7tn.";
  }
  if (date.startsWith("2026-06") && nvda) {
    return "The series ends below its May peak. NVIDIA has since traded back to roughly $5.0tn.";
  }
  return undefined;
}

export const stockChartSummary = `Four rebased price series from January 2015 to June 2026. NVIDIA rises from an index of 100 to roughly ${Math.round(
  (priceExtremes.last.close / priceExtremes.first.close) * 100,
).toLocaleString("en-US")}, far above AMD, Intel and the S&P 500, with sharp drawdowns in late 2018, through 2022, and again after May 2026.`;
