"use client";

import Image from "next/image";
import BannerOverlay from "./BannerOverlay";

interface BannerSectionProps {
  quote?: string;
  bannerImage?: string;
}

export default function BannerSection({
  quote = "",
  bannerImage = "/header/banner.png",
}: BannerSectionProps) {
  return (
    <div className="w-full mb-2 relative">
      <div className="relative" style={{ height: "auto" }}>
        <Image
          alt="Banner"
          width={1240}
          height={900}
          className="sm:rounded-lg w-full h-[200px] sm:h-[270px] object-cover"
          src={bannerImage}
          style={{ color: "transparent", minHeight: "100px" }}
          priority
        />
        <BannerOverlay position="top" />
        <BannerOverlay position="bottom" />
        <BannerOverlay position="left" />
        <BannerOverlay position="right" />
        {quote && (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <p className="text-white text-base sm:text-xl italic font-sans text-center">
              {quote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

