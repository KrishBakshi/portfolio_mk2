import { ProjectCard } from "./ProjectCard";
import { ProjectFrontmatter } from "@/types/project";
import { CollapsibleList } from "@/components/ui/collapsible-list";

interface ProjectsProps {
    projects: { slug: string; frontmatter: ProjectFrontmatter }[];
    max?: number;
    showToggle?: boolean;
}

export function Projects({ projects, max = 2, showToggle = true }: ProjectsProps) {
    return (
        <div className="space-y-6 px-4 sm:py-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans">Projects</h2>
                <p className="text-muted-foreground font-mono text-sm">
                    A selection of projects I've worked on.
                </p>
            </div>

            <div className="bg-background">
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
            </div>
        </div>
    );
}
