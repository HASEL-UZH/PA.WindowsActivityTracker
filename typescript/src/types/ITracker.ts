export default interface ITracker {
  name: string;
  isRunning: boolean;
  start(): Promise<void>;
  stop(): void;
}
