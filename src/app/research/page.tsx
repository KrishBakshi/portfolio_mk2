import { getStaticPageMetadata } from "@/config/metadata";
import { PageCanvas } from "@/components/PageCanvas";
import { ResearchEntry } from "@/components/research/Research";
import { getResearchPapers } from "@/lib/research";
import { pageTitle } from "@/lib/utils";

export const metadata = getStaticPageMetadata("/research");

export default function ResearchPage() {
  const papers = getResearchPapers();

  return (
    <PageCanvas>
      <main className="mx-auto w-full bg-background px-5 py-6 sm:px-8 sm:py-10">
        <h1 className={`${pageTitle} mb-4`}>Research</h1>
        <div>
          {papers.map((paper) => (
            <ResearchEntry key={paper.slug} paper={paper} />
          ))}
        </div>
      </main>
    </PageCanvas>
  );
}
