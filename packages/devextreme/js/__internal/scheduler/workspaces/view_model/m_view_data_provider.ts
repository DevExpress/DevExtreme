import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';

import timeZoneUtils from '../../m_utils_time_zone';
import {
  calculateIsGroupedAllDayPanel,
  getGroupPanelData,
  isGroupingByDate,
  isHorizontalGroupingApplied,
  isHorizontalView,
  isVerticalGroupingApplied,
} from '../../r1/utils/index';
import type {
  CountGenerationConfig,
  DateHeaderData,
  TimePanelData,
  ViewCellData,
  ViewDataMap, ViewOptions,
  ViewType,
} from '../../types';
import { DateHeaderDataGenerator } from './m_date_header_data_generator';
import { GroupedDataMapProvider } from './m_grouped_data_map_provider';
import { TimePanelDataGenerator } from './m_time_panel_data_generator';
import type { ViewDataProviderExtendedOptions, ViewDataProviderOptions } from './m_types';
import type { ViewDataGenerator } from './m_view_data_generator';
import { getViewDataGeneratorByViewType } from './utils/view_provider_utils';

// TODO: Vinogradov types refactoring.
export default class ViewDataProvider {
  viewDataGenerator: ViewDataGenerator;

  viewData: any;

  completeViewDataMap: ViewCellData[][];

  completeDateHeaderMap: any[];

  viewDataMap!: ViewDataMap;

  _groupedDataMapProvider!: GroupedDataMapProvider;

  _options!: ViewDataProviderExtendedOptions;

  completeTimePanelMap: any;

  dateHeaderData!: DateHeaderData;

  timePanelData!: TimePanelData;

  viewDataMapWithSelection: any;

  constructor(public readonly viewType: ViewType) {
    this.viewDataGenerator = getViewDataGeneratorByViewType(viewType);
    this.viewData = {};
    this.completeViewDataMap = [];
    this.completeDateHeaderMap = [];
    this.viewDataMap = {
      dateTableMap: [],
      allDayPanelMap: [],
    };
    this._groupedDataMapProvider = null as unknown as GroupedDataMapProvider;
  }

  get groupedDataMap() { return this._groupedDataMapProvider.groupedDataMap; }

  get hiddenInterval() { return this.viewDataGenerator.hiddenInterval; }

  isSkippedDate(date: Date): boolean { return this.viewDataGenerator.isSkippedDate(date); }

  update(options: ViewDataProviderOptions, isGenerateNewViewData: boolean): void {
    this.viewDataGenerator = getViewDataGeneratorByViewType(options.viewType);

    const { viewDataGenerator } = this;
    const dateHeaderDataGenerator = new DateHeaderDataGenerator(viewDataGenerator);
    const timePanelDataGenerator = new TimePanelDataGenerator(viewDataGenerator);

    const renderOptions = this._transformRenderOptions(options);

    this._options = renderOptions;

    if (isGenerateNewViewData) {
      this.completeViewDataMap = viewDataGenerator.getCompleteViewDataMap(renderOptions);
      this.completeDateHeaderMap = dateHeaderDataGenerator
        .getCompleteDateHeaderMap(renderOptions, this.completeViewDataMap);
      if (renderOptions.isGenerateTimePanelData) {
        this.completeTimePanelMap = timePanelDataGenerator
          .getCompleteTimePanelMap(renderOptions, this.completeViewDataMap);
      }
    }

    this.viewDataMap = viewDataGenerator.generateViewDataMap(this.completeViewDataMap, renderOptions);
    this.updateViewData(renderOptions);

    this._groupedDataMapProvider = new GroupedDataMapProvider(
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
    this._groupedDataMapProvider = new GroupedDataMapProvider(
      this.viewDataGenerator,
      this.viewDataMap,
      this.completeViewDataMap,
      {
        isVerticalGrouping: this._options.isVerticalGrouping,
        viewType: this._options.viewType,
      },
    );
  }

  updateViewData(options) {
    const renderOptions = this._transformRenderOptions(options);
    this.viewDataMapWithSelection = this.viewDataGenerator
      .markSelectedAndFocusedCells(this.viewDataMap, renderOptions);
    this.viewData = this.viewDataGenerator
      .getViewDataFromMap(
        this.completeViewDataMap,
        this.viewDataMapWithSelection,
        renderOptions,
      );
  }

  _transformRenderOptions(renderOptions: ViewDataProviderOptions): ViewDataProviderExtendedOptions {
    const {
      getResourceManager,
      groupOrientation,
      groupByDate,
      isAllDayPanelVisible,
      viewOffset,
      ...restOptions
    } = renderOptions;
    const resourceManager = getResourceManager();
    const interval = this.viewDataGenerator.getInterval(renderOptions.hoursInterval);

    return {
      ...restOptions,
      startViewDate: this.viewDataGenerator.getStartViewDate(renderOptions),
      isVerticalGrouping: isVerticalGroupingApplied(resourceManager.groups, groupOrientation),
      isHorizontalGrouping: isHorizontalGroupingApplied(resourceManager.groups, groupOrientation),
      isGroupedByDate: isGroupingByDate(resourceManager.groups, groupOrientation, groupByDate),
      isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(resourceManager.groups, groupOrientation, isAllDayPanelVisible),
      getResourceManager,
      groupOrientation,
      isAllDayPanelVisible,
      viewOffset,
      interval,
    };
  }

  getGroupPanelData(options) {
    const renderOptions = this._transformRenderOptions(options);
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

  getGroupStartDate(groupIndex) {
    return this._groupedDataMapProvider.getGroupStartDate(groupIndex);
  }

  getGroupEndDate(groupIndex) {
    return this._groupedDataMapProvider.getGroupEndDate(groupIndex);
  }

  findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate = false) {
    return this._groupedDataMapProvider.findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate);
  }

