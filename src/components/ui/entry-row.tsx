import Link from "next/link";

interface EntryRowProps {
  href?: string;
  title: string;
  meta?: string;
}

/** One line: name on the left, small muted tags/meta on the right. */
export function EntryRow({ href, title, meta }: EntryRowProps) {
  const content = (
    <>
      <span className="min-w-0 truncate text-[15px] text-foreground">{title}</span>
      {meta ? (
        <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
          {meta}
        </span>
      ) : null}
    </>
  );
  const className = "flex items-baseline justify-between gap-6 py-2";

  return href ? (
    <Link href={href} className={`${className} hover:underline underline-offset-4`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
