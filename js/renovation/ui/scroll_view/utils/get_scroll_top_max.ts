export function getScrollTopMax(element: HTMLElement): number {
  return element.scrollHeight - element.clientHeight;
}
