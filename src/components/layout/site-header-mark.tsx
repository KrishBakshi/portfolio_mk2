import Link from "next/link";

export function SiteHeaderMark() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="text-sm font-medium text-foreground"
    >
      Home
    </Link>
  );
}

