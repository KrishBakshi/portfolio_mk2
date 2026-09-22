/**
 * Public assets domain: the R2 bucket's custom domain. Videos, blog images and
 * the resume are served from here. Must be set in the environment (.env
 * locally, deploy env vars in Vercel) — never hard-coded in source.
 */
const rawAssetsBaseUrl = process.env.ASSETS_BASE_URL;

if (!rawAssetsBaseUrl) {
  throw new Error(
    "ASSETS_BASE_URL is not set. Add it to .env (local) or the deploy environment " +
      "(Vercel Project Settings \u2192 Environment Variables) \u2014 see AGENTS.md \u201cAssets (object storage)\u201d."
  );
}

export const ASSETS_BASE_URL = rawAssetsBaseUrl.replace(/\/+$/, "");

/** Blog files: /data/blog/<slug>/<file> becomes <base>/blogs/<slug>/<file>. */
export function withBlogAssets(text: string): string {
    return text.replaceAll("/data/blog/", `${ASSETS_BASE_URL}/blogs/`);
}
