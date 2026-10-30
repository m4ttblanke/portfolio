import { JourneyCanvas } from "@/components/journey/canvas/JourneyCanvas";
import { ContactChapter } from "@/components/journey/chapters/contact/ContactChapter";
import { EducationChapter } from "@/components/journey/chapters/education/EducationChapter";
import { ExperienceChapter } from "@/components/journey/chapters/experience/ExperienceChapter";
import { HeroChapter } from "@/components/journey/chapters/hero/HeroChapter";
import { OffClockChapter } from "@/components/journey/chapters/off-clock/OffClockChapter";
import { ProjectsChapter } from "@/components/journey/chapters/projects/ProjectsChapter";
import { ChapterNavigator } from "@/components/journey/navigation/ChapterNavigator";
import { MeasuredUnits } from "@/components/journey/units/MeasuredUnits";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>
      <header>
        <ChapterNavigator />
      </header>
      <main id="main" tabIndex={-1}>
        <HeroChapter />
        <ProjectsChapter />
        <ExperienceChapter />
        <EducationChapter />
        <OffClockChapter />
        <ContactChapter />
      </main>
      <MeasuredUnits />
      <JourneyCanvas />
    </>
  );
}
