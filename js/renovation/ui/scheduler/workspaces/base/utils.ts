import dateUtils from '../../../../../core/utils/date';
import { getGroupCount } from '../../../../../ui/scheduler/resources/utils';
import { GroupOrientation } from '../../types';
import { GetDateForHeaderText } from '../../view_model/to_test/views/types';
import {
  Group, TableWidthWorkSpaceConfig, ViewDataProviderType,
} from '../types';
import { isHorizontalGroupingApplied, isVerticalGroupingApplied } from '../utils';

const DAY_MS = dateUtils.dateToMilliseconds('day');
const HOUR_MS = dateUtils.dateToMilliseconds('hour');

const DATE_TABLE_MIN_CELL_WIDTH = 75;

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
  const dateTableCell = dateTable.querySelector('td');

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
