import { Suspense } from "react";

import { getStaticPageMetadata } from "@/config/metadata";
import { PageCanvas } from "@/components/PageCanvas";
import { ProjectsPageContent } from "@/components/projects/ProjectsPageContent";
import { getPublishedProjects } from "@/lib/projects";

export const metadata = getStaticPageMetadata("/projects");

export default function ProjectsPage() {
  const projects = getPublishedProjects();

  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background px-5 py-6 sm:px-8 sm:py-10">
        <Suspense
          fallback={
            <div role="status" className="space-y-4" aria-label="Loading projects">
              <div className="h-10 w-48 animate-pulse rounded bg-muted" />
              <div className="h-24 animate-pulse rounded bg-muted" />
            </div>
          }
        >
          <ProjectsPageContent projects={projects} />
        </Suspense>
      </main>
    </PageCanvas>
  );
}
