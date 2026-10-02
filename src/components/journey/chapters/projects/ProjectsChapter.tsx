import { ChapterLabel } from "../ChapterLabel";
import { PlannrProject } from "./PlannrProject";
import { RankleProject } from "./RankleProject";
import styles from "./ProjectsChapter.module.css";

/** 02 — Projects. The flagship scenes, Rankle then Plannr. */
export function ProjectsChapter() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className={styles.projects}
    >
      <RankleProject heading={<ChapterLabel id="projects" />} />
      <PlannrProject />
    </section>
  );
}
