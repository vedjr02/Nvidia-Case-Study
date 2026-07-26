"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import { useStoryClock } from "@/lib/story-clock";

const CHAPTERS = [
  { id: "chapter-1", label: "Platform" },
  { id: "chapter-2", label: "Shift" },
  { id: "chapter-3", label: "Shock" },
  { id: "chapter-4", label: "Infrastructure" },
];

/**
 * A hairline progress rule pinned to the top of the viewport, plus the current
 * chapter and the point in time the reader has reached.
 *
 * This is the only persistent chrome in the piece. It exists because the
 * document is long and chronological: a reader who returns to it needs to know
 * both how far through they are and which year they are standing in.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const { activeLabel } = useStoryClock();
  const [visible, setVisible] = useState(false);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      setVisible(value > 0.03);
    });
  }, [scrollYProgress]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <motion.div
        className="h-[2px] origin-left bg-accent"
        style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
      />

      <div
        className={`flex items-center justify-between px-6 pt-3 font-sans text-[0.6875rem] uppercase tracking-[0.14em] transition-opacity duration-500 sm:px-8 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <nav aria-label="Chapters" className="pointer-events-auto">
          <ul className="flex items-center gap-4">
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  className="text-ink-faint transition-colors hover:text-ink"
                >
                  <span className="tabular mr-1.5">{index + 1}</span>
                  <span className="hidden sm:inline">{chapter.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {activeLabel ? (
          <p aria-live="polite" className="tabular text-ink-faint">
            {activeLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
