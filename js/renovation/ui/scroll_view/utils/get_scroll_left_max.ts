export function getScrollLeftMax(element: HTMLElement): number {
  return element.scrollWidth - element.clientWidth;
}
