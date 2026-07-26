"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Shared chart behaviour.
 *
 * Recharts renders the geometry; everything that makes the exhibits feel
 * considered rather than generated lives here — the crosshair, the tooltip
 * card, the annotation flags, and the gate that holds a chart's draw animation
 * until the reader is actually looking at it.
 */

/**
 * Renders children only once the container has entered the viewport, then keeps
 * them mounted.
 *
 * Recharts plays its draw animation on mount. Mounting on scroll is therefore
 * the simplest way to make every chart draw itself at the moment the reader
 * arrives, rather than silently animating off-screen during hydration.
 */
export function InViewMount({
  children,
  className,
  fallback,
}: {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });

  return (
    <div ref={ref} className={className}>
      {inView ? children : fallback}
    </div>
  );
}

/** Whether draw animations should run at all. */
export function useDrawAnimation() {
  const reduceMotion = useReducedMotion();
  return {
    isAnimationActive: !reduceMotion,
    animationDuration: reduceMotion ? 0 : 1200,
    animationEasing: "ease-out" as const,
  };
}

/**
 * The crosshair. A single hairline dropped to the axis, with no shaded band —
 * Recharts' default grey rectangle obscures the very data the reader is
 * pointing at.
 */
export function CrosshairCursor(props: {
  points?: { x: number; y: number }[];
  height?: number;
  top?: number;
}) {
  const { points, height = 0, top = 0 } = props;
  const x = points?.[0]?.x;
  if (x === undefined) return null;

  return (
    <g>
      <line
        x1={x}
        x2={x}
        y1={top}
        y2={top + height}
        stroke="var(--color-ink)"
        strokeWidth={1}
        strokeOpacity={0.28}
        shapeRendering="crispEdges"
      />
    </g>
  );
}

/**
 * Tooltip card.
 *
 * Deliberately not a floating grey box of numbers. Each row is a labelled
 * value, and the card closes with a sentence of context for that period —
 * because a reader hovering a point wants to know what was happening, not to
 * re-read a figure that is already on the axis.
 */
export function TooltipCard({
  title,
  subtitle,
  rows,
  context,
}: {
  title: string;
  subtitle?: string;
  rows: { label: string; value: string; colour?: string; muted?: boolean }[];
  context?: string;
}) {
  return (
    <div className="pointer-events-none w-[16.5rem] border border-rule-strong bg-paper-raised/98 px-4 py-3.5 font-sans backdrop-blur-[2px]">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-0.5 text-[0.75rem] text-ink-faint">{subtitle}</p>
      ) : null}

      <dl className="mt-2.5 space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline gap-2.5">
            {row.colour ? (
              <span
                aria-hidden="true"
                className="relative top-[-0.15em] h-[3px] w-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: row.colour }}
              />
            ) : null}
            <dt
              className={cn(
                "flex-1 text-[0.8125rem] leading-tight",
                row.muted ? "text-ink-faint" : "text-ink-secondary",
              )}
            >
              {row.label}
            </dt>
            <dd className="tabular text-[0.8125rem] font-semibold leading-tight text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {context ? (
        <p className="mt-3 border-t border-t-rule pt-2.5 text-[0.75rem] leading-[1.5] text-ink-secondary">
          {context}
        </p>
      ) : null}
    </div>
  );
}

/**
 * An annotation flag on the plot: a short vertical stem from the axis with a
 * label at the top. Used for the handful of events that are visible in the
 * data itself.
 */
export function AnnotationFlag({
  viewBox,
  label,
  align = "left",
  stem = 26,
  tone = "ink",
}: {
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  label: string;
  align?: "left" | "right";
  stem?: number;
  tone?: "ink" | "accent" | "negative";
}) {
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;

  const colour = {
    ink: "var(--color-ink-secondary)",
    accent: "var(--color-accent-deep)",
    negative: "var(--color-negative)",
  }[tone];

  return (
    <g>
      <line
        x1={x}
        x2={x}
        y1={y}
        y2={y + stem}
        stroke={colour}
        strokeWidth={1}
        strokeOpacity={0.55}
      />
      <circle cx={x} cy={y + stem} r={2.5} fill={colour} />
      <text
        x={align === "left" ? x + 7 : x - 7}
        y={y + 3}
        textAnchor={align === "left" ? "start" : "end"}
        fill={colour}
        fontFamily="var(--font-inter)"
        fontSize={11}
        fontWeight={600}
        letterSpacing="0.01em"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * A label placed at the end of a line, replacing the legend. Direct labelling
 * removes the round trip between the plot and a key.
 */
export function EndLabel({
  viewBox,
  label,
  colour,
  dy = 0,
}: {
  viewBox?: { x?: number; y?: number };
  label: string;
  colour: string;
  dy?: number;
}) {
  const x = viewBox?.x ?? 0;
  const y = viewBox?.y ?? 0;

  return (
    <text
      x={x + 8}
      y={y + dy}
      fill={colour}
      fontFamily="var(--font-inter)"
      fontSize={12}
      fontWeight={600}
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
}

/**
 * A control strip for chart-level options — scale toggles, series filters.
 * Segmented, quiet, and keyboard-operable.
 */
export function ChartControls({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { value: string; label: string; hint?: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span
        id={`${label}-label`}
        className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-ink-faint"
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${label}-label`}
        className="flex items-center gap-px rounded-full border border-rule bg-paper-sunken p-0.5"
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              title={option.hint}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full px-3 py-1 font-sans text-[0.75rem] font-medium transition-all duration-300",
                selected
                  ? "bg-ink text-ink-inverse"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
