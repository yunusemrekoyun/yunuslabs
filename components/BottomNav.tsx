"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20.2c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  ),
};

export function BottomNav({ locale, labels, navLabel }: { locale: Locale; labels: BottomNavLabels; navLabel: string }) {
  const pathname = usePathname() ?? "";
  const rest = pathname.replace(new RegExp(`^/${locale}`), "");

  const items = [
    { key: "home", href: "/", label: labels.home, icon: icons.home, active: rest === "" || rest === "/" },
    { key: "projects", href: "/projects", label: labels.projects, icon: icons.projects, active: rest.startsWith("/projects") },
    { key: "stack", href: "/#stack", label: labels.stack, icon: icons.stack, active: rest.startsWith("/stack") },
    { key: "about", href: "/#about", label: labels.about, icon: icons.about, active: false },
    { key: "contact", href: "/#contact", label: labels.contact, icon: icons.contact, active: false },
  ];

  return (
    <nav className={styles.bar} aria-label={navLabel}>
      {items.map((item) => (
        <Link
          key={item.key}
          className={`${styles.item} ${item.active ? styles.itemActive : ""}`}
          href={withLocale(locale, item.href)}
          aria-current={item.active ? "page" : undefined}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
