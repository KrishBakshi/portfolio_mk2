/** Main content column (matches max-w-3xl). */
export const CONTENT_MAX_WIDTH = "48rem";

/** Diagonal pattern bleed beyond the content column, each side (desktop). */
export const PATTERN_BLEED = "60px";

/** Smaller pattern bleed on tablet widths. */
export const TABLET_PATTERN_BLEED = "32px";

/** Layout shell including pattern bleed on both sides. */
export const CANVAS_MAX_WIDTH = `calc(${CONTENT_MAX_WIDTH} + 120px)`;

/** Pixel breakpoints — keep in sync with Tailwind arbitrary variants. */
export const MOBILE_MAX_PX = 764;
export const TABLET_MIN_PX = 765;
export const TABLET_MAX_PX = 899;
export const DESKTOP_LAYOUT_MIN_PX = 900;
