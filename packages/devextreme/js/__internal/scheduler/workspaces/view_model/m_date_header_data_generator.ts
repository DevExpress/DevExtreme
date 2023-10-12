import dateUtils from '@js/core/utils/date';
import {
  formatWeekdayAndDay,
  getDisplayedCellCount,
  getHeaderCellText,
  getHorizontalGroupCount,
  getTotalCellCountByCompleteData,
  isTimelineView,
} from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { dateUtilsTs } from '@ts/core/utils/date';
import { VIEWS } from '@ts/scheduler/m_constants';

import { getGroupCount } from '../../resources/m_utils';

export class DateHeaderDataGenerator {
  constructor(public _viewDataGenerator) {
  }

  getCompleteDateHeaderMap(options, completeViewDataMap) {
    const {
      isGenerateWeekDaysHeaderData,
    } = options;

    const result: any[] = [];

    if (isGenerateWeekDaysHeaderData) {
      const weekDaysRow = this._generateWeekDaysHeaderRowMap(options, completeViewDataMap);
      result.push(weekDaysRow);
    }

    const dateRow = this._generateHeaderDateRow(options, completeViewDataMap);

    result.push(dateRow);

    return result;
  }

  _generateWeekDaysHeaderRowMap(options, completeViewDataMap) {
    const {
      isGroupedByDate,
      groups,
      groupOrientation,
      startDayHour,
      endDayHour,
      hoursInterval,
      isHorizontalGrouping,
      intervalCount,
      viewOffset,
    } = options;

    const cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;
    const colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;

    const groupCount = getGroupCount(groups);
    const datesRepeatCount = isHorizontalGrouping && !isGroupedByDate
      ? groupCount
      : 1;

    const daysInGroup = this._viewDataGenerator.daysInInterval * intervalCount;
    const daysInView = daysInGroup * datesRepeatCount;

    const weekDaysRow: any[] = [];

    for (let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
      const cell = completeViewDataMap[index][dayIndex * colSpan];
      const shiftedStartDate = dateUtilsTs.addOffsets(cell.startDate, [-viewOffset]);

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

  _generateHeaderDateRow(options, completeViewDataMap) {
    const {
      today,
      isGroupedByDate,
      groupOrientation,
      groups,
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

    const horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
    const index = completeViewDataMap[0][0].allDay ? 1 : 0;
    const colSpan = isGroupedByDate ? horizontalGroupCount : 1;
    const isVerticalGrouping = groupOrientation === 'vertical';

    const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
    });
    const cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    const slicedByColumnsData = isGroupedByDate
      ? completeViewDataMap[index].filter((_, columnIndex) => columnIndex % horizontalGroupCount === 0)
      : completeViewDataMap[index];

    // NOTE: Should leave dates as is when creating time row in timelines.
    const shouldShiftDates = !isTimelineView(viewType) || viewType === VIEWS.TIMELINE_MONTH;

    return slicedByColumnsData.map(({
      startDate,
      endDate,
      isFirstGroupCell,
      isLastGroupCell,
      ...restProps
    }, index) => {
      const shiftedStartDate = shouldShiftDates
        ? dateUtilsTs.addOffsets(startDate, [-viewOffset])
        : startDate;

      const text = getHeaderCellText(
        index % cellCountInGroupRow,
        shiftedStartDate,
        headerCellTextFormat,
        getDateForHeaderText,
        {
          interval,
          startViewDate,
          startDayHour,
          cellCountInDay,
        },
      );

      return {
        ...restProps,
        startDate,
        text,
        today: dateUtils.sameDate(startDate, today),
        colSpan,
        isFirstGroupCell: isGroupedByDate || (isFirstGroupCell && !isVerticalGrouping),
        isLastGroupCell: isGroupedByDate || (isLastGroupCell && !isVerticalGrouping),
      };
    });
  }

  generateDateHeaderData(completeDateHeaderMap, completeViewDataMap, options) {
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
      weekDayRowConfig = this._generateDateHeaderDataRow(
        options,
        completeDateHeaderMap,
        completeViewDataMap,
        this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval),
        0,
        validCellWidth,
      );

      dataMap.push(weekDayRowConfig.dateRow);
    }

    const datesRowConfig = this._generateDateHeaderDataRow(
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

  _generateDateHeaderDataRow(
    options,
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
      groups,
      groupOrientation,
      isGroupedByDate,
    } = options;

    const horizontalGroupCount = getHorizontalGroupCount(groups, groupOrientation);
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
