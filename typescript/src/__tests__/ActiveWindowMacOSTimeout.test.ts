/// <reference types="node" />
import { expect, test } from "@jest/globals";
import { activeWindow } from "get-windows";
import { WindowsActivityTracker } from "../index";

// Since we patch activeWindow to include a macOS-specific timeout parameter:
// 1. We confirm activeWindow can be called without crashing
// 2. If on macOS, we test that the timeout parameter stops activeWindow

const onMacOS = process.platform === "darwin" ? test : test.skip;

test("activeWindow accepts a timeout option without rejecting", async () => {
  await expect(
    activeWindow({ accessibilityPermission: true, screenRecordingPermission: true, timeout: 5000 })
  ).resolves.not.toThrow();
});

test("tracker starts, fires a callback, and stops without crashing", async () => {
  let tracker!: WindowsActivityTracker;
  await new Promise<void>((resolve) => {
    tracker = new WindowsActivityTracker(() => resolve(), 150);
    tracker.start();
  });
  tracker.stop();
  expect(tracker.isRunning).toBe(false);
}, 10000);

onMacOS("activeWindow rejects when its timeout is exceeded", async () => {
  await expect(
    activeWindow({ accessibilityPermission: true, screenRecordingPermission: true, timeout: 1 })
  ).rejects.toThrow();
});
