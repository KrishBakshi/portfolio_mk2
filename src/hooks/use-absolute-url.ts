import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

/**
 * A site-relative URL ("/blog/x") made absolute with the current origin. On the server
 * (and during hydration) it's the URL as given, then the full one in the browser.
 */
export function useAbsoluteUrl(url: string): string {
  return useSyncExternalStore(
    subscribeNever,
    () => new URL(url, window.location.origin).toString(),
    () => url
  );
}
