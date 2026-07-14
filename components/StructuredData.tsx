import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteUrl } from "@/lib/site";

export default function StructuredData({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const description = dict.meta.personDescription;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Yunus Emre Koyun",
        url: siteUrl,
        email: "mailto:yunusemrekoyun26@gmail.com",
        jobTitle: "Full-Stack Developer",
        description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kütahya",
          addressCountry: "TR",
        },
        sameAs: ["https://github.com/yunusemrekoyun"],
        knowsAbout: [
          "Full-stack web development",
          "Backend architecture",
          "API development",
          "Database design",
          "Performance optimization",
          "Docker-based deployment",
          "Native macOS development",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: dict.meta.appName,
        description,
        inLanguage: locale === "tr" ? "tr-TR" : "en-US",
        creator: { "@id": personId },
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
