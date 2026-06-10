import dateUtils from '@js/core/utils/date';
import { dateUtilsTs } from '@ts/core/utils/date';
import { isDateAndTimeView } from '@ts/scheduler/r1/utils/index';
import type { GroupLeaf } from '@ts/scheduler/utils/resource_manager/types';

import type {
  CellInfo,
  CellPositionData,
  GroupedDataMap,
  GroupInfo,
  ViewCellData,
  ViewDataMap,
  ViewType,
} from '../../types';
import timezoneUtils from '../../utils_time_zone';
import type { ViewDataGenerator } from './m_view_data_generator';

const toMs = dateUtils.dateToMilliseconds;

interface GroupedDataMapViewOptions {
  isVerticalGrouping: boolean;
  viewType: ViewType;
  viewOffset: number;
}

export class GroupedDataMapProvider {
  groupedDataMap: GroupedDataMap;

  completeViewDataMap: ViewCellData[][];

  private readonly viewOptions: GroupedDataMapViewOptions;

  constructor(
    viewDataGenerator: ViewDataGenerator,
    viewDataMap: ViewDataMap,
    completeViewDataMap: ViewCellData[][],
    viewOptions: GroupedDataMapViewOptions,
  ) {
    this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(viewDataMap);
    this.completeViewDataMap = completeViewDataMap;
    this.viewOptions = viewOptions;
  }

  getGroupStartDate(groupIndex: number): Date | null {
    const firstRow = this.getFirstGroupRow(groupIndex);

    return firstRow?.[0]?.cellData?.startDate ?? null;
  }

  getGroupEndDate(groupIndex: number): Date | undefined {
    const lastRow = this.getLastGroupRow(groupIndex);

    if (lastRow) {
      const lastColumnIndex = lastRow.length - 1;
      const { cellData } = lastRow[lastColumnIndex];

      return cellData.endDate;
    }

    return undefined;
  }

  findGroupCellStartDate(
    groupIndex: number,
    startDate: Date,
    endDate: Date,
    isFindByDate: boolean,
  ): Date | undefined {
    const groupData = this.getGroupFromDateTableGroupMap(groupIndex);

    const checkCellStartDate = (rowIndex: number, columnIndex: number): Date | undefined => {
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

      return undefined;
    };

    const searchVertical = (): Date | undefined => {
      const cellCount = groupData[0].length;
      for (let columnIndex = 0; columnIndex < cellCount; columnIndex += 1) {
        for (let rowIndex = 0; rowIndex < groupData.length; rowIndex += 1) {
          const result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }

      return undefined;
    };

    const searchHorizontal = (): Date | undefined => {
      for (let rowIndex = 0; rowIndex < groupData.length; rowIndex += 1) {
        const row = groupData[rowIndex];
        for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
          const result = checkCellStartDate(rowIndex, columnIndex);
          if (result) return result;
        }
      }

      return undefined;
    };

    const startDateVerticalSearch = searchVertical();
    const startDateHorizontalSearch = searchHorizontal();

    if (startDateVerticalSearch === undefined) return startDateHorizontalSearch;
    if (startDateHorizontalSearch === undefined) return startDateVerticalSearch;

    return startDateVerticalSearch > startDateHorizontalSearch
      ? startDateHorizontalSearch
      : startDateVerticalSearch;
  }

  findAllDayGroupCellStartDate(groupIndex: number): Date | null {
    const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);
    const cellData = groupedData?.[0]?.[0]?.cellData;

