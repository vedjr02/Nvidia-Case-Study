"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import { useStoryClock } from "@/lib/story-clock";

/**
 * A single hairline of progress at the top of the viewport, plus the period the
 * reader is currently in.
 *
 * Chapter jumping lives in the Jump-to palette — putting four chapter labels
 * up here competed with the prose, especially on dark chapter openers where
 * faint ink disappears into the pitch. One thin bar and one period label is
 * enough chrome for a long editorial scroll.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const { activeLabel, activeId } = useStoryClock();
  const [visible, setVisible] = useState(false);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      setVisible(value > 0.04);
    });
  }, [scrollYProgress]);

  const chapterNumber = activeId?.match(/chapter-(\d)/)?.[1] ?? null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <motion.div
        className="h-[2px] origin-left bg-accent"
        style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
        aria-hidden="true"
      />

      <div
        className={`flex justify-end px-6 pt-3 transition-opacity duration-500 sm:px-8 ${
          visible && activeLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        <p
          aria-live="polite"
          className="pointer-events-none rounded-sm border border-rule bg-paper px-2.5 py-1 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted"
        >
          {chapterNumber ? (
            <span className="tabular mr-2 text-accent-deep">{chapterNumber}</span>
          ) : null}
          <span className="tabular">{activeLabel}</span>
        </p>
      </div>
    </div>
  );
}
