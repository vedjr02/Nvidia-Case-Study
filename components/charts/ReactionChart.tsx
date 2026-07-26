"use client";

import {
  Bar,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TooltipCard, useDrawAnimation } from "@/components/charts/kit";
import { earningsWithGrowth } from "@/lib/data";
import { formatMonthYear, percentChange, usdAuto } from "@/lib/format";

/**
 * Growth reported, against the market's response to it.
 *
 * The bars are the share price move on the session after each quarterly
 * report; the line is the year-on-year revenue growth being reported. Through
 * 2023 the two moved together. They have since separated completely: NVIDIA has
 * continued to report growth most companies never see, and the shares have
 * fallen on the majority of recent results.
 *
 * This is what it looks like when expectations catch up with a business.
 */
export function ReactionChart() {
  const draw = useDrawAnimation();

  return (
    <div className="w-full">
      <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={earningsWithGrowth}
            margin={{ top: 20, right: 46, bottom: 8, left: 4 }}
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
              tickFormatter={(t: number) =>
                new Date(t).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "2-digit",
                  timeZone: "UTC",
                })
              }
              tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-rule-strong)" }}
              tickMargin={10}
              minTickGap={26}
            />

            <YAxis
              yAxisId="reaction"
              domain={[-25, 30]}
              ticks={[-20, -10, 0, 10, 20, 30]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
            />

            <YAxis
              yAxisId="growth"
              orientation="right"
              domain={[-60, 300]}
              ticks={[0, 100, 200, 300]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: "var(--color-ink-faint)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={46}
            />

            <ReferenceLine
              yAxisId="reaction"
              y={0}
              stroke="var(--color-rule-strong)"
            />

            <Bar
              yAxisId="reaction"
              dataKey="reactionPct"
              name="Share price reaction"
              barSize={13}
              radius={[1, 1, 0, 0]}
              {...draw}
            >
              {earningsWithGrowth.map((row) => (
                <Cell
                  key={row.date}
                  fill={
                    row.reactionPct >= 0
                      ? "var(--color-positive)"
                      : "var(--color-negative)"
                  }
                  fillOpacity={0.85}
                />
              ))}
            </Bar>

            <Line
              yAxisId="growth"
              type="monotone"
              dataKey="revenueYoyPct"
              name="Revenue growth"
              stroke="var(--color-ink-secondary)"
              strokeWidth={1.75}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{
                r: 3.5,
                fill: "var(--color-ink-secondary)",
                stroke: "var(--color-paper)",
                strokeWidth: 2,
              }}
              {...draw}
            />

            <Tooltip
              cursor={{ fill: "var(--color-ink)", fillOpacity: 0.04 }}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
              content={<ReactionTooltip />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.75rem] text-ink-muted">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: "var(--color-positive)" }}
          />
          Share price rose
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: "var(--color-negative)" }}
          />
          Share price fell
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-[3px] w-4 rounded-full"
            style={{ backgroundColor: "var(--color-ink-secondary)" }}
          />
          Revenue growth, year on year (right axis)
        </span>
      </div>
    </div>
  );
}

type Row = (typeof earningsWithGrowth)[number];

function ReactionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  return (
    <TooltipCard
      title={`${row.fiscalQuarter} results`}
      subtitle={`Reported ${formatMonthYear(row.date)} · reaction is the next session`}
      rows={[
        {
          label: "Share price",
          value: percentChange(row.reactionPct, 1),
          colour:
            row.reactionPct >= 0
              ? "var(--color-positive)"
              : "var(--color-negative)",
        },
        {
          label: "Revenue reported",
          value: usdAuto(row.revenue),
          muted: true,
        },
        {
          label: "Revenue growth",
          value:
            row.revenueYoyPct === null
              ? "—"
              : percentChange(row.revenueYoyPct, 0),
          muted: true,
        },
      ]}
      context={contextFor(row.date)}
    />
  );
}

function contextFor(date: string): string | undefined {
  if (date === "2023-05-24") {
    return "NVIDIA guided to roughly $11bn against about $7bn expected. The single largest repricing in the company's history.";
  }
  if (date === "2024-02-21") {
    return "Revenue up 265% year on year. The market still rewarded it.";
  }
  if (date === "2026-05-20") {
    return "Revenue up 85% year on year to a record $81.6bn — and the shares fell.";
  }
  return undefined;
}
