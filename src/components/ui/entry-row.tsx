import Link from "next/link";

interface EntryRowProps {
  href?: string;
  title: string;
  meta?: string;
  sub?: string;
}

/** Name on the left, small muted tags on the right, optional one-line overview beneath. */
export function EntryRow({ href, title, meta, sub }: EntryRowProps) {
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
      </div>
      {sub ? <p className="mt-1 truncate text-sm text-muted-foreground">{sub}</p> : null}
    </>
  );

  return href ? (
    <Link href={href} className="group block py-3">
      {content}
    </Link>
  ) : (
    <div className="py-3">{content}</div>
  );
}
