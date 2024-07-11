"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = _interopRequireDefault(require("../../core/errors"));
var _date = require("../core/utils/date");
var _date2 = _interopRequireDefault(require("../../core/utils/date"));
var _m_date_adapter = _interopRequireDefault(require("./m_date_adapter"));
var _m_utils_timezones_data = _interopRequireDefault(require("./timezones/m_utils_timezones_data"));
var _timezone_list = _interopRequireDefault(require("./timezones/timezone_list"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* globals Intl */

const toMs = _date2.default.dateToMilliseconds;
const MINUTES_IN_HOUR = 60;
const MS_IN_MINUTE = 60000;
const GMT = 'GMT';
const offsetFormatRegexp = /^GMT(?:[+-]\d{2}:\d{2})?$/;
const createUTCDateWithLocalOffset = date => {
  if (!date) {
    return null;
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
};
const createDateFromUTCWithLocalOffset = date => {
  const result = (0, _m_date_adapter.default)(date);
  const timezoneOffsetBeforeInMin = result.getTimezoneOffset();
  result.addTime(result.getTimezoneOffset('minute'));
  result.subtractMinutes(timezoneOffsetBeforeInMin - result.getTimezoneOffset());
  return result.source;
};
const getTimeZones = function () {
  let date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return _timezone_list.default.value.map(tz => ({
    offset: calculateTimezoneByValue(tz, date),
    title: getTimezoneTitle(tz, date),
    id: tz
  }));
};
const createUTCDate = date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));
const getTimezoneOffsetChangeInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(startDate, endDate);
const getTimezoneOffsetChangeInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');
const getDaylightOffset = (startDate, endDate) => new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();
const getDaylightOffsetInMs = (startDate, endDate) => getDaylightOffset(startDate, endDate) * toMs('minute');
const isValidDate = date => date instanceof Date && !isNaN(date.valueOf());
const calculateTimezoneByValueOld = function (timezone) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  const customTimezones = _m_utils_timezones_data.default.getTimeZonesOld();
  if (customTimezones.length === 0) {
    return undefined;
  }
  const dateUtc = createUTCDate(date);
  return _m_utils_timezones_data.default.getTimeZoneOffsetById(timezone, dateUtc.getTime());
};
const calculateTimezoneByValueCore = function (timeZone) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
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
const calculateTimezoneByValue = function (timeZone) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  if (!timeZone) {
    return undefined;
  }
  const isValidTimezone = _timezone_list.default.value.includes(timeZone);
  if (!isValidTimezone) {
    _errors.default.log('W0009', timeZone);
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
const getStringOffset = function (timeZone) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  let result = '';
  try {
    var _dateTimeFormat$forma;
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset'
    });
    result = ((_dateTimeFormat$forma = dateTimeFormat.formatToParts(date).find(_ref => {
      let {
        type
      } = _ref;
      return type === 'timeZoneName';
    })) === null || _dateTimeFormat$forma === void 0 ? void 0 : _dateTimeFormat$forma.value) ?? '';
  } catch (e) {
    _errors.default.log('W0009', timeZone);
    return undefined;
  }
  const isSupportedFormat = offsetFormatRegexp.test(result);
  if (!isSupportedFormat) {
    _errors.default.log('W0009', timeZone);
    return undefined;
  }
  return result;
};
const getOffsetNamePart = offset => {
  if (offset === GMT) {
    return `${offset} +00:00`;
  }
  return offset.replace(GMT, `${GMT} `);
};
const getTimezoneTitle = function (timeZone) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
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
const _getDaylightOffsetByTimezone = (startDate, endDate, timeZone) => {
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
const correctRecurrenceExceptionByTimezone = function (exception, exceptionByStartDate, timeZone, startDateTimeZone) {
  let isBackConversion = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  let timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;
  if (startDateTimeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, startDateTimeZone);
  } else if (timeZone) {
    timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, timeZone);
  }
  return new Date(exception.getTime() + (isBackConversion ? -1 : 1) * timezoneOffset * toMs('hour'));
};
const isTimezoneChangeInDate = date => {
  const startDayDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  const endDayDate = new Date(new Date(date).setHours(23, 59, 59, 0));
  return startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset() !== 0;
};
const getDateWithoutTimezoneChange = date => {
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
  return _date2.default.sameDate(startDate, endDate);
};
const getClientTimezoneOffset = function () {
  let date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return date.getTimezoneOffset() * MS_IN_MINUTE;
};
const getDiffBetweenClientTimezoneOffsets = function () {
  let firstDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  let secondDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  return getClientTimezoneOffset(firstDate) - getClientTimezoneOffset(secondDate);
};
const isEqualLocalTimeZone = function (timeZoneName) {
  let date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
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
const getOffset = date => -date.getTimezoneOffset() / MINUTES_IN_HOUR;
const getDateAndMoveHourBack = dateStamp => new Date(dateStamp - toMs('hour'));
const isEqualLocalTimeZoneByDeclarationOld = (timeZoneName, date) => {
  const year = date.getFullYear();
  const configTuple = _m_utils_timezones_data.default.getTimeZoneDeclarationTuple(timeZoneName, year);
  const [summerTime, winterTime] = configTuple;
  const noDSTInTargetTimeZone = configTuple.length < 2;
  if (noDSTInTargetTimeZone) {
    const targetTimeZoneOffset = _m_utils_timezones_data.default.getTimeZoneOffsetById(timeZoneName, date);
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
const isEqualLocalTimeZoneByDeclaration = (timeZoneName, date) => {
  const customTimezones = _m_utils_timezones_data.default.getTimeZonesOld();
  const targetTimezoneData = customTimezones.filter(tz => tz.id === timeZoneName);
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
const addOffsetsWithoutDST = function (date) {
  for (var _len = arguments.length, offsets = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    offsets[_key - 1] = arguments[_key];
  }
  const newDate = _date.dateUtilsTs.addOffsets(date, offsets);
  const daylightShift = getDaylightOffsetInMs(date, newDate);
  if (!daylightShift) {
    return newDate;
  }
  const correctLocalDate = _date.dateUtilsTs.addOffsets(newDate, [-daylightShift]);
  const daylightSecondShift = getDaylightOffsetInMs(newDate, correctLocalDate);
  return !daylightSecondShift ? correctLocalDate : newDate;
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
  addOffsetsWithoutDST
};
var _default = exports.default = utils;