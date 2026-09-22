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

/** A cell of a DST plan already shows the wall clock it must be labelled with. */
const keepHeaderDate = (_: number, date: Date): Date => date;

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
      viewOffset,
    } = options;

    const resourceManager = getResourceManager();
    const groupCount = resourceManager.groupCount();
    const cellCountInDay = this.viewDataGenerator
      .getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const daylightPlan = this.viewDataGenerator.getDaylightPlan(options);
    const horizontalGroupCount = getHorizontalGroupCount(groupCount, groupOrientation);
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;
    const colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;

    const datesRepeatCount = isHorizontalGrouping && !isGroupedByDate
      ? groupCount
      : 1;

    const daysInGroup = this.viewDataGenerator.daysInInterval * intervalCount;
    const daysInView = daysInGroup * datesRepeatCount;

    const weekDaysRow: DateHeaderCellData[] = [];
    let columnCursor = 0;

    for (let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
      const cellsInDay = daylightPlan?.days[dayIndex % daysInGroup].cells.length ?? cellCountInDay;
      const dayColSpan = daylightPlan
        ? (isGroupedByDate ? horizontalGroupCount : 1) * cellsInDay
        : colSpan;
      const cell = completeViewDataMap[index][daylightPlan ? columnCursor : dayIndex * colSpan];
      columnCursor += dayColSpan;
      if (!cell) {
        break;
      }

      const {
        startDate, endDate, startDateUTC, endDateUTC, ...restProps
      } = cell;
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
      timeZoneCalculator: options.timeZoneCalculator,
    });
    const hasDaylightPlan = Boolean(this.viewDataGenerator.getDaylightPlan(options));
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
        startDateUTC,
        endDateUTC,
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
        // NOTE: A cell of a DST plan already carries the wall clock it shows, so the
        // legacy correction, which assumes every day holds the same number of cells,
        // must not run over it.
        hasDaylightPlan ? keepHeaderDate : getDateForHeaderText,
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
    const headerSpans = completeDateHeaderMap[rowIndex].map((cell) => cell.colSpan ?? colSpan);
    if (headerSpans.some((span) => span !== colSpan)) {
      return this.generateVariableSpanHeaderRow(
        completeDateHeaderMap[rowIndex],
        headerSpans,
        completeViewDataMap,
        options,
        cellWidth,
      );
    }
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

  private generateVariableSpanHeaderRow(
    headerRow: DateHeaderCellData[],
    headerSpans: number[],
    completeViewDataMap: ViewCellData[][],
    options: ViewDataProviderExtendedOptions,
    cellWidth: number,
  ): DateHeaderDataRowConfig {
    const { startCellIndex, cellCount, isProvideVirtualCellsWidth } = options;
    const displayedCellCount = getDisplayedCellCount(cellCount, completeViewDataMap);
    const endCellIndex = startCellIndex + displayedCellCount;
    const totalCellCount = getTotalCellCountByCompleteData(completeViewDataMap);
    let covered = 0;
    let firstHeader = 0;

    while (
      firstHeader < headerSpans.length
      && covered + headerSpans[firstHeader] <= startCellIndex
    ) {
      covered += headerSpans[firstHeader];
      firstHeader += 1;
    }

    let rightCovered = 0;
    let lastHeader = 0;
    while (lastHeader < headerSpans.length && rightCovered < endCellIndex) {
      rightCovered += headerSpans[lastHeader];
      lastHeader += 1;
    }

    const rightGap = Math.max(0, totalCellCount - rightCovered);

    return {
      dateRow: headerRow.slice(firstHeader, lastHeader),
      leftVirtualCellCount: covered,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? covered * cellWidth : undefined,
      rightVirtualCellCount: rightGap,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? rightGap * cellWidth : undefined,
    };
  }
}
