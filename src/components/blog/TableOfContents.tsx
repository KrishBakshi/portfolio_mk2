"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface TableOfContentsProps {
    content: string;
    title: string;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ content, title }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Extract headings from markdown content
        // This is a simple regex extraction. For more complex cases, we might need a parser.
        // Matches # Heading, ## Heading, ### Heading
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const extractedHeadings: Heading[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            // Generate a simple slug for the ID (must match rehype-slug logic roughly)
            const id = text
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '');

            extractedHeadings.push({ id, text, level });
        }

        setHeadings(extractedHeadings);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveId(id);
        }
    };

    if (headings.length === 0) return null;

    return (
        <nav className="fixed right-8 top-1/2 -translate-y-1/2 hidden xl:block z-50 group">
            {/* Full TOC Card - Visible on Hover, replaces lines */}
            <div
                className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 w-64 p-4 bg-card border border-gray-300/50 dark:border-white/10 xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto z-50",
                    "flex flex-col gap-2 max-h-[80vh] overflow-y-auto"
                )}
            >
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 px-2 line-clamp-2 font-mono">{title}</h4>
                <ul className="flex flex-col gap-1">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <button
                                onClick={() => scrollToHeading(heading.id)}
                                className={cn(
                                    "text-sm text-left w-full px-2 py-1.5 rounded-md transition-colors hover:bg-muted",
                                    activeId === heading.id
                                        ? "text-foreground font-medium bg-muted/50 font-mono"
                                        : "text-muted-foreground font-mono"
                                )}
                            >
                                {heading.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* The Lines / Dashes - Visible by default, hidden on hover */}
            <ul className={cn(
                "flex flex-col gap-3 py-4 px-2 -mr-2 transition-opacity duration-300",
                "opacity-100 group-hover:opacity-0"
            )}>
                {headings.map((heading) => (
                    <li key={heading.id} className="flex items-center justify-end">
                        <button
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                                "h-[2px] transition-all duration-300 rounded-full",
                                activeId === heading.id
                                    ? "w-8 bg-primary"
                                    : "w-4 bg-muted-foreground/30 hover:bg-foreground hover:w-6"
                            )}
                            aria-label={`Scroll to ${heading.text}`}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
}
