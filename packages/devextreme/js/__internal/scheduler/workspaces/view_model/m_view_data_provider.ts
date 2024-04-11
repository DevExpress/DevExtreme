import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';
import type { ViewCellData, ViewType } from '@ts/scheduler/r1/types';
import {
  calculateIsGroupedAllDayPanel,
  getGroupPanelData, isGroupingByDate,
  isHorizontalGroupingApplied, isHorizontalView,
  isVerticalGroupingApplied,
} from '@ts/scheduler/r1/utils/index';

import timeZoneUtils from '../../m_utils_time_zone';
import { DateHeaderDataGenerator } from './m_date_header_data_generator';
import { GroupedDataMapProvider } from './m_grouped_data_map_provider';
import { TimePanelDataGenerator } from './m_time_panel_data_generator';
import { getViewDataGeneratorByViewType } from './m_utils';

// TODO: Vinogradov types refactoring.
export default class ViewDataProvider {
  viewDataGenerator: any;

  viewData: any;

  completeViewDataMap: any[];

  completeDateHeaderMap: any[];

  viewDataMap: any;

  _groupedDataMapProvider!: GroupedDataMapProvider;

  _options: any;

  completeTimePanelMap: any;

  dateHeaderData: any;

  timePanelData: any;

  viewDataMapWithSelection: any;

  constructor(public readonly viewType: ViewType) {
    this.viewDataGenerator = getViewDataGeneratorByViewType(viewType);
    this.viewData = {};
    this.completeViewDataMap = [];
    this.completeDateHeaderMap = [];
    this.viewDataMap = {};
    this._groupedDataMapProvider = null as unknown as GroupedDataMapProvider;
  }

  get groupedDataMap() { return this._groupedDataMapProvider.groupedDataMap; }

  get hiddenInterval() { return this.viewDataGenerator.hiddenInterval; }

  isSkippedDate(date) { return this.viewDataGenerator.isSkippedDate(date); }

  update(options, isGenerateNewViewData) {
    this.viewDataGenerator = getViewDataGeneratorByViewType(options.viewType);

    const { viewDataGenerator } = this;
    const dateHeaderDataGenerator = new DateHeaderDataGenerator(viewDataGenerator);
    const timePanelDataGenerator = new TimePanelDataGenerator(viewDataGenerator);

    const renderOptions = this._transformRenderOptions(options);

    renderOptions.interval = this.viewDataGenerator.getInterval(renderOptions.hoursInterval);
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

  createGroupedDataMapProvider() {
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

  _transformRenderOptions(renderOptions) {
    const {
      groups,
      groupOrientation,
      groupByDate,
      isAllDayPanelVisible,
      viewOffset,
      ...restOptions
    } = renderOptions;

    return {
      ...restOptions,
      startViewDate: this.viewDataGenerator._calculateStartViewDate(renderOptions),
      isVerticalGrouping: isVerticalGroupingApplied(groups, groupOrientation),
      isHorizontalGrouping: isHorizontalGroupingApplied(groups, groupOrientation),
      isGroupedByDate: isGroupingByDate(groups, groupOrientation, groupByDate),
      isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(groups, groupOrientation, isAllDayPanelVisible),
      groups,
      groupOrientation,
      isAllDayPanelVisible,
      viewOffset,
    };
  }

  getGroupPanelData(options) {
    const renderOptions = this._transformRenderOptions(options);
    if (renderOptions.groups.length > 0) {
      const cellCount = this.getCellCount(renderOptions);
      return getGroupPanelData(
        renderOptions.groups,
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

  hasAllDayPanel() {
    const { viewData } = this.viewDataMap;
    const { allDayPanel } = viewData.groupedData[0];

    return !viewData.isGroupedAllDayPanel && allDayPanel?.length > 0;
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

  getCellData(rowIndex, columnIndex, isAllDay, rtlEnabled) {
    const row = isAllDay && !this._options.isVerticalGrouping
      ? this.viewDataMap.allDayPanelMap
      : this.viewDataMap.dateTableMap[rowIndex];

    const actualColumnIndex = !rtlEnabled
      ? columnIndex
      : row.length - 1 - columnIndex;

    const { cellData } = row[actualColumnIndex];

    return cellData;
  }

  getCellsByGroupIndexAndAllDay(groupIndex, allDay) {
    const rowsPerGroup = this._getRowCountWithAllDayRows();
    const isShowAllDayPanel = this._options.isAllDayPanelVisible;

    const firstRowInGroup = this._options.isVerticalGrouping
      ? groupIndex * rowsPerGroup
      : 0;
    const lastRowInGroup = this._options.isVerticalGrouping
      ? (groupIndex + 1) * rowsPerGroup - 1
      : rowsPerGroup;
    const correctedFirstRow = isShowAllDayPanel && !allDay
      ? firstRowInGroup + 1
      : firstRowInGroup;
    const correctedLastRow = allDay ? correctedFirstRow : lastRowInGroup;

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

  getIntervalDuration(intervalCount) {
    return this.viewDataGenerator._getIntervalDuration(intervalCount);
  }

  getLastCellEndDate() {
    const lastEndDate = new Date(
      this.getLastViewDate().getTime() - dateUtils.dateToMilliseconds('minute'),
    );
    return dateUtilsTs.addOffsets(lastEndDate, [-this._options.viewOffset]);
  }

  getLastViewDateByEndDayHour(endDayHour) {
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

  getCellCount(options) {
    return this.viewDataGenerator.getCellCount(options);
  }

  getRowCount(options) {
    return this.viewDataGenerator.getRowCount(options);
  }

  getVisibleDayDuration(startDayHour, endDayHour, hoursInterval) {
    return this.viewDataGenerator.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  }

  _getRowCountWithAllDayRows() {
    const allDayRowCount = this._options.isAllDayPanelVisible ? 1 : 0;

    return this.getRowCount(this._options) + allDayRowCount;
  }

  getFirstDayOfWeek(firstDayOfWeekOption) {
    return this.viewDataGenerator.getFirstDayOfWeek(firstDayOfWeekOption);
  }

  setViewOptions(options) {
    this._options = this._transformRenderOptions(options);
  }

  getViewOptions() {
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
