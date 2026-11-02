import Link from "next/link";

import { ExternalArrow } from "@/components/ui/external-arrow";

interface EntryRowProps {
  href?: string;
  title: string;
  meta?: string;
  sub?: string;
  /** Link to another site: opens in a new tab, with a small arrow at the end of the row. */
  external?: boolean;
}

/** Name on the left, small muted tags on the right, optional one-line overview beneath. */
export function EntryRow({ href, title, meta, sub, external }: EntryRowProps) {
  const content = (
    <>
      <div className="flex items-baseline justify-between gap-6">
        <span className="min-w-0 truncate text-[15px] font-medium text-foreground group-hover:underline underline-offset-4">
          {title}
        </span>
        {meta ? (
          <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
            {meta}
          </span>
        ) : null}
        {external ? (
          <ExternalArrow className="ml-0 size-3.5 self-center" />
        ) : null}
      </div>
      {sub ? <p className="mt-1 truncate text-sm text-muted-foreground">{sub}</p> : null}
    </>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" data-mew-hide="top" className="group block py-3">
        {content}
      </a>
    );
  }

  return href ? (
    <Link href={href} data-mew-hide="top" className="group block py-3">
      {content}
    </Link>
  ) : (
    <div data-mew-hide="top" className="py-3">{content}</div>
  );
}
