import Link from "next/link";
import { BlogCard } from "./BlogCard";
import { BlogFrontmatter } from "@/types/blog";
import { CollapsibleList } from "@/components/ui/collapsible-list";

interface BlogProps {
    posts: { slug: string; frontmatter: BlogFrontmatter }[];
    max?: number;
    showToggle?: boolean;
    showAllHref?: string;
}

export function Blog({ posts, max = 2, showToggle = true, showAllHref }: BlogProps) {
    const visiblePosts = showAllHref ? posts.slice(0, max) : posts;

    return (
        <div className="space-y-6 px-4 sm:py-4">
            <div className="flex flex-col gap-2 mb-2">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans">Blog</h2>
                <p className="text-foreground font-mono text-sm">
                    Thoughts on technology.
                </p>
            </div>

            <div className="bg-background">
                {showAllHref ? (
                    <div className="flex flex-col">
                        {visiblePosts.map((post) => (
                            <BlogCard key={post.slug} post={post.frontmatter} />
                        ))}
                    </div>
                ) : (
                    <CollapsibleList
                        items={posts}
                        max={max}
                        keyExtractor={(post) => post.slug}
                        renderItem={(post) => (
                            <BlogCard post={post.frontmatter} />
                        )}
                        showToggle={showToggle}
                    />
                )}
            </div>

            {showAllHref && (
                <div className="flex h-12 items-center justify-center pt-2">
                    <Link
                        href={showAllHref}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono tracking-wide text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Show All Blogs
                    </Link>
                </div>
            )}
        </div>
    );
}
