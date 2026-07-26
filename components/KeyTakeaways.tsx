import { RevealGroup, RevealItem } from "@/components/shared/AnimatedContainer";
import { Band, Column } from "@/components/shared/Section";
import { Kicker, Prose } from "@/components/shared/Typography";

const LESSONS = [
  {
    title: "Platform investments look like waste until they don't",
    body: "CUDA earned almost nothing for the better part of a decade while consuming a meaningful share of a much smaller company's R&D. The test of such an investment is not whether it pays soon, but whether it compounds outside your own organisation. Switching costs accumulating in customers' codebases cannot be bought back by a competitor.",
  },
  {
    title: "Distinguish demand you can keep from demand you cannot",
    body: "The cryptocurrency cycle of 2017–18 flattered NVIDIA's numbers and then removed 46 per cent of gaming revenue in a single quarter. The company was penalised by the SEC for not making the composition of that growth clear. Management teams that cannot decompose their own growth cannot forecast it — and neither can their investors.",
  },
  {
    title: "Check the date before accepting the cause",
    body: "NVIDIA's data-centre business passed gaming permanently in May 2022, six months before ChatGPT was released. The popular account inverts the sequence. A transformation that is visible in the financials before its supposed trigger had a different cause, and the difference matters when drawing lessons from it.",
  },
  {
    title: "Rising price with rising volume identifies a bottleneck",
    body: "Gross margin expanding from 64.6 to 78.4 per cent while unit demand was also rising is not operating leverage; it is the absence of a substitute. That condition is valuable and inherently temporary, so the useful question is always what would end it — and in this case the answer was custom silicon and export policy, not a better GPU.",
  },
  {
    title: "Owning a market changes which risks you carry",
    body: "NVIDIA's principal exposures are now the capital budgets of four companies, the direction of US export policy, and the possibility that inference migrates to cheaper custom accelerators. None of these is a competitive threat in the conventional sense. Infrastructure businesses trade competitive risk for macroeconomic and political risk.",
  },
  {
    title: "Eventually, growth becomes the expectation",
    body: "NVIDIA reported 85 per cent year-on-year revenue growth in May 2026 and the shares fell. A company can outperform every operational measure and still disappoint, because the valuation has already assumed the outperformance. This is the ordinary endpoint of a re-rating, and it arrives without warning.",
  },
];

export function KeyTakeaways() {
  return (
    <Band as="section" tone="sunken" className="py-[14vh]" id="lessons">
      <Column width="wide">
        <Kicker>What transfers</Kicker>
        <h2 className="mt-6 max-w-[20ch] text-balance font-serif text-[clamp(1.875rem,4vw,3rem)] font-normal leading-[1.06] tracking-[-0.024em]">
          Six lessons that survive outside the semiconductor industry
        </h2>
        <p className="mt-6 max-w-[52ch] font-sans text-[0.9375rem] leading-[1.6] text-ink-muted">
          NVIDIA&rsquo;s growth rate is not a template — it depended on a
          once-in-a-generation shift in what computers are asked to do. The
          decision-making underneath it is more portable.
        </p>

        <RevealGroup
          className="mt-16 grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-2"
          stagger={0.06}
        >
          {LESSONS.map((lesson, index) => (
            <RevealItem key={lesson.title}>
              <article className="border-t border-t-rule-strong pt-6">
                <span className="tabular font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 max-w-[26ch] text-balance font-serif text-[1.3125rem] font-semibold leading-[1.28] tracking-[-0.012em]">
                  {lesson.title}
                </h3>
                <Prose className="mt-4 text-[1.0625rem] leading-[1.65] text-ink-secondary">
                  {lesson.body}
                </Prose>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Column>
    </Band>
  );
}
