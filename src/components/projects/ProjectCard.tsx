"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/types/project";
import { getProjectPrimaryLink } from "@/lib/project-links";

interface ProjectCardProps {
    project: ProjectFrontmatter;
    className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
    const {
        title,
        slug,
        description,
        link,
        github,
        technologies,
        domains,
    } = project;
    const primaryLink = getProjectPrimaryLink(link, github);

    return (
        <article
            className={cn(
                "group relative flex h-full flex-col border-b border-border py-5 last:border-b-0",
                className
            )}
        >
            <div className="flex flex-1 flex-col">
                <div className="mb-3 min-w-0">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                        {(domains?.length ? domains : technologies.slice(0, 2)).map((item) => (
                            <span key={item} className="text-xs text-muted-foreground">
                                {item}
                            </span>
                        ))}
                    </div>
                    <h3 className="flex items-start justify-between gap-4 text-lg font-medium leading-snug tracking-tight text-foreground">
                        <Link href={`/projects/${slug}`} className="after:absolute after:inset-0">
                            {title}
                        </Link>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </h3>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
                <p className="mt-3 line-clamp-1 text-xs text-muted-foreground">
                    {technologies.slice(0, 4).join(" · ")}
                </p>
                <div className="relative z-10 mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {primaryLink && (
                        <Link href={primaryLink.href} target="_blank" rel="noopener noreferrer" className="flex min-h-8 items-center gap-1.5 hover:text-foreground">
                            <ExternalLink className="size-3.5" />
                            {primaryLink.label}
                        </Link>
                    )}
                    {github && (
                        <Link href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground">
                            <Github className="size-3.5" />
                            Source
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
