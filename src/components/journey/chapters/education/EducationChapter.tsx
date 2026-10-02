import {
  education,
  otherCredentials,
  type Credential,
} from "@/content/education";
import { ChapterLabel } from "../ChapterLabel";
import styles from "./EducationChapter.module.css";

/**
 * 04 — Education. Four academic areas set as three monumental lines that
 * form one block; each line's Archivo width is tuned so the three share a
 * measure. Credentials sit in a ruled margin beside their line, and the areas
 * (plus the honors note) are glossed in the gap beneath it. Static: no motion.
 */
export function EducationChapter() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className={styles.chapter}
    >
      <ChapterLabel id="education" />
      <div className={styles.block}>
        {education.map((line) => (
          <div key={line.id} className={styles.area} data-area={line.id}>
            <h3 className={styles.title}>
              <span className={styles.phrase}>{line.titleLines[0]}</span>{" "}
              <span className={styles.phrase}>{line.titleLines[1]}</span>
            </h3>
            <div className={styles.margin}>
              {groupByPlace(line.credentials).map((group) => (
                <p key={group.titles.join()} className={styles.credential}>
                  {group.titles.map((title) => (
                    <span key={title} className={styles.degree}>
                      {title}{" "}
                    </span>
                  ))}
                  <span className={styles.place}>{group.institution} </span>
                  <span className={styles.place}>
                    <DateText date={group.date} />
                  </span>
                </p>
              ))}
            </div>
            <div className={styles.gloss}>
              <ul className={styles.areas}>
                {line.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
              {"note" in line && <p className={styles.note}>{line.note}</p>}
            </div>
          </div>
        ))}
        <p className={styles.colophon}>
          {otherCredentials.map(({ title, institution, date }) => (
            <span key={title}>
              Also {title}, {institution}, <DateText date={date} />
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function DateText({ date }: { date: Credential["date"] }) {
  return date.iso ? <time dateTime={date.iso}>{date.label}</time> : date.label;
}

/** Credentials from one institution on one date share a single place line. */
function groupByPlace(credentials: readonly Credential[]) {
  const groups: {
    titles: string[];
    institution: string;
    date: Credential["date"];
  }[] = [];
  for (const { title, institution, date } of credentials) {
    const last = groups.at(-1);
    if (
      last &&
      last.institution === institution &&
      last.date.label === date.label
    ) {
      last.titles.push(title);
    } else {
      groups.push({ titles: [title], institution, date });
    }
  }
  return groups;
}
