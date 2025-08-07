import { isObject } from '@js/core/utils/type';
import type { DataSourceLike, DataSourceOptions } from '@js/data/data_source';

type ConvertedDataSourceLike<TItem> = DataSourceLike<TItem>
  & { group?: DataSourceOptions['group'] & { keepInitialKeyOrder?: boolean } };

const groupKey = 'key';

interface Item {
  [key: string]: unknown;
  [groupKey]?: string;
}

interface GroupedItem {
  key?: string;
  items?: (Item | string | number)[];
}

const isGroupedDataArray = <TGroupedItem extends GroupedItem = GroupedItem>(
  data: DataSourceLike<TGroupedItem>,
): data is TGroupedItem[] => Array.isArray(data)
  && data.every((item: TGroupedItem): boolean => {
    const hasTwoFields = Object.keys(item).length === 2;
    const hasCorrectFields = 'key' in item && 'items' in item;

    return hasTwoFields
      && hasCorrectFields
      && Array.isArray(item.items);
  });

export function getDataSourceOptions<
  TGroupedItem extends GroupedItem = GroupedItem,
>(
  dataSource: DataSourceLike<TGroupedItem>,
): ConvertedDataSourceLike<TGroupedItem> {
  if (!isGroupedDataArray(dataSource)) {
    return dataSource;
  }

  let hasSimpleItems = false;

  const data = dataSource.reduce((accumulator: Item[], item: TGroupedItem) => {
    const items = item.items?.map((value: Item | string | number): Item => {
      let innerItem = value;
      if (!isObject(innerItem)) {
        innerItem = { text: innerItem };
        hasSimpleItems = true;
      }

      if (!(groupKey in innerItem)) {
        innerItem[groupKey] = item.key;
      }

      return innerItem;
    }) ?? [];
    return accumulator.concat(items);
  }, []);

  return {
    store: {
      type: 'array',
      data,
    },
    group: {
      selector: groupKey,
      keepInitialKeyOrder: true,
    },
    searchExpr: hasSimpleItems ? 'text' : undefined,
  };
}
