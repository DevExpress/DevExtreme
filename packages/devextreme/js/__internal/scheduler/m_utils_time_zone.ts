/* globals Intl */
import errors from '@js/core/errors';
import { dateUtilsTs } from '@ts/core/utils/date';

import dateUtils from '../../core/utils/date';
import DateAdapter from './m_date_adapter';
import timeZoneDataUtils from './timezones/m_utils_timezones_data';
import timeZoneList from './timezones/timezone_list';

const toMs = dateUtils.dateToMilliseconds;
const MINUTES_IN_HOUR = 60;
const MS_IN_MINUTE = 60000;
const GMT = 'GMT';
const offsetFormatRegexp = /^GMT(?:[+-]\d{2}:\d{2})?$/;

const createUTCDateWithLocalOffset = (date) => {
  if (!date) {
    return null;
  }

  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ));
};

const createDateFromUTCWithLocalOffset = (date) => {
  const result = DateAdapter(date);

  const timezoneOffsetBeforeInMin = result.getTimezoneOffset();
  result.addTime(result.getTimezoneOffset('minute'));
  result.subtractMinutes(timezoneOffsetBeforeInMin - result.getTimezoneOffset());

  return result.source;
};

const getTimeZones = (date = new Date()) => timeZoneList.value.map((tz) => ({
  offset: calculateTimezoneByValue(tz, date),
  title: getTimezoneTitle(tz, date),
  id: tz,
}));

const createUTCDate = (date) => new Date(Date.UTC(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours(),
  date.getUTCMinutes(),
));

const getTimezoneOffsetChangeInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(startDate, endDate);

const getTimezoneOffsetChangeInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');

const getDaylightOffset = (startDate, endDate) => new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();

const getDaylightOffsetInMs = (startDate, endDate) => getDaylightOffset(startDate, endDate) * toMs('minute');

const isValidDate = (date: Date) => date instanceof Date && !isNaN(date.valueOf());

const calculateTimezoneByValueOld = (timezone: string, date = new Date()): number | undefined => {
  const customTimezones = timeZoneDataUtils.getTimeZonesOld();
  if (customTimezones.length === 0) {
    return undefined;
  }

  const dateUtc = createUTCDate(date);
  return timeZoneDataUtils.getTimeZoneOffsetById(timezone, dateUtc.getTime());
};

const calculateTimezoneByValueCore = (timeZone: string, date = new Date()): number | undefined => {
  const offset = getStringOffset(timeZone, date);

  if (offset === undefined) {
    return undefined;
  }

  if (offset === GMT) {
    return 0;
  }

  const isMinus = offset.substring(3, 4) === '-';
  const hours = offset.substring(4, 6);
  const minutes = offset.substring(7, 9);

  const result = parseInt(hours, 10) + parseInt(minutes, 10) / MINUTES_IN_HOUR;
  return isMinus ? -result : result;
};

const calculateTimezoneByValue = (timeZone: string | undefined, date = new Date()): number | undefined => {
  if (!timeZone) {
    return undefined;
  }

  const isValidTimezone = timeZoneList.value.includes(timeZone);
  if (!isValidTimezone) {
    errors.log('W0009', timeZone);
    return undefined;
  }

  if (!isValidDate(date)) {
    return undefined;
  }

  let result = calculateTimezoneByValueOld(timeZone, date);
  if (result === undefined) {
    result = calculateTimezoneByValueCore(timeZone, date);
  }

  return result;
};

// 'GMT±XX:YY' or 'GMT' format
const getStringOffset = (timeZone: string, date = new Date()): string | undefined => {
  let result = '';
  try {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    } as any);

    result = dateTimeFormat
      .formatToParts(date)
      .find(({ type }) => type === 'timeZoneName')?.value ?? '';
  } catch (e) {
    errors.log('W0009', timeZone);
    return undefined;
  }

  const isSupportedFormat = offsetFormatRegexp.test(result);
  if (!isSupportedFormat) {
    errors.log('W0009', timeZone);
    return undefined;
  }

  return result;
};

const getOffsetNamePart = (offset: string): string => {
  if (offset === GMT) {
    return `${offset} +00:00`;
  }

  return offset.replace(GMT, `${GMT} `);
};

const getTimezoneTitle = (timeZone: string, date = new Date()): string | undefined => {
  if (!isValidDate(date)) {
    return '';
  }

  const tzNamePart = timeZone.replace(/\//g, ' - ').replace(/_/g, ' ');
  const offset = getStringOffset(timeZone, date);
  if (offset === undefined) {
    return undefined;
  }

  const offsetNamePart = getOffsetNamePart(offset);
  return `(${offsetNamePart}) ${tzNamePart}`;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const _getDaylightOffsetByTimezone = (startDate: Date, endDate: Date, timeZone: string): number => {
  const startDayOffset = calculateTimezoneByValue(timeZone, startDate);
  const endDayOffset = calculateTimezoneByValue(timeZone, endDate);
  if (startDayOffset === undefined || endDayOffset === undefined) {
    return 0;
  }

  return startDayOffset - endDayOffset;
};

const getCorrectedDateByDaylightOffsets = (convertedOriginalStartDate, convertedDate, date, timeZone, startDateTimezone) => {
  const daylightOffsetByCommonTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, timeZone);
  const daylightOffsetByAppointmentTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, startDateTimezone);
  const diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;

  return new Date(date.getTime() - diff * toMs('hour'));
};

const correctRecurrenceExceptionByTimezone = (exception, exceptionByStartDate, timeZone, startDateTimeZone?: any, isBackConversion = false) => {
  let timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;

  if (startDateTimeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, startDateTimeZone);
  } else if (timeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, timeZone);
  }

  return new Date(exception.getTime() + (isBackConversion ? -1 : 1) * timezoneOffset * toMs('hour'));
};

