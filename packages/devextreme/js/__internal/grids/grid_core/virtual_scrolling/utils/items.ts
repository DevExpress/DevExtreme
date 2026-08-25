interface CountableItem {
  rowType?: string;
  isNewRow?: boolean;
  data?: unknown;
}

interface RowIndexedItem {
  rowIndex?: number;
}

interface GroupCountableDataSource {
  isGroupItemCountable: (data: unknown) => boolean;
}

type IsItemCountableFunc<TItem> = (
  item: TItem,
  isNextAfterLast: boolean,
  fromEnd: boolean,
) => boolean;

export const correctCount = <TItem>(
  items: TItem[],
  count: number,
  fromEnd: boolean,
  isItemCountableFunc: IsItemCountableFunc<TItem>,
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
  item: CountableItem,
  dataSource: GroupCountableDataSource,
): boolean => (item.rowType === 'data' && !item.isNewRow)
  || (item.rowType === 'group' && dataSource.isGroupItemCountable(item.data));

export const updateItemIndices = <TItem extends RowIndexedItem>(items: TItem[]): TItem[] => {
  items.forEach((item, index) => {
    item.rowIndex = index;
  });

  return items;
};
