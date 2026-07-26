"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import stock from "@/data/stock.json";
import {
  areaFromLine,
  extent,
  linearScale,
  smoothPath,
  type Point,
} from "@/lib/geometry";

const WIDTH = 1200;
const HEIGHT = 460;
const BASELINE = HEIGHT;

type Series = { date: string; close: number }[];

/**
 * The opening exhibit: NVIDIA's split-adjusted share price, every month from
 * January 2015 to June 2026, drawn as the reader arrives.
 *
 * It is deliberately plotted on a *linear* scale. On a log scale this line is a
 * fairly steady upward slope, which is the analytically complete picture and is
 * shown later in the piece. Here the linear scale is the point: it renders the
 * distribution of the outcome, which is what made the last three years feel
 * discontinuous to everyone living through them. The axis choice is stated in
 * the caption rather than hidden.
 */
export function HeroCurve() {
  const reduceMotion = useReducedMotion();

  const { line, area, milestones, last } = useMemo(() => {
    const series = stock.monthly.NVDA as Series;
    const closes = series.map((d) => d.close);
    const [, maxClose] = extent(closes);

    const x = linearScale([0, series.length - 1], [0, WIDTH]);
    // Headroom at the top so the peak does not collide with the type above it.
    const y = linearScale([0, maxClose * 1.06], [BASELINE, 0]);

    const points: Point[] = series.map((d, i) => ({
      x: x(i),
      y: y(d.close),
    }));

    const linePathData = smoothPath(points);

    // Market-cap milestones, positioned on the month whose close contains them.
    const marks = (stock.marketCapMilestones as { threshold: string; date: string }[])
      .map((milestone) => {
        const index = series.findIndex((d) => d.date >= milestone.date);
        if (index < 0) return null;
        return {
          threshold: milestone.threshold,
          x: x(index),
          y: y(series[index].close),
        };
      })
      .filter((mark): mark is { threshold: string; x: number; y: number } =>
        Boolean(mark),
      );

    return {
      line: linePathData,
      area: areaFromLine(linePathData, points, BASELINE),
      milestones: marks,
      last: points[points.length - 1],
    };
  }, []);

  const drawDuration = reduceMotion ? 0 : 2.6;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[58svh] select-none"
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          {/* A single soft wash beneath the line. Not a decorative gradient —
              it gives the line a base so it does not float on the dark field. */}
          <linearGradient id="hero-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>

          {/* Reveals the wash left-to-right in step with the line. */}
          <clipPath id="hero-wipe">
            <motion.rect
              x="0"
              y="0"
              height={HEIGHT}
              initial={{ width: reduceMotion ? WIDTH : 0 }}
              animate={{ width: WIDTH }}
              transition={{ duration: drawDuration, ease: [0.33, 0, 0.15, 1] }}
            />
          </clipPath>
        </defs>

        <g clipPath="url(#hero-wipe)">
          <path d={area} fill="url(#hero-wash)" />
        </g>

        <motion.path
          d={line}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: drawDuration, ease: [0.33, 0, 0.15, 1] }}
        />

        {milestones.map((mark, index) => (
          <motion.g
            key={mark.threshold}
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: reduceMotion ? 0 : drawDuration * 0.55 + index * 0.14,
            }}
          >
            <circle
              cx={mark.x}
              cy={mark.y}
              r={3}
              fill="var(--color-pitch)"
              stroke="var(--color-accent)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </motion.g>
        ))}

        {/* The final close, held as a pulse — the only moving element once the
            sequence settles, and the reader's eye lands on the present day. */}
        <motion.circle
          cx={last.x}
          cy={last.y}
          r={4}
          fill="var(--color-accent)"
          initial={{ opacity: reduceMotion ? 1 : 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: reduceMotion ? 0 : drawDuration,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: `${last.x}px ${last.y}px` }}
        />
      </svg>
    </div>
  );
}
