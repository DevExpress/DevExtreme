import type { Properties } from 'csstype';

import type { ViewType } from '../types';

type CSSAttributes = Properties<string | number>;

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

export const addWidthToStyle = (
  value: number | undefined,
  style?: CSSAttributes,
): CSSAttributes => {
  const width = value ? `${value}px` : '';
  return addToStyles([{ attr: 'width', value: width }], style);
};

export const addHeightToStyle = (
  value: number | undefined,
  style?: CSSAttributes,
): CSSAttributes => {
  const height = value ? `${value}px` : '';
  return addToStyles([{ attr: 'height', value: height }], style);
};

// TODO Vinogradov: move up this util function (core/r1).
export const combineClasses = (
  classesMap: { [key: string]: boolean },
): string => Object.keys(classesMap)
  .filter((cssClass) => !!cssClass && classesMap[cssClass])
  .join(' ');

export const getGroupCellClasses = (
  isFirstGroupCell: boolean | undefined = false,
  isLastGroupCell: boolean | undefined = false,
  className = '',
): string => combineClasses({
  'dx-scheduler-first-group-cell': isFirstGroupCell,
  'dx-scheduler-last-group-cell': isLastGroupCell,
  [className]: true,
});

export const getCellSizeHorizontalClass = (
  viewType: ViewType,
  crossScrollingEnabled: boolean,
): string => {
  const sizeClassName = 'dx-scheduler-cell-sizes-horizontal';

  switch (viewType) {
    case 'day':
    case 'week':
    case 'workWeek':
    case 'month':
      return crossScrollingEnabled ? sizeClassName : '';
    case 'agenda':
      return '';
    default:
      return sizeClassName;
  }
};

export const getCellSizeVerticalClass = (
  viewType: ViewType,
  isAllDayCell: boolean,
): string => {
  const sizeClassName = 'dx-scheduler-cell-sizes-vertical';

  switch (viewType) {
    case 'agenda':
      return '';
    default:
      return !isAllDayCell ? sizeClassName : '';
  }
};
