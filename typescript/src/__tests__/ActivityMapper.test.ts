import { expect, test } from "@jest/globals";
import Activity from "../types/Activity";
import determineActivity from "../determineActivity";

/**
 * The structure of this test array is as follows
 * Index 0: expected activity
 * Index 1: processName string
 * Index 2: windowTitle string
 * Index 3: processPath string (optional)
 */
const cases: [Activity, string | undefined, string | undefined, string?][] = [
  [Activity.Unknown, "", "", undefined],
  [Activity.Unknown, undefined, undefined, undefined],
  [Activity.Unknown, "___", undefined, undefined],
  [Activity.Unknown, undefined, "___", undefined],
  [Activity.Unknown, "___", "___", undefined],
  [Activity.Idle, "idle", undefined, undefined],
  [Activity.Idle, "idle", "Not Idle", undefined],
  [Activity.Unknown, "something", "Task view", undefined], // process-first: title only checked for browsers/editors
  [Activity.Planning, "trello", "Trello", undefined],
  [Activity.Other, "taskmgr", "Task Manager", undefined],
  [Activity.Email, "mail", "mail", undefined],
  [Activity.DevCode, "vim", ".ts", undefined],
  [Activity.DevCode, "vim", "___", undefined],
  [Activity.DevCode, "rstudio", "", undefined],
  [Activity.DevCode, "firefox", ".ts", undefined],
  [Activity.DevDebug, "debug", "debug", undefined],
  [Activity.DevReview, "gerrit", "code review", undefined],
  [Activity.DevVc, "diff", "diff", undefined],
  [Activity.ReadWriteDocument, "vim", "", undefined],
  [Activity.ReadWriteDocument, "vim", "new file", undefined],
  [Activity.ReadWriteDocument, "vim", "vim", undefined],
  [Activity.ReadWriteDocument, "confluence", "", undefined],
  [Activity.InstantMessaging, "messenger", "messenger", undefined],
  [Activity.InstantMessaging, "firefox", "messenger", undefined],
  [Activity.WorkRelatedBrowsing, "firefox", "linkedin", undefined],
  [Activity.WorkRelatedBrowsing, "firefox", "", undefined],
  [Activity.SocialMedia, "firefox", "facebook", undefined],
  [Activity.FileManagement, "explorer", "", undefined],
  [Activity.FileManagement, "finder", "", undefined],
  [Activity.OtherRdp, "vmware", "", undefined],
  [Activity.Unknown, "battle.net", "", undefined],
  [Activity.FileManagement, "searchui", "", undefined],
  [Activity.DevCode, "DB Browser for SQLite", "DB Browser for SQLite - C:\\DATA\\DEV\\UZH\\PersonalAnalytics\\src\\electron\\database.sqlite", undefined],
  [Activity.GenerativeAI, "Visual Studio Code", "[Claude Code] c:\\DATA\\DEV\\UZH\PA.WindowsActivityTracker\\typescript\\src\\index.ts (index.ts) - PA.WindowsActivityTracker - Visual Studio Code", undefined],
  [Activity.DevCode, "Visual Studio Code", "c:\\DATA\\DEV\\UZH\\PA.WindowsActivityTracker\\typescript\\src\\index.ts (index.ts) - PA.WindowsActivityTracker - Visual Studio Code", undefined],
  [Activity.DevReview, "Microsoft Edge", "Pull Request #31 · HASEL-UZH/PA.WindowsActivityTracker and 2 more pages - HASEL - Microsoft Edge", undefined],
  [Activity.Other, "Task Manager", "Task Manager", undefined],
  [Activity.ReadWriteDocument, "Microsoft Word", "Howrse_Zubbelplan.docx - Word", undefined],
  [Activity.ReadWriteDocument, "Microsoft Word", "wyaehb", undefined],
  [Activity.Email, "freemail", "", undefined],
  [Activity.InstantMessaging, "Microsoft Teams", "Chat | <name> | <tenant> | <user> | Microsoft Teams", undefined],
  [Activity.ReadWriteDocument, "PowerPoint", "AI_Augmented_Developer.pptx", undefined],
  [Activity.FileManagement, "File Explorer", "electron - File Explorer", undefined],
  [Activity.FileManagement, "Windows 资源管理器", "", "C:\\Windows\\explorer.exe"],
  [Activity.ReadWriteDocument, "Vorschau", "_MG_5020.jpg", "/System/Applications/Preview.app"],
  [Activity.Planning, "Erinnerungen", "Erinnerungen", "/System/Applications/Reminders.app"],
  [Activity.ReadWriteDocument, "RemNote", "", "C:\\Program Files\\RemNote\\RemNote.exe"],
  [Activity.ReadWriteDocument, "Notion", "", "C:\\Users\\username\\AppData\\Local\\Programs\\Notion\\Notion.exe"],
  [Activity.Planning, "Safari", "Google Kalender - Woche vom 27. Oktober 2025", undefined],
  [Activity.ReadWriteDocument, "Microsoft Edge", "AI-TRACE: Tracking Real-World AI Use from Computer Events - Online LaTeX Editor Overleaf and 3 more pages", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"]
];

test.each(cases)(
  ".determineActivity(%p, %p, %p, %p)",
  function (activity, process, windowTitle, processPath) {
    expect(determineActivity(windowTitle, process, processPath || undefined)).toBe(activity);
  }
);
