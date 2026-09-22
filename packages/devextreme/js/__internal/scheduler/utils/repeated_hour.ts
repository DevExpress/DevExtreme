import dateUtils from '@js/core/utils/date';

import timeZoneUtils from '../utils_time_zone';

const toMs = dateUtils.dateToMilliseconds;
const HOUR_MS = toMs('hour');
const DAY_MS = toMs('day');

export interface TimelineCell {
  start: Date;
  end: Date;
}

export interface RepeatedHourPlan {
  days: (TimelineCell[] | undefined)[];
  origins: Date[];
  wallSpanMs: number;
}

const midnight = (date: Date): Date => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
);

const nextMidnight = (date: Date): Date => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate() + 1,
);

const atHour = (day: Date, hour: number): Date => {
  const { hours, minutes } = dateUtils.dateTimeFromDecimal(hour);

  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, 0);
};

const sameClock = (first: Date, second: Date): boolean => first.getHours() === second.getHours()
  && first.getMinutes() === second.getMinutes()
  && first.getDate() === second.getDate();

const wallMinutes = (date: Date): number => date.getHours() * 60 + date.getMinutes();

const dayFallbackMs = (day: Date): number => Math.max(
  0,
  nextMidnight(day).getTime() - midnight(day).getTime() - DAY_MS,
);

const coversWholeDay = (endDayHour: number): boolean => endDayHour >= 24;

const inVisibleHours = (
  date: Date,
  startMinutes: number,
  endMinutes: number,
): boolean => {
  const minutes = wallMinutes(date);

  return minutes >= startMinutes && minutes < endMinutes;
};

const visibleLimit = (day: Date, endDayHour: number, extraMs: number): Date => {
  if (coversWholeDay(endDayHour)) {
    return nextMidnight(day);
  }

  const first = atHour(day, endDayHour);
  const later = new Date(first.getTime() + extraMs);

  return sameClock(first, later) ? later : first;
};

const repeatedStart = (day: Date, startDayHour: number, extraMs: number): Date | undefined => {
  const first = atHour(day, startDayHour);
  const later = new Date(first.getTime() + extraMs);

  return sameClock(first, later) ? later : undefined;
};

const fallbackTransition = (day: Date): Date => {
  let low = midnight(day).getTime();
  let high = nextMidnight(day).getTime();
  const initialOffset = new Date(low).getTimezoneOffset();

  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (new Date(mid).getTimezoneOffset() === initialOffset) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return new Date(high);
};

const getNextVisibleStart = (
  starts: number[],
  cursor: number,
  limit: number,
): number | undefined => starts.find((start) => start > cursor && start < limit);

const clipToVisibleHours = (
  start: number,
  end: number,
  startMinutes: number,
  endMinutes: number,
): number => {
  if (inVisibleHours(new Date(end - 1), startMinutes, endMinutes)) {
    return end;
  }

  let low = start;
  let high = end;
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (inVisibleHours(new Date(mid), startMinutes, endMinutes)) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low + 1;
};

/**
 * Cells of one local day that contain a fall-back, clipped to the visible hours.
 * Hours outside that range, including the hidden part of a repeated hour, are omitted.
 * Returns undefined when the day is not longer than the wall clock.
 */
export const buildFallbackDayCells = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
): TimelineCell[] | undefined => {
  const extraMs = dayFallbackMs(day);
  if (extraMs <= 0 || cellDurationMs <= 0 || endDayHour <= startDayHour) {
    return undefined;
  }

  const startMinutes = Math.round(startDayHour * 60);
  const endMinutes = coversWholeDay(endDayHour)
    ? 24 * 60
    : Math.round(endDayHour * 60);
  const limit = visibleLimit(day, endDayHour, extraMs).getTime();
  const visibleStarts = [
    fallbackTransition(day),
    repeatedStart(day, startDayHour, extraMs),
  ]
    .filter((date): date is Date => date !== undefined)
    .map((date) => date.getTime())
    .sort((first, second) => first - second);
  const cells: TimelineCell[] = [];
  let cursor = atHour(day, startDayHour).getTime();

  while (cursor < limit && cells.length < 10000) {
    const hidden = !inVisibleHours(new Date(cursor), startMinutes, endMinutes);
    const nextVisibleStart = getNextVisibleStart(visibleStarts, cursor, limit);
    if (hidden) {
      if (nextVisibleStart === undefined) {
        break;
      }
      cursor = nextVisibleStart;
    } else {
      const nextBoundary = getNextVisibleStart(visibleStarts, cursor, limit);
      const stepEnd = Math.min(cursor + cellDurationMs, nextBoundary ?? limit, limit);
      const visibleEnd = clipToVisibleHours(cursor, stepEnd, startMinutes, endMinutes);
      if (visibleEnd <= cursor) {
        break;
      }

      cells.push({ start: new Date(cursor), end: new Date(visibleEnd) });
      cursor = visibleEnd;
    }
  }

  return cells.length > 0 ? cells : undefined;
};

