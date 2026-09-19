import { ProjectCard } from "./ProjectCard";
import { Section } from "@/components/ui/section";
import type { ProjectFrontmatter } from "@/types/project";

export function Projects({ projects, max, showAllHref }: {
    projects: { slug: string; frontmatter: ProjectFrontmatter }[];
    max?: number;
    showAllHref?: string;
}) {
    return (
        <Section title="Projects" href={showAllHref}>
            {(max ? projects.slice(0, max) : projects).map((p) => (
                <ProjectCard key={p.slug} project={p.frontmatter} />
            ))}
        </Section>
    );
}
