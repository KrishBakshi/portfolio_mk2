import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};


/** Heading scale: one page title per page, section titles beneath it. */
export const pageTitle = "text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl";
export const sectionTitle = "text-lg font-semibold tracking-tight text-foreground";
