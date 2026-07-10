import Link from "next/link";
import type { ReactNode } from "react";
import { LiquidGlassCursor } from "./LiquidGlassCursor";
import styles from "./LiquidGlassHero.module.css";

type LiquidGlassHeroProps = {
  children?: ReactNode;
};

export function LiquidGlassHero({ children }: LiquidGlassHeroProps) {
  return (
    <>
      <div className={styles.liquidScene}>
        <a className={styles.skipLink} href="#about">
          İçeriğe geç
        </a>

        <main className={styles.glassStage}>
          <section className={styles.hero} id="hero-scene">
            <h1 className={styles.srOnly}>Yunus Emre Koyun — Full-stack Software Developer</h1>

            <header className={styles.siteHeader} aria-label="Primary navigation">
              <Link className={styles.mark} href="/" aria-label="Ana sayfa" />
              <nav className={styles.nav}>
                <a href="#projects">Projects</a>
                <a href="#about">About</a>
                <a href="#experience">Experience</a>
                <a href="#stack">Stack</a>
                <a className={styles.navPill} href="#contact">
                  Contact <span aria-hidden="true">-&gt;</span>
                </a>
              </nav>
            </header>

            <div className={styles.nameBlock} data-motion="parallax scale" aria-hidden="true">
              <span>Yunus</span>
              <span>Emre</span>
              <small>KOYUN / FULL-STACK DEVELOPER</small>
            </div>

            <div className={styles.stamp} data-motion="parallax" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="stampCircle" d="M 100 100 m -74 0 a 74 74 0 1 1 148 0 a 74 74 0 1 1 -148 0" />
                </defs>
                <text fill="currentColor">
                  <textPath href="#stampCircle" startOffset="0">
                    PRODUCT ENGINEERING * SYSTEM DESIGN * FULL STACK *
                  </textPath>
                </text>
                <path fill="currentColor" d="M100 48 L115 83 L152 100 L115 117 L100 152 L85 117 L48 100 L85 83 Z" />
              </svg>
            </div>

            <div className={styles.fineDot} data-motion="parallax" aria-hidden="true" />
            <div className={styles.sideBadge} data-motion="parallax" aria-hidden="true">
              <span>Available</span>
            </div>

            <section className={styles.heroCopy} aria-label="Intro">
              <p>
                Arayüzden veritabanına, sunucudan canlı ortama kadar ürünün tamamıyla ilgileniyorum.
                Sağlam sistemleri, net kullanıcı deneyimleriyle bir araya getiriyorum.
              </p>
            </section>
          </section>
          {children}
        </main>
      </div>

      <LiquidGlassCursor />
    </>
  );
}
