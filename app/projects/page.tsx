import type { Metadata } from "next";
import Link from "next/link";
import { profile, projects } from "../../data/portfolio";
import styles from "./ProjectsPage.module.css";

export const metadata: Metadata = {
  title: "Projeler",
  description:
    "Yunus Emre Koyun'un full-stack ürün, backend sistemi ve native macOS projelerinden seçili çalışmalar.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    url: "/projects",
    title: "Projeler | Yunus Emre Koyun",
    description:
      "Full-stack ürün, backend sistemi ve native macOS projelerinden seçili çalışmalar.",
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
    title: "Projeler | Yunus Emre Koyun",
    description:
      "Full-stack ürün, backend sistemi ve native macOS projelerinden seçili çalışmalar.",
    images: ["/opengraph-image"],
  },
};

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#projects-main">
        İçeriğe geç
      </a>

      <header className={styles.siteHeader}>
        <Link className={styles.mark} href="/" aria-label="Ana sayfa" />
        <nav className={styles.nav} aria-label="Ana navigasyon">
          <Link href="/#about">About</Link>
          <Link className={styles.activeLink} href="/projects" aria-current="page">
            Projects
          </Link>
          <Link href="/#experience">Experience</Link>
          <Link href="/#stack">Stack</Link>
          <a className={styles.navPill} href={profile.links.email}>
            İletişim <span aria-hidden="true">→</span>
          </a>
        </nav>
      </header>

      <main id="projects-main">
        <section className={styles.hero} aria-labelledby="projects-title">
          <div className={styles.eyebrow} data-motion="line">
            <span>Selected work</span>
            <span>{String(projects.length).padStart(2, "0")} case studies</span>
          </div>

          <div className={styles.heroGrid}>
            <h1 id="projects-title" data-motion="slide">
              Ekranın
              <span>arkasını da</span>
              düşünen işler.
            </h1>
            <div className={styles.heroCopy} data-motion="reveal">
              <p>
                Arayüz, iş kuralları, veri ve canlı ortam birbirinden ayrı parçalar değil. Buradaki
                projeler ürünün tamamını birlikte ele alan çalışmalar.
              </p>
              <a href="#project-list">
                Projelere geç <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section className={styles.projectList} id="project-list" aria-label="Seçili projeler">
          {projects.map((project, index) => (
            <article
              className={styles.project}
              data-tone={project.visual.tone}
              key={project.slug}
            >
              <Link
                aria-label={`${project.title} case study sayfasını aç`}
                className={styles.projectLink}
                href={`/projects/${project.slug}`}
              >
                <div className={styles.projectTopline} data-motion="line">
                  <span>{project.index}</span>
                  <span>{project.category}</span>
                  {project.year ? <span>{project.year}</span> : <span>Case study</span>}
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
                      <span>Technical focus</span>
                      <p>{project.technicalFocus}</p>
                    </div>
                  ) : null}

                  {project.technologies.length > 0 ? (
                    <ul className={styles.techList} aria-label="Kullanılan teknolojiler">
                      {project.technologies.slice(0, 5).map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>
                  ) : null}

                  <span className={styles.projectCta}>
                    Case study <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </section>

        <section className={styles.closing} aria-labelledby="closing-title" data-motion="reveal">
          <p>Birlikte çalışmak için</p>
          <h2 id="closing-title">İyi ürün, doğru soruyla başlar.</h2>
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
        <nav aria-label="Footer navigasyonu">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
