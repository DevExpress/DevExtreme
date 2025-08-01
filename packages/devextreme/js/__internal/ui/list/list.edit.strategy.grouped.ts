import query from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { isNumeric } from '@js/core/utils/type';
import type { Item } from '@js/ui/list';
import type { CollectionItemIndex } from '@ts/ui/collection/collection_widget.edit.strategy';
import EditStrategy from '@ts/ui/collection/collection_widget.edit.strategy.plain';

const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_GROUP_CLASS = 'dx-list-group';

const SELECTION_SHIFT = 20;
// eslint-disable-next-line no-bitwise
const SELECTION_MASK = (1 << SELECTION_SHIFT) - 1;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GroupedItem = {
  [key: string]: unknown;
  key?: unknown;
  items?: unknown[];
};

const combineIndex = (
  indices: { group: number; item: number },
// eslint-disable-next-line no-bitwise
): number => (indices.group << SELECTION_SHIFT) + indices.item;

const splitIndex = (combinedIndex: number): { group: number; item: number } => ({
  // eslint-disable-next-line no-bitwise
  group: combinedIndex >> SELECTION_SHIFT,
  // eslint-disable-next-line no-bitwise
  item: combinedIndex & SELECTION_MASK,
});
class GroupedEditStrategy extends EditStrategy<Item> {
  _groupElements(): dxElementWrapper {
    return this._collectionWidget._itemContainer().find(`.${LIST_GROUP_CLASS}`);
  }

  _groupItemElements($group: dxElementWrapper): dxElementWrapper {
    return $group.find(`.${LIST_ITEM_CLASS}`);
  }

