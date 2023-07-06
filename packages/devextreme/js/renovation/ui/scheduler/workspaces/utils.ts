import { CSSAttributes } from '@devextreme-generator/declarations';
import { combineClasses } from '../../../utils/combine_classes';
import { Group } from './types';
import { GroupOrientation } from '../types';
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
  groupIndex: number | undefined, isVerticalGrouping: boolean,
): string => {
  if (isVerticalGrouping && !!groupIndex) {
    return groupIndex.toString();
  }

  return '0';
};

export const addToStyles = (
  options: {
    attr: string;
    value: string | number;
  } [],
  style?: CSSAttributes,
): CSSAttributes => {
  const nextStyle = style ?? {};
  const result = { ...nextStyle };

  options.forEach(({ attr, value }) => {
    result[attr] = value || nextStyle[attr];
  });

  return result;
};

export const addHeightToStyle = (
  value: number | undefined,
  style?: CSSAttributes,
): CSSAttributes => {
  const height = value ? `${value}px` : '';
  return addToStyles([{ attr: 'height', value: height }], style);
};

export const addWidthToStyle = (
  value: number | undefined,
  style?: CSSAttributes,
): CSSAttributes => {
  const width = value ? `${value}px` : '';
  return addToStyles([{ attr: 'width', value: width }], style);
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
  hasAllDayRow: boolean, isVerticalGrouping: boolean,
): boolean => hasAllDayRow && isVerticalGrouping;

export const isVerticalGroupingApplied = (
  groups: Group[],
  groupOrientation?: GroupOrientation,
): boolean => groupOrientation === VERTICAL_GROUP_ORIENTATION
  && !!groups.length;

export const isHorizontalGroupingApplied = (
  groups: Group[], groupOrientation?: GroupOrientation,
): boolean => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && !!groups.length;

export const isGroupingByDate = (
  groups: Group[],
  groupOrientation: GroupOrientation | undefined,
  groupByDate: boolean,
): boolean => {
  const isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);

  return groupByDate && isHorizontalGrouping;
};
