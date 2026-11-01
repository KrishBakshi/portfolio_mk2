import { getStaticPageMetadata } from "@/config/metadata";
import ProfileHeader from "@/components/sections/ProfileHeader";
import { PageCanvas } from "@/components/PageCanvas";
import { Projects } from "@/components/projects/Projects";
import { Blog } from "@/components/blog/Blog";
import { GithubActivity } from "@/components/sections/GithubActivity";
import { Research } from "@/components/research/Research";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedBlogPosts } from "@/lib/blog";
import { getResearchPapers } from "@/lib/research";
import { PROFILE } from "@/lib/llms";

export const metadata = getStaticPageMetadata("/");

export default function Home() {
  const projects = getPublishedProjects();
  const posts = getPublishedBlogPosts();
  const papers = getResearchPapers();

  return (
    <PageCanvas>
      <main className="mx-auto w-full space-y-8 bg-background py-6 sm:py-10">
        {/* Below 1080px: room above the intro so it doesn't hug the top bar. From 1080px
            the intro lines up with "home" in the side list, like every other page. */}
        <div className="pt-[14svh] min-[1080px]:pt-0">
          <ProfileHeader
            name={PROFILE.name}
            profileImage={PROFILE.profileImage}
            bullets={[...PROFILE.bullets]}
            socialLinks={PROFILE.socialLinks}
          />
        </div>
        <GithubActivity profileUrl={PROFILE.socialLinks.github} />
        {papers.length > 0 && <Research papers={papers} max={3} showAllHref="/research" />}
        <Projects projects={projects} max={4} showAllHref="/projects" />
        {posts.length > 0 && <Blog posts={posts} max={3} showAllHref="/blog" />}
      </main>
    </PageCanvas>
  );
}