  findAllDayGroupCellStartDate(groupIndex: number): Date | null {
    return this._groupedDataMapProvider.findAllDayGroupCellStartDate(groupIndex);
  }

  findCellPositionInMap(cellInfo: any, isAppointmentRender = false): any {
    return this._groupedDataMapProvider.findCellPositionInMap(cellInfo, isAppointmentRender);
  }

  getCellsGroup(groupIndex) {
    return this._groupedDataMapProvider.getCellsGroup(groupIndex);
  }

  getCompletedGroupsInfo() {
    return this._groupedDataMapProvider.getCompletedGroupsInfo();
  }

  getGroupIndices() {
    return this._groupedDataMapProvider.getGroupIndices();
  }

  getLastGroupCellPosition(groupIndex) {
    return this._groupedDataMapProvider.getLastGroupCellPosition(groupIndex);
  }

  getRowCountInGroup(groupIndex) {
    return this._groupedDataMapProvider.getRowCountInGroup(groupIndex);
  }

  getCellData(rowIndex: number, columnIndex: number, isAllDay = false, rtlEnabled = false) {
    const row = isAllDay && !this._options.isVerticalGrouping
      ? this.viewDataMap.allDayPanelMap
      : this.viewDataMap.dateTableMap[rowIndex];

    const actualColumnIndex = !rtlEnabled
      ? columnIndex
      : row.length - 1 - columnIndex;

    const { cellData } = row[actualColumnIndex];

    return cellData;
  }

  getCellsByGroupIndexAndAllDay(groupIndex: number, isAllDay: boolean): ViewCellData[][] {
    const rowsPerGroup = this._getRowCountWithAllDayRows();
    const isShowAllDayPanel = this._options.isAllDayPanelVisible;

    const firstRowInGroup = this._options.isVerticalGrouping
      ? groupIndex * rowsPerGroup
      : 0;
    const lastRowInGroup = this._options.isVerticalGrouping
      ? (groupIndex + 1) * rowsPerGroup - 1
      : rowsPerGroup;
    const correctedFirstRow = isShowAllDayPanel && !isAllDay
      ? firstRowInGroup + 1
      : firstRowInGroup;
    const correctedLastRow = isAllDay ? correctedFirstRow : lastRowInGroup;

    return this.completeViewDataMap
      .slice(correctedFirstRow, correctedLastRow + 1)
      .map((row) => row.filter(({ groupIndex: currentGroupIndex }) => groupIndex === currentGroupIndex));
  }

  getCellCountWithGroup(groupIndex, rowIndex = 0) {
    const { dateTableGroupedMap } = this.groupedDataMap;

    return dateTableGroupedMap
      .filter((_, index) => index <= groupIndex)
      .reduce(
        (previous, row) => previous + row[rowIndex].length,
        0,
      );
  }

  hasGroupAllDayPanel(groupIndex) {
    if (this._options.isVerticalGrouping) {
      return !!this.groupedDataMap.dateTableGroupedMap[groupIndex]?.[0][0].cellData.allDay;
    }

    return this.groupedDataMap.allDayPanelGroupedMap[groupIndex]?.length > 0;
  }

  isGroupIntersectDateInterval(groupIndex, startDate, endDate) {
    const groupStartDate = this.getGroupStartDate(groupIndex)!;
    const groupEndDate = this.getGroupEndDate(groupIndex);

    return startDate < groupEndDate && endDate > groupStartDate;
  }

