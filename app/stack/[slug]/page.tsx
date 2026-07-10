import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LiquidGlassCursor } from "../../../components/LiquidGlassCursor";
import { profile, projectsUsingTech, techItems } from "../../../data/portfolio";
import { getSiteUrl } from "../../../lib/site";
import styles from "./StackDetail.module.css";

type StackPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return techItems.map((tech) => ({ slug: tech.slug }));
}

export async function generateMetadata({ params }: StackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tech = techItems.find((item) => item.slug === slug);

  if (!tech) {
    return {};
  }

  const description =
    tech.summary ?? `${tech.name} — ${profile.name}'un kullandığı teknolojiler ve deneyim notları.`;

  return {
    title: `${tech.name} — Stack`,
    description,
    alternates: {
      canonical: `/stack/${tech.slug}`,
    },
    openGraph: {
      title: `${tech.name} | ${profile.name}`,
      description,
      type: "article",
      url: `/stack/${tech.slug}`,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Yunus Emre Koyun — Full-stack Developer",
        },
      ],
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
  const { slug } = await params;
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
    url: `${getSiteUrl()}/stack/${tech.slug}`,
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
          İçeriğe geç
        </a>

        <header className={styles.siteHeader}>
          <Link className={styles.mark} href="/" aria-label="Ana sayfa" />
          <nav className={styles.nav} aria-label="Ana navigasyon">
            <Link href="/#stack">Stack</Link>
            <Link href="/projects">Projeler</Link>
            <a className={styles.navPill} href={profile.links.email}>
              İletişim <span aria-hidden="true">→</span>
            </a>
          </nav>
        </header>

        <main id="tech">
          <article>
            <header className={styles.hero}>
              <div className={styles.breadcrumb}>
                <Link href="/#stack">Stack</Link>
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
                    <p className={styles.sectionLabel}>01 / Nedir</p>
                    <h2>Kısaca</h2>
                    <p>{tech.summary}</p>
                  </section>
                ) : null}

                {tech.experience ? (
                  <section className={styles.textSection}>
                    <p className={styles.sectionLabel}>02 / Deneyim</p>
                    <h2>Nasıl kullanıyorum</h2>
                    <p>{tech.experience}</p>
                  </section>
                ) : null}

                {tech.highlights.length > 0 ? (
                  <section className={styles.highlightsSection}>
                    <p className={styles.sectionLabel}>03 / Öne çıkanlar</p>
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
                  <section className={styles.usedInSection} aria-label="Bu teknolojiyi kullandığım projeler">
                    <p className={styles.sectionLabel}>Kullandığım projeler</p>
                    <ul className={styles.usedInList}>
                      {usedIn.map((project) => (
                        <li key={project.slug}>
                          <Link href={`/projects/${project.slug}`}>
                            <span className={styles.usedInIndex}>{project.index}</span>
                            <span className={styles.usedInTitle}>{project.title}</span>
                            <span className={styles.usedInCategory}>{project.category}</span>
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
                  <section className={styles.externalLinks} aria-label="Teknoloji bağlantısı">
                    <a href={tech.link} target="_blank" rel="noreferrer">
                      Resmi site <span aria-hidden="true">↗</span>
                    </a>
                  </section>
                ) : null}
              </div>
            ) : (
              <p className={styles.emptyNote}>Bu teknolojiyle ilgili notlar yakında.</p>
            )}
          </article>

          <nav className={styles.techNavigation} aria-label="Diğer teknolojiler">
            <Link href={`/stack/${previousTech.slug}`}>
              <span>Önceki</span>
              <strong>{previousTech.name}</strong>
            </Link>
            <Link href={`/stack/${nextTech.slug}`}>
              <span>Sonraki</span>
              <strong>{nextTech.name}</strong>
            </Link>
          </nav>
        </main>

        <footer className={styles.footer}>
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
          <Link href="/#stack">Stack</Link>
          <Link href="/projects">Projeler</Link>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      <LiquidGlassCursor />
    </>
  );
}
