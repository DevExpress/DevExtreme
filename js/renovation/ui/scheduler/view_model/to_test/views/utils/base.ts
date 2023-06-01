import errors from '../../../../../../../ui/widget/ui.errors';
import dateUtils from '../../../../../../../core/utils/date';
import { isDefined } from '../../../../../../../core/utils/type';
import dateLocalization from '../../../../../../../localization/date';
import timeZoneUtils from '../../../../../../../ui/scheduler/utils.timeZone';
import { VERTICAL_GROUP_COUNT_CLASSES } from '../../../../../../../ui/scheduler/classes';
import { VIEWS } from '../../../../../../../ui/scheduler/constants';
import { getGroupCount } from '../../../../../../../ui/scheduler/resources/utils';
import { isVerticalGroupingApplied } from '../../../../workspaces/utils';
import {
  CalculateCellIndex,
  GetDateForHeaderText,
  GetDateForHeaderTextOptions,
  HeaderCellTextFormat,
} from '../types';
import { ViewType, GroupOrientation } from '../../../../types';
import { Group } from '../../../../workspaces/types';
import { TIMELINE_VIEWS } from './const';

export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date,
  diff: number,
): boolean => (diff > 0
  ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1))
  : dateUtils.dateInRange(date, endDate, startDate, 'date'));

export const setOptionHour = (date: Date, optionHour: number): Date => {
  const nextDate = new Date(date);

  if (!isDefined(optionHour)) {
    return nextDate;
  }

  nextDate.setHours(optionHour, (optionHour % 1) * 60, 0, 0);

  return nextDate;
};

export const getViewStartByOptions = (
  startDate: Date | undefined,
  currentDate: Date,
  intervalDuration: number,
  startViewDate: Date | undefined,
): Date => {
  if (!startDate) {
    return new Date(currentDate);
  }
  let currentStartDate = dateUtils.trimTime(startViewDate) as Date;
  const diff = currentStartDate.getTime() <= currentDate.getTime() ? 1 : -1;
  let endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);

  while (!isDateInRange(currentDate, currentStartDate, endDate, diff)) {
    currentStartDate = endDate;
    endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);
  }

  return diff > 0 ? currentStartDate : endDate;
};

export const getCalculatedFirstDayOfWeek = (
  firstDayOfWeekOption: number | undefined,
): number => (isDefined(firstDayOfWeekOption)
  ? firstDayOfWeekOption
  : dateLocalization.firstDayOfWeekIndex());

export const calculateViewStartDate = (
  startDateOption: Date | undefined,
): Date | undefined => startDateOption;

export const calculateCellIndex: CalculateCellIndex = (
  rowIndex, columnIndex, rowCount,
) => columnIndex * rowCount + rowIndex;

export const getStartViewDateWithoutDST = (startViewDate: Date, startDayHour: number): Date => {
  const newStartViewDate = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
  newStartViewDate.setHours(startDayHour);

  return newStartViewDate;
};

export const getHeaderCellText = (
  headerIndex: number,
  date: Date,
  headerCellTextFormat: HeaderCellTextFormat,
  getDateForHeaderText: GetDateForHeaderText,
  additionalOptions: GetDateForHeaderTextOptions,
): string => {
  const validDate = getDateForHeaderText(headerIndex, date, additionalOptions);
  return dateLocalization.format(validDate, headerCellTextFormat) as string;
};

export const validateDayHours = (startDayHour: number, endDayHour: number): void => {
  if (startDayHour >= endDayHour) {
    throw errors.Error('E1058');
  }
};

export const getStartViewDateTimeOffset = (startViewDate: Date, startDayHour: number): number => {
  const validStartDayHour = Math.floor(startDayHour);
  const isDSTChange = timeZoneUtils.isTimezoneChangeInDate(startViewDate);

  if (isDSTChange && validStartDayHour !== startViewDate.getHours()) {
    return dateUtils.dateToMilliseconds('hour');
  }

  return 0;
};

export const formatWeekday = (date: Date): string => dateLocalization
  .getDayNames('abbreviated')[date.getDay()];

export const formatWeekdayAndDay = (date: Date): string => `${formatWeekday(date)} ${dateLocalization.format(date, 'day')}`;

// TODO: convert time zone calculator to TS
export const getToday = (indicatorTime: Date | undefined, timeZoneCalculator: {
  createDate: (todayDate: Date, path: unknown) => Date;
}): Date => {
  const todayDate = indicatorTime ?? new Date();

  return timeZoneCalculator?.createDate(todayDate, { path: 'toGrid' }) || todayDate;
};

export const getVerticalGroupCountClass = (groups: Group[]): string | undefined => {
  switch (groups?.length) {
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

export const isDateAndTimeView = (
  viewType: ViewType,
): boolean => viewType !== VIEWS.TIMELINE_MONTH && viewType !== VIEWS.MONTH;

export const isTimelineView = (
  viewType: ViewType,
): boolean => !!TIMELINE_VIEWS[viewType];

export const getHorizontalGroupCount = (
  groups: Group[], groupOrientation: GroupOrientation,
): number => {
  const groupCount = getGroupCount(groups) || 1;
  const isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);

  return isVerticalGrouping ? 1 : groupCount;
};

export const calculateIsGroupedAllDayPanel = (
  groups: Group[],
  groupOrientation: GroupOrientation,
  isAllDayPanelVisible: boolean,
): boolean => isVerticalGroupingApplied(groups, groupOrientation) && isAllDayPanelVisible;

export const calculateDayDuration = (
  startDayHour: number, endDayHour: number,
): number => endDayHour - startDayHour;

export const isHorizontalView = (viewType: ViewType): boolean => {
  switch (viewType) {
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

export const getTotalCellCountByCompleteData = (
  completeData: unknown[][],
): number => completeData[completeData.length - 1].length;

export const getTotalRowCountByCompleteData = (
  completeData: unknown[][],
): number => completeData.length;

export const getDisplayedCellCount = (
  displayedCellCount: number | undefined, completeData: unknown[][],
): number => displayedCellCount ?? getTotalCellCountByCompleteData(completeData);

export const getDisplayedRowCount = (
  displayedRowCount: number | undefined, completeData: unknown[][],
): number => displayedRowCount ?? getTotalRowCountByCompleteData(completeData);

export const getCellDuration = (
  viewType: ViewType,
  startDayHour: number,
  endDayHour: number,
  hoursInterval: number,
): number => {
  switch (viewType) {
    case 'month':
      return calculateDayDuration(startDayHour, endDayHour) * 3600000;

    case 'timelineMonth':
      return dateUtils.dateToMilliseconds('day');

    default:
      return 3600000 * hoursInterval;
  }
};
