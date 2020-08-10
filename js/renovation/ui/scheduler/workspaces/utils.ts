import { combineClasses } from '../../../utils/combine_classes';
import { GroupedViewData } from './types.d';

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
): { [key: string]: string | number | undefined } => {
  const nextStyle = style || {};

  return {
    ...nextStyle,
    height: height ? `${height}px` : nextStyle.height,
  };
};

export const getGroupCellClasses = (
  isFirstCell: boolean | undefined = false,
  isLastCell: boolean | undefined = false,
  className = '',
): string => combineClasses({
  'dx-scheduler-first-group-cell': isFirstCell,
  'dx-scheduler-last-group-cell': isLastCell,
  [className]: true,
});

export const getIsGroupedAllDayPanel = (viewData: GroupedViewData): boolean => {
  const { groupedData } = viewData;
  const isAllDayPanel = !!groupedData[0]?.allDayPanel;

  return isAllDayPanel && groupedData.length > 1;
};
