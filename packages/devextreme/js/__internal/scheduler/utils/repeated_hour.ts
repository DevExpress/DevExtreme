import dateUtils from '@js/core/utils/date';

import timeZoneUtils from '../utils_time_zone';

const toMs = dateUtils.dateToMilliseconds;
const HOUR_MS = toMs('hour');
const DAY_MS = toMs('day');

const localMidnight = (date: Date): Date => new Date(
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
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hours,
    minutes,
    0,
    0,
  );
};

const sameWallClock = (first: Date, second: Date): boolean => (
  first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate()
  && first.getHours() === second.getHours()
  && first.getMinutes() === second.getMinutes()
);

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
 * Elapsed time added by a fallback on this calendar day.
 * Measured from local midnight to the next one, so the shift size is not capped.
 */
const dayFallbackMs = (day: Date): number => Math.max(
  0,
  nextMidnight(day).getTime() - localMidnight(day).getTime() - DAY_MS,
);

/**
 * An ambiguous wall-clock time is created as its earlier occurrence.
 * The later one is the same clock time shifted by the day's fallback.
 */
const preferLaterOccurrence = (date: Date, fallbackMs: number): Date => {
  if (fallbackMs <= 0) {
    return date;
  }

  const later = new Date(date.getTime() + fallbackMs);
  return sameWallClock(date, later) ? later : date;
};

interface RealInterval {
  start: number;
  end: number;
}

const visibleRangeEnd = (day: Date, endDayHour: number): Date => {
  if (endDayHour >= 24) {
    return nextMidnight(day);
  }

  return preferLaterOccurrence(atHour(day, endDayHour), dayFallbackMs(day));
};

const hourToMs = (hour: number): number => hour * HOUR_MS;

export const findFallbackInstant = (day: Date): number | undefined => {
  const start = localMidnight(day);
  const end = nextMidnight(day);
  if (end.getTime() - start.getTime() <= DAY_MS) {
    return undefined;
  }

  const startOffset = start.getTimezoneOffset();
  let low = start.getTime();
  let high = end.getTime();

  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (new Date(mid).getTimezoneOffset() > startOffset) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return high;
};

const repeatedWallRange = (
  day: Date,
): { fallbackMs: number; transition: number; startWall: number; endWall: number } | undefined => {
  const fallbackMs = dayFallbackMs(day);
  const transition = findFallbackInstant(day);
  if (fallbackMs <= 0 || transition === undefined) {
    return undefined;
  }

  const midnight = localMidnight(day);
  const firstRepeated = new Date(transition - fallbackMs);
  const startWall = wallClockMs(firstRepeated) - wallClockMs(midnight);

  return {
    fallbackMs,
    transition,
    startWall,
    endWall: startWall + fallbackMs,
  };
};

/**
 * Real intervals of the visible hour range. The part of the repeated hour
 * that is outside [startDayHour, endDayHour) is omitted.
 */
const getVisibleSegments = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
): RealInterval[] => {
  const startMs = hourToMs(startDayHour);
  const endMs = hourToMs(endDayHour);
  const rangeStart = atHour(day, startDayHour).getTime();
  const rangeEnd = endDayHour >= 24
    ? nextMidnight(day).getTime()
    : atHour(day, endDayHour).getTime();
  const repeated = repeatedWallRange(day);

  if (!repeated) {
    return [{ start: rangeStart, end: rangeEnd }];
  }

  const segments: RealInterval[] = [];
  const { transition, startWall, endWall } = repeated;

  if (startMs < endWall) {
    let firstPassEnd = rangeEnd;
    if (endMs <= startWall) {
      firstPassEnd = rangeEnd;
    } else if (endMs < endWall) {
      firstPassEnd = atHour(day, endDayHour).getTime();
    } else {
      firstPassEnd = transition;
    }
    if (firstPassEnd > rangeStart) {
      segments.push({ start: rangeStart, end: firstPassEnd });
    }
  }

  const overlapStart = Math.max(startMs, startWall);
  const overlapEnd = Math.min(endMs, endWall);
  if (overlapEnd > overlapStart) {
    segments.push({
      start: transition + (overlapStart - startWall),
      end: transition + (overlapEnd - startWall),
    });
  }

  if (endMs > endWall) {
    const afterStart = atHour(day, Math.max(startDayHour, endWall / HOUR_MS)).getTime();
    if (rangeEnd > afterStart) {
      segments.push({ start: afterStart, end: rangeEnd });
    }
  }

  return segments.length > 0 ? segments : [{ start: rangeStart, end: rangeEnd }];
};

