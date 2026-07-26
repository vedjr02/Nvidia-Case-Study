"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
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
import { rndComparison } from "@/lib/data";

/**
 * Research and development spending, NVIDIA against AMD and Intel.
 *
 * The exhibit for the platform argument. For most of the last decade NVIDIA was
 * outspent by Intel several times over; the crossing point is recent and it is
 * a consequence of the revenue, not a cause of it. What the early years show is
 * a company spending a far larger share of a far smaller business on the same
 * problem, for long enough that the position became difficult to attack.
 */
const SERIES = [
  { key: "nvidia", label: "NVIDIA", colour: "var(--color-series-datacenter)", width: 2.25 },
  { key: "intel", label: "Intel", colour: "var(--color-series-intel)", width: 1.5 },
  { key: "amd", label: "AMD", colour: "var(--color-series-amd)", width: 1.5 },
] as const;

export function RndChart() {
  const draw = useDrawAnimation();

  return (
    <div className="w-full">
      <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rndComparison}
            margin={{ top: 20, right: 14, bottom: 8, left: 4 }}
            accessibilityLayer
          >
            <CartesianGrid
              stroke="var(--color-rule)"
              vertical={false}
              strokeDasharray="0"
            />

            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-rule-strong)" }}
              tickMargin={10}
              minTickGap={16}
            />

            <YAxis
              tickFormatter={(v: number) => `${v}`}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={36}
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
              content={<RndTooltip />}
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
          Annual R&amp;D expense, US$ billions
        </span>
      </div>
    </div>
  );
}

type Row = (typeof rndComparison)[number];

function RndTooltip({
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
      title={String(row.year)}
      subtitle={`NVIDIA ${row.nvidiaFiscalLabel}`}
      rows={SERIES.map((series) => ({
        label: series.label,
        value: row[series.key] === null ? "—" : `$${row[series.key]}bn`,
        colour: series.colour,
      }))}
      context={contextFor(row.year)}
    />
  );
}

function contextFor(year: number): string | undefined {
  if (year === 2015) {
    return "Intel spends roughly nine times what NVIDIA does. NVIDIA is nonetheless putting over a quarter of its revenue into R&D.";
  }
  if (year === 2024) {
    return "NVIDIA's R&D has grown roughly tenfold since 2015 but is still below Intel's.";
  }
  if (year === 2025) {
    return "NVIDIA passes Intel for the first time — helped as much by Intel cutting its own R&D as by NVIDIA raising its. As a share of NVIDIA's revenue, R&D has fallen to under 8%.";
  }
  return undefined;
}
