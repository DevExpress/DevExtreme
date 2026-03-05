import { each } from '@js/core/utils/iterator';
import { isDefined, isPrimitive } from '@js/core/utils/type';
import type { DataStructure } from '@js/ui/tree_view';
import errors from '@js/ui/widget/ui.errors';

export type ItemKey = string | number;

export interface ItemData {
  disabled?: boolean;
  expanded?: boolean;
  selected?: boolean;

  text?: string;
  visible?: boolean;
  key?: ItemKey;
  parentKey?: ItemKey;

  items?: ItemData[];
}

export interface InternalFields {
  disabled: boolean | undefined;
  expanded: boolean | undefined;
  selected: boolean | undefined;
  key: ItemKey;
  parentKey: ItemKey;
  item: ItemData;
  childrenKeys: ItemKey[];
  publicNode: PublicNode;
}

export interface InternalNode extends Omit<ItemData, 'items'> {
  internalFields: InternalFields;
}

export type PublicNode<T = ItemData> = T & {
  text: string;

  key: ItemKey;
  itemData: ItemData;
  parent: PublicNode | null;
  children: PublicNode[];
  items: PublicNode<T>[];
};

export interface DataAccessorGetters {
  key: (item: ItemData) => ItemKey;
  parentKey: (item: ItemData) => ItemKey | undefined;
  items: (item: ItemData) => ItemData[];
  disabled: (item: ItemData, options?: { defaultValue?: boolean }) => boolean;
  expanded: (item: ItemData, options?: { defaultValue?: boolean }) => boolean;
  selected: (item: ItemData, options?: { defaultValue?: boolean }) => boolean;
  display: (item: ItemData) => string;
}

export interface DataAccessorSetters {
  key: (item: ItemData, value: ItemKey) => void;
  disabled: (item: ItemData, value: boolean | undefined) => void;
  expanded: (item: ItemData, value: boolean | undefined) => void;
  selected: (item: ItemData, value: boolean | undefined) => void;
}

export interface DataAccessors {
  getters: DataAccessorGetters;
  setters: DataAccessorSetters;
}

class DataConverter {
  _dataStructure: (InternalNode | null)[] = [];

  private _itemsCount = 0;

  private _visibleItemsCount = 0;

  private _disabledItemsCount = 0;

  _indexByKey: Record<string | number, number> = {};

  private _dataAccessors!: DataAccessors;

  private _rootValue?: ItemKey;

  private _dataType?: DataStructure;

  _convertItemsToNodes(items: ItemData[], parentKey?: ItemKey): void {
    each(items, (_index: number, item: ItemData): void => {
      const parentId = isDefined(parentKey) ? parentKey : this._getParentId(item);
      const node = this._convertItemToNode(item, parentId);

      this._dataStructure.push(node);

      this._checkForDuplicateId(node.internalFields.key);
      this._indexByKey[node.internalFields.key] = this._dataStructure.length - 1;

      if (this._itemHasChildren(item)) {
        this._convertItemsToNodes(this._dataAccessors.getters.items(item), node.internalFields.key);
      }
    });
  }

  _checkForDuplicateId(key: ItemKey): void {
    if (isDefined(this._indexByKey[String(key)])) {
      throw errors.Error('E1040', key);
    }
  }

  _getParentId(item: ItemData): ItemKey | undefined {
    return this._dataType === 'plain' ? this._dataAccessors.getters.parentKey(item) : undefined;
  }

  _itemHasChildren(item: ItemData): boolean {
    if (this._dataType === 'plain') {
      return false;
    }
    const items = this._dataAccessors.getters.items(item);
    return Boolean(items?.length);
  }

  _getUniqueKey(item: ItemData): ItemKey {
    const keyGetter = this._dataAccessors.getters.key;
    const itemKey = keyGetter(item);
    const isCorrectKey = (itemKey || itemKey === 0) && isPrimitive(itemKey);

    return isCorrectKey ? itemKey : this.getItemsCount();
  }

  _convertItemToNode(item: ItemData, parentKey?: ItemKey): InternalNode {
    this._itemsCount += 1;

    const disabled = this._dataAccessors.getters.disabled(item, { defaultValue: false });
    const expanded = this._dataAccessors.getters.expanded(item, { defaultValue: false });
    const selected = this._dataAccessors.getters.selected(item, { defaultValue: false });

    if (item.visible !== false) {
      this._visibleItemsCount += 1;

      if (disabled) {
        this._disabledItemsCount += 1;
      }
    }

    const { items, ...itemWithoutItems } = item;

    const node = {
      internalFields: {
        disabled,
        expanded,
        selected,
        key: this._getUniqueKey(item),
        parentKey: isDefined(parentKey) ? parentKey : this._rootValue,
        item: this._makeObjectFromPrimitive(item),
        childrenKeys: [],
      },
      ...itemWithoutItems,
    };
    // @ts-expect-error
    return node;
  }

