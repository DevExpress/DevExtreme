import { CSSAttributes } from 'devextreme-generator/component_declaration/common';
import { combineClasses } from '../../../utils/combine_classes';
import { GroupedViewData } from './types.d';
import { GroupOrientation } from '../types.d';
import { VERTICAL_GROUP_ORIENTATION } from '../consts';

export const getKeyByDateAndGroup = (date: Date, groupIndex?: number): string => {
  const key = date.getTime();
  if (!groupIndex) {
    return key.toString();
  }

  return (key + groupIndex).toString();
};

export const getKeyByGroup = (groupIndex: number): string => groupIndex.toString();

const addToStyle = (
  attr: string,
  value: string,
  style?: CSSAttributes,
): CSSAttributes => {
  const nextStyle = style || {};
  const result = { ...nextStyle };

  result[attr] = value || nextStyle[value];

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
  viewData: GroupedViewData, index: number,
): boolean => {
  const { groupedData } = viewData;
  const groupData = groupedData[index];
  const isAllDayPanel = !!(groupData?.allDayPanel?.length);
  const isGroupedAllDayPanel = !!(groupData?.isGroupedAllDayPanel);

  return isAllDayPanel && isGroupedAllDayPanel;
};

export const isVerticalGroupOrientation = (
  groupOrientation?: GroupOrientation,
): boolean => groupOrientation === VERTICAL_GROUP_ORIENTATION;
