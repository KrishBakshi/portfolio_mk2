"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
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

type SocialLinkItem = { label: string; href: string; external?: boolean };

function SocialLink({ label, href, external = true, className }: SocialLinkItem & { className?: string }) {
  return (
    <a
      className={cn(socialLinkClassName, "whitespace-nowrap max-sm:text-[13px]", className)}
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{label}</span>
    </a>
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
  const [showMore, setShowMore] = useState(false);

  // One line on phones: the last link waits behind the "…" button.
  const primaryLinks: SocialLinkItem[] = [
    socialLinks.github && { label: "GitHub", href: socialLinks.github },
    socialLinks.huggingface && { label: "Hugging Face", href: socialLinks.huggingface },
    socialLinks.twitter && { label: "X", href: socialLinks.twitter },
    socialLinks.linkedin && { label: "LinkedIn", href: socialLinks.linkedin },
    socialLinks.mail && { label: "Email", href: socialLinks.mail, external: false },
  ].filter((link): link is SocialLinkItem => Boolean(link));
  const extraLinks: SocialLinkItem[] = [
    socialLinks.resume && { label: "Resume", href: socialLinks.resume },
  ].filter((link): link is SocialLinkItem => Boolean(link));

  return (
    <header className="px-5 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-normal tracking-[-0.025em] text-foreground sm:text-4xl">
          <span className="mb-1 block text-lg text-muted-foreground sm:text-xl">Hi, I&apos;m</span>
          {name}
        </h1>
        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl sm:size-20">
          <Image
            src={profileImage}
            alt={`${name} profile photo`}
            fill
            priority
            sizes="80px"
            className="object-cover"
          />
        </div>
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

      <nav
        id="profile-links"
        aria-label="Profile links"
        className={cn(
          "mt-7 flex items-center gap-y-1 sm:flex-wrap sm:justify-start sm:gap-x-5",
          showMore ? "flex-wrap gap-x-4" : "flex-nowrap justify-between gap-x-2"
        )}
      >
        {primaryLinks.map((link) => (
          <SocialLink key={link.label} {...link} />
        ))}

        {extraLinks.length > 0 && (
          <button
            type="button"
            onClick={() => setShowMore((open) => !open)}
            aria-expanded={showMore}
            aria-controls="profile-links"
            aria-label={showMore ? "Show fewer links" : "Show more links"}
            className="inline-flex min-h-10 items-center text-muted-foreground transition-colors hover:text-foreground sm:hidden"
          >
            <ChevronDown
              className={cn("size-4 transition-transform duration-300 ease-out", showMore && "rotate-180")}
            />
          </button>
        )}

        {extraLinks.map((link) => (
          <SocialLink key={link.label} {...link} className={cn(!showMore && "max-sm:hidden")} />
        ))}
      </nav>
    </header>
  );
}
