import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';

export interface GroupCountableDataSource {
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

export const isItemCountableByDataSource = (
  item: ProcessedItem,
  dataSourceAdapter: GroupCountableDataSource | null | undefined,
): boolean => (item.rowType === 'data' && !item.isNewRow)
  || (item.rowType === 'group' && (dataSourceAdapter?.isGroupItemCountable(item.data) ?? false));

export const updateItemIndices = (items: ProcessedItem[]): ProcessedItem[] => {
  items.forEach((item, index) => {
    item.rowIndex = index;
  });

  return items;
};
