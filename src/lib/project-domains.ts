import { PROJECT_DOMAIN_FILTERS } from "@/config/project-domains";
import type { ProjectPreview } from "@/types/project";

export function getAvailableProjectDomains(
  projects: ProjectPreview[]
): string[] {
  const used = new Set<string>();

  for (const project of projects) {
    for (const domain of project.frontmatter.domains ?? []) {
      used.add(domain);
    }
  }

  return PROJECT_DOMAIN_FILTERS.filter((domain) => used.has(domain));
}

export function filterProjectsByDomain(
  projects: ProjectPreview[],
  domain: string | null
): ProjectPreview[] {
  if (!domain) {
    return projects;
  }

  return projects.filter((project) =>
    project.frontmatter.domains?.includes(domain)
  );
}
