const GENERIC_TITLES = new Set([
  '',
  'new tab',
  'new window',
  'untitled',
  'start page',
  'task view'
]);

const BROWSER_SUFFIXES = new Set([
  'arc',
  'brave browser',
  'firefox',
  'google chrome',
  'microsoft edge',
  'opera',
  'safari'
]);

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function getArtifactFromUrl(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }

  try {
    return new URL(url).hostname.replace(/^www\./i, '') || undefined;
  } catch {
    return undefined;
  }
}

function getArtifactFromPath(windowTitle: string): string | undefined {
  const path = windowTitle.match(/(?:~[\\/]|[A-Za-z]:[\\/]|\/)[^|—–\n]*?(?=\s+(?:-|—|–|\|)\s+|$)/)?.[0];
  if (!path) {
    return undefined;
  }

  const lastSegment = path.split(/[\\/]/).filter(Boolean).at(-1)?.trim();
  if (!lastSegment) {
    return undefined;
  }

  return lastSegment.replace(/\s*\(([^)]+)\)$/, (_match, duplicate) =>
    duplicate === lastSegment.split(/\s*\(/)[0] ? '' : ` (${duplicate})`
  );
}

function stripApplicationSuffix(windowTitle: string, processName: string | undefined): string {
  const suffixes = new Set<string>(BROWSER_SUFFIXES);
  if (processName) {
    const normalizedProcess = normalize(processName);
    suffixes.add(normalizedProcess);
    const finalWord = normalizedProcess.split(' ').at(-1);
    if (finalWord) {
      suffixes.add(finalWord);
    }
  }

  const segments = windowTitle
    .split(/\s+(?:-|—|–|\|)\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  while (segments.length > 1 && suffixes.has(normalize(segments.at(-1) || ''))) {
    segments.pop();
  }

  return segments.join(' - ').trim();
}

/**
 * Extracts the user-facing artifact represented by an active window: a visited website, file, or
 * document title. It deliberately returns undefined for generic application-only windows.
 */
export function determineArtifactName(
  windowTitle: string | undefined | null,
  processName: string | undefined,
  url: string | undefined
): string | undefined {
  const artifactFromUrl = getArtifactFromUrl(url);
  if (artifactFromUrl) {
    return artifactFromUrl;
  }
  if (!windowTitle?.trim()) {
    return undefined;
  }

  const artifactFromPath = getArtifactFromPath(windowTitle);
  if (artifactFromPath) {
    return artifactFromPath;
  }

  const title = stripApplicationSuffix(windowTitle, processName);
  const normalizedTitle = normalize(title);
  if (
    GENERIC_TITLES.has(normalizedTitle) ||
    normalizedTitle === normalize(processName || '') ||
    !title
  ) {
    return undefined;
  }

  return title;
}
