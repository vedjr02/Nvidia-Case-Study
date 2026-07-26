"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A hairline that draws itself across the column when it comes into view.
 * Used on chapter openers, where it reads as a rule being ruled.
 */
export function DrawRule({
  className,
  tone = "pitch",
  delay = 0.1,
}: {
  className?: string;
  tone?: "pitch" | "paper" | "accent";
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  const colour = {
    pitch: "bg-rule-inverse",
    paper: "bg-rule-strong",
    accent: "bg-accent",
  }[tone];

  return (
    <motion.div
      aria-hidden="true"
      className={cn("h-px w-full origin-left", colour, className)}
      initial={{ scaleX: reduceMotion ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
