export function getScrollTopMax(element: HTMLElement | Element): number {
  return element.scrollHeight - element.clientHeight;
}
