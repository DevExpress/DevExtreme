export function getScrollTopMax(element: Element | null): number {
  if (!element) return 0;

  return element.scrollHeight - element.clientHeight;
}
