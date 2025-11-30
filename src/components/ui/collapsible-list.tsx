import { ChevronDownIcon } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function CollapsibleList<T>({
  items,
  max = 3,
  keyExtractor,
  renderItem,
  listClassName = "flex flex-col",
  showToggle = true,
}: {
  items: T[];
  max?: number;
  keyExtractor?: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  listClassName?: string;
  showToggle?: boolean;
}) {
  // If items count is less than or equal to max, just render them all without collapsible wrapper logic
  if (items.length <= max) {
    return (
      <div className={listClassName}>
         {items.map((item, index) => (
            <Slot
              key={typeof keyExtractor === "function" ? keyExtractor(item) : index}
            >
              {renderItem(item)}
            </Slot>
          ))}
      </div>
    );
  }

  // If showToggle is false, show all items without collapsible
  if (!showToggle) {
    return (
      <div className={listClassName}>
        {items.map((item, index) => (
          <Slot
            key={typeof keyExtractor === "function" ? keyExtractor(item) : index}
          >
            {renderItem(item)}
          </Slot>
        ))}
      </div>
    );
  }

  return (
    <Collapsible>
      <div className={listClassName}>
        {items.slice(0, max).map((item, index) => (
            <Slot
            key={typeof keyExtractor === "function" ? keyExtractor(item) : index}
            >
            {renderItem(item)}
            </Slot>
        ))}

        <CollapsibleContent className={listClassName === "flex flex-col" ? "" : "col-span-full"}>
            <div className={listClassName}>
                {items.slice(max).map((item, index) => (
                <Slot
                    key={
                    typeof keyExtractor === "function"
                        ? keyExtractor(item)
                        : max + index
                    }
                >
                    {renderItem(item)}
                </Slot>
                ))}
            </div>
        </CollapsibleContent>
      </div>

      <div className="flex h-12 items-center justify-center pt-4">
        <CollapsibleTrigger asChild>
          <Button
            className="group/collapsible-trigger flex"
            variant="outline"
          >
            <span className="hidden group-data-[state=closed]/collapsible-trigger:block">
              Show More
            </span>

            <span className="hidden group-data-[state=open]/collapsible-trigger:block">
              Show Less
            </span>

            <ChevronDownIcon
              className="ml-2 size-4 transition-transform group-data-[state=open]/collapsible-trigger:rotate-180"
              aria-hidden
            />
          </Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
}

