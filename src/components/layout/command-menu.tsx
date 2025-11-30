"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
import { MoonIcon, SunIcon, MonitorIcon, SearchIcon } from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CommandLinkItem = {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    keywords?: string[];
};

const MENU_LINKS: CommandLinkItem[] = [
    {
        title: "Work",
        href: "/work",
    },
    {
        title: "Projects",
        href: "/projects",
    },
    {
        title: "Blog",
        href: "/blog",
    },
];

export function CommandMenu() {
    const router = useRouter();
    const { setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return;
                }

                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleOpenLink = useCallback(
        (href: string) => {
            setOpen(false);
            router.push(href);
        },
        [router]
    );

    const handleThemeChange = useCallback(
        (theme: "light" | "dark" | "system") => {
            setOpen(false);
            setTheme(theme);
        },
        [setTheme]
    );

    return (
        <>
            <Button
                variant="secondary"
                className="h-8 gap-1.5 rounded-full border border-input bg-white px-2.5 text-muted-foreground shadow-sm select-none hover:bg-white dark:bg-input/30 dark:hover:bg-input/30"
                onClick={() => setOpen(true)}
            >
                <SearchIcon className="h-4 w-4" aria-hidden />

                <span className="font-sans text-sm/4 font-medium sm:hidden">
                    Search
                </span>

                <div className="hidden gap-1 sm:flex">
                    <kbd className="pointer-events-none flex h-5 min-w-5 items-center justify-center rounded-sm bg-black/5 px-1 font-sans text-[11px] font-medium text-muted-foreground shadow-[inset_0_-1px_1px] shadow-black/10 select-none dark:bg-white/10 dark:shadow-white/10">
                        ⌘
                    </kbd>
                    <kbd className="pointer-events-none flex h-5 min-w-5 items-center justify-center rounded-sm bg-black/5 px-1 font-sans text-[11px] font-medium text-muted-foreground shadow-[inset_0_-1px_1px] shadow-black/10 select-none dark:bg-white/10 dark:shadow-white/10">
                        K
                    </kbd>
                </div>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />

                <CommandList className="min-h-80">
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Navigation">
                        {MENU_LINKS.map((link) => (
                            <CommandItem
                                key={link.href}
                                keywords={link.keywords}
                                onSelect={() => handleOpenLink(link.href)}
                            >
                                {link.icon && <link.icon className="h-4 w-4" />}
                                {link.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Theme">
                        <CommandItem
                            keywords={["theme"]}
                            onSelect={() => handleThemeChange("light")}
                        >
                            <SunIcon className="h-4 w-4" />
                            Light
                        </CommandItem>
                        <CommandItem
                            keywords={["theme"]}
                            onSelect={() => handleThemeChange("dark")}
                        >
                            <MoonIcon className="h-4 w-4" />
                            Dark
                        </CommandItem>
                        <CommandItem
                            keywords={["theme"]}
                            onSelect={() => handleThemeChange("system")}
                        >
                            <MonitorIcon className="h-4 w-4" />
                            System
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
