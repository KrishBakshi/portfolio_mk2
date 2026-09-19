import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/config/metadata";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { pageTitle } from "@/lib/utils";

import { PageDetailShell } from "@/components/PageDetailShell";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  getPublishedProjects,
  getProjectBySlug,
  getRawProjectMdxContent,
} from "@/lib/projects";
import { PostShareMenu } from "@/components/blog/PostShareMenu";
import { ViewCount } from "@/components/blog/ViewCount";
import { LLMCopyButtonWithViewOptions } from "@/components/blog/PostActions";
import { getProjectPrimaryLink } from "@/lib/project-links";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = getPublishedProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.frontmatter.isWorking === false) {
    return {
      title: "Project Not Found",
    };
  }

  return buildPageMetadata({
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    path: `/projects/${slug}`,
    type: "article",
    image: project.frontmatter.image,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.frontmatter.isWorking === false) {
    notFound();
  }

  const { frontmatter, content } = project;
  const rawMdxContent = getRawProjectMdxContent(slug);
  const primaryLink = getProjectPrimaryLink(frontmatter.link, frontmatter.github);

  return (
    <PageDetailShell>
      <ReadingProgress />
      <div className="flex items-center justify-between py-3">
        <BackButton href="/projects" label="Back to Projects" />

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`/data/projects/${slug}.mdx`}
            mdxContent={rawMdxContent || undefined}
          />
          <PostShareMenu url={`/projects/${slug}`} />
        </div>
      </div>

      <TableOfContents content={content} title={frontmatter.title} />

      <article data-reading-scope className="relative py-4 sm:py-6">
        <div className="mx-auto max-w-[720px] space-y-6">
          <header>
            <h1 className={pageTitle}>
              {frontmatter.title}
            </h1>
            <div className="mt-3 flex items-start justify-between gap-4 text-xs text-muted-foreground">
              <ul aria-label="Technologies" className="flex min-w-0 flex-wrap gap-y-1 font-mono">
                {frontmatter.technologies.map((tech) => (
                  <li key={tech} className="after:mx-2 after:content-['·'] last:after:content-none">
                    {tech}
                  </li>
                ))}
              </ul>
              <ViewCount kind="project" slug={slug} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {primaryLink ? (
                <Button asChild variant="outline" className="min-h-10">
                  <Link href={primaryLink.href} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 size-4" />
                    {primaryLink.label}
                  </Link>
                </Button>
              ) : null}
              {frontmatter.github ? (
                <Button asChild variant="outline" className="min-h-10">
                  <Link href={frontmatter.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 size-4" />
                    Source
                  </Link>
                </Button>
              ) : null}
            </div>
          </header>

          {frontmatter.videoFull || frontmatter.image ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
            {frontmatter.videoFull ? (
              <video
                src={frontmatter.videoFull}
                controls
                autoPlay
                muted
                playsInline
                aria-label={`${frontmatter.title} project demo`}
                className="h-full w-full object-cover"
              />
            ) : frontmatter.image ? (
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            ) : null}
          </div>
          ) : null}

          <NotionRenderer content={content} />
        </div>
      </article>
    </PageDetailShell>
  );
}
