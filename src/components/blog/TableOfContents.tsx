"use client";

import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { getTocMarkdownContent } from "@/lib/blog-dropdown";

interface TableOfContentsProps {
  content: string;
  title: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

function isSectionHeading(heading: Heading) {
  return heading.level <= 2;
}

function getRailBarClassName(heading: Heading, activeId: string) {
  const isSection = isSectionHeading(heading);
  const isActive = activeId === heading.id;

  return cn(
    "ml-auto block h-[2px] shrink-0 rounded-full transition-all duration-300",
    isSection
      ? isActive
        ? "w-7 bg-primary"
        : "w-5 bg-muted-foreground/30 hover:w-6 hover:bg-foreground"
      : isActive
        ? "w-6 bg-primary"
        : "w-4 bg-muted-foreground/30 hover:w-5 hover:bg-foreground"
  );
}

export function TableOfContents({ content, title }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const proseContent = getTocMarkdownContent(content);
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const extractedHeadings: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(proseContent)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");

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
      { rootMargin: "-100px 0px -66% 0px" }
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
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="group fixed top-1/2 right-8 z-50 hidden -translate-y-1/2 xl:block"
    >
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 right-0 z-50 flex w-56 -translate-y-1/2 translate-x-4 flex-col gap-1.5 border border-gray-300/50 bg-card p-3.5 opacity-0 shadow-xl transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 dark:border-white/10",
        )}
      >
        <h4 className="mb-1.5 line-clamp-2 px-1.5 font-mono text-[13px] leading-snug font-semibold text-muted-foreground">
          {title}
        </h4>
        <ul className="flex flex-col gap-0.5">
          {headings.map((heading) => {
            const isSection = isSectionHeading(heading);

            return (
              <li
                key={heading.id}
                className={cn(!isSection && "pl-2.5")}
              >
                <button
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "w-full rounded-md px-1.5 text-left font-mono transition-colors hover:bg-muted",
                    isSection
                      ? "py-1 text-[13px] leading-snug font-semibold"
                      : "py-0.5 text-xs leading-snug",
                    activeId === heading.id
                      ? "bg-muted/50 font-medium text-foreground"
                      : isSection
                        ? "text-foreground/85"
                        : "text-muted-foreground"
                  )}
                >
                  {heading.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="flex w-full flex-col gap-3 py-4 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        {headings.map((heading) => (
          <li key={heading.id} className="flex w-full justify-end">
            <button
              type="button"
              onClick={() => scrollToHeading(heading.id)}
              className={getRailBarClassName(heading, activeId)}
              aria-label={`Scroll to ${heading.text}`}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
