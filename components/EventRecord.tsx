import { TimelineChart } from "@/components/charts/TimelineChart";
import { Reveal } from "@/components/shared/AnimatedContainer";
import { ChartWrapper } from "@/components/shared/ChartWrapper";
import { Band, Column } from "@/components/shared/Section";
import { Kicker, Prose } from "@/components/shared/Typography";
import { timelineEvents } from "@/lib/data";

/**
 * The full event record, offered as evidence rather than narrative. A reader
 * who wants to check the argument against the sequence can do it here.
 */
export function EventRecord() {
  return (
    <Band as="section" className="py-[12vh]" id="record">
      <Column width="broad">
        <Reveal>
          <Kicker>The record</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-[22ch] text-balance font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-normal leading-[1.08] tracking-[-0.022em]">
            Twenty years, six kinds of event
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Prose className="mt-6 max-w-[58ch] text-ink-secondary">
            Every event below is sourced to a filing, a company announcement, a
            government publication or a wire service. Select any point to read
            what happened and why it mattered.
          </Prose>
        </Reveal>

        <div className="mt-16">
          <ChartWrapper
            exhibit="Exhibit 7"
            question="Did the strategy follow the market, or precede it?"
            unit={`${timelineEvents.length} sourced events, 2006 to July 2026, by category. Larger points are annotated elsewhere in this piece.`}
            sources={[
              {
                label: "NVIDIA newsroom, SEC filings, US Bureau of Industry and Security, Reuters and other wire services",
                href: "https://nvidianews.nvidia.com/",
              },
            ]}
            reading={
              <>
                The product lane starts in 2006 and runs almost alone for a
                decade. The ecosystem lane — the events that created the demand
                — does not become dense until 2022. The regulatory lane does not
                begin until 2022 and has not stopped since.
              </>
            }
          >
            <TimelineChart />
          </ChartWrapper>
        </div>
      </Column>
    </Band>
  );
}
