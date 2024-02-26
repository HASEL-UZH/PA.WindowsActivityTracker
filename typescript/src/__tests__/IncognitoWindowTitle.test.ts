import { expect, test } from "@jest/globals";
import { determineWindowTitle, PRIVATE_BROWSING_REPLACEMENT } from "../determineWindowTitle";


/**
 * The structure of this test array is as follows
 * Index 0: Window title string
 * Index 1: The expected window title
 */
const cases: (string | undefined)[][] = [
  [undefined, undefined],
  ["", undefined],
  ["___", "___"],
  ["not a private session - Google Search", "not a private session - Google Search"],
  ["private banking session - Google Search — Private Browsing", PRIVATE_BROWSING_REPLACEMENT],
  ["test - Google Search - [InPrivate] - Microsoft Edge", PRIVATE_BROWSING_REPLACEMENT],
];

test.each(cases)(
  ".determineWindowTitle(%p, %p)",
    (windowTitle: (string | undefined), expectedWindowTitle: (string | undefined)) => {
    expect(determineWindowTitle(windowTitle)).toBe(expectedWindowTitle);
  }
);
