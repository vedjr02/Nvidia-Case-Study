import { ChapterOpener } from "@/components/ChapterOpener";
import { CudaDatapoints } from "@/components/charts/CudaDatapoints";
import { RndChart } from "@/components/charts/RndChart";
import { Reveal } from "@/components/shared/AnimatedContainer";
import { ChartWrapper } from "@/components/shared/ChartWrapper";
import { Band, Column } from "@/components/shared/Section";
import { Kicker, Prose, PullQuote } from "@/components/shared/Typography";

const RND_SOURCES = [
  {
    label: "SEC EDGAR XBRL, ResearchAndDevelopmentExpense (NVIDIA, AMD, Intel)",
    href: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001045810&type=10-K",
  },
];

export function TurningPointOne() {
  return (
    <>
      <ChapterOpener
        id="chapter-1"
        number="Chapter One"
        title="From Graphics Company to Computing Platform"
        standfirst="In 2006 NVIDIA began spending heavily to make its graphics chips programmable for work that had nothing to do with graphics. There was no market for it."
        period="2006 – 2016"
        beatDate="2006-11-08"
      />

      <Band as="section" labelledBy="chapter-1-title" className="py-16 sm:py-24">
        <Column>
          <Reveal>
            <Kicker>What happened</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              CUDA shipped in 2006 alongside the GeForce 8800. Technically it
              exposed the GPU&rsquo;s processing cores to general-purpose C code,
              letting them communicate and share data instead of only running a
              fixed graphics pipeline. Commercially it was a bet that someone
              would want to do this, and a decision to carry the cost of the
              software layer until they did.
            </Prose>
          </Reveal>
          <Reveal delay={0.1}>
            <Prose className="mt-6">
              The cost was not trivial. Every subsequent GPU had to carry silicon
              and validation effort for compute features that gamers did not use,
              and NVIDIA had to fund compilers, libraries, documentation and
              developer support for an audience measured in thousands.
            </Prose>
          </Reveal>
        </Column>

        <Column width="wide" className="mt-20">
          <ChartWrapper
            exhibit="Exhibit 1"
            question="What did it cost to hold a position in a market that did not exist?"
            unit="Annual research and development expense, US$ billions. NVIDIA fiscal years aligned to the calendar year they mostly cover."
            sources={RND_SOURCES}
            reading={
              <>
                In 2015 Intel spent roughly nine times what NVIDIA did in
                absolute terms. NVIDIA was nonetheless committing over a quarter
                of its own revenue to R&amp;D — $1.33bn against total revenue of
                $5.01bn. The absolute gap closed only in 2025, and as much
                because Intel cut its spending as because NVIDIA raised its own.
              </>
            }
          >
            <RndChart />
          </ChartWrapper>
        </Column>

        <Column className="mt-24">
          <Reveal>
            <Kicker>Why it mattered</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              The durable asset was never the chip. It was the accumulated
              body of code written against CUDA — libraries, frameworks, tuned
              kernels, and the training of the people who wrote them. A
              competitor can match a processor in a product cycle. Matching
              fifteen years of other people&rsquo;s software is a different
              problem, and it is the reason AMD&rsquo;s hardware has repeatedly
              been competitive on paper without displacing NVIDIA in practice.
            </Prose>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <PullQuote>
              Switching costs that accumulate in someone else&rsquo;s codebase
              are the most durable kind, because your competitor cannot buy them
              back.
            </PullQuote>
          </Reveal>
        </Column>

        <Column width="wide" className="mt-24">
          <ChartWrapper
            exhibit="Exhibit 1b"
            question="How large is the CUDA developer base?"
            unit="NVIDIA's own disclosures. Four figures over six years, each measuring something different."
            sources={[
              {
                label: "NVIDIA GTC and COMPUTEX keynotes; NVIDIA developer programme announcements",
                href: "https://www.nvidia.com/gtc/",
              },
            ]}
            reading={
              <>
                It is not possible to answer this precisely from public
                information, and that is worth stating rather than papering
                over. NVIDIA has never published a methodology, and the 2025
                figure counts everyone who has ever used CUDA rather than
                current users.
              </>
            }
          >
            <CudaDatapoints />
          </ChartWrapper>
        </Column>

        <Column className="mt-24">
          <Reveal>
            <Kicker>The lesson</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <Prose className="mt-6">
              A platform investment looks identical to waste right up until the
              market arrives. The distinguishing feature of a good one is not
              conviction about timing — NVIDIA did not predict the transformer
              architecture — but that the investment compounds in the hands of
              people outside the company. CUDA earned nothing for years. It was
              accruing switching costs the whole time.
            </Prose>
          </Reveal>
        </Column>
      </Band>
    </>
  );
}
