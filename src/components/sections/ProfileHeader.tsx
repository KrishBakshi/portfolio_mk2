"use client";

import Link from "next/link";

import { cn, textLink } from "@/lib/utils";
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

const socialLinkClassName = cn(
  "inline-flex min-h-10 items-center text-sm text-muted-foreground hover:text-foreground active:opacity-75 touch-manipulation",
  textLink
);

const inlineLinkClassName = cn("font-semibold text-inherit hover:text-foreground", textLink);

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
  const links: SocialLinkItem[] = [
    socialLinks.github && { label: "GitHub", href: socialLinks.github },
    socialLinks.huggingface && { label: "Hugging Face", href: socialLinks.huggingface },
    socialLinks.twitter && { label: "X", href: socialLinks.twitter },
    socialLinks.linkedin && { label: "LinkedIn", href: socialLinks.linkedin },
    socialLinks.mail && { label: "Email", href: socialLinks.mail, external: false },
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
        className="mt-7 flex flex-nowrap items-center justify-between gap-x-2 gap-y-1 sm:flex-wrap sm:justify-start sm:gap-x-5"
      >
        {links.map((link) => (
          <SocialLink key={link.label} {...link} />
        ))}
      </nav>
    </header>
  );
}
