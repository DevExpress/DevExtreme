import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';
import { shiftIntegerByModule } from '@ts/core/utils/math';
import {
  getDisplayedRowCount, getIsGroupedAllDayPanel, getKeyByGroup, weekUtils,
} from '@ts/scheduler/r1/utils/index';
import { formatImplicitSchedulerTime } from '@ts/scheduler/utils/global_formats';

import type {
  TimePanelCellData,
  TimePanelCellsData,
  TimePanelData,
  ViewCellData,
} from '../../types';
import type { ViewDataProviderExtendedOptions } from './types';
import type { ViewDataGenerator } from './view_data_generator';

const toMs = dateUtils.dateToMilliseconds;

interface TimePanelGenerateOptions extends ViewDataProviderExtendedOptions {
  rowCount?: number;
  topVirtualRowHeight?: number;
  bottomVirtualRowHeight?: number;
}

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
  constructor(private readonly viewDataGenerator: ViewDataGenerator) {
  }

  getCompleteTimePanelMap(
    options: ViewDataProviderExtendedOptions,
    completeViewDataMap: ViewCellData[][],
  ): TimePanelCellData[] {
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
    const lastRow = completeViewDataMap[rowsCount];
    const lastLabeledCell = lastRow.reduce<ViewCellData | undefined>((found, cell) => (
      cell.isDaylightHole ? found : cell
    ), undefined) ?? lastRow[lastRow.length - 1];
    const realEndViewDate = lastLabeledCell.endDate;

    const rowCountInGroup = this.viewDataGenerator.getRowCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
    });
    const cellCountInGroupRow = this.viewDataGenerator.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
    });

    let allDayRowsCount = 0;
    let usualCellIndex = 0;
    const wallMinutes = (cell: ViewCellData): number => cell.startDate.getHours() * 60
      + cell.startDate.getMinutes();
    const labeled = (rowCells: ViewCellData[]): ViewCellData => rowCells
      .find((cell) => !cell.isDaylightHole) ?? rowCells[0];
    const wallKey = (cell: ViewCellData): string => `${cell.groupIndex ?? 0}:${wallMinutes(cell)}`;
    const wallCounts = new Map<string, number>();

    completeViewDataMap.forEach((rowCells) => {
      if (rowCells[0]?.allDay) {
        return;
      }

      const key = wallKey(labeled(rowCells));
      wallCounts.set(key, (wallCounts.get(key) ?? 0) + 1);
    });

    return completeViewDataMap.map((row, index) => {
      const labelCell = row.find((cell) => !cell.isDaylightHole) ?? row[0];
      const {
        allDay,
        endDate,
        startDateUTC,
        endDateUTC,
        isDaylightHole,
        groups,
        groupIndex,
        isFirstGroupCell,
        isLastGroupCell,
        index: cellIndex,
        ...restCellProps
      } = row[0];
      const { startDate } = labelCell;

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
      // The second pass of a repeated hour is a block after the first pass,
      // so it is not always the neighboring row.
      const repeatedHour = (wallCounts.get(wallKey(labelCell)) ?? 0) > 1;
      const planLabel = Boolean(labelCell.startDateUTC) || row.some((cell) => cell.isDaylightHole);
      const directPlanLabel = planLabel && viewOffset === 0 && timeIndex % 2 === 0;
      const offsetPlanLabel = planLabel && viewOffset !== 0 && timeIndex % 2 === 0;
      const offsetLabelDate = dateUtilsTs.addOffsets(
        new Date(2000, 0, 1, startDayHour),
        viewOffset,
        cellDuration * timeIndex,
      );
      let text = weekUtils.getTimePanelCellText(
        timeIndex,
        startDate,
        startViewDate,
        cellDuration,
        startDayHour,
        viewOffset,
      );
      if (repeatedHour || directPlanLabel) {
        text = formatImplicitSchedulerTime(startDate);
      } else if (offsetPlanLabel) {
        text = formatImplicitSchedulerTime(offsetLabelDate);
      }

      return {
        ...restCellProps,
        startDate,
        allDay,
        highlighted,
        text,
        groups: isVerticalGrouping ? groups : undefined,
        groupIndex: isVerticalGrouping ? groupIndex : undefined,
        isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
        isLastGroupCell: isVerticalGrouping && isLastGroupCell,
        index: Math.floor(cellIndex / cellCountInGroupRow),
      };
    });
  }

  generateTimePanelData(
    completeTimePanelMap: TimePanelCellData[],
    options: TimePanelGenerateOptions,
  ): TimePanelData {
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

    const {
      previousGroupedData: groupedData,
    } = this.generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping);

    return {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      isGroupedAllDayPanel,
      groupedData,
    };
  }

  private generateTimePanelDataFromMap(
    timePanelMap: TimePanelCellData[],
    isVerticalGrouping: boolean,
  ): {
    previousGroupIndex: number | undefined;
    previousGroupedData: TimePanelCellsData[];
  } {
    return timePanelMap.reduce<{
      previousGroupIndex: number | undefined;
      previousGroupedData: TimePanelCellsData[];
    }>(
      ({ previousGroupIndex, previousGroupedData }, cellData) => {
        const currentGroupIndex = cellData.groupIndex;
        if (currentGroupIndex !== previousGroupIndex) {
          previousGroupedData.push({
            dateTable: [],
            isGroupedAllDayPanel: getIsGroupedAllDayPanel(
              Boolean(cellData.allDay),
              isVerticalGrouping,
            ),
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
      },
      { previousGroupIndex: -1, previousGroupedData: [] },
    );
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
    // NOTE: today date value shifted by -viewOffset for the render purposes.
    // Therefore, we roll-backing here this shift.
    const realToday = dateUtilsTs.addOffsets(today, viewOffset);
    // NOTE: start view date value calculated from the render options and hasn't viewOffset.
    // So, we must shift it by viewOffset to get the real start view date here.
    const realStartViewDate = dateUtilsTs.addOffsets(startViewDate, viewOffset);

    if (
      !showCurrentTimeIndicator
      || realToday < realStartViewDate
      || realToday >= realEndViewDate
    ) {
      return false;
    }

    const realTodayTimeMs = this.getLocalDateTimeInMs(realToday);
    const [startMs, endMs] = this.getHighlightedInterval(cellData);

    return startMs < endMs
      ? realTodayTimeMs >= startMs && realTodayTimeMs < endMs
      : (realTodayTimeMs >= startMs && realTodayTimeMs < toMs('day'))
      || (realTodayTimeMs >= 0 && realTodayTimeMs < endMs);
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
          shiftIntegerByModule(cellTimeMs + duration, toMs('day')),
        ];
      case isEvenCell:
        return [
          shiftIntegerByModule(cellTimeMs - duration, toMs('day')),
          shiftIntegerByModule(cellTimeMs + duration, toMs('day')),
        ];
      default:
        return [
          cellTimeMs,
          shiftIntegerByModule(cellTimeMs + 2 * duration, toMs('day')),
        ];
    }
  }

  private getLocalDateTimeInMs(date: Date): number {
    const dateUtcMs = date.getTime() - date.getTimezoneOffset() * toMs('minute');
    return shiftIntegerByModule(dateUtcMs, toMs('day'));
  }

  private isLastCellInGroup(
    completeViewDataMap: ViewCellData[][],
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

    return (nextAllDay ?? false) || nextGroupIndex !== currentGroupIndex;
  }
}
