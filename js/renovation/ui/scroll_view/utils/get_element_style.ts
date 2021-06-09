import getElementComputedStyle from '../../../utils/get_computed_style';

export function getElementStyle(
  name: keyof CSSStyleDeclaration, element: Element | null,
): number | string {
  const computedStyle = getElementComputedStyle(element) ?? {};
  return computedStyle[name];
}
