"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface BannerSectionProps {
  quote?: string;
  lightBanner: string;
  darkBanner: string;
}

const BANNER_HEIGHT = "h-[180px] sm:h-[220px]";
const FADE_TRANSITION = { duration: 0.45, ease: "easeInOut" as const };
const INSTANT_TRANSITION = { duration: 0 };

function resolveIsDark(resolvedTheme: string | undefined): boolean {
  if (resolvedTheme === "dark") return true;
  if (resolvedTheme === "light") return false;
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark");
  }
  return false;
}

export default function BannerSection({
  quote = "",
  lightBanner,
  darkBanner,
}: BannerSectionProps) {
  const { resolvedTheme } = useTheme();
  const hasSyncedTheme = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const showDark = resolveIsDark(resolvedTheme);

  useEffect(() => {
    if (!resolvedTheme) return;

    if (!hasSyncedTheme.current) {
      hasSyncedTheme.current = true;
      setShouldAnimate(false);
      return;
    }

    setShouldAnimate(true);
  }, [resolvedTheme]);

  const transition = shouldAnimate ? FADE_TRANSITION : INSTANT_TRANSITION;

  return (
    <div className={`relative w-full overflow-hidden ${BANNER_HEIGHT}`}>
      <motion.div
        initial={false}
        aria-hidden={showDark}
        animate={{ opacity: showDark ? 0 : 1 }}
        transition={transition}
        className="absolute inset-0"
      >
        <Image
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover object-center"
          src={lightBanner}
        />
      </motion.div>

      <motion.div
        initial={false}
        aria-hidden={!showDark}
        animate={{ opacity: showDark ? 1 : 0 }}
        transition={transition}
        className="absolute inset-0"
      >
        <Image
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover object-center"
          src={darkBanner}
        />
      </motion.div>

      <span className="sr-only">Profile banner</span>

      {quote && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <p className="text-center font-sans text-base italic text-white sm:text-xl">
            {quote}
          </p>
        </div>
      )}
    </div>
  );
}
