# AGENTS.md

Instructions for AI agents working on this portfolio (`prot_mk2`).

## Project overview

Next.js 16 App Router portfolio for **Krish Bakshi** (Data Scientist). Content is mostly data-driven from JSON/MDX under `public/data/`, with profile copy in `src/lib/llms.ts`.

## Content sources

| Content | Location | Notes |
|---------|----------|--------|
| Profile header & bullets | `src/lib/llms.ts` → `PROFILE` | Tagline, highlights, social links, banner paths |
| Work experience | `public/data/work-experience.json` | Roles, descriptions (markdown), skills |
| Projects | `public/data/projects/*.mdx` | Frontmatter: `title`, `slug`, `description`, `domains`, `technologies`, `isWorking` |
| Blog posts | `public/data/blog/{slug}/{slug}.mdx` | Set `isPublished: true` in frontmatter |
| Tech stack | `public/data/skills.json` | Rendered on home page Stack section |
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

## Command search (`⌘K`)

Search index is built in `src/lib/search-index.ts` (server-only).

- **Projects**: domain subcategories only (e.g. "AI Agents projects"), not individual project rows. Keywords include project titles/tech within each domain for lookup.
- **Do not add** tech stack items to search.
- Groups: Navigation, Projects, Blog, Experience, Contact & Links, Theme.

## Conventions

- Match existing component patterns; keep diffs focused.
- External links in work experience markdown: `https://` opens in new tab (`WorkExperience.tsx`).
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
