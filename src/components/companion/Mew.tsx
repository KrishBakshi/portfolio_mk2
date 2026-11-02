"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/*
 * Mew lives on the site but does not follow you. It turns up beside the end of the
 * intro, then does what it likes: floats or tumbles around, teleports with a poof
 * (sometimes onto a section heading or the footer), plays, naps in a bubble, fades
 * out and comes back later. If you scroll away it stays put, then a moment after you
 * stop it may poof onto your screen again. Its starting spot by the intro is its home:
 * a golden cloud cushion that appears first and always stays, with a hand-drawn
 * "say hi to Mew (if you find him)" pointing at it. It sometimes goes back there. Now and then it hides behind the profile
 * picture or the GitHub heatmap and peeks out from an edge (upright, upside down or
 * sideways), or from the top of a heading, a row, a section's side, an image or the
 * footer. Peeking only ever happens there, never out in the open. Flick it and it
 * reacts at random: usually it just giggles or settles,
 * sometimes it somersaults off, and only now and then it oofs away or runs for it. Hovering
 * makes it curious and clicking startles it, but where it goes is always its own choice.
 */

// Frame order in /sprites/mew.png (5 columns x 3 rows), built by scripts/sprite-sheet.mjs.
const POSES = {
  idle: 0,
  giggle: 1,
  somersault: 2,
  bounce: 3,
  sleep: 4,
  fade: 5,
  peek: 6,
  curious: 7,
  startled: 8,
  sad: 9,
  aura: 10,
  chaseTail: 11,
  wave: 12,
  sparkle: 13,
  yawn: 14,
} as const;
type Pose = keyof typeof POSES;

const SHEET_COLS = 5;
const SHEET_ROWS = 3;
const FRAME_RATIO = 201 / 192; // frame height / width
const ANCHOR_ID = "profile-links"; // the last row of the intro on the home page
const CONTENT_WIDTH = 672; // max-w-2xl: Mew prefers the empty space either side of it
const HEADER_HEIGHT = 56;
const HOME_LIFT = 14; // raises the home spot by the intro so the cloud clears the section below
const PUFF_MS = 650;
const NOTE_WIDTH = 196; // the hand-drawn "say hi to Mew" note beside its first perch

type Spot = { x: number; y: number };
type Side = "top" | "bottom" | "left" | "right";
/** A hiding place: which edge of which element Mew peeks out of, and from where. */
type Hide = { side: Side; line: number; hidden: Spot; peek: Spot; rotate: number };
type Puff = { id: number; x: number; y: number };

// What Mew does when left to itself, with weights.
const PASTIMES: [Pose, number, [number, number]][] = [
  ["idle", 5, [3000, 6000]],
  ["curious", 1, [1800, 3000]],
  ["wave", 1, [1600, 2400]],
  ["sparkle", 1.2, [2400, 4000]],
  ["chaseTail", 1, [1800, 3000]],
  ["giggle", 0.8, [1600, 2600]],
  ["bounce", 1, [2400, 4000]],
  ["aura", 0.5, [2000, 3200]],
  ["yawn", 0.4, [1400, 1800]],
];

const CANCELLED = Symbol("cancelled");

