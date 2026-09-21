import type { NextConfig } from "next";

// Assets (videos, blog images, documents) are served from our own domain when
// ASSETS_BASE_URL is set; the bucket address itself is never in the site.
const assetsBase = process.env.ASSETS_BASE_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // /resume.pdf stays on our own domain: the file is fetched from the bucket
  // behind the scenes, so the assets domain never shows in the address bar.
  // beforeFiles so it wins over the local copy in public/.
  async rewrites() {
    return {
      beforeFiles: assetsBase
        ? [{ source: "/resume.pdf", destination: `${assetsBase}/documents/resume.pdf` }]
        : [],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      ...(assetsBase ? [{ protocol: "https" as const, hostname: new URL(assetsBase).hostname }] : []),
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    qualities: [75, 100],
  },
};

export default nextConfig;
