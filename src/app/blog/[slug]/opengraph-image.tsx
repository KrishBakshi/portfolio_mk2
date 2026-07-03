import { getBlogPostBySlug } from "@/lib/blog";
import { createOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";

export const alt = "Blog Post - Krish Bakshi";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

interface BlogOgImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Image({ params }: BlogOgImageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return createOgImage({
      title: "Blog Post Not Found",
      description: "This blog post could not be found on the portfolio.",
      label: "Blog",
    });
  }

  return createOgImage({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    label: "Blog",
    tags: post.frontmatter.tags,
  });
}
