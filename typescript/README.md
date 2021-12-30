# WindowsActivityTracker for Typescript

This tracker can be used to listen to active window changes on any platform (MacOS, Windows, and Linux)

## How to use

Add this git repository to your project as a git submodule

```
git submodule add https://github.com/HASEL-UZH/PA.UserInputTracker
```

Install the package by adding to package.json and running npm install

```
npm i ./PA.UserInputTracker/typescript
```

The simplest example looks as follows

```ts
import { WindowsActivityTracker } from "windows-activity-tracker";

const tracker = new WindowsActivityTracker(function (activeWin) {
  console.log(activeWin);
});

tracker.start();
```

## Platform specific notes

The url field on the ActiveWindow class is currently only supported on MacOS.

## Known Issues

## Thanks

Huge thanks to the maintainers of active-win: https://github.com/sindresorhus/active-win
