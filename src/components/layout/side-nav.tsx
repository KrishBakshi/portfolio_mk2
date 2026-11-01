"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Wide screens only (from 1080px): the main links as a list in the left margin. */
export function SideNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const links = [{ title: "Home", href: "/" }, ...items];

  return (
    <aside
      id="side-nav"
      // 336px = half of the max-w-2xl content column; the list's right edge sits 2.5rem left of it.
      className="fixed top-24 right-[calc(50%+336px+2.5rem)] z-40 hidden text-right min-[1080px]:block"
    >
      <nav aria-label="Primary navigation" className="flex flex-col text-sm lowercase">
        {links.map(({ title, href }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "py-1.5 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground",
                active && "text-foreground underline decoration-brand"
              )}
            >
              {title}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 flex justify-end">
        <ThemeToggle />
      </div>
    </aside>
  );
}
