'use client'
import { FaLinkedin, FaXTwitter, FaGithub, FaPaperclip } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

interface LetsConnectProps {
    title?: string
    subtitle?: string
    socialLinks?: {
        twitter?: string
        resume?: string
        github?: string
        linkedin?: string
        mail?: string
    }
}

const linkClassName =
    "flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 hover:opacity-80 transition-all duration-200 group p-3 sm:px-3 sm:py-3 lg:p-0 rounded-full sm:rounded-lg bg-gray-100/80 dark:bg-[hsl(0,3%,6.5%)] sm:bg-gray-50/50 sm:dark:bg-gray-800/30 lg:bg-transparent lg:dark:bg-transparent border border-gray-200/60 dark:border-gray-700/60 sm:border-gray-200/50 sm:dark:border-gray-700/50 lg:border-none hover:bg-gray-200/80 dark:hover:bg-gray-700/70 sm:hover:bg-gray-100/50 sm:dark:hover:bg-gray-700/40 lg:hover:bg-transparent lg:dark:hover:bg-transparent";

const linkStyle = {
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
} as const;

export default function LetsConnect({
    title = "Let's connect",
    subtitle = "Find me on these platforms",
    socialLinks = {
        twitter: "https://x.com/KrishBakshi_",
        github: "https://github.com/KrishBakshi",
        linkedin: "https://linkedin.com/in/krish-bakshi-8b85b6314/",
        resume: "/resume.pdf",
        mail: "mailto:business.krishb@gmail.com"
    }
}: LetsConnectProps) {
    return (
        <div className="sm:px-8 px-4 pb-8">
            <div className="text-left w-full">
                <div className="mb-4 sm:mb-6">
                    <h2 className="font-[family-name:var(--font-instrument-serif)] text-lg sm:text-xl mb-2 opacity-50 mt-4 sm:mt-6">
                        {title}
                    </h2>
                    <p className="opacity-50 text-md sm:text-lg mb-3 sm:mb-4">
                        {subtitle}
                    </p>
                </div>

                <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-0 sm:grid sm:grid-cols-2 lg:flex lg:justify-start sm:gap-4 lg:gap-6 lg:space-x-0">
                    {socialLinks.github && (
                        <a
                            className={linkClassName}
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            suppressHydrationWarning
                            style={linkStyle}
                        >
                            <FaGithub size={20} className="sm:size-[18px] group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-gray-700 dark:text-gray-200 sm:text-gray-600 sm:dark:text-gray-300" />
                            <span className="hidden sm:inline text-sm font-medium dark:text-white/80 text-black/80 group-hover:text-[#006FEE] transition-colors duration-200">
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
                            <FaXTwitter size={20} className="sm:size-[18px] group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-gray-700 dark:text-gray-200 sm:text-gray-600 sm:dark:text-gray-300" />
                            <span className="hidden sm:inline text-sm font-medium dark:text-white/80 text-black/80 group-hover:text-[#006FEE] transition-colors duration-200">
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
                            <FaLinkedin size={20} className="sm:size-[18px] group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-gray-700 dark:text-gray-200 sm:text-gray-600 sm:dark:text-gray-300" />
                            <span className="hidden sm:inline text-sm font-medium dark:text-white/80 text-black/80 group-hover:text-[#006FEE] transition-colors duration-200">
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
                            <IoMdMail size={20} className="sm:size-[18px] group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-gray-700 dark:text-gray-200 sm:text-gray-600 sm:dark:text-gray-300" />
                            <span className="hidden sm:inline text-sm font-medium dark:text-white/80 text-black/80 group-hover:text-[#006FEE] transition-colors duration-200">
                                Mail
                            </span>
                        </a>
                    )}

                    {socialLinks.resume && (
                        <a
                            className={`${linkClassName} flex-shrink-0 touch-manipulation`}
                            href={socialLinks.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            suppressHydrationWarning
                            style={linkStyle}
                        >
                            <FaPaperclip size={24} className="group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-gray-700 dark:text-gray-200 sm:text-gray-600 sm:dark:text-gray-300" />
                            <span className="hidden sm:inline text-sm font-medium dark:text-white/80 text-black/80 group-hover:text-[#006FEE] transition-colors duration-200">
                                Resume
                            </span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
