import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow, hasWindow } from '@js/core/utils/window';

/*
 * A size the theme publishes for the runtime to read back: the few lengths JS has to know before
 * it can position anything (devextreme-scss: tools/naming/runtime-reads.json). The tier declares
 * them on the component root, so the element has to sit inside that root and in the document.
 * Undefined when the theme declares nothing - the caller then keeps its own default.
 */
export function themeLength(
  element: Element | dxElementWrapper,
  property: string,
): number | undefined {
  const node = $(element).get(0);
  const view = hasWindow() ? node?.ownerDocument?.defaultView ?? getWindow() : undefined;

  if (!node || !view?.getComputedStyle) {
    return undefined;
  }

  const declared = view.getComputedStyle(node).getPropertyValue(property).trim();
  const match = /^(-?\d*\.?\d+)(px|rem)?$/.exec(declared);

  if (!match) {
    return undefined;
  }

  const value = parseFloat(match[1]);

  if (match[2] !== 'rem') {
    return value;
  }

  return value * parseFloat(view.getComputedStyle(node.ownerDocument.documentElement).fontSize);
}
