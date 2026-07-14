import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

// Redirect any path that isn't already locale-prefixed to the default locale.
// "/" -> "/tr", "/projects" -> "/tr/projects", etc. Locale-prefixed paths pass through.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, files with an extension, and metadata routes.
  matcher: ["/((?!_next|.*\\..*|robots.txt|sitemap.xml|opengraph-image|favicon.ico).*)"],
};
