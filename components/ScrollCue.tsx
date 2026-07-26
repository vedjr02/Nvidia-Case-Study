"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * A quiet indication that the piece continues below. Fades out as soon as the
 * reader starts scrolling, because at that point it has done its job.
 */
export function ScrollCue() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 220], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center"
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduceMotion ? 0 : 1.6, duration: 0.8 }}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="font-sans text-[0.625rem] uppercase tracking-[0.22em] text-ink-inverse-muted/70">
          Scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-rule-inverse">
          {!reduceMotion ? (
            <motion.span
              className="absolute inset-x-0 top-0 block h-4 bg-accent"
              animate={{ y: ["-100%", "250%"] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: [0.65, 0, 0.35, 1],
                repeatDelay: 0.35,
              }}
            />
          ) : null}
        </span>
      </div>
    </motion.div>
  );
}
