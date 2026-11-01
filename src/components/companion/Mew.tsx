"use client";

import { animate, motion, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/*
 * Mew lives on the site but does not follow you. It turns up beside the end of the
 * intro, then does what it likes: floats or tumbles around, teleports with a poof
 * (sometimes onto a section heading or the footer), plays, naps in a bubble, fades
 * out and comes back later. If you scroll away it stays put, then a moment after you
 * stop it may poof onto your screen again. Hovering makes it curious and clicking
 * startles it, but where it goes is always its own choice.
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
const PUFF_MS = 650;

type Spot = { x: number; y: number };
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
  const puffId = useRef(0);
  const [pose, setPose] = useState<Pose>("idle");
  const [flipped, setFlipped] = useState(false);
  const [present, setPresent] = useState(false);
  const [size, setSize] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 52 : 72));

  // Each new plan bumps the token; anything still running from an older plan stops.
  const token = useRef(0);
  const flights = useRef<AnimationPlaybackControls[]>([]);
  const asleep = useRef(false);
  const shown = useRef(false);
  const arrivedAt = useRef(0);
  const hiddenAt = useRef<number | null>(null);
  // True from page load until Mew has made its entrance on that page.
  const arrivalPending = useRef(false);

  const stopFlights = useCallback(() => {
    flights.current.forEach((flight) => flight.stop());
    flights.current = [];
    scale.set(1);
    // Interrupted mid-roll: finish turning upright the short way round.
    const angle = ((rotate.get() % 360) + 360) % 360;
    if (angle !== 0) {
      rotate.set(angle);
      animate(rotate, angle > 180 ? 360 : 0, { duration: 0.25, ease: "easeOut" }).then(() => rotate.set(0));
    }
  }, [rotate, scale]);

  const wait = useCallback(async (ms: number, own: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    if (own !== token.current) throw CANCELLED;
  }, []);

  const fly = useCallback(
    async (own: number, to: Record<string, number | number[]>, duration: number, ease: "easeInOut" | "easeOut" = "easeInOut") => {
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
      y: rect.top + window.scrollY + rect.height / 2 - height * 0.7,
    };
  }, [size]);

  const appear = useCallback(
    async (own: number, at: { x: number; y: number }, greeting: Pose) => {
      stopFlights();
      x.set(at.x);
      y.set(at.y);
      setFlipped(false);
      setPose("fade");
      shown.current = true;
      setPresent(true);
      arrivalPending.current = false;
      arrivedAt.current = Date.now();
      await fly(own, { opacity: 1 }, 1.2, "easeOut");
      setPose(greeting);
      await wait(random(1600, 2400), own);
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

      const greeting = pick<Pose>([["wave", 3], ["curious", 2], ["peek", 1], ["giggle", 1], ["idle", 2]])[0];
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
    async (own: number, to?: { x: number; y: number }) => {
      const from = { x: x.get(), y: y.get() };
      const target = to ?? from;
      const distance = Math.hypot(target.x - from.x, target.y - from.y);
      const direction = target.x < from.x ? -1 : 1;
      const turns = Math.max(1, Math.round(distance / 200));
      const duration = Math.min(1.9, Math.max(0.9, 0.6 + distance / 400));
      const lift = Math.max(56, distance * 0.3);

      setFlipped(false);
      setPose("curious"); // a quick crouch before take-off
      await wait(250, own);
      setPose("somersault");
      rotate.set(0);
      await fly(
        own,
        {
          x: [from.x, (from.x + target.x) / 2, target.x],
          y: [from.y, Math.min(from.y, target.y) - lift, target.y],
          rotate: 360 * turns * direction,
        },
        duration
      );
      rotate.set(0);
      setPose("idle");
    },
    [fly, rotate, wait, x, y]
  );

  const wander = useCallback(
    async (own: number) => {
      const from = { x: x.get(), y: y.get() };
      const to = somewhere();
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

  /** Mew's own plans, forever, until something interrupts. */
  const live = useCallback(
    async (own: number) => {
      for (;;) {
        if (!shown.current) {
          await wait(random(20000, 60000), own);
          await appear(own, somewhere(), Math.random() < 0.5 ? "peek" : "wave");
          continue;
        }

        const awake = Date.now() - arrivedAt.current;
        const choice = pick<string>([
          ["linger", 45],
          ["flip", 7],
          // It hangs around where it arrived for a while before exploring.
          ["wander", awake > 20000 ? 18 : 0],
          ["teleport", awake > 20000 ? 14 : 0],
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
    [appear, landing, somersault, somewhere, teleport, vanish, wait, wander]
  );

  /** The page entrance: by the intro if there is one, otherwise somewhere, a bit later. */
  const arrive = useCallback(
    async (own: number) => {
      const spot = perch();
      await wait(spot ? 1500 : random(4000, 10000), own);
      await appear(own, perch() ?? spot ?? somewhere(), "wave");
    },
    [appear, perch, somewhere, wait]
  );

  /** Drop whatever Mew is doing, run `first`, then go back to its own plans. */
  const replan = useCallback(
    (first?: (own: number) => Promise<void>) => {
      const own = ++token.current;
      stopFlights();
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
    [live, stopFlights]
  );

  useEffect(() => {
    const update = () => setSize(window.innerWidth < 640 ? 52 : 72);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Arrive on each page: by the intro if there is one, otherwise somewhere, a bit later.
  useEffect(() => {
    if (!mounted) return;
    opacity.set(0);
    shown.current = false;
    setPresent(false);

    if (reducedMotion) {
      // No roaming: Mew just sits by the intro (or bottom corner) and changes pose when poked.
      token.current++;
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
    return () => {
      token.current++;
      stopFlights();
    };
  }, [mounted, pathname, reducedMotion, size, arrive, opacity, perch, replan, stopFlights, x, y]);

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
        if (!shown.current || !offScreen()) return;
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
        // Opened in a background tab: the entrance never happened, so make it now.
        if (arrivalPending.current) {
          await arrive(own);
        } else if (shown.current && opacity.get() < 1) {
          // Animations don't run in background tabs, so an entrance may have stalled.
          await appear(own, { x: x.get(), y: y.get() }, "wave");
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
  }, [mounted, reducedMotion, appear, arrive, opacity, replan, stopFlights, wait, x, y]);

  const onPointerEnter = () => {
    if (!shown.current || asleep.current) return;
    if (reducedMotion) return setPose("curious");
    replan(async (own) => {
      setFlipped(false);
      setPose(Math.random() < 0.7 ? "curious" : "peek");
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
    replan(async (own) => {
      setFlipped(false);
      setPose("startled");
      await wait(900, own);
      if (Math.random() < 0.5) {
        setPose("giggle");
        await wait(1800, own);
        setPose("idle");
      } else {
        // Shy: it slips away and comes back when it feels like it.
        await vanish(own);
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
      {puffs.map((p) => (
        <PuffCloud key={p.id} x={p.x} y={p.y} size={size} />
      ))}
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-40"
      style={{ x, y, opacity, scale, width: size, height: size * FRAME_RATIO }}
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
          className={`${present ? "pointer-events-auto" : "pointer-events-none"} size-full cursor-pointer select-none transition-transform duration-300`}
          style={{
            backgroundImage: "url(/sprites/mew.png)",
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
