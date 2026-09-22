export const BLOG_DISPLAY_MAX_CHARS = 80;

export interface BlogFrontmatter {
    title: string;
    slug: string;
    description: string;
    /** One-line question shown on list cards (max BLOG_DISPLAY_MAX_CHARS). Falls back to description. */
    display?: string;
    image?: string;
    tags: string[];
    date: string;
    author?: string;
    readTime?: string;
    externalUrl?: string;
    isPublished: boolean;
}

export interface Blog {
    slug: string;
    frontmatter: BlogFrontmatter;
    content: string;
}

export interface BlogPreview {
    slug: string;
    frontmatter: BlogFrontmatter;
}
