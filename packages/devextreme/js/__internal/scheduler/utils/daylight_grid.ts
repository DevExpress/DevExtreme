import dateUtils from '@js/core/utils/date';

import type { TimeZoneCalculator } from '../r1/timezone_calculator/calculator';

const toMs = dateUtils.dateToMilliseconds;
const MINUTE_MS = toMs('minute');
const HOUR_MS = toMs('hour');
const MINUTES_IN_DAY = 24 * 60;
const SCAN_STEP_MS = 30 * MINUTE_MS;
const TRANSITION_CACHE_LIMIT = 1024;

/**
 * Elapsed-time grid for one Scheduler view.
 *
 * Wall-clock labels and true instants coincide on an ordinary day, so a range
 * with no DST transition produces no plan and the caller keeps the wall-clock
 * layout. `start` / `end` are grid dates (the wall clock, in local fields);
 * `startUTC` / `endUTC` are the instants those labels stand for.
 */

/**
 * A DST transition owned by one Scheduler-zone day.
 *
 * `deltaMs` is the offset after the jump minus the offset before it: negative
 * for a fall-back, where the wall clock repeats `-deltaMs`, positive for a
 * spring-forward, where `deltaMs` of wall clock never happens.
 */
export interface DaylightTransition {
  instant: Date;
  deltaMs: number;
  /**
   * Minutes from local midnight to the jump.
   * 1440 when the jump is the following midnight, so a fall-back at 00:00
   * belongs to the previous day and that day runs until wall 24:00.
   */
  wallBeforeMinutes: number;
  /** UTC instant of wall 00:00 on the day that owns the jump. */
  anchorUTC: number;
}

/** One cell: an interval of elapsed time and the wall clock it shows. */
export interface DaylightCell {
  startUTC: number;
  endUTC: number;
  start: Date;
  end: Date;
}

export interface DaylightPlanDay {
  transition?: DaylightTransition;
  cells: DaylightCell[];
  /** UTC instant of wall 00:00 on this day. */
  anchorUTC: number;
  /** Wall clock of the day's first visible hour, as a wall-clock-in-UTC timestamp. */
  wallStartMs: number;
  /** Elapsed time this day's cells cover. */
  elapsedMs: number;
  /** Elapsed time earlier days added on top of their wall-clock span. */
  shiftBeforeMs: number;
  /** Index of this day's first cell within the view. */
  firstCellIndex: number;
}

export interface DaylightPlan {
  days: DaylightPlanDay[];
  wallSpanMs: number;
  cellDurationMs: number;
  startDayHour: number;
  endDayHour: number;
  cellCount: number;
}

/** A wall clock read off a grid date, as a wall-clock-in-UTC timestamp. */
export const toWallMs = (date: Date): number => Date.UTC(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
  date.getSeconds(),
  date.getMilliseconds(),
);

const isSameCalendarDay = (first: Date, second: Date): boolean => (
  first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate()
);

const getOffsetMs = (date: Date, calculator?: TimeZoneCalculator): number => (calculator
  ? calculator.getOffsets(date, undefined).common * HOUR_MS
  : -date.getTimezoneOffset() * MINUTE_MS);

/** The Scheduler-zone wall clock of an instant, as a grid date. */
const toGrid = (utcMs: number, calculator?: TimeZoneCalculator): Date => (calculator
  ? calculator.createDate(new Date(utcMs), 'toGrid')
  : new Date(utcMs));

/** UTC instant of wall 00:00 on `day`. Exact whenever that midnight is unambiguous. */
const resolveAnchor = (day: Date, calculator?: TimeZoneCalculator): number => {
  const wallMs = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate());
  const firstGuess = wallMs - getOffsetMs(new Date(wallMs), calculator);

  return wallMs - getOffsetMs(new Date(firstGuess), calculator);
};

const locateOffsetChange = (
  lowTime: number,
  highTime: number,
  offset: number,
  calculator?: TimeZoneCalculator,
): number => {
  let low = lowTime;
  let high = highTime;

  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (getOffsetMs(new Date(middle), calculator) === offset) {
      low = middle;
    } else {
      high = middle;
    }
  }

  return high;
};

