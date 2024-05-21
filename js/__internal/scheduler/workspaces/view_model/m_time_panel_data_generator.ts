import dateUtils from '@js/core/utils/date';
import { getDisplayedRowCount } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/base';
import { getTimePanelCellText } from '@js/renovation/ui/scheduler/view_model/to_test/views/utils/week';
import { getIsGroupedAllDayPanel, getKeyByGroup } from '@js/renovation/ui/scheduler/workspaces/utils';

import { shiftIntegerByModule } from '../../../core/utils/math';

const toMs = dateUtils.dateToMilliseconds;

interface TimePanelGeneratorCellData {
  date: Date;
  index: number;
  duration: number;
  isFirst: boolean;
  isLast: boolean;
}

interface TimePanelVisibleInterval {
  startViewDate: Date;
  realEndViewDate: Date;
  showCurrentTimeIndicator: boolean;
}

export class TimePanelDataGenerator {
  constructor(public _viewDataGenerator) {
  }

  getCompleteTimePanelMap(options, completeViewDataMap) {
    const {
      startViewDate,
      cellDuration,
      startDayHour,
      isVerticalGrouping,
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      endDayHour,
      viewOffset,
      today,
      showCurrentTimeIndicator,
    } = options;
    const rowsCount = completeViewDataMap.length - 1;
    const realEndViewDate = completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate;

    const rowCountInGroup = this._viewDataGenerator.getRowCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
    });
    const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
    });

    let allDayRowsCount = 0;
    let usualCellIndex = 0;
    return completeViewDataMap.map((row, index) => {
      const {
        allDay,
        startDate,
        endDate,
        groups,
        groupIndex,
        isFirstGroupCell,
        isLastGroupCell,
        index: cellIndex,
        ...restCellProps
      } = row[0];

      const highlighted = allDay
        ? false
        : this.isTimeCellShouldBeHighlighted(
          today,
          viewOffset,
          {
            startViewDate,
            realEndViewDate,
            showCurrentTimeIndicator,
          },
          {
            date: startDate,
            index: usualCellIndex,
            // NOTE: The 'cellDuration' (in ms) here created from the float 'hoursInterval' value.
            // It may be not equal integer value but very close to it.
            // Therefore, we round this value here.
            duration: Math.round(cellDuration),
            isFirst: usualCellIndex === 0,
            isLast: this.isLastCellInGroup(completeViewDataMap, index),
          },
        );

      if (allDay) {
        allDayRowsCount += 1;
        usualCellIndex = 0;
      } else {
        usualCellIndex += 1;
      }

      const timeIndex = (index - allDayRowsCount) % rowCountInGroup;
      return {
        ...restCellProps,
        startDate,
        allDay,
        highlighted,
        text: getTimePanelCellText(
          timeIndex,
          startDate,
          startViewDate,
          cellDuration,
          startDayHour,
        ),
        groups: isVerticalGrouping ? groups : undefined,
        groupIndex: isVerticalGrouping ? groupIndex : undefined,
        isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
        isLastGroupCell: isVerticalGrouping && isLastGroupCell,
        index: Math.floor(cellIndex / cellCountInGroupRow),
      };
    });
  }

  generateTimePanelData(completeTimePanelMap, options) {
    const {
      startRowIndex,
      rowCount,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel,
      isVerticalGrouping,
      isAllDayPanelVisible,
    } = options;

    const indexDifference = isVerticalGrouping || !isAllDayPanelVisible ? 0 : 1;
    const correctedStartRowIndex = startRowIndex + indexDifference;

    const displayedRowCount = getDisplayedRowCount(rowCount, completeTimePanelMap);
    const timePanelMap = completeTimePanelMap
      .slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount);

    const timePanelData: any = {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel,
    };

    const {
      previousGroupedData: groupedData,
    } = this._generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping);

    timePanelData.groupedData = groupedData;

    return timePanelData;
  }

  _generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping) {
    return timePanelMap.reduce(({ previousGroupIndex, previousGroupedData }, cellData) => {
      const currentGroupIndex = cellData.groupIndex;
      if (currentGroupIndex !== previousGroupIndex) {
        previousGroupedData.push({
          dateTable: [],
          isGroupedAllDayPanel: getIsGroupedAllDayPanel(!!cellData.allDay, isVerticalGrouping),
          groupIndex: currentGroupIndex,
          key: getKeyByGroup(currentGroupIndex, isVerticalGrouping),
        });
      }
      if (cellData.allDay) {
        previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellData;
      } else {
        previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellData);
      }

      return {
        previousGroupIndex: currentGroupIndex,
        previousGroupedData,
      };
    }, { previousGroupIndex: -1, previousGroupedData: [] });
  }

  private isTimeCellShouldBeHighlighted(
    today: Date,
    viewOffset: number,
    {
      startViewDate,
      realEndViewDate,
      showCurrentTimeIndicator,
    }: TimePanelVisibleInterval,
    cellData: TimePanelGeneratorCellData,
  ): boolean {
    if (
      !showCurrentTimeIndicator
      || today < startViewDate
      || today >= realEndViewDate
    ) {
      return false;
    }

    const realTodayTimeMs = this.getLocalDateTimeInMs(today);
    const [startMs, endMs] = this.getHighlightedInterval(cellData);

    return realTodayTimeMs >= startMs && realTodayTimeMs < endMs;
  }

  private getHighlightedInterval({
    date,
    index,
    duration,
    isFirst,
    isLast,
  }: TimePanelGeneratorCellData): [startMs: number, endMs: number] {
    const cellTimeMs = this.getLocalDateTimeInMs(date);
    const isEvenCell = index % 2 === 0;

    switch (true) {
      case isFirst || (isLast && !isEvenCell):
        return [
          cellTimeMs,
          cellTimeMs + duration,
        ];
      case isEvenCell:
        return [
          cellTimeMs - duration,
          cellTimeMs + duration,
        ];
      default:
        return [
          cellTimeMs,
          cellTimeMs + 2 * duration,
        ];
    }
  }

  private getLocalDateTimeInMs(date: Date): number {
    const dateUtcMs = date.getTime() - date.getTimezoneOffset() * toMs('minute');
    return shiftIntegerByModule(dateUtcMs, toMs('day'));
  }

  private isLastCellInGroup(
    completeViewDataMap: any,
    index: number,
  ): boolean {
    if (index === completeViewDataMap.length - 1) {
      return true;
    }

    const { groupIndex: currentGroupIndex } = completeViewDataMap[index][0];
    const {
      groupIndex: nextGroupIndex,
      allDay: nextAllDay,
    } = completeViewDataMap[index + 1][0];

    return nextAllDay || nextGroupIndex !== currentGroupIndex;
  }
}
