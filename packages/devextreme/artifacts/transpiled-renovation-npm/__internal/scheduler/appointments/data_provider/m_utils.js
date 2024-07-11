"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortAppointmentsByStartDate = exports.replaceWrongEndDate = exports.getRecurrenceException = exports.getAppointmentTakesSeveralDays = exports.compareDateWithStartDayHour = exports.compareDateWithEndDayHour = exports._isEndDateWrong = exports._convertRecurrenceException = exports._appointmentPartInInterval = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date_serialization = _interopRequireDefault(require("../../../../core/utils/date_serialization"));
var _m_expression_utils = require("../../m_expression_utils");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const toMs = _date.default.dateToMilliseconds;
const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
const compareDateWithStartDayHour = (startDate, endDate, startDayHour, allDay, severalDays) => {
  const startTime = _date.default.dateTimeFromDecimal(startDayHour);
  const result = startDate.getHours() >= startTime.hours && startDate.getMinutes() >= startTime.minutes || endDate.getHours() === startTime.hours && endDate.getMinutes() > startTime.minutes || endDate.getHours() > startTime.hours || severalDays || allDay;
  return result;
};
exports.compareDateWithStartDayHour = compareDateWithStartDayHour;
const compareDateWithEndDayHour = options => {
  const {
    startDate,
    endDate,
    startDayHour,
    endDayHour,
    viewStartDayHour,
    viewEndDayHour,
    allDay,
    severalDays,
    min,
    max,
    checkIntersectViewport
  } = options;
  const hiddenInterval = (24 - viewEndDayHour + viewStartDayHour) * toMs('hour');
  const apptDuration = endDate.getTime() - startDate.getTime();
  const delta = (hiddenInterval - apptDuration) / toMs('hour');
  const apptStartHour = startDate.getHours();
  const apptStartMinutes = startDate.getMinutes();
  let result;
  const endTime = _date.default.dateTimeFromDecimal(endDayHour);
  const startTime = _date.default.dateTimeFromDecimal(startDayHour);
  const apptIntersectViewport = startDate < max && endDate > min;
  result = checkIntersectViewport && apptIntersectViewport || apptStartHour < endTime.hours || apptStartHour === endTime.hours && apptStartMinutes < endTime.minutes || allDay && startDate <= max || severalDays && apptIntersectViewport && (apptStartHour < endTime.hours || endDate.getHours() * 60 + endDate.getMinutes() > startTime.hours * 60);
  if (apptDuration < hiddenInterval) {
    if (apptStartHour > endTime.hours && apptStartMinutes > endTime.minutes && delta <= apptStartHour - endDayHour) {
      result = false;
    }
  }
  return result;
};
exports.compareDateWithEndDayHour = compareDateWithEndDayHour;
const getAppointmentTakesSeveralDays = adapter => !_date.default.sameDate(adapter.startDate, adapter.endDate);
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.getAppointmentTakesSeveralDays = getAppointmentTakesSeveralDays;
const _isEndDateWrong = (startDate, endDate) => !endDate || isNaN(endDate.getTime()) || startDate.getTime() > endDate.getTime();
// eslint-disable-next-line @typescript-eslint/naming-convention
exports._isEndDateWrong = _isEndDateWrong;
const _appointmentPartInInterval = (startDate, endDate, startDayHour, endDayHour) => {
  const apptStartDayHour = startDate.getHours();
  const apptEndDayHour = endDate.getHours();
  return apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour || apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour;
};
exports._appointmentPartInInterval = _appointmentPartInInterval;
const getRecurrenceException = (appointmentAdapter, timeZoneCalculator, timeZone) => {
  const {
    recurrenceException
  } = appointmentAdapter;
  if (recurrenceException) {
    const exceptions = recurrenceException.split(',');
    for (let i = 0; i < exceptions.length; i++) {
      exceptions[i] = _convertRecurrenceException(exceptions[i], appointmentAdapter.startDate, timeZoneCalculator, timeZone);
    }
    return exceptions.join();
  }
  return recurrenceException;
};
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.getRecurrenceException = getRecurrenceException;
const _convertRecurrenceException = (exceptionString, startDate, timeZoneCalculator, timeZone) => {
  exceptionString = exceptionString.replace(/\s/g, '');
  const getConvertedToTimeZone = date => timeZoneCalculator.createDate(date, {
    path: 'toGrid'
  });
  const exceptionDate = _date_serialization.default.deserializeDate(exceptionString);
  const convertedStartDate = getConvertedToTimeZone(startDate);
  let convertedExceptionDate = getConvertedToTimeZone(exceptionDate);
  convertedExceptionDate = _m_utils_time_zone.default.correctRecurrenceExceptionByTimezone(convertedExceptionDate, convertedStartDate, timeZone);
  exceptionString = _date_serialization.default.serializeDate(convertedExceptionDate, FULL_DATE_FORMAT);
  return exceptionString;
};
exports._convertRecurrenceException = _convertRecurrenceException;
const replaceWrongEndDate = (rawAppointment, startDate, endDate, appointmentDuration, dataAccessors) => {
  const calculateAppointmentEndDate = (isAllDay, startDate) => {
    if (isAllDay) {
      return _date.default.setToDayEnd(new Date(startDate));
    }
    return new Date(startDate.getTime() + appointmentDuration * toMs('minute'));
  };
  if (_isEndDateWrong(startDate, endDate)) {
    const isAllDay = _m_expression_utils.ExpressionUtils.getField(dataAccessors, 'allDay', rawAppointment);
    const calculatedEndDate = calculateAppointmentEndDate(isAllDay, startDate);
    dataAccessors.setter.endDate(rawAppointment, calculatedEndDate);
  }
};
exports.replaceWrongEndDate = replaceWrongEndDate;
const sortAppointmentsByStartDate = (appointments, dataAccessors) => {
  appointments.sort((a, b) => {
    const firstDate = new Date(_m_expression_utils.ExpressionUtils.getField(dataAccessors, 'startDate', a.settings || a));
    const secondDate = new Date(_m_expression_utils.ExpressionUtils.getField(dataAccessors, 'startDate', b.settings || b));
    return Math.sign(firstDate.getTime() - secondDate.getTime());
  });
};
exports.sortAppointmentsByStartDate = sortAppointmentsByStartDate;