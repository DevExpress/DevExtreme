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

const createUTCDateWithLocalOffset = (date: Date | null | undefined): Date | null | undefined => {
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

const getDaylightOffset = (
  startDate: Date | number,
  endDate: Date | number,
): number => new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();

const getDaylightOffsetInMs = (
  startDate: Date | number,
  endDate: Date | number,
): number => getDaylightOffset(startDate, endDate) * toMs('minute');

const getTimezoneOffsetChangeInMinutes = (
  startDate: Date,
  endDate: Date,
  updatedStartDate: Date,
  updatedEndDate: Date,
): number => getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(
  startDate,
  endDate,
);

const getTimezoneOffsetChangeInMs = (
  startDate: Date,
  endDate: Date,
  updatedStartDate: Date,
  updatedEndDate: Date,
): number => {
  const minutes = getTimezoneOffsetChangeInMinutes(
    startDate,
    endDate,
    updatedStartDate,
    updatedEndDate,
  );
  return minutes * toMs('minute');
};

// 'GMT±XX:YY' or 'GMT' format
const getStringOffset = (timeZone: string, date = new Date()): string | undefined => {
  let result = '';
  try {
    const dateTimeFormat = globalCache.timezones.memo(
      `intl${timeZone}`,
      () => new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'longOffset',
      }),
    );

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

const getMachineTimezoneName = (): string | null => globalCache.timezones.memo(
  'localTimezone',
  () => dateUtils.getMachineTimezoneName(),
);

const isEqualLocalTimeZone = (timeZoneName: string): boolean => {
  const localTimeZoneName = getMachineTimezoneName();
  if (localTimeZoneName && localTimeZoneName === timeZoneName) {
    return true;
  }
  return false;
};

const calculateTimezoneByValue = (
  timeZone: string | undefined,
  date: Date | number = new Date(),
): number | undefined => {
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

const getCorrectedDateByDaylightOffsets = (
  convertedOriginalStartDate: Date,
  convertedDate: Date,
  date: Date,
  timeZone: string,
  startDateTimezone: string,
): Date => {
  const daylightOffsetByCommonTimezone = _getDaylightOffsetByTimezone(
    convertedOriginalStartDate,
    convertedDate,
    timeZone,
  );
  const daylightOffsetByAppointmentTimezone = _getDaylightOffsetByTimezone(
    convertedOriginalStartDate,
    convertedDate,
    startDateTimezone,
  );
  const diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;

  return new Date(date.getTime() - diff * toMs('hour'));
};

const correctRecurrenceExceptionByTimezone = (
  exception: Date,
  exceptionByStartDate: Date,
): Date => {
  const timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset())
  / MINUTES_IN_HOUR;

  return new Date(exception.getTime() + timezoneOffset * toMs('hour'));
};

const isTimezoneChangeInDate = (date: Date | number): boolean => {
  const startDayDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  const endDayDate = new Date(new Date(date).setHours(23, 59, 59, 0));
  return (startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset()) !== 0;
};

const getDateWithoutTimezoneChange = (date: Date | number): Date => {
  const clonedDate = new Date(date);
  if (isTimezoneChangeInDate(clonedDate)) {
    const result = new Date(clonedDate);
    return new Date(result.setDate(result.getDate() + 1));
  }
  return clonedDate;
};

const isSameAppointmentDates = (startDate: Date, endDate: Date): boolean => {
  // NOTE: subtract 1 millisecond to avoid 00.00 time. Method should return 'true' for
  // "2020:10:10 22:00:00" and "2020:10:11 00:00:00", for example.
  const adjustedEndDate = new Date(endDate.getTime() - 1);

  return dateUtils.sameDate(startDate, adjustedEndDate);
};

const getClientTimezoneOffset = (date = new Date()): number => date.getTimezoneOffset()
* MS_IN_MINUTE;

const getDiffBetweenClientTimezoneOffsets = (
  firstDate = new Date(),
  secondDate = new Date(),
): number => getClientTimezoneOffset(firstDate) - getClientTimezoneOffset(secondDate);

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
};

export default utils;
