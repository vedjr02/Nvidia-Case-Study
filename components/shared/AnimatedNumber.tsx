"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

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
  format: (value: number) => string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    reduceMotion ? value : value * 0,
  );

  useEffect(() => {
    if (!inView || reduceMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setDisplay,
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      <span aria-hidden="true">{format(display)}</span>
      <span className="sr-only">{format(value)}</span>
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
  format: (value: number) => string;
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
