"use client";

import { useEffect, useRef, useState } from "react";

/** Counts below this stay hidden, so a brand-new page doesn't show "2 views". */
const MIN_VIEWS_SHOWN = 1;

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

const today = () => new Date().toISOString().slice(0, 10);

/**
 * "/ 1.2k views" for the meta line. Makes no request if this browser already
 * counted the page today; otherwise exactly one.
 */
export function ViewCount({ kind, slug }: { kind: "blog" | "project"; slug: string }) {
  const [views, setViews] = useState<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const key = `views:${kind}:${slug}`;
    try {
      const cached = JSON.parse(localStorage.getItem(key) ?? "null") as { d: string; n: number } | null;
      if (cached?.d === today()) {
        Promise.resolve(cached.n).then(setViews);
        return;
      }
    } catch {}

    fetch(`/api/views/${kind}/${slug}`, { method: "POST" })
      .then((res) => (res.ok && res.status !== 204 ? res.json() : null))
      .then((data: { views: number } | null) => {
        if (!data) return;
        setViews(data.views);
        try {
          localStorage.setItem(key, JSON.stringify({ d: today(), n: data.views }));
        } catch {}
      })
      .catch(() => {});
  }, [kind, slug]);

  if (views === null || views < MIN_VIEWS_SHOWN) return null;

  return (
    <>
      <span aria-hidden>/</span>
      <span>{compact.format(views)} {views === 1 ? "view" : "views"}</span>
    </>
  );
}
