import dateUtils from '../../../../../core/utils/date';
import { getGroupCount } from '../../../../../ui/scheduler/resources/utils';
import { GroupOrientation } from '../../types';
import { GetDateForHeaderText, Group } from '../types';
import { isHorizontalGroupingApplied, isVerticalGroupingApplied } from '../utils';

const DAY_MS = dateUtils.dateToMilliseconds('day');
const HOUR_MS = dateUtils.dateToMilliseconds('hour');

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
  tableRect: ClientRect,
  cellRect: ClientRect,
): ClientRect => ({
  ...cellRect,
  left: cellRect.left - tableRect.left,
  top: cellRect.top - tableRect.top,
});

export const getDateForHeaderText: GetDateForHeaderText = (_, date) => date;
