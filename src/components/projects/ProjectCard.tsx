import { EntryRow } from "@/components/ui/entry-row";
import type { ProjectFrontmatter } from "@/types/project";

export function ProjectCard({ project }: { project: ProjectFrontmatter; className?: string }) {
    const tags = project.domains?.length ? project.domains : project.technologies.slice(0, 2);

    return <EntryRow href={`/projects/${project.slug}`} title={project.title} meta={tags.join(" · ")} />;
}
