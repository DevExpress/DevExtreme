export function getRelativeOffset(
  targetElementClass: string, sourceElement: HTMLElement,
): { top: number; left: number } {
  const offset = { left: 0, top: 0 };

  let currentElement = sourceElement;

  while (currentElement?.offsetParent && !currentElement.classList.contains(targetElementClass)) {
    const parentOffsetElement = currentElement.offsetParent as HTMLElement;

    const currentElementRect = currentElement.getBoundingClientRect();
    const parentOffsetElementRect = parentOffsetElement.getBoundingClientRect();

    offset.left += currentElementRect.left - parentOffsetElementRect.left;
    offset.top += currentElementRect.top - parentOffsetElementRect.top;

    currentElement = currentElement.offsetParent as HTMLElement;
  }

  return offset;
}
