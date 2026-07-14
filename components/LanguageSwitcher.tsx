"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import styles from "./LanguageSwitcher.module.css";

/** TR / EN toggle that keeps the current path and swaps only the locale prefix. */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.replace(/^\/(tr|en)(?=\/|$)/, "");

  return (
    <span className={styles.switcher} aria-label="Language">
      {locales.map((code, index) => (
        <span key={code} className={styles.item}>
          {index > 0 ? (
            <span className={styles.sep} aria-hidden="true">
              /
            </span>
          ) : null}
          <Link
            href={`/${code}${rest}`}
            hrefLang={code}
            aria-current={code === locale ? "true" : undefined}
          >
            {code.toUpperCase()}
          </Link>
        </span>
      ))}
    </span>
  );
}
