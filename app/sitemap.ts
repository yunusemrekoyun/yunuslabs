import type { MetadataRoute } from "next";
import { projects, techItems } from "@/data/portfolio";
import { locales } from "@/i18n/config";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      changeFrequency: "monthly",
      priority: 1,
    });
    entries.push({
      url: `${siteUrl}/${locale}/projects`,
      changeFrequency: "monthly",
      priority: 0.9,
    });
    for (const { slug } of projects) {
      entries.push({
        url: `${siteUrl}/${locale}/projects/${slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const { slug } of techItems) {
      entries.push({
        url: `${siteUrl}/${locale}/stack/${slug}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
