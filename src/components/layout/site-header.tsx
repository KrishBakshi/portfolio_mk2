import dynamic from "next/dynamic";

import { DesktopNav } from "./desktop-nav";
import { CommandMenu } from "./command-menu";
import { MAIN_NAV } from "@/config/site";
import { cn } from "@/lib/utils";

import { SiteHeaderMark } from "./site-header-mark";
import { SiteHeaderWrapper } from "./site-header-wrapper";
import { ThemeToggle } from "./theme-toggle";

const MobileNav = dynamic(() =>
  import("@/components/layout/mobile-nav").then((mod) => mod.MobileNav)
);

export function SiteHeader() {
  return (
    <SiteHeaderWrapper
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background pt-2",
        "transition-shadow duration-300"
      )}
    >
      <div className="mx-auto flex h-12 items-center justify-between gap-2 px-2 sm:gap-4 border border-gray-300/50 dark:border-white/10">
        <SiteHeaderMark />

        <div className="flex-1" />

        <DesktopNav items={MAIN_NAV} />

        <div className="flex items-center gap-2">
          <CommandMenu />
          <span className="mx-2 hidden h-4 w-px bg-border sm:flex" />
          <ThemeToggle />
          <MobileNav className="sm:hidden" items={MAIN_NAV} />
        </div>
      </div>
    </SiteHeaderWrapper>
  );
}


