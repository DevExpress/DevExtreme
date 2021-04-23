export function getScrollTopMax(element: Element): number {
  return element.scrollHeight - element.clientHeight;
}
