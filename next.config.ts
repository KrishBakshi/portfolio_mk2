import type { NextConfig } from "next";

// Assets (videos, blog images, documents) are served from our own domain when
// ASSETS_BASE_URL is set; the bucket address itself is never in the site.
const assetsBase = process.env.ASSETS_BASE_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Keep /resume.pdf as the stable link; it forwards to the copy in the bucket.
  async redirects() {
    return assetsBase
      ? [{ source: "/resume.pdf", destination: `${assetsBase}/documents/resume.pdf`, permanent: false }]
      : [];
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
