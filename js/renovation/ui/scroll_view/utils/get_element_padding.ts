import { getElementComputedStyle } from '../../../utils/get_computed_style';
import { toNumber } from '../../../utils/type_conversion';

export function getElementStyle(
  name: keyof CSSStyleDeclaration, element: Element | null | undefined,
): number {
  const computedStyle = getElementComputedStyle(element as Element) ?? {};
  return toNumber(computedStyle[name] as string);
}

export function getElementPaddingBottom(element: Element | null | undefined): number {
  return getElementStyle('paddingBottom', element);
}
