import { JourneyCanvas } from "@/components/journey/canvas/JourneyCanvas";
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
      <main id="main" tabIndex={-1} className={styles.main}>
        {chapters.map((chapter) => {
          const headingId = `${chapter.id}-heading`;
          return (
            <section
              key={chapter.id}
              id={chapter.id}
              aria-labelledby={headingId}
              className={styles.chapter}
            >
              {chapter.id === "name" ? (
                <h1 id={headingId}>Matthew Blanke</h1>
              ) : (
                <h2 id={headingId}>{chapter.label}</h2>
              )}
            </section>
          );
        })}
      </main>
      <JourneyCanvas />
    </>
  );
}
