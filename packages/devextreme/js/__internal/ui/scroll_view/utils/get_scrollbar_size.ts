import type { Orientation } from '@js/common';

export function getScrollbarSize(element: HTMLElement, direction: Orientation): number {
  if (direction === 'vertical') {
    return element.offsetWidth - element.clientWidth;
  }

  return element.offsetHeight - element.clientHeight;
}
