"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { withLocale, type Locale } from "@/i18n/config";
import styles from "./BottomNav.module.css";

type BottomNavLabels = {
  home: string;
  projects: string;
  stack: string;
  about: string;
  contact: string;
};

const icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20.2c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </svg>
  ),
  stack: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  ),
};

// Home-page sections a tab maps to, in document order. The active tab is the
// last one whose top has scrolled past the reference line — so the highlight
// never falls into a gap between sections (e.g. while inside #process it stays
// on Projects, inside #experience/#now it stays on Contact).
const SPY_SECTIONS = [
  { key: "about", id: "about" },
  { key: "projects", id: "projects" },
  { key: "stack", id: "stack" },
  { key: "contact", id: "contact" },
] as const;

function useActiveKey(onHome: boolean, routeKey: string): string {
  const [spyKey, setSpyKey] = useState("home");

  useEffect(() => {
    if (!onHome) {
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let active = "home";
      for (const section of SPY_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= line) {
          active = section.key;
        }
      }
      setSpyKey(active);
    };

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [onHome]);

  return onHome ? spyKey : routeKey;
}

export function BottomNav({ locale, labels, navLabel }: { locale: Locale; labels: BottomNavLabels; navLabel: string }) {
  const pathname = usePathname() ?? "";
  const rest = pathname.replace(new RegExp(`^/${locale}`), "");
  const onHome = rest === "" || rest === "/";
  const routeKey = rest.startsWith("/projects") ? "projects" : rest.startsWith("/stack") ? "stack" : "home";
  const activeKey = useActiveKey(onHome, routeKey);

  const items = [
    { key: "home", href: "/", label: labels.home, icon: icons.home },
    { key: "about", href: "/#about", label: labels.about, icon: icons.about },
    { key: "projects", href: "/projects", label: labels.projects, icon: icons.projects },
    { key: "stack", href: "/#stack", label: labels.stack, icon: icons.stack },
    { key: "contact", href: "/#contact", label: labels.contact, icon: icons.contact },
  ];

  return (
    <nav className={styles.bar} aria-label={navLabel}>
      {items.map((item) => {
        const active = activeKey === item.key;
        return (
          <Link
            key={item.key}
            className={`${styles.item} ${active ? styles.itemActive : ""}`}
            href={withLocale(locale, item.href)}
            aria-current={active ? "page" : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
