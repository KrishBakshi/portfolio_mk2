import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/config/metadata";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { BlogCard } from "@/components/blog/BlogCard";
import { pageTitle, sectionTitle } from "@/lib/utils";

import { PageDetailShell } from "@/components/PageDetailShell";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getNeighboringPosts,
  getRelatedPosts,
  getRawMdxContent,
} from "@/lib/blog";
import { PostShareMenu } from "@/components/blog/PostShareMenu";
import { LLMCopyButtonWithViewOptions } from "@/components/blog/PostActions";
import { SITE_INFO } from "@/config/site";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getPublishedBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || !post.frontmatter.isPublished) {
    return {
      title: "Writing Not Found",
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
    image: post.frontmatter.image,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || !post.frontmatter.isPublished) {
    notFound();
  }

  const { frontmatter, content } = post;
  const { previous, next } = getNeighboringPosts(slug);
  const related = getRelatedPosts(slug);
  const rawMdxContent = getRawMdxContent(slug);
  const formattedDate = new Date(frontmatter.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: { "@type": "Person", name: frontmatter.author ?? "Krish Bakshi" },
    mainEntityOfPage: `${SITE_INFO.url}/blog/${slug}`,
    ...(frontmatter.image ? { image: new URL(frontmatter.image, SITE_INFO.url).toString() } : {}),
  };

  return (
    <PageDetailShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <ReadingProgress />
      <div className="flex items-center justify-between py-3">
        <BackButton href="/blog" label="Back to Writing" />

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`/data/blog/${slug}/${slug}.mdx`}
            mdxContent={rawMdxContent || undefined}
          />
          <PostShareMenu url={`/blog/${slug}`} />
        </div>
      </div>

      <TableOfContents content={content} title={frontmatter.title} />

      <article data-reading-scope className="relative py-4 sm:py-6">
        <div className="mx-auto max-w-[720px] space-y-6">
          <header>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={frontmatter.date}>{formattedDate}</time>
              <span aria-hidden>/</span>
              <span>{frontmatter.readTime}</span>
              {frontmatter.author ? <><span aria-hidden>/</span><span>{frontmatter.author}</span></> : null}
            </div>
            <h1 className={pageTitle}>
              {frontmatter.title}
            </h1>
          </header>

          {frontmatter.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <NotionRenderer content={content} />

          {frontmatter.externalUrl && (
            <div>
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

      <div className="mx-auto w-full max-w-[720px] border-t border-border">
      {related.length > 0 ? (
        <section className="py-5">
          <h2 className={`${sectionTitle} mb-5`}>Related writing</h2>
          {related.map((post) => (
            <BlogCard key={post.slug} post={post.frontmatter} />
          ))}
        </section>
      ) : null}

      <nav aria-label="Article pagination" className="grid grid-cols-1 sm:grid-cols-2">
        {previous ? (
          <Button
            variant="link"
            className="h-auto flex-col items-start gap-1 whitespace-normal px-0 py-4 text-left sm:pr-6"
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
            className="h-auto flex-col items-end gap-1 whitespace-normal px-0 py-4 text-right sm:pl-6"
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
      </nav>
      </div>
    </PageDetailShell>
  );
}
