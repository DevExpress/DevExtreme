import dateUtils from '@js/core/utils/date';
import type { DateHeaderCellData, DateHeaderData, ViewCellData } from '@ts/scheduler/types';

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
import type { ViewDataProviderExtendedOptions } from './types';
import type { ViewDataGenerator } from './view_data_generator';

interface DateHeaderGenerateOptions extends ViewDataProviderExtendedOptions {
  cellWidth?: number;
  isMonthDateHeader?: boolean;
}

interface DateHeaderDataRowConfig {
  dateRow: DateHeaderCellData[];
  leftVirtualCellCount: number;
  leftVirtualCellWidth: number | undefined;
  rightVirtualCellCount: number;
  rightVirtualCellWidth: number | undefined;
}

export class DateHeaderDataGenerator {
  constructor(private readonly viewDataGenerator: ViewDataGenerator) {
  }

  getCompleteDateHeaderMap(
    options: ViewDataProviderExtendedOptions,
    completeViewDataMap: ViewCellData[][],
  ): DateHeaderCellData[][] {
    const {
      isGenerateWeekDaysHeaderData,
    } = options;

    const result: DateHeaderCellData[][] = [];

    if (isGenerateWeekDaysHeaderData) {
      const weekDaysRow = this.generateWeekDaysHeaderRowMap(options, completeViewDataMap);
      result.push(weekDaysRow);
    }

    const dateRow = this.generateHeaderDateRow(options, completeViewDataMap);

    result.push(dateRow);

    return result;
  }

  private generateWeekDaysHeaderRowMap(
    options: ViewDataProviderExtendedOptions,
    completeViewDataMap: ViewCellData[][],
  ): DateHeaderCellData[] {
    const {
      isGroupedByDate,
      getResourceManager,
      groupOrientation,
      startDayHour,
      endDayHour,
      hoursInterval,
      isHorizontalGrouping,
      intervalCount,
      currentDate,
      startViewDate,
      viewType,
      viewOffset,
    } = options;

    const resourceManager = getResourceManager();
    const groupCount = resourceManager.groupCount();
    const cellCountInDay = this.viewDataGenerator
      .getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const horizontalGroupCount = getHorizontalGroupCount(groupCount, groupOrientation);
    const extraCellCounts = this.viewDataGenerator.getFallBackExtraCellCounts({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
      startViewDate,
      skippedDays: options.skippedDays,
    });
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;

    const datesRepeatCount = isHorizontalGrouping && !isGroupedByDate
      ? groupCount
      : 1;

    const daysInGroup = this.viewDataGenerator.daysInInterval * intervalCount;
    const daysInView = daysInGroup * datesRepeatCount;
    const cells = completeViewDataMap[index];

    const weekDaysRow: DateHeaderCellData[] = [];
    let cellIndex = 0;

    for (let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
      const startCell = cells[cellIndex];
      if (!startCell) {
        break;
      }

      const { startDate, endDate, ...restProps } = startCell;
      const dayIndexInGroup = dayIndex % daysInGroup;
      const baseColSpan = cellCountInDay + (extraCellCounts[dayIndexInGroup] ?? 0);
      const dayColSpan = isGroupedByDate
        ? horizontalGroupCount * baseColSpan
        : baseColSpan;
      cellIndex += dayColSpan;

      const shiftedStartDate = timeZoneUtils.addOffsetsWithoutDST(startDate, -viewOffset);

      weekDaysRow.push({
        ...restProps,
        startDate,
        colSpan: dayColSpan,
        text: formatWeekdayAndDay(shiftedStartDate),
        isFirstGroupCell: false,
        isLastGroupCell: false,
      });
    }

    return weekDaysRow;
  }

