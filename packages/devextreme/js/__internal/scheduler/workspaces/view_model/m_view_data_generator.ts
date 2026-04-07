import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { GroupLeaf } from '@ts/scheduler/utils/resource_manager/types';

import { HORIZONTAL_GROUP_ORIENTATION } from '../../constants';
import timezoneUtils from '../../m_utils_time_zone';
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
import type { ViewDataMap, ViewType } from '../../types';
import { VIEWS } from '../../utils/options/constants_view';
import { getAllGroupValues } from '../../utils/resource_manager/group_utils';
import type {
  ViewCellDataSimple,
  ViewCellGeneratedData,
  ViewCellIndex,
  ViewDataProviderExtendedOptions,
} from './m_types';

const toMs = dateUtils.dateToMilliseconds;

export class ViewDataGenerator {
  protected baseDaysInInterval = 1;

  protected tableAllDay = false;

  public hiddenInterval = 0;

  public skippedDays: number[] = [];

  constructor(public readonly viewType: ViewType) {}

  get daysInInterval(): number {
    if (this.skippedDays.length === 0) {
      return this.baseDaysInInterval;
    }
    const visibleDayCount = 7 - this.skippedDays.length;
    if (this.baseDaysInInterval >= 7) {
      return visibleDayCount;
    }
    return this.baseDaysInInterval;
  }

  public isWorkWeekView(): boolean {
    return [
      VIEWS.WORK_WEEK,
      VIEWS.TIMELINE_WORK_WEEK,
    ].includes(this.viewType);
  }

  protected usesWeeklyDayLayout(): boolean {
    return this.baseDaysInInterval >= 7;
  }

  protected usesMonthDayLayout(): boolean {
    return false;
  }

  public getVisibleDaysOfWeek(firstDayOfWeek: number): number[] {
    const rotated: number[] = [];
    for (let count = 0; count < 7; count += 1) {
      const dayOfWeek = (firstDayOfWeek + count) % 7;
      if (!this.skippedDays.includes(dayOfWeek)) {
        rotated.push(dayOfWeek);
      }
    }
    return rotated;
  }

  protected getVisibleDayOffset(
    rowIndex: number,
    columnIndex: number,
    firstDayOfWeek: number,
  ): number {
    const rotated = this.getVisibleDaysOfWeek(firstDayOfWeek);
    const visibleCount = rotated.length;
    if (visibleCount === 0) {
      return 0;
    }
    if (this.usesMonthDayLayout()) {
      const targetDayOfWeek = rotated[columnIndex];
      const naiveDayOffset = rowIndex * visibleCount + columnIndex;
      const actualDayOffset = rowIndex * 7
        + ((targetDayOfWeek - firstDayOfWeek + 7) % 7);
      return actualDayOffset - naiveDayOffset;
    }
    const week = Math.floor(columnIndex / visibleCount);
    const idxInWeek = columnIndex % visibleCount;
    const targetDayOfWeek = rotated[idxInWeek];
    const naiveDayOffset = columnIndex;
    const actualDayOffset = week * 7 + ((targetDayOfWeek - firstDayOfWeek + 7) % 7);
    return actualDayOffset - naiveDayOffset;
  }

