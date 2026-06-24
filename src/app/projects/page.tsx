import { Suspense } from "react";

import { PageCanvas } from "@/components/PageCanvas";
import { ProjectsPageContent } from "@/components/projects/ProjectsPageContent";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <PageCanvas>
      <div className="mx-auto mb-6 w-full max-w-3xl sm:px-0">
        <div id="js-cover-mark" className="pointer-events-none absolute left-0 top-0 h-32 w-full" />

        <div className="mt-6 border border-gray-300/50 bg-background p-4 dark:border-white/10">
          <Suspense fallback={null}>
            <ProjectsPageContent projects={projects} />
          </Suspense>
        </div>
      </div>
    </PageCanvas>
  );
}
