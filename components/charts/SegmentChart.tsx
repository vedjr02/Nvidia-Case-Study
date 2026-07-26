"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
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
import { useStage } from "@/components/shared/ScrollStage";
import { crossover, segmentSeries } from "@/lib/data";
import { axisBillions, toTimeValue, usdAuto } from "@/lib/format";

/**
 * The central exhibit of the piece: Data Center revenue against everything
 * else, every quarter from fiscal 2016 to fiscal 2027.
 *
 * It is one continuous 45-quarter series. NVIDIA changed its reporting
 * framework in fiscal 2027 — Gaming is no longer a separate market and the
 * split became Data Center plus Edge Computing — but the company restated two
 * quarters onto the new basis, and in both, Edge Computing equalled the exact
 * sum of the four markets it replaced while Data Center was unchanged. The
 * bridge is arithmetic on disclosed figures, so the line is unbroken and the
 * reporting change is annotated rather than left as a hole.
 *
 * Both axes grow as the reader advances through the argument. That is the whole
 * point: the numbers that dominate the last two years compress everything
 * before them into a flat line, and the only way to show the early business at
 * all is to visit it at its own scale first.
 */

const STAGES = [
  { xEnd: "2017-01-29", yMax: 2600, label: "Fiscal 2016–2017" },
  { xEnd: "2019-01-27", yMax: 3600, label: "Through the crypto cycle" },
  { xEnd: "2021-01-31", yMax: 3200, label: "The first crossing" },
  { xEnd: "2022-08-01", yMax: 4400, label: "The reversal, then the pass" },
  { xEnd: "2023-10-29", yMax: 16500, label: "The demand shock" },
  { xEnd: "2026-04-26", yMax: 80000, label: "Today" },
];

const X_START = toTimeValue("2015-04-26");

/** Springs a number towards a target, so axis rescaling reads as a zoom. */
function useAnimatedNumber(target: number, enabled: boolean) {
  const [value, setValue] = useState(target);
  const previous = useRef(target);

  useEffect(() => {
    if (!enabled) {
      previous.current = target;
      setValue(target);
      return;
    }
    const controls = animate(previous.current, target, {
      duration: 0.9,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (v) => {
        previous.current = v;
        setValue(v);
      },
    });
    return () => controls.stop();
  }, [target, enabled]);

  return value;
}

export function SegmentChart() {
  const { active } = useStage();
  const reduceMotion = useReducedMotion();
  const draw = useDrawAnimation();

  const stage = STAGES[Math.min(active, STAGES.length - 1)];
  const xEnd = useAnimatedNumber(toTimeValue(stage.xEnd), !reduceMotion);
  const yMax = useAnimatedNumber(stage.yMax, !reduceMotion);

  const firstCross = crossover.first;
  const permanentCross = crossover.permanent;

  return (
    <div className="w-full">
      <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
        <ResponsiveWrapper>
          <AreaChart
            data={segmentSeries}
            margin={{ top: 28, right: 16, bottom: 8, left: 4 }}
            accessibilityLayer
          >
            <defs>
              <linearGradient id="fill-dc" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-series-datacenter)"
                  stopOpacity={0.22}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-series-datacenter)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fill-rest" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-series-gaming)"
                  stopOpacity={0.14}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-series-gaming)"
                  stopOpacity={0.02}
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
              domain={[X_START, xEnd]}
              allowDataOverflow
              tickFormatter={(t: number) => String(new Date(t).getUTCFullYear())}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-rule-strong)" }}
              tickMargin={10}
              minTickGap={28}
            />

            <YAxis
              domain={[0, yMax]}
              allowDataOverflow
              tickFormatter={axisBillions}
              tick={{ fontSize: 12, fill: "var(--color-ink-muted)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={38}
            />

            {/* The six quarters in which Gaming retook the lead. */}
            {active >= 3 ? (
              <ReferenceArea
                x1={toTimeValue("2020-07-26")}
                x2={toTimeValue("2022-05-01")}
                fill="var(--color-ink)"
                fillOpacity={0.045}
                stroke="none"
              />
            ) : null}

            {active >= 4 ? (
              <ReferenceLine
                x={toTimeValue("2022-11-30")}
                stroke="var(--color-ink-secondary)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
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
            ) : null}

            {active >= 5 ? (
              <ReferenceLine
                x={toTimeValue("2026-04-26")}
                stroke="var(--color-ink-secondary)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{
                  value: "Reporting change",
                  position: "insideTopRight",
                  fill: "var(--color-ink-secondary)",
                  fontSize: 11,
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  offset: 8,
                }}
              />
            ) : null}

            <Area
              type="monotone"
              dataKey="rest"
              name="Everything else"
              stroke="var(--color-series-gaming)"
              strokeWidth={1.75}
              fill="url(#fill-rest)"
              dot={false}
              activeDot={{
                r: 3.5,
                fill: "var(--color-series-gaming)",
                stroke: "var(--color-paper)",
                strokeWidth: 2,
              }}
              {...draw}
            />

            <Area
              type="monotone"
              dataKey="dataCenter"
              name="Data Center"
              stroke="var(--color-series-datacenter)"
              strokeWidth={2.25}
              fill="url(#fill-dc)"
              dot={false}
              activeDot={{
                r: 3.5,
                fill: "var(--color-series-datacenter)",
                stroke: "var(--color-paper)",
                strokeWidth: 2,
              }}
              {...draw}
            />

            {active >= 2 ? (
              <ReferenceDot
                x={toTimeValue(firstCross.quarterEnd)}
                y={firstCross.dataCenter as number}
                r={4}
                fill="var(--color-paper)"
                stroke="var(--color-accent-deep)"
                strokeWidth={2}
              />
            ) : null}

            {active >= 3 ? (
              <ReferenceDot
                x={toTimeValue(permanentCross.quarterEnd)}
                y={permanentCross.dataCenter as number}
                r={4}
                fill="var(--color-accent)"
                stroke="var(--color-paper)"
                strokeWidth={2}
              />
            ) : null}

            <Tooltip
              cursor={<CrosshairCursor />}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
              content={<SegmentTooltip />}
            />
          </AreaChart>
        </ResponsiveWrapper>
      </div>

      <Legend />
    </div>
  );
}

