import { getStaticPageMetadata } from "@/config/metadata";
import ProfileHeader from "@/components/sections/ProfileHeader";
import { PageCanvas } from "@/components/PageCanvas";
import { Projects } from "@/components/projects/Projects";
import { Blog } from "@/components/blog/Blog";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedBlogPosts } from "@/lib/blog";
import { PROFILE } from "@/lib/llms";

export const metadata = getStaticPageMetadata("/");

export default function Home() {
  const projects = getPublishedProjects();
  const posts = getPublishedBlogPosts();

  return (
    <PageCanvas>
      <main className="mx-auto w-full space-y-8 bg-background py-6 sm:py-10">
        <ProfileHeader
          name={PROFILE.name}
          profileImage={PROFILE.profileImage}
          bullets={[...PROFILE.bullets]}
          socialLinks={PROFILE.socialLinks}
        />
        <Projects projects={projects} max={5} showAllHref="/projects" />
        {posts.length > 0 && <Blog posts={posts} max={3} showAllHref="/blog" />}
      </main>
    </PageCanvas>
  );
}