const isTimezoneChangeInDate = (date) => {
  const startDayDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  const endDayDate = new Date(new Date(date).setHours(23, 59, 59, 0));
  return (startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset()) !== 0;
};

const getDateWithoutTimezoneChange = (date) => {
  const clonedDate = new Date(date);
  if (isTimezoneChangeInDate(clonedDate)) {
    const result = new Date(clonedDate);
    return new Date(result.setDate(result.getDate() + 1));
  }
  return clonedDate;
};

const isSameAppointmentDates = (startDate, endDate) => {
  // NOTE: subtract 1 millisecond to avoid 00.00 time. Method should return 'true' for "2020:10:10 22:00:00" and "2020:10:11 00:00:00", for example.
  endDate = new Date(endDate.getTime() - 1);

  return dateUtils.sameDate(startDate, endDate);
};

const getClientTimezoneOffset = (date = new Date()) => date.getTimezoneOffset() * MS_IN_MINUTE;

const getDiffBetweenClientTimezoneOffsets = (firstDate = new Date(), secondDate = new Date()) => getClientTimezoneOffset(firstDate) - getClientTimezoneOffset(secondDate);

const isEqualLocalTimeZone = (timeZoneName, date = new Date()) => {
  if (Intl) {
    const localTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (localTimeZoneName === timeZoneName) {
      return true;
    }
  }

  return isEqualLocalTimeZoneByDeclaration(timeZoneName, date);
};

// TODO: Not used anywhere, if it isn't use in the future, then it must be removed
const hasDSTInLocalTimeZone = () => {
  const [startDate, endDate] = getExtremeDates();
  return startDate.getTimezoneOffset() !== endDate.getTimezoneOffset();
};

const getOffset = (date) => -date.getTimezoneOffset() / MINUTES_IN_HOUR;

const getDateAndMoveHourBack = (dateStamp) => new Date(dateStamp - toMs('hour'));

const isEqualLocalTimeZoneByDeclarationOld = (timeZoneName: string, date: Date): boolean => {
  const year = date.getFullYear();

  const configTuple = timeZoneDataUtils.getTimeZoneDeclarationTuple(timeZoneName, year);
  const [summerTime, winterTime] = configTuple;

  const noDSTInTargetTimeZone = configTuple.length < 2;
  if (noDSTInTargetTimeZone) {
    const targetTimeZoneOffset = timeZoneDataUtils.getTimeZoneOffsetById(timeZoneName, date);
    const localTimeZoneOffset = getOffset(date);

    if (targetTimeZoneOffset !== localTimeZoneOffset) {
      return false;
    }

    return !hasDSTInLocalTimeZone();
  }

  const localSummerOffset = getOffset(new Date(summerTime.date));
  const localWinterOffset = getOffset(new Date(winterTime.date));

  if (localSummerOffset !== summerTime.offset) {
    return false;
  }

  if (localSummerOffset === getOffset(getDateAndMoveHourBack(summerTime.date))) {
    return false;
  }

  if (localWinterOffset !== winterTime.offset) {
    return false;
  }

  if (localWinterOffset === getOffset(getDateAndMoveHourBack(winterTime.date))) {
    return false;
  }

  return true;
};

const isEqualLocalTimeZoneByDeclaration = (timeZoneName: string, date: Date): boolean => {
  const customTimezones = timeZoneDataUtils.getTimeZonesOld();
  const targetTimezoneData = customTimezones.filter((tz) => tz.id === timeZoneName);

  if (targetTimezoneData.length === 1) {
    return isEqualLocalTimeZoneByDeclarationOld(timeZoneName, date);
  }

  return false;
};

// TODO: Getting two dates in january or june is the standard mechanism for determining that an offset has occurred.
const getExtremeDates = () => {
  const nowDate = new Date(Date.now());

  const startDate = new Date();
  const endDate = new Date();

  startDate.setFullYear(nowDate.getFullYear(), 0, 1);
  endDate.setFullYear(nowDate.getFullYear(), 6, 1);

  return [startDate, endDate];
};

// TODO Vinogradov refactoring: Change to date utils.
const setOffsetsToDate = (targetDate, offsetsArray) => {
  const newDateMs = offsetsArray.reduce((result, offset) => result + offset, targetDate.getTime());
  return new Date(newDateMs);
};

const addOffsetsWithoutDST = (date: Date, ...offsets: number[]): Date => {
  const newDate = dateUtilsTs.addOffsets(date, offsets);
  const daylightShift = getDaylightOffsetInMs(date, newDate);

  if (!daylightShift) {
    return newDate;
  }

  const correctLocalDate = dateUtilsTs.addOffsets(newDate, [-daylightShift]);
  const daylightSecondShift = getDaylightOffsetInMs(newDate, correctLocalDate);

  return !daylightSecondShift
    ? correctLocalDate
    : newDate;
};

const utils = {
  getDaylightOffset,
  getDaylightOffsetInMs,
  getTimezoneOffsetChangeInMinutes,
  getTimezoneOffsetChangeInMs,
  calculateTimezoneByValue,
  getCorrectedDateByDaylightOffsets,
  isSameAppointmentDates,
  correctRecurrenceExceptionByTimezone,
  getClientTimezoneOffset,
  getDiffBetweenClientTimezoneOffsets,

  createUTCDateWithLocalOffset,
  createDateFromUTCWithLocalOffset,
  createUTCDate,

  isTimezoneChangeInDate,
  getDateWithoutTimezoneChange,
  hasDSTInLocalTimeZone,
  isEqualLocalTimeZone,
  isEqualLocalTimeZoneByDeclaration,
  getTimeZones,

  setOffsetsToDate,
  addOffsetsWithoutDST,
};

export default utils;
