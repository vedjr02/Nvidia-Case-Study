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

/**
 * The story clock.
 *
 * The piece is chronological, so scroll position is time. A single provider
 * tracks which beat of the narrative the reader is currently in and exposes its
 * date. Every chart can subscribe and mark the same moment, which means the
 * reader's position in the argument and their position in the data never
 * disagree.
 *
 * Beats register themselves declaratively via `useStoryBeat`, so adding a
 * chapter does not require touching this file.
 */

type Beat = {
  id: string;
  date: string;
  label: string;
};

type StoryClockValue = {
  /** ISO date of the beat currently in view, or null before the first beat. */
  activeDate: string | null;
  activeLabel: string | null;
  activeId: string | null;
  /** Fraction of the registered beats the reader has passed, 0–1. */
  progress: number;
  registerBeat: (beat: Beat, element: Element) => () => void;
};

const StoryClockContext = createContext<StoryClockValue | null>(null);

export function StoryClockProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Beat | null>(null);
  const [progress, setProgress] = useState(0);

  const beatsRef = useRef<Map<Element, Beat>>(new Map());
  const orderRef = useRef<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleRef = useRef<Set<Element>>(new Set());

  // Recomputes the active beat from whichever registered beats are currently
  // intersecting, preferring the one nearest the top of the viewport.
  const recompute = useCallback(() => {
    const visible = [...visibleRef.current];
    if (visible.length === 0) return;

    const nearest = visible.reduce((best, element) => {
      const bestTop = Math.abs(best.getBoundingClientRect().top);
      const top = Math.abs(element.getBoundingClientRect().top);
      return top < bestTop ? element : best;
    });

    const beat = beatsRef.current.get(nearest);
    if (!beat) return;

    setActive((current) => (current?.id === beat.id ? current : beat));

    const index = orderRef.current.indexOf(beat.id);
    const total = orderRef.current.length;
    setProgress(total > 1 ? index / (total - 1) : 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleRef.current.add(entry.target);
          } else {
            visibleRef.current.delete(entry.target);
          }
        }
        recompute();
      },
      // A band across the upper-middle of the viewport: a beat becomes active
      // when the reader is actually reading it, not when it first peeks in.
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );

    observerRef.current = observer;
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [recompute]);

  const registerBeat = useCallback((beat: Beat, element: Element) => {
    beatsRef.current.set(element, beat);
    if (!orderRef.current.includes(beat.id)) {
      orderRef.current = [...orderRef.current, beat.id];
    }
    observerRef.current?.observe(element);

    return () => {
      observerRef.current?.unobserve(element);
      beatsRef.current.delete(element);
      visibleRef.current.delete(element);
    };
  }, []);

  const value = useMemo<StoryClockValue>(
    () => ({
      activeDate: active?.date ?? null,
      activeLabel: active?.label ?? null,
      activeId: active?.id ?? null,
      progress,
      registerBeat,
    }),
    [active, progress, registerBeat],
  );

  return (
    <StoryClockContext.Provider value={value}>
      {children}
    </StoryClockContext.Provider>
  );
}

export function useStoryClock(): StoryClockValue {
  const value = useContext(StoryClockContext);
  if (!value) {
    // Charts are also used outside the scrolling spine (the executive summary,
    // for instance). Returning an inert clock is correct there.
    return {
      activeDate: null,
      activeLabel: null,
      activeId: null,
      progress: 0,
      registerBeat: () => () => {},
    };
  }
  return value;
}

/**
 * Marks a passage of prose as a moment in time. When it scrolls into the
 * reading band, every subscribed chart moves its marker to `date`.
 */
export function StoryBeat({
  id,
  date,
  label,
  children,
  className,
}: {
  id: string;
  date: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { registerBeat } = useStoryClock();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return registerBeat({ id, date, label }, element);
  }, [id, date, label, registerBeat]);

  return (
    <div ref={ref} className={className} data-beat={id}>
      {children}
    </div>
  );
}