const random = (min: number, max: number) => min + Math.random() * (max - min);
function pick<T>(items: [T, number, ...unknown[]][]): [T, number, ...unknown[]] {
  let roll = Math.random() * items.reduce((sum, item) => sum + item[1], 0);
  for (const item of items) {
    roll -= item[1];
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

const subscribeNever = () => () => {};

export function Mew() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);
  const [puffs, setPuffs] = useState<Puff[]>([]);
  // The hand-drawn note: put up on every visit to a page with a home, then it stays,
  // pointing at that spot whether Mew is there or not. `noted`: it's up on this page.
  const [note, setNote] = useState<Spot | null>(null);
  const noted = useRef(false);
  // The cloud and note animate in only the first time; coming back to the page later,
  // they're simply there. The ref is for Mew's plans, the state for rendering.
  const introducedRef = useRef(false);
  const [introduced, setIntroduced] = useState(false);
  // Home: the intro perch on this page (null on pages without one).
  const homeRef = useRef<Spot | null>(null);
  const [home, setHome] = useState<Spot | null>(null);

  const puffId = useRef(0);
  const [pose, setPose] = useState<Pose>("idle");
  const [flipped, setFlipped] = useState(false);
  const [present, setPresent] = useState(false);
  const [size, setSize] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 52 : 72));

  // Hiding: Mew is cut off along an element's edge so it looks tucked behind it.
  const hidingRef = useRef<Hide | null>(null);
  const clip = useMotionValue("none");
  const updateClip = useCallback(() => {
    const h = hidingRef.current;
    if (!h) return clip.set("none");
    const w = size;
    const ht = size * FRAME_RATIO;
    const xv = x.get();
    const yv = y.get();
    const cut = { top: 0, right: 0, bottom: 0, left: 0 };
    // Keep only the part of Mew's box on the outer side of the edge.
    if (h.side === "top") cut.bottom = Math.max(0, yv + ht - h.line);
    if (h.side === "bottom") cut.top = Math.max(0, h.line - yv);
    if (h.side === "left") cut.right = Math.max(0, xv + w - h.line);
    if (h.side === "right") cut.left = Math.max(0, h.line - xv);
    clip.set(`inset(${cut.top}px ${cut.right}px ${cut.bottom}px ${cut.left}px)`);
  }, [clip, size, x, y]);
  useEffect(() => {
    const offX = x.on("change", updateClip);
    const offY = y.on("change", updateClip);
    return () => {
      offX();
      offY();
    };
  }, [x, y, updateClip]);

  // Each new plan bumps the token; anything still running from an older plan stops.
  const token = useRef(0);
  const flights = useRef<AnimationPlaybackControls[]>([]);
  const asleep = useRef(false);
  // Mew sleeps in its cloud from the first visit until someone clicks it awake.
  const woken = useRef(false);
  const shown = useRef(false);
  const arrivedAt = useRef(0);
  const hiddenAt = useRef<number | null>(null);
  const reacting = useRef(false);
  // True from page load until Mew has made its entrance on that page.
  const arrivalPending = useRef(false);

  const stopFlights = useCallback(() => {
    flights.current.forEach((flight) => flight.stop());
    flights.current = [];
    scale.set(1);
    // Interrupted mid-roll: finish turning upright the short way round.
    const angle = ((rotate.get() % 360) + 360) % 360;
    if (angle !== 0 && !hidingRef.current) {
      rotate.set(angle);
      animate(rotate, angle > 180 ? 360 : 0, { duration: 0.25, ease: "easeOut" }).then(() => rotate.set(0));
    }
  }, [rotate, scale]);

  /** Cancels whatever Mew is doing (every running plan checks its token). */
  const invalidate = useCallback(() => {
    token.current++;
  }, []);

  const wait = useCallback(async (ms: number, own: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    if (own !== token.current) throw CANCELLED;
  }, []);

  const fly = useCallback(
    async (own: number, to: Record<string, number | number[]>, duration: number, ease: "easeInOut" | "easeOut" | "easeIn" = "easeInOut") => {
      const values = { x, y, opacity, rotate, scale };
      const runs = Object.entries(to).map(([key, target]) => {
        const controls = animate(values[key as keyof typeof values], target as number, { duration, ease });
        flights.current.push(controls);
        return controls;
      });
      await Promise.all(runs.map((run) => run.finished));
      if (own !== token.current) throw CANCELLED;
    },
    [x, y, opacity, rotate, scale]
  );

  /** A spot in the current viewport, in page coordinates, preferring the side gutters. */
  const somewhere = useCallback(() => {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const gutter = (vw - CONTENT_WIDTH) / 2;
    let left: number;
    if (gutter >= size + 32) {
      // The left margin holds the side nav when it's showing; leave that to the links.
      const sideNav = document.getElementById("side-nav");
      const leftTaken = sideNav !== null && getComputedStyle(sideNav).display !== "none";
      const inLeft = !leftTaken && Math.random() < 0.5;
      left = inLeft ? random(16, gutter - size - 16) : random(vw - gutter + 16, vw - size - 16);
    } else {
      // Narrow screens: keep to the edges so Mew rarely sits on top of text.
      const band = Math.max(size, vw * 0.18);
      left = Math.random() < 0.5 ? random(4, band - size + 4) : random(vw - band - 4, vw - size - 4);
    }
    const top = window.scrollY + random(HEADER_HEIGHT + 24, Math.max(HEADER_HEIGHT + 32, vh - size * FRAME_RATIO - 24));
    return { x: left, y: top };
  }, [size]);

  /**
   * Somewhere to land on the current screen: half the time a landmark that's in view
   * (beside a section heading, or sitting on the footer), otherwise anywhere free.
   */
  const landing = useCallback((): Spot => {
    const height = size * FRAME_RATIO;
    const top = window.scrollY + HEADER_HEIGHT + 8;
    const bottom = window.scrollY + window.innerHeight - 8;
    const vw = document.documentElement.clientWidth;
    const fits = (spot: Spot) => spot.y >= top && spot.y + height <= bottom && spot.x >= 4 && spot.x + size <= vw - 4;

    const perches = [...document.querySelectorAll<HTMLElement>("[data-mew-perch]")]
      .map((el): Spot => {
        const rect = el.getBoundingClientRect();
        if (el.dataset.mewPerch === "inside") {
          // Standing in the middle of the element, feet on its bottom edge (the footer).
          return { x: rect.left + window.scrollX + rect.width / 2 - size / 2, y: rect.bottom + window.scrollY - height - 2 };
        }
        // Just after the element, feet level with its baseline (a section heading).
        return { x: rect.right + window.scrollX + 10, y: rect.bottom + window.scrollY - height * 0.92 };
      })
      .filter(fits);

    if (perches.length > 0 && Math.random() < 0.5) return perches[Math.floor(Math.random() * perches.length)];
    return somewhere();
  }, [size, somewhere]);

  /** Beside the end of the intro, if this page has one. */
  const perch = useCallback(() => {
    const anchor = document.getElementById(ANCHOR_ID);
    if (!anchor) return null;
    const height = size * FRAME_RATIO;
    // Phones: the links row is full, so Mew sits in the gap left of the profile photo.
    const photo = window.innerWidth < 640 ? anchor.closest("header")?.querySelector("img")?.parentElement : null;
    if (photo) {
      const rect = photo.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX - size - 8,
        y: rect.top + window.scrollY + rect.height / 2 - height / 2,
      };
    }
    const rect = anchor.getBoundingClientRect();
    return {
      x: rect.right + window.scrollX - size,
      y: rect.top + window.scrollY + rect.height / 2 - height * 0.7 - HOME_LIFT,
    };
  }, [size]);

  const appear = useCallback(
    async (own: number, at: { x: number; y: number }, greeting: Pose, opts: { fadeIn?: Pose; hold?: number } = {}) => {
      stopFlights();
      x.set(at.x);
      y.set(at.y);
      setFlipped(false);
      setPose(opts.fadeIn ?? "fade");
      shown.current = true;
      setPresent(true);
      arrivalPending.current = false;
      arrivedAt.current = Date.now();
      await fly(own, { opacity: 1 }, 1.2, "easeOut");
      setPose(greeting);
      await wait(opts.hold ?? random(1600, 2400), own);
      setPose("idle");
    },
    [fly, stopFlights, wait, x, y]
  );

  const vanish = useCallback(
    async (own: number) => {
      setFlipped(false);
      setPose("fade");
      await fly(own, { opacity: 0 }, 1.2, "easeOut");
      shown.current = false;
      setPresent(false);
    },
    [fly]
  );

  const puff = useCallback(
    (at: Spot) => {
      const id = ++puffId.current;
      setPuffs((all) => [...all, { id, x: at.x + size / 2, y: at.y + (size * FRAME_RATIO) / 2 }]);
      setTimeout(() => setPuffs((all) => all.filter((p) => p.id !== id)), PUFF_MS);
    },
    [size]
  );

  /** Poof out, poof in somewhere else. */
  const teleport = useCallback(
    async (own: number, to: Spot) => {
      setFlipped(false);
      if (shown.current && opacity.get() > 0.1) {
        puff({ x: x.get(), y: y.get() });
        await fly(own, { scale: 0.2, opacity: 0 }, 0.18, "easeOut");
      }
      shown.current = false;
      setPresent(false);
      await wait(random(250, 700), own);

      x.set(to.x);
      y.set(to.y);
      scale.set(0.3);
      setPose(Math.random() < 0.3 ? "sparkle" : "idle");
      puff(to);
      shown.current = true;
      setPresent(true);
      await fly(own, { scale: [0.3, 1.15, 1], opacity: 1 }, 0.35, "easeOut");

      // (No peek here: peeking only happens from behind a hiding place.)
      const greeting = pick<Pose>([["wave", 3], ["curious", 2], ["giggle", 1], ["idle", 2]])[0];
      setPose(greeting);
      await wait(random(1400, 2200), own);
      setPose("idle");
    },
    [fly, opacity, puff, scale, wait, x, y]
  );

  /**
   * Curl up, leap and roll: whole turns in the direction of travel, peaking mid-arc.
   * With no destination it flips on the spot.
   */
  const somersault = useCallback(
    async (own: number, to?: { x: number; y: number }, opts: { crouch?: boolean; lift?: number } = {}) => {
      const from = { x: x.get(), y: y.get() };
      const target = to ?? from;
      const distance = Math.hypot(target.x - from.x, target.y - from.y);
      const direction = target.x < from.x ? -1 : 1;
      const turns = Math.max(1, Math.round(distance / 200));
      const duration = Math.min(1.9, Math.max(0.9, 0.6 + distance / 400));
      const lift = opts.lift ?? Math.max(56, distance * 0.3);
      // Spin on from whatever angle it's at (sideways when leaving a hiding place) and
      // finish on a whole turn, so it always lands upright.
      const start = rotate.get() % 360;
      const end = Math.round((start + 360 * turns * direction) / 360) * 360;

      setFlipped(false);
      if (opts.crouch !== false) {
        setPose("curious"); // a quick crouch before take-off
        await wait(250, own);
      }
      setPose("somersault");
      rotate.set(start);
      await fly(
        own,
        {
          x: [from.x, (from.x + target.x) / 2, target.x],
          y: [from.y, Math.min(from.y, target.y) - lift, target.y],
          rotate: end,
        },
        duration
      );
      rotate.set(0);
      setPose("idle");
    },
    [fly, rotate, wait, x, y]
  );

  const wander = useCallback(
    async (own: number, target?: Spot) => {
      const from = { x: x.get(), y: y.get() };
      const to = target ?? somewhere();
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      if (distance < 40) return;
      // Shorter trips are sometimes a tumbling leap; otherwise a lazy float with a little arc.
      if (distance < 480 && Math.random() < 0.6) {
        await somersault(own, to);
        return;
      }
      const duration = Math.min(9, Math.max(2.5, distance / 110));
      setPose(Math.random() < 0.25 ? "sparkle" : "idle");
      setFlipped(to.x > from.x);
      const lift = Math.min(80, distance * 0.2);
      await fly(
        own,
        {
          x: [from.x, (from.x + to.x) / 2, to.x],
          y: [from.y, (from.y + to.y) / 2 - lift, to.y],
        },
        duration
      );
      setFlipped(false);
      setPose("idle");
    },
    [fly, somersault, somewhere, x, y]
  );

  /**
   * If the sign isn't up yet when Mew sits on the intro perch, point at it with the hand-drawn
   * note (only if there's room to its right; phones skip it).
   */
  const notePerch = useCallback(() => {
    const spot = perch();
    if (!spot || noted.current || !shown.current) return;
    if (Math.hypot(x.get() - spot.x, y.get() - spot.y) > 8) return;
    const room = document.documentElement.clientWidth - (x.get() + size) - 8;
    if (room < NOTE_WIDTH) return;
    noted.current = true;
    setNote({ x: x.get() + size, y: y.get() });
  }, [perch, size, x, y]);

  /** Stop hiding at once: Mew is gone (it was mostly out of sight anyway). */
  const endHide = useCallback(() => {
    if (!hidingRef.current) return;
    hidingRef.current = null;
    opacity.set(0);
    rotate.set(0);
    shown.current = false;
    setPresent(false);
    updateClip();
  }, [opacity, rotate, updateClip]);

  /**
   * A hiding place in view. Elements marked data-mew-hide (headings, rows, sections, the
   * profile picture, the heatmap, images, the footer) list the edges Mew may peek from;
   * an empty value means all four. The edge and the spot Mew peeks out at must be on
   * screen, and the edge must be long enough to hide Mew along it.
   */
  const hidingPlace = useCallback((): Hide | null => {
    const w = size;
    const h = size * FRAME_RATIO;
    const vw = document.documentElement.clientWidth;
    const top = window.scrollY + (window.innerWidth < 1080 ? HEADER_HEIGHT : 0) + 4;
    const bottom = window.scrollY + window.innerHeight - 4;
    const PEEK = 0.55; // how much of Mew shows when it peeks
    const places: Hide[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("[data-mew-hide]")) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      const R = { left: b.left + window.scrollX, right: b.right + window.scrollX, top: b.top + window.scrollY, bottom: b.bottom + window.scrollY };
      const allowed = (el.dataset.mewHide || "top bottom left right").split(/\s+/);
      // Where along a horizontal edge Mew can be (inside the element and the screen).
      const xMin = Math.max(R.left, 4);
      const xMax = Math.min(R.right, vw - 4) - w;
      // Where along a vertical edge (inside the element and the screen).
      const yMin = Math.max(R.top, top);
      const yMax = Math.min(R.bottom, bottom) - h;
      const cx = random(xMin, xMax);
      const cy = random(yMin, yMax);
      if (allowed.includes("top") && xMax >= xMin && R.top - h * PEEK >= top && R.top <= bottom)
        places.push({ side: "top", line: R.top, hidden: { x: cx, y: R.top }, peek: { x: cx, y: R.top - h * PEEK }, rotate: 0 });
      if (allowed.includes("bottom") && xMax >= xMin && R.bottom + h * PEEK <= bottom && R.bottom >= top)
        places.push({ side: "bottom", line: R.bottom, hidden: { x: cx, y: R.bottom - h }, peek: { x: cx, y: R.bottom - h + h * PEEK }, rotate: 180 });
      if (allowed.includes("left") && yMax >= yMin && R.left - w * PEEK >= 0)
        places.push({ side: "left", line: R.left, hidden: { x: R.left, y: cy }, peek: { x: R.left - w * PEEK, y: cy }, rotate: -90 });
      if (allowed.includes("right") && yMax >= yMin && R.right + w * PEEK <= vw)
        places.push({ side: "right", line: R.right, hidden: { x: R.right - w, y: cy }, peek: { x: R.right - w + w * PEEK, y: cy }, rotate: 90 });
    }
    return places.length ? places[Math.floor(Math.random() * places.length)] : null;
  }, [size]);

  /** Where Mew lands when it somersaults out of a hiding place: just past the edge, on screen. */
  const leapOut = useCallback(
    (place: Hide): Spot => {
      const w = size;
      const h = size * FRAME_RATIO;
      const vw = document.documentElement.clientWidth;
      const top = window.scrollY + (window.innerWidth < 1080 ? HEADER_HEIGHT : 0) + 4;
      const bottom = window.scrollY + window.innerHeight - h - 4;
      const clampX = (v: number) => Math.min(Math.max(v, 4), vw - w - 4);
      const clampY = (v: number) => Math.min(Math.max(v, top), bottom);
      if (place.side === "top") return { x: clampX(place.peek.x + random(-90, 90)), y: clampY(place.line - h - random(30, 70)) };
      if (place.side === "bottom") return { x: clampX(place.peek.x + random(-90, 90)), y: clampY(place.line + random(20, 60)) };
      if (place.side === "left") return { x: clampX(place.line - w - random(40, 110)), y: clampY(place.peek.y + random(-40, 40)) };
      return { x: clampX(place.line + random(40, 110)), y: clampY(place.peek.y + random(-40, 40)) };
    },
    [size]
  );

  /** Poof out, then peek from behind a hiding place (maybe twice), duck back and pop up elsewhere. */
  const hide = useCallback(
    async (own: number, place: Hide) => {
      if (shown.current && opacity.get() > 0.1) {
        puff({ x: x.get(), y: y.get() });
        await fly(own, { scale: 0.2, opacity: 0 }, 0.18, "easeOut");
      }
      shown.current = false;
      setPresent(false);
      await wait(random(300, 800), own);

      // Start fully tucked behind the element (fully cut off), already turned to face out.
      // Hiding is a physical thing, so it only ever uses the sneaky peek pose.
      hidingRef.current = place;
      setFlipped(false);
      setPose("peek");
      rotate.set(place.rotate);
      scale.set(1);
      x.set(place.hidden.x);
      y.set(place.hidden.y);
      updateClip();
      opacity.set(1);
      shown.current = true;
      setPresent(true);

      await fly(own, { x: place.peek.x, y: place.peek.y }, 0.7, "easeOut");
      await wait(random(2200, 4200), own);
      if (Math.random() < 0.4) {
        // Ducks back in, then can't resist another look.
        await fly(own, { x: place.hidden.x, y: place.hidden.y }, 0.35, "easeIn");
        await wait(random(800, 1600), own);
        await fly(own, { x: place.peek.x, y: place.peek.y }, 0.5, "easeOut");
        await wait(random(1500, 2600), own);
      }
      if (place.side !== "bottom" && Math.random() < 0.5) {
        // Springs out with a somersault, but only where a leap makes sense: sideways out
        // of a left or right edge, or up and over a top edge. Out of a bottom edge it
        // would tumble downwards, which looks wrong, so it ducks and poofs instead.
        // The cut stays on the edge during the leap, so it really comes out from behind.
        await somersault(own, leapOut(place), { crouch: false });
        hidingRef.current = null;
        updateClip();
        return;
      }
      await fly(own, { x: place.hidden.x, y: place.hidden.y }, 0.35, "easeIn");
      endHide();
      await wait(random(800, 2000), own);
      await teleport(own, landing());
    },
    [endHide, fly, landing, leapOut, opacity, puff, rotate, scale, somersault, teleport, updateClip, wait, x, y]
  );

  /** Oof: a puff and it's gone, back somewhere else a few seconds later. */
  const oof = useCallback(
    async (own: number) => {
      puff({ x: x.get(), y: y.get() });
      await fly(own, { scale: 0.2, opacity: 0 }, 0.2, "easeOut");
      shown.current = false;
      setPresent(false);
      scale.set(1);
      await wait(random(3000, 8000), own);
      await teleport(own, landing());
    },
    [fly, landing, puff, scale, teleport, wait, x, y]
  );

  /** Runs for it: a quick dash off the nearest side of the screen, back later. */
  const runAway = useCallback(
    async (own: number) => {
      const vw = document.documentElement.clientWidth;
      const dir = x.get() + size / 2 < vw / 2 ? -1 : 1;
      const y0 = y.get();
      setPose("startled");
      setFlipped(dir > 0);
      await fly(own, { x: dir < 0 ? -size * 1.6 : vw + size * 0.6, y: [y0, y0 - 28, y0 + 8] }, 0.75, "easeIn");
      opacity.set(0);
      shown.current = false;
      setPresent(false);
      setFlipped(false);
      setPose("idle");
      await wait(random(4000, 9000), own);
      await teleport(own, landing());
    },
    [fly, landing, opacity, size, teleport, wait, x, y]
  );

  /** Mew's own plans, forever, until something interrupts. */
  const live = useCallback(
    async (own: number) => {
      for (;;) {
        // If the first welcome was interrupted (tab hidden, a hover), still point at home.
        notePerch();
        if (!shown.current) {
          await wait(random(20000, 60000), own);
          await appear(own, somewhere(), Math.random() < 0.5 ? "sparkle" : "wave");
          continue;
        }

        const awake = Date.now() - arrivedAt.current;
        const choice = pick<string>([
          ["linger", 45],
          ["flip", 7],
          // It hangs around where it arrived for a while before exploring.
          ["wander", awake > 20000 ? 18 : 0],
          ["teleport", awake > 20000 ? 14 : 0],
          ["hide", awake > 20000 ? 10 : 0],
          // Back home now and then, once it's been away.
          ["home", homeRef.current && Math.hypot(x.get() - homeRef.current.x, y.get() - homeRef.current.y) > 8 ? 10 : 0],
          ["leave", awake > 40000 ? 14 : 0],
          ["nap", awake > 60000 ? 9 : 0],
        ])[0];

        if (choice === "linger") {
          const [pastime, , [min, max]] = pick(PASTIMES) as [Pose, number, [number, number]];
          setPose(pastime);
          await wait(random(min, max), own);
          setPose("idle");
          await wait(random(800, 2000), own);
        } else if (choice === "flip") {
          await somersault(own);
          await wait(random(1200, 2400), own);
        } else if (choice === "wander") {
          await wander(own);
          await wait(random(1000, 2500), own);
        } else if (choice === "home" && homeRef.current) {
          const h = homeRef.current;
          if (Math.random() < 0.5) await teleport(own, h);
          else await wander(own, h);
          setPose("sparkle");
          await wait(random(1600, 2400), own);
          setPose("idle");
          await wait(random(1000, 2000), own);
        } else if (choice === "hide") {
          const place = hidingPlace();
          if (place) await hide(own, place);
          else await wait(random(800, 1600), own);
        } else if (choice === "teleport") {
          await teleport(own, landing());
          await wait(random(1000, 2500), own);
        } else if (choice === "leave") {
          await vanish(own);
        } else {
          setPose("yawn");
          await wait(1600, own);
          setPose("sleep");
          asleep.current = true;
          await wait(random(12000, 25000), own);
          asleep.current = false;
          setPose("yawn");
          await wait(1400, own);
          setPose("idle");
        }
      }
    },
    [x, y, notePerch, hide, hidingPlace, appear, landing, somersault, somewhere, teleport, vanish, wait, wander]
  );

  /** Home is the intro perch; recomputed when the layout may have moved. */
  const updateHome = useCallback(() => {
    const spot = perch();
    homeRef.current = spot;
    setHome(spot);
    if (spot) setNote((note) => (note ? { x: spot.x + size, y: spot.y } : note));
  }, [perch, size]);


  /**
   * The sign goes up first: it points at the home cloud, and Mew turns up there a moment
   * later. Only where there's room for it.
   */
  const signHome = useCallback(() => {
    const spot = perch();
    if (!spot || noted.current) return;
    if (document.documentElement.clientWidth - (spot.x + size) - 8 < NOTE_WIDTH) return;
    noted.current = true;
    setNote({ x: spot.x + size, y: spot.y });
  }, [perch, size]);

  /**
   * The page entrance. Until someone wakes Mew (a click), it sleeps in its cloud on the
   * home page and stays put; it isn't around on other pages. Once woken it's its own
   * creature: it doesn't wait at home for you, it turns up somewhere after a while,
   * sometimes just appearing, sometimes peeking out from behind something.
   */
  const arrive = useCallback(
    async (own: number) => {
      const spot = perch();
      // The very first time on a page with a home: the sign draws in, then Mew fades in.
      const intro = !!spot && !introducedRef.current;
      if (intro) {
        await wait(300, own); // let the layout settle (fonts) before putting the sign up
        updateHome();
        signHome();
        await wait(2000, own);
        introducedRef.current = true;
        setIntroduced(true);
      }

      if (!woken.current) {
        updateHome();
        const home = perch();
        if (home) {
          x.set(home.x);
          y.set(home.y);
          setFlipped(false);
          setPose("sleep");
          shown.current = true;
          setPresent(true);
          arrivalPending.current = false;
          if (intro) await fly(own, { opacity: 1 }, 1.2, "easeOut");
          else opacity.set(1);
        }
        // Fast asleep until a click wakes it (onClick); nothing else moves it.
        asleep.current = true;
        for (;;) await wait(60000, own);
      }

      await wait(random(3000, 9000), own);
      arrivalPending.current = false;
      const place = Math.random() < 0.5 ? hidingPlace() : null;
      if (place) await hide(own, place);
      else await appear(own, somewhere(), Math.random() < 0.5 ? "sparkle" : "wave");
    },
    [appear, fly, hide, hidingPlace, opacity, perch, signHome, somewhere, updateHome, wait, x, y]
  );

  /** Drop whatever Mew is doing, run `first`, then go back to its own plans. */
  const replan = useCallback(
    (first?: (own: number) => Promise<void>) => {
      const own = ++token.current;
      endHide();
      stopFlights();
      // A fade or poof cut short would leave Mew half see-through; snap to all or nothing.
      opacity.set(shown.current ? 1 : 0);
      asleep.current = false;
      (async () => {
        try {
          if (first) await first(own);
          await live(own);
        } catch (error) {
          if (error !== CANCELLED) throw error;
        }
      })();
    },
    [endHide, live, opacity, stopFlights]
  );

  useEffect(() => {
    const update = () => setSize(window.innerWidth < 640 ? 52 : 72);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Measured on the next frame, once the page has laid out.
    const frame = requestAnimationFrame(updateHome);
    window.addEventListener("resize", updateHome);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateHome);
    };
  }, [mounted, pathname, updateHome]);

  // Arrive on each page: by the intro if there is one, otherwise somewhere, a bit later.
  // Runs on the next frame, once the new page has laid out (it measures where to go).
  useEffect(() => {
    if (!mounted) return;
    const frame = requestAnimationFrame(() => {
      hidingRef.current = null;
      rotate.set(0);
      updateClip();
      opacity.set(0);
      shown.current = false;
      setPresent(false);
      // A new page: its own sign goes up again on arrival (instantly after the first time).
      setNote(null);
      noted.current = false;
      // Back on a page after the intro: the sign is part of the furniture, so it goes up
      // in this same frame as the cloud instead of waiting for Mew's arrival.
      if (introducedRef.current) {
        updateHome();
        signHome();
      }

      if (reducedMotion) {
        // No roaming: Mew just sits by the intro (or bottom corner) and changes pose when poked.
        invalidate();
        stopFlights();
        const spot = perch() ?? {
          x: document.documentElement.clientWidth - size - 16,
          y: window.scrollY + window.innerHeight - size * FRAME_RATIO - 16,
        };
        x.set(spot.x);
        y.set(spot.y);
        opacity.set(1);
        shown.current = true;
        setPresent(true);
        setPose("idle");
        return;
      }

      arrivalPending.current = true;
      replan(arrive);
    });
    return () => {
      cancelAnimationFrame(frame);
      invalidate();
      stopFlights();
    };
  }, [mounted, pathname, reducedMotion, size, arrive, invalidate, opacity, rotate, updateClip, perch, replan, signHome, stopFlights, updateHome, x, y]);

  // Mew doesn't follow the page as you scroll. Once you settle somewhere it can't see
  // you from, it may poof onto your screen a moment later (or keep napping).
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    let settle: ReturnType<typeof setTimeout> | undefined;
    let visit: ReturnType<typeof setTimeout> | undefined;
    const offScreen = () => {
      const height = size * FRAME_RATIO;
      const top = window.scrollY + HEADER_HEIGHT;
      const bottom = window.scrollY + window.innerHeight;
      return y.get() + height * 0.5 < top || y.get() + height * 0.5 > bottom;
    };
    const onScroll = () => {
      clearTimeout(settle);
      clearTimeout(visit);
      settle = setTimeout(() => {
        if (!woken.current || !shown.current || !offScreen()) return;
        visit = setTimeout(() => {
          if (!shown.current || !offScreen()) return;
          if (asleep.current && Math.random() < 0.6) return;
          replan((own) => teleport(own, landing()));
        }, random(700, 2200));
      }, 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settle);
      clearTimeout(visit);
    };
  }, [mounted, reducedMotion, size, landing, replan, teleport, y]);

  // Rest while the tab is in the background; a long absence makes Mew a little sad.
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
        token.current++;
        stopFlights();
        return;
      }
      const away = hiddenAt.current ? Date.now() - hiddenAt.current : 0;
      hiddenAt.current = null;
      replan(async (own) => {
        // Not woken yet: back to sleep in the cloud (or keep away from this page).
        // Opened in a background tab: the entrance never happened, so make it now.
        if (!woken.current || arrivalPending.current) {
          await arrive(own);
        } else if (shown.current && opacity.get() < 1) {
          // Animations don't run in background tabs, so an entrance may have stalled.
          await appear(own, { x: x.get(), y: y.get() }, "wave");
          notePerch();
        } else if (shown.current && away > 60000) {
          setPose("sad");
          await wait(1800, own);
          setPose("wave");
          await wait(1600, own);
          setPose("idle");
        }
      });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [mounted, reducedMotion, appear, arrive, notePerch, opacity, replan, stopFlights, wait, x, y]);

  /** Spotted while peeking: duck back behind, then turn up somewhere else. */
  const duckAway = () => {
    const place = hidingRef.current;
    if (!place) return;
    const own = ++token.current;
    flights.current.forEach((flight) => flight.stop());
    flights.current = [];
    (async () => {
      try {
        await fly(own, { x: place.hidden.x, y: place.hidden.y }, 0.2, "easeIn");
        replan(async (next) => {
          await wait(random(1500, 3500), next);
          await teleport(next, landing());
        });
      } catch (error) {
        if (error !== CANCELLED) throw error;
      }
    })();
  };

  const onPointerEnter = () => {
    if (!shown.current || asleep.current) return;
    if (reducedMotion) return setPose("curious");
    if (hidingRef.current) return duckAway();
    replan(async (own) => {
      setFlipped(false);
      setPose(Math.random() < 0.7 ? "curious" : "wave");
      await wait(1800, own);
      setPose("idle");
      await wait(600, own);
    });
  };

  const onPointerLeave = () => {
    if (reducedMotion) setPose("idle");
  };

  const onClick = () => {
    if (!shown.current) return;
    if (reducedMotion) return setPose((current) => (current === "giggle" ? "idle" : "giggle"));
    if (!woken.current) {
      // Woken up at last: a stretch and a yawn, a wave, then off on its own business.
      woken.current = true;
      replan(async (own) => {
        setPose("yawn");
        await wait(1500, own);
        setPose("wave");
        await wait(random(1600, 2200), own);
        setPose("idle");
        arrivedAt.current = Date.now();
      });
      return;
    }
    if (hidingRef.current) return duckAway();
    // Already reacting to a flick: extra clicks and double clicks don't stack up.
    if (reacting.current) return;
    // Flicked: it won't be reasoned with. It picks at random: usually it giggles or settles
    // where it is, sometimes it somersaults off, and only now and then it oofs or runs.
    replan(async (own) => {
      reacting.current = true;
      try {
        setFlipped(false);
        setPose("startled");
        await wait(450, own);
        // Mostly it shakes it off where it is; now and then it leaves.
        const reaction = pick<string>([
          ["giggle", 3],
          ["settle", 2],
          ["somersault", 2],
          ["oof", 1.5],
          ["run", 1],
        ])[0];
        if (reaction === "giggle") {
          setPose("giggle");
          await wait(random(1400, 2000), own);
          setPose("idle");
        } else if (reaction === "settle") {
          setPose(Math.random() < 0.5 ? "curious" : "sad");
          await wait(random(1200, 1800), own);
          setPose("idle");
        } else if (reaction === "somersault") await somersault(own, landing());
        else if (reaction === "oof") await oof(own);
        else await runAway(own);
      } finally {
        reacting.current = false;
      }
    });
  };

  if (!mounted) return null;

  const frame = POSES[pose];
  const col = frame % SHEET_COLS;
  const row = Math.floor(frame / SHEET_COLS);

  // Mew lives in page coordinates. The layer is clipped to the page's own size (the
  // body), so a spot left over from a longer page can never stretch this one.
  return createPortal(
    <div aria-hidden className="pointer-events-none absolute inset-0 z-40 overflow-clip">
      {home ? <HomeCloud x={home.x} y={home.y} size={size} instant={introduced} /> : null}
      {puffs.map((p) => (
        <PuffCloud key={p.id} x={p.x} y={p.y} size={size} />
      ))}
      <AnimatePresence>
        {note ? <HandNote key="note" x={note.x} y={note.y} size={size} instant={introduced} /> : null}
      </AnimatePresence>

    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-40"
      style={{ x, y, opacity, scale, clipPath: clip, width: size, height: size * FRAME_RATIO }}
    >
      <motion.div
        className="size-full"
        style={{ rotate }}
        animate={reducedMotion ? undefined : { y: [0, pose === "sleep" ? -3 : -6, 0] }}
        transition={{ duration: pose === "sleep" ? 4 : 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onClick={onClick}
          // Light and dark sheets: each was cut from art made on that background, so the
          // edges and the fading pose suit the theme.
          className={`${present ? "pointer-events-auto" : "pointer-events-none"} bg-[url(/sprites/mew.png)] dark:bg-[url(/sprites/mew-dark.png)] size-full cursor-pointer select-none transition-transform duration-300`}
          style={{
            backgroundSize: `${SHEET_COLS * 100}% ${SHEET_ROWS * 100}%`,
            backgroundPosition: `${(col / (SHEET_COLS - 1)) * 100}% ${(row / (SHEET_ROWS - 1)) * 100}%`,
            transform: flipped ? "scaleX(-1)" : undefined,
          }}
        />
      </motion.div>
    </motion.div>
    </div>,
    document.body
  );
}

// A soft burst of smoke and sparkles where Mew pops in or out.
const PUFF_BITS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 + 0.3;
  return { dx: Math.cos(angle), dy: Math.sin(angle), r: i % 2 === 0 ? 0.32 : 0.22, sparkle: i % 3 === 0 };
});

