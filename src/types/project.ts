export const PROJECT_DISPLAY_MAX_CHARS = 80;

export interface ProjectFrontmatter {
    title: string;
    slug: string;
    description: string;
    /** One-line overview for list rows (max PROJECT_DISPLAY_MAX_CHARS). Falls back to description. */
    display?: string;
    image?: string;
    videoPreview?: string;
    videoFull?: string;
    link: string;
    github?: string;
    technologies: string[];
    domains?: string[];
    isWorking?: boolean;
    id?: number;
}

export interface Project {
    slug: string;
    frontmatter: ProjectFrontmatter;
    content: string;
}

export interface ProjectPreview {
    slug: string;
    frontmatter: ProjectFrontmatter;
}
