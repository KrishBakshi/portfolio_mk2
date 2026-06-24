import Image from "next/image";


interface BannerSectionProps {
  quote?: string;
  bannerImage?: string;
}

export default function BannerSection({
  quote = "",
  bannerImage = "",
}: BannerSectionProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <Image
        alt="Banner"
        width={1240}
        height={900}
        className="h-[180px] w-full object-cover object-center sm:h-[220px]"
        src={bannerImage}
        style={{ color: "transparent" }}
        priority
      />
      {quote && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <p className="text-center font-sans text-base italic text-white sm:text-xl">
            {quote}
          </p>
        </div>
      )}
    </div>
  );
}

