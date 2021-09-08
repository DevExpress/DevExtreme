import { isWindow } from '../../../../core/utils/type';

export function getWindowByElement(element: Element): Element {
  return isWindow(element) ? element : (element as any).defaultView;
}

export function getElementOffset(
  element: Element | null,
): { left: number; top: number } {
  if (!element) return { left: 0, top: 0 };

  if (!element.getClientRects().length) {
    return {
      top: 0,
      left: 0,
    };
  }

  const rect = element.getBoundingClientRect();
  const window = getWindowByElement((element as any).ownerDocument);
  const docElem = element.ownerDocument.documentElement;

  return {
    top: rect.top + (window as any).pageYOffset - docElem.clientTop,
    left: rect.left + (window as any).pageXOffset - docElem.clientLeft,
  };
}
