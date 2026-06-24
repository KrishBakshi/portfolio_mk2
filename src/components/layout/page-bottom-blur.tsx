"use client";

import { useEffect, useState } from "react";

import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const MIN_SCROLL_OVERFLOW_PX = 80;

export function PageBottomBlur() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollOverflow =
        document.documentElement.scrollHeight - window.innerHeight;
      const canScrollFurther =
        scrollOverflow > MIN_SCROLL_OVERFLOW_PX &&
        window.scrollY + window.innerHeight <
          document.documentElement.scrollHeight - 24;

      setVisible(canScrollFurther);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40"
    >
      <div className="mx-auto w-full max-w-[calc(48rem+120px)] px-2 min-[765px]:px-4 min-[900px]:px-0">
        <div className="relative mx-auto h-24 w-full max-w-full min-[765px]:max-w-[calc(100%-4rem)] min-[900px]:max-w-3xl sm:h-28">
          <ProgressiveBlur position="bottom" height="70%" />
        </div>
      </div>
    </div>
  );
}
