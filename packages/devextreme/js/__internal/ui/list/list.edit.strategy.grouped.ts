import query from '@js/common/data/query';
import storeHelper from '@js/common/data/store_helper';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { isNumeric } from '@js/core/utils/type';
import type { Item } from '@js/ui/list';
import type { CollectionItemKey } from '@ts/ui/collection/collection_widget.base';
import { indexExists, NOT_EXISTING_INDEX } from '@ts/ui/collection/collection_widget.edit';
import type { CollectionGroupedItemIndex, CollectionItemIndex } from '@ts/ui/collection/collection_widget.edit.strategy';
import EditStrategy from '@ts/ui/collection/collection_widget.edit.strategy.plain';

const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_GROUP_CLASS = 'dx-list-group';

const SELECTION_SHIFT = 20;
// eslint-disable-next-line no-bitwise
const SELECTION_MASK = (1 << SELECTION_SHIFT) - 1;

export type GroupedItem = Item & {
  items?: Item[];
};

const combineIndex = (
  index: CollectionGroupedItemIndex,
// eslint-disable-next-line no-bitwise
): number => (index.group << SELECTION_SHIFT) + index.item;

const splitIndex = (combinedIndex: number): CollectionGroupedItemIndex => ({
  // eslint-disable-next-line no-bitwise
  group: combinedIndex >> SELECTION_SHIFT,
  // eslint-disable-next-line no-bitwise
  item: combinedIndex & SELECTION_MASK,
});

class GroupedEditStrategy extends EditStrategy<GroupedItem, CollectionItemKey> {
  _groupElements(): dxElementWrapper {
    return this._collectionWidget._itemContainer().find(`.${LIST_GROUP_CLASS}`);
  }

  _groupItemElements($group: dxElementWrapper): dxElementWrapper {
    return $group.find(`.${LIST_ITEM_CLASS}`);
  }

  getIndexByItemData(itemData: GroupedItem): CollectionItemIndex {
    const groups = this._getItems();
    let index: CollectionItemIndex = NOT_EXISTING_INDEX;

    if (!itemData) return NOT_EXISTING_INDEX;

    const { items = [] } = itemData;

    if (items.length) {
      // eslint-disable-next-line prefer-destructuring, no-param-reassign
      itemData = items[0];
    }
    each(groups, (groupIndex: number, group: GroupedItem): boolean => {
      if (!group.items) return false;

      each(group.items, (itemIndex: number, item: GroupedItem): boolean => {
        if (item !== itemData) {
          return true;
        }
        index = {
          group: groupIndex,
          item: itemIndex,
        };

        return false;
      });

      return !indexExists(index);
    });

    return index;
  }

  _isIndexNumeric(index: CollectionItemIndex): index is number {
    return isNumeric(index);
  }

  getItemDataByIndex(index: CollectionItemIndex): GroupedItem {
    const groups = this._getItems();

    if (this._isIndexNumeric(index)) {
      return this.itemsGetter()[index];
    }

    const groupIndex = index.group;
    const group = groups[groupIndex];

    const { items = [] } = group;

    return (index && items[index.item]) || null;
  }

  itemsGetter(): GroupedItem[] {
    let resultItems: GroupedItem[] = [];
    const items = this._getItems();

    items.forEach((groupedItem: GroupedItem): void => {
      if (groupedItem.items) {
        resultItems = resultItems.concat(groupedItem.items);
      } else {
        resultItems.push(groupedItem);
      }
    });

    return resultItems;
  }

  deleteItemAtIndex(index: number): void {
    const indices = splitIndex(index);
    const { items = [] } = this._collectionWidget.option();
    const itemGroup = items[indices.group].items;

    itemGroup?.splice(indices.item, 1);
  }

  getKeysByItems(items: GroupedItem[]): CollectionItemKey[] {
    const plainItems = items.reduce((counter: GroupedItem[], item: GroupedItem) => {
      if (item?.items) {
        return counter.concat(item.items);
      }
      counter.push(item);
      return counter;
    }, []);

    return plainItems.map(
      (plainItem: GroupedItem) => this._collectionWidget.keyOf(plainItem),
    );
  }

  getIndexByKey(key: CollectionItemKey, items?: GroupedItem[]): number {
    const { items: userItems } = this._collectionWidget.option();
    const groups = items ?? userItems;
    let index: CollectionItemIndex = -1;
    each(groups, (groupIndex: number, group: GroupedItem) => {
      if (!group.items) return undefined;
      each(group.items, (itemIndex: number, item: GroupedItem) => {
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

  _getGroups(items: GroupedItem[]): GroupedItem[] {
    const dataController = this._collectionWidget._dataController;
    const group = dataController.group();

    if (group) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return storeHelper.queryByOptions(query(items), { group }).toArray();
    }

    const { items: userItems = [] } = this._collectionWidget.option();

    return userItems;
  }

  getItemsByKeys(keys: CollectionItemKey[], items: GroupedItem[]): GroupedItem[] {
    const result: GroupedItem[] = [];
    const groups = this._getGroups(items);
    const groupItemByKeyMap: Record<string, GroupedItem> = {};

    const getItemMeta = (
      key: CollectionItemKey,
    ): { groupKey: string; item: GroupedItem } | undefined => {
      const index = this.getIndexByKey(key, groups);
      const splitIdx = splitIndex(index);
      const group = splitIdx && groups[splitIdx.group];

      if (!group) return undefined;

      return {
        groupKey: String(group.key),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        item: group.items![splitIdx.item],
      };
    };

    each(keys, (_index: number, key: CollectionItemKey): void => {
      const itemMeta = getItemMeta(key);

      if (!itemMeta) return;

      const { groupKey, item } = itemMeta;

      let selectedGroup = groupItemByKeyMap[groupKey];
      if (!selectedGroup) {
        selectedGroup = { key: groupKey, items: [] };
        groupItemByKeyMap[groupKey] = selectedGroup;
        result.push(selectedGroup);
      }

      selectedGroup.items?.push(item);
    });

    return result;
  }

  moveItemAtIndexToIndex(movingIndex: number, destinationIndex: number): void {
    const { items = [] } = this._collectionWidget.option();

    const movingIndices = splitIndex(movingIndex);
    const destinationIndices = splitIndex(destinationIndex);
    const movingItemGroup = items[movingIndices.group].items;
    const destinationItemGroup = items[destinationIndices.group].items;

    if (movingItemGroup) {
      const movedItemData = movingItemGroup?.[movingIndices.item];

      movingItemGroup?.splice(movingIndices.item, 1);
      destinationItemGroup?.splice(destinationIndices.item, 0, movedItemData);
    }
  }

  _isItemIndex(
    index: CollectionGroupedItemIndex,
  ): index is CollectionGroupedItemIndex {
    return Boolean(index && isNumeric(index.group) && isNumeric(index.item));
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

  _normalizeItemIndex(index: CollectionGroupedItemIndex): number {
    return combineIndex(index);
  }

  _denormalizeItemIndex(index: number): CollectionGroupedItemIndex {
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
