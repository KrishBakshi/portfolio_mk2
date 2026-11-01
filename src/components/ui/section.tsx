import Link from "next/link";
import { cn, pageTitle, textLink } from "@/lib/utils";

interface SectionProps {
  title: string;
  href?: string;
  children: React.ReactNode;
}

/** Home-page section heading, written like a path: `/projects`. */
export function SlashHeading({
  title,
  id,
  className,
}: {
  title: string;
  id?: string;
  className?: string;
}) {
  return (
    <h2 id={id} data-mew-perch="beside" className={cn("font-mono text-sm font-medium tracking-tight text-foreground", className)}>
      <span aria-hidden className="text-brand">
        /
      </span>
      {title.toLowerCase()}
    </h2>
  );
}

export function Section({ title, href, children }: SectionProps) {
  return (
    <section className="px-5 sm:px-8">
      <div className="mb-3 flex items-baseline justify-between">
        {href ? (
          <SlashHeading title={title} />
        ) : (
          <h1 className={`${pageTitle} mb-4`}>{title}</h1>
        )}
        {href ? (
          <Link href={href} className={cn("text-xs text-muted-foreground hover:text-foreground", textLink)}>
            All →
          </Link>
        ) : null}
      </div>
      <div>{children}</div>
    </section>
  );
}
