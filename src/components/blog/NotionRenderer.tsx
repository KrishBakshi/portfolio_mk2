import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import { cn } from '@/lib/utils';
import { CopyButton } from './CopyButton';
import { Code, Heading, Prose } from '@/components/ui/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import 'highlight.js/styles/github-dark.css';

interface NotionRendererProps {
    content: string;
    className?: string;
}

export function NotionRenderer({ content, className }: NotionRendererProps) {
    return (
        <Prose className={cn("max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkUnwrapImages]}
                rehypePlugins={[
                    rehypeHighlight,
                    rehypeSlug,
                ]}
                components={{
                    // Headings
                    h1: (props) => <Heading as="h1" className="text-4xl font-bold" {...props} />,
                    h2: (props) => <Heading as="h2" className="text-3xl font-semibold" {...props} />,
                    h3: (props) => <Heading as="h3" className="text-2xl font-semibold" {...props} />,
                    h4: (props) => <Heading as="h4" className="text-xl font-semibold" {...props} />,
                    h5: (props) => <Heading as="h5" className="text-lg font-semibold" {...props} />,
                    h6: (props) => <Heading as="h6" className="text-base font-semibold" {...props} />,

                    // Tables
                    table: ({ node, ...props }) => <Table {...props} />,
                    thead: ({ node, ...props }) => <TableHeader {...props} />,
                    tbody: ({ node, ...props }) => <TableBody {...props} />,
                    tr: ({ node, ...props }) => <TableRow {...props} />,
                    th: ({ node, ...props }) => <TableHead {...props} />,
                    td: ({ node, ...props }) => <TableCell {...props} />,

                    // Code
                    code: ({ children, className, ...props }) => {
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
                            <div className="relative my-2 overflow-hidden bg-code text-code-foreground">
                                <div className="absolute top-2 right-2 z-10">
                                    <CopyButton text={String(children).replace(/\n$/, '')} />
                                </div>
                                <div className="overflow-x-auto">
                                    <Code className={cn("font-mono text-sm bg-transparent border-0 p-0 block border border-gray-300/50 dark:border-white/10", className)} data-language={match ? match[1] : 'text'} {...props}>
                                        {children}
                                    </Code>
                                </div>
                            </div>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="m-0 p-0 bg-transparent">
                            {children}
                        </pre>
                    ),

                    // Links
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            {children}
                        </a>
                    ),

                    // Images
                    img: ({ src, alt }) => (
                        <figure className="mt-8 mb-8">
                            <div className="relative rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={src}
                                    alt={alt || ''}
                                    className="w-full h-auto object-cover block"
                                    loading="lazy"
                                />
                            </div>
                            {alt && (
                                <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                                    {alt}
                                </figcaption>
                            )}
                        </figure>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </Prose>
    );
}
