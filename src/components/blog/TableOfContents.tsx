"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  content: string;
  title: string;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

function TocLinks({
  headings,
  activeId,
  onSelect,
}: {
  headings: HeadingItem[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="border-l border-border">
      {headings.map((heading) => (
        <li key={heading.id}>
          <button
            type="button"
            onClick={() => onSelect(heading.id)}
            aria-current={activeId === heading.id ? "location" : undefined}
            className={cn(
              "-ml-px block w-full border-l px-4 py-1.5 text-left text-sm leading-snug transition-colors",
              heading.level >= 3 && "pl-7 text-xs",
              activeId === heading.id
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ content, title }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const elements = document.querySelectorAll<HTMLElement>(
        "[data-article-body] h2[id], [data-article-body] h3[id], [data-article-body] h4[id]"
      );
      setHeadings(
        Array.from(elements).map((element) => ({
          id: element.id,
          text: element.textContent?.trim() ?? element.id,
          level: Number(element.tagName.slice(1)),
        }))
      );
    });
    return () => cancelAnimationFrame(frame);
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
      { rootMargin: "-96px 0px -70% 0px" }
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
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      window.history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      <details className="mb-6 rounded-xl border border-border bg-card p-4 min-[1280px]:hidden">
        <summary className="cursor-pointer text-sm font-medium">On this page</summary>
        <nav aria-label="Table of contents" className="mt-4">
          <TocLinks headings={headings} activeId={activeId} onSelect={scrollToHeading} />
        </nav>
      </details>

      <nav
        aria-label={`On this page: ${title}`}
        className="fixed top-28 left-[calc(50%+26rem)] hidden w-48 min-[1280px]:block"
      >
        <p className="mb-3 text-xs font-medium text-muted-foreground">On this page</p>
        <TocLinks headings={headings} activeId={activeId} onSelect={scrollToHeading} />
      </nav>
    </>
  );
}
