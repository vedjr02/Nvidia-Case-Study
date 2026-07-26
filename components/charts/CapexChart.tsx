"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TooltipCard, useDrawAnimation } from "@/components/charts/kit";
import { capexByYear } from "@/lib/data";

/**
 * The demand side.
 *
 * NVIDIA's revenue is, to a first approximation, four companies' capital
 * budgets. Plotting those budgets is the only way to show that the growth has
 * an identifiable source — and to make the concentration risk legible without
 * asserting a number NVIDIA does not disclose.
 */

const COMPANIES = [
  { key: "microsoft", label: "Microsoft", colour: "var(--color-series-intel)" },
  { key: "alphabet", label: "Alphabet", colour: "var(--color-series-proviz)" },
  { key: "amazon", label: "Amazon", colour: "var(--color-series-automotive)" },
  { key: "meta", label: "Meta", colour: "var(--color-series-edge)" },
] as const;

export function CapexChart() {
  const draw = useDrawAnimation();

  return (
    <div className="w-full">
      <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={capexByYear}
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
              minTickGap={8}
            />

            <YAxis
              tickFormatter={(v: number) => `${v}`}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
            />

            {COMPANIES.map((company, index) => (
              <Bar
                key={company.key}
                dataKey={company.key}
                name={company.label}
                stackId="capex"
                fill={company.colour}
                radius={
                  index === COMPANIES.length - 1
                    ? ([2, 2, 0, 0] as [number, number, number, number])
                    : undefined
                }
                {...draw}
              />
            ))}

            <Tooltip
              cursor={{ fill: "var(--color-ink)", fillOpacity: 0.04 }}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
              content={<CapexTooltip />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.75rem] text-ink-muted">
        {COMPANIES.map((company) => (
          <span key={company.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: company.colour }}
            />
            {company.label}
          </span>
        ))}
        <span className="text-ink-faint">US$ billions</span>
      </div>
    </div>
  );
}

type Row = (typeof capexByYear)[number];

function CapexTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Row }[];
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;

  const total = COMPANIES.reduce(
    (sum, company) => sum + (row[company.key] ?? 0),
    0,
  );

  return (
    <TooltipCard
      title={String(row.year)}
      subtitle="Purchases of property and equipment"
      rows={[
        ...COMPANIES.map((company) => ({
          label: company.label,
          value: row[company.key] === null ? "—" : `$${row[company.key]}bn`,
          colour: company.colour,
        })),
        { label: "Combined", value: `$${total.toFixed(0)}bn`, muted: true },
      ]}
      context={contextFor(row.year)}
    />
  );
}

function contextFor(year: number): string | undefined {
  if (year === 2016) {
    return "Amazon changed its capex presentation this year from net of incentives to gross, so part of the step is presentational.";
  }
  if (year === 2021) {
    return "The 2020–21 surge is largely Amazon fulfilment and logistics, and predates generative AI.";
  }
  if (year === 2023) {
    return "The first full year after ChatGPT. Combined capex reaches $140bn.";
  }
  if (year === 2025) {
    return "Combined capex reaches $358bn — roughly two and a half times the 2023 figure.";
  }
  return undefined;
}