const detectTransition = (
  day: Date,
  calculator?: TimeZoneCalculator,
): DaylightTransition | undefined => {
  const scanStart = resolveAnchor(day, calculator) - 12 * HOUR_MS;
  const scanEnd = scanStart + 48 * HOUR_MS;
  let previousTime = scanStart;
  let previousOffset = getOffsetMs(new Date(previousTime), calculator);

  for (let time = scanStart + SCAN_STEP_MS; time <= scanEnd; time += SCAN_STEP_MS) {
    const offset = getOffsetMs(new Date(time), calculator);

    if (offset === previousOffset) {
      previousTime = time;
    } else {
      const instantMs = locateOffsetChange(previousTime, time, previousOffset, calculator);
      const offsetAfter = getOffsetMs(new Date(instantMs), calculator);
      const deltaMs = offsetAfter - previousOffset;
      const wallAfter = toGrid(instantMs, calculator);
      // Local fields of the grid date skip an hour when this addition crosses
      // the browser's own transition. The zone offset does not.
      const wallClock = new Date(instantMs + offsetAfter);
      const wallAfterMinutes = wallClock.getUTCHours() * 60 + wallClock.getUTCMinutes();
      const wallBeforeMinutes = wallAfterMinutes - deltaMs / MINUTE_MS;

      // The day that shows the new wall clock owns the jump. A midnight fall-back
      // is shown as 23:00 on the previous day, so the day of the nominal date does not.
      if (isSameCalendarDay(wallAfter, day)) {
        return {
          instant: new Date(instantMs),
          deltaMs,
          wallBeforeMinutes,
          anchorUTC: instantMs - wallBeforeMinutes * MINUTE_MS,
        };
      }

      // Resume at the jump. The offset at the end of this coarse step may already
      // include a later jump, and reading it here would hide that jump.
      previousOffset = offsetAfter;
      previousTime = instantMs;
    }
  }

  return undefined;
};

const transitionCache = new Map<string, DaylightTransition | undefined>();

/** The single DST jump inside one Scheduler-zone day, memoized by zone and calendar day. */
export const findDaylightTransition = (
  day: Date,
  calculator?: TimeZoneCalculator,
): DaylightTransition | undefined => {
  const key = `${calculator?.options.timeZone ?? ''}|${day.getFullYear()}|${day.getMonth()}|${day.getDate()}`;

  if (!transitionCache.has(key)) {
    if (transitionCache.size >= TRANSITION_CACHE_LIMIT) {
      transitionCache.clear();
    }
    transitionCache.set(key, detectTransition(day, calculator));
  }

  return transitionCache.get(key);
};

const appendCells = (
  cells: DaylightCell[],
  anchorUTC: number,
  startElapsed: number,
  endElapsed: number,
  cellDurationMs: number,
  calculator?: TimeZoneCalculator,
): void => {
  let cursor = startElapsed;

  while (cursor < endElapsed) {
    const next = Math.min(cursor + cellDurationMs, endElapsed);
    const startUTC = anchorUTC + cursor;
    const endUTC = anchorUTC + next;

    cells.push({
      startUTC,
      endUTC,
      start: toGrid(startUTC, calculator),
      end: toGrid(endUTC, calculator),
    });
    cursor = next;
  }
};

/**
 * Cells of one Scheduler-zone day, clipped to the visible hours.
 *
 * Elapsed time and wall clock run together up to the jump and are `deltaMs`
 * apart after it, so a repeated hour is emitted twice and a skipped one is not.
 * A cell that meets the jump keeps only the elapsed time that actually happens,
 * and may be shorter than `cellDurationMs`.
 */
export const buildDayCells = (
  day: Date,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
  calculator?: TimeZoneCalculator,
): { cells: DaylightCell[]; transition?: DaylightTransition; anchorUTC: number } => {
  const transition = findDaylightTransition(day, calculator);
  const anchorUTC = transition?.anchorUTC ?? resolveAnchor(day, calculator);

  if (!(cellDurationMs > 0) || endDayHour <= startDayHour) {
    return { cells: [], anchorUTC };
  }

  const startMinutes = Math.round(startDayHour * 60);
  const endMinutes = endDayHour >= 24 ? MINUTES_IN_DAY : Math.round(endDayHour * 60);
  const cells: DaylightCell[] = [];

  if (!transition) {
    appendCells(
      cells,
      anchorUTC,
      startMinutes * MINUTE_MS,
      endMinutes * MINUTE_MS,
      cellDurationMs,
      calculator,
    );

    return { cells, anchorUTC };
  }

  const deltaMinutes = transition.deltaMs / MINUTE_MS;
  const { wallBeforeMinutes } = transition;
  const wallAfterMinutes = wallBeforeMinutes + deltaMinutes;
  const beforeEnd = Math.min(endMinutes, wallBeforeMinutes);

  if (startMinutes < beforeEnd) {
    appendCells(
      cells,
      anchorUTC,
      startMinutes * MINUTE_MS,
      beforeEnd * MINUTE_MS,
      cellDurationMs,
      calculator,
    );
  }

  const afterStart = Math.max(startMinutes, wallAfterMinutes);

  if (afterStart < endMinutes) {
    appendCells(
      cells,
      anchorUTC,
      (afterStart - deltaMinutes) * MINUTE_MS,
      (endMinutes - deltaMinutes) * MINUTE_MS,
      cellDurationMs,
      calculator,
    );
  }

  return { cells, transition, anchorUTC };
};

