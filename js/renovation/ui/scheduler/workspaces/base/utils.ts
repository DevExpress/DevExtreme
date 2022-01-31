import type { dxSchedulerScrolling } from '../../../../../ui/scheduler';
import dateUtils from '../../../../../core/utils/date';
import { getGroupCount } from '../../../../../ui/scheduler/resources/utils';
import { GroupOrientation } from '../../types';
import { GetDateForHeaderText } from '../../view_model/to_test/views/types';
import {
  Group,
  TableWidthWorkSpaceConfig,
  ViewCellData,
  ViewDataProviderType,
  VirtualScrollingOptions,
} from '../types';
import { isHorizontalGroupingApplied, isVerticalGroupingApplied } from '../utils';
import {
  ALL_DAY_PANEL_CELL_CLASS,
  ALL_DAY_ROW_CLASS,
  DATE_TABLE_CELL_CLASS,
  DATE_TABLE_ROW_CLASS,
} from '../const';

const DAY_MS = dateUtils.dateToMilliseconds('day');
const HOUR_MS = dateUtils.dateToMilliseconds('hour');

export const DATE_TABLE_MIN_CELL_WIDTH = 75;

export const getTotalRowCount = (
  rowCount: number,
  groupOrientation: GroupOrientation,
  groups: Group[],
  isAllDayPanelVisible: boolean,
): number => {
  const isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);
  const groupCount = getGroupCount(groups);

  const totalRowCount = isVerticalGrouping
    ? rowCount * groupCount
    : rowCount;

  return isAllDayPanelVisible
    ? totalRowCount + groupCount
    : totalRowCount;
};

export const getTotalCellCount = (
  cellCount: number,
  groupOrientation: GroupOrientation,
  groups: Group[],
): number => {
  const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
  const groupCount = getGroupCount(groups);

  return isHorizontalGrouping
    ? cellCount * groupCount
    : cellCount;
};

export const getRowCountWithAllDayRow = (
  rowCount: number,
  isAllDayPanelVisible: boolean,
): number => (isAllDayPanelVisible ? rowCount + 1 : rowCount);

export const getHiddenInterval = (
  hoursInterval: number,
  cellCountInDay: number,
): number => {
  const visibleInterval = hoursInterval * cellCountInDay * HOUR_MS;

  return DAY_MS - visibleInterval;
};

export const createCellElementMetaData = (
  tableRect: DOMRect,
  cellRect: DOMRect,
): DOMRect => {
  const {
    top, right, bottom, left, width, height, x, y,
  } = cellRect;

  return {
    right,
    bottom,
    left: left - tableRect.left,
    top: top - tableRect.top,
    width,
    height,
    x,
    y,
  } as DOMRect;
};

export const getDateForHeaderText: GetDateForHeaderText = (_, date) => date;

export const getDateTableWidth = (
  scrollableWidth: number,
  dateTable: HTMLTableElement,
  viewDataProvider: ViewDataProviderType,
  workSpaceConfig: TableWidthWorkSpaceConfig,
): number => {
  const dateTableCell = dateTable.querySelector('td:not(.dx-scheduler-virtual-cell)');

  // eslint-disable-next-line rulesdir/no-non-null-assertion
  let cellWidth = dateTableCell!.getBoundingClientRect().width;

  if (cellWidth < DATE_TABLE_MIN_CELL_WIDTH) {
    cellWidth = DATE_TABLE_MIN_CELL_WIDTH;
  }

  const cellCount = viewDataProvider.getCellCount(workSpaceConfig);
  const totalCellCount = getTotalCellCount(
    cellCount, workSpaceConfig.groupOrientation, workSpaceConfig.groups,
  );

  const minTablesWidth = totalCellCount * cellWidth;

  return scrollableWidth < minTablesWidth ? minTablesWidth : scrollableWidth;
};

export const createVirtualScrollingOptions = (
  options: {
    cellHeight: number;
    cellWidth: number;
    schedulerHeight?: number | string | (() => number | string);
    schedulerWidth?: number | string | (() => number | string);
    viewHeight: number;
    viewWidth: number;
    scrolling: dxSchedulerScrolling;
    scrollableWidth: number;
    groups: Group[];
    isVerticalGrouping: boolean;
    completeRowCount: number;
    completeColumnCount: number;
    windowHeight: number;
    windowWidth: number;
    rtlEnabled: boolean;
  },
): VirtualScrollingOptions => ({
  getCellHeight: (): number => options.cellHeight,
  getCellWidth: (): number => options.cellWidth,
  getCellMinWidth: (): number => DATE_TABLE_MIN_CELL_WIDTH,
  isRTL: (): boolean => options.rtlEnabled,
  getSchedulerHeight: ():
  number | string | (() => number | string) | undefined => options.schedulerHeight,
  getSchedulerWidth: ():
  number | string | (() => number | string) | undefined => options.schedulerWidth,
  getViewHeight: (): number => options.viewHeight,
  getViewWidth: (): number => options.viewWidth,
  getScrolling: (): dxSchedulerScrolling => options.scrolling,
  getScrollableOuterWidth: (): number => options.scrollableWidth,
  getGroupCount: (): number => getGroupCount(options.groups),
  isVerticalGrouping: (): boolean => options.isVerticalGrouping,
  getTotalRowCount: (): number => options.completeRowCount,
  getTotalCellCount: (): number => options.completeColumnCount,
  getWindowHeight: (): number => options.windowHeight,
  getWindowWidth: (): number => options.windowWidth,
});

