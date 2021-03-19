import getElementComputedStyle from './get_computed_style';

function toNumber(attribute: string | undefined): number {
  return attribute ? Number(attribute.replace('px', '')) : 0;
}

export function getElementStyle(name: keyof CSSStyleDeclaration, element?: Element): number {
  const computedStyle = getElementComputedStyle(element) || {};
  return toNumber(computedStyle[name]);
}
export function getElementWidth(element: Element | undefined): number {
  return getElementStyle('width', element);
}
export function getElementMinWidth(element: Element | undefined): number {
  return getElementStyle('minWidth', element);
}
