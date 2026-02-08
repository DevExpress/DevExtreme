import query from '@js/common/data/query';

import type { CombinedFilter } from './type';

export const filterArray = <T>(
  items: T[],
  combinedFilter: CombinedFilter<T> | (CombinedFilter<T> | 'or')[],
  // @ts-expect-error
): T[] => query(items).filter(combinedFilter).toArray() as T[];
