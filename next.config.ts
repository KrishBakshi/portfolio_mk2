import type { NextConfig } from "next";

// Demo videos are served from our own domain at /media/*, forwarded to the
// storage bucket. MEDIA_ORIGIN is server-only, so the bucket address never
// appears in page HTML or client JS.
const mediaOrigin = process.env.MEDIA_ORIGIN?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return mediaOrigin
      ? [{ source: "/media/:path*", destination: `${mediaOrigin}/:path*` }]
      : [];
  },
  images: {
    remotePatterns: [
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
