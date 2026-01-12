export interface ProjectFrontmatter {
    title: string;
    slug: string;
    description: string;
    image: string;
    videoPreview?: string;
    videoFull?: string;
    link: string;
    github?: string;
    technologies: string[];
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
