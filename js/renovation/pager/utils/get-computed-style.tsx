export default function getElementComputedStyle(el: Element| undefined):
CSSStyleDeclaration | null {
  return el ? globalThis.getComputedStyle && globalThis.getComputedStyle(el) : null;
}
