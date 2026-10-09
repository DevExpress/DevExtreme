import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow, hasWindow } from '@js/core/utils/window';

const ELEMENT_NODE = 1;

/*
 * A size the theme publishes for the runtime to read back: the few lengths JS has to know before
 * it can position anything (devextreme-scss: tools/naming/runtime-reads.json). The tier declares
 * them on the component root, so the element has to sit inside that root and in the document.
 *
 * Undefined when the theme declares nothing - the caller then keeps its own default. A value the
 * browser has not reduced to a plain length (`calc()`, `em`, a keyword) reads as undefined too, so
 * tests/runtime-reads.test.ts holds every contract value to a plain length in the built bundles.
 */
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
