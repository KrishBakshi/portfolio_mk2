export interface BlogFrontmatter {
    title: string;
    slug: string;
    description: string;
    image: string;
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
