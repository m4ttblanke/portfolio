import { experience, type ExperienceEntry } from "@/content/experience";
import { ChapterLabel } from "../ChapterLabel";
import styles from "./ExperienceChapter.module.css";

/** 03 — Experience. Gate 0 skeleton: facts, hierarchy and reading order. */
export function ExperienceChapter() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className={styles.chapter}
    >
      <ChapterLabel id="experience" />
      <ol className={styles.entries}>
        {experience.map((entry) => (
          <li key={entry.id} className={styles.entry}>
            <h3 className={styles.organization}>{entry.organization}</h3>
            <p className={styles.meta}>{entry.kindLabel}</p>
            <p className={styles.role}>{entry.role}</p>
            <p className={styles.meta}>
              <Period entry={entry} />
            </p>
            <p className={styles.signal}>{entry.signal}</p>
            {"link" in entry && (
              <a className={styles.link} href={entry.link.href}>
                {entry.link.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Period({ entry }: { entry: ExperienceEntry }) {
  const { start, end } = entry;
  const from = <time dateTime={start.iso}>{start.label}</time>;
  if (end === null) return from;
  return (
    <>
      {from} –{" "}
      {end === "present" ? (
        "Present"
      ) : (
        <time dateTime={end.iso}>{end.label}</time>
      )}
    </>
  );
}
