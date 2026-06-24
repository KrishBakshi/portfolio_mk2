'use client'

import { cn } from "@/lib/utils";

/** Viewport fill below sticky site header (pt-2 + h-12). */
export const PAGE_CONTENT_MIN_HEIGHT = "min-h-[calc(100dvh-3.5rem)]";

interface DiagonalPatternFrameProps {
    children: React.ReactNode;
    className?: string;
}

export default function DiagonalPatternFrame({ children, className }: DiagonalPatternFrameProps) {
    return (
        <div className={cn(
            "relative mx-auto w-full max-w-screen overflow-visible",
            PAGE_CONTENT_MIN_HEIGHT,
            className
        )}>
            <div
                className="pointer-events-none absolute inset-0 z-0 border border-gray-300/50 border-t-0 opacity-[0.06] dark:border-white/10 md:-left-[60px] md:-right-[60px]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, currentColor 2px, currentColor 3px, transparent 3px, transparent 6px)',
                    color: 'var(--foreground)'
                }}
            />

            <div className={cn("relative z-10 flex flex-col gap-8", PAGE_CONTENT_MIN_HEIGHT)}>
                {children}
            </div>
        </div>
    );
}
