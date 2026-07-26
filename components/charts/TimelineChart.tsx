"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { categoryLabels, timelineEvents, type TimelineEvent } from "@/lib/data";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The event record, as swimlanes.
 *
 * Sixty-eight sourced events across six categories. Laying them out by category
 * rather than as one line makes the sequencing legible: product decisions run
 * years ahead of the ecosystem events that made them valuable, and the
 * regulatory lane does not begin until 2022 — at which point it never stops.
 *
 * The empty left half of the chart is not wasted space. It is the decade in
 * which almost nothing happened, which is the point of Chapter One.
 */

const START_YEAR = 2006;
const END_YEAR = 2027;

const CATEGORY_ORDER: TimelineEvent["category"][] = [
  "product",
  "ecosystem",
  "corporate",
  "competitive",
  "regulatory",
  "market-shock",
];

const CATEGORY_COLOURS: Record<TimelineEvent["category"], string> = {
  product: "var(--color-series-datacenter)",
  ecosystem: "var(--color-series-edge)",
  corporate: "var(--color-series-gaming)",
  competitive: "var(--color-series-amd)",
  regulatory: "var(--color-series-proviz)",
  "market-shock": "var(--color-series-automotive)",
};

function positionOf(date: string): number {
  const time = new Date(`${date}T00:00:00Z`).getTime();
  const start = Date.UTC(START_YEAR, 0, 1);
  const end = Date.UTC(END_YEAR, 0, 1);
  return ((time - start) / (end - start)) * 100;
}

