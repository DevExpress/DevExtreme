import getElementComputedStyle from '../../../utils/get_computed_style';
import { toNumber } from '../../../utils/type_conversion';

export function getElementStyle(
  name: keyof CSSStyleDeclaration, element: Element | null | undefined,
): number {
  const computedStyle = getElementComputedStyle(element) ?? {};
  return toNumber(computedStyle[name]);
}
export function getElementContentWidth(element: Element | null | undefined): number {
  const padding = getElementStyle('paddingLeft', element) + getElementStyle('paddingRight', element);
  const width = getElementStyle('width', element);
  return width - padding;
}

export function getElementWidth(element: Element | null | undefined): number {
  const margin = getElementStyle('marginLeft', element) + getElementStyle('marginRight', element);
  const width = getElementStyle('width', element);
  return margin + width;
}
export function getElementMinWidth(element: Element | null | undefined): number {
  return getElementStyle('minWidth', element);
}
