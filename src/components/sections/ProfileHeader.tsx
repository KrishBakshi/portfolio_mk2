"use client";

import Link from "next/link";
import { FaLinkedin, FaXTwitter, FaGithub, FaPaperclip, FaEnvelope } from "react-icons/fa6";
import type { ProfileBullet } from "@/lib/llms";

interface ProfileHeaderProps {
  name?: string;
  age?: string;
  title?: string;
  profileImage?: string;
  tagline?: ProfileBullet;
  bullets?: ProfileBullet[];
  highlights?: string[];
  socialLabel?: string;
  socialLinks?: {
    twitter?: string;
    resume?: string;
    github?: string;
    linkedin?: string;
    mail?: string;
  };
}

const tapStyle = {
  WebkitTapHighlightColor: "transparent",
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
  userSelect: "none",
} as const;

const socialLinkClassName =
  "text-foreground hover:opacity-80 active:opacity-75 touch-manipulation transition-opacity duration-200";

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
  age = "",
  title = "",
  profileImage = "",
  tagline,
  bullets = [],
  highlights = [],
  socialLabel = "Here are my socials",
  socialLinks = {
    twitter: "",
    github: "",
    linkedin: "",
    resume: "",
    mail: "",
  },
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col px-4 pb-6 pt-4 sm:px-6 sm:pt-5">
      <div className="mb-6 flex items-end gap-2">
        <div
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-cover bg-center shadow-sm dark:border-gray-600"
          role="img"
          aria-label={name}
          style={{ backgroundImage: `url("${profileImage}")` }}
        />
        <div className="min-w-0">
          <h1 className="mb-1 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            {name}
          </h1>
          <p className="font-mono text-xs text-muted-foreground sm:text-sm">
            {age && `${age} • `}
            {title}
          </p>
        </div>
      </div>

      {(tagline?.length || bullets.length > 0 || highlights.length > 0) && (
        <div className="mb-6 space-y-3">
          {tagline && tagline.length > 0 && (
            <p className="max-w-prose font-sans text-[15px] leading-relaxed text-foreground/90 sm:text-base">
              <ProfileBulletContent parts={tagline} />
            </p>
          )}

          {bullets.length > 0 && (
            <ul className="space-y-2">
              {bullets.map((parts, index) => (
                <li
                  key={index}
                  className="flex gap-2.5 font-mono text-xs leading-relaxed text-foreground/90 sm:text-sm"
                >
                  <span aria-hidden className="shrink-0 text-muted-foreground">
                    •
                  </span>
                  <span>
                    <ProfileBulletContent parts={parts} />
                  </span>
                </li>
              ))}
            </ul>
          )}

          {highlights.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 font-mono text-xs text-foreground/85"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="space-y-3 border-t border-border/50 pt-5">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {socialLabel}
        </p>
        <div className="flex flex-wrap gap-4">
          {socialLinks.github && (
            <a
              className={socialLinkClassName}
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={tapStyle}
            >
              <FaGithub size={18} />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              className={socialLinkClassName}
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              style={tapStyle}
            >
              <FaXTwitter size={18} />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              className={socialLinkClassName}
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={tapStyle}
            >
              <FaLinkedin size={18} />
            </a>
          )}
          {socialLinks.mail && (
            <a
              className={socialLinkClassName}
              href={socialLinks.mail}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              style={tapStyle}
            >
              <FaEnvelope size={18} />
            </a>
          )}
          {socialLinks.resume && (
            <a
              className={socialLinkClassName}
              href={socialLinks.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume"
              style={tapStyle}
            >
              <FaPaperclip size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
