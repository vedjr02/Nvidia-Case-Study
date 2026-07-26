"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CrosshairCursor,
  TooltipCard,
  useDrawAnimation,
} from "@/components/charts/kit";
import { marginSeries } from "@/lib/data";
import { percent, toTimeValue } from "@/lib/format";

/**
 * Margin, which is where pricing power becomes visible.
 *
 * Revenue growth alone cannot distinguish a company selling more units from a
 * company able to charge more for them. Gross margin can. NVIDIA's rose from
 * the mid-fifties to the high seventies while volumes were also rising, which
 * is the signature of a supplier with no substitute.
 *
 * The two collapses are as informative as the climb, and both are annotated.
 */
export function MarginChart() {
  const draw = useDrawAnimation();

  return (
    <div className="w-full">
      <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={marginSeries}
            margin={{ top: 24, right: 14, bottom: 8, left: 4 }}
            accessibilityLayer
          >
            <defs>
              <linearGradient id="fill-margin" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-accent)"
                  stopOpacity={0.16}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-accent)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

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
              domain={[35, 85]}
              ticks={[40, 50, 60, 70, 80]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={42}
            />

            <Area
              type="monotone"
              dataKey="grossMarginPct"
              stroke="none"
              fill="url(#fill-margin)"
              {...draw}
            />

            <Line
              type="monotone"
              dataKey="operatingMarginPct"
              name="Operating margin"
              stroke="var(--color-series-gaming)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{
                r: 3.5,
                fill: "var(--color-series-gaming)",
                stroke: "var(--color-paper)",
                strokeWidth: 2,
              }}
              {...draw}
            />

            <Line
              type="monotone"
              dataKey="grossMarginPct"
              name="Gross margin"
              stroke="var(--color-accent-deep)"
              strokeWidth={2.25}
              dot={false}
              activeDot={{
                r: 3.5,
                fill: "var(--color-accent-deep)",
                stroke: "var(--color-paper)",
                strokeWidth: 2,
              }}
              {...draw}
            />

            {/* The inventory charge. */}
            <ReferenceDot
              x={toTimeValue("2022-07-31")}
              y={43.5}
              r={4}
              fill="var(--color-paper)"
              stroke="var(--color-negative)"
              strokeWidth={2}
            />

            {/* The H20 charge. */}
            <ReferenceDot
              x={toTimeValue("2025-04-27")}
              y={60.5}
              r={4}
              fill="var(--color-paper)"
              stroke="var(--color-negative)"
              strokeWidth={2}
            />

            <ReferenceLine
              x={toTimeValue("2022-11-30")}
              stroke="var(--color-ink-secondary)"
              strokeDasharray="3 3"
              strokeOpacity={0.45}
              label={{
                value: "ChatGPT",
                position: "insideTopLeft",
                fill: "var(--color-ink-secondary)",
                fontSize: 11,
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                offset: 8,
              }}
            />

            <Tooltip
              cursor={<CrosshairCursor />}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
              content={<MarginTooltip />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.75rem] text-ink-muted">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-[3px] w-4 rounded-full"
            style={{ backgroundColor: "var(--color-accent-deep)" }}
          />
          Gross margin
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-[3px] w-4 rounded-full"
            style={{ backgroundColor: "var(--color-series-gaming)" }}
          />
          Operating margin
        </span>
        <span className="text-ink-faint">
          GAAP, quarterly. Ringed points are the two margin shocks.
        </span>
      </div>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: { payload: (typeof marginSeries)[number] }[];
};

function MarginTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <TooltipCard
      title={point.fiscalQuarter}
      rows={[
        {
          label: "Gross margin",
          value: percent(point.grossMarginPct),
          colour: "var(--color-accent-deep)",
        },
        {
          label: "Operating margin",
          value:
            point.operatingMarginPct === null
              ? "—"
              : percent(point.operatingMarginPct),
          colour: "var(--color-series-gaming)",
        },
        {
          label: "R&D as % of revenue",
          value:
            point.rndIntensityPct === null
              ? "—"
              : percent(point.rndIntensityPct),
          muted: true,
        },
      ]}
      context={contextFor(point.quarterEnd)}
    />
  );
}

function contextFor(quarterEnd: string): string | undefined {
  if (quarterEnd === "2019-01-27") {
    return "Post-crypto correction: excess channel inventory forced discounting.";
  }
  if (quarterEnd === "2022-07-31") {
    return "A $1.32bn charge for gaming channel inventory takes gross margin to its low of 43.5%.";
  }
  if (quarterEnd === "2024-04-28") {
    return "The peak, at 78.4%. NVIDIA is the only viable supplier of large-scale training capacity.";
  }
  if (quarterEnd === "2025-04-27") {
    return "A $4.5bn charge against H20 inventory after the China licence requirement takes gross margin to 60.5%.";
  }
  return undefined;
}
