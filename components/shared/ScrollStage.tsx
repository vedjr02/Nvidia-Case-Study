"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll-staged exhibits.
 *
 * The core interaction of the piece. An exhibit pins to the viewport while the
 * argument scrolls past it, and each passage of the argument puts the exhibit
 * into a different state — a new series appears, the axis rescales, the stack
 * reorders, an annotation lands.
 *
 * The exhibit is therefore not an illustration of the prose. It *is* the prose,
 * rendered in a second medium, and the two advance together.
 *
 * Composition:
 *
 *   <ScrollStage>
 *     <StagePin>{chart reads useStage()}</StagePin>
 *     <StageSteps>
 *       <Step index={0}>…</Step>
 *       <Step index={1}>…</Step>
 *     </StageSteps>
 *   </ScrollStage>
 */

type StageValue = {
  /** Index of the step currently being read. */
  active: number;
  /** Highest index reached so far — lets exhibits accumulate rather than reset. */
  furthest: number;
  /** How many steps are registered. */
  count: number;
  register: (index: number, element: Element) => () => void;
};

const StageContext = createContext<StageValue>({
  active: 0,
  furthest: 0,
  count: 0,
  register: () => () => {},
});

export function useStage() {
  return useContext(StageContext);
}

/** True once the reader has reached `index`. Used to reveal series in order. */
export function useStageReached(index: number) {
  const { furthest } = useStage();
  return furthest >= index;
}

export function ScrollStage({
  children,
  className,
  pinSide = "right",
}: {
  children: React.ReactNode;
  className?: string;
  pinSide?: "left" | "right";
}) {
  const [active, setActive] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [count, setCount] = useState(0);

  const stepsRef = useRef<Map<Element, number>>(new Map());
  const visibleRef = useRef<Set<Element>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const recompute = useCallback(() => {
    const visible = [...visibleRef.current];
    if (visible.length === 0) return;

    // Prefer the step closest to the reading line, a third down the viewport.
    const readingLine = window.innerHeight * 0.34;
    const nearest = visible.reduce((best, element) => {
      const distance = Math.abs(
        element.getBoundingClientRect().top - readingLine,
      );
      const bestDistance = Math.abs(
        best.getBoundingClientRect().top - readingLine,
      );
      return distance < bestDistance ? element : best;
    });

    const index = stepsRef.current.get(nearest);
    if (index === undefined) return;

    setActive((current) => (current === index ? current : index));
    setFurthest((current) => (index > current ? index : current));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleRef.current.add(entry.target);
          else visibleRef.current.delete(entry.target);
        }
        recompute();
      },
      { rootMargin: "-20% 0px -45% 0px", threshold: 0 },
    );

    observerRef.current = observer;
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [recompute]);

  const register = useCallback((index: number, element: Element) => {
    stepsRef.current.set(element, index);
    setCount((current) => Math.max(current, index + 1));
    observerRef.current?.observe(element);

    return () => {
      observerRef.current?.unobserve(element);
      stepsRef.current.delete(element);
      visibleRef.current.delete(element);
    };
  }, []);

  const value = useMemo(
    () => ({ active, furthest, count, register }),
    [active, furthest, count, register],
  );

  return (
    <StageContext.Provider value={value}>
      <div
        className={cn(
          "mx-auto grid w-full max-w-broad gap-x-14 px-6 sm:px-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]",
          pinSide === "left" && "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]",
          className,
        )}
      >
        {children}
      </div>
    </StageContext.Provider>
  );
}

/** The exhibit. Pins on large screens, sits inline above the prose on small. */
export function StagePin({
  children,
  className,
  side = "right",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "top-0 mb-10 lg:sticky lg:mb-0 lg:flex lg:h-svh lg:items-center lg:py-16",
        side === "right" ? "lg:order-2" : "lg:order-1",
        className,
      )}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}

export function StageSteps({
  children,
  className,
  side = "left",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        side === "left" ? "lg:order-1" : "lg:order-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * One beat of the argument. On large screens each step occupies most of a
 * viewport so the exhibit has room to settle between transitions; on small
 * screens they compress, because the exhibit is inline and the pinning is off.
 */
export function Step({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  const { register, active } = useStage();
  const ref = useRef<HTMLDivElement>(null);
  const isActive = active === index;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return register(index, element);
  }, [index, register]);

  return (
    <div
      ref={ref}
      data-step={index}
      data-active={isActive || undefined}
      className={cn(
        "py-12 transition-opacity duration-500 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-24",
        // Dimming the inactive steps is the clearest possible signal of which
        // passage the exhibit currently corresponds to. Kept subtle so the
        // surrounding text is still readable if the reader looks away.
        isActive ? "opacity-100" : "lg:opacity-40",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Announces the exhibit's current state to assistive technology. Without this
 * a screen-reader user hears the prose but never learns that the chart changed.
 */
export function StageAnnouncer({ descriptions }: { descriptions: string[] }) {
  const { active } = useStage();
  return (
    <p aria-live="polite" className="sr-only">
      {descriptions[active] ?? ""}
    </p>
  );
}
