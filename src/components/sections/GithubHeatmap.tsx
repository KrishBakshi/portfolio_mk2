"use client";

import { useEffect, useMemo, useRef } from "react";

import { CalendarHeatmap, CalendarHeatmapLegend } from "@/components/ui/calendar-heatmap";
import type { GithubContributionDay } from "@/lib/github";

const CELL_SIZE = 9;
// Psychic-aura ramp from globals.css (--heat-0..4).
const LEVEL_CLASSES = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];
const classForLevel = (level: number) => LEVEL_CLASSES[Math.min(Math.max(level, 0), LEVEL_CLASSES.length - 1)];
const GAP = 2;

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** `YYYY-MM-DD` → local midnight, so server and client agree on the day regardless of timezone. */
function parseDay(day: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date);
}

/**
 * Level cut-offs from the quartiles of active days, like GitHub's own graph:
 * one huge day doesn't wash every other day out to the lightest shade.
 */
function quartileThresholds(days: GithubContributionDay[]): number[] {
  const active = days.map((day) => day.count).filter((count) => count > 0).sort((a, b) => a - b);
  if (active.length === 0) return [1, 2, 3, 4];
  const at = (q: number) => active[Math.min(active.length - 1, Math.floor(q * active.length))];
  const cuts = [1, at(0.25), at(0.5), at(0.75)];
  // Keep cut-offs strictly increasing so every level stays reachable.
  for (let i = 1; i < cuts.length; i++) cuts[i] = Math.max(cuts[i], cuts[i - 1] + 1);
  return cuts;
}

export function GithubHeatmap({ days }: { days: GithubContributionDay[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, startDate, endDate, thresholds } = useMemo(
    () => ({
      data: days.map((day) => ({ date: day.date, value: day.count })),
      startDate: parseDay(days[0].date),
      endDate: parseDay(days[days.length - 1].date),
      thresholds: quartileThresholds(days),
    }),
    [days]
  );

  // On narrow screens the grid scrolls sideways; start on the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div className="w-fit max-w-full space-y-2">
      <div ref={scrollRef} data-mew-hide className="overflow-x-auto pb-1 [scrollbar-width:none]">
        <CalendarHeatmap
          data={data}
          startDate={startDate}
          endDate={endDate}
          thresholds={thresholds}
          classForLevel={classForLevel}
          cellSize={CELL_SIZE}
          gap={GAP}
          showWeekdayLabels={false}
          tooltipFormatter={(date, value) =>
            `${value === 0 ? "No" : value} contribution${value === 1 ? "" : "s"} on ${dateFormat.format(date)}`
          }
          aria-label="GitHub contributions over the last year"
          // Room for the last month label, which is wider than its week column.
          className="pr-4"
        />
      </div>
      <CalendarHeatmapLegend classForLevel={classForLevel} cellSize={CELL_SIZE} gap={GAP} className="mr-4 ml-auto" />
    </div>
  );
}
