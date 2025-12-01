import type { NavItem } from "@/types/nav";

export const SITE_INFO = {
  name: "Krish Bakshi",
  url: process.env.APP_URL || "http://localhost:3000",
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

