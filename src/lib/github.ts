export interface GithubContributionDay {
  /** `YYYY-MM-DD` */
  date: string;
  count: number;
}

export interface GithubContributions {
  username: string;
  total: number;
  days: GithubContributionDay[];
}

// Public proxy over GitHub's contribution calendar, so no token is needed.
// Refetched at most once a day; the page stays static between refreshes.
const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";
const REVALIDATE_SECONDS = 60 * 60 * 24;

export function githubUsernameFromUrl(url: string): string | null {
  const match = /github\.com\/([^/?#]+)/i.exec(url);
  return match ? match[1] : null;
}

/** Last year of contributions, or `null` if the API is down (the section then hides). */
export async function getGithubContributions(username: string): Promise<GithubContributions | null> {
  try {
    const res = await fetch(`${CONTRIBUTIONS_API}/${encodeURIComponent(username)}?y=last`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      total?: { lastYear?: number };
      contributions?: { date: string; count: number }[];
    };
    const days = (json.contributions ?? []).map(({ date, count }) => ({ date, count }));
    if (days.length === 0) return null;

    return {
      username,
      total: json.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0),
      days,
    };
  } catch {
    return null;
  }
}
