import { chapters } from "@/content/navigation";
import { RankleProject } from "./RankleProject";
import styles from "./ProjectsChapter.module.css";

const chapter = chapters.find((entry) => entry.id === "projects")!;

/** 02 — Projects. Flagship scenes; P1 currently ends at Rankle's arrival. */
export function ProjectsChapter() {
  return (
    <section
      id={chapter.id}
      aria-labelledby="projects-heading"
      className={styles.projects}
    >
      <RankleProject
        heading={
          <h2 id="projects-heading" className={styles.label}>
            <span aria-hidden="true" className={styles.number}>
              {chapter.number}
            </span>
            {chapter.label}
          </h2>
        }
      />
    </section>
  );
}
