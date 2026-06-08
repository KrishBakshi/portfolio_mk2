import type { BlogConfigDropdownProps } from "@/components/blog/BlogConfigDropdown";
import type { BlogInstallToggleProps } from "@/components/blog/BlogInstallToggle";
import type { BlogPlatformToggleProps } from "@/components/blog/BlogPlatformToggle";

export type BlogContentPart =
  | { type: "markdown"; content: string }
  | { type: "dropdown"; dropdown: BlogConfigDropdownProps }
  | { type: "platform"; platform: BlogPlatformToggleProps }
  | { type: "install"; install: BlogInstallToggleProps };

export const DROPDOWN_REGEX =
  /\[\[dropdown\s+path="([^"]+)"\s+lang="([^"]+)"\s*\]\]\n([\s\S]*?)\n\[\[\/dropdown\]\]/g;

const LEGACY_DROPDOWN_REGEX =
  /\[\[dropdown\s+step="[^"]+"\s+title="[^"]+"\s+path="([^"]+)"\s+lang="([^"]+)"\s*\]\]\n([\s\S]*?)\n\[\[\/dropdown\]\]/g;

export const PLATFORM_REGEX =
  /\[\[platform\]\]\n\[\[mac(?:\s+lang="([^"]*)")?\]\]\n([\s\S]*?)\n\[\[\/mac\]\]\n\[\[linux(?:\s+lang="([^"]*)")?\]\]\n([\s\S]*?)\n\[\[\/linux\]\]\n\[\[\/platform\]\]/g;

export const INSTALL_REGEX =
  /\[\[install\]\]\n\[\[uv(?:\s+lang="([^"]*)")?\]\]\n([\s\S]*?)\n\[\[\/uv\]\]\n\[\[pip(?:\s+lang="([^"]*)")?\]\]\n([\s\S]*?)\n\[\[\/pip\]\]\n\[\[\/install\]\]/g;

const FENCED_CODE_REGEX = /```[\s\S]*?```/g;

type SpecialMatch =
  | {
      kind: "dropdown";
      index: number;
      end: number;
      dropdown: BlogConfigDropdownProps;
    }
  | {
      kind: "platform";
      index: number;
      end: number;
      platform: BlogPlatformToggleProps;
    }
  | {
      kind: "install";
      index: number;
      end: number;
      install: BlogInstallToggleProps;
    };

function findSpecialMatches(content: string): SpecialMatch[] {
  const matches: SpecialMatch[] = [];

  for (const match of content.matchAll(new RegExp(DROPDOWN_REGEX.source, "g"))) {
    if (match.index === undefined) continue;
    matches.push({
      kind: "dropdown",
      index: match.index,
      end: match.index + match[0].length,
      dropdown: {
        path: match[1],
        lang: match[2],
        code: match[3].trim(),
      },
    });
  }

  for (const match of content.matchAll(new RegExp(PLATFORM_REGEX.source, "g"))) {
    if (match.index === undefined) continue;
    matches.push({
      kind: "platform",
      index: match.index,
      end: match.index + match[0].length,
      platform: {
        mac: { lang: match[1] || "bash", code: match[2].trim() },
        linux: { lang: match[3] || "bash", code: match[4].trim() },
      },
    });
  }

  for (const match of content.matchAll(new RegExp(INSTALL_REGEX.source, "g"))) {
    if (match.index === undefined) continue;
    matches.push({
      kind: "install",
      index: match.index,
      end: match.index + match[0].length,
      install: {
        uv: { lang: match[1] || "bash", code: match[2].trim() },
        pip: { lang: match[3] || "bash", code: match[4].trim() },
      },
    });
  }

  return matches.sort((a, b) => a.index - b.index);
}

export function splitBlogContentWithDropdowns(content: string): BlogContentPart[] {
  const matches = findSpecialMatches(content);

  if (matches.length === 0) {
    return [{ type: "markdown", content }];
  }

  const parts: BlogContentPart[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (match.index > lastIndex) {
      parts.push({
        type: "markdown",
        content: content.slice(lastIndex, match.index),
      });
    }

    if (match.kind === "dropdown") {
      parts.push({ type: "dropdown", dropdown: match.dropdown });
    } else if (match.kind === "platform") {
      parts.push({ type: "platform", platform: match.platform });
    } else {
      parts.push({ type: "install", install: match.install });
    }

    lastIndex = match.end;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "markdown",
      content: content.slice(lastIndex),
    });
  }

  return parts;
}

/** Strip file dropdowns, platform blocks, and fenced code for the sidebar TOC. */
export function getTocMarkdownContent(content: string): string {
  return content
    .replace(DROPDOWN_REGEX, "")
    .replace(LEGACY_DROPDOWN_REGEX, "")
    .replace(PLATFORM_REGEX, "")
    .replace(INSTALL_REGEX, "")
    .replace(FENCED_CODE_REGEX, "");
}