  getIndexByItemData(itemData: Item): number {
    const groups = this._getItems();
    let index = false;
    // @ts-expect-error ts-error
    if (!itemData) return false;
    // @ts-expect-error ts-error
    if (itemData.items?.length) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      itemData = itemData.items[0];
    }
    // @ts-expect-error ts-error
    // eslint-disable-next-line consistent-return
    each(groups, (groupIndex: number, group: GroupedItem) => {
      if (!group.items) return false;

      each(group.items, (itemIndex: number, item: Item): boolean => {
        if (item !== itemData) {
          return true;
        }
        // @ts-expect-error ts-error
        index = {
          group: groupIndex,
          item: itemIndex,
        };

        return false;
      });

      if (index) {
        return false;
      }
    });
    // @ts-expect-error ts-error
    return index;
  }

  getItemDataByIndex(index: CollectionItemIndex): Item {
    const items = this._getItems();

    if (isNumeric(index)) {
      return this.itemsGetter()[index];
    }
    // @ts-expect-error ts-error
    return ((index && items[index.group]?.items[index.item]) || null) as Item;
  }

  itemsGetter(): Item[] {
    let resultItems: Item[] = [];
    const items = this._getItems();

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < items.length; i += 1) {
      if ((items[i] as GroupedItem)?.items) {
        resultItems = resultItems.concat((items[i] as GroupedItem).items as Item[]);
      } else {
        resultItems.push(items[i]);
      }
    }
    return resultItems;
  }

  deleteItemAtIndex(index: number): void {
    const indices = splitIndex(index);
    const itemGroup = this._collectionWidget.option('items')[indices.group].items;

    itemGroup.splice(indices.item, 1);
  }

  getKeysByItems(items: unknown[]): (string | number)[] {
    const plainItems = items.reduce((counter: unknown[], item) => {
      if ((item as GroupedItem)?.items) {
        return counter.concat((item as GroupedItem).items as unknown[]);
      }
      counter.push(item);
      return counter;
    }, []);

    return plainItems.map(
      // @ts-expect-error ts-error
      (plainItem) => this._collectionWidget.keyOf(plainItem) as string | number,
    );
  }

  getIndexByKey(key: string | number, items?: unknown[]): number {
    const groups = items ?? this._collectionWidget.option('items');
    let index: CollectionItemIndex = -1;
    each(groups, (groupIndex: number, group: GroupedItem) => {
      if (!group.items) return undefined;
      each(group.items, (itemIndex: number, item: unknown) => {
        // @ts-expect-error ts-error
        const itemKey = this._collectionWidget.keyOf(item);
        if (this._equalKeys(itemKey, key)) {
          index = {
            group: groupIndex,
            item: itemIndex,
          };
          return false;
        }
        return undefined;
      });

      if (index !== -1) {
        return false;
      }
      return undefined;
    });

    return typeof index === 'object' ? combineIndex(index) : index;
  }

  _getGroups(items: unknown): unknown {
    const dataController = this._collectionWidget._dataController;
    const group = (dataController as unknown as { group: () => unknown }).group();

    if (group) {
      // @ts-expect-error ts-error
      return storeHelper.queryByOptions(query(items), { group }).toArray();
    }

    return this._collectionWidget.option('items');
  }

  getItemsByKeys(keys: (string | number)[], items?: Item[]): Item[] {
    const result: Item[] = [];
    const groups = this._getGroups(items) as Item[];
    const groupItemByKeyMap: Record<string, Item> = {};

    const getItemMeta = (key: string | number): { groupKey: string; item: Item } | undefined => {
      const index = this.getIndexByKey(key, groups);
      const splitIdx = splitIndex(index);
      const group = splitIdx && groups[splitIdx.group];

      if (!group) return undefined;

      return {
        groupKey: String((group as GroupedItem).key),
        item: ((group as GroupedItem).items as Item[])[splitIdx.item],
      };
    };

    each(keys, (_index: number, key: string | number): undefined => {
      const itemMeta = getItemMeta(key);

      if (!itemMeta) return undefined;

      const { groupKey } = itemMeta;
      const { item } = itemMeta;

      let selectedGroup = groupItemByKeyMap[groupKey];
      if (!selectedGroup) {
        selectedGroup = { key: groupKey, items: [] } as Item;
        groupItemByKeyMap[groupKey] = selectedGroup;
        result.push(selectedGroup);
      }

      ((selectedGroup as unknown as GroupedItem).items as Item[]).push(item);
      return undefined;
    });

    return result;
  }

  moveItemAtIndexToIndex(movingIndex: number, destinationIndex: number): void {
    const items = this._collectionWidget.option('items');

    const movingIndices = splitIndex(movingIndex);
    const destinationIndices = splitIndex(destinationIndex);
    const movingItemGroup = items[movingIndices.group].items;
    const destinationItemGroup = items[destinationIndices.group].items;

    const movedItemData = movingItemGroup[movingIndices.item];

    movingItemGroup.splice(movingIndices.item, 1);
    destinationItemGroup.splice(destinationIndices.item, 0, movedItemData);
  }

  _isItemIndex(index: unknown): boolean {
    const idx = index as { group?: number; item?: number };
    return Boolean(index && isNumeric(idx.group) && isNumeric(idx.item));
  }

  _getNormalizedItemIndex(itemElement: Element): number {
    const $item = $(itemElement);
    const $group = $item.closest(`.${LIST_GROUP_CLASS}`);

    if (!$group.length) {
      return -1;
    }

    return combineIndex({
      group: this._groupElements().index($group),
      item: this._groupItemElements($group).index($item),
    });
  }

  _normalizeItemIndex(index: { group: number; item: number }): number {
    return combineIndex(index);
  }

  _denormalizeItemIndex(index: number): { group: number; item: number } {
    return splitIndex(index);
  }

  _getItemByNormalizedIndex(index: number): dxElementWrapper {
    const indices = splitIndex(index);
    const $group = this._groupElements().eq(indices.group);

    return this._groupItemElements($group).eq(indices.item);
  }

  _itemsFromSameParent(firstIndex: number, secondIndex: number): boolean {
    return splitIndex(firstIndex).group === splitIndex(secondIndex).group;
  }
}

export default GroupedEditStrategy;
