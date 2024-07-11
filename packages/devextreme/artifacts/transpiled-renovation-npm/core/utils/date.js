"use strict";

exports.default = void 0;
var _type = require("./type");
var _math = require("./math");
var _iterator = require("./iterator");
var _inflector = require("./inflector");
var _index = require("../../renovation/ui/common/utils/date/index");
/* globals Intl */
// TODO refactoring: Review all date utils functions and move useful to __internal/core/utils/date.ts

const DAYS_IN_WEEK = 7;
const THURSDAY_WEEK_NUMBER = 4;
const SUNDAY_WEEK_NUMBER = 7;
const USUAL_WEEK_COUNT_IN_YEAR = 52;
const dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];
const getDatesInterval = function (startDate, endDate, intervalUnit) {
  const delta = endDate.getTime() - startDate.getTime();
  const millisecondCount = (0, _index.toMilliseconds)(intervalUnit) || 1;
  return Math.floor(delta / millisecondCount);
};
const getNextDateUnit = function (unit, withWeeks) {
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
const convertMillisecondsToDateUnits = function (value) {
  let i;
  let dateUnitCount;
  let dateUnitInterval;
  const dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];
  const result = {};
  for (i = dateUnitIntervals.length - 1; i >= 0; i--) {
    dateUnitInterval = dateUnitIntervals[i];
    dateUnitCount = Math.floor(value / (0, _index.toMilliseconds)(dateUnitInterval));
    if (dateUnitCount > 0) {
      result[dateUnitInterval + 's'] = dateUnitCount;
      value -= convertDateUnitToMilliseconds(dateUnitInterval, dateUnitCount);
    }
  }
  return result;
};
const dateToMilliseconds = function (tickInterval) {
  let milliseconds = 0;
  if ((0, _type.isObject)(tickInterval)) {
    (0, _iterator.each)(tickInterval, function (key, value) {
      milliseconds += convertDateUnitToMilliseconds(key.substr(0, key.length - 1), value);
    });
  }
  if ((0, _type.isString)(tickInterval)) {
    milliseconds = convertDateUnitToMilliseconds(tickInterval, 1);
  }
  return milliseconds;
};
function convertDateUnitToMilliseconds(dateUnit, count) {
  return (0, _index.toMilliseconds)(dateUnit) * count;
}

// refactor for performance
function getDateUnitInterval(tickInterval) {
  let maxInterval = -1;
  let i;
  if ((0, _type.isString)(tickInterval)) {
    return tickInterval;
  }
  if ((0, _type.isObject)(tickInterval)) {
    (0, _iterator.each)(tickInterval, function (key, value) {
      for (i = 0; i < dateUnitIntervals.length; i++) {
        if (value && (key === dateUnitIntervals[i] + 's' || key === dateUnitIntervals[i]) && maxInterval < i) {
          maxInterval = i;
        }
      }
    });
    return dateUnitIntervals[maxInterval];
  }
  return '';
}

// T375972
const tickIntervalToFormatMap = {
  millisecond: 'millisecond',
  second: 'longtime',
  minute: 'shorttime',
  hour: 'shorttime',
  day: 'day',
  week: 'day',
  month: 'month',
  quarter: 'quarter',
  year: 'year'
};

