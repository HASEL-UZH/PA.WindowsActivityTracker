import activityMappings from "./mappings/activityMappings";
import browsers from "./mappings/browsers";
import codeFiles from "./mappings/codeFiles";
import editorApps from "./mappings/editorApps";
import editorNotEnoughInfo from "./mappings/editorNotEnoughInfo";
import workRelatedWebsites from "./mappings/workRelatedWebsites";
import workUnRelatedWebsites from "./mappings/workUnRelatedWebsites";
import Activity from "./types/Activity";

const isActivity = (
  activity: keyof typeof activityMappings,
  windowTitle: string | undefined,
  process: string
): boolean => {
  const listToCheck = activityMappings[activity];
  return (
    listToCheck.some((el) => windowTitle?.includes(el)) ||
    listToCheck.some((el) => process.includes(el))
  );
};

const isEditor = (process: string): boolean => {
  return editorApps.some((el) => process.includes(el));
};

const isCodeFile = (windowTitle: string | undefined): boolean => {
  if (!windowTitle) return false;
  return codeFiles.some((el) => windowTitle.includes(el));
};

const isEditorNotEnoughInfo = (windowTitle: string | undefined) => {
  return (
    !windowTitle ||
    editorNotEnoughInfo.some((el) => windowTitle.includes(el)) ||
    editorApps.some((el) => windowTitle === el)
  );
};

const isBrowser = (process: string): boolean => {
  return browsers.some((el) => process.includes(el));
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
  process: string | undefined
) {
  try {
    // first transform title and process to lowercase to facilitate comparison
    windowTitle = windowTitle?.toLowerCase();
    process = process?.toLowerCase();

    if (!process) return Activity.Unknown;

    if (process === "idle") return Activity.Idle;

    if (isActivity(Activity.Planning, windowTitle, process)) {
      // this is needed because "task" could be mapped for the "task manager"
      return isActivity(Activity.Other, windowTitle, process)
        ? Activity.Other
        : Activity.Planning;
    }

    if (isActivity(Activity.Email, windowTitle, process)) return Activity.Email;

    // if editor, might be reading/writing OR coding (if common coding file type extension or the window
    // title has not enough information to accurately map by hand, then map to coding category,
    // else: manual mapping until no longer mapping possible (then: map to ReadWriteDocument)
    if (isEditor(process)) {
      if (isCodeFile(windowTitle)) {
        return Activity.DevCode;
      }
      if (isEditorNotEnoughInfo(windowTitle)) {
        return Activity.ReadWriteDocument; // we don't know whether user is coding, assume read/write
      }
      return Activity.DevCode;
    }

    if (isActivity(Activity.DevDebug, windowTitle, process))
      return Activity.DevDebug;

    if (isActivity(Activity.DevReview, windowTitle, process))
      return Activity.DevReview;

    if (isActivity(Activity.DevVc, windowTitle, process)) return Activity.DevVc;

    if (isActivity(Activity.DevCode, windowTitle, process))
      return Activity.DevCode;

    if (isActivity(Activity.ReadWriteDocument, windowTitle, process))
      return Activity.ReadWriteDocument;

    if (isActivity(Activity.Design, windowTitle, process))
      return Activity.Design;

    if (isActivity(Activity.GenerativeAI, windowTitle, process))
      return Activity.GenerativeAI;

    if (isActivity(Activity.InstantMessaging, windowTitle, process))
      return Activity.InstantMessaging;

    if (isActivity(Activity.SocialMedia, windowTitle, process))
      return Activity.SocialMedia;
    
    if (isActivity(Activity.FileManagement, windowTitle, process))
      return Activity.FileManagement;

    if (isBrowser(process)) {
      if (isWebsiteWorkRelated(windowTitle))
        return Activity.WorkRelatedBrowsing;
      if (isWebsiteWorkUnrelated(windowTitle))
        return Activity.WorkUnrelatedBrowsing;
      if (isCodeFile(windowTitle)) 
        return Activity.DevCode;

      return Activity.WorkRelatedBrowsing; // assume work related browsing as base case
    }

    if (isActivity(Activity.OtherRdp, windowTitle, process))
      return Activity.OtherRdp;

    if (isActivity(Activity.Other, windowTitle, process)) return Activity.Other;

    // if nothing matched, return Unknown
    return Activity.Unknown;
  } catch (error) {
    console.log(error);
    return Activity.Unknown;
  }
}
