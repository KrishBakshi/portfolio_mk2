import Link from "next/link";
import type { BlogFrontmatter } from "@/types/blog";

export function BlogCard({ post }: { post: BlogFrontmatter }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block py-3">
            <h3 className="text-[15px] font-medium leading-snug text-foreground group-hover:underline underline-offset-4">
                {post.title}
            </h3>
            <p className="mt-1 truncate text-sm text-muted-foreground">
                {post.display ?? post.description}
            </p>
        </Link>
    );
}
