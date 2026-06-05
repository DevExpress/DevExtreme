import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';
import { isDefined, isObject } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';

import { VERTICAL_GROUP_COUNT_CLASSES } from '../../classes';
import {
  HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION,
} from '../../constants';
import timeZoneUtils from '../../m_utils_time_zone';
import type {
  AllDayPanelModeType,
  AppointmentGeometry,
  CalculateCellIndex,
  GetDateForHeaderText,
  GetDateForHeaderTextOptions,
  GroupOrientation,
  GroupPanelData,
  GroupRenderItem,
  HeaderCellTextFormat,
  ViewDataProviderType,
  ViewType,
} from '../../types';
import type { ResourceLoader } from '../../utils/loader/resource_loader';
import type { ResourceId } from '../../utils/loader/types';
import { VIEWS } from '../../utils/options/constants_view';

const toMs = dateUtils.dateToMilliseconds;
const DAY_HOURS = 24;
const HOUR_IN_MS = 1000 * 60 * 60;

const getDurationInHours = (
  startDate: Date,
  endDate: Date,
): number => Math.floor((endDate.getTime() - startDate.getTime()) / toMs('hour'));

export const getDatesWithoutTime = (min: Date | number, max: Date | number): [Date, Date] => {
  const newMin = dateUtils.trimTime(new Date(min)) as Date;
  const newMax = dateUtils.trimTime(new Date(max)) as Date;

  newMax.setDate(newMax.getDate() + 1);

  return [newMin, newMax];
};

export const isAppointmentTakesAllDay = (
  appointmentAdapter: {
    allDay: boolean;
    startDate: Date;
    endDate: Date | undefined | null;
  },
  allDayPanelMode: AllDayPanelModeType,
): boolean => {
  const {
    startDate,
    endDate,
    allDay,
  } = appointmentAdapter;

  switch (allDayPanelMode) {
    case 'hidden':
      return false;
    case 'allDay':
      return allDay;
    case 'all':
    default:
      if (allDay) {
        return true;
      }

      if (!isDefined(endDate)) {
        return false;
      }

      return getDurationInHours(startDate, endDate) >= DAY_HOURS;
  }
};

export const getAppointmentKey = (geometry: AppointmentGeometry): string => {
  const {
    left,
    top,
    width,
    height,
  } = geometry;

  return `${left}-${top}-${width}-${height}`;
};

export const getOverflowIndicatorColor = (color: string, colors: string[]): string | undefined => (
  !colors.length || colors.filter((item) => item !== color).length === 0
    ? color
    : undefined
);

