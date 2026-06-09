import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { GroupLeaf } from '@ts/scheduler/utils/resource_manager/types';

import type { GroupedViewData } from '../../r1/components/types';
import {
  calculateIsGroupedAllDayPanel,
  getGroupPanelData,
  isGroupingByDate,
  isHorizontalGroupingApplied,
  isHorizontalView,
  isVerticalGroupingApplied,
} from '../../r1/utils/index';
import type {
  CellInfo,
  CellPositionData,
  CountGenerationConfig,
  DateHeaderCellData,
  DateHeaderData,
  GroupedDataMap,
  GroupInfo,
  GroupPanelData,
  TimePanelData,
  ViewCellData,
  ViewDataMap,
  ViewOptions,
  ViewType,
} from '../../types';
import timeZoneUtils from '../../utils_time_zone';
import type { EdgeIndices } from '../cells_selection_controller';
import { GroupedDataMapProvider } from './grouped_data_map_provider';
import { DateHeaderDataGenerator } from './m_date_header_data_generator';
import type { ViewDataGenerator } from './m_view_data_generator';
import { TimePanelDataGenerator } from './time_panel_data_generator';
import type { ViewDataProviderExtendedOptions, ViewDataProviderOptions } from './types';
import { getViewDataGeneratorByViewType } from './utils/view_provider_utils';

// TODO: Vinogradov types refactoring.
export default class ViewDataProvider {
  viewDataGenerator: ViewDataGenerator;

  viewData: GroupedViewData;

  completeViewDataMap: ViewCellData[][];

  completeDateHeaderMap: DateHeaderCellData[][];

  viewDataMap!: ViewDataMap;

  private groupedDataMapProvider!: GroupedDataMapProvider;

  private options!: ViewDataProviderExtendedOptions;

  completeTimePanelMap!: ViewCellData[];

  dateHeaderData!: DateHeaderData;

  timePanelData!: TimePanelData;

  viewDataMapWithSelection!: ViewDataMap;

  constructor(public readonly viewType: ViewType) {
    this.viewDataGenerator = getViewDataGeneratorByViewType(viewType);
    this.viewData = {
      groupedData: [],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      topVirtualRowCount: 0,
      bottomVirtualRowCount: 0,
    };
    this.completeViewDataMap = [];
    this.completeDateHeaderMap = [];
    this.viewDataMap = {
      dateTableMap: [],
      allDayPanelMap: [],
    };
    this.groupedDataMapProvider = null as unknown as GroupedDataMapProvider;
  }

  get groupedDataMap(): GroupedDataMap {
    return this.groupedDataMapProvider.groupedDataMap;
  }

  get hiddenInterval(): number { return this.viewDataGenerator.hiddenInterval; }

  isDateSkipped(date: Date): boolean { return this.viewDataGenerator.isDateSkipped(date); }

  update(options: ViewDataProviderOptions, isGenerateNewViewData: boolean): void {
    this.viewDataGenerator = getViewDataGeneratorByViewType(options.viewType);

    const { viewDataGenerator } = this;
    const dateHeaderDataGenerator = new DateHeaderDataGenerator(viewDataGenerator);
    const timePanelDataGenerator = new TimePanelDataGenerator(viewDataGenerator);

    const renderOptions = this.transformRenderOptions(options);

    this.options = renderOptions;

    if (isGenerateNewViewData) {
      this.completeViewDataMap = viewDataGenerator.getCompleteViewDataMap(renderOptions);
      this.completeDateHeaderMap = dateHeaderDataGenerator
        .getCompleteDateHeaderMap(renderOptions, this.completeViewDataMap);
      if (renderOptions.isGenerateTimePanelData) {
        this.completeTimePanelMap = timePanelDataGenerator
          .getCompleteTimePanelMap(renderOptions, this.completeViewDataMap);
      }
    }

    this.viewDataMap = viewDataGenerator.generateViewDataMap(
      this.completeViewDataMap,
      renderOptions,
    );
    this.updateViewData(options);

    this.groupedDataMapProvider = new GroupedDataMapProvider(
      this.viewDataGenerator,
      this.viewDataMap,
      this.completeViewDataMap,
      {
        isVerticalGrouping: renderOptions.isVerticalGrouping,
        viewType: renderOptions.viewType,
        viewOffset: options.viewOffset,
      },
    );

    this.dateHeaderData = dateHeaderDataGenerator
      .generateDateHeaderData(this.completeDateHeaderMap, this.completeViewDataMap, renderOptions);

    if (renderOptions.isGenerateTimePanelData) {
      this.timePanelData = timePanelDataGenerator.generateTimePanelData(
        this.completeTimePanelMap,
        renderOptions,
      );
    }
  }

