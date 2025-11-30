"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/types/project";
import { getTechIcon } from "@/components/TechIcons";

interface ProjectCardProps {
    project: ProjectFrontmatter;
    className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
    const {
        title,
        slug,
        description,
        image,
        video,
        link,
        github,
        technologies,
        isWorking,
    } = project;

    return (
        <Card
            className={cn(
                "flex flex-col overflow-hidden border border-gray-300/50 dark:border-white/10 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 ease-out h-full bg-background",
                className
            )}
        >
            <Link
                href={`/projects/${slug}`}
                className="block cursor-pointer"
            >
                {video ? (
                    <video
                        src={video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="pointer-events-none mx-auto h-40 w-full object-cover object-top"
                    />
                ) : (
                    <Image
                        src={image}
                        alt={title}
                        width={500}
                        height={300}
                        className="h-40 w-full overflow-hidden object-cover object-top"
                    />
                )}
            </Link>
            <CardHeader className="px-4 py-4">
                <div className="space-y-1">
                    <CardTitle className="mt-1 text-base">{title}</CardTitle>
                    <div className="hidden font-sans text-xs underline print:visible">
                        {link?.replace("https://", "").replace("www.", "").replace("/", "")}
                    </div>
                    <p className="prose max-w-full text-pretty font-mono text-xs text-muted-foreground dark:prose-invert line-clamp-2">
                        {description}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="mt-auto flex flex-col px-4 pb-4">
                {technologies && technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {technologies.map((tech) => {
                            const Icon = getTechIcon(tech);
                            if (!Icon) return null;

                            return (
                                <TooltipProvider key={tech} delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center justify-center w-5 h-5 p-0">
                                                <Icon className="size-full" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{tech}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        })}
                    </div>
                )}
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-3 items-start">
                <div
                    className={cn(
                        "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] w-full font-mono",
                        isWorking
                            ? "border border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400"
                            : "border border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400"
                    )}
                >
                    {isWorking ? (
                        <>
                            <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                            All Systems Operational
                        </>
                    ) : (
                        <>
                            <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                            Building
                        </>
                    )}
                </div>

                <div className="flex flex-row flex-wrap items-start gap-2 w-full">
                    {link && (
                        <Link href={link} target="_blank">
                            <Badge className="flex gap-2 px-2 py-1 text-[10px] font-mono">
                                <Globe className="size-3" />
                                Website
                            </Badge>
                        </Link>
                    )}
                    {github && (
                        <Link href={github} target="_blank">
                            <Badge className="flex gap-2 px-2 py-1 text-[10px] font-mono" variant="outline">
                                <Github className="size-3" />
                                Source
                            </Badge>
                        </Link>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
