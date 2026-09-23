import { createTimeZoneCalculator } from '../../../../r1/timezone_calculator';
import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator/calculator';
import type { DaylightPlan } from '../../../../utils/daylight_grid';
import { findDaylightTransition } from '../../../../utils/daylight_grid';

export interface DateInformation {
  offsetMs: number;
  isUnreachableTime: boolean;
  /** True at the jump itself, the first instant of a fall-back's second pass. */
  isDoubleTimeStart: boolean;
  deltaMs: number;
}

const HOUR_MS = 60 * 60 * 1000;
const calculators = new Map<string, TimeZoneCalculator>();

const calculatorFor = (timeZone: string): TimeZoneCalculator => {
  const cached = calculators.get(timeZone);

  if (cached) {
    return cached;
  }

  const calculator = createTimeZoneCalculator(timeZone);
  calculators.set(timeZone, calculator);

  return calculator;
};

const offsetAt = (calculator: TimeZoneCalculator, instant: number): number => (
  calculator.getOffsets(new Date(instant), undefined).common * HOUR_MS
);

/**
 * Offset of one instant in a Scheduler zone.
 * The scale detector is the only DST cache: `findDaylightTransition` memoizes by zone and day.
 * A wall clock inside a repeated hour keeps the pre-transition offset when
 * `resolveFirstPass` is used. An explicit appointment instant does not go through it.
 */
export const getDateInformation = (date: number, timeZone: string): DateInformation => {
  const calculator = calculatorFor(timeZone);
  const grid = calculator.createDate(new Date(date), 'toGrid');
  const transition = findDaylightTransition(grid, calculator);

  if (!transition) {
    return {
      offsetMs: offsetAt(calculator, date),
      isUnreachableTime: false,
      isDoubleTimeStart: false,
      deltaMs: 0,
    };
  }

  const jump = transition.instant.getTime();
  const { deltaMs } = transition;
  const beforeOffset = offsetAt(calculator, jump - 1);
  const afterOffset = offsetAt(calculator, jump);
  const useBefore = deltaMs > 0
    ? date < jump + deltaMs
    : date < jump;

  return {
    offsetMs: useBefore ? beforeOffset : afterOffset,
    isUnreachableTime: deltaMs > 0 && date >= jump && date < jump + deltaMs,
    isDoubleTimeStart: date === jump,
    deltaMs,
  };
};

const isSecondPass = (date: number, timeZone: string): boolean => {
  const calculator = calculatorFor(timeZone);
  const grid = calculator.createDate(new Date(date), 'toGrid');
  const transition = findDaylightTransition(grid, calculator);

  if (!transition || transition.deltaMs >= 0) {
    return false;
  }

  const jump = transition.instant.getTime();

  return date >= jump && date < jump - transition.deltaMs;
};

/**
 * `FREQ=DAILY` (and any other occurrence) that lands in a repeated hour
 * takes the first pass: the pre-transition offset, one hour earlier.
 */
export const resolveFirstPass = (
  date: number,
  timeZone: string,
): { instant: number; info: DateInformation } => {
  const info = getDateInformation(date, timeZone);

  if (!isSecondPass(date, timeZone)) {
    return { instant: date, info };
  }

  const instant = date + info.deltaMs;

  return {
    instant,
    info: getDateInformation(instant, timeZone),
  };
};

export const getDateOffsetMs = (
  date: number,
  timeZone?: string,
): number => (timeZone ? getDateInformation(date, timeZone).offsetMs : 0);

/** True when this instant sits on a transition day the visible view already lays out. */
export const isCoveredByDaylightPlan = (
  plan: DaylightPlan | undefined,
  instant: number,
): boolean => Boolean(plan?.days.some((day) => {
  if (!day.transition) {
    return false;
  }

  const length = 24 * HOUR_MS - day.transition.deltaMs;

  return instant >= day.anchorUTC && instant < day.anchorUTC + length;
}));
