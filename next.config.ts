import type { NextConfig } from "next";

import { ASSETS_BASE_URL } from "./src/lib/assets";

// Videos, blog images and the resume live in R2 and are served from our own
// domain. See src/lib/assets.ts.
const assetsBase = ASSETS_BASE_URL;

const nextConfig: NextConfig = {
  // /resume.pdf stays on our own domain: the file is fetched from the bucket
  // behind the scenes, so the assets domain never shows in the address bar.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/resume.pdf", destination: `${assetsBase}/documents/resume.pdf` }],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      { protocol: "https" as const, hostname: new URL(assetsBase).hostname },
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
