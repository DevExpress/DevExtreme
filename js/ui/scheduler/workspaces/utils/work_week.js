import dateUtils from '../../../../core/utils/date';
import { getViewStartByOptions, setStartDayHour } from './base';
const MONDAY_INDEX = 1;
const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;


export const isDataOnWeekend = (date) => {
    const day = date.getDay();
    return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
};

export const getFirstDayOfWeek = (firstDayOfWeekOption) => {
    return firstDayOfWeekOption || MONDAY_INDEX;
};

export const getWeekendsCount = (days) => {
    return 2 * Math.floor(days / 7);
};

export const getFirstViewDate = (
    currentDate,
    startDayHour,
    startDate,
    intervalDuration,
    firstDayOfWeekOption,
) => {
    const viewStart = getViewStartByOptions(
        startDate,
        currentDate,
        intervalDuration,
        startDate,
    );

    const firstViewDate = dateUtils.getFirstWeekDate(viewStart, getFirstDayOfWeek(firstDayOfWeekOption));
    const normalizedDate = dateUtils.normalizeDateByWeek(firstViewDate, viewStart);

    return setStartDayHour(normalizedDate, startDayHour);
};
