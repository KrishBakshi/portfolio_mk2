import { Project, ProjectFrontmatter, ProjectPreview } from '@/types/project';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const projectsDirectory = path.join(process.cwd(), 'src/data/projects');

/**
 * Get all project files from the projects directory
 */
export function getProjectSlugs(): string[] {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }

    const files = fs.readdirSync(projectsDirectory);
    return files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get project by slug with full content
 */
export function getProjectBySlug(slug: string): Project | null {
    try {
        const fullPath = path.join(projectsDirectory, `${slug}.mdx`);

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Validate frontmatter
        const frontmatter = data as ProjectFrontmatter;
        if (!frontmatter.title || !frontmatter.description) {
            throw new Error(`Invalid frontmatter in ${slug}.mdx`);
        }

        return {
            slug,
            frontmatter,
            content,
        };
    } catch (error) {
        console.error(`Error reading project ${slug}:`, error);
        return null;
    }
}

/**
 * Get all projects with frontmatter only (for listing)
 */
export function getAllProjects(): ProjectPreview[] {
    const slugs = getProjectSlugs();

    const projects = slugs
        .map((slug) => {
            const project = getProjectBySlug(slug);
            if (!project) return null;

            return {
                slug: project.slug,
                frontmatter: project.frontmatter,
            };
        })
        .filter((project): project is ProjectPreview => project !== null)
        .sort((a, b) => {
            // Sort by title
            return a.frontmatter.title.localeCompare(b.frontmatter.title);
        });

    return projects;
}

/**
 * Get all working/published projects
 */
export function getPublishedProjects(): ProjectPreview[] {
    const allProjects = getAllProjects();
    return allProjects.filter((project) => project.frontmatter.isWorking !== false);
}

/**
 * Get raw MDX file content (with frontmatter)
 */
export function getRawProjectMdxContent(slug: string): string | null {
    try {
        const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
        
        if (!fs.existsSync(fullPath)) {
            return null;
        }

        return fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
        console.error(`Error reading raw MDX content for ${slug}:`, error);
        return null;
    }
}
