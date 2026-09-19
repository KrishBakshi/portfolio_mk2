"use client";

import { pageTitle } from "@/lib/utils";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const domainParam = searchParams.get("domain");

  const availableDomains = useMemo(
    () => getAvailableProjectDomains(projects),
    [projects]
  );

  const activeDomain =
    domainParam && availableDomains.includes(domainParam) ? domainParam : null;

  const filteredProjects = useMemo(
    () => filterProjectsByDomain(projects, activeDomain),
    [projects, activeDomain]
  );

  const handleDomainChange = (domain: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (domain) params.set("domain", domain);
    else params.delete("domain");
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <div>
      <div className="mb-8 space-y-6">
        <h1 className={pageTitle}>
          Projects
        </h1>

        <ProjectDomainFilters
          domains={availableDomains}
          activeDomain={activeDomain}
          onChange={handleDomainChange}
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div aria-live="polite">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project.frontmatter}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No projects match this filter yet.
        </p>
      )}
    </div>
  );
}
