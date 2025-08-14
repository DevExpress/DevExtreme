import type { SortedIndex } from '../types';

export const addSortedIndex = <T>(
  entities: T[],
): (T & SortedIndex)[] => entities.map((entity, index) => ({
    ...entity,
    sortedIndex: index,
  }));
