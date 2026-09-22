import dateUtils from '@js/core/utils/date';

import type { TimeZoneCalculator } from '../r1/timezone_calculator/calculator';
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
  startDayHour: number;
  transitions: (FallbackTransition | undefined)[];
}

const midnight = (date: Date): Date => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
);

const atHour = (day: Date, hour: number): Date => {
  const { hours, minutes } = dateUtils.dateTimeFromDecimal(hour);

  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, 0);
};

const sameClock = (first: Date, second: Date): boolean => (
  first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate()
  && first.getHours() === second.getHours()
  && first.getMinutes() === second.getMinutes()
  && first.getSeconds() === second.getSeconds()
  && first.getMilliseconds() === second.getMilliseconds()
);

const wallMinutes = (date: Date): number => date.getHours() * 60 + date.getMinutes();

const coversWholeDay = (endDayHour: number): boolean => endDayHour >= 24;

export interface FallbackTransition {
  extraMs: number;
  repeatedStartMinutes: number;
  instant: Date;
}

const isSameCalendarDay = (first: Date, second: Date): boolean => (
  first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate()
);

const getOffset = (
  date: Date,
  timeZoneCalculator?: TimeZoneCalculator,
): number => {
  if (timeZoneCalculator) {
    return timeZoneCalculator.getOffsets(date, undefined).common * HOUR_MS;
  }

  return -date.getTimezoneOffset() * toMs('minute');
};

const toGridDate = (
  date: Date,
  timeZoneCalculator?: TimeZoneCalculator,
): Date => timeZoneCalculator?.createDate(date, 'toGrid') ?? date;

const locateOffsetChange = (
  lowTime: number,
  highTime: number,
  offset: number,
  timeZoneCalculator?: TimeZoneCalculator,
): number => {
  let low = lowTime;
  let high = highTime;
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (getOffset(new Date(middle), timeZoneCalculator) === offset) {
      low = middle;
    } else {
      high = middle;
    }
  }

  return high;
};

const findFallbackTransition = (
  day: Date,
  timeZoneCalculator?: TimeZoneCalculator,
): FallbackTransition | undefined => {
  const approximateStart = timeZoneCalculator?.createDate(midnight(day), 'fromGrid')
    ?? midnight(day);
  const scanStart = approximateStart.getTime() - 12 * HOUR_MS;
  const scanEnd = approximateStart.getTime() + 36 * HOUR_MS;
  const scanStep = 30 * toMs('minute');
  let previousTime = scanStart;
  let previousOffset = getOffset(new Date(previousTime), timeZoneCalculator);

  for (let time = scanStart + scanStep; time <= scanEnd; time += scanStep) {
    const offset = getOffset(new Date(time), timeZoneCalculator);
    if (offset < previousOffset) {
      const high = locateOffsetChange(
        previousTime,
        time,
        previousOffset,
        timeZoneCalculator,
      );
      const instant = new Date(high);
      const gridTransition = toGridDate(instant, timeZoneCalculator);
      if (isSameCalendarDay(gridTransition, day)) {
        return {
          extraMs: previousOffset - offset,
          repeatedStartMinutes: wallMinutes(gridTransition),
          instant,
        };
      }
    }

    previousTime = time;
    previousOffset = offset;
  }

  return undefined;
};

const appendCells = (
  result: TimelineCell[],
  dayStart: number,
  startElapsed: number,
  endElapsed: number,
  cellDurationMs: number,
): void => {
  let cursor = startElapsed;
  while (cursor < endElapsed && result.length < 10000) {
    const cellEnd = Math.min(cursor + cellDurationMs, endElapsed);
    result.push({
      start: new Date(dayStart + cursor),
      end: new Date(dayStart + cellEnd),
    });
    cursor = cellEnd;
  }
};

/**
 * Cells of one Scheduler-zone day that contain a fall-back, clipped to the visible hours.
 * Hours outside that range, including the hidden part of a repeated hour, are omitted.
 * Returns undefined when the day is not longer than the wall clock.
 */
