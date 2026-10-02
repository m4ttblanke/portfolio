import { JourneyCanvas } from "@/components/journey/canvas/JourneyCanvas";
import { HeroChapter } from "@/components/journey/chapters/hero/HeroChapter";
import { ChapterNavigator } from "@/components/journey/navigation/ChapterNavigator";
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
        {/* P0 structural placeholders until their chapters are designed. */}
        {chapters
          .filter((chapter) => chapter.id !== "name")
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
      <JourneyCanvas />
    </>
  );
}
