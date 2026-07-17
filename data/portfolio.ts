// Content source of truth lives in ./content/*.json — those files are the
// "database". Translatable fields are stored as { "tr": "...", "en": "..." }
// (plain strings mean "same in every language"). Edit the JSON to change copy
// or add a project (append to content/projects.json), then rebuild.
// This module loads that JSON, resolves the requested locale (falling back to
// Turkish), and applies the types below; components never change.

import type { Locale } from "@/i18n/config";
import educationData from "./content/education.json";
import experienceData from "./content/experience.json";
import nowData from "./content/now.json";
import processData from "./content/process.json";
import profileData from "./content/profile.json";
import projectsData from "./content/projects.json";
import stackData from "./content/stack.json";
import techData from "./content/tech.json";

export type NullableLink = string | null;

export type ContentTodo = {
  readonly field: string;
  readonly note: string;
};

export type ProjectArchitectureItem = {
  readonly title: string;
  readonly description: string;
};

export type ProjectVisual = {
  readonly tone: "mint" | "ink" | "teal" | "stone" | "sand";
  readonly label: string;
};

export type ProjectGalleryItem = {
  readonly src: string;
  readonly alt: string;
  readonly caption: string | null;
};

export type PortfolioProject = {
  readonly slug: string;
  readonly index: string;
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly problem: string | null;
  readonly approach: string | null;
  readonly role: string | null;
  readonly period: string | null;
  readonly year: string | null;
  readonly technologies: readonly string[];
  readonly technicalFocus: string | null;
  readonly architecture: readonly ProjectArchitectureItem[];
  readonly features: readonly string[];
  readonly outcome: string | null;
  readonly links: {
    readonly demo: NullableLink;
    readonly github: NullableLink;
  };
  readonly visual: ProjectVisual;
  readonly gallery: readonly ProjectGalleryItem[];
  /** Editorial gaps live here so the public UI never needs fake copy. */
  readonly contentTodos: readonly ContentTodo[];
};

export type StackGroup = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly technologies: readonly string[];
};

export type Experience = {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly description: string | null;
  readonly contentTodos: readonly ContentTodo[];
};

export type Education = {
  readonly institution: string;
  readonly degree: string;
  readonly graduation: string;
  readonly gpa: string;
};

export type ProcessStep = {
  readonly index: string;
  readonly title: string;
  readonly description: string;
};

export type NowItem = {
  readonly title: string;
  readonly description: string;
};

export type TechItem = {
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly tagline: string | null;
  /** What the technology is, in Yunus's own words. */
  readonly summary: string | null;
  /** How and where he uses it. */
  readonly experience: string | null;
  readonly highlights: readonly string[];
  readonly link: string | null;
  readonly contentTodos: readonly ContentTodo[];
};

export type Profile = {
  readonly name: string;
  readonly shortName: string;
  readonly role: string;
  readonly location: string;
  readonly education: string;
  readonly availability: string;
  readonly intro: string;
  readonly about: readonly string[];
  readonly email: string;
  readonly githubUsername: string;
  readonly links: {
    readonly email: string;
    readonly github: string;
    readonly linkedin: NullableLink;
    readonly cv: NullableLink;
  };
};

// ---------------------------------------------------------------------------
// Locale resolution
// ---------------------------------------------------------------------------

/** A translated leaf: { tr: "...", en: "..." }. Nothing else uses these keys. */
function isLocalizedLeaf(value: object): value is { tr: unknown; en?: unknown } {
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => key === "tr" || key === "en") && "tr" in value;
}

/** Deep-resolve {tr,en} leaves to the requested locale, falling back to tr. */
function localize<T>(value: unknown, locale: Locale): T {
  if (Array.isArray(value)) {
    return value.map((item) => localize(item, locale)) as T;
  }
  if (value !== null && typeof value === "object") {
    if (isLocalizedLeaf(value)) {
      return ((value as Record<string, unknown>)[locale] ?? value.tr) as T;
    }
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      out[key] = localize(entry, locale);
    }
    return out as T;
  }
  return value as T;
}

const cache = new Map<Locale, ReturnType<typeof buildContent>>();

function buildContent(locale: Locale) {
  return {
    profile: localize<Profile>(profileData, locale),
    projects: localize<readonly PortfolioProject[]>(projectsData, locale),
    stackGroups: localize<readonly StackGroup[]>(stackData, locale),
    experiences: localize<readonly Experience[]>(experienceData, locale),
    education: localize<readonly Education[]>(educationData, locale),
    processSteps: localize<readonly ProcessStep[]>(processData, locale),
    nowItems: localize<readonly NowItem[]>(nowData, locale),
    techItems: localize<readonly TechItem[]>(techData, locale),
  };
}

export function getContent(locale: Locale) {
  let content = cache.get(locale);
  if (!content) {
    content = buildContent(locale);
    cache.set(locale, content);
  }
  return content;
}

export const getProfile = (locale: Locale) => getContent(locale).profile;
export const getProjects = (locale: Locale) => getContent(locale).projects;
export const getStackGroups = (locale: Locale) => getContent(locale).stackGroups;
export const getExperiences = (locale: Locale) => getContent(locale).experiences;
export const getEducation = (locale: Locale) => getContent(locale).education;
export const getProcessSteps = (locale: Locale) => getContent(locale).processSteps;
export const getNowItems = (locale: Locale) => getContent(locale).nowItems;
export const getTechItems = (locale: Locale) => getContent(locale).techItems;

// ---------------------------------------------------------------------------
// Locale-independent helpers (slugs and names are never translated)
// ---------------------------------------------------------------------------

export function getProjectSlugs(): readonly string[] {
  return (projectsData as readonly { slug: string }[]).map((project) => project.slug);
}

export function getTechSlugs(): readonly string[] {
  return (techData as readonly { slug: string }[]).map((tech) => tech.slug);
}

const techSlugByName = new Map(
  (techData as readonly { name: string; slug: string }[]).map((tech) => [tech.name, tech.slug]),
);

/** Detail-page href for a technology name, or null if it has no page. */
export function techHref(name: string): string | null {
  const slug = techSlugByName.get(name);
  return slug ? `/stack/${slug}` : null;
}

/** Projects whose technology list includes this technology name. */
export function projectsUsingTech(locale: Locale, name: string): readonly PortfolioProject[] {
  return getProjects(locale).filter((project) => project.technologies.includes(name));
}