/* Recharts requires ResponsiveContainer as the direct parent of the chart. */
function ResponsiveWrapper({ children }: { children: React.ReactElement }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[0.75rem] text-ink-muted">
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-[3px] w-4 rounded-full"
          style={{ backgroundColor: "var(--color-series-datacenter)" }}
        />
        Data Center
      </span>
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-[3px] w-4 rounded-full"
          style={{ backgroundColor: "var(--color-series-gaming)" }}
        />
        Everything else
      </span>
      <span className="text-ink-faint">Quarterly revenue, US$ billions</span>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: { payload: (typeof segmentSeries)[number] }[];
};

function SegmentTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <TooltipCard
      title={point.fiscalQuarter}
      subtitle={`Quarter ended ${new Date(point.quarterEnd).toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
      )}`}
      rows={[
        {
          label: "Data Center",
          value: usdAuto(point.dataCenter),
          colour: "var(--color-series-datacenter)",
        },
        {
          label: "Everything else",
          value: usdAuto(point.rest),
          colour: "var(--color-series-gaming)",
        },
        { label: "Total revenue", value: usdAuto(point.revenue), muted: true },
      ]}
      context={contextFor(point)}
    />
  );
}

/**
 * Tooltip context. A reader hovering a quarter wants to know what was
 * happening in it, not to re-read a number already on the axis.
 */
function contextFor(point: (typeof segmentSeries)[number]): string {
  const share = point.dataCenterSharePct;

  if (point.quarterEnd === "2020-07-26") {
    return "Data Center out-earns Gaming for the first time — though Mellanox, acquired three months earlier, is inside this figure.";
  }
  if (point.quarterEnd === "2022-05-01") {
    return "Data Center takes the lead for good, six months before ChatGPT was released.";
  }
  if (point.quarterEnd === "2019-01-27") {
    return "The post-crypto correction. Gaming revenue fell 46% in a single quarter.";
  }
  if (point.quarterEnd === "2022-07-31") {
    return "A $1.32bn charge for gaming channel inventory; gross margin fell to 43.5%.";
  }
  if (point.quarterEnd === "2023-07-30") {
    return "The first full quarter of the AI demand shock. Data Center revenue rose 141% in three months.";
  }
  if (point.quarterEnd === "2026-04-26") {
    return "First quarter reported under the new framework. Gaming is no longer broken out as a market.";
  }
  if (point.restIsDerived && share > 85) {
    return `Data Center is ${share}% of revenue.`;
  }
  return `Data Center is ${share}% of revenue.`;
}
