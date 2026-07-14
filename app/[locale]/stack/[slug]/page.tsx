import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LiquidGlassCursor } from "@/components/LiquidGlassCursor";
import { profile, projectsUsingTech, techItems } from "@/data/portfolio";
import { isLocale, withLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteUrl } from "@/lib/site";
import styles from "./StackDetail.module.css";

type StackPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return techItems.map((tech) => ({ slug: tech.slug }));
}

export async function generateMetadata({ params }: StackPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tech = techItems.find((item) => item.slug === slug);

  if (!isLocale(locale) || !tech) {
    return {};
  }

  const dict = getDictionary(locale);
  const description = tech.summary ?? `${tech.name} ${dict.stackDetail.metaFallbackSuffix}`;

  return {
    title: `${tech.name} — Stack`,
    description,
    alternates: {
      canonical: `/${locale}/stack/${tech.slug}`,
      languages: {
        tr: `/tr/stack/${tech.slug}`,
        en: `/en/stack/${tech.slug}`,
      },
    },
    openGraph: {
      title: `${tech.name} | ${profile.name}`,
      description,
      type: "article",
      url: `/${locale}/stack/${tech.slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tech.name} | ${profile.name}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function StackDetailPage({ params }: StackPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const detail = dict.stackDetail;
  const index = techItems.findIndex((item) => item.slug === slug);

  if (index < 0) {
    notFound();
  }

  const tech = techItems[index];
  const usedIn = projectsUsingTech(tech.name);
  const previousTech = techItems[(index - 1 + techItems.length) % techItems.length];
  const nextTech = techItems[(index + 1) % techItems.length];
  const hasNotes = Boolean(tech.summary || tech.experience || tech.highlights.length);
  const hasBody = hasNotes || usedIn.length > 0;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    name: tech.name,
    about: tech.name,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    url: `${getSiteUrl()}/${locale}/stack/${tech.slug}`,
    ...(tech.summary ? { description: tech.summary } : {}),
    author: { "@type": "Person", name: profile.name },
  };

  return (
    <>
      <div className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />

        <a className={styles.skipLink} href="#tech">
          {dict.common.skipToContent}
        </a>

        <header className={styles.siteHeader}>
          <Link className={styles.mark} href={withLocale(locale, "/")} aria-label={dict.nav.home} />
          <nav className={styles.nav} aria-label={dict.nav.primaryNav}>
            <Link href={withLocale(locale, "/#stack")}>{dict.nav.stack}</Link>
            <Link href={withLocale(locale, "/projects")}>{dict.nav.projects}</Link>
            <a className={styles.navPill} href={profile.links.email}>
              {dict.nav.contact} <span aria-hidden="true">→</span>
            </a>
            <LanguageSwitcher locale={locale} />
          </nav>
        </header>

        <main id="tech">
          <article>
            <header className={styles.hero}>
              <div className={styles.breadcrumb}>
                <Link href={withLocale(locale, "/#stack")}>{detail.breadcrumb}</Link>
                <span aria-hidden="true">/</span>
                <span>{tech.category}</span>
              </div>

              <div className={styles.heroHeading}>
                <p className={styles.category}>{tech.category}</p>
                <h1>{tech.name}</h1>
              </div>

              {tech.tagline ? <p className={styles.lede}>{tech.tagline}</p> : null}
            </header>

            {hasBody ? (
              <div className={styles.body}>
                {tech.summary ? (
                  <section className={styles.textSection}>
                    <p className={styles.sectionLabel}>{detail.whatLabel}</p>
                    <h2>{detail.whatTitle}</h2>
                    <p>{tech.summary}</p>
                  </section>
                ) : null}

                {tech.experience ? (
                  <section className={styles.textSection}>
                    <p className={styles.sectionLabel}>{detail.experienceLabel}</p>
                    <h2>{detail.experienceTitle}</h2>
                    <p>{tech.experience}</p>
                  </section>
                ) : null}

                {tech.highlights.length > 0 ? (
                  <section className={styles.highlightsSection}>
                    <p className={styles.sectionLabel}>{detail.highlightsLabel}</p>
                    <ul className={styles.highlightList}>
                      {tech.highlights.map((item, itemIndex) => (
                        <li key={item}>
                          <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {usedIn.length > 0 ? (
                  <section className={styles.usedInSection} aria-label={detail.usedInLabel}>
                    <p className={styles.sectionLabel}>{detail.usedIn}</p>
                    <ul className={styles.usedInList}>
                      {usedIn.map((usedProject) => (
                        <li key={usedProject.slug}>
                          <Link href={withLocale(locale, `/projects/${usedProject.slug}`)}>
                            <span className={styles.usedInIndex}>{usedProject.index}</span>
                            <span className={styles.usedInTitle}>{usedProject.title}</span>
                            <span className={styles.usedInCategory}>{usedProject.category}</span>
                            <span aria-hidden="true" className={styles.usedInArrow}>
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {tech.link ? (
                  <section className={styles.externalLinks} aria-label={detail.officialLinkLabel}>
                    <a href={tech.link} target="_blank" rel="noreferrer">
                      {detail.officialSite} <span aria-hidden="true">↗</span>
                    </a>
                  </section>
                ) : null}
              </div>
            ) : (
              <p className={styles.emptyNote}>{detail.emptyNote}</p>
            )}
          </article>

          <nav className={styles.techNavigation} aria-label={detail.otherTech}>
            <Link href={withLocale(locale, `/stack/${previousTech.slug}`)}>
              <span>{dict.common.previous}</span>
              <strong>{previousTech.name}</strong>
            </Link>
            <Link href={withLocale(locale, `/stack/${nextTech.slug}`)}>
              <span>{dict.common.next}</span>
              <strong>{nextTech.name}</strong>
            </Link>
          </nav>
        </main>

        <footer className={styles.footer}>
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
          <Link href={withLocale(locale, "/#stack")}>{dict.nav.stack}</Link>
          <Link href={withLocale(locale, "/projects")}>{dict.nav.projects}</Link>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      <LiquidGlassCursor />
    </>
  );
}
