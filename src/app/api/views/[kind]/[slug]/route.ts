import { NextResponse } from "next/server";

import { getBlogPostBySlug } from "@/lib/blog";
import { getProjectBySlug } from "@/lib/projects";

const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;

function exists(kind: string, slug: string) {
  if (kind === "blog") return getBlogPostBySlug(slug)?.frontmatter.isPublished === true;
  if (kind === "project") return getProjectBySlug(slug) !== null;
  return false;
}

/**
 * Adds one view and returns the new total. One Redis command per call; the
 * client only calls this once per visitor per page per day. Unknown slugs and
 * bots never reach Redis, so keys can't be created arbitrarily.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ kind: string; slug: string }> }
) {
  const { kind, slug } = await params;
  const url = process.env.VIEWS_KV_REST_API_URL;
  const token = process.env.VIEWS_KV_REST_API_TOKEN;

  if (!url || !token || !exists(kind, slug) || BOT_PATTERN.test(request.headers.get("user-agent") ?? "")) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const res = await fetch(`${url}/incr/${encodeURIComponent(`views:${kind}:${slug}`)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return new NextResponse(null, { status: 204 });

    const { result } = (await res.json()) as { result: number };
    return NextResponse.json({ views: result }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
