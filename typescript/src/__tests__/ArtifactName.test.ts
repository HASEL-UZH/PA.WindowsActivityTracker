import { expect, test } from "@jest/globals";
import { determineArtifactName } from "../determineArtifactName";

test.each([
  [
    "extracts a document filename from a Microsoft Word title",
    "Howrse_Zubbelplan.docx - Word",
    "Microsoft Word",
    undefined,
    "Howrse_Zubbelplan.docx"
  ],
  [
    "extracts a filename from a Windows path",
    "C:\\DATA\\DEV\\UZH\\PersonalAnalytics\\src\\electron\\database.sqlite - DB Browser for SQLite",
    "DB Browser for SQLite",
    undefined,
    "database.sqlite"
  ],
  [
    "uses the visited website when a URL is available",
    "Pull request review - GitHub - Microsoft Edge",
    "Microsoft Edge",
    "https://github.com/HASEL-UZH/PersonalAnalytics/pull/561",
    "github.com"
  ],
  ["does not store an application-only window as an artifact", "Task Manager", "Task Manager", undefined, undefined],
  ["does not store generic browser titles as artifacts", "New Tab - Google Chrome", "Google Chrome", undefined, undefined]
])("%s", (_name, windowTitle, processName, url, expected) => {
  expect(determineArtifactName(windowTitle, processName, url)).toBe(expected);
});
