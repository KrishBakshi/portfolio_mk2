"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDomainFilters } from "@/components/projects/ProjectDomainFilters";
import {
  filterProjectsByDomain,
  getAvailableProjectDomains,
} from "@/lib/project-domains";
import type { ProjectPreview } from "@/types/project";

interface ProjectsPageContentProps {
  projects: ProjectPreview[];
}

export function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const availableDomains = useMemo(
    () => getAvailableProjectDomains(projects),
    [projects]
  );

  const filteredProjects = useMemo(
    () => filterProjectsByDomain(projects, activeDomain),
    [projects, activeDomain]
  );

  return (
    <div className="space-y-6 px-4 sm:py-4">
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            Projects
          </h2>
          <p className="font-mono text-sm text-muted-foreground">
            A selection of projects I&apos;ve worked on.
          </p>
        </div>

        <ProjectDomainFilters
          domains={availableDomains}
          activeDomain={activeDomain}
          onChange={setActiveDomain}
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project.frontmatter}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <p className="font-mono text-sm text-muted-foreground">
          No projects match this filter yet.
        </p>
      )}
    </div>
  );
}
