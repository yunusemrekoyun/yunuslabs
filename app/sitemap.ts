import type { MetadataRoute } from "next";
import { projects, techItems } from "../data/portfolio";
import { getSiteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const projectRoutes: MetadataRoute.Sitemap = projects.map(({ slug }) => ({
    url: `${siteUrl}/projects/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const techRoutes: MetadataRoute.Sitemap = techItems.map(({ slug }) => ({
    url: `${siteUrl}/stack/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectRoutes,
    ...techRoutes,
  ];
}
