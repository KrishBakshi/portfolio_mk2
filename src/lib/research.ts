import researchData from "../../public/data/research.json";

export interface ResearchLinks {
  paper: string;
  code?: string;
  website?: string;
  dataset?: string;
  /** Portfolio project page, e.g. `/projects/worldbench`. */
  project?: string;
}

export interface ResearchPaper {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  arxivId?: string;
  /** One line for list rows (max 80 chars). */
  display: string;
  summary: string;
  links: ResearchLinks;
}

export const RESEARCH_DISPLAY_MAX_CHARS = 80;

export function getResearchPapers(): ResearchPaper[] {
  const papers = researchData as ResearchPaper[];
  for (const paper of papers) {
    if (paper.display.length > RESEARCH_DISPLAY_MAX_CHARS) {
      throw new Error(
        `research.json: "${paper.slug}" display is ${paper.display.length} chars (max ${RESEARCH_DISPLAY_MAX_CHARS})`
      );
    }
  }
  return [...papers].sort((a, b) => b.year - a.year);
}

/** Where and when it was published, e.g. "arXiv preprint · 2026" (the row's subtitle). */
export function researchVenue(paper: ResearchPaper): string {
  return `${paper.venue} · ${paper.year}`;
}