    return cellData?.startDate ?? null;
  }

  findCellPositionInMap(
    cellInfo: Pick<ViewCellData, 'startDate' | 'groupIndex' | 'index' | 'allDay'>,
    isAppointmentRender: boolean,
  ): CellPositionData | undefined {
    const {
      groupIndex, startDate, allDay, index,
    } = cellInfo;
    const { viewOffset } = this.viewOptions;

    // eslint-disable-next-line no-undef-init
    let foundPosition: CellPositionData | undefined = undefined;
    this.getRowsForCellSearch(allDay, groupIndex).some(
      (row) => row.some((cell) => {
        const originCellData = cell.cellData;
        // NOTE: If this is appointment's render call
        // we should shift the real cellData dates by viewOffset
        // to find correct cell indexes.
        const cellData = isAppointmentRender
          ? {
            ...originCellData,
            startDate: dateUtilsTs.addOffsets(cell.cellData.startDate, -viewOffset),
            endDate: dateUtilsTs.addOffsets(cell.cellData.endDate, -viewOffset),
          }
          : originCellData;

        if (
          this.isSameGroupIndexAndIndex(cellData, groupIndex, index)
          && this.isStartDateInCell(startDate, allDay, cellData, originCellData)
        ) {
          foundPosition = cell.position;
          return true;
        }
        return false;
      }),
    );

    return foundPosition;
  }

  private getRowsForCellSearch(
    allDay: boolean | undefined,
    groupIndex: number | undefined,
  ): CellInfo[][] {
    const { allDayPanelGroupedMap, dateTableGroupedMap } = this.groupedDataMap;
    const gIdx = groupIndex ?? 0;

    if (allDay && !this.viewOptions.isVerticalGrouping) {
      const allDayRow = allDayPanelGroupedMap[gIdx];
      return allDayRow ? [allDayRow] : [];
    }

    return dateTableGroupedMap[gIdx] ?? [];
  }

  private isStartDateInCell(
    startDate: Date,
    inAllDayRow: boolean | undefined,
    {
      startDate: cellStartDate,
      endDate: cellEndDate,
      allDay: cellAllDay,
    }: ViewCellData,
    {
      startDate: originCellStartDate,
      endDate: originCellEndDate,
    }: ViewCellData,
  ): boolean {
    const { viewType } = this.viewOptions;

    const cellSecondIntervalOffset = this.getCellSecondIntervalOffset(
      originCellStartDate,
      originCellEndDate,
    );
    const isCellCoversTwoIntervals = cellSecondIntervalOffset !== 0;

    switch (true) {
      case !isDateAndTimeView(viewType):
      case inAllDayRow && cellAllDay:
        return dateUtils.sameDate(startDate, cellStartDate);
      case !inAllDayRow && !isCellCoversTwoIntervals:
        return startDate >= cellStartDate && startDate < cellEndDate;
      case !inAllDayRow && isCellCoversTwoIntervals:
        return this.isStartDateInTwoIntervalsCell(
          startDate,
          cellSecondIntervalOffset,
          cellStartDate,
          cellEndDate,
        );
      default:
        return false;
    }
  }

  private getCellSecondIntervalOffset(
    cellStartDate: Date,
    cellEndDate: Date,
  ): number {
    const nextHourCellStartDate = dateUtilsTs.addOffsets(cellStartDate, toMs('hour'));
    const cellTimezoneDiff = timezoneUtils.getDaylightOffset(cellStartDate, cellEndDate);
    const cellNextHourTimezoneDiff = timezoneUtils.getDaylightOffset(
      cellStartDate,
      nextHourCellStartDate,
    );

    const isDSTInsideCell = cellTimezoneDiff !== 0;
    const isWinterTimezoneNextHour = cellNextHourTimezoneDiff < 0;

    return !isDSTInsideCell && isWinterTimezoneNextHour
      ? Math.abs(cellNextHourTimezoneDiff * toMs('minute'))
      : 0;
  }

  private isStartDateInTwoIntervalsCell(
    startDate: Date,
    secondIntervalOffset: number,
    cellStartDate: Date,
    cellEndDate: Date,
  ): boolean {
    const nextIntervalCellStartDate = dateUtilsTs.addOffsets(cellStartDate, secondIntervalOffset);
    const nextIntervalCellEndDate = dateUtilsTs.addOffsets(cellEndDate, secondIntervalOffset);

    const isInOriginInterval = startDate >= cellStartDate
      && startDate < cellEndDate;
    const isInSecondInterval = startDate >= nextIntervalCellStartDate
      && startDate < nextIntervalCellEndDate;

    return isInOriginInterval || isInSecondInterval;
  }

  private isSameGroupIndexAndIndex(
    cellData: ViewCellData,
    groupIndex: number | undefined,
    index: number | undefined,
  ): boolean {
    return cellData.groupIndex === groupIndex
      && (index === undefined || cellData.index === index);
  }

  getCellsGroup(groupIndex: number): GroupLeaf['grouped'] | undefined {
    const { dateTableGroupedMap } = this.groupedDataMap;
    const groupData = dateTableGroupedMap[groupIndex];

    if (groupData) {
      const { cellData } = groupData[0][0];

      return cellData.groups;
    }

    return undefined;
  }

  getCompletedGroupsInfo(): GroupInfo[] {
    const { dateTableGroupedMap } = this.groupedDataMap;
    return dateTableGroupedMap.map((groupData) => {
      const firstCell = groupData[0][0];
      const {
        allDay,
        groupIndex,
      } = firstCell.cellData;

      return {
        allDay: allDay ?? false,
        groupIndex: groupIndex ?? 0,
        startDate: this.getGroupStartDate(groupIndex ?? 0),
        endDate: this.getGroupEndDate(groupIndex ?? 0),
      };
    }).filter((info): info is GroupInfo => Boolean(info.startDate) && info.endDate !== undefined);
  }

  getGroupIndices(): number[] {
    return this.getCompletedGroupsInfo()
      .map(({ groupIndex }) => groupIndex);
  }

  getGroupFromDateTableGroupMap(groupIndex: number): CellInfo[][] {
    const { dateTableGroupedMap } = this.groupedDataMap;

    return dateTableGroupedMap[groupIndex];
  }

  getFirstGroupRow(groupIndex: number): CellInfo[] | undefined {
    const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);

    if (groupedData) {
      const { cellData } = groupedData[0][0];

      return !cellData.allDay
        ? groupedData[0]
        : groupedData[1];
    }

    return undefined;
  }

  getLastGroupRow(groupIndex: number): CellInfo[] | undefined {
    const { dateTableGroupedMap } = this.groupedDataMap;
    const groupedData = dateTableGroupedMap[groupIndex];

    if (groupedData) {
      const lastRowIndex = groupedData.length - 1;

      return groupedData[lastRowIndex];
    }

    return undefined;
  }

  getLastGroupCellPosition(groupIndex: number): CellPositionData | undefined {
    const groupRow = this.getLastGroupRow(groupIndex);

    // eslint-disable-next-line no-unsafe-optional-chaining
    return groupRow?.[groupRow?.length - 1].position;
  }

  getRowCountInGroup(groupIndex: number): number {
    const groupRow = this.getLastGroupRow(groupIndex);
    if (!groupRow) return 0;

    const cellAmount = groupRow.length;
    const lastCellData = groupRow[cellAmount - 1].cellData;
    const lastCellIndex = lastCellData.index;

    return (lastCellIndex + 1) / groupRow.length;
  }
}
