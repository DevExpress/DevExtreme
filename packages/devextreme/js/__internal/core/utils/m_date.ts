import type { TimeInterval, TimeIntervalConfig } from '@js/common/charts';
import dateSerialization from '@js/core/utils/date_serialization';
import { each } from '@js/core/utils/iterator';
import { adjust } from '@js/core/utils/math';
import {
  isDate, isDefined, isNumeric, isObject, isString,
} from '@js/core/utils/type';
import type { WeekNumberRule } from '@js/ui/calendar';
import { toMilliseconds } from '@ts/utils/toMilliseconds';

type DateInterval = Exclude<TimeIntervalConfig, number | string | undefined>;

type DateView = 'month' | 'year' | 'decade' | 'century';

type DateUnitSource = TimeIntervalConfig | Partial<Record<TimeInterval, unknown>>;

interface DatesDifferences {
  year: boolean;
  month: boolean;
  day: boolean;
  hour: boolean;
  minute: boolean;
  second: boolean;
  millisecond: boolean;
  count: number;
}

type MaybeDate = Date | null | undefined;

const DAYS_IN_WEEK = 7;
const THURSDAY_WEEK_NUMBER = 4;
const SUNDAY_WEEK_NUMBER = 7;
const USUAL_WEEK_COUNT_IN_YEAR = 52;

const dateUnitIntervals: TimeInterval[] = [
  'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year',
];

function convertDateUnitToMilliseconds(dateUnit: TimeInterval, count: number): number {
  return toMilliseconds(dateUnit) * count;
}

function getDateUnitInterval(tickInterval: DateUnitSource): TimeInterval | '' | undefined {
  let maxInterval = -1;

  if (isString(tickInterval)) {
    return tickInterval;
  }

  if (isObject(tickInterval)) {
    each(tickInterval, (key: string, value: unknown) => {
      for (let i = 0; i < dateUnitIntervals.length; i += 1) {
        if (value && (key === `${dateUnitIntervals[i]}s` || key === dateUnitIntervals[i]) && maxInterval < i) {
          maxInterval = i;
        }
      }
    });

    return dateUnitIntervals[maxInterval];
  }
  return '';
}

const dateIntervalByUnit: Partial<Record<string, DateInterval>> = {
  year: { years: 1 },
  month: { months: 1 },
  quarter: { months: 3 },
  week: { weeks: 1 },
  day: { days: 1 },
  hour: { hours: 1 },
  minute: { minutes: 1 },
  second: { seconds: 1 },
  millisecond: { milliseconds: 1 },
};

function getDateIntervalByString(intervalString: string): DateInterval {
  return { ...dateIntervalByUnit[intervalString] };
}

const createDateWithFullYear = function createDateWithFullYear(
  year: number,
  ...args: [
    monthIndex: number, date?: number, hours?: number,
    minutes?: number, seconds?: number, ms?: number,
  ]
): Date {
  const result = new Date(year, ...args);
  result.setFullYear(year);
  return result;
};

function getLastMonthDay(date: Date): number {
  const resultDate = createDateWithFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return resultDate.getDate();
}

function getFirstDecadeInCentury(date: Date): number;
function getFirstDecadeInCentury(date: MaybeDate): number | null | undefined;
function getFirstDecadeInCentury(date: MaybeDate): number | null | undefined {
  return date && date.getFullYear() - (date.getFullYear() % 100);
}

function getFirstYearInDecade(date: Date): number;
function getFirstYearInDecade(date: MaybeDate): number | null | undefined;
function getFirstYearInDecade(date: MaybeDate): number | null | undefined {
  return date && date.getFullYear() - (date.getFullYear() % 10);
}

