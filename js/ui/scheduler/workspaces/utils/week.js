import dateUtils from '../../../../core/utils/date';
import dateLocalization from '../../../../localization/date';
import { getCalculatedFirstDayOfWeek, getViewStartByOptions, setStartDayHour } from './base';

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
    const firstDayOfWeek = getCalculatedFirstDayOfWeek(firstDayOfWeekOption);
    const viewStart = getViewStartByOptions(
        startDate,
        currentDate,
        intervalDuration,
        startDate,
    );

    const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);

    return setStartDayHour(firstViewDate, startDayHour);
};

export const getStartViewDate = (startDateOption, firstDayOfWeek) => {
    const validFirstDayOfWeek = firstDayOfWeek || dateLocalization.firstDayOfWeekIndex();

    return dateUtils.getFirstWeekDate(startDateOption, validFirstDayOfWeek);
};
