# PA.WindowsActivityTracker

**App/Window Activity Monitoring**
This tracker can be used in TypeScript or JavaScript applications (e.g. using Electron) to receive changes of the user's currently active window/app, including the process name, window title, and (on macOS only) the url of the browser. 
The tracker supports Windows and macOS. This page describes how to leverage the [WindowsActivityTracker]([url](https://github.com/HASEL-UZH/PA.WindowsActivityTracker/blob/dev/typescript/README.md)).

**App/Window Activity Mapping**
The app/window is then mapped to an activity, such as `Development`, `Generative AI`, `Social Media`, and so on (see [all categories]([url](https://github.com/HASEL-UZH/PA.WindowsActivityTracker/blob/dev/typescript/src/mappings/activityMappings.ts))).
The algorithm can be found [here]([url](https://github.com/HASEL-UZH/PA.WindowsActivityTracker/blob/dev/typescript/src/determineActivity.ts)) and the keyword-mappings [here]([url](https://github.com/HASEL-UZH/PA.WindowsActivityTracker/tree/dev/typescript/src/mappings)).

**Parent Project**
This tracker is maintained by the [Human Aspects of Software Engineering Lab (HASEL)](https://hasel.dev) at the University of Zurich. It is part of the [PersonalAnalytics project](https://github.com/HASEL-UZH/PersonalAnalytics); there you can also see how it's leveraged in action for study-related data collection and actual apps.
