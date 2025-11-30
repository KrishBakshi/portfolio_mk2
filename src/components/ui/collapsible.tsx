"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { ChevronsDownUpIconHandle } from "../animated-icons/chevrons-down-up-icon";
import { ChevronsDownUpIcon } from "../animated-icons/chevrons-down-up-icon";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
      className
    )}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Content>
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

type CollapsibleContextType = {
    open: boolean;
};

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

const useCollapsible = () => {
    const context = useContext(CollapsibleContext);

    if (!context) {
        throw new Error(
            "Collapsible components must be used within a CollapsibleWithContext"
        );
    }

    return context;
};

function CollapsibleWithContext({
    defaultOpen,
    ...props
}: React.ComponentProps<typeof Collapsible>) {
    const [open, setOpen] = useState(defaultOpen ?? false);

    return (
        <CollapsibleContext.Provider value={{ open }}>
            <Collapsible open={open} onOpenChange={setOpen} {...props} />
        </CollapsibleContext.Provider>
    );
}

function CollapsibleChevronsIcon() {
    const { open } = useCollapsible();

    const ref = useRef<ChevronsDownUpIconHandle>(null);

    useEffect(() => {
        const controls = ref.current;
        if (!controls) return;

        if (open) {
            controls.startAnimation();
        } else {
            controls.stopAnimation();
        }
    }, [open]);

    return <ChevronsDownUpIcon ref={ref} />;
}

export {
    Collapsible,
    CollapsibleChevronsIcon,
    CollapsibleContent,
    CollapsibleTrigger,
    CollapsibleWithContext,
};
