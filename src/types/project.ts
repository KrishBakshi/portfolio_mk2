export interface ProjectFrontmatter {
    title: string;
    slug: string;
    description: string;
    image: string;
    video?: string;
    link: string;
    github?: string;
    technologies: string[];
    isWorking?: boolean;
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
