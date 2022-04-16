import includeRegExp from "./includeRegExp";

test("includeRegExp", () => {
  expect(
    "https://groundfloor.atlassian.net/jira/software/c/projects/SA/boards/46",
  ).toMatch(includeRegExp);
  expect(
    "https://groundfloor.atlassian.net/jira/software/c/projects/SA/boards/46?selectedIssue=SA-1155",
  ).toMatch(includeRegExp);
  expect(
    "https://groundfloor.atlassian.net/jira/software/c/projects/SA/boards/468",
  ).not.toMatch(includeRegExp);
});