  setChildrenKeys(): void {
    each(this._dataStructure, (_index: number, node: InternalNode) => {
      if (node.internalFields.parentKey === this._rootValue) return;

      const parent = this.getParentNode(node);
      if (parent) {
        parent.internalFields.childrenKeys.push(node.internalFields.key);
      }
    });
  }

  _makeObjectFromPrimitive(item: ItemData | string | number | boolean): ItemData {
    if (isPrimitive(item)) {
      const key = item as ItemKey;
      const newItem: ItemData = {};
      this._dataAccessors.setters.key(newItem, key);
      return newItem;
    }
    return item;
  }

  _convertToPublicNode(node: InternalNode | null, parent: PublicNode | null): PublicNode | null {
    if (!node) {
      return null;
    }

    const publicNode: PublicNode = {
      text: this._dataAccessors.getters.display(node),
      key: node.internalFields.key,
      selected: node.internalFields.selected,
      expanded: node.internalFields.expanded,
      disabled: node.internalFields.disabled,
      parent: parent ?? null,
      itemData: node.internalFields.item,
      children: [],
      items: [],
    };

    if (publicNode.parent) {
      publicNode.parent.children.push(publicNode);
      publicNode.parent.items.push(publicNode);
    }

    return publicNode;
  }

  convertToPublicNodes(data: ItemKey[], parent: PublicNode | null): PublicNode[] {
    if (!data.length) return [];

    const publicNodes: PublicNode[] = [];

    each(data, (_index: number, node: ItemKey): void => {
      const internalNode = isPrimitive(node) ? this._getByKey(node) : node;

      if (!internalNode) {
        return;
      }

      const publicNode = this._convertToPublicNode(internalNode, parent);

      if (!publicNode) {
        return;
      }

      publicNode.children = this.convertToPublicNodes(
        internalNode.internalFields.childrenKeys,
        publicNode,
      );

      publicNodes.push(publicNode);

      internalNode.internalFields.publicNode = publicNode;
    });

    return publicNodes;
  }

  setDataAccessors(accessors: DataAccessors): void {
    this._dataAccessors = accessors;
  }

  _getByKey(key: ItemKey): InternalNode | null {
    return this._dataStructure[this.getIndexByKey(key)] ?? null;
  }

  getParentNode(node: InternalNode): InternalNode | null {
    return this._getByKey(node.internalFields.parentKey);
  }

  getByKey(data: (InternalNode | null)[], key: ItemKey): InternalNode | null {
    if (!isDefined(key)) {
      return null;
    }

    const findByKey = function findByKey(
      searchData: (InternalNode | null)[],
      searchKey: ItemKey,
    ): InternalNode | null {
      let result: InternalNode | null = null;

      each(searchData, (_index: number, element: InternalNode): boolean => {
        const currentElementKey = element.internalFields?.key ?? element.key;
        if (currentElementKey?.toString() === searchKey.toString()) {
          result = element;
          return false;
        }
        return true;
      });

      return result;
    };

    return findByKey(data, key);
  }

  getItemsCount(): number {
    return this._itemsCount;
  }

  getDisabledItemsCount(): number {
    return this._disabledItemsCount;
  }

  getVisibleItemsCount(): number {
    return this._visibleItemsCount;
  }

  updateIndexByKey(): void {
    this._indexByKey = {};
    each(this._dataStructure, (index: number, node: InternalNode): void => {
      this._checkForDuplicateId(node.internalFields.key);
      this._indexByKey[node.internalFields.key] = index;
    });
  }

  updateChildrenKeys(): void {
    this._indexByKey = {};
    this.removeChildrenKeys();
    this.updateIndexByKey();
    this.setChildrenKeys();
  }

  removeChildrenKeys(): void {
    this._indexByKey = {};
    each(this._dataStructure, (_index: number, node: InternalNode): void => {
      node.internalFields.childrenKeys = [];
    });
  }

  getIndexByKey(key: ItemKey): number {
    return this._indexByKey[key];
  }

  createPlainStructure(
    items: ItemData[],
    rootValue: ItemKey,
    dataType: DataStructure | undefined,
  ): (InternalNode | null)[] {
    this._itemsCount = 0;
    this._visibleItemsCount = 0;
    this._disabledItemsCount = 0;
    this._rootValue = rootValue;
    this._dataType = dataType;
    this._indexByKey = {};
    this._convertItemsToNodes(items);
    this.setChildrenKeys();

    return this._dataStructure;
  }
}

export default DataConverter;
