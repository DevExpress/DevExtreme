import { CSSAttributes } from '@devextreme-generator/declarations';
import { combineClasses } from '../../../utils/combine_classes';
import { Group, GroupedViewData, TimePanelData } from './types.d';
import { GroupOrientation } from '../types.d';
import {
  HORIZONTAL_GROUP_ORIENTATION,
  VERTICAL_GROUP_ORIENTATION,
} from '../consts';

export const getKeyByDateAndGroup = (date: Date, groupIndex?: number): string => {
  const key = date.getTime();
  if (!groupIndex) {
    return key.toString();
  }

  return (key + groupIndex).toString();
};

export const getKeyByGroup = (
  groupIndex: number, groupOrientation: GroupOrientation | undefined,
): string => {
  if (groupOrientation === VERTICAL_GROUP_ORIENTATION) {
    return groupIndex.toString();
  }

  return '0';
};

const addToStyle = (
  attr: string,
  value: string,
  style?: CSSAttributes,
): CSSAttributes => {
  const nextStyle = style ?? {};
  const result = { ...nextStyle };

  result[attr] = value || nextStyle[attr];

  return result;
};

export const addHeightToStyle = (
  value: number | undefined,
  style?: CSSAttributes,
): CSSAttributes => {
  const height = value ? `${value}px` : '';
  return addToStyle('height', height, style);
};

export const addWidthToStyle = (
  value: number | undefined,
  style?: CSSAttributes,
): CSSAttributes => {
  const width = value ? `${value}px` : '';
  return addToStyle('width', width, style);
};

export const getGroupCellClasses = (
  isFirstGroupCell: boolean | undefined = false,
  isLastGroupCell: boolean | undefined = false,
  className = '',
): string => combineClasses({
  'dx-scheduler-first-group-cell': isFirstGroupCell,
  'dx-scheduler-last-group-cell': isLastGroupCell,
  [className]: true,
});

export const getIsGroupedAllDayPanel = (
  viewData: GroupedViewData | TimePanelData, index: number,
): boolean => {
  const { groupedData } = viewData;
  const groupData = groupedData[index];
  const isAllDayPanel = !!groupData?.allDayPanel;
  const isGroupedAllDayPanel = !!groupData?.isGroupedAllDayPanel;

  return isAllDayPanel && isGroupedAllDayPanel;
};

export const isVerticalGroupOrientation = (
  groupOrientation?: GroupOrientation,
): boolean => groupOrientation === VERTICAL_GROUP_ORIENTATION;

export const isHorizontalGroupOrientation = (
  groups: Group[], groupOrientation?: GroupOrientation,
): boolean => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && !!groups.length;
