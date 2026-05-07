import type { GroupItem } from '@js/common/data';
import { isGroupItemsArray } from '@js/common/data';
import { isObject } from '@js/core/utils/type';
import type { DataSourceLike, DataSourceOptions } from '@js/data/data_source';

const groupKey = 'key';

export function getDataSourceOptions<TItem>(
  dataSource: DataSourceLike<TItem>,
): DataSourceLike<TItem> | DataSourceOptions<GroupItem<TItem>> {
  if (
    !isGroupItemsArray<TItem>(dataSource)
    || (dataSource as GroupItem<TItem>[]).some((item) => Object.keys(item).length !== 2)
  ) {
    return dataSource;
  }

  let hasSimpleItems = false;

  const data = dataSource.reduce((
    accumulator: GroupItem<TItem>[],
    item: GroupItem<TItem>,
  ) => {
    const items = item.items?.map((value: TItem | GroupItem<TItem>): GroupItem<TItem> => {
      let innerItem = value;
      if (!isObject(innerItem)) {
        // @ts-expect-error
        innerItem = { text: innerItem };
        hasSimpleItems = true;
      }

      const objectItem = innerItem as Partial<GroupItem<TItem>>;

      if (!(groupKey in objectItem)) {
        objectItem[groupKey] = item.key;
      }

      return objectItem as GroupItem<TItem>;
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
      // @ts-expect-error
      keepInitialKeyOrder: true,
    },
    searchExpr: hasSimpleItems ? 'text' : undefined,
  };
}
