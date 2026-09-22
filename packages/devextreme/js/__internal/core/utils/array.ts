import config from '@js/core/config';
import { orderEach } from '@js/core/utils/object';
import { isDefined } from '@js/core/utils/type';

type IndexedItem<TProp extends string> = { [key in TProp]?: number };

function createOccurrenceMap<T>(values: T[]): Map<T, number> {
  return values.reduce<Map<T, number>>((map, value) => {
    map.set(value, (map.get(value) ?? 0) + 1);
    return map;
  }, new Map());
}

function takeOccurrence<T>(occurrences: Map<T, number>, value: T): boolean {
  const count = occurrences.get(value);

  if (!count) {
    return false;
  }

  occurrences.set(value, count - 1);

  return true;
}

export function getUniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function getIntersection<T>(firstArray: T[], secondArray: unknown[]): T[] {
  const occurrences = createOccurrenceMap(secondArray);

  return firstArray.filter((value) => takeOccurrence(occurrences, value));
}

export function removeDuplicates<T>(from: T[] = [], toRemove: unknown[] = []): T[] {
  const occurrences = createOccurrenceMap(toRemove);

  return from.filter((value) => !takeOccurrence(occurrences, value));
}

export function normalizeIndexes<TProp extends string, TItem extends IndexedItem<TProp>>(
  items: TItem[],
  indexPropName: TProp,
  currentItem?: TItem,
  needIndexCallback?: (item: TItem) => boolean | undefined,
): void {
  const indexedItems: Record<string, TItem[]> = {};
  const { useLegacyVisibleIndex } = config();
  let currentIndex = 0;

  const shouldUpdateIndex = (item: TItem): boolean => !isDefined(item[indexPropName])
    && (!needIndexCallback || !!needIndexCallback(item));

  const setIndex = (item: TItem, index: number | undefined): void => {
    const indexedItem: IndexedItem<TProp> = item;
    indexedItem[indexPropName] = index;
  };

  items.forEach((item) => {
    const index = item[indexPropName];

    if (Number(index) >= 0) {
      const key = String(index);
      const sameIndexItems = indexedItems[key] ?? [];
      indexedItems[key] = sameIndexItems;

      if (item === currentItem) {
        sameIndexItems.unshift(item);
      } else {
        sameIndexItems.push(item);
      }
    } else {
      setIndex(item, undefined);
    }
  });

  if (!useLegacyVisibleIndex) {
    items.forEach((item) => {
      if (shouldUpdateIndex(item)) {
        while (indexedItems[String(currentIndex)]) {
          currentIndex += 1;
        }
        indexedItems[String(currentIndex)] = [item];
        currentIndex += 1;
      }
    });
  }

  currentIndex = 0;

  orderEach(indexedItems, (index: string, sameIndexItems: TItem[]) => {
    sameIndexItems.forEach((item) => {
      if (Number(index) >= 0) {
        setIndex(item, currentIndex);
        currentIndex += 1;
      }
    });
  });

  if (useLegacyVisibleIndex) {
    items.forEach((item) => {
      if (shouldUpdateIndex(item)) {
        setIndex(item, currentIndex);
        currentIndex += 1;
      }
    });
  }
}

export function groupBy<T>(
  array: T[],
  getGroupName: (item: T) => PropertyKey | undefined,
): Record<PropertyKey, T[]> {
  const groupedResult: Record<PropertyKey, T[]> = {};

  array.forEach((item) => {
    const groupName = getGroupName(item);
    const key = isDefined(groupName) ? groupName : String(groupName);
    const group = groupedResult[key] ?? [];

    group.push(item);
    groupedResult[key] = group;
  });

  return groupedResult;
}

// TODO: ui/map/map.ts pushes the result into options typed as `Marker[] | Route[]`, and a
// union of array types accepts no element type at all, so typing this has to land together
// with `_addFunction`/`_removeFunction` there.
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,
   @typescript-eslint/explicit-function-return-type,
   @typescript-eslint/no-unsafe-return -- see the TODO above */
export function wrapToArray(item) {
  return Array.isArray(item) ? item : [item];
}
