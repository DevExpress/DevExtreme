const dateUtils = require('../../../core/utils/date');
const MONDAY_INDEX = 1;
const SATURDAY_iNDEX = 6;
const SUNDAY_iNDEX = 0;

export const isDataOnWeekend = (date) => {
    const day = date.getDay();
    return day === SATURDAY_iNDEX || day === SUNDAY_iNDEX;
};

export const getFirstDayOfWeek = (firstDayOfWeekOption) => {
    return firstDayOfWeekOption || MONDAY_INDEX;
};

export const getWeekendsCount = (days) => {
    return 2 * Math.floor(days / 7);
};

export const getFirstViewDate = (viewStart, firstDayOfWeek) => {
    const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
    return dateUtils.normalizeDateByWeek(firstViewDate, viewStart);
};

