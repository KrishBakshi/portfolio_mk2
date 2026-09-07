"use client";

import { cn } from "@/lib/utils";
import { ImageLightboxProvider, ZoomableImage } from "./ImageLightbox";

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
    <ImageLightboxProvider>
      <figure className={cn("not-prose my-8", className)}>
        <div
          className={cn(
            "grid gap-2",
            images.length === 2 && "grid-cols-1 sm:grid-cols-2",
            images.length >= 3 && "grid-cols-2 sm:grid-cols-3"
          )}
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-muted/30"
            >
              <div className="aspect-[4/3]">
                <ZoomableImage
                  src={image.src}
                  alt={image.alt}
                  className="size-full rounded-none"
                  imgClassName="size-full object-contain"
                />
              </div>
              {image.alt ? (
                <figcaption className="border-t border-border px-2 py-2 text-center text-xs text-muted-foreground">
                  {image.alt}
                </figcaption>
              ) : null}
            </div>
          ))}
        </div>
      </figure>
    </ImageLightboxProvider>
  );
}
