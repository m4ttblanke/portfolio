import type { ReactNode } from "react";
import { rankle } from "@/content/projects";
import { SceneFallback } from "../../fallback/SceneFallback";
import { TIERS } from "../../scenes/rankle/ranklePose";
import { RankleMotion } from "./RankleMotion";
import styles from "./RankleProject.module.css";

/**
 * Rankle scene. A tall block whose sticky frame holds the copy and a stage of
 * two tier boards — yours and a friend's — that the canvas fills with the same
 * items in different tiers. The stage is decorative; the copy carries meaning.
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
          <p className={styles.meta}>
            <span>{rankle.stack.join(" / ")}</span>
            <a className={styles.link} href={rankle.href}>
              {rankle.linkLabel}
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
        </article>
        <div
          aria-hidden="true"
          className={styles.stage}
          data-scene-anchor="rankle"
        >
          <span className={styles.boardLabel} data-board="you">
            You
          </span>
          <span className={styles.boardLabel} data-board="friend">
            A friend
          </span>
          {TIERS.map((tier, row) => (
            <span
              key={tier}
              className={styles.tier}
              style={{ gridRow: row + 2 }}
            >
              {tier}
            </span>
          ))}
          <div className={styles.board} data-rankle-board="you" />
          <div className={styles.board} data-rankle-board="friend" />
          <SceneFallback scene="rankle" />
        </div>
      </div>
      <RankleMotion />
    </div>
  );
}
