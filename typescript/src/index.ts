import activeWin from "active-win";

export interface ITracker {
  name: string;
  isRunning: boolean;
  start(): void;
  stop(): void;
}

export type ActiveWindow = {
  ts: Date;
  windowTitle: string | undefined;
  process: string | undefined;
  url: string | undefined; // only available on MacOS
  activity: Activity;
};

export enum Activity {
  Uncategorized = "Uncategorized",
  DevCode = "DevCode",
  DevDebug = "DevDebug",
  DevReview = "DevReview",
  DevVc = "DevVc",
  Email = "Email",
  Planning = "Planning",
  ReadWriteDocument = "ReadWriteDocument",
  PlannedMeeting = "PlannedMeeting",
  InformalMeeting = "InformalMeeting",
  InstantMessaging = "InstantMessaging", // subcategory of InformalMeeting
  WorkRelatedBrowsing = "WorkRelatedBrowsing",
  WorkUnrelatedBrowsing = "WorkUnrelatedBrowsing",
  FileNavigationInExplorer = "FileNavigationInExplorer",
  Other = "Other",
  OtherRdp = "OtherRdp",
  Idle = "Idle", // all IDLE events that can't be mapped elsewhere
  Gaming = "Gaming",
  Unknown = "Unknown",
}

const activityMappings = {
  [Activity.DevCode]: [
    "rstudio",
    "sdv",
    "webplatforminstaller",
    "xts",
    "build",
    "cleardescribe",
    "clearfindco",
    "alm-client",
    "ildasm",
    "ssms",
    "mintty",
    "xming",
    "clearprojexp",
    "clearmrgman",
    "kitty",
    "bc2",
    "bcompare",
    "mobaxterm",
    "webmatrix",
    "mexplore",
    "linqpad",
    "android sdk manager",
    "windows phone application deployment",
    "ilspy",
    "tortoiseproc",
    "xsd",
    "eclipse",
    "fiddler",
    "xamarin",
    "netbeans",
    "intellij",
    "sql",
    "sqlitebrowser",
    "devenv",
    "visual studio",
    "code",
    "vs_enterprise",
    "vs2013",
    "microsoftazuretools",
    "webstorm",
    "phpstorm",
    "source insight",
    "zend",
    "console",
    "powershell",
    "shell",
    "cmd",
    "tasktop",
    "android studio",
    "ide",
    "filezilla",
    "flashfxp",
    "charles",
    "delphi32",
    "modelbrowser",
    "ibq",
    "pyscripter",
    "winmergeu",
    "python",
    "bds",
    "studio64",
    "unity",
    "matlab",
  ],
  [Activity.DevDebug]: [
    "vshost",
    "xde",
    "javaw",
    "debug",
    "bugger",
    "windbg",
    "perfview",
    "cdb",
    "msmunittest",
    "bug",
    "snoop",
    "bushound",
    "hyjalmercurydiag",
  ],
  [Activity.DevReview]: [
    "codeflow",
    "gerrit",
    "stash",
    "kallithea",
    "code review",
    "rhodecode",
    "rietveld",
    "crucible",
    "phabricator",
  ],
  [Activity.DevVc]: [
    "diff",
    "repository",
    "cleardiffbl",
    "cleardlg",
    "cleardiffmrg",
    "clearhistory",
    "clearvtree",
    "sourcetree",
    "svn",
    "tortoiseproc",
    "scm",
    "tfs",
    "push",
    "pull",
    "commit",
    "git",
    "bitbucket",
    "visual studio online",
    "thgw",
    "thg",
  ],
  [Activity.Email]: ["mail", "outlook", "thunderbird", "outlook.com"],
  [Activity.Planning]: [
    "backlog",
    "winproj",
    "trello",
    "wunderlist",
    "todoist",
    "personalanalytics",
    "time tracking",
    "track time",
    "rescuetime",
    "clearquest",
    "scrum",
    "kanban",
    "codealike",
    "jira",
    "rally",
    "versionone",
    "calendar",
    "kalender",
    "sprint",
    "user story",
    "plan",
    "to-do",
    "todo",
    "task",
    "aufgabe",
    "vorgangsliste",
    "work item",
    "basecamp",
    "xmind",
  ],
  [Activity.ReadWriteDocument]: [
    "aether",
    "insight3",
    "snagiteditor",
    "confluence",
    "picasa",
    "quora",
    "windows photo viewer",
    "visio",
    "flashmedialiveencoder",
    "photofiltre",
    "jmp",
    "treepad",
    "winword",
    "word",
    "leo",
    "translate",
    "übersetzer",
    "wordpress",
    "mspub",
    ".doc",
    ".xls",
    ".ppt",
    ".pub",
    "excel",
    "powerpnt",
    "onenote",
    "evernote",
    "acrord",
    "sharepoint",
    "pdf",
    "foxitreader",
    "adobe reader",
    "reader",
    "glcnd",
    "wiki",
    "keep",
    "google docs",
    "yammer",
    "docs",
    "office",
    "paint",
    "gimp",
    "photoshop",
    "lightroom",
    "miktex",
    "texmaker",
    "latex",
    "texstudio",
    "latech studio",
    "photo",
    "foto",
    "picpick",
    "greenshot",
    "honeyview",
  ],
  [Activity.InstantMessaging]: [
    "slack",
    "skype",
    "lync",
    "wechat",
    "sip",
    "g2mlauncher",
    "ciscowebexstart",
    "nbrplay",
    "g2mui",
    "chatter",
    "atmgr",
    "hangout",
    "viber",
    "messaging",
    "whatsapp",
    "messenger",
    "ctimon",
    "ciscojabber",
    "teams",
    "zoom",
  ],
  [Activity.FileNavigationInExplorer]: [
    "finder",
    "explorer",
    "speedcommander",
    "q-dir",
    "7zfm",
    "dropbox",
    "everything",
    "winzip32",
    "winzip64",
    "winrar",
  ],
  [Activity.Other]: [
    "mmc",
    "dfsvc",
    "procmon64",
    "mousewithoutboarders",
    "vpnui",
    "dinotify",
    "perfmon",
    "agentransack",
    "lockapp",
    "searchui",
    "pwsafe",
    "wuauclt",
    "calc",
    "wwahost",
    "update",
    "avpui",
    "procexp64",
    "taskmgr",
    "pgp",
    "explorer",
    "groove",
    "dwm",
    "rstrui",
    "snippingtool",
    "onedrive",
    "settings",
    "einstellungen",
    "ccleaner64",
    "avira.systray",
    "avscan",
    "rzsynapse",
    "winstore.app",
    "gazenative8",
    "devicepairingwizard",
    "printui",
    "sapisvr",
    "msaccess",
    "audacity",
    "icofx3",
    "news",
    "twitchui",
  ],
  [Activity.OtherRdp]: [
    "rdcman",
    "mstsc",
    "vmconnect",
    "virtualbox",
    "vmware",
    "vpxclient",
    "msiexec",
    "pageant",
    "putty",
    "mremote",
    "mremoteng",
  ],
  [Activity.Gaming]: ["farcry4", "battle.net"],
};

