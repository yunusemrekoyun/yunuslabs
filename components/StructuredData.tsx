import { getSiteUrl } from "../lib/site";

const personDescription =
  "Kullanıcı odaklı arayüzlerden backend mimarisine ve canlı ortam yönetimine kadar ürünün tamamını geliştiren full-stack developer.";

export default function StructuredData() {
  const siteUrl = getSiteUrl();
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
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
        description: personDescription,
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
        name: "Yunus Emre Koyun — Portfolio",
        description: personDescription,
        inLanguage: "tr-TR",
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
