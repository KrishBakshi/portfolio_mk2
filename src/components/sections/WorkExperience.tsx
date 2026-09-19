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
import remarkGfm from "remark-gfm";

import {
    CollapsibleWithContext,
    CollapsibleContent,
    CollapsibleTrigger,
    CollapsibleChevronsIcon,
} from "@/components/ui/collapsible";
import { cn, pageTitle, sectionTitle } from "@/lib/utils";

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
    /** Zoom within the logo square. 1 = default, <1 = smaller, >1 = zoom in. */
    companyLogoScale?: number;
    /** List of positions held at the company */
    positions: ExperiencePositionItemType[];
    /** Indicates if this is the user's current employer */
    isCurrentEmployer?: boolean;
};

import { CollapsibleList } from "@/components/ui/collapsible-list";
import { ShowAllLink } from "@/components/ui/show-all-link";

export function WorkExperience({
    className,
    experiences,
    max = 2,
    showToggle = true,
    showAllHref,
    expandLatestPositions = false,
    expandCurrentPosition = false,
    title = "Experience",
}: {
    className?: string;
    experiences: ExperienceItemType[];
    max?: number;
    showToggle?: boolean;
    showAllHref?: string;
    /** When true, opens only the first (most recent) role per company. */
    expandLatestPositions?: boolean;
    /** When true, opens the current employer's latest role. */
    expandCurrentPosition?: boolean;
    title?: string;
}) {
    const visibleExperiences = showAllHref ? experiences.slice(0, max) : experiences;
    const Heading = showAllHref ? "h2" : "h1";

    return (
        <section className={cn("px-5 sm:px-8", className)}>
            <header className="mb-6">
                <Heading className={showAllHref ? sectionTitle : pageTitle}>{title}</Heading>
            </header>
            <div>
                {showAllHref ? (
                    <div className="flex flex-col">
                        {visibleExperiences.map((experience) => (
                            <ExperienceItem
                                key={experience.id}
                                experience={experience}
                                expandLatestPositions={expandLatestPositions}
                                expandCurrentPosition={expandCurrentPosition}
                            />
                        ))}
                    </div>
                ) : (
                    <CollapsibleList
                        items={experiences}
                        max={max}
                        keyExtractor={(item) => item.id}
                        renderItem={(experience) => (
                            <ExperienceItem
                                experience={experience}
                                expandLatestPositions={expandLatestPositions}
                                expandCurrentPosition={expandCurrentPosition}
                            />
                        )}
                        showToggle={showToggle}
                    />
                )}
            </div>

            {showAllHref ? (
                <div className="mt-5 flex items-center justify-start">
                    <ShowAllLink href={showAllHref} label="View full experience" />
                </div>
            ) : null}
        </section>
    );
}

const COMPANY_LOGO_SIZE = 24;

export function ExperienceItem({
    experience,
    expandLatestPositions = false,
    expandCurrentPosition = false,
}: {
    experience: ExperienceItemType;
    expandLatestPositions?: boolean;
    expandCurrentPosition?: boolean;
}) {
    const logoScale = experience.companyLogoScale ?? 1;

    return (
        <div className="space-y-4 border-b border-border py-5 last:border-b-0">
            <div className="not-prose flex items-center gap-3">
                <div
                    className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background"
                >
                    {experience.companyLogo ? (
                        <Image
                            src={experience.companyLogo}
                            alt=""
                            width={COMPANY_LOGO_SIZE}
                            height={COMPANY_LOGO_SIZE}
                            quality={100}
                            className="size-full object-contain"
                            style={{ transform: `scale(${logoScale})` }}
                            unoptimized
                        />
                    ) : (
                        <span className="flex size-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    )}
                </div>

                <h3 className="text-lg font-medium leading-snug tracking-tight text-foreground">
                    {experience.companyName}
                </h3>

                {experience.isCurrentEmployer && (
                    <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        Current
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {experience.positions.map((position, index) => (
                    <ExperiencePositionItem
                        key={position.id}
                        position={position}
                        defaultOpen={
                            index === 0 &&
                            (expandLatestPositions ||
                                (expandCurrentPosition && experience.isCurrentEmployer))
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export function ExperiencePositionItem({
    position,
    defaultOpen = false,
}: {
    position: ExperiencePositionItemType;
    defaultOpen?: boolean;
}) {
    const ExperienceIcon = iconMap[position.icon || "business"];

    return (
        <CollapsibleWithContext defaultOpen={defaultOpen} openFromHash={position.id} asChild>
            <div id={position.id} className="relative scroll-m-24">
                <CollapsibleTrigger
                    className="group/experience not-prose block w-full text-left select-none"
                >
                    <div className="flex items-start gap-3">
                        <div
                            className={cn(
                                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-lg mt-0.5",
                                "bg-muted text-muted-foreground"
                            )}
                            aria-hidden
                        >
                            <ExperienceIcon className="size-4" />
                        </div>

                        <div className="-ml-2 flex min-h-11 flex-1 flex-col justify-center rounded-lg px-3 py-2 hover:bg-muted/60 transition-colors">
                            <div className="mb-1 flex items-center gap-3">
                                <span className="flex-1 text-base font-medium text-balance text-foreground">
                                    {position.title}
                                </span>

                                <div
                                    className="shrink-0 text-muted-foreground [&_svg]:size-4"
                                    aria-hidden
                                >
                                    <CollapsibleChevronsIcon />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                {position.employmentType && (
                                    <>
                                        <dl>
                                            <dt className="sr-only">Employment Type</dt>
                                            <dd>{position.employmentType}</dd>
                                        </dl>
                                        <span aria-hidden>/</span>
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
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({ children, href }) => {
                                        const isExternal =
                                            href?.startsWith("https://") || href?.startsWith("http://");

                                        return (
                                        <a
                                            href={href}
                                            target={isExternal ? "_blank" : undefined}
                                            rel={
                                                isExternal
                                                    ? "noopener noreferrer"
                                                    : undefined
                                            }
                                        >
                                            {children}
                                        </a>
                                        );
                                    },
                                }}
                            >
                                {position.description}
                            </ReactMarkdown>
                        </Prose>
                    )}

                    {Array.isArray(position.skills) && position.skills.length > 0 && (
                        <ul className="not-prose flex flex-wrap gap-1.5 pt-2 pl-9">
                            {position.skills.map((skill) => (
                                <li key={skill} className="flex">
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
                "prose prose-sm max-w-none text-foreground prose-neutral dark:prose-invert",
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
                "inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}
