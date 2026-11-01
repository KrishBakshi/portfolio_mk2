import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};


/** Heading scale: one page title per page, section titles beneath it. */
/** Text links: a thin, faint underline so they read as links, firming up on hover. */
export const textLink =
  "underline decoration-1 underline-offset-4 decoration-muted-foreground/40 transition-colors hover:decoration-foreground";

export const pageTitle = "text-xl font-medium leading-tight tracking-tight text-foreground sm:text-2xl";
export const sectionTitle = "text-base font-medium tracking-tight text-foreground";
