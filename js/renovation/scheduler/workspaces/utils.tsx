export const getKeyByDateAndGroup = (date: Date, group?: object): string => {
  const keyFromDate = date.toString();
  if (!group) return keyFromDate;

  return Object.keys(group).reduce(
    (currentKey, resourceName) => `${currentKey}_${resourceName}_${group[resourceName]}`,
    keyFromDate,
  );
};

export const addHeightToStyle = (
  height?: number, style?: Partial<CSSStyleDeclaration>,
): Partial<CSSStyleDeclaration> => {
  const nextStyle: Partial<CSSStyleDeclaration> = style || {};

  return {
    ...nextStyle,
    height: height ? `${height}px` : nextStyle.height,
  };
};
