export const locales = ["tr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/**
 * Prefix an internal path with the active locale.
 * - Same-page anchors (`#contact`) pass through untouched.
 * - "/" becomes "/tr".
 * - "/projects" becomes "/tr/projects", "/#stack" becomes "/tr/#stack".
 */
export function withLocale(locale: Locale, path: string): string {
  if (path.startsWith("#")) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}
