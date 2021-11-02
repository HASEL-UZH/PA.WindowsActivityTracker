# WindowsActivityTracker for Typescript

This tracker can be used to listen to active window changes on any platform (MacOS, Windows, and Linux)

## How to use

The simplest example looks as follows

```ts
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
