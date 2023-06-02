import { getWindow } from '../../core/utils/window';

export default function getElementComputedStyle(el: Element | undefined | null):
CSSStyleDeclaration | null {
  const window = getWindow();
  return el ? window.getComputedStyle?.(el) : null;
}
