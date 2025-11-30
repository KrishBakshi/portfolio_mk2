"use client";

import Link from "next/link";
import type { BlogFrontmatter } from "@/types/blog";

interface BlogCardProps {
    post: BlogFrontmatter;
}

export function BlogCard({ post }: BlogCardProps) {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 -mx-4 hover:bg-accent transition-colors group"
        >
            <h3 className="text-lg font-medium group-hover:text-primary transition-colors font-sans">
                {post.title}
            </h3>
            <time className="text-sm text-muted-foreground shrink-0 sm:ml-4 font-mono">
                {formattedDate}
            </time>
        </Link>
    );
}
