export const simulateTextOverflow = (
  element: HTMLElement,
  scrollWidth: number,
  clientWidth: number,
): void => {
  // Mock scrollWidth > clientWidth to simulate text overflow
  Object.defineProperty(element, 'scrollWidth', { value: scrollWidth, configurable: true });
  Object.defineProperty(element, 'clientWidth', { value: clientWidth, configurable: true });
};

export const simulateHoverEvent = (
  element: HTMLElement,
  options?: MouseEventInit,
): void => {
  element.dispatchEvent(new MouseEvent('mousemove', options ?? {
    bubbles: true,
    cancelable: true,
  }));
};
