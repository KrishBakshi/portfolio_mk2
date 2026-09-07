import { BlogCard } from "./BlogCard";
import { BlogFrontmatter } from "@/types/blog";
import { CollapsibleList } from "@/components/ui/collapsible-list";
import { ShowAllLink } from "@/components/ui/show-all-link";

interface BlogProps {
    posts: { slug: string; frontmatter: BlogFrontmatter }[];
    max?: number;
    showToggle?: boolean;
    showAllHref?: string;
}

export function Blog({ posts, max = 2, showToggle = true, showAllHref }: BlogProps) {
    const visiblePosts = showAllHref ? posts.slice(0, max) : posts;
    const Heading = showAllHref ? "h2" : "h1";

    return (
        <section className="px-5 sm:px-8">
            <div className="mb-6">
                <Heading className={showAllHref ? "text-2xl font-semibold tracking-tight sm:text-3xl" : "text-3xl font-semibold tracking-tight sm:text-4xl"}>
                    Writing
                </Heading>
            </div>

            <div>
                {showAllHref ? (
                    visiblePosts.map((post) => (
                        <BlogCard key={post.slug} post={post.frontmatter} />
                    ))
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

            {showAllHref ? (
                <div className="mt-5 flex items-center justify-start">
                    <ShowAllLink href={showAllHref} label="Browse all writing" />
                </div>
            ) : null}
        </section>
    );
}
