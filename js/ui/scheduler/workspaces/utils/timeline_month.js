import dateUtils from '../../../../core/utils/date';
import { setStartDayHour } from './base';
import { getViewStartByOptions } from './month';

export const getFirstViewDate = (currentDate, startDayHour, startDate, intervalCount) => {
    const firstViewDate = getViewStartByOptions(
        startDate,
        currentDate,
        intervalCount,
        dateUtils.getFirstMonthDate(startDate),
    );

    return setStartDayHour(firstViewDate, startDayHour);
};
