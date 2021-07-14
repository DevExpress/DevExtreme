export default function getElementComputedStyle(el: Element | undefined | null):
CSSStyleDeclaration | null {
  return el ? window.getComputedStyle?.(el) : null;
}