/**
 * Visible day starts, as grid dates, skipping the hidden week days.
 * Callers pass the result to the plan in chronological order.
 */
export const visibleDayOrigins = (
  startViewDate: Date,
  dayCount: number,
  skippedDays: number[],
  startDayHour: number,
): Date[] => {
  const { hours, minutes } = dateUtils.dateTimeFromDecimal(startDayHour);
  const origins: Date[] = [];
  const day = new Date(
    startViewDate.getFullYear(),
    startViewDate.getMonth(),
    startViewDate.getDate(),
  );

  while (origins.length < dayCount) {
    if (!skippedDays.includes(day.getDay())) {
      origins.push(new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        hours,
        minutes,
      ));
    }
    day.setDate(day.getDate() + 1);
  }

  return origins;
};

/**
 * The grid of one view, day by day. `origins` are chronological grid dates.
 * Returns undefined unless a day owns a DST transition — every other view keeps
 * the plain wall-clock layout.
 */
export const buildDaylightPlan = (
  origins: Date[],
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
  calculator?: TimeZoneCalculator,
): DaylightPlan | undefined => {
  if (cellDurationMs <= 0 || endDayHour <= startDayHour || origins.length === 0) {
    return undefined;
  }

  const wallSpanMs = (endDayHour - startDayHour) * HOUR_MS;
  let shiftBeforeMs = 0;
  let firstCellIndex = 0;
  let hasTransition = false;

  const days = origins.map((origin) => {
    const { cells, transition, anchorUTC } = buildDayCells(
      origin,
      startDayHour,
      endDayHour,
      cellDurationMs,
      calculator,
    );
    const elapsedMs = cells.reduce((sum, cell) => sum + (cell.endUTC - cell.startUTC), 0);
    const day: DaylightPlanDay = {
      transition,
      cells,
      anchorUTC,
      wallStartMs: toWallMs(origin),
      elapsedMs,
      shiftBeforeMs,
      firstCellIndex,
    };

    hasTransition = hasTransition || Boolean(transition);
    shiftBeforeMs += elapsedMs - wallSpanMs;
    firstCellIndex += cells.length;

    return day;
  });

  return hasTransition
    ? {
      days,
      wallSpanMs,
      cellDurationMs,
      startDayHour,
      endDayHour,
      cellCount: firstCellIndex,
    }
    : undefined;
};

/** The same plan for a date range given as wall-clock-in-UTC timestamps. */
export const buildDaylightPlanForRange = (
  rangeMin: number,
  rangeMax: number,
  startDayHour: number,
  endDayHour: number,
  cellDurationMs: number,
  skippedDays: number[],
  calculator?: TimeZoneCalculator,
): DaylightPlan | undefined => {
  const start = new Date(rangeMin);
  const origins: Date[] = [];
  const day = new Date(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const { hours, minutes } = dateUtils.dateTimeFromDecimal(startDayHour);

  while (Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) < rangeMax) {
    if (!skippedDays.includes(day.getDay())) {
      origins.push(new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        hours,
        minutes,
      ));
    }
    day.setDate(day.getDate() + 1);
  }

  return buildDaylightPlan(origins, startDayHour, endDayHour, cellDurationMs, calculator);
};

export const getPlanCell = (plan: DaylightPlan, cellIndex: number): DaylightCell | undefined => {
  if (cellIndex < 0 || cellIndex >= plan.cellCount) {
    return undefined;
  }

  const dayIndex = plan.days.findIndex(
    (day) => cellIndex < day.firstCellIndex + day.cells.length,
  );

  return dayIndex < 0
    ? undefined
    : plan.days[dayIndex].cells[cellIndex - plan.days[dayIndex].firstCellIndex];
};

/** The last day that starts at or before `wallMs`, or undefined when none does. */
const findDay = (plan: DaylightPlan, wallMs: number): DaylightPlanDay | undefined => {
  for (let index = plan.days.length - 1; index >= 0; index -= 1) {
    if (plan.days[index].wallStartMs <= wallMs) {
      return plan.days[index];
    }
  }

  return undefined;
};

