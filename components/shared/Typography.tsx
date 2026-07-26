import { cn } from "@/lib/utils";

/**
 * The typographic system. Two families do all the work: a serif for anything
 * the reader reads continuously, a sans for anything they scan — labels,
 * figures, sources, navigation.
 */

/** Small uppercase label above a heading. Sets context, never carries meaning. */
export function Kicker({
  children,
  className,
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "pitch" | "accent";
}) {
  const toneClass = {
    paper: "text-ink-muted",
    pitch: "text-ink-inverse-muted",
    accent: "text-accent-deep",
  }[tone];

  return (
    <p
      className={cn(
        "font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em]",
        toneClass,
        className,
      )}
    >
      {children}
    </p>
  );
}

/** The title of the piece. Used exactly once. */
export function DisplayTitle({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h1
      id={id}
      className={cn(
        "text-balance font-serif text-[clamp(2.75rem,7.5vw,6rem)] font-normal leading-[0.98] tracking-[-0.028em]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

/** Chapter title. One per chapter, on the opener. */
export function ChapterTitle({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "text-balance font-serif text-[clamp(2rem,4.6vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.022em]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** A movement within a chapter. */
export function Heading({
  children,
  className,
  id,
  level = 3,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  level?: 2 | 3 | 4;
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      id={id}
      className={cn(
        "text-balance font-serif text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.012em] sm:text-[1.75rem]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** The standfirst beneath a title — larger than body, lighter in colour. */
export function Lede({
  children,
  className,
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "pitch";
}) {
  return (
    <p
      className={cn(
        "text-pretty font-serif text-[clamp(1.1875rem,2.1vw,1.5rem)] leading-[1.5]",
        tone === "pitch" ? "text-ink-inverse-muted" : "text-ink-secondary",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Body copy. */
export function Prose({
  children,
  className,
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "pitch";
}) {
  return (
    <p
      className={cn(
        "text-pretty",
        tone === "pitch" ? "text-ink-inverse-muted" : "text-ink",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * A single sentence pulled out of the argument and given room. Used sparingly —
 * roughly once per chapter — to mark the analytical conclusion.
 */
export function PullQuote({
  children,
  className,
  attribution,
}: {
  children: React.ReactNode;
  className?: string;
  attribution?: string;
}) {
  return (
    <figure className={cn("border-l-2 border-l-accent py-1 pl-6", className)}>
      <blockquote className="text-pretty font-serif text-[clamp(1.375rem,2.6vw,1.875rem)] leading-[1.35] tracking-[-0.014em] text-ink">
        {children}
      </blockquote>
      {attribution ? (
        <figcaption className="mt-3 font-sans text-[0.8125rem] text-ink-muted">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Caption or source line beneath an exhibit. */
export function Caption({
  children,
  className,
  tone = "paper",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "pitch";
}) {
  return (
    <p
      className={cn(
        "font-sans text-[0.8125rem] leading-[1.5]",
        tone === "pitch" ? "text-ink-inverse-muted" : "text-ink-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * An aside set in the margin on wide screens and inline on narrow ones. Used
 * for definitions and caveats that would break the flow of the argument.
 */
export function MarginNote({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "border-l border-l-rule-strong pl-5 font-sans text-[0.875rem] leading-[1.6] text-ink-secondary",
        className,
      )}
    >
      {label ? (
        <span className="mb-1 block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {label}
        </span>
      ) : null}
      {children}
    </aside>
  );
}

/** Inline emphasis for a figure quoted inside prose. */
export function Figure({ children }: { children: React.ReactNode }) {
  return (
    <span className="tabular font-sans font-semibold tracking-[-0.01em]">
      {children}
    </span>
  );
}