const isActivity = (
  activity: keyof typeof activityMappings,
  windowTitle: string | undefined,
  process: string
): boolean => {
  const listToCheck = activityMappings[activity];
  return (
    listToCheck.some((el) => windowTitle?.includes(el)) ||
    listToCheck.some((el) => process.includes(el))
  );
};

const editorApps = [
  "notepad",
  "xmlspy",
  "sublime",
  "emacs",
  "vim",
  "atom",
  "texteditor",
  "editplus",
  "gedit",
  "textpad",
  "axurepr9",
];

const isEditor = (process: string): boolean => {
  return editorApps.some((el) => process.includes(el));
};

const isCodeFile = (windowTitle: string | undefined): boolean => {
  if (!windowTitle) return false;
  return [
    "src",
    ".proj",
    ".cmd",
    ".ps1",
    ".ini",
    ".ts",
    ".err",
    ".sql",
    ".ksh",
    ".dat",
    ".xaml",
    ".rb",
    ".kml",
    ".log",
    ".bat",
    ".cs",
    ".vb",
    ".py",
    ".xml",
    ".dtd",
    ".xs",
    ".h",
    ".cpp",
    ".java",
    ".class",
    ".js",
    ".asp",
    ".aspx",
    ".nuspec",
    ".css",
    ".html",
    ".htm",
    ".psm1",
    ".view",
    ".script",
    ".ccproj",
    "js",
    ".php",
    ".xhtml",
    ".sh",
    ".sln",
    ".vcxproj",
    ".pl",
    ".gitignore",
    ".exe",
    ".config",
  ].some((el) => windowTitle.includes(el));
};

