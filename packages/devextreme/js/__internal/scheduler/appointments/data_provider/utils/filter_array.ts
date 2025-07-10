import query from '@js/common/data/query';

export const filterArray = <T>(
  items: T[],
  combinedFilter: ((item: T) => boolean)[][],
  // @ts-expect-error
): T[] => query(items).filter(combinedFilter).toArray() as T[];
