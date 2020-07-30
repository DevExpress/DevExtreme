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

export const getGroupCellClasses = (isFirstCell, isLastCell): string => {
  const classes = new Array<string>();

  isFirstCell && classes.push('dx-scheduler-first-group-cell');
  isLastCell && classes.push('dx-scheduler-last-group-cell');

  return classes.join(' ');
};
