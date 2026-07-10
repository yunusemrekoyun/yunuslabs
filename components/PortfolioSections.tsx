import Link from "next/link";
import {
  education,
  experiences,
  nowItems,
  processSteps,
  profile,
  projects,
  stackGroups,
  techHref,
} from "../data/portfolio";
import styles from "./PortfolioSections.module.css";

function ProjectArtwork({
  index,
  label,
  layout,
  tone,
}: {
  index: number;
  label: string;
  layout: number;
  tone: (typeof projects)[number]["visual"]["tone"];
}) {
  return (
    <div
      className={styles.projectArtwork}
      data-layout={layout}
      data-motion="parallax scale"
      data-motion-index={index}
      data-tone={tone}
      role="img"
      aria-label={`Proje arayüzü için ayrılan görsel alan: ${label}`}
    >
      <span className={styles.artLabel}>{label}</span>
      <span className={styles.artTopbar} aria-hidden="true" />
      <span className={styles.artRail} aria-hidden="true" />
      <span className={styles.artPanelMain} aria-hidden="true" />
      <span className={styles.artPanelSide} aria-hidden="true" />
      <span className={styles.artSignal} aria-hidden="true" />
      <span className={styles.artNotch} aria-hidden="true" />
    </div>
  );
}

export function PortfolioSections() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.portfolioBody}>
      <section className={`${styles.section} ${styles.aboutSection}`} id="about" aria-labelledby="about-title">
        <div className={styles.shell}>
          <div className={styles.sectionRail} data-motion="line">
            <span>01 / About</span>
            <span>{profile.location}</span>
          </div>

          <div className={styles.aboutGrid}>
            <div className={styles.aboutHeading} data-motion="reveal">
              <p className={styles.eyebrow}>Ürün geliştirme, baştan sona.</p>
              <h2 id="about-title">
                Ekrandan
                <em> çalışan sisteme.</em>
              </h2>
            </div>

            <div className={styles.aboutNarrative}>
              <p className={styles.aboutIntro} data-motion="reveal">{profile.intro}</p>
              <div className={styles.aboutCopy}>
                {profile.about.map((paragraph, index) => (
                  <p data-motion="reveal" data-motion-index={index} key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <dl className={styles.profileFacts} data-motion="line" aria-label="Kısa profil bilgileri">
            <div data-motion="slide" data-motion-index={0}>
              <dt>Rol</dt>
              <dd>{profile.role}</dd>
            </div>
            <div data-motion="slide" data-motion-index={1}>
              <dt>Konum</dt>
              <dd>{profile.location}</dd>
            </div>
            <div data-motion="slide" data-motion-index={2}>
              <dt>Eğitim</dt>
              <dd>{profile.education}</dd>
            </div>
            <div data-motion="slide" data-motion-index={3}>
              <dt>Durum</dt>
              <dd className={styles.available}>{profile.availability}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={`${styles.section} ${styles.projectsSection}`} id="projects" aria-labelledby="projects-title">
        <div className={styles.shell}>
          <div className={`${styles.sectionRail} ${styles.sectionRailDark}`} data-motion="line">
            <span>02 / Selected Projects</span>
            <Link href="/projects">Tüm projeler <span aria-hidden="true">→</span></Link>
          </div>

          <header className={styles.projectsHeading} data-motion="reveal">
            <p className={styles.eyebrow}>Gerçek süreçler. Çalışan ürünler.</p>
            <h2 id="projects-title">
              İşin görünen yüzü
              <em> kadar altyapısı da.</em>
            </h2>
          </header>

          <div className={styles.projectsGrid}>
            {projects.map((project, index) => {
              const isFeatured = index === 0;

              return (
                <article
                  className={`${styles.projectCard} ${isFeatured ? styles.projectFeatured : ""}`}
                  data-card={index % 4}
                  data-motion="slide"
                  data-motion-index={index}
                  key={project.slug}
                  aria-labelledby={`project-${project.slug}`}
                >
                  <div className={styles.projectIndex} aria-hidden="true">
                    {project.index}
                  </div>

                  <ProjectArtwork
                    index={index}
                    label={project.visual.label}
                    layout={index % 4}
                    tone={project.visual.tone}
                  />

                  <div className={styles.projectContent}>
                    <div className={styles.projectTopline} data-motion="line">
                      <span>{project.category}</span>
                      <span>{project.role ?? project.year ?? "Case study"}</span>
                    </div>

                    <h3 id={`project-${project.slug}`}>{project.title}</h3>
                    <p className={styles.projectSummary}>{project.summary}</p>

                    {project.technicalFocus ? (
                      <p className={styles.technicalFocus}>
                        <span>Teknik odak</span>
                        {project.technicalFocus}
                      </p>
                    ) : null}

                    <div className={styles.projectFooter}>
                      <ul className={styles.technologyList} aria-label={`${project.title} teknolojileri`}>
                        {project.technologies.slice(0, isFeatured ? 6 : 4).map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>

                      <div className={styles.projectLinks}>
                        {project.links.demo ? (
                          <a href={project.links.demo} target="_blank" rel="noreferrer">
                            Canlı <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                        {project.links.github ? (
                          <a href={project.links.github} target="_blank" rel="noreferrer">
                            GitHub <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                        <Link href={`/projects/${project.slug}`}>
                          İncele <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.processSection}`} id="process" aria-labelledby="process-title">
        <div className={styles.shell}>
          <div className={styles.sectionRail} data-motion="line">
            <span>03 / Yaklaşım</span>
            <span>Fikir → canlı ortam</span>
          </div>

          <div className={styles.processGrid}>
            <header className={styles.processHeading} data-motion="reveal">
              <p className={styles.eyebrow}>Koddan önce bağlam.</p>
              <h2 id="process-title">
                Önce sistemi
                <em> doğru kurarım.</em>
              </h2>
              <p>
                Bir özelliği tek başına değil, ürünün geri kalanı ve onu kullanacak insanların gerçek akışı içinde ele
                alırım.
              </p>
            </header>

            <ol className={styles.processList}>
              {processSteps.map((step, index) => (
                <li data-motion="line reveal" data-motion-index={index} key={step.index}>
                  <span className={styles.processIndex}>{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.stackSection}`} id="stack" aria-labelledby="stack-title">
        <div className={styles.shell}>
          <div className={styles.sectionRail} data-motion="line">
            <span>04 / Stack</span>
            <span>Araç değil, kullanım biçimi</span>
          </div>

          <header className={styles.stackHeading} data-motion="reveal">
            <p className={styles.eyebrow}>Teknik repertuvar.</p>
            <h2 id="stack-title">
              Doğru katmanda,
              <em> doğru araç.</em>
            </h2>
          </header>

          <dl className={styles.stackList}>
            {stackGroups.map((group, index) => (
              <div
                className={styles.stackRow}
                data-motion="line slide"
                data-motion-index={index}
                key={group.id}
              >
                <dt>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {group.title}
                </dt>
                <dd className={styles.stackDescription}>{group.description}</dd>
                <dd>
                  <ul className={styles.stackTechnologies} aria-label={`${group.title} teknolojileri`}>
                    {group.technologies.map((technology) => {
                      const href = techHref(technology);
                      return (
                        <li key={technology}>
                          {href ? <Link href={href}>{technology}</Link> : technology}
                        </li>
                      );
                    })}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.experienceSection}`}
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className={styles.shell}>
          <div className={`${styles.sectionRail} ${styles.sectionRailDark}`} data-motion="line">
            <span>05 / Geçmiş</span>
            <span>Deneyim + Eğitim</span>
          </div>

          <div className={styles.historyGrid}>
            <div>
              <header className={styles.historyHeading} data-motion="reveal">
                <p className={styles.eyebrow}>Deneyim.</p>
                <h2 id="experience-title">
                  Öğrenirken
                  <em> üretmek.</em>
                </h2>
              </header>

              <ol className={styles.experienceList}>
                {experiences.map((experience, index) => (
                  <li
                    data-motion="line slide"
                    data-motion-index={index}
                    key={`${experience.company}-${experience.period}`}
                  >
                    <span className={styles.historyIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{experience.company}</h3>
                      <p>{experience.role}</p>
                      {experience.description ? <p className={styles.historyDescription}>{experience.description}</p> : null}
                    </div>
                    <time>{experience.period}</time>
                  </li>
                ))}
              </ol>
            </div>

            <aside className={styles.educationBlock} data-motion="slide" aria-labelledby="education-title">
              <p className={styles.eyebrow}>Eğitim.</p>
              <h2 id="education-title">Temel.</h2>
              {education.map((item, index) => (
                <article
                  data-motion="line reveal"
                  data-motion-index={index}
                  key={`${item.institution}-${item.degree}`}
                >
                  <h3>{item.institution}</h3>
                  <p>{item.degree}</p>
                  <dl>
                    <div>
                      <dt>Mezuniyet</dt>
                      <dd>{item.graduation}</dd>
                    </div>
                    <div>
                      <dt>GPA</dt>
                      <dd>{item.gpa}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.nowSection}`} id="now" aria-labelledby="now-title">
        <div className={styles.shell}>
          <div className={styles.nowLayout}>
            <header className={styles.nowHeading} data-motion="reveal">
              <div className={styles.nowPulse} aria-hidden="true" />
              <p className={styles.eyebrow}>Şu anda.</p>
              <h2 id="now-title">
                Odağımda
                <em> ne var?</em>
              </h2>
            </header>

            <ol className={styles.nowList}>
              {nowItems.map((item, index) => (
                <li data-motion="line slide" data-motion-index={index} key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.contactSection}`} id="contact" aria-labelledby="contact-title">
        <div className={styles.contactOrb} data-motion="parallax scale" aria-hidden="true" />
        <div className={styles.shell}>
          <div className={`${styles.sectionRail} ${styles.sectionRailDark}`} data-motion="line">
            <span>06 / Contact</span>
            <span>{profile.availability}</span>
          </div>

          <div className={styles.contactGrid}>
            <div data-motion="reveal">
              <p className={styles.eyebrow}>Yeni bir şey üzerinde mi düşünüyorsun?</p>
              <h2 id="contact-title">
                Konuşarak
                <em> netleştirelim.</em>
              </h2>
            </div>

            <div className={styles.contactDetails} data-motion="slide">
              <p>
                Yeni projeler, freelance çalışmalar, full-time pozisyonlar ve teknik iş birlikleri için iletişime
                açığım.
              </p>
              <a className={styles.emailLink} href={profile.links.email}>
                {profile.email}
                <span aria-hidden="true">→</span>
              </a>
              <nav className={styles.socialLinks} aria-label="Sosyal ve belge bağlantıları">
                <a href={profile.links.github} target="_blank" rel="noreferrer">
                  GitHub / {profile.githubUsername} <span aria-hidden="true">↗</span>
                </a>
                {profile.links.linkedin ? (
                  <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {profile.links.cv ? (
                  <a href={profile.links.cv}>CV <span aria-hidden="true">↓</span></a>
                ) : (
                  <span aria-disabled="true">CV / yakında</span>
                )}
              </nav>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerTop} data-motion="line">
            <div>
              <strong>{profile.name}</strong>
              <span>{profile.role}</span>
            </div>
            <nav aria-label="Footer navigation">
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <Link href="/projects">Project archive</Link>
              <a href="#experience">Experience</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div className={styles.footerBottom} data-motion="reveal">
            <span>© {currentYear} {profile.shortName}</span>
            <span>Next.js + TypeScript</span>
            <a href="#hero-scene">Yukarı dön <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
