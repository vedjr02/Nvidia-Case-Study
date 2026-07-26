"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A command palette for a long document.
 *
 * Twenty minutes of scrolling needs a way to move around that is not a
 * navigation bar — a bar would sit permanently over the reading surface and
 * make the piece look like an application. This stays out of the way until
 * summoned with the keyboard, and offers one small persistent affordance for
 * readers who would not think to press a shortcut.
 */

type Destination = {
  id: string;
  label: string;
  kind: "Chapter" | "Section" | "Exhibit";
  hint: string;
};

const DESTINATIONS: Destination[] = [
  { id: "story", label: "Top", kind: "Section", hint: "The opening" },
  { id: "chapter-1", label: "From Graphics Company to Computing Platform", kind: "Chapter", hint: "2006–2016 · CUDA and the cost of being early" },
  { id: "chapter-2", label: "The Quiet Shift", kind: "Chapter", hint: "2016–2022 · Data centre overtakes gaming" },
  { id: "chapter-3", label: "The Demand Shock", kind: "Chapter", hint: "2022–2024 · Price and volume rise together" },
  { id: "chapter-4", label: "Becoming Infrastructure", kind: "Chapter", hint: "2024–2026 · Concentration and expectations" },
  { id: "record", label: "The record", kind: "Exhibit", hint: "Sixty-eight sourced events across six lanes" },
  { id: "lessons", label: "What transfers", kind: "Section", hint: "Six portable lessons" },
  { id: "summary", label: "Executive summary", kind: "Section", hint: "The one-page version" },
  { id: "sources", label: "Sources and method", kind: "Section", hint: "How this was verified" },
];

export function ChapterNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  const reduceMotion = useReducedMotion();

  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Resolve the shortcut glyph after mount so SSR and the first client paint
  // agree. Detecting macOS during render is a hydration mismatch waiting to happen.
  useEffect(() => {
    const isApple = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
    setShortcutLabel(isApple ? "⌘K" : "Ctrl K");
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DESTINATIONS;
    return DESTINATIONS.filter(
      (d) =>
        d.label.toLowerCase().includes(q) ||
        d.hint.toLowerCase().includes(q) ||
        d.kind.toLowerCase().includes(q),
    );
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlighted(0);
    returnFocusRef.current?.focus();
  }, []);

  const go = useCallback(
    (id: string) => {
      close();
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      // Move focus to the destination so keyboard reading continues from there.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [close, reduceMotion],
  );

  // Global shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        returnFocusRef.current = document.activeElement as HTMLElement;
        setOpen((current) => !current);
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Prevent the page behind from scrolling while the palette is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const onListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((i) => (i + 1) % Math.max(results.length, 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const target = results[highlighted];
      if (target) go(target.id);
    }
    if (event.key === "Tab") {
      // Single focusable element, so keep focus inside the dialog.
      event.preventDefault();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          returnFocusRef.current = event.currentTarget;
          setOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full border border-rule-strong bg-paper-raised px-4 py-2.5 font-sans text-[0.75rem] text-ink-muted transition-colors duration-300 hover:border-ink hover:text-ink"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>Jump to</span>
        <kbd className="rounded border border-rule-strong px-1.5 py-0.5 font-sans text-[0.625rem] uppercase tracking-wide text-ink-faint">
          {shortcutLabel}
        </kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]"
            initial={{ opacity: reduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduceMotion ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              aria-label="Close navigation"
              onClick={close}
              className="absolute inset-0 cursor-default bg-pitch/40"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Jump to a section"
              onKeyDown={onListKeyDown}
              className="relative w-full max-w-[34rem] border border-rule-strong bg-paper-raised"
              initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="border-b border-b-rule px-5 py-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setHighlighted(0);
                  }}
                  placeholder="Search chapters and sections"
                  aria-label="Search chapters and sections"
                  aria-controls="palette-results"
                  className="w-full bg-transparent font-sans text-[0.9375rem] text-ink outline-none placeholder:text-ink-faint"
                />
              </div>

              <ul
                id="palette-results"
                role="listbox"
                aria-label="Destinations"
                className="max-h-[46vh] overflow-y-auto py-2"
              >
                {results.length === 0 ? (
                  <li className="px-5 py-6 font-sans text-[0.875rem] text-ink-faint">
                    Nothing matches that.
                  </li>
                ) : null}

                {results.map((destination, index) => (
                  <li key={destination.id} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === highlighted}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => go(destination.id)}
                      className={cn(
                        "flex w-full items-baseline gap-4 px-5 py-3 text-left transition-colors duration-150",
                        index === highlighted ? "bg-paper-sunken" : "bg-transparent",
                      )}
                    >
                      <span className="w-[4.5rem] shrink-0 font-sans text-[0.625rem] uppercase tracking-[0.12em] text-accent-deep">
                        {destination.kind}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-[1rem] leading-tight text-ink">
                          {destination.label}
                        </span>
                        <span className="mt-1 block truncate font-sans text-[0.75rem] text-ink-muted">
                          {destination.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 border-t border-t-rule px-5 py-3 font-sans text-[0.6875rem] text-ink-faint">
                <span>↑↓ to move</span>
                <span>↵ to jump</span>
                <span>esc to close</span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