  createGroupedDataMapProvider(): void {
    this.groupedDataMapProvider = new GroupedDataMapProvider(
      this.viewDataGenerator,
      this.viewDataMap,
      this.completeViewDataMap,
      {
        isVerticalGrouping: this.options.isVerticalGrouping,
        viewType: this.options.viewType,
        viewOffset: this.options.viewOffset,
      },
    );
  }

  updateViewData(options: ViewDataProviderOptions): void {
    const renderOptions = this.transformRenderOptions(options);
    this.viewDataMapWithSelection = this.viewDataGenerator
      .markSelectedAndFocusedCells(this.viewDataMap, renderOptions);
    this.viewData = this.viewDataGenerator
      .getViewDataFromMap(
        this.completeViewDataMap,
        this.viewDataMapWithSelection,
        renderOptions,
      );
  }

  private transformRenderOptions(
    renderOptions: ViewDataProviderOptions,
  ): ViewDataProviderExtendedOptions {
    const {
      getResourceManager,
      groupOrientation,
      groupByDate,
      isAllDayPanelVisible,
      viewOffset,
      ...restOptions
    } = renderOptions;
    const resourceManager = getResourceManager();
    const groupCount = resourceManager.groupCount();
    const interval = this.viewDataGenerator.getInterval(renderOptions.hoursInterval);

    return {
      ...restOptions,
      startViewDate: this.viewDataGenerator.getStartViewDate(renderOptions),
      isVerticalGrouping: isVerticalGroupingApplied(groupCount, groupOrientation),
      isHorizontalGrouping: isHorizontalGroupingApplied(groupCount, groupOrientation),
      isGroupedByDate: isGroupingByDate(groupCount, groupOrientation, groupByDate),
      isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(
        groupCount,
        groupOrientation,
        isAllDayPanelVisible,
      ),
      getResourceManager,
      groupOrientation,
      isAllDayPanelVisible,
      viewOffset,
      interval,
    };
  }

  getGroupPanelData(options: ViewDataProviderOptions): GroupPanelData | undefined {
    const renderOptions = this.transformRenderOptions(options);
    const groupResources = renderOptions.getResourceManager().groupResources();

    if (groupResources.length > 0) {
      const cellCount = this.getCellCount(renderOptions);
      return getGroupPanelData(
        groupResources,
        cellCount,
        renderOptions.isGroupedByDate,
        renderOptions.isGroupedByDate ? 1 : cellCount,
      );
    }

    return undefined;
  }

  getGroupStartDate(groupIndex: number): Date | null {
    return this.groupedDataMapProvider.getGroupStartDate(groupIndex);
  }

  getGroupEndDate(groupIndex: number): Date | undefined {
    return this.groupedDataMapProvider.getGroupEndDate(groupIndex);
  }

