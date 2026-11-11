/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { ColumnTemplateSource, TemplateModel } from '@ts/grids/grid_core/columns_controller/types';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ChangedEvent, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import { SELECT_CHECKBOX_CLASS } from '@ts/grids/grid_core/selection/const';
import { selectionDataControllerExtender } from '@ts/grids/grid_core/selection/extenders/selection_data_controller';
import type { SelectionController } from '@ts/grids/grid_core/selection/selection';
import {
  selectionColumnHeadersViewExtender,
  selectionRowsViewExtender,
} from '@ts/grids/grid_core/selection/selection';
import { selectionModule } from '@ts/grids/grid_core/selection/selection_module';
import type {
  SelectionCellOptions,
  SelectionChangedOptions,
  SelectionColumnHeadersView,
  SelectionModifierKeys,
} from '@ts/grids/grid_core/selection/types';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import type {
  ColumnViewTemplate,
  ColumnViewTemplateOptions,
  ViewRowEvent,
} from '@ts/grids/grid_core/views/types';
import type { TreeListColumnsController } from '@ts/grids/tree_list/columns_controller';
import type { TreeListDataController } from '@ts/grids/tree_list/data_controller/data_controller';
import type { TreeNode } from '@ts/grids/tree_list/data_source_adapter/types';
import type { TreeListRowsView } from '@ts/grids/tree_list/rows/rows';
import type { TreeListNodeCellOptions } from '@ts/grids/tree_list/rows/types';
import type { SelectionChangeEvent, SelectionOptions } from '@ts/ui/selection/types';

import treeListCore from '../core';
import { CLASSES } from './const';
import type {
  NormalizedSelectionArgs,
  SelectionStateArgs,
  SelectionStateByKey,
  TreeListSelectionController,
} from './types';
import { nodeExists } from './utils';

