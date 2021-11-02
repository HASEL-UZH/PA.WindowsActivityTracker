import Activity from "./Activity";

type ActiveWindow = {
  ts: Date;
  windowTitle: string | undefined;
  process: string | undefined;
  url: string | undefined; // only available on MacOS
  activity: Activity;
};
export default ActiveWindow;
