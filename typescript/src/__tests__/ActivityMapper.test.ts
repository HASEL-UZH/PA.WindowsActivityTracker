import { expect, test } from "@jest/globals";
import Activity from "../types/Activity";
import { determineActivity } from "../index";

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
  ["something", "Task view", Activity.Planning],
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
  ["firefox", "facebook", Activity.WorkUnrelatedBrowsing],
  ["explorer", "", Activity.FileNavigationInExplorer],
  ["finder", "", Activity.FileNavigationInExplorer],
  ["vmware", "", Activity.OtherRdp],
  ["battle.net", "", Activity.Gaming],
  ["searchui", "", Activity.Other],
];

test.each(cases)(
  ".determineActivity(%p, %p, %p)",
  function (
    process: string | undefined,
    windowTitle: string | undefined,
    activity: Activity
  ) {
    expect(determineActivity(windowTitle, process)).toBe(activity);
  }
);
