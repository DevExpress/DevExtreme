export default function getElementComputedStyle(el: Element| undefined):
CSSStyleDeclaration | null {
  return el ? window.getComputedStyle && window.getComputedStyle(el) : null;
}
