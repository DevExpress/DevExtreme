import dateUtils from '../../core/utils/date';
import SchedulerTimezones from './timezones/ui.scheduler.timezones';

const toMs = dateUtils.dateToMilliseconds;
const MINUTES_IN_HOUR = 60;

const getTimezoneOffsetChangeInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => {
    return getDaylightOffset(updatedStartDate, updatedEndDate) - getDaylightOffset(startDate, endDate);
};

const getTimezoneOffsetChangeInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => {
    return getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');
};

const getDaylightOffset = (startDate, endDate) => {
    return new Date(startDate).getTimezoneOffset() - new Date(endDate).getTimezoneOffset();
};

const getDaylightOffsetInMs = (startDate, endDate) => {
    return getDaylightOffset(startDate, endDate) * toMs('minute');
};

const calculateTimezoneByValue = (timezone, date) => {
    if(typeof timezone === 'string') {
        date = date || new Date();
        const dateUtc = Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes()
        );
        timezone = SchedulerTimezones.getTimezoneOffsetById(timezone, dateUtc);
    }
    return timezone;
};

const getDaylightOffsetByTimezone = (startDate, endDate, timeZone) => {
    return calculateTimezoneByValue(timeZone, startDate) - calculateTimezoneByValue(timeZone, endDate);
};

const getCorrectedDateByDaylightOffsets = (convertedOriginalStartDate, convertedDate, date, timeZone, startDateTimezone) => {
    const daylightOffsetByCommonTimezone = getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, timeZone);
    const daylightOffsetByAppointmentTimezone = getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, startDateTimezone);
    const diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;

    return new Date(date.getTime() - diff * toMs('hour'));
};

const correctRecurrenceExceptionByTimezone = (exception, exceptionByStartDate, timeZone, startDateTimeZone) => {
    let timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;

    if(startDateTimeZone) {
        timezoneOffset = getDaylightOffsetByTimezone(exceptionByStartDate, exception, startDateTimeZone);
    } else if(timeZone) {
        timezoneOffset = getDaylightOffsetByTimezone(exceptionByStartDate, exception, timeZone);
    }

    return new Date(exception.getTime() + timezoneOffset * toMs('hour'));
};

const isTimezoneChangeInDate = (date) => {
    const startDayDate = new Date((new Date(date)).setHours(0, 0, 0, 0));
    const endDayDate = new Date((new Date(date)).setHours(23, 59, 59, 0));
    return (startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset()) !== 0;
};

const isSameAppointmentDates = (startDate, endDate) => {
    // NOTE: subtract 1 millisecond to avoid 00.00 time. Method should return 'true' for "2020:10:10 22:00:00" and "2020:10:11 00:00:00", for example.
    endDate = new Date(endDate.getTime() - 1);

    return dateUtils.sameDate(startDate, endDate);
};

const utils = {
    getDaylightOffset: getDaylightOffset,
    getDaylightOffsetInMs: getDaylightOffsetInMs,
    getTimezoneOffsetChangeInMinutes: getTimezoneOffsetChangeInMinutes,
    getTimezoneOffsetChangeInMs: getTimezoneOffsetChangeInMs,
    calculateTimezoneByValue: calculateTimezoneByValue,
    getCorrectedDateByDaylightOffsets: getCorrectedDateByDaylightOffsets,
    isTimezoneChangeInDate: isTimezoneChangeInDate,
    isSameAppointmentDates: isSameAppointmentDates,
    getDaylightOffsetByTimezone: getDaylightOffsetByTimezone,
    correctRecurrenceExceptionByTimezone: correctRecurrenceExceptionByTimezone
};

module.exports = utils;
