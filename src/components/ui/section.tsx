import Link from "next/link";

interface SectionProps {
  title: string;
  href?: string;
  children: React.ReactNode;
}

export function Section({ title, href, children }: SectionProps) {
  return (
    <section className="px-5 sm:px-8">
      <div className="mb-2 flex items-baseline justify-between">
        {href ? (
          <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        ) : (
          <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        )}
        {href ? (
          <Link href={href} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            All →
          </Link>
        ) : null}
      </div>
      <div>{children}</div>
    </section>
  );
}
