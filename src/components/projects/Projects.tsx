import { ProjectCard } from "./ProjectCard";
import { ProjectFrontmatter } from "@/types/project";
import { CollapsibleList } from "@/components/ui/collapsible-list";
import { ShowAllLink } from "@/components/ui/show-all-link";

interface ProjectsProps {
    projects: { slug: string; frontmatter: ProjectFrontmatter }[];
    max?: number;
    showToggle?: boolean;
    showAllHref?: string;
}

export function Projects({ projects, max, showToggle = true, showAllHref }: ProjectsProps) {
    const visibleProjects = showAllHref && max ? projects.slice(0, max) : projects;

    return (
        <section className="px-5 sm:px-8">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Projects</h2>
            </div>

            <div>
                {showAllHref ? (
                    <div>
                        {visibleProjects.map((project) => (
                            <ProjectCard key={project.slug} project={project.frontmatter} className="h-full" />
                        ))}
                    </div>
                ) : (
                    <CollapsibleList
                        items={projects}
                        max={max}
                        listClassName="flex flex-col"
                        keyExtractor={(project) => project.slug}
                        renderItem={(project) => (
                            <ProjectCard project={project.frontmatter} className="h-full" />
                        )}
                        showToggle={showToggle}
                    />
                )}
            </div>

            {showAllHref ? (
                <div className="mt-5 flex items-center justify-start">
                    <ShowAllLink href={showAllHref} label="Explore all projects" />
                </div>
            ) : null}
        </section>
    );
}
