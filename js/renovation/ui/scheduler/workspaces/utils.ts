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

export const getKeyByGroup = (groupIndex: number): string => `key_${groupIndex}`;

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

export const getIsGroupedAllDayPanel = (viewData: GroupedViewData, groupIndex: number): boolean => {
  const { groupedData } = viewData;
  const groupData = groupedData[groupIndex];
  const isAllDayPanel = !!(groupData?.allDayPanel?.length);
  const isGroupedAllDayPanel = !!(groupData?.isGroupedAllDayPanel);

  return isAllDayPanel && isGroupedAllDayPanel;
};
