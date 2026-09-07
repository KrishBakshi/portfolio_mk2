import { getStaticPageMetadata } from "@/config/metadata";
import ProfileHeader from "@/components/sections/ProfileHeader";
import { PageCanvas } from "@/components/PageCanvas";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { WORK_EXPERIENCE_DATA } from "@/lib/static-data";
import { Projects } from "@/components/projects/Projects";
import { Blog } from "@/components/blog/Blog";
import { Skills } from "@/components/sections/Skills";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedBlogPosts } from "@/lib/blog";
import { PROFILE } from "@/lib/llms";

export const metadata = getStaticPageMetadata("/");

export default function Home() {
  const projects = getPublishedProjects();
  const posts = getPublishedBlogPosts();

  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background">
        <section className="py-7 sm:py-9">
          <ProfileHeader
            name={PROFILE.name}
            title={PROFILE.title}
            profileImage={PROFILE.profileImage}
            bullets={[...PROFILE.bullets]}
            socialLinks={PROFILE.socialLinks}
          />
        </section>

        <div className="py-7 sm:py-9">
          <WorkExperience
            experiences={WORK_EXPERIENCE_DATA}
            title="Experience"
            showAllHref="/work"
            expandCurrentPosition
          />
        </div>
        <div className="py-7 sm:py-9">
          <Projects projects={projects} max={4} showAllHref="/projects" />
        </div>
        <div className="py-7 sm:py-9">
          <Blog posts={posts} max={3} showAllHref="/blog" />
        </div>
        <div className="py-7 sm:py-9">
          <Skills />
        </div>
      </main>
    </PageCanvas>
  );
}
