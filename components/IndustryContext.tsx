import { Reveal } from "@/components/shared/AnimatedContainer";
import { Band, Column } from "@/components/shared/Section";
import {
  Kicker,
  MarginNote,
  Prose,
} from "@/components/shared/Typography";

/**
 * The conditions before the story starts. Without this the four turning points
 * read as a company being clever rather than a company being early.
 */
export function IndustryContext() {
  return (
    <Band as="section" tone="sunken" className="py-[12vh]">
      <Column>
        <Reveal>
          <Kicker>Before the story</Kicker>
        </Reveal>

        <Reveal delay={0.05}>
          <Prose className="mt-6">
            For most of the 2000s, the economics of computing were set by
            Intel. General-purpose processors improved predictably, and the
            sensible thing for any software problem was to wait for the next
            generation of CPUs rather than to rewrite the problem. Graphics
            processors were specialised parts for a specialised market, bought
            almost entirely by people who played games.
          </Prose>
        </Reveal>

        <Reveal delay={0.1}>
          <Prose className="mt-6">
            Two things changed that. The first was physical: single-thread
            processor performance stopped improving at its historical rate, so
            work that needed to go faster had to be made parallel. The second
            was that a particular class of problem — training neural networks —
            turned out to consist almost entirely of matrix multiplication,
            which is exactly what a GPU already did tens of thousands of times
            per frame.
          </Prose>
        </Reveal>

        <Reveal delay={0.15}>
          <Prose className="mt-6">
            The demonstration came in 2012, when AlexNet won the ImageNet
            competition using two consumer NVIDIA graphics cards. It was not a
            product NVIDIA had designed for that purpose. It was a product that
            happened to be programmable, because six years earlier the company
            had decided to make it so.
          </Prose>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <MarginNote label="A note on fiscal years">
            NVIDIA&rsquo;s fiscal year ends in late January and runs
            approximately a year ahead of the calendar — fiscal 2027 began in
            January 2026. Charts in this piece are plotted on calendar dates;
            fiscal labels appear in tooltips, where there is room to
            disambiguate.
          </MarginNote>
        </Reveal>
      </Column>
    </Band>
  );
}
