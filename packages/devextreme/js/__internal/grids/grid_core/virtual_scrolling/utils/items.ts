import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

export interface GroupCountableDataSourceAdapter {
  isGroupItemCountable: (data: unknown) => boolean;
}

type IsItemCountableFunc = (
  item: ProcessedItem,
  isNextAfterLast: boolean,
  fromEnd: boolean,
) => boolean;

export const correctCount = (
  items: ProcessedItem[],
  count: number,
  fromEnd: boolean,
  isItemCountableFunc: IsItemCountableFunc,
): number => {
  let result = count;

  for (let i = 0; i < result + 1; i += 1) {
    const item = items[fromEnd ? items.length - 1 - i : i];
    if (item && !isItemCountableFunc(item, i === result, fromEnd)) {
      result += 1;
    }
  }

  return result;
};

// `isGroupItemCountable` is installed on the adapter by the DataGrid grouping module through
// `provider.extend()`, so no adapter type declares it. This is the one place that checks for it.
const asGroupCountableAdapter = (
  dataSourceAdapter: unknown,
): GroupCountableDataSourceAdapter | undefined => (
  typeof (dataSourceAdapter as GroupCountableDataSourceAdapter | undefined)?.isGroupItemCountable === 'function'
    ? dataSourceAdapter as GroupCountableDataSourceAdapter
    : undefined
);

export const isItemCountableByDataSource = (
  item: ProcessedItem,
  dataSourceAdapter: unknown,
): boolean => (item.rowType === 'data' && !item.isNewRow)
  || (item.rowType === 'group'
    && (asGroupCountableAdapter(dataSourceAdapter)?.isGroupItemCountable(item.data) ?? false));

export const updateItemIndices = (items: ProcessedItem[]): ProcessedItem[] => {
  items.forEach((item, index) => {
    item.rowIndex = index;
  });

  return items;
};
