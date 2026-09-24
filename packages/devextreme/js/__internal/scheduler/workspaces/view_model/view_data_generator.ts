import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { GroupLeaf } from '@ts/scheduler/utils/resource_manager/types';

import { HORIZONTAL_GROUP_ORIENTATION } from '../../constants';
import type { GroupedViewData } from '../../r1/components/types';
import {
  calculateCellIndex,
  calculateDayDuration,
  getDisplayedCellCount,
  getDisplayedRowCount,
  getIsGroupedAllDayPanel,
  getKeyByGroup, getStartViewDateWithoutDST,
  getTotalCellCountByCompleteData,
  getTotalRowCountByCompleteData,
  isHorizontalView,
} from '../../r1/utils/index';
import type {
  CellInfo,
  CountGenerationConfig,
  GroupedDataMap,
  ViewCellData,
  ViewDataMap,
  ViewType,
} from '../../types';
import {
  buildDaylightPlan,
  type DaylightCell,
  type DaylightPlan,
  getPlanCell,
  visibleDayOrigins,
} from '../../utils/daylight_grid';
import { VIEWS } from '../../utils/options/constants_view';
import { getAllGroupValues } from '../../utils/resource_manager/group_utils';
import {
  getVisibleDaysOfWeek,
  isDateSkipped,
} from '../../utils/skipped_days';
import timezoneUtils from '../../utils_time_zone';
import type {
  ViewCellDataSimple,
  ViewCellGeneratedData,
  ViewCellIndex,
  ViewDataMapOptions,
  ViewDataProviderExtendedOptions,
  ViewDataProviderOptions,
} from './types';

const toMs = dateUtils.dateToMilliseconds;

export interface VerticalSlot {
  wallMinutes: number;
  occurrence: number;
}

const wallMinutesOf = (date: Date): number => date.getHours() * 60 + date.getMinutes();

const MINUTES_IN_DAY = 24 * 60;

const slotKey = (slot: VerticalSlot): string => `${slot.wallMinutes}:${slot.occurrence}`;

// The second pass follows the whole first pass of the repeated hour
// (23:00, 23:15, 23:30, 23:45, then 23:00 again), not each minute twice in a row.
const elapsedSlotKey = (slot: VerticalSlot, plan: DaylightPlan): number => {
  const transition = plan.days.find((day) => (
    day.transition && day.transition.deltaMs < 0
  ))?.transition;

  if (!transition || slot.occurrence === 0) {
    return slot.wallMinutes;
  }

  const afterMinutes = transition.wallBeforeMinutes + transition.deltaMs / toMs('minute');
  const offset = slot.wallMinutes - afterMinutes;

  return (transition.wallBeforeMinutes - 1) + (offset + 1) / MINUTES_IN_DAY;
};

const unionVerticalSlots = (plan: DaylightPlan): VerticalSlot[] => {
  const slots: VerticalSlot[] = [];
  const seen = new Set<string>();

  plan.days.forEach((day) => {
    const seenInDay = new Map<number, number>();

    day.cells.forEach((cell) => {
      const wallMinutes = wallMinutesOf(cell.start);
      const occurrence = seenInDay.get(wallMinutes) ?? 0;
      seenInDay.set(wallMinutes, occurrence + 1);
      const slot = { wallMinutes, occurrence };

      if (!seen.has(slotKey(slot))) {
        seen.add(slotKey(slot));
        slots.push(slot);
      }
    });
  });

  return slots.sort((left, right) => elapsedSlotKey(left, plan) - elapsedSlotKey(right, plan));
};

