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
            className="flex flex-col justify-between p-4 transition-colors hover:bg-accent sm:flex-row sm:items-center group"
        >
            <h3 className="text-base font-medium group-hover:text-primary transition-colors font-sans">
                {post.title}
            </h3>
            <time className="text-xs text-muted-foreground shrink-0 sm:ml-4 font-mono">
                {formattedDate}
            </time>
        </Link>
    );
}
