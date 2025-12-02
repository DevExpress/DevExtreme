import type { dxElementWrapper } from '@js/core/renderer';

export const isElementCanBeFocused = ($element: dxElementWrapper): boolean => Boolean(
  $element && $element.is(':visible') && !$element.hasClass('dx-state-disabled'),
);

export const getPrevElement = (
  sortedIndex: number,
  renderedElementsBySortedIndex: dxElementWrapper[] = [],
): dxElementWrapper | undefined => {
  let index = sortedIndex - 1;
  while (index >= 0) {
    const $nextElement = renderedElementsBySortedIndex[index];
    if (isElementCanBeFocused($nextElement)) {
      return $nextElement;
    }
    index -= 1;
  }

  return undefined;
};

export const getNextElement = (
  sortedIndex: number,
  renderedElementsBySortedIndex: dxElementWrapper[] = [],
): dxElementWrapper | undefined => {
  let index = sortedIndex + 1;
  while (index < renderedElementsBySortedIndex.length) {
    const $nextElement = renderedElementsBySortedIndex[index];
    if (isElementCanBeFocused($nextElement)) {
      return $nextElement;
    }
    index += 1;
  }

  return undefined;
};
