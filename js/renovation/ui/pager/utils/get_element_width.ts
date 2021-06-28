import getElementComputedStyle from '../../../utils/get_computed_style';
import { toNumber } from '../../../utils/type_conversion';

export function getElementStyle(
  name: keyof CSSStyleDeclaration, element: Element | null | undefined,
): number {
  const computedStyle = getElementComputedStyle(element) ?? {};
  return toNumber(computedStyle[name]);
}

export function getElementWidth(element: Element | null | undefined): number {
  return getElementStyle('width', element);
}
export function getElementMinWidth(element: Element | null | undefined): number {
  return getElementStyle('minWidth', element);
}
