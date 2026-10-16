import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

export const getGroupAggregates = (data: RawItemData): unknown[] => {
  const result = data.summary ?? data.aggregates ?? [];
  return result as unknown[];
};
