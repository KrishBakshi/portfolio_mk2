import { EntryRow } from "@/components/ui/entry-row";
import type { BlogFrontmatter } from "@/types/blog";

export function BlogCard({ post }: { post: BlogFrontmatter }) {
    return <EntryRow href={`/blog/${post.slug}`} title={post.title} meta={post.tags.slice(0, 2).join(" · ")} />;
}