export const getVerticalGroupCountClass = (groups: unknown[]): string | undefined => {
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

export const setOptionHour = (date: Date, optionHour: number): Date => {
  const nextDate = new Date(date);

  if (!isDefined(optionHour)) {
    return nextDate;
  }

  nextDate.setHours(optionHour, (optionHour % 1) * 60, 0, 0);

  return nextDate;
};

export const calculateDayDuration = (
  startDayHour: number,
  endDayHour: number,
): number => endDayHour - startDayHour;

export const getStartViewDateTimeOffset = (startViewDate: Date, startDayHour: number): number => {
  const validStartDayHour = Math.floor(startDayHour);
  const isDSTChange = timeZoneUtils.isTimezoneChangeInDate(startViewDate);

  if (isDSTChange && validStartDayHour !== startViewDate.getHours()) {
    return dateUtils.dateToMilliseconds('hour');
  }

  return 0;
};

export const getValidCellDateForLocalTimeFormat = (
  date: Date,
  {
    startViewDate,
    startDayHour,
    cellIndexShift,
    viewOffset,
  }: {
    startViewDate: Date;
    startDayHour: number;
    cellIndexShift: number;
    viewOffset: number;
  },
): Date => {
  const originDate = dateUtilsTs.addOffsets(date, -viewOffset);
  const localTimeZoneChangedInOriginDate = timeZoneUtils.isTimezoneChangeInDate(originDate);

  if (!localTimeZoneChangedInOriginDate) {
    return date;
  }

  // NOTE: Shift the startViewDate by two days ahead because
  // we can have viewOffset equals -1/+1 day.
  // This strange method of changing date used here because
  // +2 days from DST date not affected by DST.
  const startViewDateWithoutDST = new Date(
    new Date(startViewDate)
      .setDate(startViewDate.getDate() + 2),
  );

  const startViewDateOffset = getStartViewDateTimeOffset(startViewDate, startDayHour);
  return dateUtilsTs.addOffsets(
    startViewDateWithoutDST,
    viewOffset,
    cellIndexShift,
    -startViewDateOffset,
  );
};

export const getTotalCellCountByCompleteData = (
  completeData: unknown[][],
): number => completeData[completeData.length - 1].length;

export const getDisplayedCellCount = (
  displayedCellCount: number | undefined,
  completeData: unknown[][],
): number => displayedCellCount ?? getTotalCellCountByCompleteData(completeData);

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

export const isVerticalGroupingApplied = (
  groupCount: number,
  groupOrientation?: GroupOrientation,
): boolean => groupOrientation === VERTICAL_GROUP_ORIENTATION && groupCount > 0;

export const getHorizontalGroupCount = (
  groupCount: number,
  groupOrientation: GroupOrientation,
): number => {
  const isVerticalGrouping = isVerticalGroupingApplied(groupCount, groupOrientation);

  return isVerticalGrouping ? 1 : groupCount;
};

const TIMELINE_VIEWS = [
  VIEWS.TIMELINE_DAY,
  VIEWS.TIMELINE_WEEK,
  VIEWS.TIMELINE_WORK_WEEK,
  VIEWS.TIMELINE_MONTH,
];
export const isTimelineView = (
  viewType?: ViewType,
): boolean => Boolean(viewType && TIMELINE_VIEWS.includes(viewType));

export const isDateAndTimeView = (
  viewType: ViewType,
): boolean => viewType !== VIEWS.TIMELINE_MONTH && viewType !== VIEWS.MONTH;

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

export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date,
  diff: number,
): boolean => (diff > 0
  ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1))
  : dateUtils.dateInRange(date, endDate, startDate, 'date'));

export const isFirstCellInMonthWithIntervalCount = (
  cellDate: Date,
  intervalCount: number,
): boolean => cellDate.getDate() === 1 && intervalCount > 1;

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

export const calculateIsGroupedAllDayPanel = (
  groupCount: number,
  groupOrientation: GroupOrientation,
  isAllDayPanelVisible: boolean,
): boolean => isVerticalGroupingApplied(groupCount, groupOrientation) && isAllDayPanelVisible;

export const calculateViewStartDate = (
  startDateOption: Date | undefined,
): Date | undefined => startDateOption;

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

export const calculateCellIndex: CalculateCellIndex = (
  rowIndex: number,
  columnIndex: number,
  rowCount: number,
) => columnIndex * rowCount + rowIndex;

export const getTotalRowCountByCompleteData = (
  completeData: unknown[][],
): number => completeData.length;

export const getDisplayedRowCount = (
  displayedRowCount: number | undefined,
  completeData: unknown[][],
): number => displayedRowCount ?? getTotalRowCountByCompleteData(completeData);

export const getStartViewDateWithoutDST = (startViewDate: Date, startDayHour: number): Date => {
  const newStartViewDate = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
  newStartViewDate.setHours(startDayHour);

  return newStartViewDate;
};

export const getIsGroupedAllDayPanel = (
  hasAllDayRow: boolean,
  isVerticalGrouping: boolean,
): boolean => hasAllDayRow && isVerticalGrouping;

export const getKeyByGroup = (
  groupIndex: number | undefined,
  isVerticalGrouping: boolean,
): string => {
  if (isVerticalGrouping && groupIndex !== undefined) {
    return groupIndex.toString();
  }

  return '0';
};

export const getToday = (indicatorTime: Date | undefined, timeZoneCalculator: {
  createDate: (todayDate: Date, path: unknown) => Date;
}): Date => {
  const todayDate = indicatorTime ?? new Date();

  return timeZoneCalculator?.createDate(todayDate, 'toGrid') || todayDate;
};

export const getCalculatedFirstDayOfWeek = (
  firstDayOfWeekOption: number | undefined,
): number => (isDefined(firstDayOfWeekOption)
  ? firstDayOfWeekOption
  : dateLocalization.firstDayOfWeekIndex());

