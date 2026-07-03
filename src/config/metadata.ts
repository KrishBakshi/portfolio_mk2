import type { Metadata } from "next";

import { SITE_INFO } from "@/config/site";
import { PROFILE } from "@/lib/llms";

export const TWITTER_HANDLE = "@KrishBakshi_";
export const SHARE_IMAGE = PROFILE.bannerImages.light;

const TITLE_SEP = " - ";
const DEFAULT_TITLE = `${PROFILE.name}${TITLE_SEP}${PROFILE.title}`;

const DEFAULT_OG_IMAGES = [
  {
    url: SHARE_IMAGE,
    alt: DEFAULT_TITLE,
  },
] as NonNullable<Metadata["openGraph"]>["images"];

export const PAGE_META: Record<string, { title: string; description: string }> = {
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

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  authors,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const displayTitle =
    title === DEFAULT_TITLE ? DEFAULT_TITLE : `${title}${TITLE_SEP}${PROFILE.name}`;

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
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
      images: DEFAULT_OG_IMAGES,
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

export function getRootMetadata(siteUrl?: string): Metadata {
  const base = buildPageMetadata({ ...PAGE_META["/"], path: "/" });
  const metadataBase = new URL(siteUrl ?? SITE_INFO.url);

  return {
    metadataBase,
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