export const getCellIndices = (cell: HTMLElement): {
  columnIndex: number;
  rowIndex: number;
} => {
  const row = cell.closest(`.${DATE_TABLE_ROW_CLASS}, .${ALL_DAY_ROW_CLASS}`) as HTMLElement;
  const rowParent = row.parentNode as HTMLElement;
  const cellParent = cell.parentNode as HTMLElement;

  const columnIndex = [...Array.from(cellParent.children)]
    .filter((child) => child.className.includes(DATE_TABLE_CELL_CLASS)
      || child.className.includes(ALL_DAY_PANEL_CELL_CLASS))
    .indexOf(cell);
  const rowIndex = [...Array.from(rowParent.children)]
    .filter((child) => child.className.includes(DATE_TABLE_ROW_CLASS))
    .indexOf(row);

  return {
    columnIndex,
    rowIndex,
  };
};

export const compareCellsByDateAndIndex = (daysAndIndexes: {
  date: number;
  index: number;
  firstDate: number;
  firstIndex: number;
  lastDate: number;
  lastIndex: number;
}): boolean => {
  const {
    date, index,
    firstDate, firstIndex,
    lastDate, lastIndex,
  } = daysAndIndexes;

  if (firstDate === lastDate) {
    let validFirstIndex = firstIndex;
    let validLastIndex = lastIndex;
    if (validFirstIndex > validLastIndex) {
      [validFirstIndex, validLastIndex] = [validLastIndex, validFirstIndex];
    }

    return firstDate === date && index >= validFirstIndex && index <= validLastIndex;
  }
  return (date === firstDate && index >= firstIndex)
          || (date === lastDate && index <= lastIndex)
          || (firstDate < date && date < lastDate);
};

const filterCellsByDateAndIndex = (cellsRow: ViewCellData[], filterData: {
  firstDate: Date;
  lastDate: Date;
  firstIndex: number;
  lastIndex: number;
}): ViewCellData[] => {
  const {
    firstDate, lastDate,
    firstIndex, lastIndex,
  } = filterData;

  const firstDay = (dateUtils.trimTime(firstDate) as Date).getTime();
  const lastDay = (dateUtils.trimTime(lastDate) as Date).getTime();

  return cellsRow.filter((cell) => {
    const { startDate, index } = cell;
    const day = (dateUtils.trimTime(startDate) as Date).getTime();
    const daysAndIndexes = {
      date: day,
      index,
      firstDate: firstDay,
      firstIndex,
      lastDate: lastDay,
      lastIndex,
    };

    return compareCellsByDateAndIndex(daysAndIndexes);
  });
};

export const getSelectedCells = (
  viewDataProvider: ViewDataProviderType,
  firstSelectedCell: ViewCellData,
  lastSelectedCell: ViewCellData,
  isLastSelectedCellAllDay: boolean,
): ViewCellData[] => {
  let firstCell = firstSelectedCell;
  let lastCell = lastSelectedCell;

  if (firstCell.startDate.getTime() > lastCell.startDate.getTime()) {
    [firstCell, lastCell] = [lastCell, firstCell];
  }

  const {
    startDate: firstStartDate, groupIndex: firstGroupIndex, index: firstCellIndex,
  } = firstCell;
  const {
    startDate: lastStartDate, index: lastCellIndex,
  } = lastCell;

  const cells = viewDataProvider
    .getCellsByGroupIndexAndAllDay(firstGroupIndex ?? 0, isLastSelectedCellAllDay);

  const filteredCells = cells.reduce((selectedCells, cellsRow) => {
    const filterData = {
      firstDate: firstStartDate,
      lastDate: lastStartDate,
      firstIndex: firstCellIndex,
      lastIndex: lastCellIndex,
    };
    const filteredRow = filterCellsByDateAndIndex(cellsRow, filterData);
    selectedCells.push(...filteredRow);

    return selectedCells;
  }, []);

  const selectedCells = filteredCells.sort(
    (firstArg, secondArg) => firstArg.startDate.getTime() - secondArg.startDate.getTime(),
  );

  return selectedCells;
};

export const isCellAllDay = (cell: HTMLElement): boolean => cell.className
  .includes(ALL_DAY_PANEL_CELL_CLASS);
