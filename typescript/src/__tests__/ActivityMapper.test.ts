import { expect, test } from "@jest/globals";
import Activity from "../types/Activity";
import determineActivity from "../determineActivity";

/**
 * The structure of this test array is as follows
 * Index 1: Process string
 * Index 2: Window title string
 * Index 3: The to be expected activity
 */
const cases = [
  ["", "", Activity.Unknown],
  [undefined, undefined, Activity.Unknown],
  ["___", undefined, Activity.Unknown],
  [undefined, "___", Activity.Unknown],
  ["___", "___", Activity.Unknown],
  ["idle", undefined, Activity.Idle],
  ["idle", "Not Idle", Activity.Idle],
  ["something", "Task view", Activity.Unknown], // process-first: title only checked for browsers/editors
  ["trello", "Trello", Activity.Planning],
  ["taskmgr", "Task Manager", Activity.Other],
  ["mail", "mail", Activity.Email],
  ["vim", ".ts", Activity.DevCode],
  ["vim", "___", Activity.DevCode],
  ["rstudio", "", Activity.DevCode],
  ["firefox", ".ts", Activity.DevCode],
  ["debug", "debug", Activity.DevDebug],
  ["gerrit", "code review", Activity.DevReview],
  ["diff", "diff", Activity.DevVc],
  ["vim", "", Activity.ReadWriteDocument],
  ["vim", "new file", Activity.ReadWriteDocument],
  ["vim", "vim", Activity.ReadWriteDocument],
  ["confluence", "", Activity.ReadWriteDocument],
  ["messenger", "messenger", Activity.InstantMessaging],
  ["firefox", "messenger", Activity.InstantMessaging],
  ["firefox", "linkedin", Activity.WorkRelatedBrowsing],
  ["firefox", "", Activity.WorkRelatedBrowsing],
  ["firefox", "facebook", Activity.SocialMedia],
  ["explorer", "", Activity.FileManagement],
  ["finder", "", Activity.FileManagement],
  ["vmware", "", Activity.OtherRdp],
  ["battle.net", "", Activity.Unknown],
  ["searchui", "", Activity.FileManagement],
  ["DB Browser for SQLite", "DB Browser for SQLite - C:\DATA\DEV\UZH\PersonalAnalytics\src\electron\database.sqlite", Activity.DevCode],
  ["Visual Studio Code", "[Claude Code] c:\DATA\DEV\UZH\PA.WindowsActivityTracker\typescript\src\index.ts (index.ts) - PA.WindowsActivityTracker - Visual Studio Code", Activity.GenerativeAI], 
  ["Visual Studio Code", "c:\DATA\DEV\UZH\PA.WindowsActivityTracker\typescript\src\index.ts (index.ts) - PA.WindowsActivityTracker - Visual Studio Code", Activity.DevCode], 
  ["Task Manager", "Task Manager", Activity.Other],
  ["Microsoft Word", "Howrse_Zubbelplan.docx - Word", Activity.ReadWriteDocument],
  ["Microsoft Word", "wyaehb", Activity.ReadWriteDocument],
  ["freemail", "", Activity.Email],
  ["Microsoft Teams", "Chat | <name> | <tenant> | <user> | Microsoft Teams", Activity.InstantMessaging],
  ["PowerPoint", "AI_Augmented_Developer.pptx", Activity.ReadWriteDocument]
];

test.each(cases)(
  ".determineActivity(%p, %p, %p)",
  function (
    process: string | undefined,
    windowTitle: string | undefined,
    activity: Activity | string | undefined
  ) {
    expect(determineActivity(windowTitle, process)).toBe(activity);
  }
);
