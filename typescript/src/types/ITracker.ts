export default interface ITracker {
  name: string;
  isRunning: boolean;
  start(): void;
  stop(): void;
}
