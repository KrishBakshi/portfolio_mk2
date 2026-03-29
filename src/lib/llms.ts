import { SITE_INFO } from "@/config/site";
import { getPublishedBlogPosts } from "@/lib/blog";
import { getProjectBySlug, getPublishedProjects } from "@/lib/projects";
import { TECH_STACK, WORK_EXPERIENCE_DATA } from "@/lib/static-data";

export const PROFILE = {
  name: "Krish Bakshi",
  title: "Data Scientist",
  email: "business.krishb@gmail.com",
  about:
    "Hi there! I'm Krish. I enjoy building smart, AI-driven solutions that solve day-to-day and business problems. Whether it's forecasting sales, automating tasks, or generating content with AI, I turn ideas into working products using data, code, and creativity.",
  socialLinks: [
    { title: "X", href: "https://x.com/KrishBakshi_" },
    { title: "GitHub", href: "https://github.com/KrishBakshi" },
    { title: "LinkedIn", href: "https://linkedin.com/in/krish-bakshi-8b85b6314/" },
    { title: "Resume", href: `${SITE_INFO.url}/resume.pdf` },
    { title: "Email", href: "mailto:business.krishb@gmail.com" },
  ],
} as const;

export function getAboutMarkdown() {
  return `# About

${PROFILE.about}

## Personal Information

- Name: ${PROFILE.name}
- Title: ${PROFILE.title}
- Website: ${SITE_INFO.url}
- Email: ${PROFILE.email}

## Social Links

${PROFILE.socialLinks.map((item) => `- [${item.title}](${item.href})`).join("\n")}

## Tech Stack

${TECH_STACK.map((item) => `- [${item.title}](${item.href})`).join("\n")}
`;
}

export function getExperienceMarkdown() {
  return `# Experience

${WORK_EXPERIENCE_DATA.map((item) =>
  item.positions
    .map((position) => {
      const skills = position.skills?.join(", ") || "N/A";
      const employmentType = position.employmentType ? `\nType: ${position.employmentType}` : "";
      const description = position.description ? `\n\n${position.description.trim()}` : "";

      return `## ${position.title} | ${item.companyName}

Duration: ${position.employmentPeriod}${employmentType}

Skills: ${skills}${description}`;
    })
    .join("\n\n")
).join("\n\n")}
`;
}

export function getProjectsMarkdown() {
  const projects = getPublishedProjects()
    .map((project) => getProjectBySlug(project.slug))
    .filter((project) => project !== null);

  return `# Projects

${projects
  .map((project) => {
    const { frontmatter, content } = project;
    const links = [
      `Project URL: ${frontmatter.link}`,
      frontmatter.github ? `GitHub: ${frontmatter.github}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return `## ${frontmatter.title}

${frontmatter.description}

${links}

Technologies: ${frontmatter.technologies.join(", ")}

${content.trim()}`;
  })
  .join("\n\n")}
`;
}

export function getBlogMarkdown() {
  const posts = getPublishedBlogPosts();

  return `# Blog

${posts
  .map((post) => {
    const { frontmatter, slug } = post;
    return `## ${frontmatter.title}

Date: ${frontmatter.date}
URL: ${SITE_INFO.url}/blog/${slug}
Tags: ${frontmatter.tags.join(", ")}

${frontmatter.description}`;
  })
  .join("\n\n")}
`;
}

export function getLlmsIndexMarkdown() {
  const posts = getPublishedBlogPosts();

  return `# ${SITE_INFO.name}

> ${SITE_INFO.description}

- [About](${SITE_INFO.url}/about.md): Intro, contact links, and core technical stack.
- [Experience](${SITE_INFO.url}/experience.md): Work history, roles, and skills used.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects with links and implementation details.
- [LLMs Full](${SITE_INFO.url}/llms-full.txt): Full portfolio context in a single LLM-oriented document.

## Blog

${posts
  .map(
    (post) =>
      `- [${post.frontmatter.title}](${SITE_INFO.url}/blog/${post.slug}): ${post.frontmatter.description}`
  )
  .join("\n")}
`;
}

export function getLlmsFullMarkdown() {
  return `<SYSTEM>This document contains a consolidated profile for ${PROFILE.name}. It is formatted for LLM consumption and includes personal information, social links, technical skills, work experience, projects, and published blog summaries.</SYSTEM>

# ${SITE_INFO.name}

> ${SITE_INFO.description}

${getAboutMarkdown()}

${getExperienceMarkdown()}

${getProjectsMarkdown()}

${getBlogMarkdown()}
`;
}
