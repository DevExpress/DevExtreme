import { isObject } from '@js/core/utils/type';
import type { DataSourceLike, DataSourceOptions } from '@js/data/data_source';

export type GroupedDataSourceLike<TItem> = DataSourceLike<TItem>
  & {
    group?: DataSourceOptions['group'] & {
      keepInitialKeyOrder?: boolean;
    };
  };

const groupKey = 'key';

interface Item {
  [key: string]: unknown;
  [groupKey]?: string;
}

interface GroupedItem {
  key?: string;
  items?: (Item | string | number)[];
}

const isGroupedDataArray = (
  data: DataSourceLike<GroupedItem>,
): data is GroupedItem[] => {
  const isArray = Array.isArray(data);

  if (!isArray) {
    return false;
  }

  const isCorrectData = data.every?.((item: GroupedItem): boolean => {
    const hasTwoFields = Object.keys(item).length === 2;
    const hasCorrectFields = 'key' in item && 'items' in item;

    return hasTwoFields
      && hasCorrectFields
      && Array.isArray(item.items);
  });

  return isArray && isCorrectData;
};

export function getDataSourceOptions(
  dataSource: DataSourceLike<GroupedItem>,
): GroupedDataSourceLike<GroupedItem> {
  if (!isGroupedDataArray(dataSource)) {
    return dataSource;
  }

  let hasSimpleItems = false;

  const data = dataSource?.reduce((accumulator: Item[], item: GroupedItem) => {
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
