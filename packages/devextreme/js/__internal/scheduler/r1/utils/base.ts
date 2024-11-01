import dateLocalization from '@js/common/core/localization/date';
import { equalByValue } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { isDefined } from '@js/core/utils/type';
import { dateUtilsTs } from '@ts/core/utils/date';

import { VERTICAL_GROUP_COUNT_CLASSES } from '../../m_classes';
import { VIEWS } from '../../m_constants';
import timeZoneUtils from '../../m_utils_time_zone';
import { HORIZONTAL_GROUP_ORIENTATION, TIMELINE_VIEWS, VERTICAL_GROUP_ORIENTATION } from '../const';
import type {
  AllDayPanelModeType,
  AppointmentGeometry,
  CalculateCellIndex,
  FilterItemType,
  GetDateForHeaderText,
  GetDateForHeaderTextOptions,
  Group, GroupItem,
  GroupOrientation,
  GroupPanelData,
  GroupRenderItem,
  HeaderCellTextFormat,
  ViewDataProviderType,
  ViewType,
} from '../types';

const toMs = dateUtils.dateToMilliseconds;
const DAY_HOURS = 24;
const HOUR_IN_MS = 1000 * 60 * 60;
const SATURDAY_INDEX = 6;
const SUNDAY_INDEX = 0;

const getDurationInHours = (
  startDate: Date,
  endDate: Date,
): number => Math.floor((endDate.getTime() - startDate.getTime()) / toMs('hour'));

export const getDatesWithoutTime = (min: Date, max: Date): [Date, Date] => {
  const newMin = dateUtils.trimTime(min) as Date;
  const newMax = dateUtils.trimTime(max) as Date;

  newMax.setDate(newMax.getDate() + 1);

  return [newMin, newMax];
};

export const getAppointmentRenderingStrategyName = (viewType: ViewType): string => {
  const appointmentRenderingStrategyMap: Record<ViewType, { renderingStrategy: string }> = {
    day: {
      renderingStrategy: 'vertical',
    },
    week: {
      renderingStrategy: 'week',
    },
    workWeek: {
      renderingStrategy: 'week',
    },
    month: {
      renderingStrategy: 'horizontalMonth',
    },
    timelineDay: {
      renderingStrategy: 'horizontal',
    },
    timelineWeek: {
      renderingStrategy: 'horizontal',
    },
    timelineWorkWeek: {
      renderingStrategy: 'horizontal',
    },
    timelineMonth: {
      renderingStrategy: 'horizontalMonthLine',
    },
    agenda: {
      renderingStrategy: 'agenda',
    },
  };

  const { renderingStrategy } = appointmentRenderingStrategyMap[viewType];

  return renderingStrategy;
};

export const getAppointmentTakesAllDay = (
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

export const hasResourceValue = (
  resourceValues: FilterItemType[],
  itemValue: FilterItemType,
): boolean => isDefined(resourceValues.find(
  (value) => equalByValue(value, itemValue),
));

export const getOverflowIndicatorColor = (color: string, colors: string[]): string | undefined => (
  !colors.length || colors.filter((item) => item !== color).length === 0
    ? color
    : undefined
);

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
  const originDate = dateUtilsTs.addOffsets(date, [-viewOffset]);
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
    [viewOffset, cellIndexShift, -startViewDateOffset],
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
  groups: Group[],
  groupOrientation?: GroupOrientation,
): boolean => groupOrientation === VERTICAL_GROUP_ORIENTATION
  && !!groups.length;

export const getGroupCount = (groups: Group[]): number => {
  let result = 0;

  for (let i = 0, len = groups.length; i < len; i += 1) {
    if (!i) {
      result = groups[i].items.length;
    } else {
      result *= groups[i].items.length;
    }
  }

  return result;
};

export const getHorizontalGroupCount = (
  groups: Group[],
  groupOrientation: GroupOrientation,
): number => {
  const groupCount = getGroupCount(groups) || 1;
  const isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);

  return isVerticalGrouping ? 1 : groupCount;
};

export const isTimelineView = (
  viewType: ViewType,
): boolean => !!TIMELINE_VIEWS[viewType];

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
  groups: Group[],
  groupOrientation: GroupOrientation,
  isAllDayPanelVisible: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
): boolean => isVerticalGroupingApplied(groups, groupOrientation) && isAllDayPanelVisible;

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
  if (isVerticalGrouping && !!groupIndex) {
    return groupIndex.toString();
  }

  return '0';
};

export const getToday = (indicatorTime: Date | undefined, timeZoneCalculator: {
  createDate: (todayDate: Date, path: unknown) => Date;
}): Date => {
  const todayDate = indicatorTime ?? new Date();

  return timeZoneCalculator?.createDate(todayDate, { path: 'toGrid' }) || todayDate;
};

export const getCalculatedFirstDayOfWeek = (
  firstDayOfWeekOption: number | undefined,
): number => (isDefined(firstDayOfWeekOption)
  ? firstDayOfWeekOption
  : dateLocalization.firstDayOfWeekIndex());

export const isHorizontalGroupingApplied = (
  groups: Group[],
  groupOrientation?: GroupOrientation,
): boolean => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && !!groups.length;

export const isGroupingByDate = (
  groups: Group[],
  groupOrientation: GroupOrientation | undefined,
  groupByDate: boolean,
): boolean => {
  const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);

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
    if (viewDataProvider.isSkippedDate(currentDate)) {
      result += dayHours;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const startDateHours = startDate.getHours();
  const endDateHours = endDate.getHours() + (endDate.getTime() % HOUR_IN_MS) / HOUR_IN_MS;

  if (viewDataProvider.isSkippedDate(startDate)) {
    if (isAllDay) {
      result += DAY_HOURS;
    } else if (startDateHours < startDayHour) {
      result += dayHours;
    } else if (startDateHours < endDayHour) {
      result += endDayHour - startDateHours;
    }
  }

  if (viewDataProvider.isSkippedDate(endDate)) {
    if (isAllDay) {
      result += DAY_HOURS;
    } else if (endDateHours > endDayHour) {
      result += dayHours;
    } else if (endDateHours > startDayHour) {
      result += endDateHours - startDayHour;
    }
  }

  return result;
};

export const isDataOnWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
};

export const getWeekendsCount = (days: number): number => 2 * Math.floor(days / 7);

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

export const getGroupPanelData = (
  groups: Group[],
  columnCountPerGroup: number,
  groupByDate: boolean,
  baseColSpan: number,
): GroupPanelData => {
  let repeatCount = 1;
  let groupPanelItems = groups.map((group: Group) => {
    const result = [] as GroupRenderItem[];
    const { name: resourceName, items, data } = group;

    for (let iterator = 0; iterator < repeatCount; iterator += 1) {
      result.push(...items.map(({ id, text, color }: GroupItem, index: number) => ({
        id,
        text,
        color,
        key: `${iterator}_${resourceName}_${id}`,
        resourceName,
        data: data?.[index],
      })));
    }

    repeatCount *= items.length;
    return result;
  });

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
