import dateUtils from '@js/core/utils/date';
import type { DateHeaderData } from '@ts/scheduler/types';

import {
  formatWeekdayAndDay,
  getDisplayedCellCount,
  getHeaderCellText,
  getHorizontalGroupCount,
  getTotalCellCountByCompleteData,
  isTimelineView,
} from '../../r1/utils/index';
import { VIEWS } from '../../utils/options/constants_view';
import timeZoneUtils from '../../utils_time_zone';
import type { ViewDataProviderExtendedOptions } from './m_types';

export class DateHeaderDataGenerator {
  constructor(private readonly viewDataGenerator) {
  }

  getCompleteDateHeaderMap(options: ViewDataProviderExtendedOptions, completeViewDataMap) {
    const {
      isGenerateWeekDaysHeaderData,
    } = options;

    const result: any[] = [];

    if (isGenerateWeekDaysHeaderData) {
      const weekDaysRow = this.generateWeekDaysHeaderRowMap(options, completeViewDataMap);
      result.push(weekDaysRow);
    }

    const dateRow = this.generateHeaderDateRow(options, completeViewDataMap);

    result.push(dateRow);

    return result;
  }

  private generateWeekDaysHeaderRowMap(options: ViewDataProviderExtendedOptions, completeViewDataMap) {
    const {
      isGroupedByDate,
      getResourceManager,
      groupOrientation,
      startDayHour,
      endDayHour,
      hoursInterval,
      isHorizontalGrouping,
      intervalCount,
      viewOffset,
    } = options;

    const resourceManager = getResourceManager();
    const groupCount = resourceManager.groupCount();
    const cellCountInDay = this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const horizontalGroupCount = getHorizontalGroupCount(groupCount, groupOrientation);
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;
    const colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;

    const datesRepeatCount = isHorizontalGrouping && !isGroupedByDate
      ? groupCount
      : 1;

    const daysInGroup = this.viewDataGenerator.daysInInterval * intervalCount;
    const daysInView = daysInGroup * datesRepeatCount;

    const weekDaysRow: any[] = [];

    for (let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
      const cell = completeViewDataMap[index][dayIndex * colSpan];
      const shiftedStartDate = timeZoneUtils.addOffsetsWithoutDST(cell.startDate, -viewOffset);

      weekDaysRow.push({
        ...cell,
        colSpan,
        text: formatWeekdayAndDay(shiftedStartDate),
        isFirstGroupCell: false,
        isLastGroupCell: false,
      });
    }

    return weekDaysRow;
  }

