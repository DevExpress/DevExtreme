/* eslint-disable max-classes-per-file */
import $ from '@js/core/renderer';
import { equalByValue, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import {
  columnHeadersSelectionExtenderMixin,
  dataSelectionExtenderMixin,
  rowsViewSelectionExtenderMixin,
  selectionModule,
} from '@ts/grids/grid_core/selection/m_selection';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import treeListCore from '../m_core';

const TREELIST_SELECT_ALL_CLASS = 'dx-treelist-select-all';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';

const nodeExists = function (array, currentKey) {
  return !!array.filter((key) => key === currentKey).length;
};

const data = (Base: ModuleType<DataController>) => class DataSelectionTreeListExtender extends dataSelectionExtenderMixin(Base) {
  protected _handleDataChanged(e) {
    // @ts-expect-error
    const isRecursiveSelection = this._selectionController.isRecursiveSelection();

    if (isRecursiveSelection && (!e || e.changeType !== 'updateSelectionState')) {
      // @ts-expect-error
      this._selectionController.updateSelectionState({
        selectedItemKeys: this.option('selectedRowKeys'),
      });
    }
    super._handleDataChanged.apply(this, arguments as any);
  }

  private loadDescendants() {
    const that = this;
    // @ts-expect-error
    const d = super.loadDescendants.apply(that, arguments);
    // @ts-expect-error
    const isRecursiveSelection = this._selectionController.isRecursiveSelection();

    if (isRecursiveSelection) {
      d.done(() => {
        // @ts-expect-error
        this._selectionController.updateSelectionState({
          selectedItemKeys: that.option('selectedRowKeys'),
        });
      });
    }

    return d;
  }
};

const selection = (Base: ModuleType<SelectionController>) => class SelectionControllerTreeListExtender extends Base {
  private _selectionStateByKey: any;

  private _isSelectionNormalizing: any;

  protected _updateSelectColumn = noop;

  public init() {
    super.init.apply(this, arguments as any);
    this._selectionStateByKey = {};
  }

  protected _getSelectionConfig() {
    const config = super._getSelectionConfig.apply(this, arguments as any);

    const { plainItems } = config;
    config.plainItems = (cached) => {
      let result;
      if (cached) {
        result = this._dataController.getCachedStoreData();
      }

      result ||= plainItems.apply(this, arguments as any).map((item) => item.data);
      return result || [];
    };
    config.isItemSelected = (item) => {
      const key = this._dataController.keyOf(item);

      return this.isRowSelected(key);
    };
    config.isSelectableItem = (item) => !!item;
    config.getItemData = (item) => item;
    // @ts-expect-error
    config.allowLoadByRange = undefined;
    return config;
  }

  private renderSelectCheckBoxContainer($container, model) {
    const that = this;
    const rowsView = that.component.getView('rowsView');

    // @ts-expect-error
    const $checkbox = rowsView._renderSelectCheckBox($container, {
      value: model.row.isSelected,
      row: model.row,
      column: model.column,
    });

    // @ts-expect-error
    rowsView._attachCheckBoxClickEvent($checkbox);
  }

  private _getSelectAllNodeKeys() {
    const { component } = this;
    // @ts-expect-error
    const root = component.getRootNode();
    const cache = {};
    const keys: any[] = [];
    const isRecursiveSelection = this.isRecursiveSelection();

    root && treeListCore.foreachNodes(root.children, (node) => {
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

  public isSelectAll() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const selectedRowKeys = this.option('selectedRowKeys') || [];
    if (selectedRowKeys.length === 0) return false;

    const { component } = this;
    const visibleKeys = this._getSelectAllNodeKeys();
    const isRecursiveSelection = this.isRecursiveSelection();
    let hasIndeterminateState = false;

    const selectedVisibleKeys = visibleKeys.filter((key) => {
      // @ts-expect-error
      const isRowSelected = component.isRowSelected(key, isRecursiveSelection);
      if (isRowSelected === undefined) {
        hasIndeterminateState = true;
      }
      return isRowSelected;
    });

    if (!selectedVisibleKeys.length) {
      return hasIndeterminateState ? undefined : false;
    } if (selectedVisibleKeys.length === visibleKeys.length) {
      return true;
    }

    return undefined;
  }

  public selectAll() {
    const visibleKeys = this._getSelectAllNodeKeys().filter((key) => !this.isRowSelected(key));

    this.focusedItemIndex(-1);

    return this.selectRows(visibleKeys, true);
  }

  public deselectAll() {
    const visibleKeys = this._getSelectAllNodeKeys();

    this.focusedItemIndex(-1);

    return this.deselectRows(visibleKeys);
  }

  protected selectedItemKeys(value, preserve, isDeselect, isSelectAll?) {
    const that = this;
    const selectedRowKeys = that.option('selectedRowKeys');
    const isRecursiveSelection = this.isRecursiveSelection();
    const normalizedArgs: any = isRecursiveSelection && that._normalizeSelectionArgs({
      keys: isDefined(value) ? value : [],
    }, preserve, !isDeselect);

    if (normalizedArgs && !equalByValue(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
      that._isSelectionNormalizing = true;
      return super.selectedItemKeys(normalizedArgs.selectedRowKeys, false, false, false)
        .always(() => {
          that._isSelectionNormalizing = false;
        })
        .done((items) => {
          normalizedArgs.selectedRowsData = items;
          // @ts-expect-error
          that._fireSelectionChanged(normalizedArgs);
        });
    }

    return super.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public changeItemSelection(itemIndex, keyboardKeys, setFocusOnly?: boolean): boolean | DeferredObj<unknown> | undefined {
    const isRecursiveSelection = this.isRecursiveSelection();
    const callBase = super.changeItemSelection.bind(this);

    if (isRecursiveSelection && !keyboardKeys.shift) {
      const key = this._dataController.getKeyByRowIndex(itemIndex);
      return this.selectedItemKeys(key, true, this.isRowSelected(key)).done(() => {
        this.isRowSelected(key) && callBase(itemIndex, keyboardKeys, true);
      });
    }

    return super.changeItemSelection.apply(this, arguments as any);
  }

  private _updateParentSelectionState(node, isSelected) {
    const that = this;
    let state = isSelected;
    const parentNode = node.parent;

    if (parentNode) {
      if (parentNode.children.length > 1) {
        if (isSelected === false) {
          const hasSelectedState = parentNode.children.some((childNode) => that._selectionStateByKey[childNode.key]);

          state = hasSelectedState ? undefined : false;
        } else if (isSelected === true) {
          const hasNonSelectedState = parentNode.children.some((childNode) => !that._selectionStateByKey[childNode.key]);

          state = hasNonSelectedState ? undefined : true;
        }
      }

      this._selectionStateByKey[parentNode.key] = state;

      if (parentNode.parent && parentNode.parent.level >= 0) {
        this._updateParentSelectionState(parentNode, state);
      }
    }
  }

  private _updateChildrenSelectionState(node, isSelected) {
    const that = this;
    const { children } = node;

    children && children.forEach((childNode) => {
      that._selectionStateByKey[childNode.key] = isSelected;

      if (childNode.children.length > 0) {
        that._updateChildrenSelectionState(childNode, isSelected);
      }
    });
  }

  private _updateSelectionStateCore(keys, isSelected) {
    const dataController = this._dataController;

    this._selectionStateByKey = {};
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

  private _getSelectedParentKeys(key, selectedItemKeys, useCash?) {
    let selectedParentNode;
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);
    let parentNode = node && node.parent;
    let result: any[] = [];

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

  private _getSelectedChildKeys(key, keysToIgnore) {
    const childKeys: any[] = [];
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);

    node && treeListCore.foreachNodes(node.children, (childNode) => {
      const ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);

      if (ignoreKeyIndex < 0) {
        childKeys.push(childNode.key);
      }

      return ignoreKeyIndex > 0 || ignoreKeyIndex < 0 && this._selectionStateByKey[childNode.key] === undefined;
    });

    return childKeys;
  }

  private _normalizeParentKeys(key, args) {
    const that = this;
    let keysToIgnore = [key];
    const parentNodeKeys = that._getSelectedParentKeys(key, args.selectedRowKeys);

    if (parentNodeKeys.length) {
      keysToIgnore = keysToIgnore.concat(parentNodeKeys);

      keysToIgnore.forEach((key) => {
        const index = args.selectedRowKeys.indexOf(key);

        if (index >= 0) {
          args.selectedRowKeys.splice(index, 1);
        }
      });

      const childKeys = that._getSelectedChildKeys(parentNodeKeys[0], keysToIgnore);
      args.selectedRowKeys = args.selectedRowKeys.concat(childKeys);
    }
  }

  private _normalizeChildrenKeys(key, args) {
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);

    node && node.children.forEach((childNode) => {
      const index = args.selectedRowKeys.indexOf(childNode.key);
      if (index >= 0) {
        args.selectedRowKeys.splice(index, 1);
      }

      this._normalizeChildrenKeys(childNode.key, args);
    });
  }

  private _normalizeSelectedRowKeysCore(keys, args, preserve, isSelect) {
    const that = this;

    keys.forEach((key) => {
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

  private _normalizeSelectionArgs(args, preserve, isSelect) {
    let result;
    const keys = Array.isArray(args.keys) ? args.keys : [args.keys];
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const selectedRowKeys = this.option('selectedRowKeys') || [];

    if (keys.length) {
      result = {
        currentSelectedRowKeys: [],
        currentDeselectedRowKeys: [],
        selectedRowKeys: preserve ? selectedRowKeys.slice(0) : [],
      };

      this._normalizeSelectedRowKeysCore(keys, result, preserve, isSelect);
    }

    return result;
  }

  protected _updateSelectedItems(args) {
    this.updateSelectionState(args);
    super._updateSelectedItems(args);
  }

  protected _fireSelectionChanged() {
    if (!this._isSelectionNormalizing) {
      super._fireSelectionChanged.apply(this, arguments as any);
    }
  }

  private _isModeLeavesOnly(mode) {
    return mode === 'leavesOnly';
  }

  private _removeDuplicatedKeys(keys) {
    const result: any[] = [];
    const processedKeys = {};

    keys.forEach((key) => {
      if (!processedKeys[key]) {
        processedKeys[key] = true;
        result.push(key);
      }
    });

    return result;
  }

  private _getAllChildKeys(key) {
    const childKeys: any[] = [];
    // @ts-expect-error
    const node = this._dataController.getNodeByKey(key);

    node && treeListCore.foreachNodes(node.children, (childNode) => {
      childKeys.push(childNode.key);
    }, true);

    return childKeys;
  }

  private _getAllSelectedRowKeys(keys) {
    let result: any = [];

    keys.forEach((key) => {
      const parentKeys = this._getSelectedParentKeys(key, [], true);
      const childKeys = this._getAllChildKeys(key);

      result.push.apply(result, parentKeys.concat([key], childKeys));
    });

    result = this._removeDuplicatedKeys(result);

    return result;
  }

  private _getParentSelectedRowKeys(keys) {
    const that = this;
    const result: any[] = [];

    keys.forEach((key) => {
      const parentKeys = that._getSelectedParentKeys(key, keys);
      !parentKeys.length && result.push(key);
    });

    return result;
  }

  private _getLeafSelectedRowKeys(keys) {
    const that = this;
    const result: any[] = [];
    const dataController = that._dataController;

    keys.forEach((key) => {
      // @ts-expect-error
      const node = dataController.getNodeByKey(key);
      node && !node.hasChildren && result.push(key);
    });

    return result;
  }

  private isRecursiveSelection() {
    const selectionMode = this.option('selection.mode');
    const isRecursive = this.option('selection.recursive');

    return selectionMode === 'multiple' && isRecursive;
  }

  private updateSelectionState(options) {
    const removedItemKeys = options.removedItemKeys || [];
    const selectedItemKeys = options.selectedItemKeys || [];

    if (this.isRecursiveSelection()) {
      this._updateSelectionStateCore(removedItemKeys, false);
      this._updateSelectionStateCore(selectedItemKeys, true);
    }
  }

  public isRowSelected(key, isRecursiveSelection?) {
    const result = super.isRowSelected.apply(this, arguments as any);

    isRecursiveSelection = isRecursiveSelection ?? this.isRecursiveSelection();

    if (!result && isRecursiveSelection) {
      if (key in this._selectionStateByKey) {
        return this._selectionStateByKey[key];
      }
      return false;
    }

    return result;
  }

  protected getSelectedRowKeys(mode) {
    const that = this;

    if (!that._dataController) {
      return [];
    }

    let selectedRowKeys = super.getSelectedRowKeys.apply(that, arguments as any);

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

  public getSelectedRowsData(mode) {
    const that = this;
    const dataController = that._dataController;
    const selectedKeys = this.getSelectedRowKeys(mode) || [];
    const selectedRowsData: any[] = [];

    selectedKeys.forEach((key) => {
      // @ts-expect-error
      const node = dataController.getNodeByKey(key);
      node && selectedRowsData.push(node.data);
    });

    return selectedRowsData;
  }

  public refresh() {
    this._selectionStateByKey = {};
    return super.refresh.apply(this, arguments as any);
  }
};

const columnHeadersView = (Base: ModuleType<ColumnHeadersView>) => class ColumnHeaderViewSelectionTreeListExtender extends columnHeadersSelectionExtenderMixin(Base) {
  protected _processTemplate(template, options) {
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
        },
      };
    } else {
      resultTemplate = renderingTemplate;
    }

    return resultTemplate;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private renderSelectAll($cell, options) {
    $cell.addClass(TREELIST_SELECT_ALL_CLASS);

    this._renderSelectAllCheckBox($cell);
  }

  protected _isSortableElement($target) {
    return super._isSortableElement($target) && !$target.closest(`.${SELECT_CHECKBOX_CLASS}`).length;
  }
};

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewSelectionTreeListExtender extends rowsViewSelectionExtenderMixin(Base) {
  private _renderIcons($iconContainer, options) {
    // @ts-expect-error
    super._renderIcons.apply(this, arguments);

    if (!options.row.isNewRow && this.option('selection.mode') === 'multiple') {
      // @ts-expect-error
      this._selectionController.renderSelectCheckBoxContainer($iconContainer, options);
    }

    return $iconContainer;
  }

  protected _rowClick(e) {
    const $targetElement = $(e.event.target);

    // @ts-expect-error
    if (this.isExpandIcon($targetElement)) {
      super._rowClickForTreeList.apply(this, arguments as any);
    } else {
      super._rowClick.apply(this, arguments as any);
    }
  }
};

treeListCore.registerModule('selection', extend(true, {}, selectionModule, {
  defaultOptions() {
    return extend(true, selectionModule.defaultOptions(), {
      selection: {
        showCheckBoxesMode: 'always',
        recursive: false,
      },
    });
  },
  extenders: {
    controllers: {
      data,
      selection,
    },
    views: {
      columnHeadersView,
      rowsView,
    },
  },
}));
