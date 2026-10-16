import type { dxElementWrapper } from '@js/core/renderer';

type PublicElement = Element | dxElementWrapper | string | null | undefined;

type PublicElementStrategy = (element: PublicElement) => PublicElement;

export function getPublicElementNonJquery(element: PublicElement): PublicElement {
  if (element && (element as dxElementWrapper).get) {
    return (element as dxElementWrapper).get(0);
  }
  return element;
}

let strategy: PublicElementStrategy = getPublicElementNonJquery;

export function getPublicElement<TElement extends Element = Element>(
  element: dxElementWrapper,
): TElement;
export function getPublicElement(element: PublicElement): PublicElement;
export function getPublicElement(element: PublicElement): PublicElement {
  return strategy(element);
}

export function setPublicElementWrapper(newStrategy: PublicElementStrategy): void {
  strategy = newStrategy;
}
