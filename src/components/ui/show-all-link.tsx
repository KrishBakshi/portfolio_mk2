import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
        "group inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline",
        className
      )}
    >
      {label}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
