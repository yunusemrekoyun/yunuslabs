import type { Metadata } from "next";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ScrollMotion } from "@/components/ScrollMotion";
import StructuredData from "@/components/StructuredData";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteUrl } from "@/lib/site";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dict = getDictionary(locale);
  const siteUrl = getSiteUrl();
  const meta = dict.meta;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.homeTitle,
      template: meta.titleTemplate,
    },
    description: meta.homeDescription,
    applicationName: meta.appName,
    authors: [{ name: "Yunus Emre Koyun", url: siteUrl }],
    creator: "Yunus Emre Koyun",
    publisher: "Yunus Emre Koyun",
    keywords: [
      "Yunus Emre Koyun",
      "Full-Stack Developer",
      "Software Developer",
      "Next.js",
      "Node.js",
      ".NET",
      "Kütahya",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        tr: "/tr",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      url: `/${locale}`,
      siteName: meta.appName,
      title: meta.homeTitle,
      description: meta.homeDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.homeTitle,
      description: meta.homeDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "technology",
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  return (
    <html lang={activeLocale} className={`${spaceGrotesk.variable} ${bodoniModa.variable}`}>
      <body>
        <StructuredData locale={activeLocale} />
        <ScrollMotion />
        {children}
        <BottomNav
          locale={activeLocale}
          navLabel={dict.nav.primaryNav}
          labels={{
            home: dict.nav.home,
            projects: dict.nav.projects,
            stack: dict.nav.stack,
            about: dict.nav.about,
            contact: dict.nav.contact,
          }}
        />
      </body>
    </html>
  );
}
