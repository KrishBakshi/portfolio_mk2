# AGENTS.md

Instructions for AI agents working on this portfolio (`prot_mk2`).

## Project overview

Next.js 16 App Router portfolio for **Krish Bakshi** (Data Scientist). Content is mostly data-driven from JSON/MDX under `public/data/`, with profile copy in `src/lib/llms.ts`.

## Content sources

| Content | Location | Notes |
|---------|----------|--------|
| Profile header & bullets | `src/lib/llms.ts` → `PROFILE` | Tagline, highlights, social links, banner paths |
| Work experience | `public/data/work-experience.json` | Roles, descriptions (markdown), skills |
| Projects | `public/data/projects/*.mdx` | Frontmatter: `title`, `slug`, `description`, `paper` (optional arXiv URL, adds a Paper button), `display` (one-line list overview, max 80 chars, build fails if longer), `domains`, `technologies`, `isWorking` |
| Blog posts | `public/data/blog/{slug}/{slug}.mdx` | Set `isPublished: true`; `display` = one-line hook for list cards (no question mark) (max 80 chars, build fails if longer) |
| Tech stack | `public/data/skills.json` | Rendered on home page Stack section |
| Research papers | `public/data/research.json` | `display` max 80 chars (build fails if longer); shown on home `/research` section and `/research` page |
| Project domain filters | `src/config/project-domains.ts` | Vision, AI Agents, LLM, RAG, Gen AI, RL |

## LLM exports (`/llms.txt` system)

Machine-readable portfolio files are **generated at build time** from the sources above. Do not hand-edit route output.

| Route | Generator | Purpose |
|-------|-----------|---------|
| `/llms.txt` | `getLlmsIndexMarkdown()` in `src/lib/llms.ts` | Index with docs links, **projects grouped by domain**, blog list |
| `/llms-full.txt` | `getLlmsFullMarkdown()` | Full dump: about, experience, projects (with MDX body), blog (with MDX body) |
| `/about.md` | `getAboutMarkdown()` | Profile + stack + contact |
| `/experience.md` | `getExperienceMarkdown()` | Work history |
| `/projects.md` | `getProjectsMarkdown()` | All projects with full content |
| `/sitemap.xml` | `src/app/sitemap.ts` | XML URL index |
| `/robots.txt` | `src/app/robots.ts` | Points to sitemap |

### When you add or change portfolio content

1. **New project** — Create `public/data/projects/{slug}.mdx` with valid frontmatter including `domains` (from `PROJECT_DOMAIN_FILTERS`). It automatically appears in:
   - `/projects` page
   - `/llms.txt` under the matching domain block (`### AI Agents`, etc.)
   - `/llms-full.txt` and `/projects.md`
   - `/sitemap.xml`

2. **New blog post** — Add MDX under `public/data/blog/{slug}/` with `isPublished: true`. Updates blog pages and all LLM exports.

3. **Work experience** — Edit `public/data/work-experience.json`. Updates `/work`, `/experience.md`, `/llms-full.txt`, and command search experience entries.

4. **Profile copy** — Edit `PROFILE` in `src/lib/llms.ts`. Updates home header and `/about.md`.

5. **New project domain** — Add to `PROJECT_DOMAIN_FILTERS` in `src/config/project-domains.ts`, then tag projects with that domain.

No manual edits to `src/app/llms.txt/route.ts` are needed unless changing HTTP behavior.

## Navigation

- From 1080px wide, the main links (plus Home and the theme toggle) are a sticky list in the left margin: `src/components/layout/side-nav.tsx`. Below that, the top bar shows them (hamburger under 765px). Links come from `MAIN_NAV` in `src/config/site.ts`.
- There is no search palette; it was removed on purpose.
- Home-page section headings use `SlashHeading` (`/projects`, `/research`, ...) from `src/components/ui/section.tsx`. Headings inside blog posts and project pages stay normal headings.
- Colour is the Kanagawa palette in `globals.css` (Lotus for light, Wave for dark), picked to match the profile picture: ink navy, cream, orange, reds, sakura pink. `--brand` (`text-brand`, orange) marks small things like the `/` and the active nav underline; `--heat-0..4` are the GitHub heatmap levels (navy to red to orange).

