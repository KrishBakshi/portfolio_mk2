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
        <div className="space-y-6 px-4 sm:py-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans">Projects</h2>
                <p className="text-muted-foreground font-mono text-sm">
                    A selection of projects I've worked on.
                </p>
            </div>

            <div className="bg-background">
                {showAllHref ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {visibleProjects.map((project) => (
                            <ProjectCard key={project.slug} project={project.frontmatter} className="h-full" />
                        ))}
                    </div>
                ) : (
                    <CollapsibleList
                        items={projects}
                        max={max}
                        listClassName="grid grid-cols-1 md:grid-cols-2 gap-4"
                        keyExtractor={(project) => project.slug}
                        renderItem={(project) => (
                            <ProjectCard project={project.frontmatter} className="h-full" />
                        )}
                        showToggle={showToggle}
                    />
                )}
            </div>

            {showAllHref ? (
                <div className="flex h-12 items-center justify-center pt-2">
                    <ShowAllLink href={showAllHref} label="Show All Projects" />
                </div>
            ) : null}
        </div>
    );
}
