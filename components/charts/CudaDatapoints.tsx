import { RevealGroup, RevealItem } from "@/components/shared/AnimatedContainer";
import { cudaPoints, moat } from "@/lib/data";
import { formatMonthYear } from "@/lib/format";

/**
 * Deliberately not a chart.
 *
 * NVIDIA has cited a developer count four times in six years, and each figure
 * measures something different — registered members of a developer programme in
 * 2020, "CUDA developers" in 2023 and 2024, and everyone who has used CUDA at
 * any point since 2006 in 2025. Drawing a line through them would assert a
 * growth rate that the underlying numbers cannot support.
 *
 * So they are presented as what they are: four discrete disclosures, each shown
 * with the definition attached and one flagged as second-hand. The definitional
 * problem is the finding.
 */
export function CudaDatapoints() {
  const points = cudaPoints;
  const max = Math.max(...points.map((p) => p.value as number));

  return (
    <div>
      <RevealGroup className="space-y-0" stagger={0.1}>
        {points.map((point) => {
          const value = point.value as number;
          const isSecondHand = point.sourceQuality?.startsWith("MEDIUM");

          return (
            <RevealItem key={point.date}>
              <div className="grid grid-cols-[5.5rem_1fr] items-start gap-x-5 border-t border-t-rule py-5 sm:grid-cols-[7rem_1fr]">
                <div className="tabular font-sans text-[0.8125rem] text-ink-muted">
                  {point.date.length === 7
                    ? formatMonthYear(`${point.date}-01`)
                    : formatMonthYear(point.date)}
                </div>

                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="tabular font-serif text-[1.75rem] leading-none tracking-[-0.02em] text-ink">
                      {(value / 1_000_000).toFixed(0)}m
                    </span>
                    {isSecondHand ? (
                      <span className="rounded-full border border-rule-strong px-2 py-0.5 font-sans text-[0.625rem] uppercase tracking-[0.1em] text-ink-faint">
                        Second-hand
                      </span>
                    ) : null}
                  </div>

                  {/* A bar, not a line: comparison without implied continuity. */}
                  <div
                    aria-hidden="true"
                    className="mt-3 h-[3px] rounded-full bg-accent/70"
                    style={{ width: `${(value / max) * 100}%` }}
                  />

                  <p className="mt-3 max-w-[46ch] font-sans text-[0.8125rem] leading-[1.5] text-ink-secondary">
                    {point.metric}
                  </p>

                  {point.url ? (
                    <a
                      href={point.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-block font-sans text-[0.75rem] text-ink-faint underline decoration-dotted underline-offset-[3px] transition-colors hover:text-ink"
                    >
                      Source
                    </a>
                  ) : null}
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <p className="mt-6 border-t border-t-rule-strong pt-4 font-sans text-[0.8125rem] leading-[1.55] text-ink-muted">
        {moat.cudaDevelopers.definitionalWarning}
      </p>
    </div>
  );
}
