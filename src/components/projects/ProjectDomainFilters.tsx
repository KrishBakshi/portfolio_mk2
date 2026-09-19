"use client";

import { cn } from "@/lib/utils";

interface ProjectDomainFiltersProps {
  domains: string[];
  activeDomain: string | null;
  onChange: (domain: string | null) => void;
}

const pillClassName =
  "font-mono text-xs underline-offset-4 transition-colors hover:text-foreground hover:underline";

export function ProjectDomainFilters({
  domains,
  activeDomain,
  onChange,
}: ProjectDomainFiltersProps) {
  if (domains.length === 0) {
    return null;
  }

  const pills = ["All", ...domains];

  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" role="list">
      {pills.map((label) => {
        const isAll = label === "All";
        const isActive = isAll ? activeDomain === null : activeDomain === label;

        return (
          <li key={label}>
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={isAll ? "Show all projects" : `Filter projects by ${label}`}
              onClick={() => onChange(isAll ? null : label)}
              className={cn(
                pillClassName,
                isActive ? "text-foreground underline" : "text-muted-foreground"
              )}
            >
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
