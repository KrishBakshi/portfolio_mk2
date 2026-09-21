/**
 * Public assets domain: the R2 bucket's custom domain. Videos, blog images and
 * the resume are served from here. Set ASSETS_BASE_URL to point somewhere else
 * (for example a staging bucket).
 */
export const ASSETS_BASE_URL = (process.env.ASSETS_BASE_URL ?? "https://assets.krishbakshi.com").replace(/\/+$/, "");

/** Blog files: /data/blog/<slug>/<file> becomes <base>/blogs/<slug>/<file>. */
export function withBlogAssets(text: string): string {
    return text.replaceAll("/data/blog/", `${ASSETS_BASE_URL}/blogs/`);
}
