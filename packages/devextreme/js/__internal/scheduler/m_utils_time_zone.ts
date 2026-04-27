// TODO(Refactoring): move this module to ./utils directory
import errors from '@js/core/errors';
import { dateUtilsTs } from '@ts/core/utils/date';
import { macroTaskArray } from '@ts/scheduler/utils/index';

import dateUtils from '../../core/utils/date';
import { globalCache } from './global_cache';
import timeZoneList from './timezones/timezone_list';

export interface TimezoneLabel {
  /** uniq timezone id, e.g: 'America/Los_Angeles' */
  id: string;
  /** timezone display string, e.g: '(GMT -08:00) America - Los Angeles' */
  title?: string;
}

export interface TimezoneData extends TimezoneLabel {
  /** timezone offset in hours */
  offset?: number;
}

const timeZoneListSet = new Set(timeZoneList.value);
const toMs = dateUtils.dateToMilliseconds;
const MINUTES_IN_HOUR = 60;
const MS_IN_MINUTE = 60000;
const GMT = 'GMT';
const offsetFormatRegexp = /^GMT(?:[+-]\d{2}:\d{2})?$/;

const createUTCDateWithLocalOffset = (date) => {
  if (!date) {
    return date;
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

const createDateFromUTCWithLocalOffset = (date: Date): Date => new Date(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours(),
  date.getUTCMinutes(),
  date.getUTCSeconds(),
);

const getTimezoneOffsetChangeInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(startDate, endDate);

const getTimezoneOffsetChangeInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');

const getDaylightOffset = (startDate, endDate) => new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();

const getDaylightOffsetInMs = (startDate, endDate) => getDaylightOffset(startDate, endDate) * toMs('minute');

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

const calculateTimezoneByValue = (timeZone: string | undefined, date: Date | number = new Date()): number | undefined => {
  if (!timeZone) {
    return undefined;
  }

  const isValidTimezone = timeZoneListSet.has(timeZone);
  if (!isValidTimezone) {
    errors.log('W0009', timeZone);
    return undefined;
  }

  const dateObj = new Date(date);
  if (!dateUtilsTs.isValidDate(dateObj)) {
    return undefined;
  }

  if (isEqualLocalTimeZone(timeZone)) {
    return -dateObj.getTimezoneOffset() / MINUTES_IN_HOUR;
  }

  return calculateTimezoneByValueCore(timeZone, dateObj);
};

// 'GMT±XX:YY' or 'GMT' format
const getStringOffset = (timeZone: string, date = new Date()): string | undefined => {
  let result = '';
  try {
    const dateTimeFormat = globalCache.timezones.memo(`intl${timeZone}`, () => new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    }));

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
  if (!dateUtilsTs.isValidDate(date)) {
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

const correctRecurrenceExceptionByTimezone = (exception, exceptionByStartDate) => {
  const timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;

  return new Date(exception.getTime() + timezoneOffset * toMs('hour'));
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

const getMachineTimezoneName = () => globalCache.timezones.memo('localTimezone', () => dateUtils.getMachineTimezoneName());

const isEqualLocalTimeZone = (timeZoneName: string) => {
  const localTimeZoneName = getMachineTimezoneName();
  if (localTimeZoneName && localTimeZoneName === timeZoneName) {
    return true;
  }
  return false;
};

const addOffsetsWithoutDST = (date: Date, ...offsets: number[]): Date => {
  const newDate = dateUtilsTs.addOffsets(date, ...offsets);
  const daylightShift = getDaylightOffsetInMs(date, newDate);

  if (!daylightShift) {
    return newDate;
  }

  const correctLocalDate = dateUtilsTs.addOffsets(newDate, -daylightShift);
  const daylightSecondShift = getDaylightOffsetInMs(newDate, correctLocalDate);

  return !daylightSecondShift
    ? correctLocalDate
    : newDate;
};

const getTimeZones = (
  date = new Date(),
  timeZones = timeZoneList.value,
): TimezoneData[] => timeZones.map((timezoneId) => ({
  id: timezoneId,
  title: getTimezoneTitle(timezoneId, date),
  offset: calculateTimezoneByValue(timezoneId, date),
}));

const GET_TIMEZONES_BATCH_SIZE = 10;
const cacheTimeZones = async (): Promise<TimezoneLabel[]> => globalCache.timezones.memo(
  'timeZonesCachePromise',
  () => macroTaskArray
    .map(
      timeZoneList.value,
      (timezoneId) => ({
        id: timezoneId,
        title: getTimezoneTitle(timezoneId, new Date()),
      }),
      GET_TIMEZONES_BATCH_SIZE,
    )
    .then((data) => globalCache.timezones.memo('timeZonesCache', () => data)),
);

const getTimeZonesCache = (): TimezoneLabel[] => globalCache.timezones.get('timeZonesCache') ?? [];

const isLocalTimeMidnightDST = (date: Date): boolean => {
  const startDayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return startDayDate.getHours() === 1;
};

const adjustDayIntervalMinForMidnightDST = (
  dayIntervalMin: number,
  startDayHour: number,
): number => {
  const date = createDateFromUTCWithLocalOffset(new Date(dayIntervalMin));
  const isMidnightDST = startDayHour === 0 && isLocalTimeMidnightDST(date);

  return isMidnightDST
    ? dayIntervalMin + date.getHours() * 60 * 60 * 1000
    : dayIntervalMin;
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

  isTimezoneChangeInDate,
  getDateWithoutTimezoneChange,
  getMachineTimezoneName,
  isEqualLocalTimeZone,

  addOffsetsWithoutDST,

  getTimeZones,
  getTimeZonesCache,
  cacheTimeZones,

  isLocalTimeMidnightDST,
  adjustDayIntervalMinForMidnightDST,
};

export default utils;
