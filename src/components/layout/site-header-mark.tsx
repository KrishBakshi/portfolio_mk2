import { HomeIcon } from "lucide-react";
import Link from "next/link";

export function SiteHeaderMark() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="-ml-[9px] grid size-9 place-items-center rounded-md text-foreground transition-colors hover:text-muted-foreground"
    >
      <HomeIcon className="size-[18px]" />
    </Link>
  );
}
