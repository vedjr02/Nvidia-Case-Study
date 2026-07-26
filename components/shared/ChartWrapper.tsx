import { cn } from "@/lib/utils";
import { Kicker } from "@/components/shared/Typography";

export type Source = {
  label: string;
  href?: string;
};

/**
 * Every exhibit in this piece is framed the same way, because every exhibit
 * does the same job:
 *
 *   Question  — the business question the chart exists to answer
 *   Chart     — the evidence
 *   Reading   — the answer, in one sentence
 *   Source    — where the numbers came from
 *
 * A chart that cannot be given a question and a reading does not belong in the
 * piece.
 */
export function ChartWrapper({
  exhibit,
  question,
  unit,
  reading,
  sources,
  note,
  children,
  dataTable,
  tone = "paper",
  className,
}: {
  exhibit: string;
  question: string;
  unit?: string;
  reading?: React.ReactNode;
  sources: Source[];
  note?: string;
  children: React.ReactNode;
  dataTable?: React.ReactNode;
  tone?: "paper" | "pitch";
  className?: string;
}) {
  const isPitch = tone === "pitch";

  return (
    <figure
      className={cn(
        "border-t pt-5",
        isPitch ? "border-t-rule-inverse" : "border-t-rule-strong",
        className,
      )}
    >
      <figcaption className="mb-6">
        <Kicker tone={isPitch ? "pitch" : "paper"}>{exhibit}</Kicker>
        <h3
          className={cn(
            "mt-2 text-balance font-serif text-[1.3125rem] font-semibold leading-[1.3] tracking-[-0.012em] sm:text-[1.5rem]",
            isPitch ? "text-ink-inverse" : "text-ink",
          )}
        >
          {question}
        </h3>
        {unit ? (
          <p
            className={cn(
              "mt-2 font-sans text-[0.8125rem]",
              isPitch ? "text-ink-inverse-muted" : "text-ink-muted",
            )}
          >
            {unit}
          </p>
        ) : null}
      </figcaption>

      <div className="tabular">{children}</div>

      {reading ? (
        <div
          className={cn(
            "mt-6 border-l-2 pl-4",
            isPitch ? "border-l-accent" : "border-l-accent",
          )}
        >
          <p
            className={cn(
              "text-pretty font-serif text-[1.0625rem] leading-[1.55]",
              isPitch ? "text-ink-inverse" : "text-ink-secondary",
            )}
          >
            <span
              className={cn(
                "mr-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em]",
                isPitch ? "text-ink-inverse-muted" : "text-accent-deep",
              )}
            >
              Reading
            </span>
            {reading}
          </p>
        </div>
      ) : null}

      {note ? (
        <p
          className={cn(
            "mt-4 font-sans text-[0.8125rem] leading-[1.55]",
            isPitch ? "text-ink-inverse-muted" : "text-ink-muted",
          )}
        >
          {note}
        </p>
      ) : null}

      <SourceLine sources={sources} tone={tone} className="mt-4" />

      {dataTable ? (
        <details
          className={cn(
            "mt-4 font-sans text-[0.8125rem]",
            isPitch ? "text-ink-inverse-muted" : "text-ink-muted",
          )}
        >
          <summary className="cursor-pointer select-none underline decoration-rule-strong underline-offset-4 hover:text-ink">
            View the underlying data as a table
          </summary>
          <div className="mt-4 overflow-x-auto">{dataTable}</div>
        </details>
      ) : null}
    </figure>
  );
}

export function SourceLine({
  sources,
  tone = "paper",
  className,
  prefix = "Source",
}: {
  sources: Source[];
  tone?: "paper" | "pitch";
  className?: string;
  prefix?: string;
}) {
  const isPitch = tone === "pitch";

  return (
    <p
      className={cn(
        "font-sans text-[0.75rem] leading-[1.6]",
        isPitch ? "text-ink-inverse-muted" : "text-ink-faint",
        className,
      )}
    >
      <span className="font-semibold uppercase tracking-[0.1em]">
        {sources.length > 1 ? `${prefix}s` : prefix}
      </span>
      <span className="mx-2" aria-hidden="true">
        ·
      </span>
      {sources.map((source, index) => (
        <span key={`${source.label}-${index}`}>
          {index > 0 ? "; " : ""}
          {source.href ? (
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "underline decoration-dotted underline-offset-[3px] transition-colors",
                isPitch ? "hover:text-ink-inverse" : "hover:text-ink",
              )}
            >
              {source.label}
            </a>
          ) : (
            source.label
          )}
        </span>
      ))}
    </p>
  );
}

/**
 * Accessible table rendering of a chart's series. Screen reader users and
 * anyone who prefers numbers to pictures get the same information.
 */
export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="w-full border-collapse text-left font-sans text-[0.8125rem]">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-b-rule-strong">
          {columns.map((column, index) => (
            <th
              key={column}
              scope="col"
              className={cn(
                "py-2 pr-4 font-semibold text-ink",
                index > 0 && "text-right",
              )}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[0])} className="border-b border-b-rule">
            {row.map((cell, index) => (
              <td
                key={index}
                className={cn(
                  "py-1.5 pr-4 text-ink-secondary",
                  index > 0 && "text-right",
                )}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
