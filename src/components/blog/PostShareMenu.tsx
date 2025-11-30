"use client";

import * as React from "react";
import { LinkIcon, Share } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiX, SiLinkedin } from "react-icons/si";

export function PostShareMenu({ url }: { url: string }) {
  // Ensure we have an absolute URL for sharing/copying
  const absoluteUrl = typeof window !== "undefined" 
    ? new URL(url, window.location.origin).toString()
    : url.startsWith("http") ? url : `https://krish.tech${url}`; // Fallback if SSR

  const urlEncoded = encodeURIComponent(absoluteUrl);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(absoluteUrl);
    toast.success("Copied link");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-7 w-7 rounded-lg active:scale-95"
        >
          <Share className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48" collisionPadding={8}>
        <DropdownMenuItem onClick={copyToClipboard}>
          <LinkIcon className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`https://x.com/intent/tweet?url=${urlEncoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <SiX className="mr-2 h-4 w-4" />
            Share on X
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite?url=${urlEncoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <SiLinkedin className="mr-2 h-4 w-4" />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