export const getVisibleFallbackMs = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
): number => {
  if (endDayHour <= startDayHour) {
    return 0;
  }

  const repeated = repeatedWallRange(day);
  if (!repeated) {
    return 0;
  }

  const overlapStart = Math.max(hourToMs(startDayHour), repeated.startWall);
  const overlapEnd = Math.min(hourToMs(endDayHour), repeated.endWall);

  return Math.max(0, overlapEnd - overlapStart);
};

export const dateAtVisibleOffset = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
  offsetMs: number,
): Date => {
  const segments = getVisibleSegments(day, startDayHour, endDayHour);
  let cursor = 0;

  for (const segment of segments) {
    const length = segment.end - segment.start;
    if (offsetMs < cursor + length) {
      return new Date(segment.start + (offsetMs - cursor));
    }
    cursor += length;
  }

  const lastSegment = segments[segments.length - 1];
  return new Date(lastSegment?.end ?? atHour(day, startDayHour).getTime());
};

export const getVisibleOffsetMs = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
  instant: Date,
): number => {
  const segments = getVisibleSegments(day, startDayHour, endDayHour);
  const time = instant.getTime();
  let offset = 0;

  for (const segment of segments) {
    if (time <= segment.start) {
      return offset;
    }
    if (time < segment.end) {
      return offset + (time - segment.start);
    }
    offset += segment.end - segment.start;
  }

  return offset;
};

export const getExtraCellCount = (
  wallMs: number,
  extraMs: number,
  cellDurationMs: number,
): number => {
  if (extraMs <= 0 || cellDurationMs <= 0 || wallMs <= 0) {
    return 0;
  }

  return Math.ceil((wallMs + extraMs) / cellDurationMs) - Math.ceil(wallMs / cellDurationMs);
};

const isHiddenDay = (day: Date, skippedDays: number[], skipHiddenDays: boolean): boolean => (
  skipHiddenDays && skippedDays.includes(day.getDay())
);

export const getCumulativeFallbackShiftMs = (
  viewStart: Date,
  instant: Date,
  startDayHour: number,
  endDayHour: number,
  skippedDays: number[],
  skipHiddenDays: boolean,
): number => {
  if (instant.getTime() <= viewStart.getTime()) {
    return 0;
  }

  let total = 0;
  const day = localMidnight(viewStart);
  const instantDay = localMidnight(instant).getTime();

  while (day.getTime() < instantDay) {
    if (!isHiddenDay(day, skippedDays, skipHiddenDays)) {
      total += getVisibleFallbackMs(day, startDayHour, endDayHour);
    }
    day.setDate(day.getDate() + 1);
  }

  if (!isHiddenDay(day, skippedDays, skipHiddenDays)) {
    const extraMs = getVisibleFallbackMs(day, startDayHour, endDayHour);
    const transition = findFallbackInstant(day);
    if (extraMs > 0 && transition !== undefined && instant.getTime() >= transition) {
      total += extraMs;
    }
  }

  return total;
};

interface LayoutOptions {
  from: Date;
  to: Date;
  startDayHour: number;
  endDayHour: number;
  cellDurationMs: number;
  nominalCellCount: number;
  skippedDays: number[];
  visibleDayCount: number;
  skipHiddenDays: boolean;
}

const rangeVisualMs = (
  extraMs: number,
  wallMs: number,
  cellDurationMs: number,
  nominalCellCount: number,
): { visualMs: number; elapsedMs: number } => {
  const extraCells = getExtraCellCount(wallMs, extraMs, cellDurationMs);
  return {
    visualMs: (nominalCellCount + extraCells) * cellDurationMs,
    elapsedMs: wallMs + extraMs,
  };
};

