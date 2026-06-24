import Link from "next/link";

import { PageCanvas } from "@/components/PageCanvas";
import Footer from "@/components/Footer";
import { ShowAllLink } from "@/components/ui/show-all-link";
import { MAIN_NAV } from "@/config/site";

const sectionClassName =
  "border border-gray-300/50 bg-background dark:border-white/10";

export default function NotFound() {
  return (
    <PageCanvas>
      <div className="mx-auto w-full max-w-3xl sm:px-0">
        <div className={`mb-6 mt-6 ${sectionClassName}`}>
          <div className="relative flex flex-col items-center overflow-hidden px-6 py-16 text-center sm:py-20">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none font-sans text-[7rem] font-semibold leading-none tracking-tighter text-foreground/[0.05] sm:text-[9rem]"
            >
              404
            </span>

            <div className="relative z-10">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Error 404
              </p>
              <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
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

        <div className={`mb-6 px-6 py-5 ${sectionClassName}`}>
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Or try one of these
          </p>
          <nav className="flex flex-wrap gap-2" aria-label="Site sections">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono tracking-wide text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className={sectionClassName}>
          <Footer />
        </div>
      </div>
    </PageCanvas>
  );
}
