import dateUtils from '../../../../core/utils/date';
import { isDefined } from '../../../../core/utils/type';
import dateLocalization from '../../../../localization/date';
import { getViewStartByOptions, setStartDayHour } from './base';

export const getIntervalDuration = (intervalCount) => {
    return dateUtils.dateToMilliseconds('day') * 7 * intervalCount;
};

export const getFirstViewDate = (
    currentDate,
    startDayHour,
    startDate,
    intervalDuration,
    firstDayOfWeekOption,
) => {
    const firstDayOfWeek = isDefined(firstDayOfWeekOption)
        ? firstDayOfWeekOption
        : dateLocalization.firstDayOfWeekIndex();
    const viewStart = getViewStartByOptions(
        startDate,
        currentDate,
        intervalDuration,
        startDate,
    );

    const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);

    return setStartDayHour(firstViewDate, startDayHour);
};