const positionInRange = (
  elapsedIntoRange: number,
  elapsedMs: number,
  visualMs: number,
  cellDurationMs: number,
): number => {
  if (elapsedIntoRange >= elapsedMs) {
    return visualMs;
  }

  const completeCells = Math.floor(elapsedMs / cellDurationMs);
  if (elapsedIntoRange <= completeCells * cellDurationMs) {
    return elapsedIntoRange;
  }

  const intoPartial = elapsedIntoRange - completeCells * cellDurationMs;
  const partialMs = elapsedMs - completeCells * cellDurationMs;
  const fraction = partialMs === 0 ? 0 : intoPartial / partialMs;

  return completeCells * cellDurationMs + fraction * cellDurationMs;
};

/**
 * Visual distance from the start of the timeline to `to`.
 * Fallback days contribute their extra cells. Other days keep wall-clock cells,
 * including a spring-forward gap, so a later fallback does not cancel that gap.
 */
export const getRepeatedHourLayoutMs = ({
  from,
  to,
  startDayHour,
  endDayHour,
  cellDurationMs,
  nominalCellCount,
  skippedDays,
  visibleDayCount,
  skipHiddenDays,
}: LayoutOptions): number => {
  if (cellDurationMs <= 0 || to.getTime() <= from.getTime()) {
    return 0;
  }

  const wallMs = (endDayHour - startDayHour) * HOUR_MS;
  let visual = 0;
  const day = localMidnight(from);
  let seen = 0;

  while (seen < visibleDayCount) {
    if (isHiddenDay(day, skippedDays, skipHiddenDays)) {
      day.setDate(day.getDate() + 1);
    } else {
      const rangeStart = atHour(day, startDayHour);
      const rangeEnd = visibleRangeEnd(day, endDayHour);
      const extraMs = getVisibleFallbackMs(day, startDayHour, endDayHour);
      const rangeMetrics = rangeVisualMs(
        extraMs,
        wallMs,
        cellDurationMs,
        nominalCellCount,
      );
      const { visualMs, elapsedMs } = rangeMetrics;

      if (to.getTime() <= rangeStart.getTime()) {
        break;
      }

      if (to.getTime() < rangeEnd.getTime()) {
        const intoRange = extraMs > 0
          ? getVisibleOffsetMs(day, startDayHour, endDayHour, to)
          : Math.min(Math.max(wallClockMs(to) - wallClockMs(rangeStart), 0), elapsedMs);
        visual += positionInRange(intoRange, elapsedMs, visualMs, cellDurationMs);
        break;
      }

      visual += visualMs;
      seen += 1;
      day.setDate(day.getDate() + 1);

      if (seen >= visibleDayCount) {
        break;
      }

      const next = new Date(day);
      while (isHiddenDay(next, skippedDays, skipHiddenDays)) {
        next.setDate(next.getDate() + 1);
      }
      if (to.getTime() < atHour(next, startDayHour).getTime()) {
        break;
      }
    }
  }

  return visual;
};

export const shiftRepeatedHourTimestamp = (
  dateUtc: number,
  sourceDate: number | undefined,
  viewStartUtc: number,
  startDayHour: number,
  endDayHour: number,
  skippedDays: number[],
  skipHiddenDays: boolean,
): number => {
  if (sourceDate === undefined) {
    return dateUtc;
  }

  const viewStart = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(viewStartUtc));
  const shift = getCumulativeFallbackShiftMs(
    viewStart,
    new Date(sourceDate),
    startDayHour,
    endDayHour,
    skippedDays,
    skipHiddenDays,
  );

  return dateUtc + shift;
};

export const clampToNextLocalMidnight = (startDate: Date, endDate: Date): Date => {
  const nextDay = nextMidnight(startDate);
  if (startDate.getTime() < nextDay.getTime() && endDate.getTime() > nextDay.getTime()) {
    return nextDay;
  }

  return endDate;
};
