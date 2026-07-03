import { getPublishedBlogPosts } from "@/lib/blog";
import { PROFILE } from "@/lib/llms";
import { getPublishedProjects } from "@/lib/projects";
import { WORK_EXPERIENCE_DATA } from "@/lib/static-data";
import type { CommandSearchItem } from "@/lib/search-index.types";

export type {
  CommandSearchGroup,
  CommandSearchItem,
} from "@/lib/search-index.types";
export {
  COMMAND_SEARCH_GROUP_ORDER,
  getCommandSearchGroupLabel,
} from "@/lib/search-index.types";

export function getCommandSearchItems(): CommandSearchItem[] {
  const items: CommandSearchItem[] = [
    {
      id: "nav-home",
      title: "Home",
      subtitle: "Profile and overview",
      href: "/",
      group: "navigation",
      keywords: ["portfolio", "profile", "krish", "about"],
    },
    {
      id: "nav-work",
      title: "Work",
      subtitle: "Experience and roles",
      href: "/work",
      group: "navigation",
      keywords: ["experience", "jobs", "career", "employment"],
    },
    {
      id: "nav-projects",
      title: "Projects",
      subtitle: "AI, ML, and software builds",
      href: "/projects",
      group: "navigation",
      keywords: ["portfolio", "builds", "agents", "machine learning"],
    },
    {
      id: "nav-blog",
      title: "Blog",
      subtitle: "Posts and notes",
      href: "/blog",
      group: "navigation",
      keywords: ["writing", "articles", "posts"],
    },
  ];

  const publishedProjects = getPublishedProjects();
  const seenDomainFilters = new Set<string>();

  for (const project of publishedProjects) {
    for (const domain of project.frontmatter.domains ?? []) {
      const href = `/projects?domain=${encodeURIComponent(domain)}`;
      if (seenDomainFilters.has(href)) continue;
      seenDomainFilters.add(href);

      const domainProjects = publishedProjects.filter((p) =>
        p.frontmatter.domains?.includes(domain)
      );

      items.push({
        id: `project-domain-${domain}`,
        title: `${domain} projects`,
        subtitle: `${domainProjects.length} project${domainProjects.length === 1 ? "" : "s"}`,
        href,
        group: "projects",
        keywords: [
          domain,
          "filter",
          "domain",
          "projects",
          ...domainProjects.flatMap((p) => [
            p.frontmatter.title,
            p.slug,
            ...p.frontmatter.technologies,
          ]),
        ],
      });
    }
  }

  for (const post of getPublishedBlogPosts()) {
    const { title, description, tags, date } = post.frontmatter;

    items.push({
      id: `blog-${post.slug}`,
      title,
      subtitle: description,
      href: `/blog/${post.slug}`,
      group: "blog",
      keywords: [post.slug, ...tags, date, "blog", "post", "article"],
    });
  }

  for (const company of WORK_EXPERIENCE_DATA) {
    for (const position of company.positions) {
      items.push({
        id: `experience-${position.id}`,
        title: `${position.title} @ ${company.companyName}`,
        subtitle: position.employmentPeriod,
        href: "/work",
        group: "experience",
        keywords: [
          company.companyName,
          company.id,
          position.title,
          ...(position.employmentType ? [position.employmentType] : []),
          ...(position.skills ?? []),
          "work",
          "job",
          "role",
        ],
      });
    }
  }

  items.push(
    {
      id: "social-github",
      title: "GitHub",
      subtitle: PROFILE.name,
      href: PROFILE.socialLinks.github,
      group: "social",
      external: true,
      keywords: ["code", "repositories", "open source"],
    },
    {
      id: "social-linkedin",
      title: "LinkedIn",
      subtitle: PROFILE.name,
      href: PROFILE.socialLinks.linkedin,
      group: "social",
      external: true,
      keywords: ["professional", "network", "profile"],
    },
    {
      id: "social-x",
      title: "X",
      subtitle: "@KrishBakshi_",
      href: PROFILE.socialLinks.twitter,
      group: "social",
      external: true,
      keywords: ["twitter", "social"],
    },
    {
      id: "social-email",
      title: "Email",
      subtitle: PROFILE.email,
      href: PROFILE.socialLinks.mail,
      group: "social",
      external: true,
      keywords: ["contact", "mail", "reach"],
    },
    {
      id: "social-resume",
      title: "Resume",
      subtitle: "Download PDF",
      href: PROFILE.socialLinks.resume,
      group: "social",
      keywords: ["cv", "pdf", "download"],
    },
    {
      id: "social-llms",
      title: "LLM portfolio index",
      subtitle: "llms.txt for AI assistants",
      href: "/llms.txt",
      group: "social",
      keywords: ["llm", "ai", "context", "markdown", "llms-full"],
    }
  );

  return items;
}