export const buildFallbackDayCells = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
  timeZoneCalculator?: TimeZoneCalculator,
): TimelineCell[] | undefined => {
  const transition = findFallbackTransition(day, timeZoneCalculator);
  if (!transition || cellDurationMs <= 0 || endDayHour <= startDayHour) {
    return undefined;
  }

  const startMinutes = Math.round(startDayHour * 60);
  const endMinutes = coversWholeDay(endDayHour)
    ? 24 * 60
    : Math.round(endDayHour * 60);
  const extraMinutes = transition.extraMs / toMs('minute');
  const repeatedEndMinutes = transition.repeatedStartMinutes + extraMinutes;
  const dayStart = atHour(day, 0).getTime();
  const cells: TimelineCell[] = [];

  const firstStart = Math.max(startMinutes, 0);
  const firstEnd = Math.min(endMinutes, repeatedEndMinutes);
  if (firstStart < firstEnd) {
    appendCells(
      cells,
      dayStart,
      firstStart * toMs('minute'),
      firstEnd * toMs('minute'),
      cellDurationMs,
    );
  }

  const secondStart = Math.max(startMinutes, transition.repeatedStartMinutes);
  const secondEnd = Math.min(endMinutes, 24 * 60);
  if (secondStart < secondEnd) {
    appendCells(
      cells,
      dayStart,
      (secondStart + extraMinutes) * toMs('minute'),
      (secondEnd + extraMinutes) * toMs('minute'),
      cellDurationMs,
    );
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
  const isSameDay = midnight(instant).getTime() === midnight(origin).getTime();
  if (isSameDay && intoDay < wallSpanMs) {
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
      const isSameDay = midnight(instant).getTime() === midnight(dayOrigins[index]).getTime();
      const dayColumns = wallSpanMs / cellDurationMs;
      if (isSameDay && intoDay < wallSpanMs) {
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
export const instantOnGrid = (
  gridDateUTC: number,
  sourceDate: number,
  timeZoneCalculator?: TimeZoneCalculator,
): Date => {
  const gridInstant = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(gridDateUTC));
  const transition = findFallbackTransition(gridInstant, timeZoneCalculator);
  if (!transition) {
    return gridInstant;
  }

  const source = new Date(sourceDate);
  const sourceGridDate = toGridDate(source, timeZoneCalculator);
  const gridMinutes = wallMinutes(gridInstant);
  const repeatedEndMinutes = transition.repeatedStartMinutes
    + transition.extraMs / toMs('minute');
  const displayedInRepeatedHour = gridMinutes >= transition.repeatedStartMinutes
    && gridMinutes < repeatedEndMinutes;
  const secondOccurrence = new Date(gridInstant.getTime() + transition.extraMs);
  const sourceIsSecond = displayedInRepeatedHour
    && sameClock(sourceGridDate, gridInstant)
    && source.getTime() >= transition.instant.getTime();

  return sourceIsSecond ? secondOccurrence : gridInstant;
};

export const buildRepeatedHourPlan = (
  rangeMin: number,
  rangeMax: number,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
  skippedDays: number[],
  timeZoneCalculator?: TimeZoneCalculator,
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

  const transitions = origins.map((origin) => findFallbackTransition(
    origin,
    timeZoneCalculator,
  ));
  const days = origins.map((origin, index) => {
    if (!transitions[index]) {
      return undefined;
    }

    return buildFallbackDayCells(
      origin,
      startDayHour,
      endDayHour,
      cellDurationMs,
      timeZoneCalculator,
    );
  });
  if (!days.some((cells) => cells)) {
    return undefined;
  }

  return {
    days,
    origins,
    wallSpanMs: (endDayHour - startDayHour) * HOUR_MS,
    startDayHour,
    transitions,
  };
};

const nominalOffsetAlongPlan = (
  plan: RepeatedHourPlan,
  instant: Date,
): number => {
  const {
    days, origins, wallSpanMs, startDayHour, transitions,
  } = plan;
  let offset = 0;

  for (let index = 0; index < days.length; index += 1) {
    if (isBeyondInstant(origins[index], instant)) {
      return offset;
    }

    const transition = transitions[index];
    if (!transition) {
      const placed = wallOffsetOnDay(origins[index], instant, offset, wallSpanMs);
      if (placed.done) {
        return placed.offset;
      }
      offset = placed.offset;
    } else {
      const dayStart = atHour(origins[index], 0).getTime();
      const elapsed = instant.getTime() - dayStart;
      const repeatedEndElapsed = transition.repeatedStartMinutes * toMs('minute')
        + transition.extraMs;
      const dayEndElapsed = DAY_MS + transition.extraMs;
      if (elapsed < dayEndElapsed) {
        const wallElapsed = elapsed >= repeatedEndElapsed
          ? elapsed - transition.extraMs
          : elapsed;
        return offset + wallElapsed - startDayHour * HOUR_MS;
      }

      offset += wallSpanMs;
    }
  }

  return offset;
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
  const nominal = nominalOffsetAlongPlan(plan, instant);

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
  timeZoneCalculator?: TimeZoneCalculator,
): number => repeatedHourShiftMsFromPlan(
  buildRepeatedHourPlan(
    rangeMin,
    rangeMax,
    startDayHour,
    endDayHour,
    cellDurationMs,
    skippedDays,
    timeZoneCalculator,
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
