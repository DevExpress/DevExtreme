/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ChangedEvent, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import { selectionDataControllerExtender } from '@ts/grids/grid_core/selection/extenders/selection_data_controller';
import type { SelectionController } from '@ts/grids/grid_core/selection/m_selection';
import {
  selectionColumnHeadersViewExtender,
  selectionRowsViewExtender,
} from '@ts/grids/grid_core/selection/m_selection';
import { selectionModule } from '@ts/grids/grid_core/selection/selection_module';
import type { SelectionChangedOptions, SelectionModifierKeys } from '@ts/grids/grid_core/selection/types';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import type { ViewRowEvent } from '@ts/grids/grid_core/views/types';
import type { TreeListDataController } from '@ts/grids/tree_list/data_controller/data_controller';
import type { TreeNode } from '@ts/grids/tree_list/data_source_adapter/types';
import type { TreeListRowsView } from '@ts/grids/tree_list/rows/m_rows';
import type { SelectionOptions } from '@ts/ui/selection/types';

import treeListCore from '../core';
import type { SelectionStateByKey, TreeListSelectionControllerExtension } from './types';

const TREELIST_SELECT_CHECKBOX_WRAPPER_CLASS = 'dx-treelist-select-checkbox-container';
const TREELIST_SELECT_ALL_CLASS = 'dx-treelist-select-all';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';

const nodeExists = function (array: RowKey[], currentKey: RowKey): boolean {
  return !!array.filter((key) => key === currentKey).length;
};

const data = (
  Base: ModuleType<TreeListDataController>,
): ModuleType<TreeListDataController> => class DataSelectionTreeListExtender
  extends selectionDataControllerExtender(Base) {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private _selectionController!: SelectionController & TreeListSelectionControllerExtension;

  protected dataChangedHandler(e?: ChangedEvent): void {
    const isRecursiveSelection = this._selectionController.isRecursiveSelection();

    if (isRecursiveSelection) {
      this._selectionController.updateSelectionState({
        selectedItemKeys: this.option('selectedRowKeys'),
      });
    }
    super.dataChangedHandler(e);
  }

  public override loadDescendants(
    keys?: RowKey | RowKey[],
    childrenOnly?: boolean,
  ): DeferredObj<unknown> | undefined {
    const d = super.loadDescendants(keys, childrenOnly);
    const isRecursiveSelection = this._selectionController.isRecursiveSelection();

    if (isRecursiveSelection) {
      d?.done(() => {
        this._selectionController.updateSelectionState({
          selectedItemKeys: this.option('selectedRowKeys'),
        });
      });
    }

    return d;
  }
};

