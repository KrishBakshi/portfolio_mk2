import { WorkExperience } from "@/components/sections/WorkExperience";
import { WORK_EXPERIENCE_DATA } from "@/data/workExperienceData";
import DiagonalPatternFrame from "@/components/DiagonalPatternFrame";

export default function WorkPage() {
  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="relative mx-auto max-w-3xl">
        <DiagonalPatternFrame>
          <div className="mx-auto w-full max-w-3xl sm:px-0">
            <div id="js-cover-mark" className="absolute top-0 left-0 w-full h-32 pointer-events-none" />
            <div className="bg-background border border-gray-300/50 dark:border-white/10 mt-6 p-4">
              <WorkExperience experiences={WORK_EXPERIENCE_DATA} max={50} />
            </div>
          </div>
        </DiagonalPatternFrame>
      </div>
    </div>
  );
}
