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
  height?: number, style?: Partial<CSSStyleDeclaration>,
): Partial<CSSStyleDeclaration> => {
  const nextStyle: Partial<CSSStyleDeclaration> = style || {};

  return {
    ...nextStyle,
    height: height ? `${height}px` : nextStyle.height,
  };
};
