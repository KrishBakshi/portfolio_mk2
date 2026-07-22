'use client'

import { FaLinkedin, FaXTwitter, FaGithub, FaPaperclip } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

interface LetsConnectProps {
    hook?: string;
    title?: string;
    subtitle?: string;
    socialLinks?: {
        twitter?: string;
        resume?: string;
        github?: string;
        linkedin?: string;
        mail?: string;
    };
}

const linkClassName =
    "touch-manipulation text-foreground hover:opacity-80 active:opacity-75 transition-opacity duration-200 sm:flex sm:items-center sm:justify-start sm:space-x-3 sm:group sm:rounded-lg sm:border sm:border-gray-200/50 sm:bg-gray-50/50 sm:px-3 sm:py-3 sm:dark:border-gray-700/50 sm:dark:bg-gray-800/30 sm:hover:bg-gray-100/50 sm:dark:hover:bg-gray-700/40 lg:border-none lg:bg-transparent lg:p-0 lg:dark:bg-transparent lg:hover:bg-transparent lg:dark:hover:bg-transparent";

const linkStyle = {
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
} as const;

export default function LetsConnect({
    hook = "If you've read this far, you might be interested in what I do.",
    title = "Let's Connect!",
    subtitle = "Find me on these platforms",
    socialLinks = {
        twitter: "https://x.com/KrishBakshi_",
        github: "https://github.com/KrishBakshi",
        linkedin: "https://linkedin.com/in/krish-bakshi-8b85b6314/",
        resume: "/resume.pdf",
        mail: "mailto:work.krishb@gmail.com",
    },
}: LetsConnectProps) {
    return (
        <div className="space-y-6 px-4 pb-8 sm:py-4">
            <p className="font-sans text-lg italic opacity-50 sm:text-lg">
                {hook}
            </p>

            <div className="flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
                <h2 className="font-sans text-lg font-semibold tracking-tight sm:text-lg">
                    {title}
                </h2>
                <p className="font-mono text-sm text-muted-foreground">
                    {subtitle}
                </p>
            </div>

            <div className="flex justify-start gap-4 sm:grid sm:grid-cols-2 sm:gap-4 lg:flex lg:gap-6">
                {socialLinks.github && (
                    <a
                        className={linkClassName}
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        suppressHydrationWarning
                        style={linkStyle}
                    >
                        <FaGithub size={18} className="sm:flex-shrink-0 sm:text-gray-600 sm:transition-transform sm:duration-200 sm:group-hover:scale-110 sm:dark:text-gray-300" />
                        <span className="hidden text-sm font-medium text-black/80 transition-colors duration-200 group-hover:text-[#006FEE] dark:text-white/80 sm:inline">
                            GitHub
                        </span>
                    </a>
                )}

                {socialLinks.twitter && (
                    <a
                        className={linkClassName}
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        suppressHydrationWarning
                        style={linkStyle}
                    >
                        <FaXTwitter size={18} className="sm:flex-shrink-0 sm:text-gray-600 sm:transition-transform sm:duration-200 sm:group-hover:scale-110 sm:dark:text-gray-300" />
                        <span className="hidden text-sm font-medium text-black/80 transition-colors duration-200 group-hover:text-[#006FEE] dark:text-white/80 sm:inline">
                            Twitter
                        </span>
                    </a>
                )}

                {socialLinks.linkedin && (
                    <a
                        className={linkClassName}
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        suppressHydrationWarning
                        style={linkStyle}
                    >
                        <FaLinkedin size={18} className="sm:flex-shrink-0 sm:text-gray-600 sm:transition-transform sm:duration-200 sm:group-hover:scale-110 sm:dark:text-gray-300" />
                        <span className="hidden text-sm font-medium text-black/80 transition-colors duration-200 group-hover:text-[#006FEE] dark:text-white/80 sm:inline">
                            LinkedIn
                        </span>
                    </a>
                )}

                {socialLinks.mail && (
                    <a
                        className={linkClassName}
                        href={socialLinks.mail}
                        target="_blank"
                        rel="noopener noreferrer"
                        suppressHydrationWarning
                        style={linkStyle}
                    >
                        <IoMdMail size={18} className="sm:flex-shrink-0 sm:text-gray-600 sm:transition-transform sm:duration-200 sm:group-hover:scale-110 sm:dark:text-gray-300" />
                        <span className="hidden text-sm font-medium text-black/80 transition-colors duration-200 group-hover:text-[#006FEE] dark:text-white/80 sm:inline">
                            Mail
                        </span>
                    </a>
                )}

                {socialLinks.resume && (
                    <a
                        className={linkClassName}
                        href={socialLinks.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        suppressHydrationWarning
                        style={linkStyle}
                    >
                        <FaPaperclip size={18} className="sm:flex-shrink-0 sm:text-gray-600 sm:transition-transform sm:duration-200 sm:group-hover:scale-110 sm:dark:text-gray-300" />
                        <span className="hidden text-sm font-medium text-black/80 transition-colors duration-200 group-hover:text-[#006FEE] dark:text-white/80 sm:inline">
                            Resume
                        </span>
                    </a>
                )}
            </div>
        </div>
    );
}
