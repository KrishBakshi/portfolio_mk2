"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
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

const ZOOM_STEP = 0.5;
const MAX_ZOOM = 4;
const MIN_ZOOM = 1;

export function ImageLightboxProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState<LightboxState | null>(null);
    const [zoom, setZoom] = useState(1);

    const open = useCallback((image: LightboxState) => {
        setActive(image);
        setZoom(1);
    }, []);

    const close = useCallback(() => {
        setActive(null);
        setZoom(1);
    }, []);

    useEffect(() => {
        if (!active) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
            if (event.key === "+" || event.key === "=") setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
            if (event.key === "-") setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [active, close]);

    return (
        <LightboxContext.Provider value={{ open }}>
            {children}

            <Dialog open={Boolean(active)} onOpenChange={(open) => !open && close()}>
            {active && (
                <DialogContent className="flex h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-none flex-col items-center justify-center overflow-hidden rounded-xl bg-black/95 p-4 text-white sm:max-w-none [&>button]:text-white">
                    <DialogTitle className="sr-only">
                        {active.alt || "Image preview"}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Use the controls to zoom the image. Press Escape to close.
                    </DialogDescription>
                    <div
                        className="absolute top-4 left-4 flex items-center gap-2"
                    >
                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
                            className="grid size-11 place-items-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
                            aria-label="Zoom out"
                        >
                            <Minus className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
                            className="grid size-11 place-items-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
                            aria-label="Zoom in"
                        >
                            <Plus className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setZoom(1)}
                            className="grid size-11 place-items-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
                            aria-label="Reset zoom"
                        >
                            <RotateCcw className="size-5" />
                        </button>
                    </div>

                    <div
                        className="flex max-h-full max-w-full items-center justify-center overflow-auto"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={active.src}
                            alt={active.alt}
                            style={{ transform: `scale(${zoom})` }}
                            className="max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-150 ease-out"
                        />
                    </div>

                    {active.alt && (
                        <p className="mt-4 max-w-2xl text-center text-sm text-white/70">{active.alt}</p>
                    )}
                </DialogContent>
            )}
            </Dialog>
        </LightboxContext.Provider>
    );
}

interface ZoomableImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
    const { open } = useImageLightbox();

    return (
        <button
            type="button"
            onClick={() => open({ src, alt })}
            className={cn("block w-full cursor-zoom-in overflow-hidden rounded-lg", className)}
            aria-label={alt ? `Enlarge image: ${alt}` : "Enlarge image"}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="block h-auto w-full max-w-full" loading="lazy" />
        </button>
    );
}
