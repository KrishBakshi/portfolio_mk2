import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Github, Globe } from "lucide-react";
import type { Metadata } from "next";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";

import { PageDetailShell } from "@/components/PageDetailShell";
import { BackButton } from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllProjects,
  getProjectBySlug,
  getRawProjectMdxContent,
} from "@/lib/projects";
import { PostShareMenu } from "@/components/blog/PostShareMenu";
import { LLMCopyButtonWithViewOptions } from "@/components/blog/PostActions";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.frontmatter.title} | Portfolio`,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      type: "article",
      images: project.frontmatter.image
        ? [{ url: project.frontmatter.image }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      images: project.frontmatter.image ? [project.frontmatter.image] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter, content } = project;
  const rawMdxContent = getRawProjectMdxContent(slug);

  return (
    <PageDetailShell>
      <div className="mt-6 mb-6 flex items-center justify-between">
        <BackButton href="/projects" label="Back to Projects" />

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`/projects/${slug}.mdx`}
            mdxContent={rawMdxContent || undefined}
          />
          <PostShareMenu url={`/projects/${slug}`} />
        </div>
      </div>

      <TableOfContents content={content} title={frontmatter.title} />

      <article className="relative border border-gray-300/50 bg-background p-6 sm:p-8 dark:border-white/10">
        <div className="space-y-8">
          <header className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="flex-1 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
                {frontmatter.title}
              </h1>
              <div className="flex shrink-0 items-center gap-2">
                <Button asChild size="icon" variant="outline">
                  <Link
                    href={frontmatter.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="size-4" />
                    <span className="sr-only">Visit Website</span>
                  </Link>
                </Button>
                {frontmatter.github && (
                  <Button asChild size="icon" variant="outline">
                    <Link
                      href={frontmatter.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="size-4" />
                      <span className="sr-only">View Source</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {frontmatter.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="font-mono">
                  {tech}
                </Badge>
              ))}
            </div>
          </header>

          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-300/50 bg-muted dark:border-white/10">
            {frontmatter.videoFull ? (
              <video
                src={frontmatter.videoFull}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          <NotionRenderer content={content} />

          <div className="flex flex-wrap gap-4 border-t pt-4">
            <Button asChild>
              <Link
                href={frontmatter.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="mr-2 size-4" />
                Visit Website
              </Link>
            </Button>
            {frontmatter.github && (
              <Button variant="outline" asChild>
                <Link
                  href={frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 size-4" />
                  View Source
                </Link>
              </Button>
            )}
          </div>
        </div>
      </article>
    </PageDetailShell>
  );
}
