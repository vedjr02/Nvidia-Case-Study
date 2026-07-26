import { HeroCurve } from "@/components/HeroCurve";
import { ScrollCue } from "@/components/ScrollCue";
import { MaskReveal, Reveal } from "@/components/shared/AnimatedContainer";
import { Band, Column } from "@/components/shared/Section";
import { Kicker } from "@/components/shared/Typography";

/**
 * The opening.
 *
 * No hero image, no call to action, no navigation bar. A kicker, a title, a
 * standfirst, and the actual subject of the piece drawn behind them. The reader
 * should understand within two seconds that this is something to read.
 */
export function Hero() {
  return (
    <Band
      tone="pitch"
      as="header"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pb-[26svh] pt-[16svh]"
    >
      <HeroCurve />

      <Column width="broad" className="relative z-10">
        <MaskReveal delay={0.15}>
          <Kicker tone="pitch">Business analytics case study</Kicker>
        </MaskReveal>

        <h1 className="mt-7 max-w-[18ch] font-serif text-[clamp(2.75rem,7.6vw,6.25rem)] font-normal leading-[0.98] tracking-[-0.03em] text-ink-inverse">
          <MaskReveal delay={0.3}>How NVIDIA Became</MaskReveal>
          <MaskReveal delay={0.42}>the Backbone of</MaskReveal>
          <MaskReveal delay={0.54}>the AI Economy</MaskReveal>
        </h1>

        <Reveal delay={0.9} className="mt-9 max-w-[46ch]">
          <p className="text-pretty font-serif text-[clamp(1.125rem,1.9vw,1.4375rem)] leading-[1.5] text-ink-inverse-muted">
            The strategic decisions, financial performance and industry shifts
            that turned a graphics-card manufacturer into the company the rest
            of the technology industry now builds on top of.
          </p>
        </Reveal>

        <Reveal delay={1.15} className="mt-12">
          <p className="max-w-[52ch] font-sans text-[0.75rem] leading-[1.7] text-ink-inverse-muted/70">
            Behind: NVIDIA&rsquo;s split-adjusted closing share price, monthly,
            January 2015 to June 2026, on a linear scale. Marked points are the
            first close above each trillion-dollar valuation. Source: Yahoo
            Finance; Reuters.
          </p>
        </Reveal>
      </Column>

      <ScrollCue />
    </Band>
  );
}
