"use client";

interface AboutProps {
    content?: string;
}

export default function About({
    content = "I'm a passionate software engineer and builder who loves creating elegant solutions to complex problems. With a focus on modern web technologies and user experience, I strive to build products that make a difference."
}: AboutProps) {
    return (
        <section className="bg-background px-4 sm:py-4">
            <header className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight font-sans">About</h2>
            </header>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed text-foreground font-mono text-justify">
                    {content}
                </p>
            </div>
        </section>
    );
}
