import { getWindow, hasWindow } from '../../../../core/utils/window';
import { toNumber } from '../../../utils/type_conversion';

export function getElementStyle(
  el: Element | undefined | null,
): CSSStyleDeclaration | null | undefined {
  return el && hasWindow() ? getWindow().getComputedStyle?.(el) : null;
}

export function getElementPaddingBottom(element: Element | null): number {
  const style = getElementStyle(element);
  return style ? toNumber(style.paddingBottom) : 0;
}

export function getElementOverflowX(element: Element | null): string {
  const style = getElementStyle(element);
  return style ? style.overflowX : 'visible';
}

export function getElementOverflowY(element: Element | null): string {
  const style = getElementStyle(element);
  return style ? style.overflowY : 'visible';
}

export function getElementTransform(element: Element | null): string {
  const style = getElementStyle(element);
  return style ? style.transform : '';
}
