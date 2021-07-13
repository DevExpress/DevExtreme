import dateUtils from '../../../../core/utils/date';
import dateLocalization from '../../../../localization/date';
import {
    getCalculatedFirstDayOfWeek,
    getStartViewDateTimeOffset,
    getViewStartByOptions,
    setOptionHour,
} from './base';
import timeZoneUtils from '../../utils.timeZone';

export const getIntervalDuration = (intervalCount) => {
    return dateUtils.dateToMilliseconds('day') * 7 * intervalCount;
};

export const calculateStartViewDate = (
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
        dateUtils.getFirstWeekDate(startDate, firstDayOfWeek),
    );

    const firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);

    return setOptionHour(firstViewDate, startDayHour);
};

export const calculateViewStartDate = (startDateOption, firstDayOfWeek) => {
    const validFirstDayOfWeek = firstDayOfWeek || dateLocalization.firstDayOfWeekIndex();

    return dateUtils.getFirstWeekDate(startDateOption, validFirstDayOfWeek);
};

const getTimeCellDate = (rowIndex, date, startViewDate, cellDuration, startDayHour) => {
    if(!timeZoneUtils.isTimezoneChangeInDate(date)) {
        return date;
    }

    const startViewDateWithoutDST = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
    const result = new Date(startViewDateWithoutDST);
    const timeCellDuration = Math.round(cellDuration);

    const startViewDateOffset = getStartViewDateTimeOffset(startViewDate, startDayHour);
    result.setMilliseconds(result.getMilliseconds() + timeCellDuration * rowIndex - startViewDateOffset);

    return result;
};

// T410490: incorrectly displaying time slots on Linux
export const getTimePanelCellText = (rowIndex, date, startViewDate, cellDuration, startDayHour) => {
    if(rowIndex % 2 === 0) {
        const validDate = getTimeCellDate(rowIndex, date, startViewDate, cellDuration, startDayHour);
        return dateLocalization.format(validDate, 'shorttime');
    }
    return '';
};
