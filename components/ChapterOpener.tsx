import { DrawRule } from "@/components/shared/DrawRule";
import { MaskRevealInView, Reveal } from "@/components/shared/AnimatedContainer";
import { Band, Column } from "@/components/shared/Section";

/**
 * The chapter break.
 *
 * A full-bleed dark band between light reading sections. This is what gives the
 * document its structure: the reader knows a new chapter has begun before
 * reading a word of it. It replaces the navigation, chapter cards and section
 * dividers a template would use.
 */
export function ChapterOpener({
  id,
  number,
  title,
  standfirst,
  period,
}: {
  id: string;
  number: string;
  title: string;
  standfirst: string;
  period: string;
}) {
  return (
    <Band
      tone="pitch"
      id={id}
      as="section"
      labelledBy={`${id}-title`}
      className="scroll-mt-0 py-[16vh] sm:py-[20vh]"
    >
      <Column width="wide">
        <div className="flex items-baseline justify-between gap-6">
          <MaskRevealInView>
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent">
              {number}
            </span>
          </MaskRevealInView>
          <MaskRevealInView delay={0.06}>
            <span className="tabular font-sans text-[0.6875rem] uppercase tracking-[0.16em] text-ink-inverse-muted">
              {period}
            </span>
          </MaskRevealInView>
        </div>

        <DrawRule className="mt-5" />

        <h2
          id={`${id}-title`}
          className="mt-10 max-w-[16ch] text-balance font-serif text-[clamp(2.25rem,6vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.028em] text-ink-inverse"
        >
          <MaskRevealInView delay={0.18}>{title}</MaskRevealInView>
        </h2>

        <Reveal delay={0.4} className="mt-8 max-w-[46ch]">
          <p className="text-pretty font-serif text-[clamp(1.0625rem,1.7vw,1.3125rem)] leading-[1.55] text-ink-inverse-muted">
            {standfirst}
          </p>
        </Reveal>
      </Column>
    </Band>
  );
}
