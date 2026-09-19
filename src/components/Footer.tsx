import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex flex-col gap-4 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>© {new Date().getFullYear()} Krish Bakshi</p>
            <div className="flex items-center gap-4">
                <Link href="/rss.xml" className="font-mono hover:text-foreground">RSS</Link>
                <Link href="/llms.txt" className="font-mono hover:text-foreground">llms.txt</Link>
                <a href="/resume.pdf" className="font-mono hover:text-foreground">Resume</a>
            </div>
        </footer>
    )
}
