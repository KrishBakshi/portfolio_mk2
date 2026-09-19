import Image from "next/image";
import Link from "next/link";

interface EntryRowProps {
  href?: string;
  title: string;
  meta?: string;
  logo?: string;
}

/** One line: name on the left, small muted tags/meta on the right. */
export function EntryRow({ href, title, meta, logo }: EntryRowProps) {
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        {logo ? (
          <Image src={logo} alt="" width={20} height={20} className="size-5 shrink-0 rounded object-cover" />
        ) : null}
        <span className="truncate text-[15px] text-foreground">{title}</span>
      </span>
      {meta ? (
        <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
          {meta}
        </span>
      ) : null}
    </>
  );
  const className = "flex items-center justify-between gap-6 py-2";

  return href ? (
    <Link href={href} className={`${className} hover:underline underline-offset-4`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