  findGlobalCellPosition(date, groupIndex = 0, allDay = false) {
    const { completeViewDataMap } = this;

    const showAllDayPanel = this._options.isAllDayPanelVisible;

    for (let rowIndex = 0; rowIndex < completeViewDataMap.length; rowIndex += 1) {
      const currentRow = completeViewDataMap[rowIndex];

      for (let columnIndex = 0; columnIndex < currentRow.length; columnIndex += 1) {
        const cellData = currentRow[columnIndex];
        const {
          startDate: currentStartDate,
          endDate: currentEndDate,
          groupIndex: currentGroupIndex,
          allDay: currentAllDay,
        } = cellData;

        if (groupIndex === currentGroupIndex
                    && allDay === !!currentAllDay
                    && this._compareDatesAndAllDay(date, currentStartDate, currentEndDate, allDay)) {
          return {
            position: {
              columnIndex,
              rowIndex: showAllDayPanel && !this._options.isVerticalGrouping
                ? rowIndex - 1
                : rowIndex,
            },
            cellData,
          };
        }
      }
    }

    return undefined;
  }

  private _compareDatesAndAllDay(
    date: Date,
    cellStartDate: Date,
    cellEndDate: Date,
    allDay: boolean,
  ): boolean {
    return allDay
      ? dateUtils.sameDate(date, cellStartDate)
      : date >= cellStartDate && date < cellEndDate;
  }

  getSkippedDaysCount(groupIndex, startDate, endDate, daysCount) {
    const { dateTableGroupedMap } = this._groupedDataMapProvider.groupedDataMap;
    const groupedData = dateTableGroupedMap[groupIndex];
    let includedDays = 0;

    for (let rowIndex = 0; rowIndex < groupedData.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < groupedData[rowIndex].length; columnIndex += 1) {
        const cell = groupedData[rowIndex][columnIndex].cellData;
        if (startDate.getTime() < cell.endDate.getTime()
                    && endDate.getTime() > cell.startDate.getTime()) {
          includedDays += 1;
        }
      }
    }

    const lastCell = groupedData[groupedData.length - 1][groupedData[0].length - 1].cellData;
    const lastCellStart = dateUtils.trimTime(lastCell.startDate);
    const daysAfterView = Math.floor((endDate.getTime() - lastCellStart.getTime()) / dateUtils.dateToMilliseconds('day'));

    const deltaDays = daysAfterView > 0 ? daysAfterView : 0;

    return daysCount - includedDays - deltaDays;
  }

  getColumnsCount() {
    const { dateTableMap } = this.viewDataMap;
    return dateTableMap
      ? dateTableMap[0].length
      : 0;
  }

  getViewEdgeIndices(isAllDayPanel) {
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

  getGroupEdgeIndices(groupIndex, isAllDay) {
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

  isSameCell(firstCellData, secondCellData) {
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

  getLastViewDate() {
    const { completeViewDataMap } = this;
    const rowsCount = completeViewDataMap.length - 1;

    return completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate;
  }

  getStartViewDate() {
    return this._options.startViewDate;
  }

  getIntervalDuration(intervalCount: number): number {
    return this.viewDataGenerator._getIntervalDuration(intervalCount);
  }

  getLastCellEndDate(): Date {
    const lastEndDate = new Date(
      this.getLastViewDate().getTime() - dateUtils.dateToMilliseconds('minute'),
    );
    return dateUtilsTs.addOffsets(lastEndDate, -this._options.viewOffset);
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

    return this._adjustEndDateByDaylightDiff(lastCellEndDate, endDateOfLastViewCell);
  }

  _adjustEndDateByDaylightDiff(startDate, endDate) {
    const daylightDiff = timeZoneUtils.getDaylightOffsetInMs(startDate, endDate);

    const endDateOfLastViewCell = new Date(endDate.getTime() - daylightDiff);

    return new Date(endDateOfLastViewCell.getTime() - dateUtils.dateToMilliseconds('minute'));
  }

  getCellCountInDay(startDayHour, endDayHour, hoursInterval) {
    return this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
  }

  getCellCount(options: CountGenerationConfig) {
    return this.viewDataGenerator.getCellCount(options);
  }

  getRowCount(options: CountGenerationConfig) {
    return this.viewDataGenerator.getRowCount(options);
  }

  getVisibleDayDuration(
    startDayHour: number,
    endDayHour: number,
    hoursInterval: number,
  ): number {
    return this.viewDataGenerator.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  }

  _getRowCountWithAllDayRows() {
    const allDayRowCount = this._options.isAllDayPanelVisible ? 1 : 0;

    return this.getRowCount(this._options) + allDayRowCount;
  }

  getFirstDayOfWeek(firstDayOfWeekOption) {
    return this.viewDataGenerator.getFirstDayOfWeek(firstDayOfWeekOption);
  }

  setViewOptions(options: ViewDataProviderOptions) {
    this._options = this._transformRenderOptions(options);
  }

  getViewOptions(): ViewOptions {
    return this._options;
  }

  getViewPortGroupCount() {
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
