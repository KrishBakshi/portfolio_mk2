import Link from "next/link";
import type { Metadata } from "next";

import { PageCanvas } from "@/components/PageCanvas";
import { ShowAllLink } from "@/components/ui/show-all-link";
import { MAIN_NAV } from "@/config/site";

const sectionClassName = "border-t border-border";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background">
        <div>
          <div className="relative flex flex-col items-center overflow-hidden px-6 py-16 text-center sm:py-20">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-[8rem] font-semibold leading-none tracking-tighter text-foreground/[0.05] sm:text-[11rem]"
            >
              404
            </span>

            <div className="relative z-10">
              <p className="font-mono text-xs text-muted-foreground">
                Error 404
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Page not found
              </h1>
              <p className="mx-auto mt-4 max-w-md font-sans text-[15px] leading-relaxed text-foreground/80 sm:text-base">
                The page you&apos;re looking for doesn&apos;t exist or may have
                moved.
              </p>
              <div className="mt-8 flex justify-center">
                <ShowAllLink href="/" label="Back to home" />
              </div>
            </div>
          </div>
        </div>

        <div className={`px-6 py-6 ${sectionClassName}`}>
          <p className="mb-3 font-mono text-xs text-muted-foreground">
            Or try one of these
          </p>
          <nav className="flex flex-wrap gap-2" aria-label="Site sections">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs font-mono tracking-wide text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

      </main>
    </PageCanvas>
  );
}
