"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
    href: string;
    label?: string;
}

export function BackButton({ href, label = "Back" }: BackButtonProps) {
    return (
        <Button variant="ghost" asChild className="group pl-0 hover:bg-transparent">
            <Link href={href} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <span>{label}</span>
            </Link>
        </Button>
    );
}
