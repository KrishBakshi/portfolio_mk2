"use client";

import { ChevronRightIcon } from "lucide-react";

import { BlogCodeBlock } from "@/components/blog/BlogCodeBlock";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface BlogConfigDropdownProps {
  path: string;
  lang: string;
  code: string;
}

export function BlogConfigDropdown({ path, lang, code }: BlogConfigDropdownProps) {
  return (
    <Collapsible className="not-prose my-4 overflow-hidden border border-border bg-code">
      <CollapsibleTrigger className="group flex w-full items-center gap-2 border-b border-border px-3 py-2 text-left font-mono text-sm text-code-foreground transition-colors hover:bg-code-highlight data-[state=closed]:border-b-0">
        <ChevronRightIcon
          className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90"
          aria-hidden
        />
        <span className="truncate">{path}</span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <BlogCodeBlock code={code} lang={lang} embedded />
      </CollapsibleContent>
    </Collapsible>
  );
}
