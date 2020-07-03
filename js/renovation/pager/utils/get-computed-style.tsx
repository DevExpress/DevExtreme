import { getWindow } from '../../../core/utils/window';

const window = getWindow() as Window;

export default function getElementComputedStyle(el: Element| undefined):
CSSStyleDeclaration | null {
  return el ? window.getComputedStyle && window.getComputedStyle(el) : null;
}
