"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
            className="group relative grid gap-5 border-b border-border py-5 transition-colors last:border-b-0 focus-visible:outline-offset-4"
        >
            <div className="flex min-w-0 flex-col">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={post.date}>{formattedDate}</time>
                    <span aria-hidden>/</span>
                    <span>{post.readTime}</span>
                </div>
                <h3 className="flex items-start justify-between gap-4 text-lg font-medium leading-snug tracking-tight text-foreground">
                    <span className="max-w-[36ch]">{post.title}</span>
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </h3>
                <div className="mt-4">
                    <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Topics">
                        {post.tags.slice(0, 2).map((tag) => (
                            <li key={tag} className="text-xs text-muted-foreground">
                                {tag}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Link>
    );
}
