'use client'

import { cn } from "@/lib/utils";

interface DiagonalPatternFrameProps {
    children: React.ReactNode;
    className?: string;
}

export default function DiagonalPatternFrame({ children, className }: DiagonalPatternFrameProps) {
    return (
        <div className={cn(
            "relative w-full max-w-screen mx-auto overflow-visible",
            className
        )}>
            {/* Single diagonal pattern canvas extending 60px beyond each side */}
            <div
                className="absolute dark:opacity-[0.2] opacity-[0.2] inset-0 md:left-[-60px] md:right-[-60px] h-full pointer-events-none z-0"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 3px, transparent 3px, transparent 6px)',
                    color: 'var(--foreground)'
                }}
            />

            {/* Single diagonal pattern canvas – side columns removed */}

            {/* Content sections with gap instead of borders //add py-8 and border border-gray-300 border-dashed fir debugging */}
            <div className="relative flex flex-col gap-8 pb-8 z-10">
                {children}
            </div>
        </div>
    );
}
