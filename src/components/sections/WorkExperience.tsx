"use client";

import {
    BriefcaseBusinessIcon,
    CodeXmlIcon,
    DraftingCompassIcon,
    GraduationCapIcon,
    LightbulbIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";

import {
    CollapsibleWithContext,
    CollapsibleContent,
    CollapsibleTrigger,
    CollapsibleChevronsIcon,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const iconMap = {
    code: CodeXmlIcon,
    design: DraftingCompassIcon,
    business: BriefcaseBusinessIcon,
    education: GraduationCapIcon,
    idea: LightbulbIcon,
} as const;

/**
 * Represents the valid keys of the `iconMap` object, used to specify the type of icon
 * associated with an experience position.
 */
export type ExperiencePositionIconType = keyof typeof iconMap;

export type ExperiencePositionItemType = {
    /** Unique identifier for the position */
    id: string;
    /** The job title or position name */
    title: string;
    /** The period during which the position was held (e.g., "Jan 2020 - Dec 2021") */
    employmentPeriod: string;
    /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
    employmentType?: string;
    /** A brief description of the position or responsibilities */
    description?: string;
    /** An icon representing the position */
    icon?: ExperiencePositionIconType;
    /** A list of skills associated with the position */
    skills?: string[];
    /** Indicates if the position details are expanded in the UI */
    isExpanded?: boolean;
};

export type ExperienceItemType = {
    /** Unique identifier for the experience item */
    id: string;
    /** Name of the company where the experience was gained */
    companyName: string;
    /** URL or path to the company's logo image */
    companyLogo?: string;
    /** List of positions held at the company */
    positions: ExperiencePositionItemType[];
    /** Indicates if this is the user's current employer */
    isCurrentEmployer?: boolean;
};

import { CollapsibleList } from "@/components/ui/collapsible-list";

export function WorkExperience({
    className,
    experiences,
    max = 2,
    showToggle = true,
}: {
    className?: string;
    experiences: ExperienceItemType[];
    max?: number;
    showToggle?: boolean;
}) {
    return (
        <section className={cn("bg-background px-4 sm:py-4", className)}>
            <header className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans">Work Experience</h2>
            </header>
            <div className="bg-background">
                <CollapsibleList
                    items={experiences}
                    max={max}
                    keyExtractor={(item) => item.id}
                    renderItem={(experience) => (
                        <ExperienceItem experience={experience} />
                    )}
                    showToggle={showToggle}
                />
            </div>
        </section>
    );
}

export function ExperienceItem({
    experience,
}: {
    experience: ExperienceItemType;
}) {
    return (
        <div className="space-y-4 py-4 rounded-lg">
            <div className="not-prose flex items-center gap-3">
                <div
                    className="flex size-6 shrink-0 items-center justify-center"
                    aria-hidden
                >
                    {experience.companyLogo ? (
                        <Image
                            src={experience.companyLogo}
                            alt={experience.companyName}
                            width={24}
                            height={24}
                            quality={100}
                            className="rounded-lg"
                            unoptimized
                        />
                    ) : (
                        <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    )}
                </div>

                <h3 className="text-lg leading-snug font-medium text-foreground">
                    {experience.companyName}
                </h3>

                {experience.isCurrentEmployer && (
                    <span className="relative flex items-center justify-center">
                        <span className="absolute inline-flex size-3 animate-ping rounded-full bg-info opacity-50" />
                        <span className="relative inline-flex size-2 rounded-full bg-info" />
                        <span className="sr-only">Current Employer</span>
                    </span>
                )}
            </div>

            <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
                {experience.positions.map((position) => (
                    <ExperiencePositionItem key={position.id} position={position} />
                ))}
            </div>
        </div>
    );
}

export function ExperiencePositionItem({
    position,
}: {
    position: ExperiencePositionItemType;
}) {
    const ExperienceIcon = iconMap[position.icon || "business"];

    return (
        <CollapsibleWithContext defaultOpen={position.isExpanded} asChild>
            <div className="relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background">
                <CollapsibleTrigger
                    className="group/experience not-prose block w-full text-left select-none"
                >
                    <div className="flex items-start gap-3">
                        <div
                            className={cn(
                                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-lg mt-0.5",
                                "bg-muted text-muted-foreground",
                                "border border-muted-foreground/15 ring-1 ring-border ring-offset-1 ring-offset-background"
                            )}
                            aria-hidden
                        >
                            <ExperienceIcon className="size-4" />
                        </div>

                        <div className="flex-1 -ml-2 pl-3 pr-1 hover:bg-accent transition-colors">
                            <div className="mb-1 flex items-center gap-3">
                                <h4 className="flex-1 text-base font-medium text-balance text-foreground">
                                    {position.title}
                                </h4>

                                <div
                                    className="shrink-0 text-muted-foreground [&_svg]:size-4"
                                    aria-hidden
                                >
                                    <CollapsibleChevronsIcon />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                                {position.employmentType && (
                                    <>
                                        <dl>
                                            <dt className="sr-only">Employment Type</dt>
                                            <dd>{position.employmentType}</dd>
                                        </dl>

                                        <Separator
                                            className="data-[orientation=vertical]:h-4"
                                            orientation="vertical"
                                        />
                                    </>
                                )}

                                <dl>
                                    <dt className="sr-only">Employment Period</dt>
                                    <dd>{position.employmentPeriod}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    {position.description && (
                        <Prose className="pt-2 pl-9">
                            <ReactMarkdown>{position.description}</ReactMarkdown>
                        </Prose>
                    )}

                    {Array.isArray(position.skills) && position.skills.length > 0 && (
                        <ul className="not-prose flex flex-wrap gap-1.5 pt-2 pl-9">
                            {position.skills.map((skill, index) => (
                                <li key={index} className="flex">
                                    <Skill>{skill}</Skill>
                                </li>
                            ))}
                        </ul>
                    )}
                </CollapsibleContent>
            </div>
        </CollapsibleWithContext>
    );
}

function Prose({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "prose prose-sm max-w-none font-mono text-foreground prose-neutral dark:prose-invert",
                "prose-a:font-medium prose-a:wrap-break-word prose-a:text-foreground prose-a:underline prose-a:underline-offset-4",
                "prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
                className
            )}
            {...props}
        />
    );
}

function Skill({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-lg border border-gray-300/50 dark:border-white/10 bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}
