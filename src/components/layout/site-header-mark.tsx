import Link from "next/link";

export function SiteHeaderMark() {
  return (
    <Link
      href="/"
      aria-label="Krish Bakshi, home"
      className="text-sm font-semibold tracking-tight text-foreground"
    >
      Krish Bakshi
    </Link>
  );
}

