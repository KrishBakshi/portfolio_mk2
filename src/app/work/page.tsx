import { WorkExperience } from "@/components/sections/WorkExperience";
import { WORK_EXPERIENCE_DATA } from "@/lib/static-data";
import { PageCanvas } from "@/components/PageCanvas";

export default function WorkPage() {
  return (
    <PageCanvas>
      <div className="mx-auto mb-6 w-full max-w-3xl sm:px-0">
        <div id="js-cover-mark" className="pointer-events-none absolute left-0 top-0 h-32 w-full" />
        <div className="mt-6 border border-gray-300/50 bg-background p-4 dark:border-white/10">
          <WorkExperience
            experiences={WORK_EXPERIENCE_DATA}
            title="Work Experience"
            max={50}
            expandLatestPositions
          />
        </div>
      </div>
    </PageCanvas>
  );
}
