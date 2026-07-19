import Image from "next/image";
import Link from "next/link";
import { getContent, techHref, type PortfolioProject } from "@/data/portfolio";
import { withLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./PortfolioSections.module.css";

function ProjectArtwork({
  index,
  label,
  layout,
  tone,
  altPrefix,
  image,
  imageAlt,
  featured,
}: {
  index: number;
  label: string;
  layout: number;
  tone: PortfolioProject["visual"]["tone"];
  altPrefix: string;
  image: string | null;
  imageAlt: string;
  featured: boolean;
}) {
  return (
    <div
      className={styles.projectArtwork}
      data-layout={layout}
      data-motion="parallax scale"
      data-motion-index={index}
      data-tone={tone}
      data-has-image={image ? "true" : undefined}
      role="img"
      aria-label={`${altPrefix}: ${label}`}
    >
      <span className={styles.artLabel}>{label}</span>
      <span className={styles.artTopbar} aria-hidden="true" />
      <span className={styles.artRail} aria-hidden="true" />
      <span className={styles.artPanelMain} aria-hidden="true" />
      {image ? (
        <span className={styles.artImageFrame} aria-hidden="true">
          <Image
            alt={imageAlt}
            fill
            loading={featured ? "eager" : "lazy"}
            sizes="(max-width: 760px) 92vw, (max-width: 1100px) 60vw, 40vw"
            src={image}
          />
        </span>
      ) : null}
      <span className={styles.artPanelSide} aria-hidden="true" />
      <span className={styles.artSignal} aria-hidden="true" />
      <span className={styles.artNotch} aria-hidden="true" />
    </div>
  );
}

export function PortfolioSections({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { education, experiences, nowItems, processSteps, profile, projects, stackGroups } =
    getContent(locale);
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.portfolioBody}>
      <section className={`${styles.section} ${styles.aboutSection}`} id="about" aria-labelledby="about-title">
        <div className={styles.shell}>
          <div className={styles.sectionRail} data-motion="line">
            <span>01 / {dict.about.rail}</span>
            <span>{profile.location}</span>
          </div>

          <div className={styles.aboutGrid}>
            <div className={styles.aboutHeading} data-motion="reveal">
              <p className={styles.eyebrow}>{dict.about.eyebrow}</p>
              <h2 id="about-title">
                {dict.about.title}
                <em>{dict.about.titleEm}</em>
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

          <dl className={styles.profileFacts} data-motion="line" aria-label={dict.about.facts.label}>
            <div data-motion="slide" data-motion-index={0}>
              <dt>{dict.about.facts.role}</dt>
              <dd>{profile.role}</dd>
            </div>
            <div data-motion="slide" data-motion-index={1}>
              <dt>{dict.about.facts.location}</dt>
              <dd>{profile.location}</dd>
            </div>
            <div data-motion="slide" data-motion-index={2}>
              <dt>{dict.about.facts.education}</dt>
              <dd>{profile.education}</dd>
            </div>
            <div data-motion="slide" data-motion-index={3}>
              <dt>{dict.about.facts.status}</dt>
              <dd className={styles.available}>{profile.availability}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={`${styles.section} ${styles.projectsSection}`} id="projects" aria-labelledby="projects-title">
        <div className={styles.shell}>
          <div className={`${styles.sectionRail} ${styles.sectionRailDark}`} data-motion="line">
            <span>02 / {dict.projects.rail}</span>
            <Link href={withLocale(locale, "/projects")}>
              {dict.nav.allProjects} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <header className={styles.projectsHeading} data-motion="reveal">
            <p className={styles.eyebrow}>{dict.projects.eyebrow}</p>
            <h2 id="projects-title">
              {dict.projects.title}
              <em>{dict.projects.titleEm}</em>
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
                    altPrefix={dict.projects.artworkAlt}
                    image={project.gallery[0]?.src ?? null}
                    imageAlt={project.gallery[0]?.alt ?? project.title}
                    featured={isFeatured}
                  />

                  <div className={styles.projectContent}>
                    <div className={styles.projectTopline} data-motion="line">
                      <span>{project.category}</span>
                      <span>{project.role ?? project.year ?? dict.common.caseStudy}</span>
                    </div>

                    <h3 id={`project-${project.slug}`}>{project.title}</h3>
                    <p className={styles.projectSummary}>{project.summary}</p>

                    {project.technicalFocus ? (
                      <p className={styles.technicalFocus}>
                        <span>{dict.projects.technicalFocus}</span>
                        {project.technicalFocus}
                      </p>
                    ) : null}

                    <div className={styles.projectFooter}>
                      <ul className={styles.technologyList} aria-label={`${project.title} ${dict.common.technologies}`}>
                        {project.technologies.slice(0, isFeatured ? 6 : 4).map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>

                      <div className={styles.projectLinks}>
                        {project.links.demo ? (
                          <a href={project.links.demo} target="_blank" rel="noreferrer">
                            {dict.common.live} <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                        {project.links.github ? (
                          <a href={project.links.github} target="_blank" rel="noreferrer">
                            {dict.common.github} <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                        <Link
                          className={styles.projectCaseLink}
                          href={withLocale(locale, `/projects/${project.slug}`)}
                        >
                          {dict.common.review} <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Whole-card hit area. Sits above the artwork via DOM order
                      but below .projectContent (z-1), whose own stretched link
                      covers the text column — so demo/GitHub stay clickable.
                      Hidden from AT/keyboard: the visible link is canonical. */}
                  <Link
                    aria-hidden="true"
                    tabIndex={-1}
                    className={styles.projectCardOverlay}
                    href={withLocale(locale, `/projects/${project.slug}`)}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.processSection}`} id="process" aria-labelledby="process-title">
        <div className={styles.shell}>
          <div className={styles.sectionRail} data-motion="line">
            <span>03 / {dict.process.rail}</span>
            <span>{dict.process.railRight}</span>
          </div>

          <div className={styles.processGrid}>
            <header className={styles.processHeading} data-motion="reveal">
              <p className={styles.eyebrow}>{dict.process.eyebrow}</p>
              <h2 id="process-title">
                {dict.process.title}
                <em>{dict.process.titleEm}</em>
              </h2>
              <p>{dict.process.intro}</p>
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
            <span>04 / {dict.stack.rail}</span>
            <span>{dict.stack.railRight}</span>
          </div>

          <header className={styles.stackHeading} data-motion="reveal">
            <p className={styles.eyebrow}>{dict.stack.eyebrow}</p>
            <h2 id="stack-title">
              {dict.stack.title}
              <em>{dict.stack.titleEm}</em>
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
                  <ul className={styles.stackTechnologies} aria-label={`${group.title} ${dict.common.technologies}`}>
                    {group.technologies.map((technology) => {
                      const href = techHref(technology);
                      return (
                        <li key={technology}>
                          {href ? <Link href={withLocale(locale, href)}>{technology}</Link> : technology}
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
            <span>05 / {dict.history.rail}</span>
            <span>{dict.history.railRight}</span>
          </div>

          <div className={styles.historyGrid}>
            <div>
              <header className={styles.historyHeading} data-motion="reveal">
                <p className={styles.eyebrow}>{dict.history.experienceEyebrow}</p>
                <h2 id="experience-title">
                  {dict.history.experienceTitle}
                  <em>{dict.history.experienceTitleEm}</em>
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
              <p className={styles.eyebrow}>{dict.history.educationEyebrow}</p>
              <h2 id="education-title">{dict.history.educationTitle}</h2>
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
                      <dt>{dict.history.graduation}</dt>
                      <dd>{item.graduation}</dd>
                    </div>
                    <div>
                      <dt>{dict.history.gpa}</dt>
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
              <p className={styles.eyebrow}>
                <span className={styles.nowPulse} aria-hidden="true" />
                {dict.now.eyebrow}
              </p>
              <h2 id="now-title">
                {dict.now.title}
                <em>{dict.now.titleEm}</em>
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
            <span>06 / {dict.contact.rail}</span>
            <span>{profile.availability}</span>
          </div>

          <div className={styles.contactGrid}>
            <div data-motion="reveal">
              <p className={styles.eyebrow}>{dict.contact.eyebrow}</p>
              <h2 id="contact-title">
                {dict.contact.title}
                <em>{dict.contact.titleEm}</em>
              </h2>
            </div>

            <div className={styles.contactDetails} data-motion="slide">
              <p>{dict.contact.blurb}</p>
              <a className={styles.emailLink} href={profile.links.email}>
                {profile.email}
                <span aria-hidden="true">→</span>
              </a>
              <nav className={styles.socialLinks} aria-label={dict.contact.socialLabel} lang="en">
                <a href={profile.links.github} target="_blank" rel="noreferrer">
                  {dict.common.github} / {profile.githubUsername} <span aria-hidden="true">↗</span>
                </a>
                {profile.links.linkedin ? (
                  <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                    {dict.contact.linkedin} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {profile.links.cv ? (
                  <a href={profile.links.cv}>{dict.contact.cv} <span aria-hidden="true">↓</span></a>
                ) : (
                  <span aria-disabled="true">{dict.contact.cvSoon}</span>
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
            <nav aria-label={dict.footer.navLabel}>
              <a href="#about">{dict.nav.about}</a>
              <a href="#projects">{dict.nav.projects}</a>
              <Link href={withLocale(locale, "/projects")}>{dict.footer.projectArchive}</Link>
              <a href="#experience">{dict.nav.experience}</a>
              <a href="#contact">{dict.nav.contact}</a>
            </nav>
          </div>
          <div className={styles.footerBottom} data-motion="reveal">
            <span>© {currentYear} {profile.shortName}</span>
            <span>{dict.common.builtWith}</span>
            <a href="#hero-scene">{dict.common.backToTop} <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
