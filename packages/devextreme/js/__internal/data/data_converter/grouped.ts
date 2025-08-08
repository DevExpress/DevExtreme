import { isGroupItemsArray } from '@js/common/data/custom_store';
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

export function getDataSourceOptions(
  dataSource: DataSourceLike<GroupedItem>,
): GroupedDataSourceLike<GroupedItem> {
  // isArray check is needed to avoid ts errors in identifying the reduce method on dataSource
  if (!Array.isArray(dataSource) || !isGroupItemsArray(dataSource)) {
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
