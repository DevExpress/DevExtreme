import type { Properties } from 'csstype';

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

export const combineClasses = (
  classesMap: { [key: string]: boolean },
): string => Object.keys(classesMap)
  .filter((p) => classesMap[p])
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
