"use client";

import { ResponsiveContainer } from "recharts";

import { cn } from "@/lib/utils";

/**
 * Shared chart chrome.
 *
 * Recharts is a dashboard library by default: heavy grids, boxed tooltips,
 * legends floating away from the data. Everything here pulls it back towards
 * print conventions — hairline horizontal rules only, no vertical grid, no
 * chart border, direct labelling in place of legends.
 */

export const axisTick = {
  fontSize: 12,
  fill: "var(--color-ink-muted)",
} as const;

export const gridProps = {
  stroke: "var(--color-rule)",
  strokeDasharray: "0",
  vertical: false,
} as const;

export const xAxisProps = {
  tick: axisTick,
  tickLine: false,
  axisLine: { stroke: "var(--color-rule-strong)" },
  tickMargin: 10,
  minTickGap: 24,
} as const;

export const yAxisProps = {
  tick: axisTick,
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  width: 44,
} as const;

/**
 * Holds a chart at a fixed aspect ratio so it reflows without a resize
 * listener and reserves its space before hydration, preventing layout shift.
 *
 * `summary` becomes the accessible description of the whole exhibit — it should
 * describe the *shape* of the data ("a flat line through 2019 that turns
 * sharply upward from early 2023"), not repeat the values, which are available
 * in the data table.
 */
export function ChartFrame({
  children,
  summary,
  ratio = 16 / 9,
  mobileRatio = 4 / 3,
  className,
}: {
  children: React.ReactElement;
  summary: string;
  ratio?: number;
  mobileRatio?: number;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={summary}
      className={cn("w-full", className)}
      style={
        {
          "--chart-ratio": String(ratio),
          "--chart-ratio-mobile": String(mobileRatio),
        } as React.CSSProperties
      }
    >
      <div className="aspect-[var(--chart-ratio-mobile)] w-full sm:aspect-[var(--chart-ratio)]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Tooltip shell.
 *
 * The brief is that a tooltip should tell the reader what a point *means*, not
 * repeat a number they can already see on the axis. Each chart passes a
 * `context` line — a short editorial note tied to that period.
 */
export function TooltipShell({
  title,
  rows,
  context,
}: {
  title: string;
  rows: { label: string; value: string; colour?: string }[];
  context?: string;
}) {
  return (
    <div className="max-w-[17rem] border border-rule-strong bg-paper-raised px-3.5 py-3 font-sans shadow-none">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {title}
      </p>
      <dl className="mt-2 space-y-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline gap-3">
            {row.colour ? (
              <span
                aria-hidden="true"
                className="mt-[0.3rem] h-[2px] w-3 shrink-0"
                style={{ backgroundColor: row.colour }}
              />
            ) : null}
            <dt className="flex-1 text-[0.8125rem] text-ink-secondary">
              {row.label}
            </dt>
            <dd className="tabular text-[0.8125rem] font-semibold text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {context ? (
        <p className="mt-2.5 border-t border-t-rule pt-2.5 text-[0.75rem] leading-[1.5] text-ink-muted">
          {context}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A label placed directly on the plot, replacing a legend. Recharts renders
 * this through a `Customized` element or as SVG children, so it must be SVG.
 */
export function SeriesLabel({
  x,
  y,
  colour,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  colour: string;
  children: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={colour}
      textAnchor={anchor}
      fontFamily="var(--font-inter)"
      fontSize={12}
      fontWeight={600}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

/** Skeleton shown while a lazily-imported chart loads. */
export function ChartSkeleton({
  ratio = 16 / 9,
  mobileRatio = 4 / 3,
}: {
  ratio?: number;
  mobileRatio?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--chart-ratio": String(ratio),
          "--chart-ratio-mobile": String(mobileRatio),
        } as React.CSSProperties
      }
      className="aspect-[var(--chart-ratio-mobile)] w-full sm:aspect-[var(--chart-ratio)]"
    >
      <div className="flex h-full w-full flex-col justify-end gap-px bg-paper-sunken/60">
        <div className="h-px w-full bg-rule" />
        <div className="h-1/4 w-full" />
        <div className="h-px w-full bg-rule" />
        <div className="h-1/4 w-full" />
        <div className="h-px w-full bg-rule" />
        <div className="h-1/4 w-full" />
        <div className="h-px w-full bg-rule-strong" />
      </div>
    </div>
  );
}
