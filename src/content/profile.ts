/** Hero identity content. */
export const profile = {
  firstName: "Matthew",
  lastName: "Blanke",
  descriptor: ["Software / Product"],
  /*
   * One quiet context line beside the name (school, degree, expected
   * graduation; verified in src/content/education.ts). The degree carries
   * "Computer Science", so the descriptor no longer repeats it.
   */
  context: ["UC Santa Barbara", "B.S. Computer Science", "June 2027"],
} as const;
