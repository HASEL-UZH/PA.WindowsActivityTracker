import activeWin from "active-win";
import ITracker from "./types/ITracker";
import ActiveWindow from "./types/ActiveWindow";
import determineActivity from "./determineActivity";
import {determineWindowTitle} from "./determineWindowTitle";

/**
 * This is a cross-platform tracker class that allows you to subscribe to active window changes. It does so by wrapping the 'active-win' library found at: https://www.npmjs.com/package/active-win
 * It should be noted that per default in case a window was active for less than 1 second, there is a possibility that the callback will not fire. If you need to have more precise window change events, consider lowering "checkingForWindowChangeInterval"
 */
export class WindowsActivityTracker implements ITracker {
  name = "WindowsActivityTracker";
  isRunning = false;
  private ref: NodeJS.Timeout | undefined;

  onWindowChange: (activeWind: ActiveWindow) => void;
  checkingForWindowChangeInterval: number;
  accessibilityPermission: boolean;
  screenRecordingPermission: boolean;

  private _prev: ActiveWindow | undefined;

  /**
   * Constructor for creating a WindowsActivityTracker instance
   * @param onWindowChange This is a callback function that receives the activeWindow as an argument and is fired whenever the active window changes.
   * @param checkingForWindowChangeInterval The interval that is used to check for active window changes (in milliseconds)
   * @param accessibilityPermission From active-win: Enable the accessibility permission check. Setting this to false will prevent the accessibility permission prompt on macOS versions 10.15 and newer. The url property won't be retrieved.
   * @param screenRecordingPermission From active-win: Enable the screen recording permission check. Setting this to false will prevent the screen recording permission prompt on macOS versions 10.15 and newer. The title property in the result will always be set to an empty string.
   */
  constructor(
    onWindowChange: (activeWind: ActiveWindow) => void,
    checkingForWindowChangeInterval: number = 1000,
    accessibilityPermission: boolean = true,
    screenRecordingPermission: boolean = true
  ) {
    this.onWindowChange = onWindowChange;
    this.checkingForWindowChangeInterval = checkingForWindowChangeInterval;
    this.accessibilityPermission = accessibilityPermission;
    this.screenRecordingPermission = screenRecordingPermission;
  }

  start(): void {
    if (this.isRunning) {
      console.log(`${this.name} is already running!`);
      return;
    }

    this.ref = setInterval(async () => {
      try {
        const res = await activeWin({
          accessibilityPermission: this.accessibilityPermission,
          screenRecordingPermission: this.screenRecordingPermission,
        });
        const window = {
          ts: new Date(),
          windowTitle: res?.title || undefined,
          process: res?.owner.name || undefined,
          processPath: res?.owner.path,
          processId: res?.owner.processId,
          url: res?.platform === "macos" ? res.url : undefined,
        };

        // If there is no previous window in memory -> handle as a "change window" and trigger callback
        // Or, if there is a window that is different from the previous window
        if (
          !this._prev ||
          (this._prev.windowTitle !== window.windowTitle ||
            this._prev.process !== window.process)
        ) {
          window.windowTitle = determineWindowTitle(window.windowTitle);

          // For performance reasons we only determine the activity once we actually have to
          const activity = determineActivity(window.windowTitle, res?.owner.name);
          const activeWindow: ActiveWindow = { ...window, activity };
          this.onWindowChange(activeWindow);
          this._prev = activeWindow;
        }
      } catch (error) {
        console.error(error);
      }
    }, this.checkingForWindowChangeInterval);

    this.isRunning = true;
  }
  stop(): void {
    if (this.ref) clearInterval(this.ref);
    this.isRunning = false;
  }
}
