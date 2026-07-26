"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Reveals its children once, as they enter the viewport.
 *
 * The movement is deliberately small — 12px and a short fade. The purpose is to
 * mark the boundary between one beat of the argument and the next, not to draw
 * attention to itself. Readers who have asked for reduced motion get the
 * content immediately with no transition at all.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "figure" | "section" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers a list of children. Used for the takeaway list and the timeline,
 * where the sequence itself carries a little meaning.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Reveals its children from behind a mask, as if the line of type were being
 * set. Used for the title sequence and chapter openers.
 *
 * The children are rendered on the server; only the wrapper is a client
 * component, so no text is duplicated into the client bundle.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  duration = 0.9,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={cn("block", className)}>{children}</span>;
  }

  return (
    <span className={cn("block overflow-hidden pb-[0.08em]", className)}>
      <motion.span
        className="block"
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Same masked reveal, but triggered by scroll rather than on mount.
 *
 * Important: the IntersectionObserver must watch an *unclipped* outer element.
 * If `whileInView` sits on the transformed child inside `overflow: hidden`, the
 * observer often never sees a visible intersection and the title stays stuck
 * below the mask forever — which is exactly the empty chapter-opener bug.
 */
export function MaskRevealInView({
  children,
  className,
  delay = 0,
  duration = 0.9,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={cn("block", className)}>{children}</span>;
  }

  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      <span className="block overflow-hidden pb-[0.08em]">
        <motion.span
          className="block will-change-transform"
          variants={{
            hidden: { y: "110%" },
            shown: {
              y: "0%",
              transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {children}
        </motion.span>
      </span>
    </motion.span>
  );
}

/**
 * Holds a chart in place while the reader scrolls past the accompanying prose.
 * This is the scrollytelling primitive: the exhibit stays, the argument moves.
 */
export function StickyExhibit({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("lg:sticky lg:top-[12vh] lg:self-start", className)}>
      {children}
    </div>
  );
}
