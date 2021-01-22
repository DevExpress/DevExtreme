import getElementComputedStyle from '../../utils/get_computed_style';
import { toNumber } from '../../utils/type_conversion';

export function getElementWidth(element: Element | undefined): number {
  const style = getElementComputedStyle(element);
  return toNumber(style?.width) - toNumber(style?.paddingLeft) - toNumber(style?.paddingRight);
}
export function getElementHeight(element: Element | undefined): number {
  const style = getElementComputedStyle(element);
  return toNumber(style?.height) - toNumber(style?.paddingTop) - toNumber(style?.paddingBottom);
}

export const sizeIsValid = (value): boolean => !!(value ?? (value > 0));

export const pickPositiveValue = (values): number => (
  values.reduce((result, value) => ((value > 0 && !result) ? value : result), 0)
);

export const pointInCanvas = (canvas, x: number, y: number): boolean => (
  x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom
);
