import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import { Projects } from "@/components/projects/Projects";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="relative mx-auto max-w-3xl">
        <DiagonalPatternFrame>
          <div className="mx-auto w-full max-w-3xl sm:px-0">
            <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />

            <div className="bg-background border border-gray-300/50 dark:border-white/10 mt-6 p-4">
              <Projects projects={projects} max={5} />
            </div>
          </div>
        </DiagonalPatternFrame>
      </div>
    </div>
  );
}