## Assets (object storage)

Videos, blog images and the resume live in a Cloudflare R2 bucket (`assets`) with three folders: `blogs`, `demo-preview` and `documents`. It is public through the R2 custom domain `https://assets.krishbakshi.com`. Object keys match the URL path, e.g. `demo-preview/wingmate.mp4`. These files are NOT in git.

- **Local copy:** `assets-source/` (git-ignored) mirrors the bucket layout: `demo-preview/`, `blogs/<slug>/`, `documents/`. Add or rename files there, then sync with `scripts/assets.sh copy assets-source assets:assets`.
- **Base URL:** `ASSETS_BASE_URL` is required — set it in `.env` locally and in the deploy environment (Vercel Project Settings → Environment Variables). `src/lib/assets.ts` throws a clear build-time error if it's missing; the URL is never hard-coded in source.
- **Videos:** frontmatter `videoPreview` stays `/assets/demo/preview/<name>.mp4`; it maps to `<base>/demo-preview/<name>.mp4`.
- **Blog images:** MDX and frontmatter keep `/data/blog/<slug>/<file>`; the loader maps them to `<base>/blogs/<slug>/<file>`. The `.mdx` files stay in the repo.
- **Resume:** `/resume.pdf` stays the public link; `next.config.ts` rewrites it (no redirect) to `<base>/documents/resume.pdf`.
- **Credentials:** `scripts/assets.sh` (rclone wrapper) needs `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` in `.env`. Never commit them; a local pre-commit hook blocks account endpoints and keys.
- **Naming:** give files descriptive names (no "Screenshot ..." or "image 3"), named after the project or what the image shows.

## GitHub heatmap and Mew companion

- **GitHub heatmap:** `src/components/sections/GithubActivity.tsx` sits under the profile header on the home page. Data comes from `src/lib/github.ts` (public contributions API, refreshed daily via ISR) and is drawn with the vendored Hirael `src/components/ui/calendar-heatmap.tsx` (MIT). If the API fails, the section hides.
- **Mew:** `src/components/companion/Mew.tsx` is mounted in the root layout. It first appears beside `#profile-links` (beside the photo on phones), then roams on its own and never follows the cursor: it floats, tumbles, or teleports with a poof, sometimes onto an element marked `data-mew-perch` (`beside` for section headings, `inside` for the footer). It doesn't follow the page when you scroll, but a moment after scrolling stops it may poof onto the screen. With reduced motion it stays still.
- **Sprite sheet:** `public/sprites/mew.png` is a 5x3 grid in the frame order listed in `POSES`. Regenerate it from a Gemini-style pose grid with `node scripts/sprite-sheet.mjs <input.png> public/sprites/mew.png`. The current source is `tmp/mew-sheet-clean.png` (not in git): the Gemini sheet with the duplicate tail erased from the somersault pose.

## Conventions

- Match existing component patterns; keep diffs focused.
- External links in work experience markdown: `https://` opens in new tab (`WorkExperience.tsx`).
- Every link that goes to another site (http/https) shows the small arrow from `src/components/ui/external-arrow.tsx` (`<ExternalArrow />`, test with `isExternalHref`): right after the link text, or at the end of a row or button. Internal links, `mailto:`, icon-only tiles (the tech stack grid) and the About intro on the home page (its links and the social links row) don't get one. Bare URLs in posts render as plain links (`LinkMention.tsx`), not badges.
- Theme-aware banner: `BannerSection.tsx` (defer theme opacity until mount to avoid hydration mismatch).
- Company/project copy: no em dashes in experience JSON unless user asks.
- Only commit when the user explicitly asks.

## Key paths

```
src/lib/llms.ts              # PROFILE + all LLM markdown generators
src/lib/search-index.ts      # Command palette search items
src/components/layout/command-menu.tsx
src/app/llms.txt/route.ts
src/app/llms-full.txt/route.ts
public/data/projects/
public/data/work-experience.json
```

## Verify after content changes

```bash
npm run build
```

Check `/llms.txt` shows new projects under the correct domain heading.
