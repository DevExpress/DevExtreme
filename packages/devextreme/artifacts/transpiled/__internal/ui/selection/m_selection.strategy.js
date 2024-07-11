"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _type = require("../../../core/utils/type");
var _query = _interopRequireDefault(require("../../../data/query"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class SelectionStrategy {
  constructor(options) {
    this.options = options;
    this._setOption('disabledItemKeys', []);
    this._clearItemKeys();
  }
  _clearItemKeys() {
    this._setOption('addedItemKeys', []);
    this._setOption('removedItemKeys', []);
    this._setOption('removedItems', []);
    this._setOption('addedItems', []);
  }
  validate() {}
  _setOption(name, value) {
    this.options[name] = value;
  }
  onSelectionChanged() {
    const {
      addedItemKeys
    } = this.options;
    const {
      removedItemKeys
    } = this.options;
    const {
      addedItems
    } = this.options;
    const {
      removedItems
    } = this.options;
    const {
      selectedItems
    } = this.options;
    const {
      selectedItemKeys
    } = this.options;
    const onSelectionChanged = this.options.onSelectionChanged || _common.noop;
    this._clearItemKeys();
    onSelectionChanged({
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems
    });
  }
  equalKeys(key1, key2) {
    if (this.options.equalByReference) {
      if ((0, _type.isObject)(key1) && (0, _type.isObject)(key2)) {
        return key1 === key2;
      }
    }
    return (0, _common.equalByValue)(key1, key2);
  }
  getSelectableItems(items) {
    return items.filter(item => !(item !== null && item !== void 0 && item.disabled));
  }
  _clearSelection(keys, preserve, isDeselect, isSelectAll) {
    keys = keys || [];
    keys = Array.isArray(keys) ? keys : [keys];
    this.validate();
    // @ts-expect-error
    return this.selectedItemKeys(keys, preserve, isDeselect, isSelectAll);
  }
  _removeTemplateProperty(remoteFilter) {
    if (Array.isArray(remoteFilter)) {
      return remoteFilter.map(f => this._removeTemplateProperty(f));
    }
    if ((0, _type.isObject)(remoteFilter)) {
      delete remoteFilter.template;
    }
    return remoteFilter;
  }
  _loadFilteredData(remoteFilter, localFilter, select, isSelectAll) {
    const filterLength = encodeURI(JSON.stringify(this._removeTemplateProperty(remoteFilter))).length;
    const needLoadAllData = this.options.maxFilterLengthInRequest && filterLength > this.options.maxFilterLengthInRequest;
    const deferred = (0, _deferred.Deferred)();
    const loadOptions = {
      filter: needLoadAllData ? undefined : remoteFilter,
      select: needLoadAllData ? this.options.dataFields() : select || this.options.dataFields()
    };
    if (remoteFilter && remoteFilter.length === 0) {
      deferred.resolve([]);
    } else {
      this.options.load(loadOptions).done(items => {
        let filteredItems = (0, _type.isPlainObject)(items) ? items.data : items;
        if (localFilter && !isSelectAll) {
          filteredItems = filteredItems.filter(localFilter);
        } else if (needLoadAllData) {
          filteredItems = (0, _query.default)(filteredItems).filter(remoteFilter).toArray();
        }
        deferred.resolve(filteredItems);
      }).fail(deferred.reject.bind(deferred));
    }
    return deferred;
  }
  updateSelectedItemKeyHash(keys) {
    for (let i = 0; i < keys.length; i++) {
      const keyHash = (0, _common.getKeyHash)(keys[i]);
      if (!(0, _type.isObject)(keyHash)) {
        this.options.keyHashIndices[keyHash] = this.options.keyHashIndices[keyHash] || [];
        const keyIndices = this.options.keyHashIndices[keyHash];
        keyIndices.push(i);
      }
    }
  }
  _isAnyItemSelected(items) {
    for (let i = 0; i < items.length; i++) {
      if (this.options.isItemSelected(items[i])) {
        return undefined;
      }
    }
    return false;
  }
  _getFullSelectAllState() {
    const items = this.options.plainItems();
    const dataFilter = this.options.filter();
    let selectedItems = this.options.ignoreDisabledItems ? this.options.selectedItems : this.options.selectedItems.filter(item => !(item !== null && item !== void 0 && item.disabled));
    if (dataFilter) {
      selectedItems = (0, _query.default)(selectedItems).filter(dataFilter).toArray();
    }
    const selectedItemsLength = selectedItems.length;
    const disabledItemsLength = items.length - this.getSelectableItems(items).length;
    if (!selectedItemsLength) {
      return this._isAnyItemSelected(items);
    }
    if (selectedItemsLength >= this.options.totalCount() - disabledItemsLength) {
      return true;
    }
    return undefined;
  }
  _getVisibleSelectAllState() {
    const items = this.getSelectableItems(this.options.plainItems());
    let hasSelectedItems = false;
    let hasUnselectedItems = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemData = this.options.getItemData(item);
      const key = this.options.keyOf(itemData);
      if (this.options.isSelectableItem(item)) {
        // @ts-expect-error
        if (this.isItemKeySelected(key)) {
          hasSelectedItems = true;
        } else {
          hasUnselectedItems = true;
        }
      }
    }
    if (hasSelectedItems) {
      return !hasUnselectedItems ? true : undefined;
    }
    return false;
  }
}
exports.default = SelectionStrategy;