import Activity from "./Activity";

type ActiveWindow = {
  ts: Date;
  windowTitle: string | undefined;
  process: string | undefined;
  processPath: string | undefined;
  processId: number | undefined;
  url: string | undefined; // only available on macOS
  activity: Activity;
};
export default ActiveWindow;
