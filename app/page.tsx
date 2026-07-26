import { Hero } from "@/components/Hero";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TurningPointTwo } from "@/components/TurningPointTwo";
import { StoryClockProvider } from "@/lib/story-clock";

export default function Page() {
  return (
    <StoryClockProvider>
      <ReadingProgress />
      <main id="story">
        <Hero />
        <TurningPointTwo />
      </main>
    </StoryClockProvider>
  );
}
