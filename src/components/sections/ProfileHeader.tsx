"use client";

import { FaLinkedin, FaXTwitter, FaGithub, FaPaperclip } from "react-icons/fa6";

interface ProfileHeaderProps {
  name?: string;
  age?: string;
  title?: string;
  profileImage?: string;
  socialLinks?: {
    twitter?: string;
    resume?: string;
    github?: string;
    linkedin?: string;
  };
}

export default function ProfileHeader({
  name = "",
  age = "",
  title = "",
  profileImage = "",
  socialLinks = {
    twitter: "",
    github: "",
    linkedin: "",
    resume: "",
  },
}: ProfileHeaderProps) {
  return (
    <div className="flex-col -mt-10 px-4 sm:px-0 pb-4 sm:px-0">
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 mb-4 sm:ml-6 relative z-10 rounded-full overflow-hidden bg-cover bg-center border-1 border-background"
        role="img"
        aria-label={name}
        style={{ backgroundImage: `url("${profileImage}")` }}
      />
      <div className="text-left sm:flex sm:justify-between sm:items-center w-full sm:px-6 flex-col sm:flex-row">
        <div className="px-0">
          <h1 className="font-sans text-3xl tracking-[0.01em] font-semibold mb-0">
            {name}
          </h1>
          <p className="opacity-60 text-xs sm:text-sm text-muted-foreground font-mono">
            {age && `${age} • `}
            {title}
          </p>
        </div>
        <div className="flex justify-start space-x-4 mt-3 sm:mt-0 px-0">
          {socialLinks.github && (
            <a
              className="hover:opacity-80 touch-manipulation active:opacity-75 text-foreground"
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            >
              <FaGithub size={18} />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              className="hover:opacity-80 touch-manipulation active:opacity-75 text-foreground"
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            >
              <FaXTwitter size={18} />
            </a>
          )}
          {socialLinks.resume && (
            <a
              className="hover:opacity-80 touch-manipulation active:opacity-75 text-foreground"
              href={socialLinks.resume}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            >
              <FaPaperclip size={18} />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              className="hover:opacity-80 touch-manipulation active:opacity-75 text-foreground"
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                WebkitTapHighlightColor: "transparent",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                userSelect: "none",
              }}
            >
              <FaLinkedin size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

