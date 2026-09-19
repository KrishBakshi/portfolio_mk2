"use client";

import { pageTitle } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { ProfileBullet } from "@/lib/llms";

interface ProfileHeaderProps {
  name?: string;
  profileImage?: string;
  bullets?: ProfileBullet[];
  socialLinks?: {
    twitter?: string;
    resume?: string;
    github?: string;
    huggingface?: string;
    linkedin?: string;
    mail?: string;
  };
}

const socialLinkClassName =
  "inline-flex min-h-10 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline active:opacity-75 touch-manipulation transition-colors";

const inlineLinkClassName =
  "font-semibold text-inherit no-underline transition-colors hover:text-foreground hover:underline hover:decoration-foreground hover:underline-offset-2";

function profileTextClassName(part: {
  italic?: boolean;
  semibold?: boolean;
}): string | undefined {
  const classes = [
    part.italic ? "italic" : "",
    part.semibold ? "font-semibold" : "",
  ].filter(Boolean);

  return classes.length > 0 ? classes.join(" ") : undefined;
}

function ProfileBulletContent({ parts }: { parts: ProfileBullet }) {
  return (
    <>
      {parts.map((part, index) =>
        part.type === "link" ? (
          part.href.startsWith("/") ? (
            <Link
              key={`${part.label}-${index}`}
              className={inlineLinkClassName}
              href={part.href}
            >
              {part.label}
            </Link>
          ) : (
            <a
              key={`${part.label}-${index}`}
              className={inlineLinkClassName}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part.label}
            </a>
          )
        ) : (
          <span
            key={`${part.value}-${index}`}
            className={profileTextClassName(part)}
          >
            {part.value}
          </span>
        )
      )}
    </>
  );
}

export default function ProfileHeader({
  name = "",
  profileImage = "",
  bullets = [],
  socialLinks = {
    twitter: "",
    github: "",
    linkedin: "",
    resume: "",
    mail: "",
  },
}: ProfileHeaderProps) {
  return (
    <header className="px-5 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl sm:size-16">
          <Image
            src={profileImage}
            alt={`${name} profile photo`}
            fill
            priority
            sizes="64px"
            className="object-cover"
          />
        </div>
        <h1 className={pageTitle}>
          {name}
        </h1>
      </div>

      {bullets.length > 0 && (
        <div className="mt-7 max-w-[64ch] space-y-2 text-[15px] leading-relaxed text-muted-foreground">
          {bullets.map((parts, index) => (
            <p key={index}>
              <ProfileBulletContent parts={parts} />
            </p>
          ))}
        </div>
      )}

      <nav aria-label="Profile links" className="mt-7 flex flex-wrap gap-x-5 gap-y-1">
          {socialLinks.github && (
            <a
              className={socialLinkClassName}
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <span>GitHub</span>
            </a>
          )}
          {socialLinks.huggingface && (
            <a
              className={socialLinkClassName}
              href={socialLinks.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hugging Face"
            >
              <span>Hugging Face</span>
            </a>
          )}
          {socialLinks.twitter && (
            <a
              className={socialLinkClassName}
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
            >
              <span>X</span>
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              className={socialLinkClassName}
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <span>LinkedIn</span>
            </a>
          )}
          {socialLinks.mail && (
            <a
              className={socialLinkClassName}
              href={socialLinks.mail}
              aria-label="Email"
            >
              <span>Email</span>
            </a>
          )}
      </nav>
    </header>
  );
}
