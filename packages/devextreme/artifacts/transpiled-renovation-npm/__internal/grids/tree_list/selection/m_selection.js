"use strict";

var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _m_selection = require("../../../grids/grid_core/selection/m_selection");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const TREELIST_SELECT_ALL_CLASS = 'dx-treelist-select-all';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
const nodeExists = function (array, currentKey) {
  return !!array.filter(key => key === currentKey).length;
};
const data = Base => class DataSelectionTreeListExtender extends (0, _m_selection.dataSelectionExtenderMixin)(Base) {
  _handleDataChanged(e) {
    // @ts-expect-error
    const isRecursiveSelection = this._selectionController.isRecursiveSelection();
    if (isRecursiveSelection && (!e || e.changeType !== 'updateSelectionState')) {
      // @ts-expect-error
      this._selectionController.updateSelectionState({
        selectedItemKeys: this.option('selectedRowKeys')
      });
    }
    super._handleDataChanged.apply(this, arguments);
  }
  loadDescendants() {
    const that = this;
    // @ts-expect-error
    const d = super.loadDescendants.apply(that, arguments);
    // @ts-expect-error
    const isRecursiveSelection = this._selectionController.isRecursiveSelection();
    if (isRecursiveSelection) {
      d.done(() => {
        // @ts-expect-error
        this._selectionController.updateSelectionState({
          selectedItemKeys: that.option('selectedRowKeys')
        });
      });
    }
    return d;
  }
};
const selection = Base => class SelectionControllerTreeListExtender extends Base {
  constructor() {
    super(...arguments);
    this._updateSelectColumn = _common.noop;
  }
  init() {
    super.init.apply(this, arguments);
    this._selectionStateByKey = {};
  }
  _getSelectionConfig() {
    const config = super._getSelectionConfig.apply(this, arguments);
    const {
      plainItems
    } = config;
    config.plainItems = cached => {
      let result;
      if (cached) {
        result = this._dataController.getCachedStoreData();
      }
      result || (result = plainItems.apply(this, arguments).map(item => item.data));
      return result || [];
    };
    config.isItemSelected = item => {
      const key = this._dataController.keyOf(item);
      return this.isRowSelected(key);
    };
    config.isSelectableItem = item => !!item;
    config.getItemData = item => item;
    // @ts-expect-error
    config.allowLoadByRange = undefined;
    return config;
  }
  renderSelectCheckBoxContainer($container, model) {
    const that = this;
    const rowsView = that.component.getView('rowsView');
    // @ts-expect-error
    const $checkbox = rowsView._renderSelectCheckBox($container, {
      value: model.row.isSelected,
      row: model.row,
      column: model.column
    });
    // @ts-expect-error
    rowsView._attachCheckBoxClickEvent($checkbox);
  }
  _getSelectAllNodeKeys() {
    const {
      component
    } = this;
    // @ts-expect-error
    const root = component.getRootNode();
    const cache = {};
    const keys = [];
    const isRecursiveSelection = this.isRecursiveSelection();
    root && _m_core.default.foreachNodes(root.children, node => {
      if (node.key !== undefined && (node.visible || isRecursiveSelection)) {
        keys.push(node.key);
      }
      if (!node.visible) {
        return true;
      }
      // @ts-expect-error
      return isRecursiveSelection ? false : component.isRowExpanded(node.key, cache);
    });
    return keys;
  }
  isSelectAll() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const selectedRowKeys = this.option('selectedRowKeys') || [];
    if (selectedRowKeys.length === 0) return false;
    const {
      component
    } = this;
    const visibleKeys = this._getSelectAllNodeKeys();
    const isRecursiveSelection = this.isRecursiveSelection();
    let hasIndeterminateState = false;
    const selectedVisibleKeys = visibleKeys.filter(key => {
      // @ts-expect-error
      const isRowSelected = component.isRowSelected(key, isRecursiveSelection);
      if (isRowSelected === undefined) {
        hasIndeterminateState = true;
      }
      return isRowSelected;
    });
    if (!selectedVisibleKeys.length) {
      return hasIndeterminateState ? undefined : false;
    }
    if (selectedVisibleKeys.length === visibleKeys.length) {
      return true;
    }
    return undefined;
  }
  selectAll() {
    const visibleKeys = this._getSelectAllNodeKeys().filter(key => !this.isRowSelected(key));
    this.focusedItemIndex(-1);
    return this.selectRows(visibleKeys, true);
  }
  deselectAll() {
    const visibleKeys = this._getSelectAllNodeKeys();
    this.focusedItemIndex(-1);
    return this.deselectRows(visibleKeys);
  }
  selectedItemKeys(value, preserve, isDeselect, isSelectAll) {
    const that = this;
    const selectedRowKeys = that.option('selectedRowKeys');
    const isRecursiveSelection = this.isRecursiveSelection();
    const normalizedArgs = isRecursiveSelection && that._normalizeSelectionArgs({
      keys: (0, _type.isDefined)(value) ? value : []
    }, preserve, !isDeselect);
    if (normalizedArgs && !(0, _common.equalByValue)(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
      that._isSelectionNormalizing = true;
      return super.selectedItemKeys(normalizedArgs.selectedRowKeys, false, false, false).always(() => {
        that._isSelectionNormalizing = false;
      }).done(items => {
        normalizedArgs.selectedRowsData = items;
        // @ts-expect-error
        that._fireSelectionChanged(normalizedArgs);
      });
    }
    return super.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeItemSelection(itemIndex, keyboardKeys, setFocusOnly) {
    const isRecursiveSelection = this.isRecursiveSelection();
    const callBase = super.changeItemSelection.bind(this);
    if (isRecursiveSelection && !keyboardKeys.shift) {
      const key = this._dataController.getKeyByRowIndex(itemIndex);
      return this.selectedItemKeys(key, true, this.isRowSelected(key)).done(() => {
        this.isRowSelected(key) && callBase(itemIndex, keyboardKeys, true);
      });
    }
    return super.changeItemSelection.apply(this, arguments);
  }
  _updateParentSelectionState(node, isSelected) {
    const that = this;
    let state = isSelected;
    const parentNode = node.parent;
    if (parentNode) {
      if (parentNode.children.length > 1) {
        if (isSelected === false) {
          const hasSelectedState = parentNode.children.some(childNode => that._selectionStateByKey[childNode.key]);
          state = hasSelectedState ? undefined : false;
        } else if (isSelected === true) {
          const hasNonSelectedState = parentNode.children.some(childNode => !that._selectionStateByKey[childNode.key]);
          state = hasNonSelectedState ? undefined : true;
        }
      }
      this._selectionStateByKey[parentNode.key] = state;
      if (parentNode.parent && parentNode.parent.level >= 0) {
        this._updateParentSelectionState(parentNode, state);
      }
    }
  }
  _updateChildrenSelectionState(node, isSelected) {
    const that = this;
    const {
      children
    } = node;
    children && children.forEach(childNode => {
      that._selectionStateByKey[childNode.key] = isSelected;
      if (childNode.children.length > 0) {
        that._updateChildrenSelectionState(childNode, isSelected);
      }
    });
  }
  _updateSelectionStateCore(keys, isSelected) {
    const dataController = this._dataController;
    for (let i = 0; i < keys.length; i++) {
      this._selectionStateByKey[keys[i]] = isSelected;
      // @ts-expect-error
      const node = dataController.getNodeByKey(keys[i]);
      if (node) {
        this._updateParentSelectionState(node, isSelected);
        this._updateChildrenSelectionState(node, isSelected);
      }
    }
  }
  _getSelectedParentKeys(key, selectedItemKeys, useCash) {
    let selectedParentNode;
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);
    let parentNode = node && node.parent;
    let result = [];
    while (parentNode && parentNode.level >= 0) {
      result.unshift(parentNode.key);
      const isSelected = useCash ? !nodeExists(selectedItemKeys, parentNode.key) && this.isRowSelected(parentNode.key) : selectedItemKeys.indexOf(parentNode.key) >= 0;
      if (isSelected) {
        selectedParentNode = parentNode;
        result = this._getSelectedParentKeys(selectedParentNode.key, selectedItemKeys, useCash).concat(result);
        break;
      } else if (useCash) {
        break;
      }
      parentNode = parentNode.parent;
    }
    return selectedParentNode && result || [];
  }
  _getSelectedChildKeys(key, keysToIgnore) {
    const childKeys = [];
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);
    node && _m_core.default.foreachNodes(node.children, childNode => {
      const ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);
      if (ignoreKeyIndex < 0) {
        childKeys.push(childNode.key);
      }
      return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && this._selectionStateByKey[childNode.key] === undefined;
    });
    return childKeys;
  }
  _normalizeParentKeys(key, args) {
    const that = this;
    let keysToIgnore = [key];
    const parentNodeKeys = that._getSelectedParentKeys(key, args.selectedRowKeys);
    if (parentNodeKeys.length) {
      keysToIgnore = keysToIgnore.concat(parentNodeKeys);
      keysToIgnore.forEach(key => {
        const index = args.selectedRowKeys.indexOf(key);
        if (index >= 0) {
          args.selectedRowKeys.splice(index, 1);
        }
      });
      const childKeys = that._getSelectedChildKeys(parentNodeKeys[0], keysToIgnore);
      args.selectedRowKeys = args.selectedRowKeys.concat(childKeys);
    }
  }
  _normalizeChildrenKeys(key, args) {
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);
    node && node.children.forEach(childNode => {
      const index = args.selectedRowKeys.indexOf(childNode.key);
      if (index >= 0) {
        args.selectedRowKeys.splice(index, 1);
      }
      this._normalizeChildrenKeys(childNode.key, args);
    });
  }
  _normalizeSelectedRowKeysCore(keys, args, preserve, isSelect) {
    const that = this;
    keys.forEach(key => {
      if (preserve && that.isRowSelected(key) === isSelect) {
        return;
      }
      that._normalizeChildrenKeys(key, args);
      const index = args.selectedRowKeys.indexOf(key);
      if (isSelect) {
        if (index < 0) {
          args.selectedRowKeys.push(key);
        }
        args.currentSelectedRowKeys.push(key);
      } else {
        if (index >= 0) {
          args.selectedRowKeys.splice(index, 1);
        }
        args.currentDeselectedRowKeys.push(key);
        that._normalizeParentKeys(key, args);
      }
    });
  }
  _normalizeSelectionArgs(args, preserve, isSelect) {
    let result;
    const keys = Array.isArray(args.keys) ? args.keys : [args.keys];
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const selectedRowKeys = this.option('selectedRowKeys') || [];
    if (keys.length) {
      result = {
        currentSelectedRowKeys: [],
        currentDeselectedRowKeys: [],
        selectedRowKeys: preserve ? selectedRowKeys.slice(0) : []
      };
      this._normalizeSelectedRowKeysCore(keys, result, preserve, isSelect);
    }
    return result;
  }
  _updateSelectedItems(args) {
    this.updateSelectionState(args);
    super._updateSelectedItems(args);
  }
  _fireSelectionChanged() {
    if (!this._isSelectionNormalizing) {
      super._fireSelectionChanged.apply(this, arguments);
    }
  }
  _isModeLeavesOnly(mode) {
    return mode === 'leavesOnly';
  }
  _removeDuplicatedKeys(keys) {
    const result = [];
    const processedKeys = {};
    keys.forEach(key => {
      if (!processedKeys[key]) {
        processedKeys[key] = true;
        result.push(key);
      }
    });
    return result;
  }
  _getAllChildKeys(key) {
    const childKeys = [];
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);
    node && _m_core.default.foreachNodes(node.children, childNode => {
      childKeys.push(childNode.key);
    }, true);
    return childKeys;
  }
  _getAllSelectedRowKeys(keys) {
    let result = [];
    keys.forEach(key => {
      const parentKeys = this._getSelectedParentKeys(key, [], true);
      const childKeys = this._getAllChildKeys(key);
      result.push.apply(result, parentKeys.concat([key], childKeys));
    });
    result = this._removeDuplicatedKeys(result);
    return result;
  }
  _getParentSelectedRowKeys(keys) {
    const that = this;
    const result = [];
    keys.forEach(key => {
      const parentKeys = that._getSelectedParentKeys(key, keys);
      !parentKeys.length && result.push(key);
    });
    return result;
  }
  _getLeafSelectedRowKeys(keys) {
    const that = this;
    const result = [];
    const dataController = that._dataController;
    keys.forEach(key => {
      // @ts-expect-error
      const node = dataController.getNodeByKey(key);
      node && !node.hasChildren && result.push(key);
    });
    return result;
  }
  isRecursiveSelection() {
    const selectionMode = this.option('selection.mode');
    const isRecursive = this.option('selection.recursive');
    return selectionMode === 'multiple' && isRecursive;
  }
  updateSelectionState(options) {
    const removedItemKeys = options.removedItemKeys || [];
    const selectedItemKeys = options.selectedItemKeys || [];
    if (this.isRecursiveSelection()) {
      this._updateSelectionStateCore(removedItemKeys, false);
      this._updateSelectionStateCore(selectedItemKeys, true);
    }
  }
  isRowSelected(key, isRecursiveSelection) {
    const result = super.isRowSelected.apply(this, arguments);
    isRecursiveSelection = isRecursiveSelection ?? this.isRecursiveSelection();
    if (!result && isRecursiveSelection) {
      if (key in this._selectionStateByKey) {
        return this._selectionStateByKey[key];
      }
      return false;
    }
    return result;
  }
  getSelectedRowKeys(mode) {
    const that = this;
    if (!that._dataController) {
      return [];
    }
    let selectedRowKeys = super.getSelectedRowKeys.apply(that, arguments);
    if (mode) {
      if (this.isRecursiveSelection()) {
        selectedRowKeys = this._getAllSelectedRowKeys(selectedRowKeys);
      }
      if (mode !== 'all') {
        if (mode === 'excludeRecursive') {
          selectedRowKeys = that._getParentSelectedRowKeys(selectedRowKeys);
        } else if (that._isModeLeavesOnly(mode)) {
          selectedRowKeys = that._getLeafSelectedRowKeys(selectedRowKeys);
        }
      }
    }
    return selectedRowKeys;
  }
  getSelectedRowsData(mode) {
    const that = this;
    const dataController = that._dataController;
    const selectedKeys = this.getSelectedRowKeys(mode) || [];
    const selectedRowsData = [];
    selectedKeys.forEach(key => {
      // @ts-expect-error
      const node = dataController.getNodeByKey(key);
      node && selectedRowsData.push(node.data);
    });
    return selectedRowsData;
  }
  refresh() {
    this._selectionStateByKey = {};
    return super.refresh.apply(this, arguments);
  }
};
const columnHeadersView = Base => class ColumnHeaderViewSelectionTreeListExtender extends (0, _m_selection.columnHeadersSelectionExtenderMixin)(Base) {
  _processTemplate(template, options) {
    const that = this;
    let resultTemplate;
    const renderingTemplate = super._processTemplate(template, options);
    // @ts-expect-error
    const firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();
    if (renderingTemplate && options.rowType === 'header' && options.column.index === firstDataColumnIndex) {
      resultTemplate = {
        render(options) {
          if (that.option('selection.mode') === 'multiple') {
            that.renderSelectAll(options.container, options.model);
          }
          renderingTemplate.render(options);
        }
      };
    } else {
      resultTemplate = renderingTemplate;
    }
    return resultTemplate;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderSelectAll($cell, options) {
    $cell.addClass(TREELIST_SELECT_ALL_CLASS);
    this._renderSelectAllCheckBox($cell);
  }
  _isSortableElement($target) {
    return super._isSortableElement($target) && !$target.closest(`.${SELECT_CHECKBOX_CLASS}`).length;
  }
};
const rowsView = Base => class RowsViewSelectionTreeListExtender extends (0, _m_selection.rowsViewSelectionExtenderMixin)(Base) {
  _renderIcons($iconContainer, options) {
    // @ts-expect-error
    super._renderIcons.apply(this, arguments);
    if (!options.row.isNewRow && this.option('selection.mode') === 'multiple') {
      // @ts-expect-error
      this._selectionController.renderSelectCheckBoxContainer($iconContainer, options);
    }
    return $iconContainer;
  }
  _rowClick(e) {
    const $targetElement = (0, _renderer.default)(e.event.target);
    // @ts-expect-error
    if (this.isExpandIcon($targetElement)) {
      super._rowClickForTreeList.apply(this, arguments);
    } else {
      super._rowClick.apply(this, arguments);
    }
  }
};
_m_core.default.registerModule('selection', (0, _extend.extend)(true, {}, _m_selection.selectionModule, {
  defaultOptions() {
    return (0, _extend.extend)(true, _m_selection.selectionModule.defaultOptions(), {
      selection: {
        showCheckBoxesMode: 'always',
        recursive: false
      }
    });
  },
  extenders: {
    controllers: {
      data,
      selection
    },
    views: {
      columnHeadersView,
      rowsView
    }
  }
}));