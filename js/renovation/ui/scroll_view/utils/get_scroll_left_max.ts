export function getScrollLeftMax(element: Element | null): number {
  if (!element) return 0;

  return element.scrollWidth - element.clientWidth;
}
