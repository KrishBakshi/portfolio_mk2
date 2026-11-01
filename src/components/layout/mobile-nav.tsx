"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";

export function MobileNav({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("group/toggle flex flex-col gap-1", className)}
          size="icon"
        >
          <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]/toggle:translate-y-[3px] group-data-[state=open]/toggle:rotate-45" />
          <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]/toggle:translate-y-[-3px] group-data-[state=open]/toggle:-rotate-45" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 lowercase" align="end" sideOffset={8}>
        {items.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <DropdownMenuItem key={link.href} asChild>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(active && "bg-accent font-medium text-foreground")}
              >
                {link.title}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

