import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow, hasWindow } from '@js/core/utils/window';

const ELEMENT_NODE = 1;

export function themeLength(
  element: Element | dxElementWrapper | undefined,
  property: string,
): number | undefined {
  const node = $(element).get(0);

  if (node?.nodeType !== ELEMENT_NODE || !hasWindow()) {
    return undefined;
  }

  const view = node.ownerDocument.defaultView ?? getWindow();

  if (!view?.getComputedStyle) {
    return undefined;
  }

  const declared = view.getComputedStyle(node).getPropertyValue(property).trim();
  const match = /^(-?\d*\.?\d+)(px|rem)?$/.exec(declared);

  if (!match) {
    return undefined;
  }

  const value = parseFloat(match[1]);

  return match[2] === 'rem'
    ? value * parseFloat(view.getComputedStyle(node.ownerDocument.documentElement).fontSize)
    : value;
}
