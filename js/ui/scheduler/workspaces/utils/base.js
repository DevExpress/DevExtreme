import dateUtils from '../../../../core/utils/date';

export const isDateInRange = (date, startDate, endDate, diff) => {
    return diff > 0
        ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1))
        : dateUtils.dateInRange(date, endDate, startDate, 'date');
};

export const setStartDayHour = (date, startDayHour) => {
    if(!startDayHour) {
        return date;
    }

    const nextDate = new Date(date);
    nextDate.setHours(startDayHour, startDayHour % 1 * 60, 0, 0);

    return nextDate;
};