const wallClockMs = (date: Date): number => Date.UTC(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
  date.getSeconds(),
  date.getMilliseconds(),
);

/**
 * Position of an instant on the timeline built from fallback cells.
 * Days without a list advance by the wall-clock span. Hidden gaps are absent.
 */
const offsetInFallbackDay = (
  cells: TimelineCell[],
  instant: Date,
  offset: number,
): number | undefined => {
  let cursor = offset;
  for (const cell of cells) {
    const duration = cell.end.getTime() - cell.start.getTime();
    if (instant.getTime() < cell.end.getTime()) {
      if (instant.getTime() <= cell.start.getTime()) {
        return cursor;
      }
      return cursor + (instant.getTime() - cell.start.getTime());
    }
    cursor += duration;
  }

  return undefined;
};

const isBeyondInstant = (origin: Date, instant: Date): boolean => (
  origin.getTime() > instant.getTime()
);

const wallOffsetOnDay = (
  origin: Date,
  instant: Date,
  offset: number,
  wallSpanMs: number,
): { done: boolean; offset: number } => {
  const intoDay = wallClockMs(instant) - wallClockMs(origin);
  const sameDay = midnight(instant).getTime() === midnight(origin).getTime();
  if (sameDay && intoDay < wallSpanMs) {
    return { done: true, offset: offset + intoDay };
  }

  return { done: false, offset: offset + wallSpanMs };
};

const columnInFallbackDay = (
  cells: TimelineCell[],
  instant: Date,
  column: number,
): number | undefined => {
  let cursor = column;
  for (const cell of cells) {
    const duration = cell.end.getTime() - cell.start.getTime();
    if (instant.getTime() < cell.end.getTime()) {
      if (instant.getTime() <= cell.start.getTime() || duration <= 0) {
        return cursor;
      }
      return cursor + (instant.getTime() - cell.start.getTime()) / duration;
    }
    cursor += 1;
  }

  return undefined;
};

/**
 * Column index of an instant. Each fallback cell is one column, even when its
 * elapsed length is shorter than the configured cell duration.
 */
export const columnAlongCells = (
  days: (TimelineCell[] | undefined)[],
  dayOrigins: Date[],
  instant: Date,
  wallSpanMs: number,
  cellDurationMs: number,
): number => {
  if (cellDurationMs <= 0) {
    return 0;
  }

  let column = 0;
  for (let index = 0; index < days.length; index += 1) {
    if (isBeyondInstant(dayOrigins[index], instant)) {
      return column;
    }
    const cells = days[index];
    if (!cells) {
      const intoDay = wallClockMs(instant) - wallClockMs(dayOrigins[index]);
      const sameDay = midnight(instant).getTime() === midnight(dayOrigins[index]).getTime();
      const dayColumns = wallSpanMs / cellDurationMs;
      if (sameDay && intoDay < wallSpanMs) {
        return column + Math.max(0, intoDay) / cellDurationMs;
      }
      column += dayColumns;
    } else {
      const inside = columnInFallbackDay(cells, instant, column);
      if (inside !== undefined) {
        return inside;
      }
      column += cells.length;
    }
  }

  return column;
};

