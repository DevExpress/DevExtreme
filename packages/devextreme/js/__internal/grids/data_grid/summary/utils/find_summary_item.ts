import { isDefined } from '@ts/core/utils/m_type';

import type { SummaryItem } from '../types';

const getFullName = (summaryItem: SummaryItem): string | undefined => {
  const { summaryType, column } = summaryItem;

  if (summaryType && column) {
    return `${summaryType}_${column}`;
  }

  return summaryType ?? column;
};

export const findSummaryItem = (
  summaryItems?: SummaryItem[],
  name?: string | number,
): number => {
  if (!summaryItems?.length || !isDefined(name)) {
    return -1;
  }

  for (let index = 0; index < summaryItems.length; index += 1) {
    const summaryItem = summaryItems[index];
    const isNameMatch = summaryItem.name === name
      || index === name
      || summaryItem.summaryType === name
      || summaryItem.column === name
      || getFullName(summaryItem) === name;

    if (isNameMatch) {
      return index;
    }
  }

  return -1;
};
