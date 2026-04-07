import activityMappings from "./mappings/activityMappings.js";
import browsers from "./mappings/browsers.js";
import codeFiles from "./mappings/codeFiles.js";
import editorApps from "./mappings/editorApps.js";
import editorNotEnoughInfo from "./mappings/editorNotEnoughInfo.js";
import workRelatedWebsites from "./mappings/workRelatedWebsites.js";
import workUnRelatedWebsites from "./mappings/workUnRelatedWebsites.js";
import Activity from "./types/Activity.js";

// Match the OS process identifier against an activity's process list only.
const isActivityByProcess = (
  activity: keyof typeof activityMappings,
  processIdentifier: string
): boolean => {
  return activityMappings[activity].process.some((el: string) => processIdentifier.includes(el));
};

// Match a window title against an activity's title list AND process list.
// Checking process[] too means app names (e.g. "slack") automatically match
// browser tabs without needing to be listed twice.
const isActivityByTitle = (
  activity: keyof typeof activityMappings,
  windowTitle: string | undefined
): boolean => {
  if (!windowTitle) return false;
  const mapping = activityMappings[activity];
  return (
    mapping.title.some((el: string) => windowTitle.includes(el)) ||
    mapping.process.some((el: string) => windowTitle.includes(el))
  );
};

// Text editors where it's ambiguous from the process name alone whether
// the user is coding or writing prose — need title sub-classification.
const isEditor = (processIdentifier: string): boolean => {
  return editorApps.some((el) => processIdentifier.includes(el));
};

const isCodeFile = (windowTitle: string | undefined): boolean => {
  if (!windowTitle) return false;
  return codeFiles.some((el) => windowTitle.includes(el));
};

const isEditorNotEnoughInfo = (windowTitle: string | undefined): boolean => {
  return (
    !windowTitle ||
    editorNotEnoughInfo.some((el) => windowTitle.includes(el)) ||
    editorApps.some((el) => windowTitle === el)
  );
};

const isBrowser = (processIdentifier: string): boolean => {
  return browsers.some((el) => processIdentifier.includes(el));
};

const isWebsiteWorkRelated = (windowTitle: string | undefined): boolean => {
  if (!windowTitle) return false;
  return workRelatedWebsites.some((el) => windowTitle.includes(el));
};

const isWebsiteWorkUnrelated = (windowTitle: string | undefined): boolean => {
  if (!windowTitle) return false;
  return workUnRelatedWebsites.some((el) => windowTitle.includes(el));
};

export default function determineActivity(
  windowTitle: string | undefined,
  processName: string | undefined,  // owner.name — app display name
  processPath?: string              // owner.path — full executable path (optional)
) {
  try {
    // first transform title and process to lowercase to facilitate comparison
    windowTitle = windowTitle?.toLowerCase();
    processName = processName?.toLowerCase();

    if (!processName) return Activity.Unknown;
    if (processName === "idle") return Activity.Idle;

    // Build a combined identifier from display name + exe filename (not full path,
    // to avoid false positives from user/project directory names).
    // E.g. owner.name="Visual Studio Code", owner.path="C:\...\Code.exe"
    //   → processIdentifier = "visual studio code code"
    const processExeName = processPath
      ? (processPath.split(/[\\/]/).pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase()
      : "";
    const processIdentifier = [processName, processExeName].filter(Boolean).join(" ");

    // ── Process-only matching ─────────────────────────────────────────────
    // Window title is NOT checked here, preventing false positives from
    // document filenames or paths containing planning/debug/etc. keywords.

    if (isActivityByProcess(Activity.Planning, processIdentifier))                   return Activity.Planning;
    if (isActivityByProcess(Activity.Email, processIdentifier))                      return Activity.Email;
    if (isActivityByProcess(Activity.DevDebug, processIdentifier))                   return Activity.DevDebug;
    if (isActivityByProcess(Activity.DevReview, processIdentifier))                  return Activity.DevReview;
    if (isActivityByProcess(Activity.DevVc, processIdentifier))                      return Activity.DevVc;
    if (isActivityByProcess(Activity.DevCode, processIdentifier)) {
      // -- Edge Case: Sub-classify if an AI assistant is active in the IDE window, prefer GenerativeAI
      if (isActivityByTitle(Activity.GenerativeAI, windowTitle))                     return Activity.GenerativeAI; 
      else                                                                           return Activity.DevCode;
    }
    if (isActivityByProcess(Activity.ReadWriteDocument, processIdentifier))          return Activity.ReadWriteDocument;
    if (isActivityByProcess(Activity.Design, processIdentifier))                     return Activity.Design;
    if (isActivityByProcess(Activity.GenerativeAI, processIdentifier))               return Activity.GenerativeAI;
    if (isActivityByProcess(Activity.InstantMessaging, processIdentifier))           return Activity.InstantMessaging;
    if (isActivityByProcess(Activity.SocialMedia, processIdentifier))                return Activity.SocialMedia;
    if (isActivityByProcess(Activity.FileManagement, processIdentifier))             return Activity.FileManagement;
    if (isActivityByProcess(Activity.OtherRdp, processIdentifier))                   return Activity.OtherRdp;
    if (isActivityByProcess(Activity.Other, processIdentifier))                      return Activity.Other;

    // ── Edge Case: Editor
    // Text editors (Notepad, Vim, Sublime…) need title sub-classification
    // to distinguish coding from writing prose.
    if (isEditor(processIdentifier)) {
      if (isCodeFile(windowTitle))                                         return Activity.DevCode;
      else if (isEditorNotEnoughInfo(windowTitle))                         return Activity.ReadWriteDocument;
      else                                                                 return Activity.DevCode;
    }

    // -- Edge Case: Browser
    // Full title-based classification. isActivityByTitle checks both
    // title[] (web-only keywords) and process[] (app names in tab titles).
    if (isBrowser(processIdentifier)) {
      if (isActivityByTitle(Activity.Planning, windowTitle))               return Activity.Planning;
      else if (isActivityByTitle(Activity.Email, windowTitle))             return Activity.Email;
      else if (isActivityByTitle(Activity.GenerativeAI, windowTitle))      return Activity.GenerativeAI;
      else if (isActivityByTitle(Activity.InstantMessaging, windowTitle))  return Activity.InstantMessaging;
      else if (isActivityByTitle(Activity.SocialMedia, windowTitle))       return Activity.SocialMedia;
      else if (isActivityByTitle(Activity.DevCode, windowTitle))           return Activity.DevCode;
      else if (isActivityByTitle(Activity.DevReview, windowTitle))         return Activity.DevReview;
      else if (isActivityByTitle(Activity.DevVc, windowTitle))             return Activity.DevVc;
      else if (isActivityByTitle(Activity.DevDebug, windowTitle))          return Activity.DevDebug;
      else if (isCodeFile(windowTitle))                                    return Activity.DevCode;
      else if (isWebsiteWorkRelated(windowTitle))                          return Activity.WorkRelatedBrowsing;
      else if (isWebsiteWorkUnrelated(windowTitle))                        return Activity.WorkUnrelatedBrowsing;
      else                                                                 return Activity.WorkRelatedBrowsing; // assume work related browsing as base case
    }

    return Activity.Unknown;
  } catch (error) {
    console.log(error);
    return Activity.Unknown;
  }
}