function getFirstWeekDate(date: Date, firstDayOfWeek: number): Date {
  const delta = (date.getDay() - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;

  const result = new Date(date);
  result.setDate(date.getDate() - delta);

  return result;
}

function getFirstDateInYear(year: number): Date {
  return new Date(year, 0, 1);
}

function fixTimezoneGap(oldDate: MaybeDate, newDate: Date): void {
  // NOTE: T182866
  if (!isDefined(oldDate)) {
    return;
  }

  const diff = newDate.getHours() - oldDate.getHours();

  if (diff === 0) {
    return;
  }

  const sign = diff === 1 || diff === -23 ? -1 : 1;
  const trial = new Date(newDate.getTime() + sign * 3600000);

  if (sign > 0 || trial.getDate() === newDate.getDate()) {
    newDate.setTime(trial.getTime());
  }
}

function getTimezonesDifference(min: Date, max: Date): number {
  return (max.getTimezoneOffset() - min.getTimezoneOffset()) * 60 * 1000;
}

function normalizeDate<T extends Date | number>(date: T, min?: T | null, max?: T | null): T;
function normalizeDate<T extends Date | number>(
  date: T | null | undefined,
  min?: T | null,
  max?: T | null,
): T | null | undefined;
function normalizeDate(
  date: Date | number | null | undefined,
  min?: Date | number | null,
  max?: Date | number | null,
): Date | number | null | undefined {
  let normalizedDate = date;

  if (!isDefined(date)) {
    return date;
  }

  if (isDefined(min) && date < min) {
    normalizedDate = min;
  }

  if (isDefined(max) && date > max) {
    normalizedDate = max;
  }

  return normalizedDate;
}

const getDatesInterval = function getDatesInterval(
  startDate: Date,
  endDate: Date,
  intervalUnit: TimeInterval,
): number {
  const delta = endDate.getTime() - startDate.getTime();
  const millisecondCount = toMilliseconds(intervalUnit) || 1;

  return Math.floor(delta / millisecondCount);
};

const getNextDateUnit = function getNextDateUnit(
  unit: DateUnitSource,
  withWeeks?: boolean,
): TimeInterval | 0 {
  const interval = getDateUnitInterval(unit);

  switch (interval) {
    case 'millisecond':
      return 'second';
    case 'second':
      return 'minute';
    case 'minute':
      return 'hour';
    case 'hour':
      return 'day';
    case 'day':
      return withWeeks ? 'week' : 'month';
    case 'week':
      return 'month';
    case 'month':
      return 'quarter';
    case 'quarter':
      return 'year';
    case 'year':
      return 'year';
    default:
      return 0;
  }
};

const convertMillisecondsToDateUnits = function convertMillisecondsToDateUnits(
  value: number,
): DateInterval {
  const units = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'] as const;
  const result: DateInterval = {};
  let rest = value;

  for (let i = units.length - 1; i >= 0; i -= 1) {
    const dateUnitInterval = units[i];
    const dateUnitCount = Math.floor(rest / toMilliseconds(dateUnitInterval));
    if (dateUnitCount > 0) {
      result[`${dateUnitInterval}s`] = dateUnitCount;
      rest -= convertDateUnitToMilliseconds(dateUnitInterval, dateUnitCount);
    }
  }
  return result;
};

const unitByIntervalKey: Record<keyof DateInterval, TimeInterval> = {
  milliseconds: 'millisecond',
  seconds: 'second',
  minutes: 'minute',
  hours: 'hour',
  days: 'day',
  weeks: 'week',
  months: 'month',
  quarters: 'quarter',
  years: 'year',
};

const dateToMilliseconds = function dateToMilliseconds(tickInterval: TimeIntervalConfig): number {
  let milliseconds = 0;
  if (isObject(tickInterval)) {
    each(tickInterval, (key, value) => {
      milliseconds += convertDateUnitToMilliseconds(unitByIntervalKey[key], value);
    });
  }
  if (isString(tickInterval)) {
    milliseconds = convertDateUnitToMilliseconds(tickInterval, 1);
  }
  return milliseconds;
};

// T375972
const tickIntervalToFormatMap: Record<TimeInterval, string> = {
  millisecond: 'millisecond',
  second: 'longtime',
  minute: 'shorttime',
  hour: 'shorttime',
  day: 'day',
  week: 'day',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

function getDateFormatByTickInterval(tickInterval: DateUnitSource): string {
  const dateUnitInterval = getDateUnitInterval(tickInterval);
  return (dateUnitInterval && tickIntervalToFormatMap[dateUnitInterval]) ?? '';
}

const getQuarter = function getQuarter(month: number): number {
  return Math.floor(month / 3);
};

const getFirstQuarterMonth = function getFirstQuarterMonth(month: number): number {
  return getQuarter(month) * 3;
};

function correctDateWithUnitBeginning(
  date: Date,
  dateInterval: DateUnitSource,
  withCorrection?: boolean | null,
  firstDayOfWeek?: number,
): Date {
  let result = new Date(date.getTime());
  const oldDate = new Date(date.getTime());
  const dateUnitInterval = getDateUnitInterval(dateInterval);

  switch (dateUnitInterval) {
    case 'second':
      result = new Date(Math.floor(oldDate.getTime() / 1000) * 1000);
      break;
    case 'minute':
      result = new Date(Math.floor(oldDate.getTime() / 60000) * 60000);
      break;
    case 'hour':
      result = new Date(Math.floor(oldDate.getTime() / 3600000) * 3600000);
      break;
    case 'year':
      result.setMonth(0);
      /* falls through */
    case 'month':
      result.setDate(1);
      /* falls through */
    case 'day':
      result.setHours(0, 0, 0, 0);
      break;
    case 'week':
      result = getFirstWeekDate(result, firstDayOfWeek || 0);
      result.setHours(0, 0, 0, 0);
      break;
    case 'quarter': {
      const firstQuarterMonth = getFirstQuarterMonth(result.getMonth());
      const month = result.getMonth();

      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      if (month !== firstQuarterMonth) {
        result.setMonth(firstQuarterMonth);
      }
      break;
    }
    default:
      break;
  }

  if (withCorrection && dateUnitInterval !== 'hour' && dateUnitInterval !== 'minute' && dateUnitInterval !== 'second') {
    fixTimezoneGap(oldDate, result);
  }
  return result;
}

function trimTime(date: Date): Date {
  return correctDateWithUnitBeginning(date, 'day');
}

const setToDayEnd = function setToDayEnd(date: Date): Date {
  const result = trimTime(date);

  result.setDate(result.getDate() + 1);
  return new Date(result.getTime() - 1);
};

const getDatesDifferences = function getDatesDifferences(
  date1: Date,
  date2: Date,
): DatesDifferences {
  let counter = 0;

  const differences: DatesDifferences = {
    year: date1.getFullYear() !== date2.getFullYear(),
    month: date1.getMonth() !== date2.getMonth(),
    day: date1.getDate() !== date2.getDate(),
    hour: date1.getHours() !== date2.getHours(),
    minute: date1.getMinutes() !== date2.getMinutes(),
    second: date1.getSeconds() !== date2.getSeconds(),
    millisecond: date1.getMilliseconds() !== date2.getMilliseconds(),
    count: 0,
  };

  each(differences, (key, value) => {
    if (value) {
      counter += 1;
    }
  });
  if (counter === 0 && getTimezonesDifference(date1, date2) !== 0) {
    differences.hour = true;
    counter += 1;
  }

  differences.count = counter;
  return differences;
};

function toDateInterval(interval: string | number | DateInterval): DateInterval {
  if (isString(interval)) {
    return getDateIntervalByString(interval.toLowerCase());
  }
  if (isNumeric(interval)) {
    return convertMillisecondsToDateUnits(interval);
  }
  return interval;
}

function addDateInterval(value: Date, interval: string | number | DateInterval, dir: number): Date {
  const result = new Date(value.getTime());
  const intervalObject = toDateInterval(interval);
  if (intervalObject.years) {
    result.setFullYear(result.getFullYear() + intervalObject.years * dir);
  }
  if (intervalObject.quarters) {
    result.setMonth(result.getMonth() + 3 * intervalObject.quarters * dir);
  }
  if (intervalObject.months) {
    result.setMonth(result.getMonth() + intervalObject.months * dir);
  }
  if (intervalObject.weeks) {
    result.setDate(result.getDate() + 7 * intervalObject.weeks * dir);
  }
  if (intervalObject.days) {
    result.setDate(result.getDate() + intervalObject.days * dir);
  }
  if (intervalObject.hours) {
    result.setTime(result.getTime() + intervalObject.hours * 3600000 * dir);
  }
  if (intervalObject.minutes) {
    result.setTime(result.getTime() + intervalObject.minutes * 60000 * dir);
  }
  if (intervalObject.seconds) {
    result.setTime(result.getTime() + intervalObject.seconds * 1000 * dir);
  }
  if (intervalObject.milliseconds) {
    result.setTime(result.getTime() + intervalObject.milliseconds * dir);
  }
  return result;
}

function addInterval(
  value: Date,
  interval: string | number | DateInterval,
  isNegative?: boolean,
): Date;
function addInterval(value: number, interval: number, isNegative?: boolean): number;
function addInterval(
  value: Date | number,
  interval: string | number | DateInterval,
  isNegative?: boolean,
): Date | number;
function addInterval(
  value: Date | number,
  interval: string | number | DateInterval,
  isNegative?: boolean,
): Date | number {
  const dir = isNegative ? -1 : +1;
  return isDate(value)
    ? addDateInterval(value, interval, dir)
    : adjust(value + Number(interval) * dir, Number(interval));
}

const getSequenceByInterval = function getSequenceByInterval(
  min: Date | number,
  max: Date | number,
  interval: string | number | DateInterval,
): (Date | number)[] {
  const intervals: (Date | number)[] = [];
  let cur = min;

  intervals.push(isDate(min) ? new Date(min.getTime()) : min);
  while (cur < max) {
    cur = addInterval(cur, interval);
    intervals.push(cur);
  }
  return intervals;
};

const getViewFirstCellDate = function getViewFirstCellDate(
  viewType: string | undefined,
  date: Date,
): Date | undefined {
  if (viewType === 'month') { return createDateWithFullYear(date.getFullYear(), date.getMonth(), 1); }
  if (viewType === 'year') { return createDateWithFullYear(date.getFullYear(), 0, date.getDate()); }
  if (viewType === 'decade') {
    return createDateWithFullYear(getFirstYearInDecade(date), date.getMonth(), date.getDate());
  }
  if (viewType === 'century') {
    return createDateWithFullYear(getFirstDecadeInCentury(date), date.getMonth(), date.getDate());
  }
  return undefined;
};

const getViewLastCellDate = function getViewLastCellDate(
  viewType: string | undefined,
  date: Date,
): Date | undefined {
  if (viewType === 'month') {
    return createDateWithFullYear(date.getFullYear(), date.getMonth(), getLastMonthDay(date));
  }
  if (viewType === 'year') { return createDateWithFullYear(date.getFullYear(), 11, date.getDate()); }
  if (viewType === 'decade') {
    return createDateWithFullYear(getFirstYearInDecade(date) + 9, date.getMonth(), date.getDate());
  }
  if (viewType === 'century') {
    return createDateWithFullYear(
      getFirstDecadeInCentury(date) + 90,
      date.getMonth(),
      date.getDate(),
    );
  }
  return undefined;
};

const getViewMinBoundaryDate = function getViewMinBoundaryDate(
  viewType: string | undefined,
  date: Date,
): Date {
  const resultDate = createDateWithFullYear(date.getFullYear(), date.getMonth(), 1);

  if (viewType === 'month') {
    return resultDate;
  }

  resultDate.setMonth(0);

  if (viewType === 'year') {
    return resultDate;
  }

  if (viewType === 'decade') {
    resultDate.setFullYear(getFirstYearInDecade(date));
  }

  if (viewType === 'century') {
    resultDate.setFullYear(getFirstDecadeInCentury(date));
  }

  return resultDate;
};

const getViewMaxBoundaryDate = function getViewMaxBoundaryDate(
  viewType: string | undefined,
  date: Date,
): Date {
  const resultDate = new Date(date);
  resultDate.setDate(getLastMonthDay(date));

  if (viewType === 'month') {
    return resultDate;
  }

  resultDate.setMonth(11);
  resultDate.setDate(getLastMonthDay(resultDate));

  if (viewType === 'year') {
    return resultDate;
  }

  if (viewType === 'decade') {
    resultDate.setFullYear(getFirstYearInDecade(date) + 9);
  }

  if (viewType === 'century') {
    resultDate.setFullYear(getFirstDecadeInCentury(date) + 99);
  }

  return resultDate;
};

const getViewUp = function getViewUp(typeView: string | undefined): DateView | undefined {
  switch (typeView) {
    case 'month':
      return 'year';
    case 'year':
      return 'decade';
    case 'decade':
      return 'century';
    default:
      break;
  }
  return undefined;
};

const getViewDown = function getViewDown(typeView: string | undefined): DateView | undefined {
  switch (typeView) {
    case 'century':
      return 'decade';
    case 'decade':
      return 'year';
    case 'year':
      return 'month';
    default:
      break;
  }
  return undefined;
};

const getDifferenceInMonth = function getDifferenceInMonth(typeView: string | undefined): number {
  let difference = 1;

  if (typeView === 'year') { difference = 12; }
  if (typeView === 'decade') { difference = 12 * 10; }
  if (typeView === 'century') { difference = 12 * 100; }

  return difference;
};

const getDifferenceInMonthForCells = function getDifferenceInMonthForCells(
  typeView: string | undefined,
): number {
  let difference = 1;

  if (typeView === 'decade') { difference = 12; }
  if (typeView === 'century') { difference = 12 * 10; }

  return difference;
};

function sameYear(date1: Date, date2: Date): boolean;
function sameYear(date1: MaybeDate, date2: MaybeDate): boolean | null | undefined;
function sameYear(date1: MaybeDate, date2: MaybeDate): boolean | null | undefined {
  return date1 && date2 && date1.getFullYear() === date2.getFullYear();
}

function sameMonthAndYear(date1: Date, date2: Date): boolean;
function sameMonthAndYear(date1: MaybeDate, date2: MaybeDate): boolean | null | undefined;
function sameMonthAndYear(date1: MaybeDate, date2: MaybeDate): boolean | null | undefined {
  return date1 && date2 && sameYear(date1, date2) && date1.getMonth() === date2.getMonth();
}

function sameDate(date1: Date, date2: Date): boolean;
function sameDate(date1: MaybeDate, date2: MaybeDate): boolean | null | undefined;
function sameDate(date1: MaybeDate, date2: MaybeDate): boolean | null | undefined {
  return date1 && date2 && sameMonthAndYear(date1, date2) && date1.getDate() === date2.getDate();
}

function sameHoursAndMinutes(date1: Date, date2: Date): boolean;
function sameHoursAndMinutes(
  date1: MaybeDate,
  date2: MaybeDate,
): boolean | null | undefined;
function sameHoursAndMinutes(
  date1: MaybeDate,
  date2: MaybeDate,
): boolean | null | undefined {
  return date1 && date2
    && date1.getHours() === date2.getHours()
    && date1.getMinutes() === date2.getMinutes();
}

const sameDecade = function sameDecade(date1: MaybeDate, date2: MaybeDate): boolean {
  if (!isDefined(date1) || !isDefined(date2)) {
    return false;
  }

  const startDecadeDate1 = date1.getFullYear() - (date1.getFullYear() % 10);
  const startDecadeDate2 = date2.getFullYear() - (date2.getFullYear() % 10);

  return date1 && date2 && startDecadeDate1 === startDecadeDate2;
};

const sameCentury = function sameCentury(date1: MaybeDate, date2: MaybeDate): boolean {
  if (!isDefined(date1) || !isDefined(date2)) {
    return false;
  }

  const startCenturyDate1 = date1.getFullYear() - (date1.getFullYear() % 100);
  const startCenturyDate2 = date2.getFullYear() - (date2.getFullYear() % 100);

  return date1 && date2 && startCenturyDate1 === startCenturyDate2;
};

const sameDatesArrays = (arr1: Date[], arr2: Date[]): boolean => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((date1, index) => {
    const date2 = arr2[index];

    if ([date1, date2].some((date) => date !== null && !(date instanceof Date))) {
      return false;
    }

    if (date1 instanceof Date && date2 instanceof Date) {
      return sameDate(date1, date2);
    }

    return date1 === date2;
  });
};

const getShortDateFormat = function getShortDateFormat(): string {
  return 'yyyy/MM/dd';
};

function getFirstMonthDate(date: Date, offset?: number): Date;
function getFirstMonthDate(date: MaybeDate, offset?: number): Date | undefined;
function getFirstMonthDate(date: MaybeDate, offset = 0): Date | undefined {
  if (!isDefined(date)) {
    return undefined;
  }

  const currentDate = new Date(date.getTime());
  const month = currentDate.getMonth() + offset;
  currentDate.setMonth(month);

  return createDateWithFullYear(currentDate.getFullYear(), month, 1);
}

function getLastMonthDate(date: Date, offset?: number): Date;
function getLastMonthDate(date: MaybeDate, offset?: number): Date | undefined;
function getLastMonthDate(date: MaybeDate, offset = 0): Date | undefined {
  if (!isDefined(date)) {
    return undefined;
  }

  const currentDate = new Date(date.getTime());
  const month = currentDate.getMonth() + offset;
  currentDate.setMonth(month);

  return createDateWithFullYear(currentDate.getFullYear(), month + 1, 0);
}

function getUTCTime(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDayNumber(date: Date): number {
  const ms = getUTCTime(date) - getUTCTime(getFirstDateInYear(date.getFullYear()));

  return 1 + Math.floor(ms / toMilliseconds('day'));
}

function getLastDateInYear(year: number): Date {
  return new Date(year, 11, 31);
}

function getDayWeekNumber(date: Date, firstDayOfWeek: number): number {
  let day = date.getDay() - firstDayOfWeek + 1;
  if (day <= 0) {
    day += DAYS_IN_WEEK;
  }

  return day;
}

function getWeekNumber(date: Date, firstDayOfWeek: number, rule: WeekNumberRule): number {
  const firstWeekDayInYear = getDayWeekNumber(
    getFirstDateInYear(date.getFullYear()),
    firstDayOfWeek,
  );
  const lastWeekDayInYear = getDayWeekNumber(getLastDateInYear(date.getFullYear()), firstDayOfWeek);
  const daysInFirstWeek = DAYS_IN_WEEK - firstWeekDayInYear + 1;

  let weekNumber = Math.ceil((getDayNumber(date) - daysInFirstWeek) / 7);
  switch (rule) {
    case 'fullWeek': {
      if (daysInFirstWeek === DAYS_IN_WEEK) {
        weekNumber += 1;
      }
      if (weekNumber === 0) {
        const lastDateInPreviousYear = getLastDateInYear(date.getFullYear() - 1);
        return getWeekNumber(lastDateInPreviousYear, firstDayOfWeek, rule);
      }
      return weekNumber;
    }
    case 'firstDay': {
      if (daysInFirstWeek > 0) {
        weekNumber += 1;
      }

      const isSunday = firstWeekDayInYear === SUNDAY_WEEK_NUMBER
                || lastWeekDayInYear === SUNDAY_WEEK_NUMBER;
      if ((weekNumber > USUAL_WEEK_COUNT_IN_YEAR && !isSunday) || weekNumber === 54) {
        weekNumber = 1;
      }

      return weekNumber;
    }
    case 'firstFourDays': {
      if (daysInFirstWeek > 3) {
        weekNumber += 1;
      }

      const isThursday = firstWeekDayInYear === THURSDAY_WEEK_NUMBER
                || lastWeekDayInYear === THURSDAY_WEEK_NUMBER;
      if (weekNumber > USUAL_WEEK_COUNT_IN_YEAR && !isThursday) {
        weekNumber = 1;
      }

      if (weekNumber === 0) {
        const lastDateInPreviousYear = getLastDateInYear(date.getFullYear() - 1);
        return getWeekNumber(lastDateInPreviousYear, firstDayOfWeek, rule);
      }
      return weekNumber;
    }
    default:
      return weekNumber;
      break;
  }
}

const normalizeDateByWeek = function normalizeDateByWeek(date: Date, currentDate: Date): Date {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- dateUtils is set below
  const differenceInDays = dateUtils.getDatesInterval(date, currentDate, 'day');
  let resultDate = new Date(date);

  if (differenceInDays >= 6) {
    resultDate = new Date(resultDate.setDate(resultDate.getDate() + 7));
  }

  return resultDate;
};

function dateInRange(date: Date, min?: Date | null, max?: Date | null, format?: string): boolean;
function dateInRange(date: number, min?: number | null, max?: number | null): boolean;
function dateInRange(
  date: Date | number,
  min?: Date | number | null,
  max?: Date | number | null,
  format?: string,
): boolean {
  let dateValue = date;
  let minValue = min;
  let maxValue = max;

  if (format === 'date') {
    minValue = isDate(minValue) ? trimTime(minValue) : minValue;
    maxValue = isDate(maxValue) ? trimTime(maxValue) : maxValue;
    dateValue = isDate(dateValue) ? trimTime(dateValue) : dateValue;
  }

  return normalizeDate(dateValue, minValue, maxValue) === dateValue;
}

const intervalsOverlap = function intervalsOverlap(options: {
  firstMin: Date | number;
  firstMax: Date | number;
  secondMin: Date | number;
  secondMax: Date | number;
}): boolean {
  const {
    firstMin,
    firstMax,
    secondMin,
    secondMax,
  } = options;

  return (firstMin <= secondMin && secondMin <= firstMax)
        || (firstMin > secondMin && firstMin < secondMax)
        || (firstMin < secondMax && firstMax > secondMax);
};

const dateTimeFromDecimal = function dateTimeFromDecimal(
  number: number,
): { hours: number; minutes: number } {
  const hours = Math.floor(number);
  const minutes = Math.round((number % 1) * 60);

  return {
    hours,
    minutes,
  };
};

const roundDateByStartDayHour = function roundDateByStartDayHour(
  this: { dateTimeFromDecimal: typeof dateTimeFromDecimal },
  date: Date,
  startDayHour: number,
): Date {
  const startTime = this.dateTimeFromDecimal(startDayHour);
  const result = new Date(date);

  if ((date.getHours() === startTime.hours && date.getMinutes() < startTime.minutes)
    || date.getHours() < startTime.hours) {
    result.setHours(startTime.hours, startTime.minutes, 0, 0);
  }

  return result;
};

const roundToHour = function roundToHour(date: Date): Date {
  const result = new Date(date.getTime());

  result.setHours(result.getHours() + 1);
  result.setMinutes(0);

  return result;
};

const makeDate = function makeDate(date: Date | number | string): Date {
  return new Date(date);
};

const getDatesOfInterval = function getDatesOfInterval(
  this: { addInterval: typeof addInterval },
  startDate: Date,
  endDate: Date,
  step: string | number | DateInterval,
): Date[] {
  const result: Date[] = [];
  let currentDate = new Date(startDate.getTime());

  while (currentDate < endDate) {
    result.push(new Date(currentDate.getTime()));

    currentDate = this.addInterval(currentDate, step);
  }

  return result;
};

const getMachineTimezoneName = (): string | null => {
  const hasIntl = typeof Intl !== 'undefined';
  return hasIntl
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : null;
};

const getRangesByDates = (dates: Date[]): [Date, Date?][] => {
  const datesInMilliseconds = dates.map((value) => correctDateWithUnitBeginning(value, 'day').getTime());
  const sortedDates = datesInMilliseconds.sort((a, b) => a - b);

  const msInDay = toMilliseconds('day');
  const ranges: [Date, Date?][] = [];

  let startDate = sortedDates[0];

  for (let i = 1; i <= sortedDates.length; i += 1) {
    const nextDate = sortedDates[i];
    const currentDate = sortedDates[i - 1];

    const isNewRange = nextDate - currentDate > msInDay;

    if (isNewRange || i === sortedDates.length) {
      const serializedRange: [Date, Date?] = startDate === sortedDates[i - 1]
        ? [dateSerialization.deserializeDate(startDate)]
        : [
          dateSerialization.deserializeDate(startDate),
          dateSerialization.deserializeDate(sortedDates[i - 1]),
        ];

      ranges.push(serializedRange);

      startDate = nextDate;
    }
  }

  return ranges;
};

const sameViewFunctions: Record<
  DateView,
  (date1: MaybeDate, date2: MaybeDate) => boolean | null | undefined
> = {
  month: sameMonthAndYear,
  year: sameYear,
  decade: sameDecade,
  century: sameCentury,
};

function sameView(view: DateView, date1: Date, date2: Date): boolean;
function sameView(view: DateView, date1: MaybeDate, date2: MaybeDate): boolean | null | undefined;
function sameView(view: DateView, date1: MaybeDate, date2: MaybeDate): boolean | null | undefined {
  return sameViewFunctions[view](date1, date2);
}

const dateUtils = {
  dateUnitIntervals,

  convertMillisecondsToDateUnits,
  dateToMilliseconds,
  getNextDateUnit,
  convertDateUnitToMilliseconds,
  getDateUnitInterval,
  getDateFormatByTickInterval, // T375972
  getDatesDifferences,
  correctDateWithUnitBeginning,
  trimTime,
  setToDayEnd,
  roundDateByStartDayHour,
  dateTimeFromDecimal,

  addDateInterval,
  addInterval,
  getSequenceByInterval,
  getDateIntervalByString,
  sameHoursAndMinutes,
  sameDate,
  sameMonthAndYear,
  sameMonth: sameMonthAndYear,
  sameYear,
  sameDecade,
  sameCentury,
  sameView,
  sameDatesArrays,
  getDifferenceInMonth,
  getDifferenceInMonthForCells,
  getFirstYearInDecade,
  getFirstDecadeInCentury,
  getShortDateFormat,
  getViewFirstCellDate,
  getViewLastCellDate,
  getViewDown,
  getViewUp,
  getLastMonthDay,
  getLastMonthDate,
  getFirstMonthDate,
  getFirstWeekDate,
  getWeekNumber,
  normalizeDateByWeek,
  getQuarter,
  getFirstQuarterMonth,
  dateInRange,
  intervalsOverlap,
  roundToHour,
  normalizeDate,
  getViewMinBoundaryDate,
  getViewMaxBoundaryDate,

  fixTimezoneGap,
  getTimezonesDifference,

  makeDate,

  getDatesInterval,

  getDatesOfInterval,

  createDateWithFullYear,

  getMachineTimezoneName,

  getRangesByDates,
};

const addOffsets = (date: Date, ...offsets: number[]): Date => {
  const newDateMs = offsets.reduce(
    (result, offset) => result + offset,
    date.getTime(),
  );

  return new Date(newDateMs);
};

const isValidDate = (
  date: unknown,
): date is Date | string | number => Boolean(
  date && !isNaN(new Date(date as Date).valueOf()),
);

export { addOffsets, dateUtils, isValidDate };
