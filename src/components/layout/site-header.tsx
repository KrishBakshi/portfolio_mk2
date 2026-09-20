import dynamic from "next/dynamic";

import { DesktopNav } from "./desktop-nav";
import { MAIN_NAV } from "@/config/site";
import { SiteHeaderMark } from "./site-header-mark";
import { ThemeToggle } from "./theme-toggle";

const MobileNav = dynamic(() =>
  import("@/components/layout/mobile-nav").then((mod) => mod.MobileNav)
);

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 px-5 sm:gap-4 sm:px-8">
        <SiteHeaderMark />

        <div className="flex-1" />

        <DesktopNav items={MAIN_NAV} />

        <div className="-mr-[9px] flex items-center gap-1">
          <ThemeToggle />
          <MobileNav className="min-[765px]:hidden" items={MAIN_NAV} />
        </div>
      </div>
    </header>
  );
}


