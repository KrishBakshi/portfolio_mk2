import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/config/metadata";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";

import { PageDetailShell } from "@/components/PageDetailShell";
import { BackButton } from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getNeighboringPosts,
  getRawMdxContent,
} from "@/lib/blog";
import { PostShareMenu } from "@/components/blog/PostShareMenu";
import { LLMCopyButtonWithViewOptions } from "@/components/blog/PostActions";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return buildPageMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.frontmatter.date,
    authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
    tags: post.frontmatter.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;
  const { previous, next } = getNeighboringPosts(slug);
  const rawMdxContent = getRawMdxContent(slug);

  return (
    <PageDetailShell>
      <div className="mt-6 mb-6 flex items-center justify-between">
        <BackButton href="/blog" label="Back to Blog" />

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`/data/blog/${slug}/${slug}.mdx`}
            mdxContent={rawMdxContent || undefined}
          />
          <PostShareMenu url={`/blog/${slug}`} />
        </div>
      </div>

      <TableOfContents content={content} title={frontmatter.title} />

      <article className="relative border border-gray-300/50 bg-background p-6 sm:p-8 dark:border-white/10">
        <div className="space-y-8">
          <header className="space-y-4">
            <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
              {frontmatter.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-mono">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <NotionRenderer content={content} />

          {frontmatter.externalUrl && (
            <div className="border-t pt-4">
              <a
                href={frontmatter.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Read full article on external site
                <ExternalLink className="size-4" />
              </a>
            </div>
          )}
        </div>
      </article>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {previous ? (
          <Button
            variant="link"
            className="h-auto flex-col items-start gap-1 whitespace-normal p-4 mb-4 text-left"
            asChild
          >
            <Link href={`/blog/${previous.slug}`}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowLeft className="size-3" />
                Previous Post
              </div>
              <div className="line-clamp-2 font-medium">
                {previous.frontmatter.title}
              </div>
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {next ? (
          <Button
            variant="link"
            className="h-auto flex-col items-end gap-1 whitespace-normal p-4 mb-4 text-right"
            asChild
          >
            <Link href={`/blog/${next.slug}`}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Next Post
                <ArrowRight className="size-3" />
              </div>
              <div className="line-clamp-2 font-medium">
                {next.frontmatter.title}
              </div>
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </PageDetailShell>
  );
}
