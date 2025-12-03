import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";

import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import { BackButton } from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts, getBlogPostBySlug, getNeighboringPosts, getRawMdxContent } from "@/lib/blog";
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Blog Post Not Found',
        };
    }

    return {
        title: `${post.frontmatter.title} | Blog`,
        description: post.frontmatter.description,
        openGraph: {
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            type: 'article',
            publishedTime: post.frontmatter.date,
            authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
            tags: post.frontmatter.tags,
            images: post.frontmatter.image ? [{ url: post.frontmatter.image }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            images: post.frontmatter.image ? [post.frontmatter.image] : [],
        }
    };
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

    const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen transition-colors duration-300 relative">
            <div className="relative mx-auto max-w-3xl">
                <DiagonalPatternFrame>
                    <div className="mx-auto w-full max-w-3xl sm:px-0">
                        <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />

                        <div className="mt-6 mb-6 flex items-center justify-between">
                            <BackButton href="/blog" label="Back to Blog" />
                            
                            <div className="flex items-center gap-2">
                                <LLMCopyButtonWithViewOptions 
                                    markdownUrl={`/blog/${slug}/${slug}.mdx`} 
                                    mdxContent={rawMdxContent || undefined}
                                />
                                <PostShareMenu url={`/blog/${slug}`} />
                            </div>
                        </div>

                        <article className="bg-background border border-gray-300/50 dark:border-white/10 p-6 sm:p-8 relative mb-8">
                            <TableOfContents content={content} title={frontmatter.title} />
                            <div className="space-y-8">
                                {/* Header */}
                                <header className="space-y-4">
                                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-sans">
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

                                {/* Featured Image */}
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                    <Image
                                        src={frontmatter.image}
                                        alt={frontmatter.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                {/* Content */}
                                <NotionRenderer content={content} />

                                {/* External Link */}
                                {frontmatter.externalUrl && (
                                    <div className="pt-4 border-t">
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

                        {/* Post Navigation */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {previous ? (
                                <Button
                                    variant="outline"
                                    className="h-auto flex-col items-start gap-1 p-4 whitespace-normal text-left"
                                    asChild
                                >
                                    <Link href={`/blog/${previous.slug}`}>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <ArrowLeft className="size-3" />
                                            Previous Post
                                        </div>
                                        <div className="font-medium line-clamp-2">
                                            {previous.frontmatter.title}
                                        </div>
                                    </Link>
                                </Button>
                            ) : (
                                <div />
                            )}
                            
                            {next ? (
                                <Button
                                    variant="outline"
                                    className="h-auto flex-col items-end gap-1 p-4 whitespace-normal text-right"
                                    asChild
                                >
                                    <Link href={`/blog/${next.slug}`}>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            Next Post
                                            <ArrowRight className="size-3" />
                                        </div>
                                        <div className="font-medium line-clamp-2">
                                            {next.frontmatter.title}
                                        </div>
                                    </Link>
                                </Button>
                            ) : (
                                <div />
                            )}
                        </div>
                    </div>
                </DiagonalPatternFrame>
            </div>
        </div>
    );
}
