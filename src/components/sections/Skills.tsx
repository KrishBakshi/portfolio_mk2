"use client";

import React from "react";
import { TECH_STACK } from "@/data/skills";
import { getTechIcon } from "@/components/TechIcons";
import { SimpleTooltip } from "@/components/ui/tooltip";
import Link from "next/link";

export function Skills() {
    return (
        <section className="bg-background px-4 sm:py-4">
            <header className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans">Stack</h2>
            </header>

            <div className="bg-background">
                <ul className="flex flex-wrap gap-2 select-none">
                    {TECH_STACK.map((tech) => {
                        const Icon = getTechIcon(tech.title);
                        
                        if (!Icon) return null; // Skip if no icon found for now

                        return (
                            <li key={tech.key} className="flex">
                                <SimpleTooltip content={tech.title}>
                                    <Link
                                        href={tech.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={tech.title}
                                        className="block"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 p-2">
                                            <Icon className="size-full" />
                                        </div>
                                        <span className="sr-only">{tech.title}</span>
                                    </Link>
                                </SimpleTooltip>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}

