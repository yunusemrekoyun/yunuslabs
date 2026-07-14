import Link from "next/link";
import type { ReactNode } from "react";
import { withLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LiquidGlassCursor } from "./LiquidGlassCursor";
import styles from "./LiquidGlassHero.module.css";

type LiquidGlassHeroProps = {
  children?: ReactNode;
  locale: Locale;
  dict: Dictionary;
};

export function LiquidGlassHero({ children, locale, dict }: LiquidGlassHeroProps) {
  return (
    <>
      <div className={styles.liquidScene}>
        <a className={styles.skipLink} href="#about">
          {dict.common.skipToContent}
        </a>

        <main className={styles.glassStage}>
          <section className={styles.hero} id="hero-scene">
            <h1 className={styles.srOnly}>Yunus Emre Koyun — {dict.hero.h1Suffix}</h1>

            <header className={styles.siteHeader} aria-label={dict.nav.primaryNav}>
              <Link className={styles.mark} href={withLocale(locale, "/")} aria-label={dict.nav.home} />
              <nav className={styles.nav}>
                <a href="#projects">{dict.nav.projects}</a>
                <a href="#about">{dict.nav.about}</a>
                <a href="#experience">{dict.nav.experience}</a>
                <a href="#stack">{dict.nav.stack}</a>
                <a className={styles.navPill} href="#contact">
                  {dict.nav.contact} <span aria-hidden="true">-&gt;</span>
                </a>
                <LanguageSwitcher locale={locale} />
              </nav>
            </header>

            <div className={styles.nameBlock} data-motion="parallax scale" aria-hidden="true">
              <span>Yunus</span>
              <span>Emre</span>
              <small>KOYUN / {dict.hero.nameTagline}</small>
            </div>

            <div className={styles.stamp} data-motion="parallax" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="stampCircle" d="M 100 100 m -74 0 a 74 74 0 1 1 148 0 a 74 74 0 1 1 -148 0" />
                </defs>
                <text fill="currentColor">
                  <textPath href="#stampCircle" startOffset="0">
                    {dict.hero.stampText}
                  </textPath>
                </text>
                <path fill="currentColor" d="M100 48 L115 83 L152 100 L115 117 L100 152 L85 117 L48 100 L85 83 Z" />
              </svg>
            </div>

            <div className={styles.fineDot} data-motion="parallax" aria-hidden="true" />
            <div className={styles.sideBadge} data-motion="parallax" aria-hidden="true">
              <span>{dict.hero.available}</span>
            </div>

            <section className={styles.heroCopy} aria-label="Intro">
              <p>{dict.hero.copy}</p>
            </section>
          </section>
          {children}
        </main>
      </div>

      <LiquidGlassCursor />
    </>
  );
}