export const offsetAlongCells = (
  days: (TimelineCell[] | undefined)[],
  dayOrigins: Date[],
  instant: Date,
  wallSpanMs: number,
): number => {
  let offset = 0;

  for (let index = 0; index < days.length; index += 1) {
    if (isBeyondInstant(dayOrigins[index], instant)) {
      return offset;
    }
    const cells = days[index];
    if (!cells) {
      const placed = wallOffsetOnDay(dayOrigins[index], instant, offset, wallSpanMs);
      if (placed.done) {
        return placed.offset;
      }
      offset = placed.offset;
    } else {
      const inside = offsetInFallbackDay(cells, instant, offset);
      if (inside !== undefined) {
        return inside;
      }
      offset += cells.reduce(
        (sum, cell) => sum + (cell.end.getTime() - cell.start.getTime()),
        0,
      );
    }
  }

  return offset;
};

/**
 * Grid coordinate for a shift. The displayed UTC timestamp is the position on
 * the timeline. The source instant picks the second occurrence only when that
 * displayed clock time itself falls in the repeated hour.
 */
export const instantOnGrid = (gridDateUTC: number, sourceDate: number): Date => {
  const gridInstant = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(gridDateUTC));
  const extraMs = dayFallbackMs(gridInstant);
  if (extraMs <= 0) {
    return gridInstant;
  }

  const secondOccurrence = new Date(gridInstant.getTime() + extraMs);
  const source = new Date(sourceDate);
  const displayedInRepeatedHour = sameClock(gridInstant, secondOccurrence);
  const sourceIsSecond = displayedInRepeatedHour
    && sameClock(source, gridInstant)
    && source.getTime() >= secondOccurrence.getTime();

  return sourceIsSecond ? secondOccurrence : gridInstant;
};

export const buildRepeatedHourPlan = (
  rangeMin: number,
  rangeMax: number,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
  skippedDays: number[],
): RepeatedHourPlan | undefined => {
  const rangeStart = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(rangeMin));
  const rangeEnd = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(rangeMax));
  const origins: Date[] = [];
  const day = midnight(rangeStart);

  while (day.getTime() < rangeEnd.getTime()) {
    if (!skippedDays.includes(day.getDay())) {
      origins.push(atHour(day, startDayHour));
    }
    day.setDate(day.getDate() + 1);
  }

  const days = origins.map((origin) => buildFallbackDayCells(
    origin,
    startDayHour,
    endDayHour,
    cellDurationMs,
  ));
  if (!days.some((cells) => cells)) {
    return undefined;
  }

  return {
    days,
    origins,
    wallSpanMs: (endDayHour - startDayHour) * HOUR_MS,
  };
};

export const repeatedHourShiftMsFromPlan = (
  plan: RepeatedHourPlan | undefined,
  instant: Date,
): number => {
  if (!plan || instant.getTime() < plan.origins[0].getTime()) {
    return 0;
  }

  const { days, origins, wallSpanMs } = plan;
  const offset = offsetAlongCells(days, origins, instant, wallSpanMs);
  // Same visible days, without the extra elapsed time. A calendar delta would
  // count hidden weekdays and cancel the shift those days never contributed.
  const nominal = offsetAlongCells(
    Array.from<TimelineCell[] | undefined>({ length: origins.length }),
    origins,
    instant,
    wallSpanMs,
  );

  return Math.max(0, offset - nominal);
};

export const repeatedHourShiftMs = (
  rangeMin: number,
  rangeMax: number,
  instant: Date,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
  skippedDays: number[],
): number => repeatedHourShiftMsFromPlan(
  buildRepeatedHourPlan(
    rangeMin,
    rangeMax,
    startDayHour,
    endDayHour,
    cellDurationMs,
    skippedDays,
  ),
  instant,
);

export const visibleDayOrigins = (
  startViewDate: Date,
  dayCount: number,
  skippedDays: number[],
  startDayHour: number,
): Date[] => {
  const origins: Date[] = [];
  const day = midnight(startViewDate);

  while (origins.length < dayCount) {
    if (!skippedDays.includes(day.getDay())) {
      origins.push(atHour(day, startDayHour));
    }
    day.setDate(day.getDate() + 1);
  }

  return origins;
};
