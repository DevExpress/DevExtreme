import type { RowKey } from '@ts/grids/grid_core/types';

export const nodeExists = (
  array: RowKey[],
  currentKey: RowKey,
): boolean => !!array.filter((key) => key === currentKey).length;
