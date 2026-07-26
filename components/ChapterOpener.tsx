import { DrawRule } from "@/components/shared/DrawRule";
import {
  MaskRevealInView,
  Reveal,
} from "@/components/shared/AnimatedContainer";
import { Band, Column } from "@/components/shared/Section";
import { StoryBeat } from "@/lib/story-clock";

/**
 * The chapter break.
 *
 * A near-full-viewport dark band. The large numeral and title are the whole
 * composition — this is a magazine chapter page, not a thin divider with a
 * caption floating in empty space.
 */
export function ChapterOpener({
  id,
  number,
  title,
  standfirst,
  period,
  beatDate,
}: {
  id: string;
  number: string;
  title: string;
  standfirst: string;
  period: string;
  /** ISO date this chapter opens on, for the story clock. */
  beatDate: string;
}) {
  const numeralFromId = id.match(/(\d+)/)?.[1];
  const WORD_NUMERALS: Record<string, string> = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
  };
  const numeralFromWords = Object.entries(WORD_NUMERALS).find(([word]) =>
    number.toLowerCase().includes(word),
  )?.[1];
  const numeral = numeralFromId || numeralFromWords || "0";

  return (
    <Band
      tone="pitch"
      id={id}
      as="section"
      labelledBy={`${id}-title`}
      className="relative flex min-h-[88svh] scroll-mt-0 items-center overflow-hidden py-[14vh] sm:min-h-[92svh] sm:py-[16vh]"
    >
      {/* Atmospheric chapter numeral — fills the void so the band reads as a composed page. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-serif text-[clamp(14rem,48vw,30rem)] font-normal leading-none tracking-[-0.06em] text-ink-inverse/[0.09] sm:-right-10"
      >
        {numeral.padStart(2, "0")}
      </span>

      <StoryBeat id={id} date={beatDate} label={period} className="w-full">
        <Column width="wide" className="relative z-10">
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

          <DrawRule className="mt-5" delay={0.12} />

          <h2
            id={`${id}-title`}
            className="mt-8 max-w-[12ch] text-balance font-serif text-[clamp(3rem,8vw,6rem)] font-normal leading-[0.96] tracking-[-0.032em] text-ink-inverse sm:mt-10"
          >
            <MaskRevealInView delay={0.18}>{title}</MaskRevealInView>
          </h2>

          <Reveal delay={0.35} className="mt-8 max-w-[38ch] sm:mt-10">
            <p className="text-pretty font-serif text-[clamp(1.125rem,1.9vw,1.5rem)] leading-[1.5] text-ink-inverse-muted">
              {standfirst}
            </p>
          </Reveal>
        </Column>
      </StoryBeat>
    </Band>
  );
}
