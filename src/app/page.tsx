import BannerSection from "@/components/BannerSection";
import ProfileHeader from "@/components/ProfileHeader";
import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";
import About from "@/components/About";


export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="relative mx-auto max-w-3xl">


        {/* Main Content */}
        <DiagonalPatternFrame>
          <div className="mx-auto w-full max-w-3xl sm:px-0">
            <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />

            {/* Banner and Profile Header - Combined */}
            <div className="bg-background border border-gray-300 mb-6">
              <div className="pt-0">
                <BannerSection bannerImage="/header/banner.png" quote="" />
              </div>
              <div className="">
                {/* p-4 is removed */}
                <ProfileHeader
                  name="Krish Bakshi"
                  title="engineer • developer • builder"
                  profileImage="/header/pfp.jpeg"
                  socialLinks={{
                    twitter: "https://x.com/yourhandle",
                    github: "https://github.com/yourusername",
                    linkedin: "https://www.linkedin.com/in/yourprofile/",
                    resume: "",
                  }}
                />
              </div>
            </div>

            {/* Main Content Sections */}
            <div className="bg-background border border-gray-300 p-4">
              <About content="I'm a passionate software engineer and builder who loves creating elegant solutions to complex problems. With a focus on modern web technologies and user experience, I strive to build products that make a difference." />
              {/* Add additional sections here */}
            </div>
          </div>
        </DiagonalPatternFrame>
      </div>
    </div>
  );
}
