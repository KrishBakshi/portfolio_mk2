import Link from "next/link";

import { cn } from "@/lib/utils";

interface ShowAllLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function ShowAllLink({ href, label, className }: ShowAllLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono tracking-wide text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
}
