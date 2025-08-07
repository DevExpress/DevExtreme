import { isObject } from '@js/core/utils/type';
import type { DataSourceLike, DataSourceOptions } from '@js/data/data_source';
import type { GroupedItem } from '@ts/ui/list/list.edit.strategy.grouped';

type ConvertedDataSourceLike<TItem> = DataSourceLike<TItem>
  & { group?: DataSourceOptions['group'] & { keepInitialKeyOrder?: boolean } };

const hasCorrectStructure = (
  data: DataSourceLike<GroupedItem>,
): data is GroupedItem[] => Array.isArray(data)
  && data.every((item: GroupedItem): boolean => {
    const hasTwoFields = Object.keys(item).length === 2;
    const hasCorrectFields = 'key' in item && 'items' in item;

    return hasTwoFields
      && hasCorrectFields
      && Array.isArray(item.items);
  });

export function getConvertedDataSource(
  dataSource: DataSourceLike<GroupedItem>,
  isGrouped?: boolean,
): ConvertedDataSourceLike<GroupedItem> {
  const groupKey = 'key';

  if (!isGrouped || !hasCorrectStructure(dataSource)) {
    return dataSource;
  }

  let hasSimpleItems = false;

  const data = dataSource.reduce((accumulator: GroupedItem[], item: GroupedItem) => {
    const items = item.items?.map((listItem) => {
      let innerItem = listItem;
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
      selector: 'key',
      keepInitialKeyOrder: true,
    },
    searchExpr: hasSimpleItems ? 'text' : undefined,
  };
}
