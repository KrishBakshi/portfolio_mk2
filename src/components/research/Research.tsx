import { EntryRow } from "@/components/ui/entry-row";
import { Section } from "@/components/ui/section";
import { researchVenue, type ResearchPaper } from "@/lib/research";

/** Home-page list: one row per paper, opening the paper itself (arXiv) in a new tab. */
export function Research({ papers, max, showAllHref }: {
  papers: ResearchPaper[];
  max?: number;
  showAllHref?: string;
}) {
  return (
    <Section title="Research" href={showAllHref}>
      {(max ? papers.slice(0, max) : papers).map((paper) => (
        <EntryRow
          key={paper.slug}
          href={paper.links.paper}
          external
          title={paper.title}
          sub={researchVenue(paper)}
        />
      ))}
    </Section>
  );
}

/** /research page: one row per paper, like the project and blog lists, opening the paper. */
export function ResearchEntry({ paper }: { paper: ResearchPaper }) {
  return (
    // The id keeps /research#<slug> links from the home page working.
    <div id={paper.slug} className="scroll-mt-20">
      <EntryRow href={paper.links.paper} external title={paper.title} sub={researchVenue(paper)} />
    </div>
  );
}
