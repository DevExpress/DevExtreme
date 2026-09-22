import { logger } from '@js/core/utils/console';
import { isDefined, isObject } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';

const getKeyWrapper = function (item, getKey) {
  const key = getKey(item);
  if (isObject(key)) {
    try {
      return JSON.stringify(key);
    } catch (e) {
      return key;
    }
  }
  return key;
};

const getSameNewByOld = function (oldItem, newItems, newIndexByKey, getKey) {
  const key = getKeyWrapper(oldItem, getKey);
  return newItems[newIndexByKey[key]];
};

export const isKeysEqual = function (oldKeys, newKeys) {
  if (oldKeys.length !== newKeys.length) {
    return false;
  }

  for (let i = 0; i < newKeys.length; i++) {
    if (oldKeys[i] !== newKeys[i]) {
      return false;
    }
  }

  return true;
};

const mapIndexByKey = function (items, getKey) {
  const indexByKey = {};

  items.forEach((item, index) => {
    const key = getKeyWrapper(item, getKey);

    if (isDefined(indexByKey[String(key)])) {
      throw errors.Error('E1040', key);
    }

    indexByKey[key] = index;
  });

  return indexByKey;
};

export const findChanges = function ({
  oldItems,
  newItems,
  getKey,
  isItemEquals,
  detectReorders = false,
}) {
  try {
    const oldIndexByKey = mapIndexByKey(oldItems, getKey);
    const newIndexByKey = mapIndexByKey(newItems, getKey);
    let addedCount = 0;
    let removeCount = 0;
    const result: any[] = [];

    const itemCount = Math.max(oldItems.length, newItems.length);
    for (let index = 0; index < itemCount + addedCount; index += 1) {
      const newItem = newItems[index];
      const oldNextIndex = index - addedCount + removeCount;
      const nextOldItem = oldItems[oldNextIndex];
      const isRemoved = !newItem || (nextOldItem && !getSameNewByOld(nextOldItem, newItems, newIndexByKey, getKey));

      if (isRemoved) {
        if (nextOldItem) {
          result.push({
            type: 'remove',
            key: getKey(nextOldItem),
            index,
            oldItem: nextOldItem,
          });
          removeCount++;
          index--;
        }
      } else {
        const key = getKeyWrapper(newItem, getKey);
        const oldIndex = oldIndexByKey[key];
        const oldItem = oldItems[oldIndex];
        if (!oldItem) {
          addedCount++;
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
            return;
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
          addedCount++;
          removeCount++;
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
};