// Because of changes in formatting (Globalize has been updated) common date formatting has been changed.
// The purpose of the following method is to preserve original dates formatting in axes and range selector slider markers.
function getDateFormatByTickInterval(tickInterval) {
  return tickIntervalToFormatMap[getDateUnitInterval(tickInterval)] || '';
}
const getQuarter = function (month) {
  return Math.floor(month / 3);
};
const getFirstQuarterMonth = function (month) {
  return getQuarter(month) * 3;
};
function correctDateWithUnitBeginning(date, dateInterval, withCorrection, firstDayOfWeek) {
  date = new Date(date.getTime());
  const oldDate = new Date(date.getTime());
  let firstQuarterMonth;
  let month;
  const dateUnitInterval = getDateUnitInterval(dateInterval);
  switch (dateUnitInterval) {
    case 'second':
      date = new Date(Math.floor(oldDate.getTime() / 1000) * 1000);
      break;
    case 'minute':
      date = new Date(Math.floor(oldDate.getTime() / 60000) * 60000);
      break;
    case 'hour':
      date = new Date(Math.floor(oldDate.getTime() / 3600000) * 3600000);
      break;
    case 'year':
      date.setMonth(0);
    /* falls through */
    case 'month':
      date.setDate(1);
    /* falls through */
    case 'day':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      date = getFirstWeekDate(date, firstDayOfWeek || 0);
      date.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      firstQuarterMonth = getFirstQuarterMonth(date.getMonth());
      month = date.getMonth();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      if (month !== firstQuarterMonth) {
        date.setMonth(firstQuarterMonth);
      }
      break;
  }
  if (withCorrection && dateUnitInterval !== 'hour' && dateUnitInterval !== 'minute' && dateUnitInterval !== 'second') {
    fixTimezoneGap(oldDate, date);
  }
  return date;
}
function trimTime(date) {
  return correctDateWithUnitBeginning(date, 'day');
}
const setToDayEnd = function (date) {
  const result = trimTime(date);
  result.setDate(result.getDate() + 1);
  return new Date(result.getTime() - 1);
};
const getDatesDifferences = function (date1, date2) {
  let counter = 0;
  const differences = {
    year: date1.getFullYear() !== date2.getFullYear(),
    month: date1.getMonth() !== date2.getMonth(),
    day: date1.getDate() !== date2.getDate(),
    hour: date1.getHours() !== date2.getHours(),
    minute: date1.getMinutes() !== date2.getMinutes(),
    second: date1.getSeconds() !== date2.getSeconds(),
    millisecond: date1.getMilliseconds() !== date2.getMilliseconds()
  };
  (0, _iterator.each)(differences, function (key, value) {
    if (value) {
      counter++;
    }
  });
  if (counter === 0 && getTimezonesDifference(date1, date2) !== 0) {
    differences.hour = true;
    counter++;
  }
  differences.count = counter;
  return differences;
};
function addDateInterval(value, interval, dir) {
  const result = new Date(value.getTime());
  const intervalObject = (0, _type.isString)(interval) ? getDateIntervalByString(interval.toLowerCase()) : (0, _type.isNumeric)(interval) ? convertMillisecondsToDateUnits(interval) : interval;
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
const addInterval = function (value, interval, isNegative) {
  const dir = isNegative ? -1 : +1;
  return (0, _type.isDate)(value) ? addDateInterval(value, interval, dir) : (0, _math.adjust)(value + interval * dir, interval);
};
const getSequenceByInterval = function (min, max, interval) {
  const intervals = [];
  let cur;
  intervals.push((0, _type.isDate)(min) ? new Date(min.getTime()) : min);
  cur = min;
  while (cur < max) {
    cur = addInterval(cur, interval);
    intervals.push(cur);
  }
  return intervals;
};
const getViewFirstCellDate = function (viewType, date) {
  if (viewType === 'month') {
    return createDateWithFullYear(date.getFullYear(), date.getMonth(), 1);
  }
  if (viewType === 'year') {
    return createDateWithFullYear(date.getFullYear(), 0, date.getDate());
  }
  if (viewType === 'decade') {
    return createDateWithFullYear(getFirstYearInDecade(date), date.getMonth(), date.getDate());
  }
  if (viewType === 'century') {
    return createDateWithFullYear(getFirstDecadeInCentury(date), date.getMonth(), date.getDate());
  }
};
const getViewLastCellDate = function (viewType, date) {
  if (viewType === 'month') {
    return createDateWithFullYear(date.getFullYear(), date.getMonth(), getLastMonthDay(date));
  }
  if (viewType === 'year') {
    return createDateWithFullYear(date.getFullYear(), 11, date.getDate());
  }
  if (viewType === 'decade') {
    return createDateWithFullYear(getFirstYearInDecade(date) + 9, date.getMonth(), date.getDate());
  }
  if (viewType === 'century') {
    return createDateWithFullYear(getFirstDecadeInCentury(date) + 90, date.getMonth(), date.getDate());
  }
};
const getViewMinBoundaryDate = function (viewType, date) {
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
const getViewMaxBoundaryDate = function (viewType, date) {
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
function getLastMonthDay(date) {
  const resultDate = createDateWithFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return resultDate.getDate();
}
const getViewUp = function (typeView) {
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
};
const getViewDown = function (typeView) {
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
};
const getDifferenceInMonth = function (typeView) {
  let difference = 1;
  if (typeView === 'year') {
    difference = 12;
  }
  if (typeView === 'decade') {
    difference = 12 * 10;
  }
  if (typeView === 'century') {
    difference = 12 * 100;
  }
  return difference;
};
const getDifferenceInMonthForCells = function (typeView) {
  let difference = 1;
  if (typeView === 'decade') {
    difference = 12;
  }
  if (typeView === 'century') {
    difference = 12 * 10;
  }
  return difference;
};
function getDateIntervalByString(intervalString) {
  const result = {};
  switch (intervalString) {
    case 'year':
      result.years = 1;
      break;
    case 'month':
      result.months = 1;
      break;
    case 'quarter':
      result.months = 3;
      break;
    case 'week':
      result.weeks = 1;
      break;
    case 'day':
      result.days = 1;
      break;
    case 'hour':
      result.hours = 1;
      break;
    case 'minute':
      result.minutes = 1;
      break;
    case 'second':
      result.seconds = 1;
      break;
    case 'millisecond':
      result.milliseconds = 1;
      break;
  }
  return result;
}
function sameDate(date1, date2) {
  return sameMonthAndYear(date1, date2) && date1.getDate() === date2.getDate();
}
function sameMonthAndYear(date1, date2) {
  return sameYear(date1, date2) && date1.getMonth() === date2.getMonth();
}
function sameYear(date1, date2) {
  return date1 && date2 && date1.getFullYear() === date2.getFullYear();
}
function sameHoursAndMinutes(date1, date2) {
  return date1 && date2 && date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes();
}
const sameDecade = function (date1, date2) {
  if (!(0, _type.isDefined)(date1) || !(0, _type.isDefined)(date2)) return;
  const startDecadeDate1 = date1.getFullYear() - date1.getFullYear() % 10;
  const startDecadeDate2 = date2.getFullYear() - date2.getFullYear() % 10;
  return date1 && date2 && startDecadeDate1 === startDecadeDate2;
};
const sameCentury = function (date1, date2) {
  if (!(0, _type.isDefined)(date1) || !(0, _type.isDefined)(date2)) return;
  const startCenturyDate1 = date1.getFullYear() - date1.getFullYear() % 100;
  const startCenturyDate2 = date2.getFullYear() - date2.getFullYear() % 100;
  return date1 && date2 && startCenturyDate1 === startCenturyDate2;
};
function getFirstDecadeInCentury(date) {
  return date && date.getFullYear() - date.getFullYear() % 100;
}
function getFirstYearInDecade(date) {
  return date && date.getFullYear() - date.getFullYear() % 10;
}
const getShortDateFormat = function () {
  return 'yyyy/MM/dd';
};
const getFirstMonthDate = function (date) {
  if (!(0, _type.isDefined)(date)) return;
  return createDateWithFullYear(date.getFullYear(), date.getMonth(), 1);
};
const getLastMonthDate = function (date) {
  if (!(0, _type.isDefined)(date)) return;
  return createDateWithFullYear(date.getFullYear(), date.getMonth() + 1, 0);
};
function getFirstWeekDate(date, firstDayOfWeek) {
  const delta = (date.getDay() - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const result = new Date(date);
  result.setDate(date.getDate() - delta);
  return result;
}
function getUTCTime(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}
function getDayNumber(date) {
  const ms = getUTCTime(date) - getUTCTime(getFirstDateInYear(date.getFullYear()));
  return 1 + Math.floor(ms / (0, _index.toMilliseconds)('day'));
}
function getFirstDateInYear(year) {
  return new Date(year, 0, 1);
}
function getLastDateInYear(year) {
  return new Date(year, 11, 31);
}
function getDayWeekNumber(date, firstDayOfWeek) {
  let day = date.getDay() - firstDayOfWeek + 1;
  if (day <= 0) {
    day += DAYS_IN_WEEK;
  }
  return day;
}
function getWeekNumber(date, firstDayOfWeek, rule) {
  const firstWeekDayInYear = getDayWeekNumber(getFirstDateInYear(date.getFullYear()), firstDayOfWeek);
  const lastWeekDayInYear = getDayWeekNumber(getLastDateInYear(date.getFullYear()), firstDayOfWeek);
  const daysInFirstWeek = DAYS_IN_WEEK - firstWeekDayInYear + 1;
  let weekNumber = Math.ceil((getDayNumber(date) - daysInFirstWeek) / 7);
  switch (rule) {
    case 'fullWeek':
      {
        if (daysInFirstWeek === DAYS_IN_WEEK) {
          weekNumber++;
        }
        if (weekNumber === 0) {
          const lastDateInPreviousYear = getLastDateInYear(date.getFullYear() - 1);
          return getWeekNumber(lastDateInPreviousYear, firstDayOfWeek, rule);
        }
        return weekNumber;
      }
    case 'firstDay':
      {
        if (daysInFirstWeek > 0) {
          weekNumber++;
        }
        const isSunday = firstWeekDayInYear === SUNDAY_WEEK_NUMBER || lastWeekDayInYear === SUNDAY_WEEK_NUMBER;
        if (weekNumber > USUAL_WEEK_COUNT_IN_YEAR && !isSunday || weekNumber === 54) {
          weekNumber = 1;
        }
        return weekNumber;
      }
    case 'firstFourDays':
      {
        if (daysInFirstWeek > 3) {
          weekNumber++;
        }
        const isThursday = firstWeekDayInYear === THURSDAY_WEEK_NUMBER || lastWeekDayInYear === THURSDAY_WEEK_NUMBER;
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
      break;
  }
}
const normalizeDateByWeek = function (date, currentDate) {
  const differenceInDays = dateUtils.getDatesInterval(date, currentDate, 'day');
  let resultDate = new Date(date);
  if (differenceInDays >= 6) {
    resultDate = new Date(resultDate.setDate(resultDate.getDate() + 7));
  }
  return resultDate;
};
const dateInRange = function (date, min, max, format) {
  if (format === 'date') {
    min = min && dateUtils.correctDateWithUnitBeginning(min, 'day');
    max = max && dateUtils.correctDateWithUnitBeginning(max, 'day');
    date = date && dateUtils.correctDateWithUnitBeginning(date, 'day');
  }
  return normalizeDate(date, min, max) === date;
};
const intervalsOverlap = function (options) {
  const {
    firstMin,
    firstMax,
    secondMin,
    secondMax
  } = options;
  return firstMin <= secondMin && secondMin <= firstMax || firstMin > secondMin && firstMin < secondMax || firstMin < secondMax && firstMax > secondMax;
};
const dateTimeFromDecimal = function (number) {
  const hours = Math.floor(number);
  const minutes = number % 1 * 60;
  return {
    hours: hours,
    minutes: minutes
  };
};
const roundDateByStartDayHour = function (date, startDayHour) {
  const startTime = this.dateTimeFromDecimal(startDayHour);
  const result = new Date(date);
  if (date.getHours() === startTime.hours && date.getMinutes() < startTime.minutes || date.getHours() < startTime.hours) {
    result.setHours(startTime.hours, startTime.minutes, 0, 0);
  }
  return result;
};
function normalizeDate(date, min, max) {
  let normalizedDate = date;
  if (!(0, _type.isDefined)(date)) {
    return date;
  }
  if ((0, _type.isDefined)(min) && date < min) {
    normalizedDate = min;
  }
  if ((0, _type.isDefined)(max) && date > max) {
    normalizedDate = max;
  }
  return normalizedDate;
}
function fixTimezoneGap(oldDate, newDate) {
  // NOTE: T182866
  if (!(0, _type.isDefined)(oldDate)) {
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
const roundToHour = function (date) {
  const result = new Date(date.getTime());
  result.setHours(result.getHours() + 1);
  result.setMinutes(0);
  return result;
};
function getTimezonesDifference(min, max) {
  return (max.getTimezoneOffset() - min.getTimezoneOffset()) * 60 * 1000;
}
const makeDate = function (date) {
  // TODO: will be useful later for work with different timezones
  return new Date(date);
};
const getDatesOfInterval = function (startDate, endDate, step) {
  const result = [];
  let currentDate = new Date(startDate.getTime());
  while (currentDate < endDate) {
    result.push(new Date(currentDate.getTime()));
    currentDate = this.addInterval(currentDate, step);
  }
  return result;
};
const createDateWithFullYear = function (year) {
  const result = new Date(...arguments);
  result.setFullYear(year);
  return result;
};
const getMachineTimezoneName = () => {
  const hasIntl = typeof Intl !== 'undefined';
  return hasIntl ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
};
const dateUtils = {
  dateUnitIntervals: dateUnitIntervals,
  convertMillisecondsToDateUnits: convertMillisecondsToDateUnits,
  dateToMilliseconds: dateToMilliseconds,
  getNextDateUnit: getNextDateUnit,
  convertDateUnitToMilliseconds: convertDateUnitToMilliseconds,
  getDateUnitInterval: getDateUnitInterval,
  getDateFormatByTickInterval: getDateFormatByTickInterval,
  // T375972
  getDatesDifferences: getDatesDifferences,
  correctDateWithUnitBeginning: correctDateWithUnitBeginning,
  trimTime: trimTime,
  setToDayEnd: setToDayEnd,
  roundDateByStartDayHour: roundDateByStartDayHour,
  dateTimeFromDecimal: dateTimeFromDecimal,
  addDateInterval: addDateInterval,
  addInterval: addInterval,
  getSequenceByInterval: getSequenceByInterval,
  getDateIntervalByString: getDateIntervalByString,
  sameHoursAndMinutes: sameHoursAndMinutes,
  sameDate: sameDate,
  sameMonthAndYear: sameMonthAndYear,
  sameMonth: sameMonthAndYear,
  sameYear: sameYear,
  sameDecade: sameDecade,
  sameCentury: sameCentury,
  getDifferenceInMonth: getDifferenceInMonth,
  getDifferenceInMonthForCells: getDifferenceInMonthForCells,
  getFirstYearInDecade: getFirstYearInDecade,
  getFirstDecadeInCentury: getFirstDecadeInCentury,
  getShortDateFormat: getShortDateFormat,
  getViewFirstCellDate: getViewFirstCellDate,
  getViewLastCellDate: getViewLastCellDate,
  getViewDown: getViewDown,
  getViewUp: getViewUp,
  getLastMonthDay: getLastMonthDay,
  getLastMonthDate: getLastMonthDate,
  getFirstMonthDate: getFirstMonthDate,
  getFirstWeekDate: getFirstWeekDate,
  getWeekNumber: getWeekNumber,
  normalizeDateByWeek: normalizeDateByWeek,
  getQuarter: getQuarter,
  getFirstQuarterMonth: getFirstQuarterMonth,
  dateInRange: dateInRange,
  intervalsOverlap: intervalsOverlap,
  roundToHour: roundToHour,
  normalizeDate: normalizeDate,
  getViewMinBoundaryDate: getViewMinBoundaryDate,
  getViewMaxBoundaryDate: getViewMaxBoundaryDate,
  fixTimezoneGap: fixTimezoneGap,
  getTimezonesDifference: getTimezonesDifference,
  makeDate: makeDate,
  getDatesInterval: getDatesInterval,
  getDatesOfInterval: getDatesOfInterval,
  createDateWithFullYear: createDateWithFullYear,
  getMachineTimezoneName: getMachineTimezoneName
};
dateUtils.sameView = function (view, date1, date2) {
  return dateUtils[(0, _inflector.camelize)('same ' + view)](date1, date2);
};
var _default = exports.default = dateUtils;
module.exports = exports.default;
module.exports.default = exports.default;