import { getPublishedBlogPosts } from "@/lib/blog";
import { getSiteUrl } from "@/config/site";
import { PROFILE } from "@/lib/llms";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const siteUrl = getSiteUrl();
  const posts = getPublishedBlogPosts();
  const items = posts
    .map(
      ({ slug, frontmatter }) => `
    <item>
      <title>${escapeXml(frontmatter.title)}</title>
      <link>${siteUrl}/blog/${slug}</link>
      <guid>${siteUrl}/blog/${slug}</guid>
      <description>${escapeXml(frontmatter.description)}</description>
      <pubDate>${new Date(frontmatter.date).toUTCString()}</pubDate>
      <author>${escapeXml(`${PROFILE.email} (${PROFILE.name})`)}</author>
      ${frontmatter.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Krish Bakshi — Research Notes</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
    <description>Research notes, implementation details, and lessons from production AI systems.</description>${items}
  </channel>
</rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  );
}
