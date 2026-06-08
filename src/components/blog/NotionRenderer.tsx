import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import { cn } from '@/lib/utils';
import { CopyButton } from './CopyButton';
import { BlogConfigDropdown } from './BlogConfigDropdown';
import { BlogInstallToggle } from './BlogInstallToggle';
import { BlogPlatformToggle } from './BlogPlatformToggle';
import { Code, Heading, Prose } from '@/components/ui/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { splitBlogContentWithDropdowns } from '@/lib/blog-dropdown';

interface NotionRendererProps {
    content: string;
    className?: string;
}

function decodeImageSrc(src?: string) {
    if (!src) return "";

    try {
        return decodeURIComponent(src);
    } catch {
        return src;
    }
}

function parseImageSize(src?: string, title?: string | null) {
    let imageSrc = decodeImageSrc(src);
    let width: string | undefined;

    const srcMatch = imageSrc.match(/^(.+?)\s*\|\s*width=([^\s)]+)$/i);
    if (srcMatch) {
        imageSrc = srcMatch[1].trim();
        width = srcMatch[2].trim();
    }

    if (!width && title) {
        const titleMatch = title.match(/^width:\s*(.+)$/i);
        if (titleMatch) {
            width = titleMatch[1].trim();
        }
    }

    return { src: imageSrc, width };
}

const markdownComponents = {
    h1: (props: React.ComponentProps<'h1'>) => <Heading as="h1" className="text-4xl font-bold" {...props} />,
    h2: (props: React.ComponentProps<'h2'>) => <Heading as="h2" className="text-3xl font-semibold" {...props} />,
    h3: (props: React.ComponentProps<'h3'>) => <Heading as="h3" className="text-2xl font-semibold" {...props} />,
    h4: (props: React.ComponentProps<'h4'>) => <Heading as="h4" className="text-xl font-semibold" {...props} />,
    h5: (props: React.ComponentProps<'h5'>) => <Heading as="h5" className="text-lg font-semibold" {...props} />,
    h6: (props: React.ComponentProps<'h6'>) => <Heading as="h6" className="text-base font-semibold" {...props} />,
    table: ({ node, ...props }: { node?: unknown } & React.ComponentProps<'table'>) => <Table {...props} />,
    thead: ({ node, ...props }: { node?: unknown } & React.ComponentProps<'thead'>) => <TableHeader {...props} />,
    tbody: ({ node, ...props }: { node?: unknown } & React.ComponentProps<'tbody'>) => <TableBody {...props} />,
    tr: ({ node, ...props }: { node?: unknown } & React.ComponentProps<'tr'>) => <TableRow {...props} />,
    th: ({ node, ...props }: { node?: unknown } & React.ComponentProps<'th'>) => <TableHead {...props} />,
    td: ({ node, ...props }: { node?: unknown } & React.ComponentProps<'td'>) => <TableCell {...props} />,
    code: ({ children, className, ...props }: React.ComponentProps<'code'> & { children?: React.ReactNode }) => {
        const match = /language-(\w+)/.exec(className || '');
        const isInline = !match;

        if (isInline) {
            return (
                <Code className={className} {...props}>
                    {children}
                </Code>
            );
        }

        return (
            <div className="not-prose blog-code-block my-4">
                <div className="absolute top-2 right-2 z-10">
                    <CopyButton text={String(children).replace(/\n$/, '')} />
                </div>
                <pre>
                    <Code
                        className={cn(
                            "hljs block font-mono text-sm bg-transparent border-0 p-0",
                            className
                        )}
                        data-language={match ? match[1] : "text"}
                        {...props}
                    >
                        {children}
                    </Code>
                </pre>
            </div>
        );
    },
    pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="m-0 p-0 bg-transparent">
            {children}
        </pre>
    ),
    a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
        <a
            href={href}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
    img: ({ src, alt, title, ...props }: React.ComponentProps<'img'>) => {
        const imageSource = typeof src === "string" ? src : undefined;
        const { src: imageSrc, width } = parseImageSize(imageSource, title);

        return (
            <figure
                className={cn("not-prose my-8", width && "mx-auto")}
                style={width ? { width, maxWidth: "100%" } : undefined}
            >
                <div className="overflow-hidden rounded-lg">
                    <img
                        {...props}
                        src={imageSrc}
                        alt={alt || ""}
                        className="block h-auto w-full max-w-full"
                        loading="lazy"
                    />
                </div>
                {alt && (
                    <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                        {alt}
                    </figcaption>
                )}
            </figure>
        );
    },
};

function MarkdownChunk({ content }: { content: string }) {
    if (!content.trim()) return null;

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkUnwrapImages]}
            rehypePlugins={[rehypeHighlight, rehypeSlug]}
            components={markdownComponents}
        >
            {content}
        </ReactMarkdown>
    );
}

export function NotionRenderer({ content, className }: NotionRendererProps) {
    const parts = splitBlogContentWithDropdowns(content);

    return (
        <Prose className={cn("max-w-none prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent", className)}>
            {parts.map((part, index) => {
                if (part.type === "dropdown") {
                    return <BlogConfigDropdown key={`dropdown-${index}`} {...part.dropdown} />;
                }
                if (part.type === "platform") {
                    return <BlogPlatformToggle key={`platform-${index}`} {...part.platform} />;
                }
                if (part.type === "install") {
                    return <BlogInstallToggle key={`install-${index}`} {...part.install} />;
                }
                return <MarkdownChunk key={`markdown-${index}`} content={part.content} />;
            })}
        </Prose>
    );
}
