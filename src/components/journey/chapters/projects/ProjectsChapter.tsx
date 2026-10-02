import { chapters } from "@/content/navigation";
import { PlannrProject } from "./PlannrProject";
import { RankleProject } from "./RankleProject";
import styles from "./ProjectsChapter.module.css";

const chapter = chapters.find((entry) => entry.id === "projects")!;

/** 02 — Projects. The flagship scenes, Rankle then Plannr. */
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
      <PlannrProject />
    </section>
  );
}
