import { BlogCard } from "./BlogCard";
import { BlogFrontmatter } from "@/types/blog";
import { CollapsibleList } from "@/components/ui/collapsible-list";

interface BlogProps {
    posts: { slug: string; frontmatter: BlogFrontmatter }[];
    max?: number;
    showToggle?: boolean;
}

export function Blog({ posts, max = 2, showToggle = true }: BlogProps) {
    return (
        <div className="space-y-6 px-4 sm:py-4">
            <div className="flex flex-col gap-2 mb-2">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans">Blog</h2>
                <p className="text-muted-foreground font-mono text-sm">
                    Thoughts on software development and technology.
                </p>
            </div>

            <div className="bg-background">
                <CollapsibleList
                    items={posts}
                    max={max}
                    keyExtractor={(post) => post.slug}
                    renderItem={(post) => (
                        <BlogCard post={post.frontmatter} />
                    )}
                    showToggle={showToggle}
                />
            </div>
        </div>
    );
}
