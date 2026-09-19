"use client";

import React, { useCallback, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [zoomed, setZoomed] = useState(false);

    const open = useCallback((image: LightboxState) => {
        setActive(image);
        setZoomed(false);
    }, []);

    const close = useCallback(() => {
        setActive(null);
        setZoomed(false);
    }, []);

    return (
        <LightboxContext.Provider value={{ open }}>
            {children}

            <DialogPrimitive.Root open={Boolean(active)} onOpenChange={(next) => !next && close()}>
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                    {active && (
                        <DialogPrimitive.Content
                            aria-describedby={undefined}
                            onClick={(event) => {
                                if (!(event.target instanceof HTMLImageElement)) close();
                            }}
                            className={cn(
                                "fixed inset-0 z-50 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
                                zoomed ? "overflow-auto" : "overflow-hidden"
                            )}
                        >
                            <DialogPrimitive.Title className="sr-only">
                                {active.alt || "Image preview"}
                            </DialogPrimitive.Title>

                            <DialogPrimitive.Close
                                className="fixed top-4 right-4 z-10 grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label="Close"
                            >
                                <XIcon className="size-5" />
                            </DialogPrimitive.Close>

                            <div className="flex min-h-full min-w-full flex-col items-center justify-center gap-3 p-4 sm:p-8">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={active.src}
                                    alt={active.alt}
                                    onClick={() => setZoomed((z) => !z)}
                                    className={cn(
                                        "rounded-lg border border-border",
                                        zoomed
                                            ? "max-w-none cursor-zoom-out"
                                            : "max-h-[80dvh] max-w-full cursor-zoom-in object-contain"
                                    )}
                                />
                                {active.alt && !zoomed && (
                                    <p className="max-w-xl text-center text-sm text-muted-foreground">{active.alt}</p>
                                )}
                            </div>
                        </DialogPrimitive.Content>
                    )}
                </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
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
