import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LiquidGlassCursor } from "@/components/LiquidGlassCursor";
import { profile, projects } from "@/data/portfolio";
import { isLocale, withLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import styles from "./ProjectsPage.module.css";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const meta = dict.meta;

  return {
    title: meta.projectsTitle,
    description: meta.projectsDescription,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { tr: "/tr/projects", en: "/en/projects" },
    },
    openGraph: {
      url: `/${locale}/projects`,
      title: `${meta.projectsTitle} | Yunus Emre Koyun`,
      description: meta.projectsOgDescription,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.projectsTitle} | Yunus Emre Koyun`,
      description: meta.projectsOgDescription,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <div className={styles.page}>
        <a className={styles.skipLink} href="#projects-main">
          {dict.common.skipToContent}
        </a>

        <header className={styles.siteHeader}>
          <Link className={styles.mark} href={withLocale(locale, "/")} aria-label={dict.nav.home} />
          <nav className={styles.nav} aria-label={dict.nav.primaryNav}>
            <Link href={withLocale(locale, "/#about")}>{dict.nav.about}</Link>
            <Link className={styles.activeLink} href={withLocale(locale, "/projects")} aria-current="page">
              {dict.nav.projects}
            </Link>
            <Link href={withLocale(locale, "/#experience")}>{dict.nav.experience}</Link>
            <Link href={withLocale(locale, "/#stack")}>{dict.nav.stack}</Link>
            <a className={styles.navPill} href={profile.links.email}>
              {dict.nav.contact} <span aria-hidden="true">→</span>
            </a>
            <LanguageSwitcher locale={locale} />
          </nav>
        </header>

        <main id="projects-main">
          <section className={styles.hero} aria-labelledby="projects-title">
            <div className={styles.eyebrow} data-motion="line">
              <span>{dict.projectsPage.selectedWork}</span>
              <span>
                {String(projects.length).padStart(2, "0")} {dict.projectsPage.caseStudies}
              </span>
            </div>

            <div className={styles.heroGrid}>
              <h1 id="projects-title" data-motion="slide">
                {dict.projectsPage.title}
                <span>{dict.projectsPage.titleSpan}</span>
                {dict.projectsPage.titleRest}
              </h1>
              <div className={styles.heroCopy} data-motion="reveal">
                <p>{dict.projectsPage.copy}</p>
                <a href="#project-list">
                  {dict.projectsPage.goToProjects} <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </section>

          <section className={styles.projectList} id="project-list" aria-label={dict.projectsPage.listLabel}>
            {projects.map((project, index) => (
              <article
                className={styles.project}
                data-tone={project.visual.tone}
                key={project.slug}
              >
                <Link
                  aria-label={`${project.title} ${dict.projectsPage.openCaseStudy}`}
                  className={styles.projectLink}
                  href={withLocale(locale, `/projects/${project.slug}`)}
                >
                  <div className={styles.projectTopline} data-motion="line">
                    <span>{project.index}</span>
                    <span>{project.category}</span>
                    {project.year ? <span>{project.year}</span> : <span>{dict.common.caseStudy}</span>}
                  </div>

                  <div
                    className={styles.projectVisual}
                    aria-hidden="true"
                    data-motion="scale"
                    data-motion-index={index}
                  >
                    <span className={styles.visualLabel}>{project.visual.label}</span>
                    <span className={styles.visualRail} data-motion="line" />
                    <span className={styles.visualPanel} data-motion="parallax" />
                    <span className={styles.visualNode} />
                    <span className={styles.visualLine} />
                  </div>

                  <div
                    className={styles.projectContent}
                    data-motion="slide"
                    data-motion-index={index}
                  >
                    <div>
                      <p className={styles.projectCategory}>{project.category}</p>
                      <h2>{project.title}</h2>
                      <p className={styles.projectSummary}>{project.summary}</p>
                    </div>

                    {project.technicalFocus ? (
                      <div className={styles.projectDetail}>
                        <span>{dict.projects.technicalFocus}</span>
                        <p>{project.technicalFocus}</p>
                      </div>
                    ) : null}

                    {project.technologies.length > 0 ? (
                      <ul className={styles.techList} aria-label={dict.common.technologies}>
                        {project.technologies.slice(0, 5).map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>
                    ) : null}

                    <span className={styles.projectCta}>
                      {dict.projectsPage.caseStudyCta} <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </section>

          <section className={styles.closing} aria-labelledby="closing-title" data-motion="reveal">
            <p>{dict.projectsPage.closingLead}</p>
            <h2 id="closing-title">{dict.projectsPage.closingTitle}</h2>
            <a href={profile.links.email}>
              {profile.email} <span aria-hidden="true">↗</span>
            </a>
          </section>
        </main>

        <footer className={styles.footer}>
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
          <nav aria-label={dict.footer.navLabel}>
            <Link href={withLocale(locale, "/")}>{dict.nav.home}</Link>
            <Link href={withLocale(locale, "/projects")}>{dict.nav.projects}</Link>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              {dict.common.github}
            </a>
          </nav>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>

      <LiquidGlassCursor />
    </>
  );
}
