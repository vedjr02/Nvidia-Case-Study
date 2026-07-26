import { cn } from "@/lib/utils";

type Width = "measure" | "wide" | "broad" | "full";
type Tone = "paper" | "sunken" | "pitch";

const widthClass: Record<Width, string> = {
  measure: "max-w-measure",
  wide: "max-w-wide",
  broad: "max-w-broad",
  full: "max-w-none",
};

const toneClass: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  sunken: "bg-paper-sunken text-ink",
  pitch: "bg-pitch text-ink-inverse",
};

/**
 * A full-bleed horizontal band. Tone changes the reading surface — `pitch` is
 * reserved for chapter openers, which act as the visual chapter breaks of the
 * piece.
 */
export function Band({
  children,
  tone = "paper",
  className,
  id,
  as: Tag = "section",
  labelledBy,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  as?: "section" | "div" | "header" | "footer" | "article";
  labelledBy?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn("w-full", toneClass[tone], className)}
    >
      {children}
    </Tag>
  );
}

/**
 * The horizontal measure. `measure` is continuous prose, `wide` is for charts
 * that need room, `broad` for the few full-width exhibits.
 */
export function Column({
  children,
  width = "measure",
  className,
}: {
  children: React.ReactNode;
  width?: Width;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8",
        widthClass[width],
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Vertical rhythm between narrative beats within a chapter. */
export function Stack({
  children,
  className,
  space = "prose",
}: {
  children: React.ReactNode;
  className?: string;
  space?: "tight" | "prose" | "loose";
}) {
  const spacing = {
    tight: "space-y-4",
    prose: "space-y-6",
    loose: "space-y-10",
  }[space];

  return <div className={cn(spacing, className)}>{children}</div>;
}

/** A hairline rule used to separate movements within a chapter. */
export function Rule({
  className,
  tone = "paper",
}: {
  className?: string;
  tone?: "paper" | "pitch";
}) {
  return (
    <hr
      className={cn(
        "border-0 border-t",
        tone === "pitch" ? "border-t-rule-inverse" : "border-t-rule",
        className,
      )}
    />
  );
}
