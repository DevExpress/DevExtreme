export default function getElementComputedStyle(el): CSSStyleDeclaration | null {
  return el ? globalThis.getComputedStyle && globalThis.getComputedStyle(el) : null;
}