/**
 * Elapsed time a wall clock is worth inside its own day, beyond the wall clock itself.
 * `isSecondOccurrence` picks between the two readings of a repeated hour.
 */
const shiftInsideDay = (
  transition: DaylightTransition | undefined,
  wallMsInDay: number,
  isSecondOccurrence: boolean,
): number => {
  if (!transition) {
    return 0;
  }

  const { deltaMs, wallBeforeMinutes } = transition;
  const beforeMs = wallBeforeMinutes * MINUTE_MS;
  const afterMs = beforeMs + deltaMs;

  if (deltaMs < 0) {
    const isRepeated = wallMsInDay >= afterMs && wallMsInDay < beforeMs;

    return wallMsInDay >= beforeMs || (isRepeated && isSecondOccurrence) ? -deltaMs : 0;
  }

  if (wallMsInDay >= afterMs) {
    return -deltaMs;
  }

  // A wall clock inside the skipped range never happens; keep it at the jump.
  return wallMsInDay > beforeMs ? beforeMs - wallMsInDay : 0;
};

/**
 * Whether `sourceUTC` falls in the interval a fall-back plays a second time.
 * Any other instant, including the start of a recurrent series, stays on the first pass.
 */
const isSecondPass = (transition: DaylightTransition, sourceUTC: number | undefined): boolean => {
  const jumpMs = transition.instant.getTime();

  return sourceUTC !== undefined && sourceUTC >= jumpMs && sourceUTC < jumpMs - transition.deltaMs;
};

/**
 * How far a wall clock sits from its nominal place once the repeated hours before it
 * are laid out as time of their own. `sourceUTC` is the instant the wall clock came
 * from, and is used only to tell the two passes of a repeated hour apart.
 */
export const getStretchShiftMs = (
  plan: DaylightPlan | undefined,
  wallMs: number,
  sourceUTC?: number,
): number => {
  const day = plan && findDay(plan, wallMs);

  if (!day) {
    return 0;
  }

  const wallMsInDay = wallMs - (day.wallStartMs - plan.startDayHour * HOUR_MS);

  if (wallMsInDay >= plan.startDayHour * HOUR_MS + plan.wallSpanMs) {
    return day.shiftBeforeMs + day.elapsedMs - plan.wallSpanMs;
  }

  return day.shiftBeforeMs + shiftInsideDay(
    day.transition,
    wallMsInDay,
    day.transition !== undefined && isSecondPass(day.transition, sourceUTC),
  );
};

/** Wall-clock position of a cell once repeated hours take their own space. */
export const cellLayoutRange = (
  plan: DaylightPlan,
  cell: DaylightCell,
): { min: number; max: number } => {
  const startWall = toWallMs(cell.start);
  const endWall = toWallMs(cell.end);

  return {
    min: startWall + getStretchShiftMs(plan, startWall, cell.startUTC),
    max: endWall + getStretchShiftMs(plan, endWall, cell.endUTC),
  };
};

/**
 * Position of a wall clock along the time axis. Every cell counts as one,
 * including a cell the jump cut shorter than the configured duration.
 * The same index is a column on a timeline and a row in a vertical view.
 */
export const getColumnByWallMs = (
  plan: DaylightPlan,
  wallMs: number,
  sourceUTC?: number,
): number => {
  const day = findDay(plan, wallMs);

  if (!day) {
    return 0;
  }

  const shift = getStretchShiftMs(plan, wallMs, sourceUTC) - day.shiftBeforeMs;
  const instantUTC = day.anchorUTC
    + (wallMs - (day.wallStartMs - plan.startDayHour * HOUR_MS))
    + shift;

  for (let index = 0; index < day.cells.length; index += 1) {
    const cell = day.cells[index];

    if (instantUTC < cell.endUTC) {
      const duration = cell.endUTC - cell.startUTC;
      const inside = instantUTC <= cell.startUTC || duration <= 0
        ? 0
        : (instantUTC - cell.startUTC) / duration;

      return day.firstCellIndex + index + inside;
    }
  }

  return day.firstCellIndex + day.cells.length;
};

/** Whether a cell shows a wall clock that its day passes through twice. */
export const isRepeatedCell = (plan: DaylightPlan, startUTC: number): boolean => plan.days.some(
  ({ transition, anchorUTC }) => {
    if (!transition || transition.deltaMs >= 0) {
      return false;
    }

    const jumpUTC = anchorUTC + transition.wallBeforeMinutes * MINUTE_MS;

    return startUTC >= jumpUTC + transition.deltaMs && startUTC < jumpUTC - transition.deltaMs;
  },
);
