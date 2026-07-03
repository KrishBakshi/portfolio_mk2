import type { NavItem } from "@/types/nav";

/** Resolve site URL from an incoming request (runtime, e.g. LinkedIn crawler). */
export function getSiteUrlFromHeaders(headersList: Headers): string | null {
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  if (!host || host.startsWith("localhost")) return null;

  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host.split(",")[0].trim()}`;
}

/** Resolve site URL at build time or on the server without APP_URL. */
export function getSiteUrl(): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  if (vercelHost) {
    return `https://${vercelHost.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export const SITE_INFO = {
  name: "Krish Bakshi",
  get url() {
    return getSiteUrl();
  },
  description: "I build cool stuff using Data and AI.",
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const MAIN_NAV: NavItem[] = [
  {
    title: "Work",
    href: "/work",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Blog",
    href: "/blog",
  },
];
