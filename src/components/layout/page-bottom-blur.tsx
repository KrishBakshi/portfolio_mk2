"use client";

import { useEffect, useState } from "react";

import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export function PageBottomBlur() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const canScrollFurther =
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center"
    >
      <div className="relative h-24 w-full max-w-3xl sm:h-28">
        <ProgressiveBlur position="bottom" height="70%" />
      </div>
    </div>
  );
}
