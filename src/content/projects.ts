/*
 * Flagship project content. Copy is the working direction from
 * docs/CONTENT.md; links are added only once verified.
 */
export const rankle = {
  id: "rankle",
  title: "Rankle",
  summary: "A daily ranking game built for arguments with friends.",
  stack: ["Next.js", "Supabase"],
  href: "https://rankle.io",
  linkLabel: "rankle.io",
} as const;

/*
 * Verified in the Plannr repository (README, docs/): iOS app that parses
 * syllabi; extracted events are reviewed (accept / decline / edit) before
 * syncing to Google Calendar; Swift/SwiftUI + Python/FastAPI; free TestFlight
 * beta via tryplannr.app; originally a UCSB team class project.
 */
export const plannr = {
  id: "plannr",
  title: "Plannr",
  summary: "Drop in a syllabus. Review the dates. Get back a calendar.",
  steps: ["Syllabus", "Dates", "Review", "Calendar"],
  stack: ["SwiftUI", "FastAPI"],
  status: "Free TestFlight beta",
  origin: "Began as a UCSB team project.",
  href: "https://tryplannr.app",
  linkLabel: "tryplannr.app",
} as const;
