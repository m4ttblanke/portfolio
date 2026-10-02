import { profile } from "@/content/profile";
import { HeroMotion } from "./HeroMotion";
import styles from "./HeroChapter.module.css";

/** 01 — Name. Server-rendered identity composition. */
export function HeroChapter() {
  return (
    <section id="name" aria-labelledby="name-heading" className={styles.hero}>
      <p className={styles.descriptor}>
        {profile.descriptor.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      {/* Stage for the identity relief, rendered by the persistent canvas. */}
      <div
        aria-hidden="true"
        className={styles.object}
        data-scene-anchor="hero"
      />

      <h1 id="name-heading" className={styles.name}>
        <span className={styles.first} data-name-line="first">
          {profile.firstName}
        </span>{" "}
        <span className={styles.last} data-name-line="last">
          {profile.lastName}
        </span>
      </h1>
      <HeroMotion />
    </section>
  );
}