const isEditorNotEnoughInfo = (windowTitle: string | undefined) => {
  return (
    !windowTitle ||
    [
      "go to...",
      "find",
      "untitled - notepad",
      "save",
      "speichern unter",
      "speichern",
      "suche",
      "replace",
      "ersetzen",
      "*new",
      "open",
      "reload",
      "new",
      "save as",
      "untitled",
      "no name",
      "plugin manager",
    ].some((el) => windowTitle.includes(el)) ||
    editorApps.some((el) => windowTitle === el)
  );
};

// TODO: This can be simplified and we even have urls for some browsers
const isBrowser = (process: string): boolean => {
  return [
    "iexplore",
    "chrome",
    "firefox",
    "opera",
    "safari",
    "applicationframehost",
    "edge",
  ].some((el) => process.includes(el));
};

const isWebsiteWorkRelated = (windowTitle: string | undefined): boolean => {
  if (!windowTitle) return false;
  return [
    "linkedin",
    "techready",
    "powerapps",
    "angular",
    "connect",
    "typescript",
    "release",
    "batmon",
    "calculator",
    "analytics",
    "azure",
    "power bi",
    "business",
    "googleearth",
    "php",
    "proffix",
    "centmin",
    "picturex",
    "ios",
    "schmelzmetall",
    "natur- und tierpark goldau",
    "tierpark",
    "amazon web service",
    "cyon",
    "salesforce.com",
    "silverlight",
    "issue",
    "junit",
    "mylyn",
    "jetbrains",
    "telerik",
    "testcomplete",
    "application lifecycle management",
    "all reports",
    "advanced search",
    ".net",
    "c#",
    "java",
    "vbforums",
    "dashboard",
    "virtualbox",
    "document",
    "dropbox",
    "onedrive",
    "proxy",
    "jenkins",
    "databasics",
    "suite",
    "abb",
    "shadowbot",
    "office",
    "windows",
    "namespace",
    "ventyx",
    "api",
    "apache",
    "oracle",
    "server",
    "system",
    "ibm",
    "code",
    "codeplex",
    "retrospection",
    "stack overflow",
    "msdn",
    "developer",
    "documentation",
    "blog",
    "coding",
    "programmer",
  ].some((el) => windowTitle.includes(el));
};

const isWebsiteWorkUnrelated = (windowTitle: string | undefined): boolean => {
  if (!windowTitle) return false;
  return [
    "yelp",
    "instagram",
    "verge",
    "season",
    "food",
    "vincere",
    "agar.io",
    "gopro",
    "saldo",
    "halo",
    "book",
    "party",
    "swag",
    "birthday",
    "therapy",
    "vacation",
    "wohnung",
    "flat",
    "airbnb",
    "money",
    "hotel",
    "mietwagen",
    "rental",
    "credit",
    "hockeybuzz.com",
    "empatica",
    "wallpaper",
    "flight",
    "travel",
    "store",
    "phone",
    "buy",
    "engadget",
    "motorcycle",
    "car",
    "auto",
    "honda",
    "bmw",
    "nissan",
    "subaru",
    "winter",
    "summer",
    "bike",
    "bicycle",
    "arcgis",
    "finance",
    "portfolio",
    "toy",
    "gadget",
    "geek",
    "wellness",
    "health",
    "saturday",
    "sunday",
    "weekend",
    "sushi",
    "eat",
    "dessert",
    "restaurant",
    "holiday",
    "hotel",
    "cafe",
    "gas",
    "deal",
    "shop",
    "shopping",
    "craigslist",
    "vancouver",
    "indoor",
    "club",
    "loan",
    "maps",
    "flower",
    "florist",
    "valentine",
    "zalando",
    "tripadvisor",
    "golem",
    "tilllate",
    "heise",
    "jedipedia",
    "blick",
    "daydeal.ch",
    "renovero",
    "brack.ch",
    "skyscanner",
    "easyjet",
    "booking.com",
    "meteocheck",
    "scientific american",
    "ars technica",
    "national post",
    "sensecore",
    "core pro",
    "| time",
    "hockey inside/out",
    "netflix",
    "wired",
    "popular science",
    "habsrus",
    "flickr",
    "imdb",
    "xkcd",
    "derStandard.at",
    "amazon",
    "nhl.com",
    "20 minuten",
    "facebook",
    "reddit",
    "twitter",
    "google+",
    "news",
    "aktuell",
    "9gag",
    "yahoo",
    "comic",
    "ebay",
    "ricardo",
    "stream",
    "movie",
    "cinema",
    "kino",
    "tumblr",
    "twitch",
    "twitchui",
  ].some((el) => windowTitle.includes(el));
};

