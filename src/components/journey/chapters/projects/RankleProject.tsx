import type { ReactNode } from "react";
import { rankle } from "@/content/projects";
import { RankleMotion } from "./RankleMotion";
import styles from "./RankleProject.module.css";

/**
 * Rankle scene (P1: arrival only). A tall block whose sticky frame holds the
 * copy and the stage the kit's plates land in. The chapter heading rides in
 * the frame so it stays visible while the scene is held.
 */
export function RankleProject({ heading }: { heading: ReactNode }) {
  return (
    <div className={styles.block} data-scene="rankle">
      <div className={styles.frame} data-sticky>
        {heading}
        <article className={styles.copy} aria-labelledby="rankle-heading">
          <h3 id="rankle-heading" className={styles.title}>
            <span className={styles.titleInner} data-rankle-title>
              {rankle.title}
            </span>
          </h3>
          <p className={styles.summary}>{rankle.summary}</p>
          <p className={styles.meta}>{rankle.stack.join(" / ")}</p>
        </article>
        <div
          aria-hidden="true"
          className={styles.stage}
          data-scene-anchor="rankle"
        />
      </div>
      <RankleMotion />
    </div>
  );
}
