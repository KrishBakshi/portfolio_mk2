import { getStaticPageMetadata } from "@/config/metadata";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { WORK_EXPERIENCE_DATA } from "@/lib/static-data";
import { Skills } from "@/components/sections/Skills";
import { PageCanvas } from "@/components/PageCanvas";

export const metadata = getStaticPageMetadata("/work");

export default function WorkPage() {
  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background py-10 sm:py-16">
        <WorkExperience
          experiences={WORK_EXPERIENCE_DATA}
          title="Experience"
          max={50}
          expandLatestPositions
        />
        <div className="mt-14">
          <Skills />
        </div>
      </main>
    </PageCanvas>
  );
}
