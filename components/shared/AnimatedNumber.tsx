"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Number formatting is described declaratively rather than passed as a
 * callback, because these components are rendered from Server Components and
 * functions cannot cross that boundary.
 */
export type NumberFormat =
  | { kind: "percent"; decimals?: number }
  | { kind: "signedPercent"; decimals?: number }
  | { kind: "points"; decimals?: number }
  | { kind: "multiple"; decimals?: number }
  | { kind: "usdBillions"; decimals?: number }
  | { kind: "usdTrillions"; decimals?: number };

export function formatNumber(value: number, format: NumberFormat): string {
  const decimals = format.decimals ?? 1;

  switch (format.kind) {
    case "percent":
      return `${value.toFixed(decimals)}%`;
    case "signedPercent":
      return `${value > 0 ? "+" : ""}${value.toFixed(decimals)}%`;
    case "points":
      return `${value > 0 ? "+" : ""}${value.toFixed(decimals)}pts`;
    case "multiple":
      return `${value.toFixed(decimals)}×`;
    case "usdBillions":
      return `$${value.toFixed(decimals)}bn`;
    case "usdTrillions":
      return `$${value.toFixed(decimals)}tn`;
  }
}

/**
 * Counts a figure up when it scrolls into view.
 *
 * The count is decorative — it draws the eye to a number that matters — so the
 * accessible name is always the final value. Screen readers and reduced-motion
 * users never see an intermediate state.
 */
export function AnimatedNumber({
  value,
  format,
  className,
  duration = 1.4,
}: {
  value: number;
  format: NumberFormat;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const [counted, setCounted] = useState(0);

  // Derived during render rather than synced through an effect: readers who
  // asked for reduced motion simply never read the animated value.
  const display = reduceMotion ? value : counted;

  useEffect(() => {
    if (!inView || reduceMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setCounted,
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      <span aria-hidden="true">{formatNumber(display, format)}</span>
      <span className="sr-only">{formatNumber(value, format)}</span>
    </span>
  );
}

/**
 * A single headline figure with its label and the context that makes it mean
 * something. A number without a comparison is not an insight, so `context` is
 * required rather than optional.
 */
export function StatBlock({
  value,
  format,
  label,
  context,
  tone = "paper",
  className,
}: {
  value: number;
  format: NumberFormat;
  label: string;
  context: string;
  tone?: "paper" | "pitch";
  className?: string;
}) {
  const isPitch = tone === "pitch";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <AnimatedNumber
        value={value}
        format={format}
        className={cn(
          "font-serif text-[clamp(2.25rem,5vw,3.25rem)] font-normal leading-[1] tracking-[-0.03em]",
          isPitch ? "text-ink-inverse" : "text-ink",
        )}
      />
      <p
        className={cn(
          "font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em]",
          isPitch ? "text-ink-inverse-muted" : "text-accent-deep",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-pretty font-sans text-[0.875rem] leading-[1.55]",
          isPitch ? "text-ink-inverse-muted" : "text-ink-muted",
        )}
      >
        {context}
      </p>
    </div>
  );
}
