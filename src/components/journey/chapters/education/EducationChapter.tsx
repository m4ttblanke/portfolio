import {
  education,
  otherCredentials,
  type Credential,
} from "@/content/education";
import { ChapterLabel } from "../ChapterLabel";
import styles from "./EducationChapter.module.css";

/** 04 — Education. Gate 0 skeleton: facts, hierarchy and reading order. */
export function EducationChapter() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className={styles.chapter}
    >
      <ChapterLabel id="education" />
      <div className={styles.lines}>
        {education.map((line) => (
          <div key={line.id} className={styles.line}>
            <h3 className={styles.title}>{line.title}</h3>
            <ul className={styles.credentials}>
              {line.credentials.map((credential) => (
                <li key={credential.title}>
                  <CredentialText credential={credential} />
                </li>
              ))}
            </ul>
            <p className={styles.meta}>Selected areas</p>
            <ul className={styles.areas}>
              {line.areas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
            {"note" in line && <p className={styles.note}>{line.note}</p>}
          </div>
        ))}
      </div>
      <ul className={styles.other}>
        {otherCredentials.map((credential) => (
          <li key={credential.title}>
            <CredentialText credential={credential} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CredentialText({ credential }: { credential: Credential }) {
  const { title, institution, date } = credential;
  return (
    <>
      <span className={styles.credential}>{title}</span>, {institution},{" "}
      {date.iso ? <time dateTime={date.iso}>{date.label}</time> : date.label}
    </>
  );
}
