// Content source of truth lives in ./content/*.json — those files are the
// "database". Edit the JSON to change copy, swap dummy data for real data, or
// add a project (append to content/projects.json), then rebuild. This module
// only loads that JSON and applies the types below; components never change.

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

export const profile = profileData as Profile;
export const projects = projectsData as readonly PortfolioProject[];
export const stackGroups = stackData as readonly StackGroup[];
export const experiences = experienceData as readonly Experience[];
export const education = educationData as readonly Education[];
export const processSteps = processData as readonly ProcessStep[];
export const nowItems = nowData as readonly NowItem[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export const projectBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
) as Readonly<Record<ProjectSlug, PortfolioProject>>;

export const techItems = techData as readonly TechItem[];

export const techBySlug = Object.fromEntries(
  techItems.map((tech) => [tech.slug, tech]),
) as Readonly<Record<string, TechItem>>;

const techSlugByName = new Map(techItems.map((tech) => [tech.name, tech.slug]));

/** Detail-page href for a technology name, or null if it has no page. */
export function techHref(name: string): string | null {
  const slug = techSlugByName.get(name);
  return slug ? `/stack/${slug}` : null;
}

/** Projects whose technology list includes this technology name. */
export function projectsUsingTech(name: string): readonly PortfolioProject[] {
  return projects.filter((project) => project.technologies.includes(name));
}