// Offset moves the first row to that wall time. Adding it to the instant instead
// turns the repeated 1:00 into a second 7:00 or 8:00 on the shared week scale.
const rotateSlots = (slots: VerticalSlot[], viewOffset: number): VerticalSlot[] => {
  const offsetMinutes = Math.round(viewOffset / toMs('minute'));
  const start = ((offsetMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;

  if (!start) {
    return slots;
  }

  return [
    ...slots.filter((slot) => slot.wallMinutes >= start),
    ...slots.filter((slot) => slot.wallMinutes < start),
  ];
};

// A column is one offset-length window. Hours past midnight belong to the
// previous column; evening hours of a negative offset belong to the next one.
export const sourceColumnDayIndex = (
  columnIndex: number,
  wallMinutes: number,
  viewOffset: number,
  dayCount: number,
): number => {
  if (dayCount < 2 || !viewOffset) {
    return columnIndex;
  }

  const offsetMinutes = Math.round(viewOffset / toMs('minute'));
  const start = ((offsetMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;

  if (!start) {
    return columnIndex;
  }

  if (viewOffset > 0) {
    return wallMinutes < start ? columnIndex + 1 : columnIndex;
  }

  return wallMinutes >= start ? columnIndex - 1 : columnIndex;
};

const cellForSlot = (cells: DaylightCell[], slot: VerticalSlot): DaylightCell | undefined => {
  const seenInDay = new Map<number, number>();

  return cells.find((cell) => {
    const wallMinutes = wallMinutesOf(cell.start);
    const occurrence = seenInDay.get(wallMinutes) ?? 0;
    seenInDay.set(wallMinutes, occurrence + 1);

    return wallMinutes === slot.wallMinutes && occurrence === slot.occurrence;
  });
};

export class ViewDataGenerator {
  protected tableAllDay: boolean | undefined = false;

  public hiddenInterval = 0;

  public skippedDays: number[] = [];

  private daylightPlan?: DaylightPlan;

  private verticalSlots?: VerticalSlot[];

  private extendedOptions?: ViewDataProviderExtendedOptions;

  constructor(public readonly viewType: ViewType) {}

  get daysInInterval(): number {
    const isWeekLikeView = [
      VIEWS.WEEK,
      VIEWS.TIMELINE_WEEK,
      VIEWS.WORK_WEEK,
      VIEWS.TIMELINE_WORK_WEEK,
    ].includes(this.viewType);

    return isWeekLikeView
      ? 7 - this.skippedDays.length
      : 1;
  }

  protected usesMonthDayLayout(): boolean {
    return false;
  }

  public getVisibleDaysOfWeek(firstDayOfWeek: number): number[] {
    return getVisibleDaysOfWeek(firstDayOfWeek, this.skippedDays);
  }

  protected getSkippedDaysAnchorDay(
    firstDayOfWeekOption: number | undefined,
    startViewDate: Date, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): number {
    return this.getFirstDayOfWeek(firstDayOfWeekOption ?? 0);
  }

  private getVisibleDayOffset(
    rowIndex: number,
    columnIndex: number,
    anchorDay: number,
    cellCountInDay: number,
  ): number {
    const rotated = this.getVisibleDaysOfWeek(anchorDay);
    const visibleCount = rotated.length;
    if (visibleCount === 0) {
      return 0;
    }
    if (this.usesMonthDayLayout()) {
      const targetDayOfWeek = rotated[columnIndex];
      const naiveDayOffset = rowIndex * visibleCount + columnIndex;
      const actualDayOffset = rowIndex * 7
        + ((targetDayOfWeek - anchorDay + 7) % 7);
      return actualDayOffset - naiveDayOffset;
    }
    const dayIndex = isHorizontalView(this.viewType)
      ? Math.floor(columnIndex / cellCountInDay)
      : columnIndex;
    const week = Math.floor(dayIndex / visibleCount);
    const idxInWeek = dayIndex % visibleCount;
    const targetDayOfWeek = rotated[idxInWeek];
    const naiveDayOffset = dayIndex;
    const actualDayOffset = week * 7 + ((targetDayOfWeek - anchorDay + 7) % 7);
    return actualDayOffset - naiveDayOffset;
  }

  public isDateSkipped(date: Date): boolean {
    return isDateSkipped(date, this.skippedDays);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected calculateStartViewDate(options: ViewDataProviderOptions): Date {
    return new Date();
  }

  public getStartViewDate(options: ViewDataProviderOptions): Date {
    return this.calculateStartViewDate(options);
  }

  // entry point
  public getCompleteViewDataMap(
    options: ViewDataProviderExtendedOptions,
  ): ViewCellGeneratedData[][] {
    const {
      getResourceManager,
      isGroupedByDate,
      isHorizontalGrouping,
      isVerticalGrouping,
      intervalCount,
      currentDate,
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval,
    } = options;

    this.skippedDays = options.skippedDays ?? this.skippedDays;
    this.setVisibilityDates(options);
    this.setHiddenInterval(startDayHour, endDayHour, hoursInterval);
    this.refreshDaylightPlan(options);

    const groupsList = getAllGroupValues(getResourceManager().groupsLeafs);
    const cellCountInGroupRow = this.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval,
    });
    const rowCountInGroup = this.getRowCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
    });

    let viewDataMap: (ViewCellDataSimple & ViewCellIndex)[][] = [];
    const allDayPanelData = this.generateAllDayPanelData(
      options,
      rowCountInGroup,
      cellCountInGroupRow,
    );
    const viewCellsData = this.generateViewCellsData(
      options,
      rowCountInGroup,
      cellCountInGroupRow,
    );

    if (allDayPanelData) {
      viewDataMap.push(allDayPanelData);
    }

    viewDataMap.push(...viewCellsData);

    if (isHorizontalGrouping && !isGroupedByDate) {
      viewDataMap = this.transformViewDataMapForHorizontalGrouping(viewDataMap, groupsList);
    }

    if (isVerticalGrouping) {
      viewDataMap = this.transformViewDataMapForVerticalGrouping(viewDataMap, groupsList);
    }

    if (isGroupedByDate) {
      viewDataMap = this.transformViewDataMapForGroupingByDate(viewDataMap, groupsList);
    }

    return this.addKeysToCells(viewDataMap);
  }

  protected transformViewDataMapForHorizontalGrouping(
    viewDataMap: (ViewCellDataSimple & ViewCellIndex)[][],
    groupsList: GroupLeaf['grouped'][],
  ): (ViewCellDataSimple & ViewCellIndex)[][] {
    const result = viewDataMap.map((row) => row.slice());

    groupsList.slice(1).forEach((groups, index) => {
      const groupIndex = index + 1;

      viewDataMap.forEach((row, rowIndex) => {
        const nextGroupRow = row.map((cellData) => ({
          ...cellData,
          groups,
          groupIndex,
        }));

        result[rowIndex].push(...nextGroupRow);
      });
    });

    return result;
  }

  protected transformViewDataMapForVerticalGrouping(
    viewDataMap: (ViewCellDataSimple & ViewCellIndex)[][],
    groupsList: GroupLeaf['grouped'][],
  ): (ViewCellDataSimple & ViewCellIndex)[][] {
    const result = viewDataMap.map((row) => row.slice());

    groupsList.slice(1).forEach((groups, index) => {
      const groupIndex = index + 1;

      const nextGroupMap = viewDataMap.map((cellsRow) => {
        const nextRow = cellsRow.map((cellData) => ({
          ...cellData,
          groupIndex,
          groups,
        }));

        return nextRow;
      });

      result.push(...nextGroupMap);
    });

    return result;
  }

  protected transformViewDataMapForGroupingByDate(
    viewDataMap: (ViewCellDataSimple & ViewCellIndex)[][],
    groupsList: GroupLeaf['grouped'][],
  ): (ViewCellDataSimple & ViewCellIndex)[][] {
    const correctedGroupList = groupsList.slice(1);
    const correctedGroupCount = correctedGroupList.length;

    const result = viewDataMap.map((cellsRow) => {
      const groupedByDateCellsRow = cellsRow.reduce<(
        ViewCellDataSimple & ViewCellIndex
      )[]>((currentRow, cell) => {
        const rowWithCurrentCell = [
          ...currentRow,
          {
            ...cell,
            isFirstGroupCell: true,
            isLastGroupCell: correctedGroupCount === 0,
          },
          ...correctedGroupList.map((groups, index) => ({
            ...cell,
            groups,
            groupIndex: index + 1,
            isFirstGroupCell: false,
            isLastGroupCell: index === correctedGroupCount - 1,
          })),
        ];

        return rowWithCurrentCell;
      }, []);

      return groupedByDateCellsRow;
    });

    return result;
  }

  protected addKeysToCells(
    viewDataMap: (ViewCellDataSimple & ViewCellIndex)[][],
  ): ViewCellGeneratedData[][] {
    const totalColumnCount = viewDataMap[0].length;
    const {
      currentViewDataMap: result,
    } = viewDataMap.reduce<{
      allDayPanelsCount: number;
      currentViewDataMap: ViewCellGeneratedData[][];
    }>(({ allDayPanelsCount, currentViewDataMap }, row, rowIndex) => {
      const isAllDay = row[0].allDay;

      const keyBase = (rowIndex - allDayPanelsCount) * totalColumnCount;

      const currentAllDayPanelsCount = isAllDay
        ? allDayPanelsCount + 1
        : allDayPanelsCount;

      currentViewDataMap.push(
        row.map<ViewCellGeneratedData>((cell, columnIndex) => ({
          ...cell,
          key: keyBase + columnIndex,
        })),
      );

      return { allDayPanelsCount: currentAllDayPanelsCount, currentViewDataMap };
    }, {
      allDayPanelsCount: 0,
      currentViewDataMap: [],
    });

    return result;
  }

  // entry point
  public generateViewDataMap(
    completeViewDataMap: ViewCellGeneratedData[][],
    options: ViewDataMapOptions,
  ): ViewDataMap {
    const {
      rowCount,
      startCellIndex,
      startRowIndex,
      cellCount,
      isVerticalGrouping,
      isAllDayPanelVisible,
    } = options;

    const sliceCells = (
      row: ViewCellGeneratedData[],
      rowIndex: number,
      startIndex: number,
      count: number | undefined,
    ): CellInfo[] => {
      const sliceToIndex = count !== undefined
        ? startIndex + count
        : undefined;

      return row
        .slice(startIndex, sliceToIndex)
        .map((cellData, columnIndex) => ({
          cellData,
          position: {
            rowIndex,
            columnIndex,
          },
        }));
    };

    let correctedStartRowIndex = startRowIndex;
    let allDayPanelMap: CellInfo[] = [];
    if (this.isStandaloneAllDayPanel(isVerticalGrouping, isAllDayPanelVisible)) {
      correctedStartRowIndex += 1;
      allDayPanelMap = sliceCells(completeViewDataMap[0], 0, startCellIndex, cellCount);
    }

    const displayedRowCount = getDisplayedRowCount(rowCount, completeViewDataMap);

    const dateTableMap = completeViewDataMap
      .slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount)
      .map((row, rowIndex) => sliceCells(row, rowIndex, startCellIndex, cellCount));

    return {
      allDayPanelMap,
      dateTableMap,
    };
  }

  protected isStandaloneAllDayPanel(
    isVerticalGrouping: boolean,
    isAllDayPanelVisible: boolean,
  ): boolean {
    return !isVerticalGrouping && isAllDayPanelVisible;
  }

  public getViewDataFromMap(
    completeViewDataMap: ViewCellGeneratedData[][],
    viewDataMap: ViewDataMap,
    options: ViewDataMapOptions,
  ): GroupedViewData & { isGroupedAllDayPanel: boolean } {
    const {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      leftVirtualCellWidth,
      rightVirtualCellWidth,
      cellCount,
      rowCount,
      startRowIndex,
      startCellIndex,
      isProvideVirtualCellsWidth,
      isGroupedAllDayPanel,
      isVerticalGrouping,
      isAllDayPanelVisible,
    } = options;
    const {
      allDayPanelMap,
      dateTableMap,
    } = viewDataMap;

    const {
      groupedData,
    } = dateTableMap.reduce<{
      previousGroupIndex: number | undefined;
      groupedData: GroupedViewData['groupedData'];
    }>(({ previousGroupIndex, groupedData: currentGroupedData }, cellsRow) => {
      const cellDataRow = cellsRow.map(({ cellData }) => cellData);

      const firstCell = cellDataRow[0];
      const isAllDayRow = firstCell.allDay;
      const currentGroupIndex = firstCell.groupIndex;

      if (currentGroupIndex !== previousGroupIndex) {
        currentGroupedData.push({
          dateTable: [],
          isGroupedAllDayPanel: getIsGroupedAllDayPanel(Boolean(isAllDayRow), isVerticalGrouping),
          groupIndex: currentGroupIndex,
          key: getKeyByGroup(currentGroupIndex, isVerticalGrouping),
        });
      }

      if (isAllDayRow) {
        currentGroupedData[currentGroupedData.length - 1].allDayPanel = cellDataRow;
      } else {
        currentGroupedData[currentGroupedData.length - 1].dateTable.push({
          cells: cellDataRow,
          key: (cellDataRow[0].key ?? 0) - startCellIndex,
        });
      }

      return {
        groupedData: currentGroupedData,
        previousGroupIndex: currentGroupIndex,
      };
    }, { previousGroupIndex: -1, groupedData: [] });

    if (this.isStandaloneAllDayPanel(isVerticalGrouping, isAllDayPanelVisible)) {
      groupedData[0].allDayPanel = allDayPanelMap.map(({ cellData }) => cellData);
    }

    const totalCellCount = getTotalCellCountByCompleteData(completeViewDataMap);
    const totalRowCount = getTotalRowCountByCompleteData(completeViewDataMap);
    const displayedCellCount = getDisplayedCellCount(cellCount, completeViewDataMap);
    const displayedRowCount = getDisplayedRowCount(rowCount, completeViewDataMap);

    return {
      groupedData,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? leftVirtualCellWidth : undefined,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? rightVirtualCellWidth : undefined,
      isGroupedAllDayPanel,
      leftVirtualCellCount: startCellIndex,
      rightVirtualCellCount: cellCount === undefined
        ? 0 : totalCellCount - startCellIndex - displayedCellCount,
      topVirtualRowCount: startRowIndex,
      bottomVirtualRowCount: totalRowCount - startRowIndex - displayedRowCount,
    };
  }

  protected generateViewCellsData(
    options: ViewDataProviderExtendedOptions,
    rowCount: number,
    cellCountInGroupRow: number,
  ): (ViewCellDataSimple & ViewCellIndex)[][] {
    const viewCellsData: (ViewCellDataSimple & ViewCellIndex)[][] = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      viewCellsData.push(
        this.generateCellsRow(
          options,
          false,
          rowIndex,
          rowCount,
          cellCountInGroupRow,
        ),
      );
    }

    return viewCellsData;
  }

  protected generateAllDayPanelData(
    options: ViewDataProviderExtendedOptions,
    rowCount: number,
    columnCount: number,
  ): (ViewCellDataSimple & ViewCellIndex)[] | null {
    if (!options.isAllDayPanelVisible) {
      return null;
    }

    return this.generateCellsRow(options, true, 0, rowCount, columnCount);
  }

  protected generateCellsRow(
    options: ViewDataProviderExtendedOptions,
    allDay: boolean,
    rowIndex: number,
    rowCount: number,
    columnCount: number,
  ): (ViewCellDataSimple & ViewCellIndex)[] {
    const cellsRow: (ViewCellDataSimple & ViewCellIndex)[] = [];

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const cellDataValue: ViewCellDataSimple = this.getCellData(
        rowIndex,
        columnIndex,
        options,
        allDay,
      );

      const index = rowIndex * columnCount + columnIndex;
      const isFirstGroupCell = this.isFirstGroupCell(
        rowIndex,
        columnIndex,
        options,
        rowCount,
        columnCount,
      );
      const isLastGroupCell = this.isLastGroupCell(
        rowIndex,
        columnIndex,
        options,
        rowCount,
        columnCount,
      );

      cellsRow.push({
        ...cellDataValue,
        index,
        isFirstGroupCell,
        isLastGroupCell,
      });
    }

    return cellsRow;
  }

  public getCellData(
    rowIndex: number,
    columnIndex: number,
    options: ViewDataProviderExtendedOptions,
    allDay: boolean,
  ): ViewCellDataSimple {
    return allDay
      ? this.prepareAllDayCellData(options, rowIndex, columnIndex)
      : this.prepareCellData(options, rowIndex, columnIndex);
  }

  protected prepareCellData(
    options: ViewDataProviderExtendedOptions,
    rowIndex: number,
    columnIndex: number,
  ): ViewCellDataSimple {
    const { getResourceManager } = options;

    const groupsList = getAllGroupValues(getResourceManager().groupsLeafs);
    const verticalCell = this.verticalCell(rowIndex, columnIndex);

    if (verticalCell) {
      const data = verticalCell === 'hole'
        ? this.holeCell(rowIndex, columnIndex)
        : this.cellFromPlan(verticalCell, 0);

      if (groupsList.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        data.groups = groupsList[0];
      }

      return data;
    }

    const planCell = isHorizontalView(this.viewType) ? this.planCell(columnIndex) : undefined;

    if (planCell) {
      const data = this.cellFromPlan(planCell, options.viewOffset);

      if (groupsList.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        data.groups = groupsList[0];
      }

      return data;
    }

    const startDate = this.getDateByCellIndices(
      options,
      rowIndex,
      columnIndex,
    );
    const endDate = this.calculateEndDate(
      startDate,
      options.interval,
      options.endDayHour,
    );

    const data: ViewCellDataSimple = {
      startDate,
      endDate,
      allDay: this.tableAllDay,
      groupIndex: 0,
    };

    if (groupsList.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      data.groups = groupsList[0];
    }

    return data;
  }

  protected prepareAllDayCellData(
    options: ViewDataProviderExtendedOptions,
    rowIndex: number,
    columnIndex: number,
  ): ViewCellDataSimple {
    const data = this.prepareCellData({
      ...options,
      // NOTE: For all-day cells we should shift cell's dates
      // after trimming these dates time.
      viewOffset: 0,
    }, rowIndex, columnIndex);
    const { viewOffset } = options;
    const startDate = dateUtils.trimTime(data.startDate);
    const shiftedStartDate = dateUtilsTs.addOffsets(startDate, viewOffset);

    return {
      groupIndex: data.groupIndex,
      startDate: shiftedStartDate,
      endDate: shiftedStartDate,
      allDay: true,
      ...(data.groups !== undefined ? { groups: data.groups } : {}),
    };
  }

  public getDateByCellIndices(
    options: ViewDataProviderExtendedOptions,
    rowIndex: number,
    columnIndex: number,
  ): Date {
    const { startViewDate } = options;
    const {
      startDayHour,
      endDayHour,
      hoursInterval,
      interval,
      firstDayOfWeek,
      viewOffset,
    } = options;
    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    const columnCountBase = this.getCellCount(options);
    const rowCountBase = this.getRowCount(options);
    const cellIndex = this.calculateCellIndex(rowIndex, columnIndex, rowCountBase, columnCountBase);
    const millisecondsOffset = this.getMillisecondsOffset(cellIndex, interval, cellCountInDay);

    let offsetByCount = 0;
    if (this.skippedDays.length > 0) {
      offsetByCount = this.getVisibleDayOffset(
        rowIndex,
        columnIndex,
        this.getSkippedDaysAnchorDay(firstDayOfWeek, startViewDate),
        cellCountInDay,
      ) * toMs('day');
    }

    const isStartViewDateDuringDST = startViewDate.getHours() !== Math.floor(startDayHour);
    let startViewDateTime = startViewDate.getTime();
    let currentDate = new Date(
      startViewDateTime + millisecondsOffset + offsetByCount + viewOffset,
    );
    const isMidnightDSTViewStart = timezoneUtils.isLocalTimeMidnightDST(startViewDate);
    const isMidnightDST = timezoneUtils.isLocalTimeMidnightDST(currentDate);

    if (!isMidnightDSTViewStart && !isMidnightDST) {
      if (isStartViewDateDuringDST) {
        const dateWithCorrectHours = getStartViewDateWithoutDST(startViewDate, startDayHour);
        startViewDateTime = dateWithCorrectHours.getTime() - toMs('day');
        currentDate = new Date(
          startViewDateTime + millisecondsOffset + offsetByCount + viewOffset,
        );
      } else {
        const timeZoneDifference = dateUtils.getTimezonesDifference(startViewDate, currentDate);
        currentDate.setTime(currentDate.getTime() + timeZoneDifference);
      }
    } else {
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
      );
    }

    return currentDate;
  }

  getMillisecondsOffset(cellIndex: number, interval: number, cellCountInDay: number): number {
    const dayIndex = Math.floor(cellIndex / cellCountInDay);
    const realHiddenInterval = dayIndex * this.hiddenInterval;

    return interval * cellIndex + realHiddenInterval;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public calculateEndDate(startDate: Date, interval: number, endDayHour?: number): Date {
    return timezoneUtils.addOffsetsWithoutDST(startDate, Math.round(interval));
  }

  protected calculateCellIndex(
    rowIndex: number,
    columnIndex: number,
    rowCount: number,
    columnCountBase: number,
  ): number {
    return calculateCellIndex(rowIndex, columnIndex, rowCount, columnCountBase);
  }

  public generateGroupedDataMap(viewDataMap: ViewDataMap): GroupedDataMap {
    const {
      allDayPanelMap,
      dateTableMap,
    } = viewDataMap;

    const { previousGroupedDataMap: dateTableGroupedMap } = dateTableMap.reduce<{
      previousGroupedDataMap: CellInfo[][][];
      previousRowIndex: number;
      previousGroupIndex: number | undefined;
    }>((previousOptions, cellsRow) => {
      const {
        previousGroupedDataMap, previousRowIndex, previousGroupIndex,
      } = previousOptions;
      const { groupIndex: currentGroupIndex } = cellsRow[0].cellData;
      const currentRowIndex = currentGroupIndex === previousGroupIndex
        ? previousRowIndex + 1
        : 0;

      cellsRow.forEach((cell) => {
        const { groupIndex } = cell.cellData;

        if (groupIndex !== undefined) {
          if (!previousGroupedDataMap[groupIndex]) {
            previousGroupedDataMap[groupIndex] = [];
          }
          if (!previousGroupedDataMap[groupIndex][currentRowIndex]) {
            previousGroupedDataMap[groupIndex][currentRowIndex] = [];
          }

          previousGroupedDataMap[groupIndex][currentRowIndex].push(cell);
        }
      });

      return {
        previousGroupedDataMap,
        previousRowIndex: currentRowIndex,
        previousGroupIndex: currentGroupIndex,
      };
    }, {
      previousGroupedDataMap: [],
      previousRowIndex: -1,
      previousGroupIndex: -1,
    });

    const allDayPanelGroupedMap: CellInfo[][] = [];
    allDayPanelMap?.forEach((cell) => {
      const { groupIndex } = cell.cellData;

      if (groupIndex !== undefined) {
        if (!allDayPanelGroupedMap[groupIndex]) {
          allDayPanelGroupedMap[groupIndex] = [];
        }

        allDayPanelGroupedMap[groupIndex].push(cell);
      }
    });

    return {
      allDayPanelGroupedMap,
      dateTableGroupedMap,
    };
  }

  protected isFirstGroupCell(
    rowIndex: number,
    columnIndex: number,
    options: ViewDataProviderExtendedOptions,
    rowCount: number,
    columnCount: number,
  ): boolean {
    const {
      groupOrientation,
      getResourceManager,
      isGroupedByDate,
    } = options;

    const groupCount = getResourceManager().groupCount();

    if (isGroupedByDate) {
      return columnIndex % groupCount === 0;
    }

    if (groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
      return columnIndex % columnCount === 0;
    }

    return rowIndex % rowCount === 0;
  }

  protected isLastGroupCell(
    rowIndex: number,
    columnIndex: number,
    options: ViewDataProviderExtendedOptions,
    rowCount: number,
    columnCount: number,
  ): boolean {
    const {
      groupOrientation,
      getResourceManager,
      isGroupedByDate,
    } = options;

    const groupCount = getResourceManager().groupCount();

    if (isGroupedByDate) {
      return (columnIndex + 1) % groupCount === 0;
    }

    if (groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
      return (columnIndex + 1) % columnCount === 0;
    }

    return (rowIndex + 1) % rowCount === 0;
  }

  public markSelectedAndFocusedCells(
    viewDataMap: ViewDataMap,
    renderOptions: ViewDataMapOptions,
  ): ViewDataMap {
    const {
      selectedCells,
      focusedCell,
    } = renderOptions;

    if (!selectedCells && !focusedCell) {
      return viewDataMap;
    }

    const {
      allDayPanelMap,
      dateTableMap,
    } = viewDataMap;

    const nextDateTableMap = dateTableMap.map(
      (row) => this.markSelectedAndFocusedCellsInRow(row, selectedCells, focusedCell),
    );
    const nextAllDayMap = this.markSelectedAndFocusedCellsInRow(
      allDayPanelMap,
      selectedCells,
      focusedCell,
    );

    return {
      allDayPanelMap: nextAllDayMap,
      dateTableMap: nextDateTableMap,
    };
  }

  protected markSelectedAndFocusedCellsInRow(
    dataRow: CellInfo[],
    selectedCells: ViewCellData[] | null | undefined,
    focusedCell: { cellData: ViewCellData } | null | undefined,
  ): CellInfo[] {
    return dataRow.map((cell) => {
      const {
        index,
        groupIndex,
        allDay,
        startDate,
      } = cell.cellData;

      const indexInSelectedCells = selectedCells?.findIndex(({
        index: selectedCellIndex,
        groupIndex: selectedCellGroupIndex,
        allDay: selectedCellAllDay,
        startDate: selectedCellStartDate,
      }) => {
        const groupIndexMatch = groupIndex === selectedCellGroupIndex;
        const cellIndexMatch = index === selectedCellIndex
          || (selectedCellIndex === undefined
            && startDate.getTime() === selectedCellStartDate.getTime());
        const allDayMatch = Boolean(allDay) === Boolean(selectedCellAllDay);

        return groupIndexMatch && cellIndexMatch && allDayMatch;
      }) ?? -1;

      const focusedCellData = focusedCell?.cellData;
      const isFocused = focusedCellData?.index === index
                && focusedCellData?.groupIndex === groupIndex
                && focusedCellData?.allDay === allDay;

      if (!isFocused && indexInSelectedCells === -1) {
        return cell;
      }

      return {
        ...cell,
        cellData: {
          ...cell.cellData,
          isSelected: indexInSelectedCells > -1,
          isFocused,
        },
      };
    });
  }

  public getInterval(hoursInterval: number): number {
    return hoursInterval * toMs('hour');
  }

  // TODO: used externally in view_data_provider.ts
  public _getIntervalDuration(intervalCount: number): number {
    return toMs('day') * intervalCount;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected setVisibilityDates(options: ViewDataProviderExtendedOptions): void {}

  public getCellCountInDay(
    startDayHour: number,
    endDayHour: number,
    hoursInterval: number,
  ): number {
    const result = calculateDayDuration(startDayHour, endDayHour) / hoursInterval;

    return Math.ceil(result);
  }

  public getDaylightPlan(): DaylightPlan | undefined {
    return this.daylightPlan;
  }

  public refreshDaylightPlan(options: ViewDataProviderExtendedOptions): void {
    this.extendedOptions = options;
    this.skippedDays = options.skippedDays ?? this.skippedDays;

    if (!this.usesDaylightPlan()) {
      this.daylightPlan = undefined;
      this.verticalSlots = undefined;
      return;
    }

    const dayCount = this.daysInInterval * options.intervalCount;
    const origins = visibleDayOrigins(
      options.startViewDate,
      dayCount,
      this.skippedDays,
      options.startDayHour,
    );

    this.daylightPlan = buildDaylightPlan(
      origins,
      options.startDayHour,
      options.endDayHour,
      options.interval,
      options.timeZoneCalculator,
    );
    this.verticalSlots = this.daylightPlan && !isHorizontalView(this.viewType)
      ? rotateSlots(unionVerticalSlots(this.daylightPlan), options.viewOffset)
      : undefined;
  }

  public getVerticalSlots(): VerticalSlot[] | undefined {
    return this.verticalSlots;
  }

  private usesDaylightPlan(): boolean {
    return this.viewType === VIEWS.TIMELINE_DAY
      || this.viewType === VIEWS.TIMELINE_WEEK
      || this.viewType === VIEWS.TIMELINE_WORK_WEEK
      || this.viewType === VIEWS.DAY
      || this.viewType === VIEWS.WEEK
      || this.viewType === VIEWS.WORK_WEEK;
  }

  private planCell(columnIndex: number): DaylightCell | undefined {
    return this.daylightPlan
      ? getPlanCell(this.daylightPlan, columnIndex)
      : undefined;
  }

  private verticalCell(rowIndex: number, columnIndex: number): DaylightCell | 'hole' | undefined {
    const slot = this.verticalSlots?.[rowIndex];
    const plan = this.daylightPlan;

    if (!slot || !plan) {
      return undefined;
    }

    const day = plan.days[sourceColumnDayIndex(
      columnIndex,
      slot.wallMinutes,
      this.extendedOptions?.viewOffset ?? 0,
      plan.days.length,
    )];

    if (!day) {
      return 'hole';
    }

    return cellForSlot(day.cells, slot) ?? 'hole';
  }

  private holeCell(rowIndex: number, columnIndex: number): ViewCellDataSimple {
    const slot = this.verticalSlots?.[rowIndex];
    const sample = this.daylightPlan?.days[columnIndex]?.cells[0]?.start ?? new Date();
    const startDate = new Date(
      sample.getFullYear(),
      sample.getMonth(),
      sample.getDate(),
      Math.floor((slot?.wallMinutes ?? 0) / 60),
      (slot?.wallMinutes ?? 0) % 60,
    );

    return {
      startDate,
      endDate: startDate,
      isDaylightHole: true,
      allDay: this.tableAllDay,
      groupIndex: 0,
    };
  }

  private cellFromPlan(cell: DaylightCell, viewOffset: number): ViewCellDataSimple {
    return {
      startDate: dateUtilsTs.addOffsets(cell.start, viewOffset),
      endDate: dateUtilsTs.addOffsets(cell.end, viewOffset),
      startDateUTC: new Date(cell.startUTC + viewOffset),
      endDateUTC: new Date(cell.endUTC + viewOffset),
      allDay: this.tableAllDay,
      groupIndex: 0,
    };
  }

  public getCellCount(options: CountGenerationConfig): number {
    if (!this.daylightPlan && this.extendedOptions && this.usesDaylightPlan()) {
      this.refreshDaylightPlan(this.extendedOptions);
    }

    if (this.daylightPlan && isHorizontalView(this.viewType)) {
      return this.daylightPlan.cellCount;
    }

    const {
      intervalCount,
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval,
    } = options;

    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const columnCountInDay = isHorizontalView(viewType)
      ? cellCountInDay
      : 1;

    return this.daysInInterval * intervalCount * columnCountInDay;
  }

  public getRowCount(options: CountGenerationConfig): number {
    const {
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval,
    } = options;

    if (this.verticalSlots) {
      return this.verticalSlots.length;
    }

    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const rowCountInDay = !isHorizontalView(viewType)
      ? cellCountInDay
      : 1;

    return rowCountInDay;
  }

  protected setHiddenInterval(
    startDayHour: number,
    endDayHour: number,
    hoursInterval: number,
  ): void {
    this.hiddenInterval = toMs('day') - this.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  }

  public getVisibleDayDuration(
    startDayHour: number,
    endDayHour: number,
    hoursInterval: number,
  ): number {
    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    return hoursInterval * cellCountInDay * toMs('hour');
  }

  public getFirstDayOfWeek(firstDayOfWeekOption: number): number {
    return firstDayOfWeekOption;
  }
}
