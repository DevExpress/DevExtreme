export function getElementComputedStyle(el: Element): CSSStyleDeclaration {
  return window.getComputedStyle(el);
}