export const determineActivity = (
  windowTitle: string | undefined,
  process: string | undefined
) => {
  try {
    // first transform title and process to lowercase to facilitate comparison
    windowTitle = windowTitle?.toLowerCase();
    process = process?.toLowerCase();

    if (!process) return Activity.Unknown;

    if (process === "idle") return Activity.Idle;

    if (isActivity(Activity.Planning, windowTitle, process)) {
      // this is needed because "task" could be mapped for the "task manager"
      return isActivity(Activity.Other, windowTitle, process)
        ? Activity.Other
        : Activity.Planning;
    }

    if (isActivity(Activity.Email, windowTitle, process)) return Activity.Email;

    // if editor, might be reading/writing OR coding (if common coding file type extension or the window
    // title has not enough information to accurately map by hand, then map to coding category,
    // else: manual mapping until no longer mapping possible (then: map to ReadWriteDocument)
    if (isEditor(process)) {
      if (isCodeFile(windowTitle)) {
        return Activity.DevCode;
      }
      if (isEditorNotEnoughInfo(windowTitle)) {
        return Activity.ReadWriteDocument; // we don't know whether user is coding, assume read/write
      }
      return Activity.DevCode;
    }

    if (isActivity(Activity.DevDebug, windowTitle, process))
      return Activity.DevDebug;

    if (isActivity(Activity.DevReview, windowTitle, process))
      return Activity.DevReview;

    if (isActivity(Activity.DevVc, windowTitle, process)) return Activity.DevVc;

    if (isActivity(Activity.DevCode, windowTitle, process))
      return Activity.DevCode;

    if (isActivity(Activity.ReadWriteDocument, windowTitle, process))
      return Activity.ReadWriteDocument;

    if (isActivity(Activity.InstantMessaging, windowTitle, process))
      return Activity.InstantMessaging;

    if (isBrowser(process)) {
      if (isWebsiteWorkRelated(windowTitle))
        return Activity.WorkRelatedBrowsing;
      if (isWebsiteWorkUnrelated(windowTitle))
        return Activity.WorkUnrelatedBrowsing;
      if (isCodeFile(windowTitle)) return Activity.DevCode;

      return Activity.WorkRelatedBrowsing; // assume work related browsing as base case
    }

    if (isActivity(Activity.FileNavigationInExplorer, windowTitle, process))
      return Activity.FileNavigationInExplorer;

    if (isActivity(Activity.OtherRdp, windowTitle, process))
      return Activity.OtherRdp;

    if (isActivity(Activity.Gaming, windowTitle, process))
      return Activity.Gaming;

    if (isActivity(Activity.Other, windowTitle, process)) return Activity.Other;

    // if nothing matched, return Unknown
    return Activity.Unknown;
  } catch (error) {
    console.log(error);
    return Activity.Unknown;
  }
};

/**
 * This is a cross-platform tracker class that allows you to subscribe to active window changes. It does so by wrapping the 'active-win' library found at: https://www.npmjs.com/package/active-win
 * It should be noted that per default in case a window was active for less than 1 second, there is a possbility that the callback will not fire. If you need to have more precise window change events, consider lowering "checkingForWindowChangeInterval"
 */
export class WindowsActivityTracker implements ITracker {
  name = "WindowsActivityTracker";
  isRunning = false;
  ref: NodeJS.Timeout | undefined;

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

    console.log(`starting, ${this.name}}`);

    this.ref = setInterval(async () => {
      const res = await activeWin();

      const window = {
        ts: new Date(),
        windowTitle: res?.title,
        process: res?.owner.name,
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
    }, this.checkingForWindowChangeInterval);

    this.isRunning = true;
  }
  stop(): void {
    if (this.ref) clearInterval(this.ref);
    this.isRunning = false;
  }
}
