"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";
// Note: Uncomment when you add the audio file at /public/audio/ui-sounds/click.wav
// import { useSound } from "@/hooks/use-sound";

import { MoonIcon } from "./animated-icons/moon";
import { SunMediumIcon } from "./animated-icons/sun-medium";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const { setMetaColor } = useMetaColor();

  // Note: Uncomment when you add the audio file
  // const playClick = useSound("/audio/ui-sounds/click.wav");
  const playClick = useCallback((volume: number = 0.5) => {
    // Sound will be enabled when audio file is added
  }, []);

  const switchTheme = useCallback(() => {
    playClick(0.5);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor, playClick]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={switchTheme}
    >
      <MoonIcon size={16} className="relative hidden h-4 w-4 after:absolute after:-inset-2 [html.dark_&]:block" />
      <SunMediumIcon size={16} className="relative hidden h-4 w-4 after:absolute after:-inset-2 [html.light_&]:block" />
      <span className="sr-only">Theme Toggle</span>
    </Button>
  );
}

