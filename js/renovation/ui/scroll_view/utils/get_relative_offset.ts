export function getRelativeOffset(
  targetElementClass: string, sourceElement: HTMLElement,
): { top: number; left: number } {
  const offset = { left: 0, top: 0 };

  let currentElement = sourceElement;

  while (currentElement?.offsetParent && !currentElement.classList.contains(targetElementClass)) {
    offset.left += currentElement.offsetLeft;
    offset.top += currentElement.offsetTop;
    currentElement = currentElement.offsetParent as HTMLElement;
  }

  return offset;
}
