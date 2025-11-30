import { Blog, BlogFrontmatter, BlogPreview } from '@/types/blog';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const blogDirectory = path.join(process.cwd(), 'src/data/blog');

/**
 * Get all blog post files from the blog directory
 */
export function getBlogPostSlugs(): string[] {
    if (!fs.existsSync(blogDirectory)) {
        return [];
    }

    const files = fs.readdirSync(blogDirectory);
    return files.filter((file) => {
        // Filter for directories that contain an MDX file with the same name
        const fullPath = path.join(blogDirectory, file);
        return fs.statSync(fullPath).isDirectory() && 
               fs.existsSync(path.join(fullPath, `${file}.mdx`));
    });
}

/**
 * Get blog post by slug with full content
 */
export function getBlogPostBySlug(slug: string): Blog | null {
    try {
        // Look for src/data/blog/slug/slug.mdx
        const fullPath = path.join(blogDirectory, slug, `${slug}.mdx`);

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Validate frontmatter
        const frontmatter = data as BlogFrontmatter;
        if (!frontmatter.title || !frontmatter.description) {
            throw new Error(`Invalid frontmatter in ${slug}.mdx`);
        }

        return {
            slug,
            frontmatter,
            content,
        };
    } catch (error) {
        console.error(`Error reading blog post ${slug}:`, error);
        return null;
    }
}

/**
 * Get all blog posts with frontmatter only (for listing page)
 */
export function getAllBlogPosts(): BlogPreview[] {
    const slugs = getBlogPostSlugs();

    const posts = slugs
        .map((slug) => {
            const post = getBlogPostBySlug(slug);
            if (!post) return null;

            return {
                slug: post.slug,
                frontmatter: post.frontmatter,
            };
        })
        .filter((post): post is BlogPreview => post !== null)
        .sort((a, b) => {
            // Sort by date, newest first
            return (
                new Date(b.frontmatter.date).getTime() -
                new Date(a.frontmatter.date).getTime()
            );
        });

    return posts;
}

/**
 * Get all published blog posts
 */
export function getPublishedBlogPosts(): BlogPreview[] {
    const allPosts = getAllBlogPosts();
    return allPosts.filter((post) => post.frontmatter.isPublished);
}

/**
 * Get raw MDX file content (with frontmatter)
 */
export function getRawMdxContent(slug: string): string | null {
    try {
        const fullPath = path.join(blogDirectory, slug, `${slug}.mdx`);
        
        if (!fs.existsSync(fullPath)) {
            return null;
        }

        return fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
        console.error(`Error reading raw MDX content for ${slug}:`, error);
        return null;
    }
}

/**
 * Find neighboring posts (previous and next)
 */
export function getNeighboringPosts(slug: string): { previous: BlogPreview | null; next: BlogPreview | null } {
    const posts = getPublishedBlogPosts();
    const currentIndex = posts.findIndex((post) => post.slug === slug);

    if (currentIndex === -1) {
        return { previous: null, next: null };
    }

    // The posts are sorted by date descending (newest first)
    // So 'next' in list is actually 'previous' chronologically (older)
    // and 'previous' in list is 'next' chronologically (newer)
    const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const previousPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    return {
        previous: previousPost,
        next: nextPost,
    };
}
