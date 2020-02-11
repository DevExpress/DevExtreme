import dateUtils from '../../core/utils/date';
import SchedulerTimezones from './timezones/ui.scheduler.timezones';

const toMs = dateUtils.dateToMilliseconds;

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
    let result = timezone;

    if(typeof timezone === 'string') {
        date = date || new Date();
        const dateUtc = Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes()
        );
        result = SchedulerTimezones.getTimezoneOffsetById(timezone, dateUtc);
    }
    return result;
};

const getDaylightOffsetByAppointmentTimezone = (startDate, endDate, startDateTimezone) => {
    return calculateTimezoneByValue(startDateTimezone, startDate) - calculateTimezoneByValue(startDateTimezone, endDate);
};

const getDaylightOffsetByCommonTimezone = (startDate, endDate, timeZone) => {
    return calculateTimezoneByValue(timeZone, startDate) - calculateTimezoneByValue(timeZone, endDate);
};

const getCorrectedDateByDaylightOffsets = (convertedOriginalStartDate, convertedDate, date, timeZone, startDateTimezone) => {
    const daylightOffsetByCommonTimezone = getDaylightOffsetByCommonTimezone(convertedOriginalStartDate, convertedDate, timeZone);
    const daylightOffsetByAppointmentTimezone = getDaylightOffsetByAppointmentTimezone(convertedOriginalStartDate, convertedDate, startDateTimezone);
    const diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;

    return new Date(date.getTime() - diff * toMs('hour'));
};

const utils = {
    getDaylightOffset: getDaylightOffset,
    getDaylightOffsetInMs: getDaylightOffsetInMs,
    getTimezoneOffsetChangeInMinutes: getTimezoneOffsetChangeInMinutes,
    getTimezoneOffsetChangeInMs: getTimezoneOffsetChangeInMs,
    calculateTimezoneByValue: calculateTimezoneByValue,
    getDaylightOffsetByAppointmentTimezone: getDaylightOffsetByAppointmentTimezone,
    getDaylightOffsetByCommonTimezone: getDaylightOffsetByCommonTimezone,
    getCorrectedDateByDaylightOffsets: getCorrectedDateByDaylightOffsets
};

module.exports = utils;
