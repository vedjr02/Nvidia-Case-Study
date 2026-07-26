import { ChapterNav } from "@/components/ChapterNav";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { Hero } from "@/components/Hero";
import { IndustryContext } from "@/components/IndustryContext";
import { Intro } from "@/components/Intro";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Sources } from "@/components/Sources";
import { TurningPointFour } from "@/components/TurningPointFour";
import { TurningPointOne } from "@/components/TurningPointOne";
import { TurningPointThree } from "@/components/TurningPointThree";
import { TurningPointTwo } from "@/components/TurningPointTwo";
import { StoryClockProvider } from "@/lib/story-clock";

export default function Page() {
  return (
    <StoryClockProvider>
      <ReadingProgress />
      <ChapterNav />

      <main id="story">
        <Hero />
        <Intro />
        <IndustryContext />

        <TurningPointOne />
        <TurningPointTwo />
        <TurningPointThree />
        <TurningPointFour />

        <KeyTakeaways />
        <ExecutiveSummary />
        <Sources />
      </main>
    </StoryClockProvider>
  );
}