const selection = (
  Base: ModuleType<SelectionController>,
): ModuleType<
SelectionController & TreeListSelectionControllerExtension
> => class SelectionControllerTreeListExtender extends Base {
  protected declare _dataController: TreeListDataController;

  private _selectionStateByKey!: SelectionStateByKey;

  private _isSelectionNormalizing?: boolean;

  protected _updateSelectColumn = noop;

  public init(): void {
    super.init();
    this._selectionStateByKey = {};
  }

  protected _getSelectionConfig(): Partial<SelectionOptions> {
    const config = super._getSelectionConfig();
    const { plainItems } = config;

    config.plainItems = (cached): RawItemData[] => {
      const cachedStoreData = cached ? this.dataSourceController.getCachedStoreData() : undefined;

      return cachedStoreData ?? plainItems?.().map((item: ProcessedItem) => item.data) ?? [];
    };
    config.isItemSelected = (item): boolean => {
      const key = this.dataSourceController.keyOf(item);

      // @ts-expect-error isRowSelected returns undefined for a partially selected node
      return this.isRowSelected(key);
    };
    config.isSelectableItem = (item): boolean => !!item;
    config.getItemData = (item: RawItemData): RawItemData => item;
    config.allowLoadByRange = undefined;

    return config;
  }

  private _getSelectAllNodeKeys(): RowKey[] {
    const root = this._dataController.getRootNode();
    const cache = {};
    const keys: RowKey[] = [];
    const isRecursiveSelection = this.isRecursiveSelection();

    if (root) {
      treeListCore.foreachNodes(root.children, (node: TreeNode) => {
        if (node.key !== undefined && (node.visible || isRecursiveSelection)) {
          keys.push(node.key);
        }

        if (!node.visible) {
          return true;
        }

        return isRecursiveSelection ? false : this._dataController.isRowExpanded(node.key, cache);
      });
    }

    return keys;
  }

  public isSelectAll(): boolean | undefined {
    const selectedRowKeys = this.option('selectedRowKeys') ?? [];
    if (selectedRowKeys.length === 0) return false;

    const visibleKeys = this._getSelectAllNodeKeys();
    const isRecursiveSelection = this.isRecursiveSelection();
    let hasIndeterminateState = false;

    const selectedVisibleKeys = visibleKeys.filter((key) => {
      const isRowSelected = this.isRowSelected(key, isRecursiveSelection);

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

  public selectAll(): DeferredObj<unknown> {
    const visibleKeys = this._getSelectAllNodeKeys().filter((key) => !this.isRowSelected(key));

    this.focusedItemIndex(-1);

    return this.selectRows(visibleKeys, true);
  }

  public deselectAll(): DeferredObj<unknown> {
    const visibleKeys = this._getSelectAllNodeKeys();

    this.focusedItemIndex(-1);

    return this.deselectRows(visibleKeys);
  }

  protected selectedItemKeys(
    value: RowKey | RowKey[],
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
  ): DeferredObj<unknown> {
    const selectedRowKeys = this.option('selectedRowKeys');
    const isRecursiveSelection = this.isRecursiveSelection();
    const normalizedArgs = isRecursiveSelection && this._normalizeSelectionArgs({
      keys: isDefined(value) ? value : [],
    }, preserve, !isDeselect);

    if (normalizedArgs && !equalByValue(normalizedArgs.selectedRowKeys, selectedRowKeys)) {
      this._isSelectionNormalizing = true;
      return super.selectedItemKeys(normalizedArgs.selectedRowKeys, false, false, false)
        .always(() => {
          this._isSelectionNormalizing = false;
        })
        .done((items) => {
          normalizedArgs.selectedRowsData = items;
          this._fireSelectionChanged(normalizedArgs);
        });
    }

    // @ts-expect-error Selection also accepts a single key
    return super.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
  }

  public changeItemSelection(
    itemIndex: number,
    keyboardKeys?: SelectionModifierKeys,
    setFocusOnly?: boolean,
  ): boolean | DeferredObj<unknown> | undefined {
    const isRecursiveSelection = this.isRecursiveSelection();
    const callBase = super.changeItemSelection.bind(this);

    if (isRecursiveSelection && !keyboardKeys?.shift) {
      const key = this._dataController.getKeyByRowIndex(itemIndex);
      return this.selectedItemKeys(key, true, this.isRowSelected(key)).done(() => {
        if (this.isRowSelected(key)) {
          callBase(itemIndex, keyboardKeys, true);
        }
      });
    }

    return super.changeItemSelection(itemIndex, keyboardKeys, setFocusOnly);
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
      const node = dataController.getNodeByKey(keys[i]);

      if (node) {
        this._updateParentSelectionState(node, isSelected);
        this._updateChildrenSelectionState(node, isSelected);
      }
    }
  }

  private _getSelectedParentKeys(key, selectedItemKeys, useCash?) {
    let selectedParentNode;
    const node = this._dataController.getNodeByKey(key);
    let parentNode = node && node.parent;
    let result: any[] = [];

    while (parentNode?.level !== undefined && parentNode.level >= 0) {
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

  protected _fireSelectionChanged(options?: SelectionChangedOptions): void {
    if (!this._isSelectionNormalizing) {
      super._fireSelectionChanged(options);
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
      const node = dataController.getNodeByKey(key);
      node && !node.hasChildren && result.push(key);
    });

    return result;
  }

  public isRecursiveSelection() {
    const selectionMode = this.option('selection.mode');
    const isRecursive = this.option('selection.recursive');

    return selectionMode === 'multiple' && isRecursive;
  }

  public updateSelectionState(options): void {
    const removedItemKeys = options.removedItemKeys || [];
    const selectedItemKeys = options.selectedItemKeys || [];

    if (this.isRecursiveSelection()) {
      this._updateSelectionStateCore(removedItemKeys, false);
      this._updateSelectionStateCore(selectedItemKeys, true);
    }
  }

  public isRowSelected(key, isRecursive?: boolean): boolean | undefined {
    const result = super.isRowSelected(key);
    const isRecursiveSelection = isRecursive ?? this.isRecursiveSelection();

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

    // @ts-expect-error selection may be deferred only in DataGrid,
    // we need to improve GridCore types to take it into account
    selectedKeys.forEach((key) => {
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

const columnHeadersView = (Base: ModuleType<ColumnHeadersView>) => class ColumnHeaderViewSelectionTreeListExtender extends selectionColumnHeadersViewExtender(Base) {
  protected _processTemplate(template, options) {
    const that = this;
    let resultTemplate;
    const renderingTemplate = super._processTemplate(template, options);

    // @ts-expect-error
    const firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

    if (renderingTemplate && options.rowType === 'header' && options.column.index === firstDataColumnIndex) {
      resultTemplate = {
        render(options) {
          // NOTE: Template may be attached with "prepend"
          // Therefore, to have "select all" checkbox as first element
          // We should render template first
          renderingTemplate.render(options);

          if (that.option('selection.mode') === 'multiple') {
            that.renderSelectAll(options.container, options.model);
          }
        },
      };
    } else {
      resultTemplate = renderingTemplate;
    }

    return resultTemplate;
  }

  public override renderSelectAllCheckBox(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    const $checkboxWrapper = $('<div>')
      .addClass(TREELIST_SELECT_CHECKBOX_WRAPPER_CLASS);
    const $checkbox = this.createSelectAllCheckboxElement();

    $checkbox.appendTo($checkboxWrapper);
    // NOTE: It's important to have checkbox as first child inside <td>
    $checkboxWrapper.prependTo($container);

    return $checkbox;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private renderSelectAll($cell, options) {
    $cell.addClass(TREELIST_SELECT_ALL_CLASS);

    this.renderSelectAllCheckBox($cell);
  }

  protected _isSortableElement($target) {
    return super._isSortableElement($target) && !$target.closest(`.${SELECT_CHECKBOX_CLASS}`).length;
  }
};

const rowsView = (
  Base: ModuleType<TreeListRowsView>,
): ModuleType<TreeListRowsView> => class TreeListSelectionRowsViewExtender
  extends selectionRowsViewExtender(Base) {
  protected _renderIcons(
    $container: dxElementWrapper,
    options,
  ): dxElementWrapper {
    const $iconContainer = super._renderIcons($container, options);
    const isMultipleSelection = this.option('selection.mode') === 'multiple';

    if (!options.row.isNewRow && isMultipleSelection) {
      const $checkboxWrapper = $('<div>').addClass(TREELIST_SELECT_CHECKBOX_WRAPPER_CLASS);
      $checkboxWrapper.appendTo($iconContainer);

      const $checkbox = this.renderSelectCheckBox($checkboxWrapper, {
        value: options.row.isSelected,
        row: options.row,
        column: options.column,
      });

      this.attachCheckBoxClickEvent($checkbox);
    }

    return $iconContainer;
  }

  public override handleRowClickBySelection(e: ViewRowEvent): void {
    if (!this.isExpandIcon($(e.event.target))) {
      super.handleRowClickBySelection(e);
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
