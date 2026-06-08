"use client";

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import ini from "highlight.js/lib/languages/ini";
import json from "highlight.js/lib/languages/json";

import { CopyButton } from "@/components/blog/CopyButton";
import { cn } from "@/lib/utils";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("ini", ini);
hljs.registerLanguage("json", json);

const LANGUAGE_ALIASES: Record<string, string> = {
  zsh: "bash",
  sh: "bash",
  shell: "bash",
};

function highlightCode(code: string, lang: string) {
  const language = LANGUAGE_ALIASES[lang] ?? lang;

  try {
    if (hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
  } catch {
    // fall through to auto-detect
  }

  return hljs.highlightAuto(code).value;
}

interface BlogCodeBlockProps {
  code: string;
  lang: string;
  className?: string;
  embedded?: boolean;
  showCopyButton?: boolean;
}

export function BlogCodeBlock({
  code,
  lang,
  className,
  embedded = false,
  showCopyButton = true,
}: BlogCodeBlockProps) {
  const highlighted = useMemo(() => highlightCode(code, lang), [code, lang]);

  if (embedded) {
    return (
      <div className={cn("blog-code-block relative border-0", className)}>
        {showCopyButton ? (
          <div className="absolute top-2 right-2 z-10">
            <CopyButton text={code} />
          </div>
        ) : null}
        <pre>
          <code
            className={cn("hljs block font-mono text-sm", `language-${lang}`)}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    );
  }

  return (
    <div className={cn("not-prose blog-code-block relative my-4", className)}>
      <div className="absolute top-2 right-2 z-10">
        <CopyButton text={code} />
      </div>
      <pre>
        <code
          className={cn("hljs block font-mono text-sm", `language-${lang}`)}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
