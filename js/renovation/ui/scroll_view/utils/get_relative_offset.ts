export function getRelativeOffset(
  targetElementClass: string, sourceElement: HTMLDivElement | HTMLElement,
): { top: number; left: number } {
  const offset = { left: 0, top: 0 };

  let element = sourceElement;

  while (element?.offsetParent && !element.classList.contains(targetElementClass)) {
    const parentElement = element.offsetParent as HTMLElement;

    const elementRect = element.getBoundingClientRect();
    const parentElementRect = parentElement.getBoundingClientRect();

    offset.left += elementRect.left - parentElementRect.left;
    offset.top += elementRect.top - parentElementRect.top;

    element = element.offsetParent as HTMLElement;
  }

  return offset;
}
