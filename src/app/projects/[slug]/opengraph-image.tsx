import { createOgImage, OG_IMAGE_SIZE } from "@/lib/og-image";
import { getProjectBySlug } from "@/lib/projects";

export const alt = "Project — Krish Bakshi";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

interface ProjectOgImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Image({ params }: ProjectOgImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return createOgImage({
      title: "Project Not Found",
      description: "This project could not be found on the portfolio.",
      label: "Project",
    });
  }

  return createOgImage({
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    label: "Project",
    tags: project.frontmatter.domains,
  });
}
