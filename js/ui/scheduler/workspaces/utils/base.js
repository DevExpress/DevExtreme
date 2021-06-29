import dateUtils from '../../../../core/utils/date';
import { isDefined } from '../../../../core/utils/type';
import dateLocalization from '../../../../localization/date';
import { getCellGroups, getGroupsObjectFromGroupsArray } from '../../resources/utils';
import timeZoneUtils from '../../utils.timeZone';

export const isDateInRange = (date, startDate, endDate, diff) => {
    return diff > 0
        ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1))
        : dateUtils.dateInRange(date, endDate, startDate, 'date');
};

export const setOptionHour = (date, startDayHour) => {
    const nextDate = new Date(date);

    if(!isDefined(startDayHour)) {
        return nextDate;
    }

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
export const calculateViewStartDate = (startDateOption) => startDateOption;

export const calculateCellIndex = (rowIndex, columnIndex, rowCount, columnCount) => {
    return columnIndex * rowCount + rowIndex;
};

const getTimeOffsetByColumnIndex = (columnIndex, columnsInDay, firstDayOfWeek) => {
    const firstDayOfWeekDiff = Math.max(0, firstDayOfWeek - 1);
    const weekendCount = Math.floor((columnIndex + firstDayOfWeekDiff) / (5 * columnsInDay));

    return dateUtils.dateToMilliseconds('day') * weekendCount * 2;
};

export const getStartViewDateWithoutDST = (startViewDate, startDayHour) => {
    const newStartViewDate = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
    newStartViewDate.setHours(startDayHour);

    return newStartViewDate;
};

const getMillisecondsOffset = (cellIndex, interval, hiddenIntervalBase, cellCountInDay) => {
    const dayIndex = Math.floor(cellIndex / cellCountInDay);
    const hiddenInterval = dayIndex * hiddenIntervalBase;

    return interval * cellIndex + hiddenInterval;
};

export const getDateByCellIndices = (options, rowIndex, columnIndex) => {
    let startViewDate = options.startViewDate;
    const {
        startDayHour,
        isWorkView,
        columnsInDay,
        hiddenInterval,
        calculateCellIndex,
        interval,
        cellCountInDay,
        rowCount,
        columnCount,
        firstDayOfWeek,
    } = options;

    const isStartViewDateDuringDST = startViewDate.getHours() !== Math.floor(startDayHour);

    if(isStartViewDateDuringDST) {
        const dateWithCorrectHours = getStartViewDateWithoutDST(startViewDate, startDayHour);

        startViewDate = new Date(dateWithCorrectHours - dateUtils.dateToMilliseconds('day'));
    }

    const cellIndex = calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
    const millisecondsOffset = getMillisecondsOffset(cellIndex, interval, hiddenInterval, cellCountInDay);

    const offsetByCount = isWorkView
        ? getTimeOffsetByColumnIndex(columnIndex, columnsInDay, firstDayOfWeek)
        : 0;

    const startViewDateTime = startViewDate.getTime();
    const currentDate = new Date(startViewDateTime + millisecondsOffset + offsetByCount);

    const timeZoneDifference = isStartViewDateDuringDST
        ? 0
        : dateUtils.getTimezonesDifference(startViewDate, currentDate);

    currentDate.setTime(currentDate.getTime() + timeZoneDifference);

    return currentDate;
};

const calculateEndDate = (startDate, interval) => {
    const result = new Date(startDate);
    result.setMilliseconds(result.getMilliseconds() + Math.round(interval));

    return result;
};

export const prepareCellData = (options, rowIndex, columnIndex) => {
    const {
        isDateAndTimeView,
        interval,
        groups,
        tableAllDay,
        endDayHour,
    } = options;

    const startDate = getDateByCellIndices(options, rowIndex, columnIndex);
    const endDate = isDateAndTimeView
        ? calculateEndDate(startDate, interval)
        : setOptionHour(startDate, endDayHour);

    const data = {
        startDate: startDate,
        endDate: endDate,
        allDay: tableAllDay,
        groupIndex: 0,
    };

    const groupsArray = getCellGroups(0, groups);

    if(groupsArray.length) {
        data.groups = getGroupsObjectFromGroupsArray(groupsArray);
    }

    return data;
};

export const prepareAllDayCellData = (options, rowIndex, columnIndex) => {
    const data = prepareCellData(options, rowIndex, columnIndex);
    const startDate = dateUtils.trimTime(data.startDate);

    return {
        ...data,
        startDate,
        endDate: startDate,
        allDay: true,
    };
};

export const getHeaderCellText = (
    headerIndex, date, headerCellTextFormat, getDateForHeaderText, additionalOptions,
) => {
    const validDate = getDateForHeaderText(headerIndex, date, additionalOptions);
    return dateLocalization.format(validDate, headerCellTextFormat);
};

export const formatWeekday = function(date) {
    return dateLocalization.getDayNames('abbreviated')[date.getDay()];
};

export const formatWeekdayAndDay = (date) => {
    return formatWeekday(date) + ' ' + dateLocalization.format(date, 'day');
};
