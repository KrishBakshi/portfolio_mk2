"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Nav } from "./nav";
import type { NavItem } from "@/types/nav";

export function DesktopNav({ items, className }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname();

  return <Nav className={cn("max-[764px]:hidden", className)} items={items} activeId={pathname} />;
}
