import { SITE_INFO } from "@/config/site";
import { getPublishedBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { getProjectBySlug, getPublishedProjects } from "@/lib/projects";
import { TECH_STACK, WORK_EXPERIENCE_DATA } from "@/lib/static-data";

export type ProfileBulletPart =
  | { type: "text"; value: string; italic?: boolean; semibold?: boolean }
  | { type: "link"; label: string; href: string };

export type ProfileBullet = ProfileBulletPart[];

function formatProfileBullet(parts: ProfileBullet): string {
  return parts
    .map((part) => {
      if (part.type === "link") {
        const href = part.href.startsWith("/")
          ? `${SITE_INFO.url}${part.href}`
          : part.href;
        return `[${part.label}](${href})`;
      }
      if (part.italic && part.semibold) {
        return `***${part.value}***`;
      }
      if (part.italic) {
        return `*${part.value}*`;
      }
      if (part.semibold) {
        return `**${part.value}**`;
      }
      return part.value;
    })
    .join("");
}

export const PROFILE = {
  name: "Krish Bakshi",
  title: "Data Scientist",
  email: "business.krishb@gmail.com",
  tagline: [
    {
      type: "text",
      value: "Engineer who ships impactful AI systems, end-to-end at ",
    },
    { type: "text", value: "Speed!", italic: true },
  ] satisfies ProfileBullet,
  highlights: ["Vision", "AI agents", "Fine-tuning", "RL"],
  bullets: [
    [
      { type: "text", value: "Data Scientist @" },
      { type: "link", label: "Nasiwak", href: "https://nasiwakservices.com" },
    ],
    [
      { type: "text", value: "Taking novel research: " },
      { type: "text", value: "paper → production", semibold: true },
      { type: "text", value: ", with quantified impact." },
    ],
    [
      { type: "text", value: "I enjoy working with " },
      {
        type: "link",
        label: "agents",
        href: "/projects?domain=AI%20Agents",
      },
      {
        type: "text",
        value: " and training neural networks on GPU clusters.",
      },
    ],
  ] satisfies ProfileBullet[],
  socialLabel: "Here are my socials",
  about:
    "Building and deploying ML across computer vision, AI automation, and generative AI — from Databricks pipelines to production apps on FastAPI, Docker, and cloud.",
  profileImage: "/header/pfp.jpeg",
  bannerImages: {
    light: "/header/light_2.png",
    dark: "/header/dark.png",
  },
  socialLinks: {
    twitter: "https://x.com/KrishBakshi_",
    github: "https://github.com/KrishBakshi",
    linkedin: "https://linkedin.com/in/krish-bakshi-8b85b6314/",
    resume: "/resume.pdf",
    mail: "mailto:business.krishb@gmail.com",
  },
} as const;

const PROFILE_SOCIAL_LINKS = [
  { title: "X", href: PROFILE.socialLinks.twitter },
  { title: "GitHub", href: PROFILE.socialLinks.github },
  { title: "LinkedIn", href: PROFILE.socialLinks.linkedin },
  { title: "Resume", href: `${SITE_INFO.url}${PROFILE.socialLinks.resume}` },
  { title: "Email", href: PROFILE.socialLinks.mail },
] as const;

export function getAboutMarkdown() {
  return `# About

${formatProfileBullet(PROFILE.tagline)}

${PROFILE.bullets.length > 0 ? `${PROFILE.bullets.map((item) => `- ${formatProfileBullet(item)}`).join("\n")}\n` : ""}${PROFILE.highlights.map((item) => `- ${item}`).join("\n")}

${PROFILE.about}

## Personal Information

- Name: ${PROFILE.name}
- Title: ${PROFILE.title}
- Website: ${SITE_INFO.url}
- Email: ${PROFILE.email}

## Social Links

${PROFILE_SOCIAL_LINKS.map((item) => `- [${item.title}](${item.href})`).join("\n")}

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
    const fullPost = getBlogPostBySlug(post.slug);
    const { frontmatter, slug } = post;
    const content = fullPost?.content.trim() ?? "";

    return `## ${frontmatter.title}

Date: ${frontmatter.date}
URL: ${SITE_INFO.url}/blog/${slug}
Tags: ${frontmatter.tags.join(", ")}

${frontmatter.description}

${content}`;
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
