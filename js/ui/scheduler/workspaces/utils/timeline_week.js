import timeZoneUtils from '../../utils.timeZone';
import { getStartViewDateWithoutDST } from './base';

export const getDateForHeaderText = (index, date, options) => {
    if(!timeZoneUtils.isTimezoneChangeInDate(date)) {
        return date;
    }

    const {
        startDayHour,
        startViewDate,
        cellCountInDay,
        interval,
    } = options;

    const result = getStartViewDateWithoutDST(startViewDate, startDayHour);

    const validIndex = index % cellCountInDay;
    result.setTime(result.getTime() + validIndex * interval);

    return result;
};
