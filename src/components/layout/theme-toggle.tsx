"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { setMetaColor } = useMetaColor();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const switchTheme = useCallback(() => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [mounted, resolvedTheme, setTheme, setMetaColor]);

  const isDark = mounted && resolvedTheme === "dark";

  // A small switch with square corners: the knob slides right for dark mode.
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={switchTheme}
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-[4px] border border-border bg-muted p-[2px] transition-colors hover:border-muted-foreground/60"
    >
      <span
        className={cn(
          "grid size-[18px] place-items-center rounded-[3px] bg-foreground text-background shadow-sm transition-transform duration-200 ease-out",
          isDark && "translate-x-5"
        )}
      >
        {isDark ? <Moon className="size-3" /> : <Sun className="size-3" />}
      </span>
    </button>
  );
}
