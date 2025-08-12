import type { dxElementWrapper } from '@js/core/renderer';

export const isElementCanBeFocused = ($element: dxElementWrapper): boolean => Boolean(
  $element && $element.is(':visible') && !$element.hasClass('dx-state-disabled'),
);

export const getPrevElement = (
  sortedIndex: number,
  sortedElementsMap: dxElementWrapper[] = [],
): dxElementWrapper | undefined => {
  let index = sortedIndex - 1;
  while (index >= 0) {
    const $nextElement = sortedElementsMap[index];
    if (isElementCanBeFocused($nextElement)) {
      return $nextElement;
    }
    index -= 1;
  }

  return undefined;
};

export const getNextElement = (
  sortedIndex: number,
  sortedElementsMap: dxElementWrapper[] = [],
): dxElementWrapper | undefined => {
  let index = sortedIndex + 1;
  while (index < sortedElementsMap.length) {
    const $nextElement = sortedElementsMap[index];
    if (isElementCanBeFocused($nextElement)) {
      return $nextElement;
    }
    index += 1;
  }

  return undefined;
};