  private generateHeaderDateRow(
    options: ViewDataProviderExtendedOptions,
    completeViewDataMap: ViewCellData[][],
  ): DateHeaderCellData[] {
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

    const horizontalGroupCount = getHorizontalGroupCount(
      getResourceManager().groupCount(),
      groupOrientation,
    );
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
      startViewDate,
      skippedDays: options.skippedDays,
    });
    const cellCountInDay = this.viewDataGenerator
      .getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    const slicedByColumnsData = isGroupedByDate
      ? completeViewDataMap[index]
        .filter((_, columnIndex) => columnIndex % horizontalGroupCount === 0)
      : completeViewDataMap[index];

    // NOTE: Should leave dates as is when creating time row in timelines.
    const shouldShiftDatesForHeaderText = !isTimelineView(viewType)
      || viewType === VIEWS.TIMELINE_MONTH;

    return slicedByColumnsData.map((cellData, idx: number) => {
      const {
        startDate,
        endDate,
        isFirstGroupCell,
        isLastGroupCell,
        ...restProps
      } = cellData;

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

  generateDateHeaderData(
    completeDateHeaderMap: DateHeaderCellData[][],
    completeViewDataMap: ViewCellData[][],
    options: DateHeaderGenerateOptions,
  ): DateHeaderData {
    const {
      isGenerateWeekDaysHeaderData,
      cellWidth,
      isProvideVirtualCellsWidth,
      startDayHour,
      endDayHour,
      hoursInterval,
      isMonthDateHeader,
    } = options;

    const dataMap: DateHeaderCellData[][] = [];
    const validCellWidth = cellWidth ?? 0;

    const weekDayRowConfig: DateHeaderDataRowConfig | undefined = isGenerateWeekDaysHeaderData
      ? this.generateDateHeaderDataRow(
        options,
        completeDateHeaderMap,
        completeViewDataMap,
        this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval),
        0,
        validCellWidth,
      )
      : undefined;

    if (weekDayRowConfig) {
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
      leftVirtualCellWidth: isProvideVirtualCellsWidth
        ? datesRowConfig.leftVirtualCellWidth
        : undefined,
      rightVirtualCellWidth: isProvideVirtualCellsWidth
        ? datesRowConfig.rightVirtualCellWidth
        : undefined,
      leftVirtualCellCount: datesRowConfig.leftVirtualCellCount,
      rightVirtualCellCount: datesRowConfig.rightVirtualCellCount,
      weekDayLeftVirtualCellWidth: weekDayRowConfig?.leftVirtualCellWidth,
      weekDayRightVirtualCellWidth: weekDayRowConfig?.rightVirtualCellWidth,
      weekDayLeftVirtualCellCount: weekDayRowConfig?.leftVirtualCellCount,
      weekDayRightVirtualCellCount: weekDayRowConfig?.rightVirtualCellCount,
      isMonthDateHeader,
    };
  }

  private generateDateHeaderDataRow(
    options: ViewDataProviderExtendedOptions,
    completeDateHeaderMap: DateHeaderCellData[][],
    completeViewDataMap: ViewCellData[][],
    baseColSpan: number,
    rowIndex: number,
    cellWidth: number,
  ): DateHeaderDataRowConfig {
    const {
      startCellIndex,
      cellCount,
      isProvideVirtualCellsWidth,
      getResourceManager,
      groupOrientation,
      isGroupedByDate,
    } = options;

    const horizontalGroupCount = getHorizontalGroupCount(
      getResourceManager().groupCount(),
      groupOrientation,
    );
    const colSpan = isGroupedByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
    const displayedCellCount = getDisplayedCellCount(cellCount, completeViewDataMap);
    const totalCellCount = getTotalCellCountByCompleteData(completeViewDataMap);
    const completeDateRow = completeDateHeaderMap[rowIndex];

    let leftHeaderIndex = 0;
    let finalLeftVirtualCellCount = 0;
    while (
      leftHeaderIndex < completeDateRow.length
      && finalLeftVirtualCellCount
        + (completeDateRow[leftHeaderIndex].colSpan ?? colSpan) <= startCellIndex
    ) {
      finalLeftVirtualCellCount += completeDateRow[leftHeaderIndex].colSpan ?? colSpan;
      leftHeaderIndex += 1;
    }

    const visibleCellEnd = startCellIndex + displayedCellCount;
    let rightHeaderIndex = leftHeaderIndex;
    let renderedCellEnd = finalLeftVirtualCellCount;
    while (rightHeaderIndex < completeDateRow.length && renderedCellEnd < visibleCellEnd) {
      renderedCellEnd += completeDateRow[rightHeaderIndex].colSpan ?? colSpan;
      rightHeaderIndex += 1;
    }

    const dateRow = completeDateRow.slice(leftHeaderIndex, rightHeaderIndex);
    const finalLeftVirtualCellWidth = finalLeftVirtualCellCount * cellWidth;
    const finalRightVirtualCellCount = totalCellCount - renderedCellEnd;
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
