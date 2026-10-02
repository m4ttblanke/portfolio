import type { CSSProperties } from "react";
import { experience, type ExperienceEntry } from "@/content/experience";
import { ChapterLabel } from "../ChapterLabel";
import { ExperienceMotion } from "./ExperienceMotion";
import { endOf, startOf, years } from "./time-field";
import styles from "./ExperienceChapter.module.css";

/*
 * Year labels too close to "Present" would collide with it; their hairlines
 * stay.
 */
const LABEL_LIMIT = 0.9;

/**
 * 03 — Experience. One shared time field, January 2022 → present. Each entry
 * hangs from its duration rule: rule length is the only encoding of time;
 * the names share one scale. Dates are always given as text. Below the field
 * breakpoint each entry carries its own full-width gauge on the same scale.
 */
export function ExperienceChapter() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className={styles.chapter}
    >
      <ChapterLabel id="experience" />

      <div className={styles.field}>
        {/* The shared scale: year hairlines through the band of rules. */}
        <div aria-hidden="true" className={styles.scale}>
          {years.map(({ year, at }) => (
            <span
              key={year}
              className={styles.year}
              style={{ "--at": at } as CSSProperties}
            >
              {at < LABEL_LIMIT && year}
            </span>
          ))}
          <span className={styles.present}>Present</span>
        </div>

        <ol className={styles.entries}>
          {experience.map((entry, index) => (
            <Entry key={entry.id} entry={entry} index={index} />
          ))}
        </ol>
      </div>
      <ExperienceMotion />
    </section>
  );
}

function Entry({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const start = startOf(entry.start.iso);
  const end = entry.end === "present" ? 1 : endOf(entry.end.iso);
  const style = {
    "--index": index,
    "--start": start,
    "--end": end,
  } as CSSProperties;

  return (
    <li className={styles.entry} data-kind={entry.kind} style={style}>
      {/* Duration rule; on narrow screens a gauge with its own scale. */}
      <div aria-hidden="true" className={styles.rule}>
        {years.slice(1).map(({ year, at }) => (
          <span
            key={year}
            className={styles.tick}
            style={{ "--at": at } as CSSProperties}
          />
        ))}
        <span
          className={styles.span}
          data-experience-span
          data-ongoing={entry.end === "present" || undefined}
        />
        <span className={styles.gaugeStart}>{years[0].year}</span>
        <span className={styles.gaugeEnd}>Present</span>
      </div>

      <div className={styles.text}>
        <h3 className={styles.organization}>
          {entry.organization}
          {entry.place && (
            <span className={styles.place}>
              <span className="visually-hidden">, </span>
              {entry.place}
            </span>
          )}
        </h3>
        <p className={styles.kind}>{entry.kindLabel}</p>
        <p className={styles.role}>{entry.role}</p>
        <p className={styles.dates}>
          <Period entry={entry} />
        </p>
        <p className={styles.signal}>{entry.signal}</p>
        {entry.link && (
          <a className={styles.link} href={entry.link.href}>
            {entry.link.label}
            <span aria-hidden="true"> ↗</span>
          </a>
        )}
      </div>
    </li>
  );
}

function Period({ entry }: { entry: ExperienceEntry }) {
  const { start, end, term } = entry;
  if (term) return <time dateTime={start.iso}>{term}</time>;
  return (
    <>
      <time dateTime={start.iso}>{start.label}</time> –{" "}
      {end === "present" ? (
        "Present"
      ) : (
        <time dateTime={end.iso}>{end.label}</time>
      )}
    </>
  );
}
