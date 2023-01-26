import { titleize } from '../../../../core/utils/inflector';
import { getWindow, hasWindow } from '../../../../core/utils/window';
import { toNumber } from '../../../utils/type_conversion';

export function getElementStyle(
  el: Element | undefined | null,
): CSSStyleDeclaration | null | undefined {
  return el && hasWindow() ? getWindow().getComputedStyle?.(el) : null;
}

export function getElementMargin(element: Element | null, side: string): number {
  const style = getElementStyle(element);
  return style ? toNumber(style[`margin${titleize(side)}`]) : 0;
}

export function getElementPadding(element: Element | null, side: string): number {
  const style = getElementStyle(element);
  return style ? toNumber(style[`padding${titleize(side)}`]) : 0;
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
