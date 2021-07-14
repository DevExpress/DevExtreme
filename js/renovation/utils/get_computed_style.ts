export function getElementComputedStyle(el: Element): CSSStyleDeclaration;

export function getElementComputedStyle(el: undefined | null): null;

export function getElementComputedStyle(el: Element | undefined | null):
CSSStyleDeclaration | null {
  return el ? window.getComputedStyle?.(el) : null;
}
