import { BlogCard } from "./BlogCard";
import { Section } from "@/components/ui/section";
import type { BlogFrontmatter } from "@/types/blog";

export function Blog({ posts, max, showAllHref }: {
    posts: { slug: string; frontmatter: BlogFrontmatter }[];
    max?: number;
    showAllHref?: string;
}) {
    return (
        <Section title="Writing" href={showAllHref}>
            {(max ? posts.slice(0, max) : posts).map((p) => (
                <BlogCard key={p.slug} post={p.frontmatter} />
            ))}
        </Section>
    );
}
