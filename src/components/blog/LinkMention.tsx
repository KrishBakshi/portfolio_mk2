import React from "react";
import { ExternalLink } from "lucide-react";

const SITE_NAMES: Record<string, string> = {
    "huggingface.co": "Hugging Face",
    "github.com": "GitHub",
    "arxiv.org": "arXiv",
    "docs.z.ai": "Z.ai Docs",
    "z.ai": "Z.ai",
    "aistudio.baidu.com": "Baidu AI Studio",
    "datalab.to": "Datalab",
    "www.datalab.to": "Datalab",
};

function getSiteName(hostname: string) {
    const bare = hostname.replace(/^www\./, "");
    if (SITE_NAMES[hostname]) return SITE_NAMES[hostname];
    if (SITE_NAMES[bare]) return SITE_NAMES[bare];

    const label = bare.split(".")[0];
    return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatPath(url: URL) {
    const path = decodeURIComponent(url.pathname).replace(/^\/|\/$/g, "");
    if (!path) return url.hostname.replace(/^www\./, "");

    if (path.length > 44) {
        return `${path.slice(0, 44)}…`;
    }
    return path;
}

/**
 * A link counts as a "mention" only when its visible text is just the URL
 * itself (a bare autolink, or `[host/path](https://host/path)`) — never when
 * the author wrote custom anchor text, so ordinary inline links are untouched.
 */
export function isMentionLink(href: string, text: string) {
    const strip = (s: string) => s.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    return strip(href) === strip(text);
}

interface LinkMentionProps {
    url: string;
}

/**
 * Small inline "path · Site Name" badge for bare links.
 * Compact by design: it should sit inline in a sentence like a tiny pill,
 * not read as a separate block.
 */
export function LinkMention({ url }: LinkMentionProps) {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
            </a>
        );
    }

    const siteName = getSiteName(parsed.hostname);
    const path = formatPath(parsed);
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="not-prose inline-flex items-center gap-1 rounded border border-border/60 bg-muted/40 px-1 py-0 align-middle text-xs leading-none text-foreground no-underline transition-colors hover:bg-muted"
        >
            <ExternalLink className="size-3 shrink-0 text-muted-foreground" aria-hidden />
            <span>{path}</span>
            <span className="text-muted-foreground">· {siteName}</span>
        </a>
    );
}
