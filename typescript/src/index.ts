import activeWin from "active-win";
import ITracker from "./types/ITracker";
import ActiveWindow from "./types/ActiveWindow";
import determineActivity from "./determineActivity";

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
      try {
        const res = await activeWin();
        const window = {
          ts: new Date(),
          windowTitle: res?.title || "[no window selected]",
          process: res?.owner.name || "[no window selected]",
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