export function TimelineChart() {
  const reduceMotion = useReducedMotion();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(CATEGORY_ORDER),
  );
  const [selected, setSelected] = useState<TimelineEvent | null>(
    () => timelineEvents.find((e) => e.date === "2022-11-30") ?? null,
  );
  const laneRefs = useRef<Record<string, HTMLButtonElement[]>>({});

  const grouped = useMemo(() => {
    const map = new Map<TimelineEvent["category"], TimelineEvent[]>();
    for (const category of CATEGORY_ORDER) map.set(category, []);
    for (const event of timelineEvents) {
      map.get(event.category)?.push(event);
    }
    return map;
  }, []);

  const toggleCategory = (category: string) => {
    setActiveCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      // Never allow every lane to be hidden.
      return next.size === 0 ? new Set(CATEGORY_ORDER) : next;
    });
  };

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = START_YEAR; y <= END_YEAR; y += 1) {
      if (y % 2 === 0 || y === END_YEAR) list.push(y);
    }
    return list;
  }, []);

  /** Arrow keys walk along a lane, so the timeline is fully keyboard-operable. */
  const onLaneKeyDown = (
    event: React.KeyboardEvent,
    category: string,
    index: number,
  ) => {
    const lane = laneRefs.current[category];
    if (!lane) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = index + 1;
    if (event.key === "ArrowLeft") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lane.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    const clamped = Math.max(0, Math.min(lane.length - 1, nextIndex));
    lane[clamped]?.focus();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {CATEGORY_ORDER.map((category) => {
          const on = activeCategories.has(category);
          return (
            <button
              key={category}
              type="button"
              aria-pressed={on}
              onClick={() => toggleCategory(category)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-[0.75rem] transition-all duration-300",
                on
                  ? "border-ink/20 bg-paper-sunken text-ink"
                  : "border-rule bg-transparent text-ink-faint hover:text-ink-muted",
              )}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full transition-opacity duration-300"
                style={{
                  backgroundColor: CATEGORY_COLOURS[category],
                  opacity: on ? 1 : 0.3,
                }}
              />
              {categoryLabels[category]}
              <span className="tabular text-ink-faint">
                {grouped.get(category)?.length ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        {/* Year gridlines and labels */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {years.map((year) => (
            <div
              key={year}
              className="absolute top-0 h-full border-l border-l-rule"
              style={{ left: `${positionOf(`${year}-01-01`)}%` }}
            />
          ))}
        </div>

        <div className="relative space-y-0">
          {CATEGORY_ORDER.filter((c) => activeCategories.has(c)).map(
            (category) => {
              const events = grouped.get(category) ?? [];

              return (
                <div
                  key={category}
                  className="relative border-t border-t-rule-strong"
                >
                  <p className="pointer-events-none relative z-10 pt-3 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-ink-muted">
                    {categoryLabels[category]}
                  </p>

                  <div
                    className="relative h-11"
                    role="group"
                    aria-label={`${categoryLabels[category]} events`}
                  >
                    {events.map((event, index) => {
                      const isSelected = selected?.id === event.id;
                      return (
                        <button
                          key={event.id}
                          ref={(node) => {
                            laneRefs.current[category] ??= [];
                            if (node) laneRefs.current[category][index] = node;
                            else delete laneRefs.current[category][index];
                          }}
                          type="button"
                          onClick={() => setSelected(event)}
                          onMouseEnter={() => setSelected(event)}
                          onFocus={() => setSelected(event)}
                          onKeyDown={(e) => onLaneKeyDown(e, category, index)}
                          aria-label={`${formatLongDate(event.date)}: ${event.title}`}
                          aria-pressed={isSelected}
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
                          style={{ left: `${positionOf(event.date)}%` }}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "block rounded-full transition-all duration-300",
                              isSelected
                                ? "h-3 w-3 ring-2 ring-offset-2 ring-offset-paper"
                                : "h-2 w-2 opacity-70 hover:opacity-100",
                              event.marked && !isSelected ? "h-2.5 w-2.5 opacity-100" : "",
                            )}
                            style={{
                              backgroundColor: CATEGORY_COLOURS[category],
                              // @ts-expect-error custom property for the ring colour
                              "--tw-ring-color": CATEGORY_COLOURS[category],
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            },
          )}
        </div>

        <div className="relative mt-1 border-t border-t-rule-strong pt-2">
          {years.map((year) => (
            <span
              key={year}
              className="tabular absolute -translate-x-1/2 font-sans text-[0.6875rem] text-ink-faint"
              style={{ left: `${positionOf(`${year}-01-01`)}%` }}
            >
              {String(year).slice(2)}
            </span>
          ))}
          <span className="block h-5" />
        </div>
      </div>

      {/* Detail panel. Reserved height so selecting an event never reflows the page. */}
      <div className="mt-8 min-h-[13rem] border-t border-t-rule-strong pt-6">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: reduceMotion ? 1 : 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  className="rounded-full px-2.5 py-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.11em]"
                  style={{
                    color: CATEGORY_COLOURS[selected.category],
                    backgroundColor: "var(--color-paper-sunken)",
                  }}
                >
                  {categoryLabels[selected.category]}
                </span>
                <span className="tabular font-sans text-[0.8125rem] text-ink-muted">
                  {selected.datePrecision === "exact"
                    ? formatLongDate(selected.date)
                    : `${formatLongDate(selected.date)} (approximate)`}
                </span>
              </div>

              <h4 className="mt-4 max-w-[38ch] text-balance font-serif text-[1.375rem] font-semibold leading-[1.28] tracking-[-0.012em]">
                {selected.title}
              </h4>

              <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-2">
                <p className="max-w-[54ch] font-sans text-[0.875rem] leading-[1.65] text-ink-secondary">
                  {selected.description}
                </p>
                <div>
                  <p className="max-w-[54ch] border-l-2 border-l-accent pl-4 font-sans text-[0.875rem] leading-[1.65] text-ink-secondary">
                    {selected.businessSignificance}
                  </p>
                  {selected.quantifiedImpact ? (
                    <p className="mt-3 max-w-[54ch] pl-4 font-sans text-[0.8125rem] leading-[1.6] text-ink-muted">
                      {selected.quantifiedImpact}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-5 font-sans text-[0.75rem] text-ink-faint">
                <span className="font-semibold uppercase tracking-[0.1em]">
                  {selected.sources.length > 1 ? "Sources" : "Source"}
                </span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                {selected.sources.map((source, index) => (
                  <span key={source}>
                    {index > 0 ? "; " : ""}
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-[3px] transition-colors hover:text-ink"
                    >
                      {new URL(source).hostname.replace(/^www\./, "")}
                    </a>
                  </span>
                ))}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
