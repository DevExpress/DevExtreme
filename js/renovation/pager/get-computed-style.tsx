export default function getElementComputedStyle(el): CSSStyleDeclaration {
  return globalThis.getComputedStyle && globalThis.getComputedStyle(el);
}
