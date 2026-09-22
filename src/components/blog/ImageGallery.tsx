"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ZoomableImage } from "./ImageLightbox";

export interface ImageGalleryItem {
    src: string;
    alt: string;
}

export interface ImageGalleryProps {
    images: ImageGalleryItem[];
    className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
    if (images.length === 0) return null;

    return (
        <figure className={cn("not-prose my-8", className)}>
            <div
                className={cn(
                    "grid gap-2",
                    images.length === 2 && "grid-cols-1 sm:grid-cols-2",
                    images.length >= 3 && "grid-cols-2 sm:grid-cols-3"
                )}
            >
                {images.map((image, index) => (
                    <div key={`${image.src}-${index}`} className="flex flex-col gap-1.5">
                        <ZoomableImage
                            src={image.src}
                            alt={image.alt}
                            className="aspect-[4/3] bg-muted [&>img]:h-full [&>img]:w-full [&>img]:object-contain"
                        />
                        {image.alt && (
                            <p className="text-center text-xs text-muted-foreground">{image.alt}</p>
                        )}
                    </div>
                ))}
            </div>
        </figure>
    );
}
