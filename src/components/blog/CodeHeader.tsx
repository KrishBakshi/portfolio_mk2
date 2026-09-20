import { CopyButton } from "@/components/blog/CopyButton";

/** Slim bar above a code block: language on the left, copy on the right. */
export function CodeHeader({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="flex min-h-10 items-center gap-2 border-b border-border px-3 py-1">
      <span className="font-mono text-xs text-muted-foreground">{lang}</span>
      <CopyButton className="ms-auto" text={code} />
    </div>
  );
}
