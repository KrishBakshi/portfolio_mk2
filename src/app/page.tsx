import { getStaticPageMetadata } from "@/config/metadata";
import BannerSection from "@/components/sections/BannerSection";
import ProfileHeader from "@/components/sections/ProfileHeader";
import { PageCanvas } from "@/components/PageCanvas";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { WORK_EXPERIENCE_DATA } from "@/lib/static-data";
import { Projects } from "@/components/projects/Projects";
import { Blog } from "@/components/blog/Blog";
import { Skills } from "@/components/sections/Skills";
import { getAllProjects } from "@/lib/projects";
import { getAllBlogPosts } from "@/lib/blog";
import { PROFILE } from "@/lib/llms";
import LetsConnect from "@/components/LetsConnect";
import Footer from "@/components/Footer";

export const metadata = getStaticPageMetadata("/");

export default function Home() {
  const projects = getAllProjects();
  const posts = getAllBlogPosts();

  return (
    <PageCanvas>
      <div className="mx-auto w-full max-w-3xl sm:px-0">
            {/* Banner and Profile Header - Combined */}
            <div
              id="js-cover-mark"
              className="mb-6 border border-gray-300/50 border-t-0 bg-background dark:border-white/10"
            >
              <BannerSection
                lightBanner={PROFILE.bannerImages.light}
                darkBanner={PROFILE.bannerImages.dark}
                quote=""
              />
              <ProfileHeader
                name={PROFILE.name}
                title={PROFILE.title}
                profileImage={PROFILE.profileImage}
                tagline={PROFILE.tagline}
                bullets={[...PROFILE.bullets]}
                highlights={[...PROFILE.highlights]}
                socialLabel={PROFILE.socialLabel}
                socialLinks={PROFILE.socialLinks}
              />
            </div>

            {/* Work Experience Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mb-6">
              <WorkExperience experiences={WORK_EXPERIENCE_DATA} title="Experience" showAllHref="/work" />
            </div>

            {/* Projects Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mb-6">
              <Projects projects={projects} max={4} showAllHref="/projects" />
            </div>

            {/* Skills Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mb-6">
              <Skills />
            </div>

            {/* Blog Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mb-6">
              <Blog posts={posts} max={2} showAllHref="/blog" />
            </div>

            {/* Let's Connect Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mt-6">
              <LetsConnect />
            </div>

            {/* Footer Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mt-6">
              <Footer />
            </div>
          </div>
    </PageCanvas>
  );
}