function PuffCloud({ x, y, size }: { x: number; y: number; size: number }) {
  const reach = size * 0.55;
  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-0 z-40" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <motion.span
        className="absolute rounded-full bg-white/70 dark:bg-white/40"
        style={{ width: size * 0.7, height: size * 0.7, left: -size * 0.35, top: -size * 0.35 }}
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
      {PUFF_BITS.map((bit, i) => (
        <motion.span
          key={i}
          className={bit.sparkle ? "absolute rounded-full bg-heat-4" : "absolute rounded-full bg-neutral-200 dark:bg-neutral-300"}
          style={{ width: size * bit.r, height: size * bit.r, left: (-size * bit.r) / 2, top: (-size * bit.r) / 2 }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 0.95 }}
          animate={{ x: bit.dx * reach, y: bit.dy * reach, scale: 1, opacity: 0 }}
          transition={{ duration: PUFF_MS / 1000 - 0.05, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/**
 * A hand-drawn arrow and note pointing back at Mew, drawn in stroke by stroke. Sits to
 * the right of Mew's first perch and fades when Mew leaves.
 */
function HandNote({ x, y, size, instant }: { x: number; y: number; size: number; instant?: boolean }) {
  // instant: already introduced, so it's just there (initial={false} skips the draw-in).
  const draw = (delay: number, duration: number) => ({
    initial: instant ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { delay, duration, ease: "easeOut" as const }, opacity: { delay, duration: 0.01 } },
  });
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 text-brand"
      style={{ x: x + 2, y: y + size * FRAME_RATIO * 0.12 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <svg width={NOTE_WIDTH} height={86} viewBox="0 0 196 86" fill="none" aria-hidden>
        {/* A loose, slightly wobbly curve from the note back to Mew. */}
        <motion.path
          d="M 76 64 C 58 72, 34 68, 26 52 C 20 40, 18 32, 8 26"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          {...draw(0.2, 0.6)}
        />
        <motion.path d="M 8 26 L 19 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...draw(0.75, 0.15)} />
        <motion.path d="M 8 26 L 12 36" stroke="currentColor" strokeWidth={2} strokeLinecap="round" {...draw(0.85, 0.15)} />
      </svg>
      <motion.span
        className="absolute whitespace-nowrap font-hand leading-none"
        style={{ left: 82, top: 52 }}
        initial={instant ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <span className="block text-[22px]">say hi to Mew</span>
        <span className="mt-1 block pl-1 text-[16px] opacity-80">(if you find him)</span>
      </motion.span>
    </motion.div>
  );
}

/**
 * Mew's home: a golden cloud cushion at its spot by the intro. It's the first thing to
 * appear on the page, then it stays, whether Mew is sitting in it or off exploring.
 * Mew's feet land in the dip in its middle.
 */
const CLOUD_RATIO = 174 / 240; // /sprites/cloud.png
function HomeCloud({ x, y, size, instant }: { x: number; y: number; size: number; instant?: boolean }) {
  const width = size * 1.25;
  const height = width * CLOUD_RATIO;
  const feet = y + size * FRAME_RATIO * 0.93;
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 bg-[url(/sprites/cloud.png)] bg-contain bg-no-repeat"
      style={{ x: x + size / 2 - width / 2, y: feet - height * 0.45, width, height }}
      initial={instant ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    />
  );
}
