import dateUtils from '../../core/utils/date';

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

const isTimezoneChangeInDate = (date) => {
    const startDayDate = new Date((new Date(date)).setHours(0, 0, 0, 0));
    const endDayDate = new Date((new Date(date)).setHours(23, 59, 59, 0));
    return (startDayDate.getTimezoneOffset() - endDayDate.getTimezoneOffset()) !== 0;
};

const utils = {
    getDaylightOffset: getDaylightOffset,
    getDaylightOffsetInMs: getDaylightOffsetInMs,
    getTimezoneOffsetChangeInMinutes: getTimezoneOffsetChangeInMinutes,
    getTimezoneOffsetChangeInMs: getTimezoneOffsetChangeInMs,

    isTimezoneChangeInDate: isTimezoneChangeInDate
};

module.exports = utils;
