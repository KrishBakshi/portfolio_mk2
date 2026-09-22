"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ArrowUpRightIcon,
    MoonIcon,
    SunIcon,
    MonitorIcon,
    SearchIcon,
} from "lucide-react";

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
import {
    COMMAND_SEARCH_GROUP_ORDER,
    getCommandSearchGroupLabel,
    type CommandSearchItem,
} from "@/lib/search-index.types";

type CommandMenuProps = {
    searchItems: CommandSearchItem[];
};

export function CommandMenu({ searchItems }: CommandMenuProps) {
    const router = useRouter();
    const { setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const groupedItems = useMemo(
        () =>
            COMMAND_SEARCH_GROUP_ORDER.map((group) => ({
                group,
                label: getCommandSearchGroupLabel(group),
                items: searchItems.filter((item) => item.group === group),
            })).filter((section) => section.items.length > 0),
        [searchItems]
    );

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

    const handleSelect = useCallback(
        (item: CommandSearchItem) => {
            setOpen(false);

            const isExternal =
                item.external ||
                item.href.startsWith("http") ||
                item.href.startsWith("mailto:");

            if (isExternal) {
                if (item.href.startsWith("mailto:")) {
                    window.location.href = item.href;
                } else {
                    window.open(item.href, "_blank", "noopener,noreferrer");
                }
                return;
            }

            router.push(item.href);
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
                variant="ghost"
                size="icon"
                aria-label="Search portfolio"
                className="gap-1.5 text-muted-foreground hover:text-foreground min-[900px]:w-auto min-[900px]:px-2.5"
                onClick={() => setOpen(true)}
            >
                <SearchIcon className="h-4 w-4" aria-hidden />
                <span className="hidden font-mono text-[11px] min-[900px]:inline">⌘K</span>
            </Button>

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                title="Search portfolio"
                description="Search pages, projects, blog posts, experience, and links."
            >
                <CommandInput placeholder="Search projects, posts, companies, roles..." />

                <CommandList className="min-h-80 max-h-[min(28rem,70vh)]">
                    <CommandEmpty>No results found.</CommandEmpty>

                    {groupedItems.map((section, index) => (
                        <React.Fragment key={section.group}>
                            {index > 0 && <CommandSeparator />}
                            <CommandGroup heading={section.label}>
                                {section.items.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.title}
                                        keywords={[
                                            item.subtitle,
                                            ...(item.keywords ?? []),
                                        ].filter(
                                            (keyword): keyword is string =>
                                                Boolean(keyword)
                                        )}
                                        onSelect={() => handleSelect(item)}
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <span className="truncate">
                                                {item.title}
                                            </span>
                                            {item.subtitle ? (
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {item.subtitle}
                                                </span>
                                            ) : null}
                                        </div>
                                        {item.external ||
                                        item.href.startsWith("http") ||
                                        item.href.startsWith("mailto:") ? (
                                            <ArrowUpRightIcon className="ml-auto size-3.5 shrink-0 opacity-50" />
                                        ) : null}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </React.Fragment>
                    ))}

                    <CommandSeparator />

                    <CommandGroup heading="Theme">
                        <CommandItem
                            keywords={["theme", "appearance", "light"]}
                            onSelect={() => handleThemeChange("light")}
                        >
                            <SunIcon className="h-4 w-4" />
                            Light
                        </CommandItem>
                        <CommandItem
                            keywords={["theme", "appearance", "dark"]}
                            onSelect={() => handleThemeChange("dark")}
                        >
                            <MoonIcon className="h-4 w-4" />
                            Dark
                        </CommandItem>
                        <CommandItem
                            keywords={["theme", "appearance", "system"]}
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
