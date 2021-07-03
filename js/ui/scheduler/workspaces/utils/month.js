import dateUtils from '../../../../core/utils/date';
import dateLocalization from '../../../../localization/date';
import {
    getCalculatedFirstDayOfWeek,
    getToday,
    isDateInRange,
    setOptionHour,
} from './base';

export const getViewStartByOptions = (startDate, currentDate, intervalCount, startViewDate) => {
    if(!startDate) {
        return new Date(currentDate);
    } else {
        let startDate = new Date(startViewDate);
        const validStartViewDate = new Date(startViewDate);

        const diff = startDate.getTime() <= currentDate.getTime() ? 1 : -1;
        let endDate = new Date(new Date(validStartViewDate.setMonth(validStartViewDate.getMonth() + diff * intervalCount)));

        while(!isDateInRange(currentDate, startDate, endDate, diff)) {
            startDate = new Date(endDate);

            if(diff > 0) {
                startDate.setDate(1);
            }

            endDate = new Date(new Date(endDate.setMonth(endDate.getMonth() + diff * intervalCount)));
        }

        return diff > 0 ? startDate : endDate;
    }
};

export const calculateStartViewDate = (
    currentDate,
    startDayHour,
    startDate,
    intervalCount,
    firstDayOfWeekOption,
) => {
    const viewStart = getViewStartByOptions(
        startDate,
        currentDate,
        intervalCount,
        dateUtils.getFirstMonthDate(startDate),
    );
    const firstMonthDate = dateUtils.getFirstMonthDate(viewStart);
    const firstDayOfWeek = getCalculatedFirstDayOfWeek(firstDayOfWeekOption);

    const firstViewDate = dateUtils.getFirstWeekDate(firstMonthDate, firstDayOfWeek);

    return setOptionHour(firstViewDate, startDayHour);
};

export const calculateCellIndex = (rowIndex, columnIndex, rowCount, columnCount) => {
    return rowIndex * columnCount + columnIndex;
};

export const isFirstCellInMonthWithIntervalCount = (cellDate, intervalCount) => {
    return cellDate.getDate() === 1 && intervalCount > 1;
};

export const getCellText = (date, intervalCount) => {
    if(isFirstCellInMonthWithIntervalCount(date, intervalCount)) {
        const monthName = dateLocalization.getMonthNames('abbreviated')[date.getMonth()];
        return [monthName, dateLocalization.format(date, 'day')].join(' ');
    }

    return dateLocalization.format(date, 'dd');
};

export const isCurrentDate = (date, indicatorTime, timeZoneCalculator) => {
    return dateUtils.sameDate(date, getToday(indicatorTime, timeZoneCalculator));
};

export const isOtherMonth = (cellDate, minDate, maxDate) => {
    return !dateUtils.dateInRange(cellDate, minDate, maxDate, 'date');
};
