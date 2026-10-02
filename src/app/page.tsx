import { JourneyCanvas } from "@/components/journey/canvas/JourneyCanvas";
import { HeroChapter } from "@/components/journey/chapters/hero/HeroChapter";
import { ProjectsChapter } from "@/components/journey/chapters/projects/ProjectsChapter";
import { ChapterNavigator } from "@/components/journey/navigation/ChapterNavigator";
import { MeasuredUnits } from "@/components/journey/units/MeasuredUnits";
import { chapters } from "@/content/navigation";
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
        {/* P0 structural placeholders until their chapters are designed. */}
        {chapters
          .filter(
            (chapter) => chapter.id !== "name" && chapter.id !== "projects",
          )
          .map((chapter) => {
            const headingId = `${chapter.id}-heading`;
            return (
              <section
                key={chapter.id}
                id={chapter.id}
                aria-labelledby={headingId}
                className={styles.chapter}
              >
                <h2 id={headingId}>{chapter.label}</h2>
              </section>
            );
          })}
      </main>
      <MeasuredUnits />
      <JourneyCanvas />
    </>
  );
}
