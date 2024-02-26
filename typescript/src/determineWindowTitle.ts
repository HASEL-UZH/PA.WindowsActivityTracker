export const PRIVATE_BROWSING_REPLACEMENT: string = "[anonymized]";

export function determineWindowTitle(
  windowTitle: string | undefined | null
): string | undefined {
  if (!windowTitle) {
    return undefined;
  }
  const incognitoBrowsingTerms: string[] = ["inprivate", "private browsing", "incognito"];
  const isIncognito: boolean = incognitoBrowsingTerms.some((term: string) =>
      windowTitle?.toLowerCase().includes(term)
  );
  if (isIncognito) {
    return "[anonymized]";
  }
  return windowTitle;
}
