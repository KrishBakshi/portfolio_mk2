import React from "react";
import { ExternalArrow } from "@/components/ui/external-arrow";

const MAX_LABEL = 60;

/** "https://www.github.com/user/repo/" → "github.com/user/repo", shortened if very long. */
function formatLabel(url: URL) {
    const host = url.hostname.replace(/^www\./, "");
    const path = decodeURIComponent(url.pathname).replace(/\/$/, "");
    const label = `${host}${path}`;
    return label.length > MAX_LABEL ? `${label.slice(0, MAX_LABEL)}…` : label;
}

/**
 * A link counts as a "mention" only when its visible text is just the URL
 * itself (a bare autolink, or `[host/path](https://host/path)`): never when
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
 * A bare URL in a post, shown as a plain link with a tidy label (no protocol,
 * no "www.", long paths shortened) and the usual arrow for links to other sites.
 */
export function LinkMention({ url }: LinkMentionProps) {
    let label = url;
    try {
        label = formatLabel(new URL(url));
    } catch {
        // Not a parseable URL: show it as written.
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {label}
            <ExternalArrow />
        </a>
    );
}
