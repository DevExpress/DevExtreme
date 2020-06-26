import dateUtils from '../../../core/utils/date';
const MONDAY_INDEX = 1;
const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;

class workWeekUtils {
    static isDataOnWeekend(date) {
        const day = date.getDay();
        return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
    }

    static getFirstDayOfWeek(firstDayOfWeekOption) {
        return firstDayOfWeekOption || MONDAY_INDEX;
    }

    static getWeekendsCount(days) {
        return 2 * Math.floor(days / 7);
    }

    static getFirstViewDate(viewStart, firstDayOfWeek) {
        const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
        return dateUtils.normalizeDateByWeek(firstViewDate, viewStart);
    }
}

export default workWeekUtils;
