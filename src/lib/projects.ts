import { Project, ProjectFrontmatter, ProjectPreview, PROJECT_DISPLAY_MAX_CHARS } from '@/types/project';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { ASSETS_BASE_URL } from '@/lib/assets';

class DisplayTooLongError extends Error {}

const projectsDirectory = path.join(process.cwd(), 'public/data/projects');
const publicDirectory = path.join(process.cwd(), 'public');

function existingAsset(asset?: string): string | undefined {
    if (!asset) return undefined;
    if (/^https?:\/\//.test(asset)) return asset;

    const relativePath = asset.split(/[?#]/)[0].replace(/^\/+/, "");
    return fs.existsSync(path.join(publicDirectory, relativePath)) ? asset : undefined;
}

/**
 * Demo videos live in the R2 bucket under demo-preview/
 * (/assets/demo/preview/x.mp4 becomes <base>/demo-preview/x.mp4).
 */
function resolveVideo(asset?: string): string | undefined {
    if (!asset) return undefined;
    if (/^https?:\/\//.test(asset)) return asset;
    return `${ASSETS_BASE_URL}${asset.replace(/^\/assets\/demo\/preview\//, "/demo-preview/")}`;
}

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
        const parsedFrontmatter = data as ProjectFrontmatter;
        const frontmatter: ProjectFrontmatter = {
            ...parsedFrontmatter,
            image: existingAsset(parsedFrontmatter.image),
            videoPreview: resolveVideo(parsedFrontmatter.videoPreview),
        };
        if (!frontmatter.title || !frontmatter.description) {
            throw new Error(`Invalid frontmatter in ${slug}.mdx`);
        }

        if (frontmatter.display && frontmatter.display.length > PROJECT_DISPLAY_MAX_CHARS) {
            throw new DisplayTooLongError(
                `${slug}.mdx: "display" is ${frontmatter.display.length} chars (max ${PROJECT_DISPLAY_MAX_CHARS})`
            );
        }

        return {
            slug,
            frontmatter,
            content,
        };
    } catch (error) {
        if (error instanceof DisplayTooLongError) throw error;
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
            // Sort by id (highest first)
            const idA = a.frontmatter.id || 0;
            const idB = b.frontmatter.id || 0;
            if (idA !== idB) {
                return idB - idA;
            }
            // Sort by title as fallback
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
