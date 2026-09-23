/* eslint-disable max-depth -- findChanges is kept as a single pass on purpose */
import { logger } from '@js/core/utils/console';
import { isDefined, isObject } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';

type GetKey<TItem, TKey> = (item: TItem) => TKey;

export type ItemChange<TItem, TKey> = { type: 'insert'; data: TItem; index: number }
  | { type: 'update'; data: TItem; key: TKey; index: number; oldItem: TItem }
  | { type: 'remove'; key: TKey; index: number; oldItem: TItem };

interface FindChangesOptions<TItem, TKey> {
  oldItems: TItem[];
  newItems: TItem[];
  getKey: GetKey<TItem, TKey>;
  isItemEquals: (oldItem: TItem, newItem: TItem) => boolean;
  detectReorders?: boolean;
}

function getKeyWrapper<TItem, TKey>(item: TItem, getKey: GetKey<TItem, TKey>): TKey | string {
  const key = getKey(item);

  if (isObject(key)) {
    try {
      return JSON.stringify(key);
    } catch {
      return key;
    }
  }

  return key;
}

function getSameNewByOld<TItem, TKey>(
  oldItem: TItem,
  newItems: TItem[],
  newIndexByKey: Record<string, number>,
  getKey: GetKey<TItem, TKey>,
): TItem | undefined {
  const key = getKeyWrapper(oldItem, getKey);

  return newItems[newIndexByKey[String(key)]];
}

export function isKeysEqual(oldKeys: unknown[], newKeys: unknown[]): boolean {
  if (oldKeys.length !== newKeys.length) {
    return false;
  }

  for (let i = 0; i < newKeys.length; i += 1) {
    if (oldKeys[i] !== newKeys[i]) {
      return false;
    }
  }

  return true;
}

function mapIndexByKey<TItem, TKey>(
  items: TItem[],
  getKey: GetKey<TItem, TKey>,
): Record<string, number> {
  const indexByKey: Record<string, number> = {};

  items.forEach((item, index) => {
    const key = getKeyWrapper(item, getKey);

    if (isDefined(indexByKey[String(key)])) {
      throw errors.Error('E1040', key);
    }

    indexByKey[String(key)] = index;
  });

  return indexByKey;
}

export function findChanges<TItem, TKey>({
  oldItems,
  newItems,
  getKey,
  isItemEquals,
  detectReorders = false,
}: FindChangesOptions<TItem, TKey>): ItemChange<TItem, TKey>[] | undefined {
  try {
    const oldIndexByKey = mapIndexByKey(oldItems, getKey);
    const newIndexByKey = mapIndexByKey(newItems, getKey);
    let addedCount = 0;
    let removeCount = 0;
    const result: ItemChange<TItem, TKey>[] = [];

    const itemCount = Math.max(oldItems.length, newItems.length);
    for (let index = 0; index < itemCount + addedCount; index += 1) {
      const newItem = newItems[index];
      const oldNextIndex = index - addedCount + removeCount;
      const nextOldItem = oldItems[oldNextIndex];
      const isRemoved = !newItem
        || (nextOldItem && !getSameNewByOld(nextOldItem, newItems, newIndexByKey, getKey));

      if (isRemoved) {
        if (nextOldItem) {
          result.push({
            type: 'remove',
            key: getKey(nextOldItem),
            index,
            oldItem: nextOldItem,
          });
          removeCount += 1;
          index -= 1;
        }
      } else {
        const key = getKeyWrapper(newItem, getKey);
        const oldIndex = oldIndexByKey[String(key)];
        const oldItem = oldItems[oldIndex];
        if (!oldItem) {
          addedCount += 1;
          result.push({
            type: 'insert',
            data: newItem,
            index,
          });
        } else if (oldIndex === oldNextIndex) {
          if (!isItemEquals(oldItem, newItem)) {
            result.push({
              type: 'update',
              data: newItem,
              key: getKey(newItem),
              index,
              oldItem,
            });
          }
        } else {
          if (!detectReorders) {
            return undefined;
          }

          result.push({
            type: 'remove',
            key: getKey(oldItem),
            index: oldIndex,
            oldItem,
          });
          result.push({
            type: 'insert',
            data: newItem,
            index,
          });
          addedCount += 1;
          removeCount += 1;
        }
      }
    }

    if (detectReorders) {
      const removes = result.filter((r) => r.type === 'remove').sort((a, b) => b.index - a.index);
      const inserts = result.filter((i) => i.type === 'insert').sort((a, b) => a.index - b.index);
      const updates = result.filter((u) => u.type === 'update');
      return [...removes, ...inserts, ...updates];
    }

    return result;
  } catch (e) {
    logger.error(e);

    return undefined;
  }
}
