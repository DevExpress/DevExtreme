import { getWindow } from '../../core/utils/window';

const window = getWindow();

export default function getElementComputedStyle(el: Element | undefined | null):
CSSStyleDeclaration | null {
  return el ? window.getComputedStyle?.(el) : null;
}
