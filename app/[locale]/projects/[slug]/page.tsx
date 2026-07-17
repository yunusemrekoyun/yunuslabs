import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LiquidGlassCursor } from "@/components/LiquidGlassCursor";
import { YekMark } from "@/components/YekMark";
import {
  getProfile,
  getProjects,
  getProjectSlugs,
  techHref,
  type PortfolioProject,
} from "@/data/portfolio";
import { isLocale, withLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteUrl } from "@/lib/site";
import styles from "./ProjectDetail.module.css";

type ProjectPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const project = getProjects(locale).find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  const dict = getDictionary(locale);

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/${locale}/projects/${project.slug}`,
      languages: {
        tr: `/tr/projects/${project.slug}`,
        en: `/en/projects/${project.slug}`,
      },
    },
    openGraph: {
      title: `${project.title} | Yunus Emre Koyun`,
      description: project.summary,
      type: "article",
      url: `/${locale}/projects/${project.slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Yunus Emre Koyun`,
      description: project.summary,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const detail = dict.projectDetail;
  const profile = getProfile(locale);
  const projects = getProjects(locale);
  const projectIndex = projects.findIndex((item) => item.slug === slug);

  if (projectIndex < 0) {
    notFound();
  }

  const project: PortfolioProject = projects[projectIndex];
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const hasLinks = Boolean(project.links.demo || project.links.github);
  const hasStory = Boolean(
    project.problem ||
      project.approach ||
      project.architecture.length ||
      project.features.length ||
      project.technologies.length ||
      project.gallery.length ||
      project.outcome,
  );
  const canonicalUrl = `${getSiteUrl()}/${locale}/projects/${project.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    applicationCategory: project.category,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    url: canonicalUrl,
    creator: {
      "@type": "Person",
      name: profile.name,
    },
    ...(project.links.demo ? { sameAs: [project.links.demo] } : {}),
  };

  return (
    <>
      <div className={styles.page} data-tone={project.visual.tone}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />

        <a className={styles.skipLink} href="#case-study">
          {dict.common.skipToContent}
        </a>

        <header className={styles.siteHeader}>
          <Link className={styles.mark} href={withLocale(locale, "/")} aria-label={dict.nav.home}>
            <YekMark />
          </Link>
          <nav className={styles.nav} aria-label={dict.nav.primaryNav}>
            <Link href={withLocale(locale, "/projects")}>{dict.nav.allProjects}</Link>
            <a className={styles.navPill} href={profile.links.email}>
              {dict.nav.contact} <span aria-hidden="true">→</span>
            </a>
            <LanguageSwitcher locale={locale} />
          </nav>
        </header>

        <main id="case-study">
          <article>
            <header className={styles.hero}>
              <div className={styles.breadcrumb} data-motion="slide">
                <Link href={withLocale(locale, "/projects")}>{detail.breadcrumb}</Link>
                <span aria-hidden="true">/</span>
                <span>{project.index}</span>
              </div>

              <div className={styles.heroHeading}>
                <p data-motion="line">{project.category}</p>
                <h1 data-motion="reveal">{project.title}</h1>
              </div>

              <div className={styles.heroBottom} data-motion="slide">
                <p className={styles.lede}>{project.summary}</p>
                <dl className={styles.heroMeta}>
                  {project.role ? (
                    <div>
                      <dt>{detail.role}</dt>
                      <dd>{project.role}</dd>
                    </div>
                  ) : null}
                  {project.period ? (
                    <div>
                      <dt>{detail.period}</dt>
                      <dd>{project.period}</dd>
                    </div>
                  ) : null}
                  {project.technicalFocus ? (
                    <div>
                      <dt>{detail.focus}</dt>
                      <dd>{project.technicalFocus}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </header>

            <div className={styles.cover} aria-hidden="true" data-motion="scale">
              <span className={styles.coverLabel}>{project.visual.label}</span>
              <span className={styles.coverNumber} data-motion="parallax">{project.index}</span>
              <div className={styles.coverSystem}>
                <span className={styles.coverRail} data-motion="line" />
                <span className={styles.coverBar} />
                <span className={styles.coverPanel} />
                {project.gallery[0] ? (
                  <span className={styles.coverImageFrame}>
                    <Image
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 900px) 94vw, 72vw"
                      src={project.gallery[0].src}
                    />
                  </span>
                ) : null}
                <span className={styles.coverNode} />
              </div>
            </div>

            {hasStory ? (
              <div className={styles.storyLayout}>
                <aside
                  className={styles.storyIndex}
                  aria-label={detail.sectionsLabel}
                  data-motion="slide"
                >
                  <span>{detail.caseStudy}</span>
                  <nav>
                    {project.problem ? <a href="#problem">01 {detail.problemNav}</a> : null}
                    {project.approach ? <a href="#approach">02 {detail.approachNav}</a> : null}
                    {project.architecture.length > 0 ? <a href="#architecture">03 {detail.architectureNav}</a> : null}
                    {project.features.length > 0 ? <a href="#features">04 {detail.featuresNav}</a> : null}
                    {project.technologies.length > 0 ? <a href="#stack">05 {detail.stackNav}</a> : null}
                  </nav>
                </aside>

                <div className={styles.story}>
                  {project.problem ? (
                    <section className={styles.textSection} id="problem">
                      <p className={styles.sectionLabel} data-motion="line">
                        {detail.problemLabel}
                      </p>
                      <h2 data-motion="reveal">{detail.problemTitle}</h2>
                      <p data-motion="slide">{project.problem}</p>
                    </section>
                  ) : null}

                  {project.approach ? (
                    <section className={styles.textSection} id="approach">
                      <p className={styles.sectionLabel} data-motion="line">
                        {detail.approachLabel}
                      </p>
                      <h2 data-motion="reveal">{detail.approachTitle}</h2>
                      <p data-motion="slide">{project.approach}</p>
                    </section>
                  ) : null}

                  {project.architecture.length > 0 ? (
                    <section className={styles.architectureSection} id="architecture">
                      <div className={styles.sectionHeading} data-motion="reveal">
                        <p className={styles.sectionLabel}>{detail.architectureLabel}</p>
                        <h2>{detail.architectureTitle}</h2>
                      </div>
                      <ol className={styles.architectureList}>
                        {project.architecture.map((item, index) => (
                          <li data-motion="slide" data-motion-index={index} key={item.title}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                          </li>
                        ))}
                      </ol>
                    </section>
                  ) : null}

                  {project.features.length > 0 ? (
                    <section className={styles.featuresSection} id="features">
                      <div className={styles.sectionHeading} data-motion="reveal">
                        <p className={styles.sectionLabel}>{detail.featuresLabel}</p>
                        <h2>{detail.featuresTitle}</h2>
                      </div>
                      <ul className={styles.featureList}>
                        {project.features.map((feature, index) => (
                          <li data-motion="slide" data-motion-index={index} key={feature}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <p>{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {project.technologies.length > 0 ? (
                    <section className={styles.stackSection} id="stack">
                      <div data-motion="slide">
                        <p className={styles.sectionLabel}>{detail.technologyLabel}</p>
                        <h2>{detail.technologyTitle}</h2>
                      </div>
                      <ul>
                        {project.technologies.map((technology, index) => {
                          const href = techHref(technology);
                          return (
                            <li data-motion="scale" data-motion-index={index} key={technology}>
                              {href ? <Link href={withLocale(locale, href)}>{technology}</Link> : technology}
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ) : null}

                  {project.gallery.length > 0 ? (
                    <section className={styles.gallerySection} aria-labelledby="gallery-heading">
                      <div className={styles.sectionHeading} data-motion="reveal">
                        <p className={styles.sectionLabel}>{detail.interfaceLabel}</p>
                        <h2 id="gallery-heading">{detail.galleryTitle}</h2>
                      </div>
                      <div className={styles.galleryGrid}>
                        {project.gallery.map((image, index) => (
                          <figure data-motion="scale" data-motion-index={index} key={image.src}>
                            <div className={styles.galleryImage} data-motion="parallax">
                              <Image
                                alt={image.alt}
                                fill
                                loading="lazy"
                                sizes="(max-width: 760px) 100vw, 68vw"
                                src={image.src}
                              />
                            </div>
                            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                          </figure>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {project.outcome ? (
                    <section className={styles.textSection}>
                      <p className={styles.sectionLabel} data-motion="line">
                        {detail.resultLabel}
                      </p>
                      <h2 data-motion="reveal">{detail.resultTitle}</h2>
                      <p data-motion="slide">{project.outcome}</p>
                    </section>
                  ) : null}

                  {hasLinks ? (
                    <section
                      className={styles.externalLinks}
                      aria-label={detail.linksLabel}
                      data-motion="reveal"
                    >
                      <p>{detail.linksLabel}</p>
                      <div>
                        {project.links.demo ? (
                          <a href={project.links.demo} target="_blank" rel="noreferrer">
                            {dict.common.liveDemo} <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                        {project.links.github ? (
                          <a href={project.links.github} target="_blank" rel="noreferrer">
                            {dict.common.github} <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                      </div>
                    </section>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>

          <nav className={styles.projectNavigation} aria-label={detail.otherProjects}>
            <Link
              data-motion="slide"
              data-motion-index={0}
              href={withLocale(locale, `/projects/${previousProject.slug}`)}
            >
              <span>{detail.previousProject}</span>
              <strong>{previousProject.title}</strong>
            </Link>
            <Link
              data-motion="slide"
              data-motion-index={1}
              href={withLocale(locale, `/projects/${nextProject.slug}`)}
            >
              <span>{detail.nextProject}</span>
              <strong>{nextProject.title}</strong>
            </Link>
          </nav>
        </main>

        <footer className={styles.footer}>
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
          <Link href={withLocale(locale, "/projects")}>{dict.nav.allProjects}</Link>
          <a href={profile.links.email}>{dict.nav.contact}</a>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      <LiquidGlassCursor />
    </>
  );
}
