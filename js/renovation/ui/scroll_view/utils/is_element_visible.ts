/* istanbul ignore next */
export function isVisible(element: HTMLElement): boolean {
  return element.offsetWidth > 0 || element.offsetHeight > 0;
}
