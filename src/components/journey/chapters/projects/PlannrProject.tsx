import { plannr } from "@/content/projects";
import { SceneFallback } from "../../fallback/SceneFallback";
import { PlannrMotion } from "./PlannrMotion";
import styles from "./PlannrProject.module.css";

/**
 * Plannr scene. A tall block whose sticky frame holds the copy, the workflow
 * as a numbered list (so the process reads without motion), and a stage the
 * canvas fills: syllabus page, review column, calendar.
 */
export function PlannrProject() {
  return (
    <div className={styles.block} data-scene="plannr">
      <div className={styles.frame} data-sticky>
        <div
          aria-hidden="true"
          className={styles.stage}
          data-scene-anchor="plannr"
        >
          <div className={styles.zone} data-plannr-zone="page" />
          <div className={styles.zone} data-plannr-zone="page-end" />
          <div className={styles.zone} data-plannr-zone="review" />
          <div className={styles.zone} data-plannr-zone="calendar" />
          <SceneFallback scene="plannr" />
        </div>
        <article className={styles.copy} aria-labelledby="plannr-heading">
          <h3 id="plannr-heading" className={styles.title}>
            <span className={styles.titleInner} data-plannr-title>
              {plannr.title}
            </span>
          </h3>
          <p className={styles.summary}>{plannr.summary}</p>
          <ol className={styles.steps}>
            {plannr.steps.map((step, index) => (
              <li key={step} className={styles.step} data-plannr-step={index}>
                <span aria-hidden="true" className={styles.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className={styles.meta}>
            <span>{plannr.stack.join(" / ")}</span>
            <span>{plannr.status}</span>
            <a className={styles.link} href={plannr.href}>
              {plannr.linkLabel}
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
          <p className={styles.origin}>{plannr.origin}</p>
        </article>
      </div>
      <PlannrMotion />
    </div>
  );
}