const data = (
  Base: ModuleType<TreeListDataController>,
): ModuleType<TreeListDataController> => class DataSelectionTreeListExtender
  extends selectionDataControllerExtender(Base) {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private _selectionController!: TreeListSelectionController;

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
): ModuleType<TreeListSelectionController> => class SelectionControllerTreeListExtender
  extends Base {
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

      return !!this.isRowSelected(key);
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

    if (selectedRowKeys.length === 0) {
      return false;
    }

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
    }

    if (selectedVisibleKeys.length === visibleKeys.length) {
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
  ): DeferredObj<unknown[]> {
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

    if (isRecursiveSelection && !keyboardKeys?.shift) {
      const key = this._dataController.getKeyByRowIndex(itemIndex);
      return this.selectedItemKeys(key, true, this.isRowSelected(key)).done(() => {
        if (this.isRowSelected(key)) {
          super.changeItemSelection(itemIndex, keyboardKeys, true);
        }
      });
    }

    return super.changeItemSelection(itemIndex, keyboardKeys, setFocusOnly);
  }

  private _updateParentSelectionState(node: TreeNode, isSelected: boolean | undefined): void {
    let state = isSelected;
    const parentNode = node.parent;

    if (parentNode) {
      if (parentNode.children.length > 1) {
        if (isSelected === false) {
          const hasSelectedState = parentNode.children.some(
            (childNode) => this._selectionStateByKey[String(childNode.key)],
          );

          state = hasSelectedState ? undefined : false;
        } else if (isSelected === true) {
          const hasNonSelectedState = parentNode.children.some(
            (childNode) => !this._selectionStateByKey[String(childNode.key)],
          );

          state = hasNonSelectedState ? undefined : true;
        }
      }

      this._selectionStateByKey[String(parentNode.key)] = state;

      if (parentNode.parent?.level !== undefined && parentNode.parent.level >= 0) {
        this._updateParentSelectionState(parentNode, state);
      }
    }
  }

  private _updateChildrenSelectionState(node: TreeNode, isSelected: boolean): void {
    node.children.forEach((childNode) => {
      this._selectionStateByKey[String(childNode.key)] = isSelected;

      if (childNode.children.length > 0) {
        this._updateChildrenSelectionState(childNode, isSelected);
      }
    });
  }

  private _updateSelectionStateCore(keys: RowKey[], isSelected: boolean): void {
    const dataController = this._dataController;

    this._selectionStateByKey = {};
    for (const key of keys) {
      this._selectionStateByKey[String(key)] = isSelected;
      const node = dataController.getNodeByKey(key);

      if (node) {
        this._updateParentSelectionState(node, isSelected);
        this._updateChildrenSelectionState(node, isSelected);
      }
    }
  }

  private _getSelectedParentKeys(
    key: RowKey,
    selectedItemKeys: RowKey[],
    useCash?: boolean,
  ): RowKey[] {
    const node = this._dataController.getNodeByKey(key);
    let parentNode = node?.parent;
    const result: RowKey[] = [];

    while (parentNode?.level !== undefined && parentNode.level >= 0) {
      result.unshift(parentNode.key);
      const isSelected = useCash
        ? !nodeExists(selectedItemKeys, parentNode.key) && this.isRowSelected(parentNode.key)
        : nodeExists(selectedItemKeys, parentNode.key);

      if (isSelected) {
        return this._getSelectedParentKeys(parentNode.key, selectedItemKeys, useCash)
          .concat(result);
      }

      if (useCash) {
        break;
      }

      parentNode = parentNode.parent;
    }

    return [];
  }

  private _getSelectedChildKeys(key: RowKey, keysToIgnore: RowKey[]): RowKey[] {
    const childKeys: RowKey[] = [];
    const node = this._dataController.getNodeByKey(key);

    if (node) {
      treeListCore.foreachNodes(node.children, (childNode: TreeNode) => {
        const ignoreKeyIndex = keysToIgnore.indexOf(childNode.key);

        if (ignoreKeyIndex < 0) {
          childKeys.push(childNode.key);
        }

        return ignoreKeyIndex > 0 || (
          ignoreKeyIndex < 0 && this._selectionStateByKey[String(childNode.key)] === undefined
        );
      });
    }

    return childKeys;
  }

  private _normalizeParentKeys(key: RowKey, args: NormalizedSelectionArgs): void {
    let keysToIgnore = [key];
    const parentNodeKeys = this._getSelectedParentKeys(key, args.selectedRowKeys);

    if (parentNodeKeys.length) {
      keysToIgnore = keysToIgnore.concat(parentNodeKeys);

      keysToIgnore.forEach((keyToIgnore) => {
        const index = args.selectedRowKeys.indexOf(keyToIgnore);

        if (index >= 0) {
          args.selectedRowKeys.splice(index, 1);
        }
      });

      const childKeys = this._getSelectedChildKeys(parentNodeKeys[0], keysToIgnore);
      args.selectedRowKeys = args.selectedRowKeys.concat(childKeys);
    }
  }

  private _normalizeChildrenKeys(key: RowKey, args: NormalizedSelectionArgs): void {
    const node = this._dataController.getNodeByKey(key);

    if (node) {
      node.children.forEach((childNode) => {
        const index = args.selectedRowKeys.indexOf(childNode.key);
        if (index >= 0) {
          args.selectedRowKeys.splice(index, 1);
        }

        this._normalizeChildrenKeys(childNode.key, args);
      });
    }
  }

  private _normalizeSelectedRowKeysCore(
    keys: RowKey[],
    args: NormalizedSelectionArgs,
    preserve: boolean | undefined,
    isSelect: boolean,
  ): void {
    keys.forEach((key) => {
      if (preserve && this.isRowSelected(key) === isSelect) {
        return;
      }

      this._normalizeChildrenKeys(key, args);
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
        this._normalizeParentKeys(key, args);
      }
    });
  }

  private _normalizeSelectionArgs(
    args: { keys: RowKey | RowKey[] },
    preserve: boolean | undefined,
    isSelect: boolean,
  ): NormalizedSelectionArgs | undefined {
    const keys = Array.isArray(args.keys) ? args.keys : [args.keys];
    const selectedRowKeys = this.option('selectedRowKeys') ?? [];

    if (!keys.length) {
      return undefined;
    }

    const result: NormalizedSelectionArgs = {
      currentSelectedRowKeys: [],
      currentDeselectedRowKeys: [],
      selectedRowKeys: preserve ? selectedRowKeys.slice(0) : [],
    };

    this._normalizeSelectedRowKeysCore(keys, result, preserve, isSelect);

    return result;
  }

  protected _updateSelectedItems(args: SelectionChangeEvent<unknown, unknown>): void {
    this.updateSelectionState(args);
    super._updateSelectedItems(args);
  }

  protected _fireSelectionChanged(options?: SelectionChangedOptions): void {
    if (!this._isSelectionNormalizing) {
      super._fireSelectionChanged(options);
    }
  }

  private _isModeLeavesOnly(mode?: string): boolean {
    return mode === 'leavesOnly';
  }

  private _removeDuplicatedKeys(keys: RowKey[]): RowKey[] {
    const result: RowKey[] = [];
    const processedKeys: Record<string, boolean> = {};

    keys.forEach((key) => {
      if (!processedKeys[String(key)]) {
        processedKeys[String(key)] = true;
        result.push(key);
      }
    });

    return result;
  }

  private _getAllChildKeys(key: RowKey): RowKey[] {
    const childKeys: RowKey[] = [];
    const node = this._dataController.getNodeByKey(key);

    if (node) {
      treeListCore.foreachNodes(node.children, (childNode: TreeNode) => {
        childKeys.push(childNode.key);
      }, true);
    }

    return childKeys;
  }

  private _getAllSelectedRowKeys(keys: RowKey[]): RowKey[] {
    const allKeys = keys.flatMap((key) => [
      ...this._getSelectedParentKeys(key, [], true),
      key,
      ...this._getAllChildKeys(key),
    ]);

    return this._removeDuplicatedKeys(allKeys);
  }

  private _getParentSelectedRowKeys(keys: RowKey[]): RowKey[] {
    return keys.filter((key) => !this._getSelectedParentKeys(key, keys).length);
  }

  private _getLeafSelectedRowKeys(keys: RowKey[]): RowKey[] {
    return keys.filter((key) => {
      const node = this._dataController.getNodeByKey(key);

      return !!node && !node.hasChildren;
    });
  }

  public isRecursiveSelection(): boolean {
    const selectionMode = this.option('selection.mode');
    const isRecursive = this.option('selection.recursive');

    return selectionMode === 'multiple' && !!isRecursive;
  }

  public updateSelectionState(options: SelectionStateArgs): void {
    const removedItemKeys = options.removedItemKeys ?? [];
    const selectedItemKeys = options.selectedItemKeys || [];

    if (this.isRecursiveSelection()) {
      this._updateSelectionStateCore(removedItemKeys, false);
      this._updateSelectionStateCore(selectedItemKeys, true);
    }
  }

  public isRowSelected(key: RowKey, isRecursive?: boolean): boolean | undefined {
    const result = super.isRowSelected(key);
    const isRecursiveSelection = isRecursive ?? this.isRecursiveSelection();

    if (!result && isRecursiveSelection) {
      if (String(key) in this._selectionStateByKey) {
        return this._selectionStateByKey[String(key)];
      }
      return false;
    }

    return result;
  }

  protected getSelectedRowKeys(mode?: string): RowKey[] {
    if (!this._dataController) {
      return [];
    }

    // @ts-expect-error selection may be deferred only in DataGrid,
    // we need to improve GridCore types to take it into account
    const selectedRowKeys: RowKey[] = super.getSelectedRowKeys(mode);

    if (!mode) {
      return selectedRowKeys;
    }

    const allSelectedRowKeys = this.isRecursiveSelection()
      ? this._getAllSelectedRowKeys(selectedRowKeys)
      : selectedRowKeys;

    if (mode === 'excludeRecursive') {
      return this._getParentSelectedRowKeys(allSelectedRowKeys);
    }

    if (this._isModeLeavesOnly(mode)) {
      return this._getLeafSelectedRowKeys(allSelectedRowKeys);
    }

    return allSelectedRowKeys;
  }

  public getSelectedRowsData(mode?: string): RawItemData[] {
    const dataController = this._dataController;
    const selectedKeys = this.getSelectedRowKeys(mode) || [];
    const selectedRowsData: RawItemData[] = [];

    selectedKeys.forEach((key) => {
      const node = dataController.getNodeByKey(key);

      if (node) {
        // @ts-expect-error data is undefined for a parent node that isn't loaded
        selectedRowsData.push(node.data);
      }
    });

    return selectedRowsData;
  }

  public refresh(): DeferredObj<unknown> {
    this._selectionStateByKey = {};
    return super.refresh();
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<SelectionColumnHeadersView> => class ColumnHeaderViewSelectionTreeListExtender
  extends selectionColumnHeadersViewExtender(Base) {
  protected declare _columnsController: TreeListColumnsController;

  protected _processTemplate(
    template: ColumnTemplateSource,
    options: TemplateModel,
  ): ColumnViewTemplate {
    const renderingTemplate = super._processTemplate(template, options);
    const firstDataColumnIndex = this._columnsController.getFirstDataColumnIndex();

    if (renderingTemplate && options.rowType === 'header' && options.column?.index === firstDataColumnIndex) {
      return {
        render: (templateOptions: ColumnViewTemplateOptions): void => {
          // NOTE: Template may be attached with "prepend"
          // Therefore, to have "select all" checkbox as first element
          // We should render template first
          renderingTemplate.render(templateOptions);

          if (this.option('selection.mode') === 'multiple') {
            this.renderSelectAll(templateOptions.container, templateOptions.model);
          }
        },
      };
    }

    return renderingTemplate;
  }

  public override renderSelectAllCheckBox(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    const $checkboxWrapper = $('<div>')
      .addClass(CLASSES.selectCheckboxContainer);
    const $checkbox = this.createSelectAllCheckboxElement();

    $checkbox.appendTo($checkboxWrapper);
    // NOTE: It's important to have checkbox as first child inside <td>
    $checkboxWrapper.prependTo($container);

    return $checkbox;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private renderSelectAll($cell: dxElementWrapper, options: TemplateModel): void {
    $cell.addClass(CLASSES.selectAll);

    this.renderSelectAllCheckBox($cell);
  }

  protected _isSortableElement($target: dxElementWrapper): boolean {
    return super._isSortableElement($target) && !$target.closest(`.${SELECT_CHECKBOX_CLASS}`).length;
  }
};

const rowsView = (
  Base: ModuleType<TreeListRowsView>,
): ModuleType<TreeListRowsView> => class TreeListSelectionRowsViewExtender
  extends selectionRowsViewExtender(Base) {
  protected _renderIcons(
    $container: dxElementWrapper,
    options: SelectionCellOptions & TreeListNodeCellOptions,
  ): dxElementWrapper {
    const $iconContainer = super._renderIcons($container, options);
    const isMultipleSelection = this.option('selection.mode') === 'multiple';

    if (!options.row.isNewRow && isMultipleSelection) {
      const $checkboxWrapper = $('<div>').addClass(CLASSES.selectCheckboxContainer);
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
