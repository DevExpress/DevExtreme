"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../../core/class"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _query = _interopRequireDefault(require("../../../data/query"));
var _store_helper = _interopRequireDefault(require("../../../data/store_helper"));
var _text_box = _interopRequireDefault(require("../../../ui/text_box"));
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _ui2 = _interopRequireDefault(require("../../../ui/widget/ui.search_box_mixin"));
var _m_data_converter = _interopRequireDefault(require("./m_data_converter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const EXPANDED = 'expanded';
const SELECTED = 'selected';
const DISABLED = 'disabled';
// @ts-expect-error
_ui2.default.setEditorClass(_text_box.default);
const DataAdapter = _class.default.inherit({
  ctor(options) {
    this.options = {};
    (0, _extend.extend)(this.options, this._defaultOptions(), options);
    this.options.dataConverter.setDataAccessors(this.options.dataAccessors);
    this._selectedNodesKeys = [];
    this._expandedNodesKeys = [];
    this._dataStructure = [];
    this._createInternalDataStructure();
    this.getTreeNodes();
  },
  setOption(name, value) {
    this.options[name] = value;
    if (name === 'recursiveSelection') {
      this._updateSelection();
    }
  },
  _defaultOptions() {
    return {
      dataAccessors: undefined,
      items: [],
      multipleSelection: true,
      recursiveSelection: false,
      recursiveExpansion: false,
      rootValue: 0,
      searchValue: '',
      dataType: 'tree',
      searchMode: 'contains',
      dataConverter: new _m_data_converter.default(),
      onNodeChanged: _common.noop,
      sort: null
    };
  },
  _createInternalDataStructure() {
    this._initialDataStructure = this.options.dataConverter.createPlainStructure(this.options.items, this.options.rootValue, this.options.dataType);
    this._dataStructure = this.options.searchValue.length ? this.search(this.options.searchValue) : this._initialDataStructure;
    this.options.dataConverter._dataStructure = this._dataStructure;
    this._updateSelection();
    this._updateExpansion();
  },
  _updateSelection() {
    if (this.options.recursiveSelection) {
      this._setChildrenSelection();
      this._setParentSelection();
    }
    this._selectedNodesKeys = this._updateNodesKeysArray(SELECTED);
  },
  _updateExpansion(key) {
    if (this.options.recursiveExpansion) {
      key ? this._updateOneBranch(key) : this._setParentExpansion();
    }
    this._expandedNodesKeys = this._updateNodesKeysArray(EXPANDED);
  },
  _updateNodesKeysArray(property) {
    const that = this;
    let array = [];
    (0, _iterator.each)(that._getDataBySelectionMode(), (_, node) => {
      if (!that._isNodeVisible(node)) {
        return;
      }
      if (node.internalFields[property]) {
        if (property === EXPANDED || that.options.multipleSelection) {
          // @ts-expect-error
          array.push(node.internalFields.key);
        } else {
          array.length && that.toggleSelection(array[0], false, true);
          // @ts-expect-error
          array = [node.internalFields.key];
        }
      }
    });
    return array;
  },
  _getDataBySelectionMode() {
    return this.options.multipleSelection ? this.getData() : this.getFullData();
  },
  _isNodeVisible(node) {
    return node.internalFields.item.visible !== false;
  },
  _getByKey(data, key) {
    return data === this._dataStructure ? this.options.dataConverter._getByKey(key) : this.options.dataConverter.getByKey(data, key);
  },
  _setChildrenSelection() {
    const that = this;
    (0, _iterator.each)(this._dataStructure, (_, node) => {
      if (!node.internalFields.childrenKeys.length) {
        return;
      }
      const isSelected = node.internalFields.selected;
      isSelected === true && that._toggleChildrenSelection(node, isSelected);
    });
  },
  _setParentSelection() {
    const that = this;
    (0, _iterator.each)(this._dataStructure, (_, node) => {
      const parent = that.options.dataConverter.getParentNode(node);
      if (parent && node.internalFields.parentKey !== that.options.rootValue) {
        that._iterateParents(node, parent => {
          const newParentState = that._calculateSelectedState(parent);
          that._setFieldState(parent, SELECTED, newParentState);
        });
      }
    });
  },
  _setParentExpansion() {
    const that = this;
    (0, _iterator.each)(this._dataStructure, (_, node) => {
      if (!node.internalFields.expanded) {
        return;
      }
      that._updateOneBranch(node.internalFields.key);
    });
  },
  _updateOneBranch(key) {
    const that = this;
    const node = this.getNodeByKey(key);
    that._iterateParents(node, parent => {
      that._setFieldState(parent, EXPANDED, true);
    });
  },
  _iterateChildren(node, recursive, callback, processedKeys) {
    if (!(0, _type.isFunction)(callback)) {
      return;
    }
    const that = this;
    const nodeKey = node.internalFields.key;
    processedKeys = processedKeys || [];
    if (processedKeys.indexOf(nodeKey) === -1) {
      processedKeys.push(nodeKey);
      (0, _iterator.each)(node.internalFields.childrenKeys, (_, key) => {
        const child = that.getNodeByKey(key);
        callback(child);
        if (child.internalFields.childrenKeys.length && recursive) {
          that._iterateChildren(child, recursive, callback, processedKeys);
        }
      });
    }
  },
  _iterateParents(node, callback, processedKeys) {
    if (node.internalFields.parentKey === this.options.rootValue || !(0, _type.isFunction)(callback)) {
      return;
    }
    processedKeys = processedKeys || [];
    const {
      key
    } = node.internalFields;
    if (processedKeys.indexOf(key) === -1) {
      processedKeys.push(key);
      const parent = this.options.dataConverter.getParentNode(node);
      if (parent) {
        callback(parent);
        if (parent.internalFields.parentKey !== this.options.rootValue) {
          this._iterateParents(parent, callback, processedKeys);
        }
      }
    }
  },
  _calculateSelectedState(node) {
    const itemsCount = node.internalFields.childrenKeys.length;
    let selectedItemsCount = 0;
    let invisibleItemsCount = 0;
    let result = false;
    for (let i = 0; i <= itemsCount - 1; i++) {
      const childNode = this.getNodeByKey(node.internalFields.childrenKeys[i]);
      const isChildInvisible = childNode.internalFields.item.visible === false;
      const childState = childNode.internalFields.selected;
      if (isChildInvisible) {
        invisibleItemsCount++;
        continue;
      }
      if (childState) {
        selectedItemsCount++;
      } else if (childState === undefined) {
        selectedItemsCount += 0.5;
      }
    }
    if (selectedItemsCount) {
      // @ts-expect-error
      result = selectedItemsCount === itemsCount - invisibleItemsCount ? true : undefined;
    }
    return result;
  },
  _toggleChildrenSelection(node, state) {
    const that = this;
    this._iterateChildren(node, true, child => {
      if (that._isNodeVisible(child)) {
        that._setFieldState(child, SELECTED, state);
      }
    });
  },
  _setFieldState(node, field, state) {
    if (node.internalFields[field] === state) {
      return;
    }
    node.internalFields[field] = state;
    if (node.internalFields.publicNode) {
      node.internalFields.publicNode[field] = state;
    }
    this.options.dataAccessors.setters[field](node.internalFields.item, state);
    this.options.onNodeChanged(node);
  },
  _markChildren(keys) {
    const that = this;
    (0, _iterator.each)(keys, (_, key) => {
      const index = that.getIndexByKey(key);
      const node = that.getNodeByKey(key);
      that._dataStructure[index] = 0;
      node.internalFields.childrenKeys.length && that._markChildren(node.internalFields.childrenKeys);
    });
  },
  _removeNode(key) {
    const node = this.getNodeByKey(key);
    this._dataStructure[this.getIndexByKey(key)] = 0;
    this._markChildren(node.internalFields.childrenKeys);
    const that = this;
    let counter = 0;
    const items = (0, _extend.extend)([], this._dataStructure);
    (0, _iterator.each)(items, (index, item) => {
      if (!item) {
        // @ts-expect-error
        that._dataStructure.splice(index - counter, 1);
        counter++;
      }
    });
  },
  _addNode(item) {
    const {
      dataConverter
    } = this.options;
    const node = dataConverter._convertItemToNode(item, this.options.dataAccessors.getters.parentKey(item));
    this._dataStructure = this._dataStructure.concat(node);
    this._initialDataStructure = this._initialDataStructure.concat(node);
    dataConverter._dataStructure = dataConverter._dataStructure.concat(node);
  },
  _updateFields() {
    this.options.dataConverter.updateChildrenKeys();
    this._updateSelection();
    this._updateExpansion();
  },
  getSelectedNodesKeys() {
    return this._selectedNodesKeys;
  },
  getExpandedNodesKeys() {
    return this._expandedNodesKeys;
  },
  getData() {
    return this._dataStructure;
  },
  getFullData() {
    return this._initialDataStructure;
  },
  getNodeByItem(item) {
    let result = null;
    // @ts-expect-error
    (0, _iterator.each)(this._dataStructure, (_, node) => {
      if (node.internalFields.item === item) {
        result = node;
        return false;
      }
    });
    return result;
  },
  getNodesByItems(items) {
    const that = this;
    const nodes = [];
    (0, _iterator.each)(items, (_, item) => {
      const node = that.getNodeByItem(item);
      // @ts-expect-error
      node && nodes.push(node);
    });
    return nodes;
  },
  getNodeByKey(key, data) {
    return this._getByKey(data || this._getDataBySelectionMode(), key);
  },
  getTreeNodes() {
    return this.options.dataConverter.convertToPublicNodes(this.getRootNodes());
  },
  getItemsCount() {
    return this.options.dataConverter.getItemsCount();
  },
  getVisibleItemsCount() {
    return this.options.dataConverter.getVisibleItemsCount();
  },
  getPublicNode(node) {
    return node.internalFields.publicNode;
  },
  getRootNodes() {
    return this.getChildrenNodes(this.options.rootValue);
  },
  getChildrenNodes(parentKey) {
    return (0, _query.default)(this._dataStructure, {
      langParams: this.options.langParams
    }).filter(['internalFields.parentKey', parentKey]).toArray();
  },
  getIndexByKey(key) {
    return this.options.dataConverter.getIndexByKey(key);
  },
  addItem(item) {
    this._addNode(item);
    this._updateFields();
  },
  removeItem(key) {
    this._removeNode(key);
    this._updateFields();
  },
  toggleSelection(key, state, selectRecursive) {
    const isSingleModeUnselect = this._isSingleModeUnselect(state);
    const node = this._getByKey(selectRecursive || isSingleModeUnselect ? this._initialDataStructure : this._dataStructure, key);
    this._setFieldState(node, SELECTED, state);
    if (this.options.recursiveSelection && !selectRecursive) {
      state ? this._setChildrenSelection() : this._toggleChildrenSelection(node, state);
      this._setParentSelection();
    }
    this._selectedNodesKeys = this._updateNodesKeysArray(SELECTED);
  },
  _isSingleModeUnselect(selectionState) {
    return !this.options.multipleSelection && !selectionState;
  },
  toggleNodeDisabledState(key, state) {
    const node = this.getNodeByKey(key);
    this._setFieldState(node, DISABLED, state);
  },
  toggleSelectAll(state) {
    if (!(0, _type.isDefined)(state)) {
      return;
    }
    const that = this;
    const lastSelectedKey = that._selectedNodesKeys[that._selectedNodesKeys.length - 1];
    const dataStructure = that._isSingleModeUnselect(state) ? this._initialDataStructure : this._dataStructure;
    (0, _iterator.each)(dataStructure, (index, node) => {
      if (!that._isNodeVisible(node)) {
        return;
      }
      that._setFieldState(node, SELECTED, state);
    });
    that._selectedNodesKeys = that._updateNodesKeysArray(SELECTED);
    if (!state && that.options.selectionRequired) {
      that.toggleSelection(lastSelectedKey, true);
    }
  },
  isAllSelected() {
    if (this.getSelectedNodesKeys().length) {
      return this.getSelectedNodesKeys().length === this.getVisibleItemsCount() ? true : undefined;
    }
    return false;
  },
  toggleExpansion(key, state) {
    const node = this.getNodeByKey(key);
    this._setFieldState(node, EXPANDED, state);
    if (state) {
      this._updateExpansion(key);
    }
    this._expandedNodesKeys = this._updateNodesKeysArray(EXPANDED);
  },
  isFiltered(item) {
    return !this.options.searchValue.length || !!this._filterDataStructure(this.options.searchValue, [item]).length;
  },
  _createCriteria(selector, value, operation) {
    const searchFilter = [];
    if (!Array.isArray(selector)) {
      return [selector, operation, value];
    }
    (0, _iterator.each)(selector, (i, item) => {
      // @ts-expect-error
      searchFilter.push([item, operation, value], 'or');
    });
    searchFilter.pop();
    return searchFilter;
  },
  _filterDataStructure(filterValue, dataStructure) {
    const selector = this.options.searchExpr || this.options.dataAccessors.getters.display;
    // @ts-expect-error
    const operation = _ui2.default.getOperationBySearchMode(this.options.searchMode);
    const criteria = this._createCriteria(selector, filterValue, operation);
    dataStructure = dataStructure || this._initialDataStructure;
    return (0, _query.default)(dataStructure, {
      langParams: this.options.langParams
    }).filter(criteria).toArray();
  },
  search(searchValue) {
    const that = this;
    let matches = this._filterDataStructure(searchValue);
    const {
      dataConverter
    } = this.options;
    function lookForParents(matches, index) {
      const {
        length
      } = matches;
      while (index < length) {
        const node = matches[index];
        if (node.internalFields.parentKey === that.options.rootValue) {
          index++;
          continue;
        }
        const parent = dataConverter.getParentNode(node);
        if (!parent) {
          _ui.default.log('W1007', node.internalFields.parentKey, node.internalFields.key);
          index++;
          continue;
        }
        if (!parent.internalFields.expanded) {
          that._setFieldState(parent, EXPANDED, true);
        }
        if (matches.includes(parent)) {
          index++;
          continue;
        }
        matches.splice(index, 0, parent);
        lookForParents(matches, index);
      }
    }
    lookForParents(matches, 0);
    if (this.options.sort) {
      matches = _store_helper.default.queryByOptions((0, _query.default)(matches), {
        sort: this.options.sort,
        langParams: this.options.langParams
      }).toArray();
    }
    dataConverter._indexByKey = {};
    (0, _iterator.each)(matches, (index, node) => {
      node.internalFields.childrenKeys = [];
      dataConverter._indexByKey[node.internalFields.key] = index;
    });
    dataConverter._dataStructure = matches;
    dataConverter.setChildrenKeys();
    return dataConverter._dataStructure;
  }
});
var _default = exports.default = DataAdapter;