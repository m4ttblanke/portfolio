import { profile } from "@/content/profile";
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

      {/* Reserved stage for the identity object (P1 checkpoint D). */}
      <div aria-hidden="true" className={styles.object} />

      <h1 id="name-heading" className={styles.name}>
        <span className={styles.first}>{profile.firstName}</span>{" "}
        <span className={styles.last}>{profile.lastName}</span>
      </h1>
    </section>
  );
}
