import dateUtils from '../../../../core/utils/date';
import { isDefined } from '../../../../core/utils/type';
import dateLocalization from '../../../../localization/date';

export const isDateInRange = (date, startDate, endDate, diff) => {
    return diff > 0
        ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1))
        : dateUtils.dateInRange(date, endDate, startDate, 'date');
};

export const setStartDayHour = (date, startDayHour) => {
    if(!isDefined(startDayHour)) {
        return date;
    }

    const nextDate = new Date(date);
    nextDate.setHours(startDayHour, startDayHour % 1 * 60, 0, 0);

    return nextDate;
};

export const getViewStartByOptions = (startDate, currentDate, intervalDuration, startViewDate) => {
    if(!startDate) {
        return new Date(currentDate);
    } else {
        let startDate = dateUtils.trimTime(startViewDate);
        const diff = startDate.getTime() <= currentDate.getTime() ? 1 : -1;
        let endDate = new Date(startDate.getTime() + intervalDuration * diff);

        while(!isDateInRange(currentDate, startDate, endDate, diff)) {
            startDate = endDate;
            endDate = new Date(startDate.getTime() + intervalDuration * diff);
        }

        return diff > 0 ? startDate : endDate;
    }
};

export const getCalculatedFirstDayOfWeek = (firstDayOfWeekOption) => {
    return isDefined(firstDayOfWeekOption)
        ? firstDayOfWeekOption
        : dateLocalization.firstDayOfWeekIndex();
};

export const getFirstDayOfWeek = (firstDayOfWeekOption) => firstDayOfWeekOption;
export const getStartViewDate = (startDateOption) => startDateOption;
