import { getWindow } from '../../../../core/utils/window';

export default function getElementComputedStyle(el: Element | null | undefined):
CSSStyleDeclaration | null {
  const window = getWindow();
  return el ? window.getComputedStyle?.(el) : null;
}