  public isSkippedDate(date: Date): boolean {
    return this.skippedDays.includes(date.getDay());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected calculateStartViewDate(options: any): Date {
    return new Date();
  }

  public getStartViewDate(options): Date {
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

    this.skippedDays = ((options as any)?.skippedDays as number[] | undefined) ?? [];
    this.setVisibilityDates(options);
    this.setHiddenInterval(startDayHour, endDayHour, hoursInterval);

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
      const groupedByDateCellsRow = cellsRow.reduce<(ViewCellDataSimple & ViewCellIndex)[]>((currentRow, cell) => {
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
  public generateViewDataMap(completeViewDataMap, options): ViewDataMap {
    const {
      rowCount,
      startCellIndex,
      startRowIndex,
      cellCount,
      isVerticalGrouping,
      isAllDayPanelVisible,
    } = options;

    const sliceCells = (row, rowIndex, startIndex, count) => {
      const sliceToIndex = count !== undefined
        ? startIndex + count
        : undefined;

      return row
        .slice(startIndex, sliceToIndex)
        .map((cellData, columnIndex) => (
          {
            cellData,
            position: {
              rowIndex,
              columnIndex,
            },
          }));
    };

    let correctedStartRowIndex = startRowIndex;
    let allDayPanelMap = [];
    if (this.isStandaloneAllDayPanel(isVerticalGrouping, isAllDayPanelVisible)) {
      correctedStartRowIndex++;
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

  protected isStandaloneAllDayPanel(isVerticalGrouping, isAllDayPanelVisible) {
    return !isVerticalGrouping && isAllDayPanelVisible;
  }

  public getViewDataFromMap(completeViewDataMap, viewDataMap, options) {
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
    } = dateTableMap.reduce(({ previousGroupIndex, groupedData }, cellsRow) => {
      const cellDataRow = cellsRow.map(({ cellData }) => cellData);

      const firstCell = cellDataRow[0];
      const isAllDayRow = firstCell.allDay;
      const currentGroupIndex = firstCell.groupIndex;

      if (currentGroupIndex !== previousGroupIndex) {
        groupedData.push({
          dateTable: [],
          isGroupedAllDayPanel: getIsGroupedAllDayPanel(Boolean(isAllDayRow), isVerticalGrouping),
          groupIndex: currentGroupIndex,
          key: getKeyByGroup(currentGroupIndex, isVerticalGrouping),
        });
      }

      if (isAllDayRow) {
        groupedData[groupedData.length - 1].allDayPanel = cellDataRow;
      } else {
        groupedData[groupedData.length - 1].dateTable.push({
          cells: cellDataRow,
          key: cellDataRow[0].key - startCellIndex,
        });
      }

      return {
        groupedData,
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
      rightVirtualCellCount: cellCount === undefined ? 0 : totalCellCount - startCellIndex - displayedCellCount,
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
      viewCellsData.push(this.generateCellsRow(options, false, rowIndex, rowCount, cellCountInGroupRow));
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

    for (let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
      const cellDataValue: ViewCellDataSimple = this.getCellData(rowIndex, columnIndex, options, allDay);

      const index = rowIndex * columnCount + columnIndex;
      const isFirstGroupCell = this.isFirstGroupCell(rowIndex, columnIndex, options, rowCount, columnCount);
      const isLastGroupCell = this.isLastGroupCell(rowIndex, columnIndex, options, rowCount, columnCount);

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

    const startDate = this.getDateByCellIndices(
      options,
      rowIndex,
      columnIndex,
    );
    const endDate = this.getCellEndDate(startDate, options);

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
      ...data,
      startDate: shiftedStartDate,
      endDate: shiftedStartDate,
      allDay: true,
    };
  }

  // TODO: make it protected with old render
  public getDateByCellIndices(
    options: any,
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
      intervalCount,
      viewOffset,
    } = options;
    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    const columnCountBase = this.getCellCount(options);
    const rowCountBase = this.getRowCount(options);
    const cellIndex = this.calculateCellIndex(rowIndex, columnIndex, rowCountBase, columnCountBase);
    const millisecondsOffset = this.getMillisecondsOffset(cellIndex, interval, cellCountInDay);

    let offsetByCount: number;
    if (this.isWorkWeekView()) {
      offsetByCount = this.getTimeOffsetByColumnIndex(
        columnIndex,
        this.getFirstDayOfWeek(firstDayOfWeek),
        columnCountBase,
        intervalCount,
      );
    } else if (
      this.skippedDays.length > 0
      && (this.usesWeeklyDayLayout() || this.usesMonthDayLayout())
    ) {
      offsetByCount = this.getVisibleDayOffset(
        rowIndex,
        columnIndex,
        this.getFirstDayOfWeek(firstDayOfWeek) ?? 0,
      ) * toMs('day');
    } else {
      offsetByCount = 0;
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

  getMillisecondsOffset(cellIndex, interval, cellCountInDay) {
    const dayIndex = Math.floor(cellIndex / cellCountInDay);
    const realHiddenInterval = dayIndex * this.hiddenInterval;

    return interval * cellIndex + realHiddenInterval;
  }

  getTimeOffsetByColumnIndex(columnIndex, firstDayOfWeek, columnCount, intervalCount) {
    const firstDayOfWeekDiff = Math.max(0, firstDayOfWeek - 1);
    const columnsInWeek = columnCount / intervalCount;
    const weekendCount = Math.floor((columnIndex + firstDayOfWeekDiff) / columnsInWeek);

    return weekendCount * 2 * toMs('day');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public calculateEndDate(startDate: Date, interval: number, endDayHour?: any): Date {
    return this.getCellEndDate(startDate, { interval });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected calculateCellIndex(rowIndex, columnIndex, rowCount, columnCountBase) {
    return (calculateCellIndex as any)(rowIndex, columnIndex, rowCount);
  }

  public generateGroupedDataMap(viewDataMap) {
    const {
      allDayPanelMap,
      dateTableMap,
    } = viewDataMap;

    const { previousGroupedDataMap: dateTableGroupedMap } = dateTableMap.reduce((previousOptions, cellsRow) => {
      const {
        previousGroupedDataMap, previousRowIndex, previousGroupIndex,
      } = previousOptions;
      const { groupIndex: currentGroupIndex } = cellsRow[0].cellData;
      const currentRowIndex = currentGroupIndex === previousGroupIndex
        ? previousRowIndex + 1
        : 0;

      cellsRow.forEach((cell) => {
        const { groupIndex } = cell.cellData;

        if (!previousGroupedDataMap[groupIndex]) {
          previousGroupedDataMap[groupIndex] = [];
        }
        if (!previousGroupedDataMap[groupIndex][currentRowIndex]) {
          previousGroupedDataMap[groupIndex][currentRowIndex] = [];
        }

        previousGroupedDataMap[groupIndex][currentRowIndex].push(cell);
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

    const allDayPanelGroupedMap: any = [];
    allDayPanelMap?.forEach((cell) => {
      const { groupIndex } = cell.cellData;

      if (!allDayPanelGroupedMap[groupIndex]) {
        allDayPanelGroupedMap[groupIndex] = [];
      }

      allDayPanelGroupedMap[groupIndex].push(cell);
    });

    return {
      allDayPanelGroupedMap,
      dateTableGroupedMap,
    };
  }

  protected isFirstGroupCell(rowIndex, columnIndex, options: ViewDataProviderExtendedOptions, rowCount, columnCount): boolean {
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

  protected isLastGroupCell(rowIndex, columnIndex, options: ViewDataProviderExtendedOptions, rowCount, columnCount): boolean {
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

  public markSelectedAndFocusedCells(viewDataMap, renderOptions) {
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

    const nextDateTableMap = dateTableMap.map((row) => this.markSelectedAndFocusedCellsInRow(row, selectedCells, focusedCell));
    const nextAllDayMap = this.markSelectedAndFocusedCellsInRow(allDayPanelMap, selectedCells, focusedCell);

    return {
      allDayPanelMap: nextAllDayMap,
      dateTableMap: nextDateTableMap,
    };
  }

  protected markSelectedAndFocusedCellsInRow(dataRow, selectedCells, focusedCell) {
    return dataRow.map((cell) => {
      const {
        index,
        groupIndex,
        allDay,
        startDate,
      } = cell.cellData;

      const indexInSelectedCells = selectedCells.findIndex(({
        index: selectedCellIndex,
        groupIndex: selectedCellGroupIndex,
        allDay: selectedCellAllDay,
        startDate: selectedCellStartDate,
      }) => groupIndex === selectedCellGroupIndex
                && (index === selectedCellIndex
                    || (selectedCellIndex === undefined
                        && startDate.getTime() === selectedCellStartDate.getTime()))
                && Boolean(allDay) === Boolean(selectedCellAllDay));

      const isFocused = Boolean(focusedCell)
                && index === focusedCell.cellData.index
                && groupIndex === focusedCell.cellData.groupIndex
                && allDay === focusedCell.cellData.allDay;

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

  public getInterval(hoursInterval) {
    return hoursInterval * toMs('hour');
  }

  // TODO: used externally in m_view_data_provider.ts
  public _getIntervalDuration(intervalCount) {
    return toMs('day') * intervalCount;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected setVisibilityDates(options: any) {}

  public getCellCountInDay(startDayHour, endDayHour, hoursInterval) {
    const result = calculateDayDuration(startDayHour, endDayHour) / hoursInterval;

    return Math.ceil(result);
  }

  public getCellCount(options): number {
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

  public getRowCount(options): number {
    const {
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval,
    } = options;

    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const rowCountInDay = !isHorizontalView(viewType)
      ? cellCountInDay
      : 1;

    return rowCountInDay;
  }

  protected setHiddenInterval(startDayHour, endDayHour, hoursInterval) {
    this.hiddenInterval = toMs('day') - this.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  }

  public getVisibleDayDuration(startDayHour, endDayHour, hoursInterval) {
    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    return hoursInterval * cellCountInDay * toMs('hour');
  }

  public getFirstDayOfWeek(firstDayOfWeekOption) {
    return firstDayOfWeekOption;
  }

  protected getCellEndDate(cellStartDate: Date, options: any): Date {
    const durationMs = Math.round(options.interval);
    return timezoneUtils.addOffsetsWithoutDST(cellStartDate, durationMs);
  }
}
