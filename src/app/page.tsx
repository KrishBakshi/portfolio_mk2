import { getStaticPageMetadata } from "@/config/metadata";
import ProfileHeader from "@/components/sections/ProfileHeader";
import { PageCanvas } from "@/components/PageCanvas";
import { EntryRow } from "@/components/ui/entry-row";
import { Section } from "@/components/ui/section";
import { Projects } from "@/components/projects/Projects";
import { Blog } from "@/components/blog/Blog";
import { WORK_EXPERIENCE_DATA } from "@/lib/static-data";
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
        <Section title="Experience" href="/work">
          {WORK_EXPERIENCE_DATA.map((e) => (
            <EntryRow
              key={e.id}
              title={`${e.companyName} — ${e.positions[0].title}`}
              meta={e.positions[0].employmentPeriod}
            />
          ))}
        </Section>
      </main>
    </PageCanvas>
  );
}
