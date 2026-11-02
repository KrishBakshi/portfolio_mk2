import Link from "next/link";

import { cn, textLink } from "@/lib/utils";

const footerLink = cn("font-mono hover:text-foreground", textLink);

export default function Footer() {
    return (
        <footer data-mew-perch="inside" data-mew-hide="top" className="flex flex-col gap-4 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>© {new Date().getFullYear()} Krish Bakshi</p>
            <div className="flex items-center gap-4">
                <Link href="/rss.xml" className={footerLink}>RSS</Link>
                <Link href="/llms.txt" className={footerLink}>llms.txt</Link>
                <a href="/resume.pdf" className={footerLink}>Resume</a>
            </div>
        </footer>
    )
}