  findGroupCellStartDate(
    groupIndex: number,
    startDate: Date,
    endDate: Date,
    isFindByDate = false,
  ): Date | undefined {
    return this.groupedDataMapProvider
      .findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate);
  }

  findAllDayGroupCellStartDate(groupIndex: number): Date | null {
    return this.groupedDataMapProvider.findAllDayGroupCellStartDate(groupIndex);
  }

  findCellPositionInMap(
    cellInfo: Pick<ViewCellData, 'startDate' | 'groupIndex' | 'index' | 'allDay'>,
    isAppointmentRender = false,
  ): CellPositionData | undefined {
    return this.groupedDataMapProvider.findCellPositionInMap(cellInfo, isAppointmentRender);
  }

  getCellsGroup(groupIndex: number): GroupLeaf['grouped'] | undefined {
    return this.groupedDataMapProvider.getCellsGroup(groupIndex);
  }

  getCompletedGroupsInfo(): GroupInfo[] {
    return this.groupedDataMapProvider.getCompletedGroupsInfo();
  }

  getGroupIndices(): number[] {
    return this.groupedDataMapProvider.getGroupIndices();
  }

  getLastGroupCellPosition(groupIndex: number): CellPositionData | undefined {
    return this.groupedDataMapProvider.getLastGroupCellPosition(groupIndex);
  }

  getRowCountInGroup(groupIndex: number): number {
    return this.groupedDataMapProvider.getRowCountInGroup(groupIndex);
  }

  getCellData(
    rowIndex: number,
    columnIndex: number,
    isAllDay = false,
    rtlEnabled = false,
  ): ViewCellData {
    const row = isAllDay && !this.options.isVerticalGrouping
      ? this.viewDataMap.allDayPanelMap
      : this.viewDataMap.dateTableMap[rowIndex];

    const actualColumnIndex = !rtlEnabled
      ? columnIndex
      : row.length - 1 - columnIndex;

    const { cellData } = row[actualColumnIndex];

    return cellData;
  }

  getCellsByGroupIndexAndAllDay(groupIndex: number, isAllDay: boolean): ViewCellData[][] {
    const rowsPerGroup = this.getRowCountWithAllDayRows();
    const isShowAllDayPanel = this.options.isAllDayPanelVisible;

    const firstRowInGroup = this.options.isVerticalGrouping
      ? groupIndex * rowsPerGroup
      : 0;
    const lastRowInGroup = this.options.isVerticalGrouping
      ? (groupIndex + 1) * rowsPerGroup - 1
      : rowsPerGroup;
    const correctedFirstRow = isShowAllDayPanel && !isAllDay
      ? firstRowInGroup + 1
      : firstRowInGroup;
    const correctedLastRow = isAllDay ? correctedFirstRow : lastRowInGroup;

    return this.completeViewDataMap
      .slice(correctedFirstRow, correctedLastRow + 1)
      .map((row) => row.filter((
        { groupIndex: currentGroupIndex },
      ) => groupIndex === currentGroupIndex));
  }

  getCellCountWithGroup(groupIndex: number, rowIndex = 0): number {
    const { dateTableGroupedMap } = this.groupedDataMap;

    return dateTableGroupedMap
      .filter((_, index) => index <= groupIndex)
      .reduce(
        (previous, row) => previous + row[rowIndex].length,
        0,
      );
  }

  hasGroupAllDayPanel(groupIndex: number): boolean {
    if (this.options.isVerticalGrouping) {
      return Boolean(this.groupedDataMap.dateTableGroupedMap[groupIndex]?.[0][0].cellData.allDay);
    }

    return this.groupedDataMap.allDayPanelGroupedMap[groupIndex]?.length > 0;
  }

  isGroupIntersectDateInterval(groupIndex: number, startDate: Date, endDate: Date): boolean {
    const groupStartDate = this.getGroupStartDate(groupIndex);
    const groupEndDate = this.getGroupEndDate(groupIndex);

    if (!groupStartDate || !groupEndDate) {
      return false;
    }

    return startDate < groupEndDate && endDate > groupStartDate;
  }

  findGlobalCellPosition(
    date: Date,
    groupIndex = 0,
    allDay = false,
    findClosest = false,
  ): CellInfo | undefined {
    const { completeViewDataMap } = this;

    const showAllDayPanel = this.options.isAllDayPanelVisible;

    let resultDiff = Number.MAX_VALUE;
    // eslint-disable-next-line no-undef-init
    let resultCellData: ViewCellData | undefined = undefined;
    let resultCellColumnIndex = -1;
    let resultCellRowIndex = -1;

    const getCellPosition = (columnIndex: number, rowIndex: number): CellPositionData => ({
      columnIndex,
      rowIndex: showAllDayPanel && !this.options.isVerticalGrouping
        ? rowIndex - 1
        : rowIndex,
    });

    for (let rowIndex = 0; rowIndex < completeViewDataMap.length; rowIndex += 1) {
      const currentRow = completeViewDataMap[rowIndex];

      for (let columnIndex = 0; columnIndex < currentRow.length; columnIndex += 1) {
        const cellData = currentRow[columnIndex];
        const {
          startDate: cellStartDate,
          endDate: cellEndDate,
          groupIndex: cellGroupIndex,
          allDay: cellAllDay,
        } = cellData;

        if (groupIndex !== cellGroupIndex || allDay !== Boolean(cellAllDay)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const isDateInCell = allDay
          ? dateUtils.sameDate(date, cellStartDate)
          : date >= cellStartDate && date < cellEndDate;

        if (isDateInCell) {
          return {
            position: getCellPosition(columnIndex, rowIndex),
            cellData,
          };
        }

        const diff = Math.abs(date.getTime() - cellStartDate.getTime());

        if (findClosest && diff < resultDiff) {
          resultDiff = diff;
          resultCellData = cellData;
          resultCellColumnIndex = columnIndex;
          resultCellRowIndex = rowIndex;
        }
      }
    }

    return resultCellData
      ? {
        position: getCellPosition(resultCellColumnIndex, resultCellRowIndex),
        cellData: resultCellData,
      }
      : undefined;
  }

  getSkippedDaysCount(
    groupIndex: number,
    startDate: Date,
    endDate: Date,
    daysCount: number,
  ): number {
    const { dateTableGroupedMap } = this.groupedDataMap;
    const groupedData = dateTableGroupedMap[groupIndex];
    const includedDays = groupedData.reduce(
      (rowCount, row) => rowCount + row.filter(
        ({ cellData }) => startDate.getTime() < cellData.endDate.getTime()
          && endDate.getTime() > cellData.startDate.getTime(),
      ).length,
      0,
    );

    const lastCell = groupedData[groupedData.length - 1][groupedData[0].length - 1].cellData;
    const lastCellStart = dateUtils.trimTime(lastCell.startDate);
    const daysAfterView = Math.floor((endDate.getTime() - lastCellStart.getTime()) / dateUtils.dateToMilliseconds('day'));

    const deltaDays = daysAfterView > 0 ? daysAfterView : 0;

    return daysCount - includedDays - deltaDays;
  }

  getColumnsCount(): number {
    const { dateTableMap } = this.viewDataMap;
    return dateTableMap
      ? dateTableMap[0].length
      : 0;
  }

  getViewEdgeIndices(isAllDayPanel: boolean): EdgeIndices {
    if (isAllDayPanel) {
      return {
        firstColumnIndex: 0,
        lastColumnIndex: this.viewDataMap.allDayPanelMap.length - 1,
        firstRowIndex: 0,
        lastRowIndex: 0,
      };
    }

    return {
      firstColumnIndex: 0,
      lastColumnIndex: this.viewDataMap.dateTableMap[0].length - 1,
      firstRowIndex: 0,
      lastRowIndex: this.viewDataMap.dateTableMap.length - 1,
    };
  }

  getGroupEdgeIndices(groupIndex: number, isAllDay: boolean): EdgeIndices {
    const groupedDataMap = this.groupedDataMap.dateTableGroupedMap[groupIndex];
    const cellsCount = groupedDataMap[0].length;
    const rowsCount = groupedDataMap.length;

    const firstColumnIndex = groupedDataMap[0][0].position.columnIndex;
    const lastColumnIndex = groupedDataMap[0][cellsCount - 1].position.columnIndex;

    if (isAllDay) {
      return {
        firstColumnIndex,
        lastColumnIndex,
        firstRowIndex: 0,
        lastRowIndex: 0,
      };
    }

    return {
      firstColumnIndex,
      lastColumnIndex,
      firstRowIndex: groupedDataMap[0][0].position.rowIndex,
      lastRowIndex: groupedDataMap[rowsCount - 1][0].position.rowIndex,
    };
  }

  isSameCell(firstCellData: ViewCellData, secondCellData: ViewCellData): boolean {
    const {
      startDate: firstStartDate,
      groupIndex: firstGroupIndex,
      allDay: firstAllDay,
      index: firstIndex,
    } = firstCellData;
    const {
      startDate: secondStartDate,
      groupIndex: secondGroupIndex,
      allDay: secondAllDay,
      index: secondIndex,
    } = secondCellData;

    return (
      firstStartDate.getTime() === secondStartDate.getTime()
            && firstGroupIndex === secondGroupIndex
            && firstAllDay === secondAllDay
            && firstIndex === secondIndex
    );
  }

  getLastViewDate(): Date {
    const { completeViewDataMap } = this;
    const rowsCount = completeViewDataMap.length - 1;

    return completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate;
  }

  getStartViewDate(): Date {
    return this.options.startViewDate;
  }

  getIntervalDuration(intervalCount: number): number {
    return this.viewDataGenerator._getIntervalDuration(intervalCount);
  }

  getLastCellEndDate(): Date {
    const lastEndDate = new Date(
      this.getLastViewDate().getTime() - dateUtils.dateToMilliseconds('minute'),
    );
    return dateUtilsTs.addOffsets(lastEndDate, -this.options.viewOffset);
  }

  getLastViewDateByEndDayHour(endDayHour: number): Date {
    const lastCellEndDate = this.getLastCellEndDate();
    const endTime = dateUtils.dateTimeFromDecimal(endDayHour);

    const endDateOfLastViewCell = new Date(
      lastCellEndDate.setHours(
        endTime.hours,
        endTime.minutes,
      ),
    );

    return this.adjustEndDateByDaylightDiff(lastCellEndDate, endDateOfLastViewCell);
  }

  private adjustEndDateByDaylightDiff(startDate: Date, endDate: Date): Date {
    const daylightDiff = timeZoneUtils.getDaylightOffsetInMs(startDate, endDate);

    const endDateOfLastViewCell = new Date(endDate.getTime() - daylightDiff);

    return new Date(endDateOfLastViewCell.getTime() - dateUtils.dateToMilliseconds('minute'));
  }

  getCellCountInDay(startDayHour: number, endDayHour: number, hoursInterval: number): number {
    return this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
  }

  getCellCount(options: CountGenerationConfig): number {
    return this.viewDataGenerator.getCellCount(options);
  }

  getRowCount(options: CountGenerationConfig): number {
    return this.viewDataGenerator.getRowCount(options);
  }

  getVisibleDayDuration(
    startDayHour: number,
    endDayHour: number,
    hoursInterval: number,
  ): number {
    return this.viewDataGenerator.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  }

  private getRowCountWithAllDayRows(): number {
    const allDayRowCount = this.options.isAllDayPanelVisible ? 1 : 0;

    return this.getRowCount(this.options) + allDayRowCount;
  }

  getFirstDayOfWeek(firstDayOfWeekOption: number): number {
    return this.viewDataGenerator.getFirstDayOfWeek(firstDayOfWeekOption);
  }

  setViewOptions(options: ViewDataProviderOptions): void {
    this.options = this.transformRenderOptions(options);
  }

  getViewOptions(): ViewOptions {
    return this.options;
  }

  getViewPortGroupCount(): number {
    const { dateTableGroupedMap } = this.groupedDataMap;
    return dateTableGroupedMap?.length || 0;
  }

  getCellsBetween(
    first: ViewCellData,
    last: ViewCellData,
  ): ViewCellData[] {
    const [firstCell, lastCell] = this.normalizeCellsOrder(first, last);
    const { index: firstIdx } = firstCell;
    const { index: lastIdx } = lastCell;

    const cellMatrix = this.getCellsByGroupIndexAndAllDay(
      firstCell.groupIndex ?? 0,
      lastCell.allDay ?? false,
    );

    return isHorizontalView(this.viewType)
      ? this.getCellsBetweenHorizontalView(cellMatrix, firstIdx, lastIdx)
      : this.getCellsBetweenVerticalView(cellMatrix, firstIdx, lastIdx);
  }

  private getCellsBetweenHorizontalView(
    cellMatrix: ViewCellData[][],
    firstIdx: number,
    lastIdx: number,
  ): ViewCellData[] {
    return cellMatrix.reduce(
      (result, row) => result.concat(
        row.filter(({ index }) => firstIdx <= index && index <= lastIdx),
      ),
      [],
    );
  }

  private getCellsBetweenVerticalView(
    cellMatrix: ViewCellData[][],
    firstIdx: number,
    lastIdx: number,
  ): ViewCellData[] {
    const result: ViewCellData[] = [];
    const matrixHeight = cellMatrix.length;
    const matrixWidth = cellMatrix[0]?.length ?? 0;
    let inSegment = false;

    for (let columnIdx = 0; columnIdx < matrixWidth; columnIdx += 1) {
      for (let rowIdx = 0; rowIdx < matrixHeight; rowIdx += 1) {
        const cell = cellMatrix[rowIdx][columnIdx];
        const { index: cellIdx } = cell;

        if (cellIdx === firstIdx) {
          inSegment = true;
        }

        if (inSegment) {
          result.push(cell);
        }

        if (cellIdx === lastIdx) {
          return result;
        }
      }
    }

    // NOTE: It's redundant return, but a function must always have a return statement.
    return result;
  }

  private normalizeCellsOrder(
    firstSelectedCell: ViewCellData,
    lastSelectedCell: ViewCellData,
  ): [first: ViewCellData, last: ViewCellData] {
    return firstSelectedCell.startDate > lastSelectedCell.startDate
      ? [lastSelectedCell, firstSelectedCell]
      : [firstSelectedCell, lastSelectedCell];
  }
}
