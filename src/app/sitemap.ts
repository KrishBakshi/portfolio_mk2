import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";
import { getPublishedBlogPosts } from "@/lib/blog";
import { getPublishedProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/projects", "/blog", "/llms.txt", "/llms-full.txt", "/about.md", "/experience.md", "/projects.md"].map(
    (route) => ({
      url: `${SITE_INFO.url}${route}`,
      lastModified: new Date(),
    })
  );

  const projectRoutes = getPublishedProjects().map((project) => ({
    url: `${SITE_INFO.url}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = getPublishedBlogPosts().map((post) => ({
    url: `${SITE_INFO.url}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}

