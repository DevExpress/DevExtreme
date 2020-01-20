import dateUtils from '../../core/utils/date';

const toMs = dateUtils.dateToMilliseconds;

const getTimezoneChangeDurationInMinutes = (startDate, endDate, updatedStartDate, updatedEndDate) => {
    return new Date(endDate).getTimezoneOffset() -
        new Date(startDate).getTimezoneOffset() +
        new Date(updatedStartDate).getTimezoneOffset() -
        new Date(updatedEndDate).getTimezoneOffset();
};

const getTimezoneChangeDurationInMs = (startDate, endDate, updatedStartDate, updatedEndDate) => {
    return getTimezoneChangeDurationInMinutes(startDate, endDate, updatedStartDate, updatedEndDate) * toMs('minute');
};

const Utils = {
    getTimezoneChangeDurationInMinutes: getTimezoneChangeDurationInMinutes,
    getTimezoneChangeDurationInMs: getTimezoneChangeDurationInMs
};

module.exports = Utils;
