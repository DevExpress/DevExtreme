import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';

import { isDateAndTimeView } from '../../__migration/utils/index';
import timezoneUtils from '../../m_utils_time_zone';

export class GroupedDataMapProvider {
  groupedDataMap: any;

  completeViewDataMap: any;

  _viewOptions: any;

  constructor(viewDataGenerator, viewDataMap, completeViewDataMap, viewOptions) {
    this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(viewDataMap);
    this.completeViewDataMap = completeViewDataMap;
    this._viewOptions = viewOptions;
  }

  getGroupStartDate(groupIndex: number): Date | null {
    const firstRow = this.getFirstGroupRow(groupIndex);

    return firstRow?.[0]?.cellData?.startDate as Date ?? null;
  }

  getGroupEndDate(groupIndex) {
    const lastRow = this.getLastGroupRow(groupIndex);

    if (lastRow) {
      const lastColumnIndex = lastRow.length - 1;
      const { cellData } = lastRow[lastColumnIndex];
      const { endDate } = cellData;

      return endDate;
    }
  }

  findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate) {
    const groupData = this.getGroupFromDateTableGroupMap(groupIndex);
    const checkCellStartDate = (rowIndex, columnIndex) => {
      const { cellData } = groupData[rowIndex][columnIndex];
      let {
        startDate: secondMin,
        endDate: secondMax,
      } = cellData;

      if (isFindByDate) {
        secondMin = dateUtils.trimTime(secondMin);
        secondMax = dateUtils.setToDayEnd(secondMin);
      }

      if (dateUtils.intervalsOverlap({
        firstMin: startDate,
        firstMax: endDate,
        secondMin,
        secondMax,
      })) {
        return secondMin;
      }
    };
    const searchVertical = () => {
      const cellCount = groupData[0].length;
      for (let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
        for (let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
          const result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }
    };
    const searchHorizontal = () => {
      for (let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
        const row = groupData[rowIndex];
        for (let columnIndex = 0; columnIndex < row.length; ++columnIndex) {
          const result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }
    };

    const startDateVerticalSearch = searchVertical();
    const startDateHorizontalSearch = searchHorizontal();

    return startDateVerticalSearch > startDateHorizontalSearch
      ? startDateHorizontalSearch
      : startDateVerticalSearch;
  }

  findAllDayGroupCellStartDate(groupIndex: number): Date | null {
    const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);
    const cellData = groupedData?.[0]?.[0]?.cellData;
    return cellData?.startDate as Date ?? null;
  }

  findCellPositionInMap(cellInfo: any, isAppointmentRender: boolean): any {
    const {
      groupIndex, startDate, isAllDay, index,
    } = cellInfo;
    const {
      allDayPanelGroupedMap,
      dateTableGroupedMap,
    } = this.groupedDataMap;
    const { viewOffset } = this._viewOptions;

    const rows = isAllDay && !this._viewOptions.isVerticalGrouping
      ? allDayPanelGroupedMap[groupIndex] ? [allDayPanelGroupedMap[groupIndex]] : []
      : dateTableGroupedMap[groupIndex] || [];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];

      for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
        const cell = row[columnIndex];
        // NOTE: If this is appointment's render call
        // we should shift the real cellData dates by viewOffset
        // to find correct cell indexes.
        const cellData = isAppointmentRender
          ? {
            ...cell.cellData,
            startDate: dateUtilsTs.addOffsets(cell.cellData.startDate, [-viewOffset]),
            endDate: dateUtilsTs.addOffsets(cell.cellData.endDate, [-viewOffset]),
          }
          : cell.cellData;

        if (this._isSameGroupIndexAndIndex(cellData, groupIndex, index)) {
          if (this.isStartDateInCell(startDate, isAllDay, cellData)) {
            return cell.position;
          }
        }
      }
    }

    return undefined;
  }

  private isStartDateInCell(
    startDate: Date,
    inAllDayRow: boolean,
    {
      startDate: cellStartDate,
      endDate: cellEndDate,
      allDay: cellAllDay,
    }: any,
  ): boolean {
    const { viewType } = this._viewOptions;

    const cellDatesSummerToWinterDiffMs = timezoneUtils
      .getSummerToWinterTimeDSTDiffMs(cellStartDate, cellEndDate);
    const summerToWinterDiffMs = timezoneUtils
      .getSummerToWinterTimeDSTDiffMs(cellStartDate, startDate);
    const isSummerToWinterDSTChangeEdgeCase = cellDatesSummerToWinterDiffMs === 0
      && summerToWinterDiffMs > 0;

    switch (true) {
      case !isDateAndTimeView(viewType):
      case inAllDayRow && cellAllDay:
        return dateUtils.sameDate(startDate, cellStartDate);
      case !inAllDayRow && !isSummerToWinterDSTChangeEdgeCase:
        return startDate >= cellStartDate && startDate < cellEndDate;
      case !inAllDayRow && isSummerToWinterDSTChangeEdgeCase:
        return this.handleSummerToWinterDSTEdgeCase(
          startDate,
          summerToWinterDiffMs,
          cellStartDate,
          cellEndDate,
        );
      default:
        return false;
    }
  }

  private handleSummerToWinterDSTEdgeCase(
    startDate: Date,
    summerTimeDSTDiffMs: number,
    cellStartDate: Date,
    cellEndDate: Date,
  ): boolean {
    const nextTimezoneCellStartDate = dateUtilsTs.addOffsets(cellStartDate, [summerTimeDSTDiffMs]);
    const nextTimezoneCellEndDate = dateUtilsTs.addOffsets(cellEndDate, [summerTimeDSTDiffMs]);

    const isInPreviousTimezoneCell = startDate >= cellStartDate
      && startDate < cellEndDate;
    const isInNextTimezoneCell = startDate >= nextTimezoneCellStartDate
      && startDate < nextTimezoneCellEndDate;

    return isInPreviousTimezoneCell || isInNextTimezoneCell;
  }

  _isSameGroupIndexAndIndex(cellData, groupIndex, index) {
    return cellData.groupIndex === groupIndex
            && (index === undefined || cellData.index === index);
  }

  getCellsGroup(groupIndex) {
    const { dateTableGroupedMap } = this.groupedDataMap;
    const groupData = dateTableGroupedMap[groupIndex];

    if (groupData) {
      const { cellData } = groupData[0][0];

      return cellData.groups;
    }
  }

  getCompletedGroupsInfo() {
    const { dateTableGroupedMap } = this.groupedDataMap;
    return dateTableGroupedMap.map((groupData) => {
      const firstCell = groupData[0][0];
      const {
        allDay,
        groupIndex,
      } = firstCell.cellData;

      return {
        allDay,
        groupIndex,
        startDate: this.getGroupStartDate(groupIndex),
        endDate: this.getGroupEndDate(groupIndex),
      };
    }).filter(({ startDate }) => !!startDate);
  }

  getGroupIndices() {
    return this.getCompletedGroupsInfo()
      .map(({ groupIndex }) => groupIndex);
  }

  getGroupFromDateTableGroupMap(groupIndex) {
    const { dateTableGroupedMap } = this.groupedDataMap;

    return dateTableGroupedMap[groupIndex];
  }

  getFirstGroupRow(groupIndex) {
    const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);

    if (groupedData) {
      const { cellData } = groupedData[0][0];

      return !cellData.allDay
        ? groupedData[0]
        : groupedData[1];
    }
  }

  getLastGroupRow(groupIndex) {
    const { dateTableGroupedMap } = this.groupedDataMap;
    const groupedData = dateTableGroupedMap[groupIndex];

    if (groupedData) {
      const lastRowIndex = groupedData.length - 1;

      return groupedData[lastRowIndex];
    }
  }

  getLastGroupCellPosition(groupIndex) {
    const groupRow = this.getLastGroupRow(groupIndex);

    // eslint-disable-next-line no-unsafe-optional-chaining
    return groupRow?.[groupRow?.length - 1].position;
  }

  getRowCountInGroup(groupIndex) {
    const groupRow = this.getLastGroupRow(groupIndex);
    const cellAmount = groupRow.length;
    const lastCellData = groupRow[cellAmount - 1].cellData;
    const lastCellIndex = lastCellData.index;

    return (lastCellIndex + 1) / groupRow.length;
  }
}
