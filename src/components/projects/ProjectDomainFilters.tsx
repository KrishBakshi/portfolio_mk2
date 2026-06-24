"use client";

import { cn } from "@/lib/utils";

interface ProjectDomainFiltersProps {
  domains: string[];
  activeDomain: string | null;
  onChange: (domain: string | null) => void;
}

const pillClassName =
  "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors";

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
    <ul className="flex flex-wrap items-center gap-2" role="list">
      {pills.map((label) => {
        const isAll = label === "All";
        const isActive = isAll ? activeDomain === null : activeDomain === label;

        return (
          <li key={label}>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() =>
                onChange(isAll ? null : activeDomain === label ? null : label)
              }
              className={cn(
                pillClassName,
                isActive
                  ? "border-foreground/45 bg-muted/50 font-semibold text-foreground"
                  : "border-border/60 bg-muted/30 text-foreground/85 hover:border-foreground/30 hover:bg-muted/40"
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
