"use client";

import { useState } from "react";
import { SiApple, SiLinux } from "react-icons/si";

import { BlogCodeBlock } from "@/components/blog/BlogCodeBlock";
import { CopyButton } from "@/components/blog/CopyButton";
import { cn } from "@/lib/utils";

export type BlogCodeTabIconId = "mac" | "linux";

export interface BlogCodeTabItem {
  id: string;
  label: string;
  code: string;
  lang: string;
  iconId?: BlogCodeTabIconId;
}

const TAB_ICONS: Record<
  BlogCodeTabIconId,
  React.ComponentType<{ className?: string }>
> = {
  mac: SiApple,
  linux: SiLinux,
};

interface BlogCodeTabsProps {
  tabs: BlogCodeTabItem[];
  defaultTabId?: string;
  ariaLabel?: string;
}

export function BlogCodeTabs({
  tabs,
  defaultTabId,
  ariaLabel = "Choose option",
}: BlogCodeTabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <div className="not-prose relative my-4 overflow-hidden border border-border bg-code">
      <div className="px-4 shadow-[inset_0_-1px_0_0] shadow-border">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="flex h-auto items-center gap-4"
        >
          {tabs.map((tab) => {
            const Icon = tab.iconId ? TAB_ICONS[tab.iconId] : undefined;
            const isActive = activeId === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 border-b border-transparent p-0 font-mono text-sm transition-colors",
                  isActive
                    ? "border-foreground text-code-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <CopyButton className="absolute top-2 right-2 z-10" text={active.code} />

      <BlogCodeBlock
        code={active.code}
        lang={active.lang}
        embedded
        showCopyButton={false}
      />
    </div>
  );
}
