import dateUtils from '../../core/utils/date';

const toMs = dateUtils.dateToMilliseconds;

const getTimezoneOffsetChangeInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => {
    return new Date(endDate).getTimezoneOffset() -
        new Date(startDate).getTimezoneOffset() +
        new Date(updatedStartDate).getTimezoneOffset() -
        new Date(updatedEndDate).getTimezoneOffset();
};

const getTimezoneOffsetChangeInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => {
    return getTimezoneOffsetChangeInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');
};

const utils = {
    getTimezoneOffsetChangeInMinutes: getTimezoneOffsetChangeInMinutes,
    getTimezoneOffsetChangeInMs: getTimezoneOffsetChangeInMs
};

module.exports = utils;
