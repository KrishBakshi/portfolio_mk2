import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** True for links that leave the site (http/https). mailto:, /paths and #anchors are not. */
export function isExternalHref(href?: string): boolean {
  return !!href && /^https?:\/\//i.test(href);
}

/**
 * The small arrow every link to another site gets, placed right after the link's
 * text (or at the end of a row or button). Sized to the surrounding text.
 */
export function ExternalArrow({ className }: { className?: string }) {
  return (
    <ArrowUpRight
      aria-hidden
      strokeWidth={1.75}
      className={cn(
        "ml-0.5 inline-block size-[0.8em] shrink-0 align-baseline text-muted-foreground transition-colors group-hover:text-foreground",
        className
      )}
    />
  );
}
