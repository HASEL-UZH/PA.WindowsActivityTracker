import activeWin from "active-win";
import Activity from "./types/Activity";
import ITracker from "./types/ITracker";
import ActiveWindow from "./types/ActiveWindow";
import activityMappings from "./mappings/activityMappings";
import editorApps from "./mappings/editorApps";
import codeFiles from "./mappings/codeFiles";
import browsers from "./mappings/browsers";
import editorNotEnoughInfo from "./mappings/editorNotEnoughInfo";
import workRelatedWebsites from "./mappings/workRelatedWebsites";
import workUnRelatedWebsites from "./mappings/workUnRelatedWebsites";

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

export const determineActivity = (
  windowTitle: string | undefined,
  process: string | undefined
) => {
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

    if (isActivity(Activity.InstantMessaging, windowTitle, process))
      return Activity.InstantMessaging;

    if (isBrowser(process)) {
      if (isWebsiteWorkRelated(windowTitle))
        return Activity.WorkRelatedBrowsing;
      if (isWebsiteWorkUnrelated(windowTitle))
        return Activity.WorkUnrelatedBrowsing;
      if (isCodeFile(windowTitle)) return Activity.DevCode;

      return Activity.WorkRelatedBrowsing; // assume work related browsing as base case
    }

    if (isActivity(Activity.FileNavigationInExplorer, windowTitle, process))
      return Activity.FileNavigationInExplorer;

    if (isActivity(Activity.OtherRdp, windowTitle, process))
      return Activity.OtherRdp;

    if (isActivity(Activity.Gaming, windowTitle, process))
      return Activity.Gaming;

    if (isActivity(Activity.Other, windowTitle, process)) return Activity.Other;

    // if nothing matched, return Unknown
    return Activity.Unknown;
  } catch (error) {
    console.log(error);
    return Activity.Unknown;
  }
};

/**
 * This is a cross-platform tracker class that allows you to subscribe to active window changes. It does so by wrapping the 'active-win' library found at: https://www.npmjs.com/package/active-win
 * It should be noted that per default in case a window was active for less than 1 second, there is a possbility that the callback will not fire. If you need to have more precise window change events, consider lowering "checkingForWindowChangeInterval"
 */
export class WindowsActivityTracker implements ITracker {
  name = "WindowsActivityTracker";
  isRunning = false;
  private ref: NodeJS.Timeout | undefined;

  onWindowChange: (activeWind: ActiveWindow) => void;
  checkingForWindowChangeInterval: number;

  private _prev: ActiveWindow | undefined;

  /**
   * Constructor for creating a WindowsActivityTracker instance
   * @param onWindowChange This is a callaback function that receives the activeWindow as an argument and is fired whenever the active window changes.
   * @param checkingForWindowChangeInterval The interval that is used to check for active window changes (in milliseconds)
   */
  constructor(
    onWindowChange: (activeWind: ActiveWindow) => void,
    checkingForWindowChangeInterval: number = 1000
  ) {
    this.onWindowChange = onWindowChange;
    this.checkingForWindowChangeInterval = checkingForWindowChangeInterval;
  }

  start(): void {
    if (this.isRunning) {
      console.log(`${this.name} is already running!`);
      return;
    }

    this.ref = setInterval(async () => {
      const res = await activeWin();

      const window = {
        ts: new Date(),
        windowTitle: res?.title,
        process: res?.owner.name,
        url: res?.platform === "macos" ? res.url : undefined,
      };

      // If there is no previous window in memory -> handle as a "change window" and trigger callback
      // Or, if there is a window that is different from the previous window
      if (
        !this._prev ||
        (this._prev.windowTitle !== window.windowTitle &&
          this._prev.process !== window.process)
      ) {
        // for performance reasons we only determine the activity once we actually have to
        const activity = determineActivity(res?.title, res?.owner.name);
        const activeWindow: ActiveWindow = { ...window, activity };
        this.onWindowChange(activeWindow);
        this._prev = activeWindow;
      }
    }, this.checkingForWindowChangeInterval);

    this.isRunning = true;
  }
  stop(): void {
    if (this.ref) clearInterval(this.ref);
    this.isRunning = false;
  }
}
