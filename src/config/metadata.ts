import type { Metadata } from "next";

import { SITE_INFO } from "@/config/site";
import { PROFILE } from "@/lib/llms";

export const TWITTER_HANDLE = "@KrishBakshi_";

export interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  images?: NonNullable<Metadata["openGraph"]>["images"];
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
}

const TITLE_SEP = " - ";
const DEFAULT_TITLE = `${PROFILE.name}${TITLE_SEP}${PROFILE.title}`;

function getOgImagePath(path: string): string {
  if (path === "/") return "/opengraph-image";
  return `${path.replace(/\/$/, "")}/opengraph-image`;
}

export const PAGE_META: Record<string, Omit<PageMetaInput, "path">> = {
  "/": {
    title: DEFAULT_TITLE,
    description: PROFILE.about,
  },
  "/work": {
    title: "Work Experience",
    description:
      "Professional experience building and deploying data science and AI systems, from computer vision pipelines to production LLM applications.",
  },
  "/projects": {
    title: "Projects",
    description:
      "Portfolio projects across Vision, AI Agents, LLM, RAG, Gen AI, and RL, from research prototypes to production systems.",
  },
  "/blog": {
    title: "Blog",
    description:
      "Technical writing on ML engineering, experiment tracking, GPU workflows, and developer tooling.",
  },
};

export function isValidOgImage(url?: string | null): url is string {
  if (!url) return false;
  if (url.endsWith(".svg")) return false;
  return true;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  images,
  publishedTime,
  authors,
  tags,
}: PageMetaInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const displayTitle =
    title === DEFAULT_TITLE ? DEFAULT_TITLE : `${title}${TITLE_SEP}${PROFILE.name}`;
  const ogImages =
    images ??
    ([
      {
        url: getOgImagePath(canonicalPath),
        width: 1200,
        height: 630,
        alt: displayTitle,
      },
    ] as NonNullable<Metadata["openGraph"]>["images"]);

  return {
    title,
    description,
    authors: [{ name: PROFILE.name }],
    creator: PROFILE.name,
    openGraph: {
      type,
      url: canonicalPath,
      title: displayTitle,
      description,
      siteName: PROFILE.name,
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(tags ? { tags } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
      images: ogImages,
    },
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function getStaticPageMetadata(path: keyof typeof PAGE_META): Metadata {
  const config = PAGE_META[path];
  return buildPageMetadata({ ...config, path });
}

export function getRootMetadata(): Metadata {
  const base = buildPageMetadata({ ...PAGE_META["/"], path: "/" });

  return {
    metadataBase: new URL(SITE_INFO.url),
    title: {
      default: DEFAULT_TITLE,
      template: `%s${TITLE_SEP}${PROFILE.name}`,
    },
    description: PROFILE.about,
    authors: base.authors,
    creator: base.creator,
    openGraph: base.openGraph,
    twitter: base.twitter,
    alternates: base.alternates,
    robots: base.robots,
  };
}
