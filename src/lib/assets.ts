/**
 * Public assets domain (Cloudflare in front of the storage bucket).
 * Unset = serve everything from public/ as before.
 */
export const ASSETS_BASE_URL = process.env.ASSETS_BASE_URL?.replace(/\/+$/, "");

/** Blog files: /data/blog/<slug>/<file> becomes <base>/blogs/<slug>/<file>. */
export function withBlogAssets(text: string): string {
    return ASSETS_BASE_URL ? text.replaceAll("/data/blog/", `${ASSETS_BASE_URL}/blogs/`) : text;
}
