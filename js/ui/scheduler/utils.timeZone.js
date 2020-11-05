/* globals Intl */
import dateUtils from '../../core/utils/date';
import timeZoneDataUtils from './timezones/utils.timezones_data';
import DateAdapter from './dateAdapter';

const toMs = dateUtils.dateToMilliseconds;
const MINUTES_IN_HOUR = 60;

const createUTCDateWithLocalOffset = date => {
    if(!date) {
        return null;
    }

    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ));
};

const createDateFromUTCWithLocalOffset = date => {
    const result = DateAdapter(date);

    const timezoneOffsetBeforeInMin = result.getTimezoneOffset();
    result.addTime(result.getTimezoneOffset('minute'));
    result.subtractMinutes(timezoneOffsetBeforeInMin - result.getTimezoneOffset());

    return result.source;
};

const getTimeZones = (date = new Date()) => {
    const dateInUTC = createUTCDate(date);
    return timeZoneDataUtils.getDisplayedTimeZones(dateInUTC.getTime());
};

const createUTCDate = (date) => {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes()
    ));
};

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

const calculateTimezoneByValue = (timezone, date = new Date()) => {
    // NOTE: This check could be removed. We don't support numerical timezones
    if(typeof timezone === 'string') {
        const dateUtc = createUTCDate(date);
        return timeZoneDataUtils.getTimeZoneOffsetById(timezone, dateUtc.getTime());
    }
    return timezone;
};

const _getDaylightOffsetByTimezone = (startDate, endDate, timeZone) => {
    return calculateTimezoneByValue(timeZone, startDate) - calculateTimezoneByValue(timeZone, endDate);
};

const getCorrectedDateByDaylightOffsets = (convertedOriginalStartDate, convertedDate, date, timeZone, startDateTimezone) => {
    const daylightOffsetByCommonTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, timeZone);
    const daylightOffsetByAppointmentTimezone = _getDaylightOffsetByTimezone(convertedOriginalStartDate, convertedDate, startDateTimezone);
    const diff = daylightOffsetByCommonTimezone - daylightOffsetByAppointmentTimezone;

    return new Date(date.getTime() - diff * toMs('hour'));
};

const correctRecurrenceExceptionByTimezone = (exception, exceptionByStartDate, timeZone, startDateTimeZone, isBackConversion = false) => {
    let timezoneOffset = (exception.getTimezoneOffset() - exceptionByStartDate.getTimezoneOffset()) / MINUTES_IN_HOUR;

    if(startDateTimeZone) {
        timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, startDateTimeZone);
    } else if(timeZone) {
        timezoneOffset = _getDaylightOffsetByTimezone(exceptionByStartDate, exception, timeZone);
    }

    return new Date(exception.getTime() + (isBackConversion ? -1 : 1) * timezoneOffset * toMs('hour'));
};

const isTimezoneChangeInDate = date => {
    const startDayDate = new Date((new Date(date)).setHours(0, 0, 0, 0));
    const endDayDate = new Date((new Date(date)).setHours(23, 59, 59, 0));
    return (startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset()) !== 0;
};

const getDateWithoutTimezoneChange = date => {
    const clonedDate = new Date(date);
    if(isTimezoneChangeInDate(clonedDate)) {
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

const getClientTimezoneOffset = (date) => {
    return date.getTimezoneOffset() * 60000;
};

const isEqualLocalTimeZone = (timeZoneName) => {
    if(Intl) {
        const localTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if(localTimeZoneName) {
            return localTimeZoneName === timeZoneName;
        }
    }

    return isEqualLocalTimeZoneByNativeDate(timeZoneName);
};

const hasDSTInLocalTimeZone = () => {
    const [startDate, endDate] = getExtremeDates();
    return startDate.getTimezoneOffset() !== endDate.getTimezoneOffset();
};

const isEqualLocalTimeZoneByNativeDate = (timeZoneName) => {
    const [startDate, endDate] = getExtremeDates();

    const startDateLocalOffset = -startDate.getTimezoneOffset() / 60;
    const endDateLocalOffset = -endDate.getTimezoneOffset() / 60;

    const startDateOffset = calculateTimezoneByValue(timeZoneName, startDate);
    const endDateOffset = calculateTimezoneByValue(timeZoneName, endDate);

    if(startDateLocalOffset === startDateOffset && endDateLocalOffset === endDateOffset) {
        return true;
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

    createUTCDateWithLocalOffset,
    createDateFromUTCWithLocalOffset,
    createUTCDate,

    isTimezoneChangeInDate,
    getDateWithoutTimezoneChange,
    hasDSTInLocalTimeZone,
    isEqualLocalTimeZone,
    getTimeZones
};

export default utils;