  private generateHeaderDateRow(options: ViewDataProviderExtendedOptions, completeViewDataMap) {
    const {
      today,
      isGroupedByDate,
      groupOrientation,
      getResourceManager,
      headerCellTextFormat,
      getDateForHeaderText,
      interval,
      startViewDate,
      startDayHour,
      endDayHour,
      hoursInterval,
      intervalCount,
      currentDate,
      viewType,
      viewOffset,
    } = options;

    const horizontalGroupCount = getHorizontalGroupCount(getResourceManager().groupCount(), groupOrientation);
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;
    const colSpan = isGroupedByDate ? horizontalGroupCount : 1;
    const isVerticalGrouping = groupOrientation === 'vertical';

    const cellCountInGroupRow = this.viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
    });
    const cellCountInDay = this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    const slicedByColumnsData = isGroupedByDate
      ? completeViewDataMap[index].filter((_, columnIndex) => columnIndex % horizontalGroupCount === 0)
      : completeViewDataMap[index];

    // NOTE: Should leave dates as is when creating time row in timelines.
    const shouldShiftDatesForHeaderText = !isTimelineView(viewType)
      || viewType === VIEWS.TIMELINE_MONTH;

    return slicedByColumnsData.map(({
      startDate,
      endDate,
      isFirstGroupCell,
      isLastGroupCell,
      ...restProps
    }, idx: number) => {
      const shiftedStartDate = timeZoneUtils.addOffsetsWithoutDST(startDate, -viewOffset);
      const shiftedStartDateForHeaderText = shouldShiftDatesForHeaderText
        ? shiftedStartDate
        : startDate;

      const text = getHeaderCellText(
        idx % cellCountInGroupRow,
        shiftedStartDateForHeaderText,
        headerCellTextFormat,
        getDateForHeaderText,
        {
          interval,
          startViewDate,
          startDayHour,
          cellCountInDay,
          viewOffset,
        },
      );

      return {
        ...restProps,
        startDate,
        text,
        today: dateUtils.sameDate(shiftedStartDate, today),
        colSpan,
        isFirstGroupCell: isGroupedByDate || (isFirstGroupCell && !isVerticalGrouping),
        isLastGroupCell: isGroupedByDate || (isLastGroupCell && !isVerticalGrouping),
      };
    });
  }

  generateDateHeaderData(completeDateHeaderMap, completeViewDataMap, options): DateHeaderData {
    const {
      isGenerateWeekDaysHeaderData,
      cellWidth,
      isProvideVirtualCellsWidth,
      startDayHour,
      endDayHour,
      hoursInterval,
      isMonthDateHeader,
    } = options;

    const dataMap: any[] = [];
    let weekDayRowConfig: any = {};
    const validCellWidth = cellWidth || 0;

    if (isGenerateWeekDaysHeaderData) {
      weekDayRowConfig = this.generateDateHeaderDataRow(
        options,
        completeDateHeaderMap,
        completeViewDataMap,
        this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval),
        0,
        validCellWidth,
      );

      dataMap.push(weekDayRowConfig.dateRow);
    }

    const datesRowConfig = this.generateDateHeaderDataRow(
      options,
      completeDateHeaderMap,
      completeViewDataMap,
      1,
      isGenerateWeekDaysHeaderData ? 1 : 0,
      validCellWidth,
    );

    dataMap.push(datesRowConfig.dateRow);

    return {
      dataMap,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.leftVirtualCellWidth : undefined,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.rightVirtualCellWidth : undefined,
      leftVirtualCellCount: datesRowConfig.leftVirtualCellCount,
      rightVirtualCellCount: datesRowConfig.rightVirtualCellCount,
      weekDayLeftVirtualCellWidth: weekDayRowConfig.leftVirtualCellWidth,
      weekDayRightVirtualCellWidth: weekDayRowConfig.rightVirtualCellWidth,
      weekDayLeftVirtualCellCount: weekDayRowConfig.leftVirtualCellCount,
      weekDayRightVirtualCellCount: weekDayRowConfig.rightVirtualCellCount,
      isMonthDateHeader,
    };
  }

  private generateDateHeaderDataRow(
    options: ViewDataProviderExtendedOptions,
    completeDateHeaderMap,
    completeViewDataMap,
    baseColSpan,
    rowIndex,
    cellWidth,
  ) {
    const {
      startCellIndex,
      cellCount,
      isProvideVirtualCellsWidth,
      getResourceManager,
      groupOrientation,
      isGroupedByDate,
    } = options;

    const horizontalGroupCount = getHorizontalGroupCount(getResourceManager().groupCount(), groupOrientation);
    const colSpan = isGroupedByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
    const leftVirtualCellCount = Math.floor(startCellIndex / colSpan);
    const displayedCellCount = getDisplayedCellCount(cellCount, completeViewDataMap);
    const actualCellCount = Math.ceil((startCellIndex + displayedCellCount) / colSpan);
    const totalCellCount = getTotalCellCountByCompleteData(completeViewDataMap);

    const dateRow = completeDateHeaderMap[rowIndex].slice(leftVirtualCellCount, actualCellCount);

    const finalLeftVirtualCellCount = leftVirtualCellCount * colSpan;
    const finalLeftVirtualCellWidth = finalLeftVirtualCellCount * cellWidth;
    const finalRightVirtualCellCount = totalCellCount - actualCellCount * colSpan;
    const finalRightVirtualCellWidth = finalRightVirtualCellCount * cellWidth;

    return {
      dateRow,
      leftVirtualCellCount: finalLeftVirtualCellCount,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? finalLeftVirtualCellWidth : undefined,
      rightVirtualCellCount: finalRightVirtualCellCount,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? finalRightVirtualCellWidth : undefined,
    };
  }
}
