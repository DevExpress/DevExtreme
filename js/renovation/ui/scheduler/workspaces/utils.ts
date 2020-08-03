import { combineClasses } from '../../../utils/combine_classes';

export const getKeyByDateAndGroup = (date: Date, group?: object): string => {
  let key = date.toString();
  if (group) {
    key = Object.keys(group).reduce(
      (currentKey, resourceName) => `${currentKey}_${resourceName}_${group[resourceName]}`,
      key,
    );
  }

  return key;
};

export const addHeightToStyle = (
  height?: number, style?: any,
): object => {
  const nextStyle = style || {};

  return {
    ...nextStyle,
    height: height ? `${height}px` : nextStyle.height,
  };
};

export const getGroupCellClasses = (
  isFirstCell: boolean,
  isLastCell: boolean,
): string => combineClasses({
  'dx-scheduler-first-group-cell': isFirstCell,
  'dx-scheduler-last-group-cell': isLastCell,
});
