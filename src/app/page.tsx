import BannerSection from "@/components/sections/BannerSection";
import ProfileHeader from "@/components/sections/ProfileHeader";
import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import About from "@/components/sections/About";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { WORK_EXPERIENCE_DATA } from "@/data/workExperienceData";
import { Projects } from "@/components/projects/Projects";
import { Blog } from "@/components/blog/Blog";
import { Skills } from "@/components/sections/Skills";
import { getAllProjects } from "@/lib/projects";
import { getAllBlogPosts } from "@/lib/blog";


export default function Home() {
  const projects = getAllProjects();
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="relative mx-auto max-w-3xl">


        {/* Main Content */}
        <DiagonalPatternFrame>
          <div className="mx-auto w-full max-w-3xl sm:px-0">
            <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />

            {/* Banner and Profile Header - Combined */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 border-t-0 mb-6">
              <div className="pt-0">
                <BannerSection bannerImage="/header/banner.png" quote="" />
              </div>
              <div className="">
                {/* p-4 is removed */}
                <ProfileHeader
                  name="Krish Bakshi"
                  title="Data Scientist"
                  profileImage="/header/pfp.jpeg"
                  socialLinks={{
                    twitter: "https://x.com/KrishBakshi_",
                    github: "https://github.com/KrishBakshi",
                    linkedin: "https://linkedin.com/in/krish-bakshi-8b85b6314/",
                    resume: "/resume.pdf",
                  }}
                />
              </div>
            </div>

            {/* Main Content Sections */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 py-4 md:py-0 md:px-2 mb-6">
              <About content="Hi there! 👋 I'm Krish. I enjoy building smart, AI-driven solutions that solves problems of day-to-day life or bussiness needs . Whether it's forecasting sales, automating tasks, or generating content with AI, I turn ideas into working products using data, code, and creativity." />
            </div>

            {/* Skills Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mb-6">
              <Skills />
            </div>

            {/* Work Experience Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mb-6">
              <WorkExperience experiences={WORK_EXPERIENCE_DATA} />
            </div>

            {/* Projects Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4 mb-6">
              <Projects projects={projects} max={2} />
            </div>

            {/* Blog Section */}
            <div className="bg-background border border-gray-300/50 dark:border-white/10 md:py-0 md:px-2 py-4">
              <Blog posts={posts} max={2} />
            </div>
          </div>
        </DiagonalPatternFrame>
      </div>
    </div>
  );
}