export const isHorizontalGroupingApplied = (
  groupCount: number,
  groupOrientation?: GroupOrientation,
): boolean => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && groupCount > 0;

export const isGroupingByDate = (
  groupCount: number,
  groupOrientation: GroupOrientation | undefined,
  groupByDate: boolean,
): boolean => {
  const isHorizontalGrouping = isHorizontalGroupingApplied(groupCount, groupOrientation);

  return groupByDate && isHorizontalGrouping;
};

export const getSkippedHoursInRange = (
  startDate: Date,
  endDate: Date,
  allDay: boolean,
  viewDataProvider: ViewDataProviderType,
): number => {
  const isAllDay = allDay && !viewDataProvider.viewType.includes('timeline');
  let result = 0;

  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);

  const endDateWithStartHour = new Date(endDate);
  endDateWithStartHour.setHours(0, 0, 0, 0);

  const { startDayHour, endDayHour } = viewDataProvider.getViewOptions();
  const dayHours = isAllDay ? DAY_HOURS : endDayHour - startDayHour;

  while (currentDate < endDateWithStartHour) {
    if (viewDataProvider.isDateSkipped(currentDate)) {
      result += dayHours;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const startDateHours = startDate.getHours();
  const endDateHours = endDate.getHours() + (endDate.getTime() % HOUR_IN_MS) / HOUR_IN_MS;

  if (viewDataProvider.isDateSkipped(startDate)) {
    switch (true) {
      case isAllDay:
        result += DAY_HOURS;
        break;
      case startDateHours < startDayHour:
        result += dayHours;
        break;
      case startDateHours < endDayHour:
        result += endDayHour - startDateHours;
        break;
      default:
        break;
    }
  }

  if (viewDataProvider.isDateSkipped(endDate)) {
    switch (true) {
      case isAllDay:
        result += DAY_HOURS;
        break;
      case endDateHours > endDayHour:
        result += dayHours;
        break;
      case endDateHours > startDayHour:
        result += endDateHours - startDayHour;
        break;
      default:
        break;
    }
  }

  return result;
};

export const extendGroupItemsForGroupingByDate = (
  groupRenderItems: GroupRenderItem[][],
  columnCountPerGroup: number,
): GroupRenderItem[][] => [...new Array(columnCountPerGroup)]
  .reduce((currentGroupItems, _, index) => groupRenderItems.map((groupsRow, rowIndex) => {
    const currentRow = (currentGroupItems as [])[rowIndex] || [];

    return [
      ...currentRow,
      ...groupsRow.map((item, columnIndex) => ({
        ...item,
        key: `${item.key}_group_by_date_${index}`,
        isFirstGroupCell: columnIndex === 0,
        isLastGroupCell: columnIndex === groupsRow.length - 1,
      })),
    ] as GroupRenderItem[];
  }), []) as GroupRenderItem[][];

const stringifyId = (id: ResourceId): string => (isObject(id)
  ? JSON.stringify(id)
  : String(id));

export const getGroupPanelData = (
  groupResources: ResourceLoader[],
  columnCountPerGroup: number,
  groupByDate: boolean,
  baseColSpan: number,
): GroupPanelData => {
  let repeatCount = 1;
  let groupPanelItems = groupResources
    .map((group) => {
      const result = [] as GroupRenderItem[];
      const {
        resourceName, resourceIndex, items, data,
      } = group;

      for (let i = 0; i < repeatCount; i += 1) {
        result.push(...items.map(({ id, text, color }, index) => ({
          id,
          text,
          color,
          key: `${i}_${resourceIndex}_${stringifyId(id)}`,
          resourceName,
          data: data?.[index],
        }) as GroupRenderItem));
      }

      repeatCount *= items.length;
      return result;
    })
    .filter((group) => group.length);

  if (groupByDate) {
    groupPanelItems = extendGroupItemsForGroupingByDate(groupPanelItems, columnCountPerGroup);
  }

  return {
    groupPanelItems,
    baseColSpan,
  };
};

export const splitNumber = (value: number, splitValue: number): number[] => Array.from(
  { length: Math.ceil(value / splitValue) },
  (_, index) => Math.min(value - (splitValue * index), splitValue),
);
