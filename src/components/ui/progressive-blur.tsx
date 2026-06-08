"use client";

import React from "react";

import { cn } from "@/lib/utils";

export interface ProgressiveBlurProps {
  className?: string;
  height?: string;
  position?: "top" | "bottom" | "both";
  blurLevels?: number[];
  fadeToBackground?: boolean;
  subtle?: boolean;
}

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
  fadeToBackground = true,
  subtle = false,
}: ProgressiveBlurProps) {
  const divElements = Array(blurLevels.length - 2).fill(null);

  const bottomMask =
    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)";
  const topMask =
    "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)";
  const bothMask =
    "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)";

  const edgeMask =
    position === "bottom"
      ? "linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
      : position === "top"
        ? "linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
        : bothMask;

  const primaryMask =
    position === "bottom" ? bottomMask : position === "top" ? topMask : bothMask;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10",
        className,
        position === "top"
          ? "top-0"
          : position === "bottom"
            ? "bottom-0"
            : "inset-y-0"
      )}
      style={{
        height: position === "both" ? "100%" : height,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: primaryMask,
          WebkitMaskImage: primaryMask,
        }}
      />

      {divElements.map((_, index) => {
        const blurIndex = index + 1;
        const startPercent = blurIndex * 12.5;
        const midPercent = (blurIndex + 1) * 12.5;
        const endPercent = (blurIndex + 2) * 12.5;

        const maskGradient =
          position === "bottom"
            ? `linear-gradient(to bottom, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`
            : position === "top"
              ? `linear-gradient(to top, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`
              : bothMask;

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        );
      })}

      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
          maskImage: edgeMask,
          WebkitMaskImage: edgeMask,
        }}
      />

      {fadeToBackground ? (
        <div
          className={cn(
            "absolute inset-0",
            position === "bottom" &&
              (subtle
                ? "bg-gradient-to-b from-transparent via-background/10 to-background/50"
                : "bg-gradient-to-b from-transparent to-background"),
            position === "top" &&
              (subtle
                ? "bg-gradient-to-t from-transparent via-background/10 to-background/50"
                : "bg-gradient-to-t from-transparent to-background"),
            position === "both" &&
              "bg-gradient-to-b from-background via-transparent to-background"
          )}
          style={{ zIndex: blurLevels.length + 1 }}
        />
      ) : null}
    </div>
  );
}
