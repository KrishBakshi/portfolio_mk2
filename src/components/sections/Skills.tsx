"use client";

import { sectionTitle } from "@/lib/utils";
import React from "react";
import { TECH_STACK } from "@/lib/static-data";
import { getTechIcon } from "@/components/TechIcons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

export function Skills({ max = 18 }: { max?: number }) {
    return (
        <section className="px-5 sm:px-8">
            <header className="mb-6">
                <h2 className={sectionTitle}>Stack</h2>
            </header>

            <div>
                <TooltipProvider delayDuration={100}>
                <ul className="flex flex-wrap gap-2 select-none">
                    {TECH_STACK.slice(0, max).map((tech) => {
                        const Icon = getTechIcon(tech.title);
                        
                        if (!Icon) return null; // Skip if no icon found for now

                        return (
                            <li key={tech.key} className="flex">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Link
                                        href={tech.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={tech.title}
                                        className="group grid size-10 place-items-center rounded-md transition-colors hover:bg-muted"
                                    >
                                        <div className="flex size-8 items-center justify-center p-1.5 text-muted-foreground transition-colors group-hover:text-foreground">
                                            <Icon className="size-full" />
                                        </div>
                                    </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{tech.title}</TooltipContent>
                                </Tooltip>
                            </li>
                        );
                    })}
                </ul>
                </TooltipProvider>
            </div>
        </section>
    );
}

