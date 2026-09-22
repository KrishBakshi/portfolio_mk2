"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scope = document.querySelector<HTMLElement>("[data-reading-scope]");
      const root = document.documentElement;
      const scopeTop = scope ? window.scrollY + scope.getBoundingClientRect().top : 0;
      const max = scope
        ? Math.max(1, scope.offsetHeight - window.innerHeight)
        : root.scrollHeight - root.clientHeight;
      const progress = Math.min(1, Math.max(0, (root.scrollTop - scopeTop) / max));
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left scale-x-0 bg-foreground"
    />
  );
}
