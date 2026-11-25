import type { ReactNode } from "react";
import { rankle } from "@/content/projects";
import { SceneFallback } from "../../fallback/SceneFallback";
import { TIERS } from "../../scenes/rankle/ranklePose";
import { RankleMotion } from "./RankleMotion";
import styles from "./RankleProject.module.css";

/*
 * The navigator's "Rankle" lands this far through the hold, where the scene
 * is composed: both boards, all five labeled plates, the threads (RANKLE_KEYS
 * end at 0.8) and the prompt, before the hand-off to Plannr begins at 1.
 * "Projects" lands at the block top.
 */
const NAV_HOLD = 0.9;

/**
 * Rankle scene. A tall block whose sticky frame holds the copy and a stage of
 * two tier boards — yours and a friend's — that the canvas fills with the same
 * items in different tiers. The stage is decorative; the copy carries meaning.
 */
export function RankleProject({ heading }: { heading: ReactNode }) {
  return (
    <div
      id="rankle"
      className={styles.block}
      data-scene="rankle"
      data-nav-hold={NAV_HOLD}
      data-nav-focus="rankle-heading"
    >
      <div className={styles.frame} data-sticky>
        {heading}
        <article className={styles.copy} aria-labelledby="rankle-heading">
          <h3 id="rankle-heading" className={styles.title}>
            <span className={styles.titleInner} data-rankle-title>
              {rankle.title}
            </span>
          </h3>
          <p className={styles.summary}>{rankle.summary}</p>
          <p className={styles.visuallyHidden}>{rankle.comparison}</p>
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
          {/* Stage labels leave with the boards in the hand-off (PlannrMotion). */}
          <span className={styles.prompt} data-rankle-label>
            <span className={styles.promptInner} data-rankle-prompt>
              {rankle.example.prompt}
            </span>
          </span>
          <span
            className={styles.boardLabel}
            data-board="you"
            data-rankle-label
          >
            You
          </span>
          <span
            className={styles.boardLabel}
            data-board="friend"
            data-rankle-label
          >
            A friend
          </span>
          {TIERS.map((tier, row) => (
            <span
              key={tier}
              className={styles.tier}
              style={{ gridRow: row + 3 }}
              data-rankle-label
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
