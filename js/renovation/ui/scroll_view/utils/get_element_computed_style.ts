import { getWindow } from '../../../../core/utils/window';

const window = getWindow();

export function getElementComputedStyle(el: Element): CSSStyleDeclaration {
  return window.getComputedStyle(el);
}
