import dynamic from "next/dynamic";

import { DesktopNav } from "./desktop-nav";
import { MAIN_NAV } from "@/config/site";
import { SideNav } from "./side-nav";
import { ThemeToggle } from "./theme-toggle";
import type { NavItem } from "@/types/nav";

const MobileNav = dynamic(() =>
  import("@/components/layout/mobile-nav").then((mod) => mod.MobileNav)
);

const NAV_WITH_HOME: NavItem[] = [{ title: "Home", href: "/" }, ...MAIN_NAV];

export function SiteHeader() {
  return (
    <>
      {/* From 1080px the side list takes over, so the top bar is not needed. */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md min-[1080px]:hidden">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-end gap-2 px-5 sm:gap-4 sm:px-8">
          <DesktopNav items={NAV_WITH_HOME} />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNav className="-mr-[9px] min-[765px]:hidden" items={NAV_WITH_HOME} />
          </div>
        </div>
      </header>
      <SideNav items={MAIN_NAV} />
    </>
  );
}
