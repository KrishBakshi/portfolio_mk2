import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Github, Globe } from "lucide-react";
import type { Metadata } from "next";
import { NotionRenderer } from "@/components/blog/NotionRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";

import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import { BackButton } from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

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

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.frontmatter.title} | Portfolio`,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      type: 'article',
      images: project.frontmatter.image ? [{ url: project.frontmatter.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      images: project.frontmatter.image ? [project.frontmatter.image] : [],
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter, content } = project;

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="relative mx-auto max-w-3xl">
        <DiagonalPatternFrame>
          <div className="mx-auto w-full max-w-3xl sm:px-0">
            <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />

            <div className="mb-6">
              <BackButton href="/projects" label="Back to Projects" />
            </div>

            <article className="bg-background border border-gray-300 p-6 sm:p-8 relative">
              <TableOfContents content={content} title={frontmatter.title} />
              <div className="space-y-8">
                {/* Header */}
                <header className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex-1 font-sans">
                      {frontmatter.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button asChild size="icon" variant="outline">
                        <Link href={frontmatter.link} target="_blank" rel="noopener noreferrer">
                          <Globe className="size-4" />
                          <span className="sr-only">Visit Website</span>
                        </Link>
                      </Button>
                      {frontmatter.github && (
                        <Button asChild size="icon" variant="outline">
                          <Link href={frontmatter.github} target="_blank" rel="noopener noreferrer">
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

                {/* Media */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  {frontmatter.video ? (
                    <video
                      src={frontmatter.video}
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

                {/* Content */}
                <NotionRenderer content={content} />

                {/* Links */}
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <Button asChild>
                    <Link href={frontmatter.link} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 size-4" />
                      Visit Website
                    </Link>
                  </Button>
                  {frontmatter.github && (
                    <Button variant="outline" asChild>
                      <Link href={frontmatter.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 size-4" />
                        View Source
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          </div>
        </DiagonalPatternFrame>
      </div>
    </div>
  );
}
