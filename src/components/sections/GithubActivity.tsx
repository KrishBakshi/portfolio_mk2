import { GithubHeatmap } from "@/components/sections/GithubHeatmap";
import { getGithubContributions, githubUsernameFromUrl } from "@/lib/github";
import { SlashHeading } from "@/components/ui/section";
import { cn, textLink } from "@/lib/utils";
import { ExternalArrow } from "@/components/ui/external-arrow";

export async function GithubActivity({ profileUrl }: { profileUrl: string }) {
  const username = githubUsernameFromUrl(profileUrl);
  const contributions = username ? await getGithubContributions(username) : null;
  if (!contributions) return null;

  return (
    <section className="px-5 sm:px-8" aria-labelledby="github-activity-title">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <SlashHeading id="github-activity-title" title="GitHub" />
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("text-xs text-muted-foreground hover:text-foreground", textLink)}
        >
          {contributions.total.toLocaleString("en-US")} contributions in the last year
          <ExternalArrow />
        </a>
      </div>
      <GithubHeatmap days={contributions.days} />
    </section>
  );
}
