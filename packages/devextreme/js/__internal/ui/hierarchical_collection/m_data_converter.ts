import Class from '@js/core/class';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isPrimitive } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';

const DataConverter = Class.inherit({

  ctor() {
    this._dataStructure = [];
    this._itemsCount = 0;
    this._visibleItemsCount = 0;
  },

  _indexByKey: {},

  _convertItemsToNodes(items, parentKey) {
    const that = this;

    each(items, (_, item) => {
      const parentId = isDefined(parentKey) ? parentKey : that._getParentId(item);
      const node = that._convertItemToNode(item, parentId);

      that._dataStructure.push(node);

      that._checkForDuplicateId(node.internalFields.key);
      that._indexByKey[node.internalFields.key] = that._dataStructure.length - 1;

      if (that._itemHasChildren(item)) {
        that._convertItemsToNodes(that._dataAccessors.getters.items(item), node.internalFields.key);
      }
    });
  },

  _checkForDuplicateId(key) {
    if (isDefined(this._indexByKey[key])) {
      throw errors.Error('E1040', key);
    }
  },

  _getParentId(item) {
    return this._dataType === 'plain' ? this._dataAccessors.getters.parentKey(item) : undefined;
  },

  _itemHasChildren(item) {
    if (this._dataType === 'plain') {
      return;
    }
    const items = this._dataAccessors.getters.items(item);
    return items && items.length;
  },

  _getUniqueKey(item) {
    const keyGetter = this._dataAccessors.getters.key;
    const itemKey = keyGetter(item);
    const isCorrectKey = keyGetter && (itemKey || itemKey === 0) && isPrimitive(itemKey);

    return isCorrectKey ? itemKey : this.getItemsCount();
  },

  _convertItemToNode(item, parentKey) {
    this._itemsCount++;
    item.visible !== false && this._visibleItemsCount++;

    const that = this;
    const node = {
      internalFields: {
        disabled: that._dataAccessors.getters.disabled(item, { defaultValue: false }),
        expanded: that._dataAccessors.getters.expanded(item, { defaultValue: false }),
        selected: that._dataAccessors.getters.selected(item, { defaultValue: false }),
        key: that._getUniqueKey(item),
        parentKey: isDefined(parentKey) ? parentKey : that._rootValue,
        item: that._makeObjectFromPrimitive(item),
        childrenKeys: [],
      },
    };

    extend(node, item);
    // @ts-expect-error
    delete node.items;

    return node;
  },

  setChildrenKeys() {
    const that = this;

    each(this._dataStructure, (_, node) => {
      if (node.internalFields.parentKey === that._rootValue) return;

      const parent = that.getParentNode(node);
      parent && parent.internalFields.childrenKeys.push(node.internalFields.key);
    });
  },

  _makeObjectFromPrimitive(item) {
    if (isPrimitive(item)) {
      const key = item;
      item = {};
      this._dataAccessors.setters.key(item, key);
    }
    return item;
  },

  _convertToPublicNode(node, parent) {
    if (!node) {
      return null;
    }

    const publicNode = {
      text: this._dataAccessors.getters.display(node),
      key: node.internalFields.key,
      selected: node.internalFields.selected,
      expanded: node.internalFields.expanded,
      disabled: node.internalFields.disabled,
      parent: parent || null,
      itemData: node.internalFields.item,
      children: [],
      items: [],
    };

    if (publicNode.parent) {
      publicNode.parent.children.push(publicNode);
      publicNode.parent.items.push(publicNode);
    }

    return publicNode;
  },

  convertToPublicNodes(data, parent) {
    if (!data.length) return [];

    const that = this;
    const publicNodes = [];

    each(data, (_, node) => {
      node = isPrimitive(node) ? that._getByKey(node) : node;

      const publicNode = that._convertToPublicNode(node, parent);

      publicNode.children = that.convertToPublicNodes(node.internalFields.childrenKeys, publicNode);
      // @ts-expect-error
      publicNodes.push(publicNode);

      node.internalFields.publicNode = publicNode;
    });

    return publicNodes;
  },

  setDataAccessors(accessors) {
    this._dataAccessors = accessors;
  },

  _getByKey(key) {
    return this._dataStructure[this.getIndexByKey(key)] || null;
  },

  getParentNode(node) {
    return this._getByKey(node.internalFields.parentKey);
  },

  getByKey(data, key) {
    if (key === null || key === undefined) {
      return null;
    }

    let result = null;
    const that = this;

    const getByKey = function (data, key) {
      // @ts-expect-error
      each(data, (_, element) => {
        const currentElementKey = element.internalFields && element.internalFields.key || that._dataAccessors.getters.key(element);
        if (currentElementKey.toString() === key.toString()) {
          result = element;
          return false;
        }
      });

      return result;
    };

    return getByKey(data, key);
  },

  getItemsCount() {
    return this._itemsCount;
  },

  getVisibleItemsCount() {
    return this._visibleItemsCount;
  },

  updateIndexByKey() {
    const that = this;
    this._indexByKey = {};
    each(this._dataStructure, (index, node) => {
      that._checkForDuplicateId(node.internalFields.key);
      that._indexByKey[node.internalFields.key] = index;
    });
  },

  updateChildrenKeys() {
    this._indexByKey = {};
    this.removeChildrenKeys();
    this.updateIndexByKey();
    this.setChildrenKeys();
  },

  removeChildrenKeys() {
    this._indexByKey = {};
    each(this._dataStructure, (index, node) => {
      node.internalFields.childrenKeys = [];
    });
  },

  getIndexByKey(key) {
    return this._indexByKey[key];
  },

  createPlainStructure(items, rootValue, dataType) {
    this._itemsCount = 0;
    this._visibleItemsCount = 0;
    this._rootValue = rootValue;
    this._dataType = dataType;
    this._indexByKey = {};
    this._convertItemsToNodes(items);
    this.setChildrenKeys();

    return this._dataStructure;
  },

});

export default DataConverter;
