import ITracker from "./types/ITracker.js";
import ActiveWindow from "./types/ActiveWindow.js";
import determineActivity from "./determineActivity.js";
import {determineWindowTitle} from "./determineWindowTitle.js";
import {activeWindow} from "get-windows";

const ACTIVE_WINDOW_TIMEOUT_MS = 5000;

/**
 * This is a cross-platform tracker class that allows you to subscribe to active window changes. It does so by wrapping the 'active-win' library found at: https://www.npmjs.com/package/active-win
 * It should be noted that per default in case a window was active for less than 1 second, there is a possibility that the callback will not fire. If you need to have more precise window change events, consider lowering "checkingForWindowChangeInterval"
 */
export class WindowsActivityTracker implements ITracker {
  name = "Window Activity Monitor";
  isRunning = false;
  private ref: NodeJS.Timeout | undefined;
  private _generation = 0;

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

    const gen = ++this._generation;

    const pollActiveWindow = () => {
      this.ref = setTimeout(async () => {
        try {
          const res = await Promise.race([
            activeWindow({
              accessibilityPermission: this.accessibilityPermission,
              screenRecordingPermission: this.screenRecordingPermission,
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("activeWindow timed out")), ACTIVE_WINDOW_TIMEOUT_MS)
            ),
          ]);
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
            const activity = determineActivity(window.windowTitle, res?.owner.name, res?.owner.path);
            const activeWindow: ActiveWindow = { ...window, activity };
            this.onWindowChange(activeWindow);
            this._prev = activeWindow;
          }
        } catch (error) {
          console.error(error);
        }

        // avoid race condition: don't reschedule if stop() was called, or if stop()+start() was
        // called mid-loop (generation counter ensures the stale callback exits quietly)
        if (this.isRunning && this._generation === gen) {
          pollActiveWindow();
        }
      }, this.checkingForWindowChangeInterval);
    };

    this.isRunning = true;
    pollActiveWindow();
  }
  stop(): void {
    if (this.ref) clearTimeout(this.ref);
    this.isRunning = false;
  }
}
