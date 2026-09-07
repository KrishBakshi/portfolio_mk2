"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";
// Note: Uncomment when you add the audio file at /public/audio/ui-sounds/click.wav
// import { useSound } from "@/hooks/use-sound";

import { MoonIcon } from "@/components/animated-icons/moon";
import { SunMediumIcon } from "@/components/animated-icons/sun-medium";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { setMetaColor } = useMetaColor();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Note: Uncomment when you add the audio file
  // const playClick = useSound("/audio/ui-sounds/click.wav");
  const playClick = useCallback(() => {
    // Sound will be enabled when audio file is added
  }, []);

  const switchTheme = useCallback(() => {
    if (!mounted) return;
    playClick();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [mounted, resolvedTheme, setTheme, setMetaColor, playClick]);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={switchTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunMediumIcon size={16} className="h-4 w-4" /> : <MoonIcon size={16} className="h-4 w-4" />}
    </Button>
  );
}

