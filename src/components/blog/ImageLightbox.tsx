"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface LightboxState {
  src: string;
  alt: string;
}

const LightboxContext = React.createContext<{
  open: (image: LightboxState) => void;
} | null>(null);

export function useImageLightbox() {
  const ctx = React.useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useImageLightbox must be used within an ImageLightboxProvider");
  }
  return ctx;
}

export function ImageLightboxProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<LightboxState | null>(null);

  const open = useCallback((image: LightboxState) => {
    setActive(image);
  }, []);

  const close = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, close]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}

      <Dialog open={Boolean(active)} onOpenChange={(isOpen) => !isOpen && close()}>
        {active ? (
          <DialogContent
            overlayClassName="bg-background/40 backdrop-blur-md"
            className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-5xl flex-col items-center overflow-hidden bg-background p-4 sm:p-5"
          >
            <DialogTitle className="sr-only">
              {active.alt || "Enlarged image"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Press Escape to return the image to its original size.
            </DialogDescription>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />
            {active.alt ? (
              <p className="mt-3 max-w-2xl text-center text-sm text-muted-foreground">
                {active.alt}
              </p>
            ) : null}
          </DialogContent>
        ) : null}
      </Dialog>
    </LightboxContext.Provider>
  );
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function ZoomableImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
}: ZoomableImageProps) {
  const { open } = useImageLightbox();

  return (
    <button
      type="button"
      onClick={() => open({ src, alt })}
      className={cn("block w-full cursor-zoom-in overflow-hidden rounded-lg", className)}
      aria-label={alt ? `Enlarge image: ${alt}` : "Enlarge image"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn("block h-auto w-full max-w-full", imgClassName)}
        loading={priority ? "eager" : "lazy"}
      />
    </button>
  );
}
