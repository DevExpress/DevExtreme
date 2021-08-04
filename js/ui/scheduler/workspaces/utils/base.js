import errors from '../../../widget/ui.errors';
import dateUtils from '../../../../core/utils/date';
import { isDefined } from '../../../../core/utils/type';
import dateLocalization from '../../../../localization/date';
import timeZoneUtils from '../../utils.timeZone';
import { VERTICAL_GROUP_COUNT_CLASSES } from '../../classes';
import { VIEWS } from '../../constants';
import { getGroupCount } from '../../resources/utils';
import { isVerticalGroupingApplied } from '../../../../renovation/ui/scheduler/workspaces/utils';

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

export const getStartViewDateWithoutDST = (startViewDate, startDayHour) => {
    const newStartViewDate = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
    newStartViewDate.setHours(startDayHour);

    return newStartViewDate;
};

export const getHeaderCellText = (
    headerIndex, date, headerCellTextFormat, getDateForHeaderText, additionalOptions,
) => {
    const validDate = getDateForHeaderText(headerIndex, date, additionalOptions);
    return dateLocalization.format(validDate, headerCellTextFormat);
};

export const validateDayHours = (startDayHour, endDayHour) => {
    if(startDayHour >= endDayHour) {
        throw errors.Error('E1058');
    }
};

export const getStartViewDateTimeOffset = (startViewDate, startDayHour) => {
    const validStartDayHour = Math.floor(startDayHour);
    const isDSTChange = timeZoneUtils.isTimezoneChangeInDate(startViewDate);

    if(isDSTChange && validStartDayHour !== startViewDate.getHours()) {
        return dateUtils.dateToMilliseconds('hour');
    }

    return 0;
};

export const formatWeekday = function(date) {
    return dateLocalization.getDayNames('abbreviated')[date.getDay()];
};

export const formatWeekdayAndDay = (date) => {
    return formatWeekday(date) + ' ' + dateLocalization.format(date, 'day');
};

export const getToday = (indicatorTime, timeZoneCalculator) => {
    const todayDate = indicatorTime || new Date();

    return timeZoneCalculator?.createDate(todayDate, { path: 'toGrid' }) || todayDate;
};

export const getVerticalGroupCountClass = (groups) => {
    switch(groups?.length) {
        case 1:
            return VERTICAL_GROUP_COUNT_CLASSES[0];
        case 2:
            return VERTICAL_GROUP_COUNT_CLASSES[1];
        case 3:
            return VERTICAL_GROUP_COUNT_CLASSES[2];
        default:
            return undefined;
    }
};

export const isDateAndTimeView = (viewType) => {
    return viewType !== VIEWS.TIMELINE_MONTH && viewType !== VIEWS.MONTH;
};

export const getHorizontalGroupCount = (groups, groupOrientation) => {
    const groupCount = getGroupCount(groups) || 1;
    const isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);

    return isVerticalGrouping ? 1 : groupCount;
};

export const calculateIsGroupedAllDayPanel = (groups, groupOrientation, isAllDayPanelVisible) => {
    return isVerticalGroupingApplied(groups, groupOrientation) && isAllDayPanelVisible;
};

export const calculateDayDuration = (startDayHour, endDayHour) => {
    return endDayHour - startDayHour;
};

export const isHorizontalView = (viewType) => {
    switch(viewType) {
        case VIEWS.TIMELINE_DAY:
        case VIEWS.TIMELINE_WEEK:
        case VIEWS.TIMELINE_WORK_WEEK:
        case VIEWS.TIMELINE_MONTH:
        case VIEWS.MONTH:
            return true;
        default:
            return false;
    }
};
