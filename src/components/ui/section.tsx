import Link from "next/link";
import { pageTitle, sectionTitle } from "@/lib/utils";

interface SectionProps {
  title: string;
  href?: string;
  children: React.ReactNode;
}

export function Section({ title, href, children }: SectionProps) {
  return (
    <section className="px-5 sm:px-8">
      <div className="mb-3 flex items-baseline justify-between">
        {href ? (
          <h2 className={sectionTitle}>{title}</h2>
        ) : (
          <h1 className={`${pageTitle} mb-4`}>{title}</h1>
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
