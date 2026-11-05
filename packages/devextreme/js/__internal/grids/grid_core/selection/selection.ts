/* eslint-disable max-classes-per-file */
import type { SingleMultipleOrNone } from '@js/common';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import type { LoadOptions } from '@js/common/data.types';
import { applyBatch } from '@js/common/data/array_utils';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import type { DxEvent } from '@js/events';
import errors from '@js/ui/widget/ui.errors';
import supportUtils from '@ts/core/utils/support';
import type { StoreKey } from '@ts/data/abstract_store';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/column_headers';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ContextMenuController } from '@ts/grids/grid_core/context_menu/context_menu';
import type { ContextMenuPreparingOptions } from '@ts/grids/grid_core/context_menu/types';
import type { CustomLoadResult } from '@ts/grids/grid_core/data_source_adapter/custom_loader';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import type { StateStoringController } from '@ts/grids/grid_core/state_storing/state_storing_controller_core';
import type {
  InternalGrid, ModuleType, OptionChanged, RowKey,
} from '@ts/grids/grid_core/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ViewRowEvent } from '@ts/grids/grid_core/views/types';
import Selection from '@ts/ui/selection/selection';
import type { SelectionChangeEvent, SelectionFilter, SelectionOptions } from '@ts/ui/selection/types';

import type { DataController } from '../data_controller/data_controller';
import type { DataChange, ProcessedItem } from '../data_controller/types';
import type { DataSourceController } from '../data_source/data_source_controller';
import { isEditRow } from '../keyboard_navigation/utils';
import modules from '../modules/modules';
import gridCoreUtils, { isInfiniteMode, isVirtualPaging } from '../utils';
import {
  CHECKBOXES_HIDDEN_CLASS,
  COMMAND_SELECT_CLASS,
  EDITOR_CELL_CLASS,
  ROW_SELECTION_CLASS,
  SELECT_CHECKBOX_CLASS,
  SELECTION_DISABLED_CLASS,
  SELECTION_MODE,
  SHOW_CHECKBOXES_MODE,
} from './const';
import type {
  SelectCheckBoxOptions,
  SelectionCellOptions,
  SelectionChangedArgs,
  SelectionChangedOptions,
  SelectionColumnHeadersView,
  SelectionHeaderCellOptions,
  SelectionModifierKeys,
  SelectionRowsView,
} from './types';

const processLongTap = (
  that: Pick<InternalGrid, 'getView' | 'getController' | 'option'>,
  dxEvent: DxEvent,
): void => {
  // TODO getView
  const rowsView = that.getView('rowsView');
  // TODO getController
  const selectionController = that.getController('selection');
  const $row = $(dxEvent.target).closest(`.${VIEW_CLASSES.dataRow}`);
  const rowIndex = rowsView.getRowIndex($row);

  if (rowIndex < 0) return;

  if (that.option(SHOW_CHECKBOXES_MODE) === 'onLongTap') {
    if (selectionController.isSelectionWithCheckboxes()) {
      selectionController.stopSelectionWithCheckboxes();
    } else {
      selectionController.startSelectionWithCheckboxes();
    }
  } else {
    if (that.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      selectionController.startSelectionWithCheckboxes();
    }
    if (that.option(SHOW_CHECKBOXES_MODE) !== 'always') {
      selectionController.changeItemSelection(rowIndex, { control: true });
    }
  }
};

const selectionCellTemplate = (
  container: DxElement,
  options: SelectionCellOptions,
): void => {
  const { component } = options;
  // TODO getView
  const rowsView = component.getView('rowsView') as SelectionRowsView;

  if (component.option('renderAsync') && !component.option('selection.deferred')) {
    options.value = component.isRowSelected(options.row.key);
  }

  rowsView.renderSelectCheckBoxContainer($(container), options);
};

const selectionHeaderTemplate = (
  container: DxElement,
  options: SelectionHeaderCellOptions,
): void => {
  const { column, component } = options;
  const $cellElement = $(container);
  // TODO getView
  const columnHeadersView = component.getView('columnHeadersView') as SelectionColumnHeadersView;

  $cellElement.addClass(EDITOR_CELL_CLASS);
  columnHeadersView.renderSelectAllCheckBox($cellElement, column);
  columnHeadersView.attachSelectAllCheckBoxClickEvent($cellElement);
};

export class SelectionController extends modules.Controller {
  protected _dataController!: DataController;

  protected dataSourceController!: DataSourceController;

  private _columnsController!: ColumnsController;

  protected _stateStoringController!: StateStoringController;

  private _selectionMode?: SingleMultipleOrNone;

  private _isSelectionWithCheckboxes!: boolean;

  private _selection!: Selection;

  public selectionChanged!: Callback<[SelectionChangedArgs]>;

  private _selectedItemsInternalChange?: boolean;

  private _dataPushedHandler?: (changes: StoreChange[]) => void;

  public init(): void {
    const { deferred, selectAllMode, mode } = this.option('selection') ?? {};
    if (isInfiniteMode(this.option('scrolling')) && !deferred && mode === 'multiple' && selectAllMode === 'allPages') {
      errors.log('W1018');
    }

    this._dataController = this.getController('data');
    this.dataSourceController = this.getController('dataSource');
    this._columnsController = this.getController('columns');
    this._stateStoringController = this.getController('stateStoring');
    this._selectionMode = mode;
    this._isSelectionWithCheckboxes = false;

    this._selection = this._createSelection();
    this._updateSelectColumn();
    this.createAction('onSelectionChanged', { excludeValidators: ['disabled', 'readOnly'] });

    if (!this._dataPushedHandler) {
      this._dataPushedHandler = this._handleDataPushed.bind(this);
      this.dataSourceController.pushed.add(this._dataPushedHandler);
    }
  }

  private _handleDataPushed(changes: StoreChange[]): void {
    this._deselectRemovedOnPush(changes);
    this._updateSelectedOnPush(changes);
  }

  private _deselectRemovedOnPush(changes: StoreChange[]): void {
    const isDeferredSelection = this.option('selection.deferred');

    let removedKeys = changes
      .filter((change) => change.type === 'remove')
      .map((change): RowKey => change.key);

    if (isDeferredSelection) {
      const selectedKeys = this._dataController.items()
        .filter((item) => item.isSelected)
        .map((item) => item.key);

      removedKeys = removedKeys
        .filter((key) => selectedKeys.find((selectedKey) => equalByValue(selectedKey, key)));
    }

    if (removedKeys.length) {
      this.deselectRows(removedKeys);
    }
  }

  private _updateSelectedOnPush(changes: StoreChange[]): void {
    const isDeferredSelection = this.option('selection.deferred');

    if (isDeferredSelection) {
      return;
    }

    const updateChanges = changes.filter((change) => change.type === 'update');
    const data = this.getSelectedRowsData();

    if (!Array.isArray(data)) {
      return;
    }

    applyBatch({
      keyInfo: this._selection.options,
      data,
      changes: updateChanges,
    });
  }

  /**
   * @extended: TreeList's selection
   */
  protected _getSelectionConfig(): Partial<SelectionOptions> {
    const dataController = this._dataController;
    const { dataSourceController } = this;
    const columnsController = this._columnsController;
    const selectionOptions = this.option('selection') ?? {};
    const { deferred } = selectionOptions;
    const virtualPaging = isVirtualPaging(this.option('scrolling'));
    const allowSelectAll = this.option('selection.allowSelectAll');
    const legacyScrollingMode = this.option('scrolling.legacyMode');

    return {
      selectedKeys: this.option('selectedRowKeys') ?? [],
      mode: this._selectionMode,
      deferred,
      alwaysSelectByShift: selectionOptions.alwaysSelectByShift,
      maxFilterLengthInRequest: selectionOptions.maxFilterLengthInRequest,
      // @ts-expect-error poorly typed SelectionOptions
      selectionFilter: this.option('selectionFilter') ?? [],
      ignoreDisabledItems: true,
      isVirtualPaging: virtualPaging,
      sensitivity: this.option('selection.sensitivity'),
      allowLoadByRange(): boolean | undefined {
        const hasGroupColumns = columnsController.getGroupColumns().length > 0;
        return virtualPaging && !legacyScrollingMode && !hasGroupColumns
          && allowSelectAll && !deferred;
      },
      key(): StoreKey | undefined {
        return dataSourceController.key();
      },
      keyOf(item): RowKey | undefined {
        return dataSourceController.keyOf(item);
      },
      dataFields(): StoreLoadOptions['select'] {
        return dataSourceController.select();
      },
      load(options): DeferredObj<CustomLoadResult | RawItemData[]> {
        // @ts-expect-error the custom loader is typed for StoreLoadOptions
        return dataSourceController.getAdapter()?.customLoader.load(options)
          ?? Deferred<CustomLoadResult | RawItemData[]>().resolve([]);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      plainItems(cached?): ProcessedItem[] {
        return dataController.items(true);
      },
      isItemSelected(item): boolean {
        return !!item.selected;
      },
      isSelectableItem(item): boolean {
        return item?.rowType === 'data' && !item.isNewRow;
      },
      getItemData(item?: ProcessedItem): RawItemData | ProcessedItem | undefined {
        return isDefined(item?.rowType) ? item?.oldData ?? item?.data : item;
      },
      // @ts-expect-error poorly typed SelectionOptions
      filter(): DataFilter {
        return dataController.getCombinedFilter(deferred);
      },
      totalCount: () => dataSourceController.totalCount(),
      getLoadOptions(loadItemIndex, focusedItemIndex, shiftItemIndex): LoadOptions {
        const { sort, filter } = dataSourceController.lastLoadOptions();
        let minIndex = Math.min(loadItemIndex, focusedItemIndex);
        let maxIndex = Math.max(loadItemIndex, focusedItemIndex);

        if (isDefined(shiftItemIndex)) {
          minIndex = Math.min(shiftItemIndex, minIndex);
          maxIndex = Math.max(shiftItemIndex, maxIndex);
        }

        const take = maxIndex - minIndex + 1;

        return {
          skip: minIndex,
          take,
          filter,
          sort,
        };
      },
      onSelectionChanged: this._updateSelectedItems.bind(this),
    };
  }

  protected _updateSelectColumn(): void {
    const columnsController = this._columnsController;
    const isSelectColumnVisible = this.isSelectColumnVisible();

    columnsController.addCommandColumn({
      type: 'selection',
      command: 'select',
      visible: isSelectColumnVisible,
      visibleIndex: -1,
      dataType: 'boolean',
      alignment: 'center',
      cssClass: COMMAND_SELECT_CLASS,
      width: 'auto',
      cellTemplate: selectionCellTemplate,
      headerCellTemplate: selectionHeaderTemplate,
    });

    columnsController.columnOption('command:select', 'visible', isSelectColumnVisible);
  }

  private _createSelection(): Selection {
    const options = this._getSelectionConfig();

    return new Selection(options);
  }

  /**
   * @extended: state_storing, TreeList's selection
   */
  protected _fireSelectionChanged(options?: SelectionChangedOptions): void {
    const argument = this.option('selection.deferred')
      ? { selectionFilter: this.option('selectionFilter') }
      : { selectedRowKeys: this.option('selectedRowKeys') };

    this.selectionChanged.fire(argument);

    if (options) {
      this.executeAction('onSelectionChanged', options);
    }
  }

  public _updateCheckboxesState(options: {
    selectionFilter?: SelectionFilter;
    selectedItemKeys?: unknown[];
    removedItemKeys?: unknown[];
  }): void {
    if (this.option(SHOW_CHECKBOXES_MODE) !== 'onClick') {
      return;
    }

    const isDeferredMode = this.option('selection.deferred');
    const { selectionFilter } = options;
    const selectedItemKeysLength = options.selectedItemKeys?.length ?? 0;
    const removedItemKeysLength = options.removedItemKeys?.length ?? 0;

    const hasSeveralItemsSelected = isDeferredMode
      ? !!selectionFilter && this.isSeveralRowsSelected(selectionFilter)
      : selectedItemKeysLength > 1;

    const hasNoItemsSelected = isDeferredMode
      ? !!selectionFilter && selectionFilter.length === 0
      : selectedItemKeysLength === 0 && removedItemKeysLength > 0;

    if (hasSeveralItemsSelected) {
      this.startSelectionWithCheckboxes();
    } else if (hasNoItemsSelected) {
      this.stopSelectionWithCheckboxes();
    }
  }

  private isSeveralRowsSelected(selectionFilter: SelectionFilter): boolean {
    let keyIndex = 0;
    const key = this.dataSourceController.store()?.key();
    const isComplexKey = Array.isArray(key);

    if (!selectionFilter.length) {
      return false;
    }

    if (!isComplexKey || !Array.isArray(selectionFilter[0]) || selectionFilter[1] !== 'and') {
      return key !== selectionFilter[0];
    }

    for (const condition of selectionFilter) {
      if (Array.isArray(condition)) {
        if (condition[0] !== key[keyIndex] || condition[1] !== '=') {
          return true;
        }
        keyIndex += 1;
      }
    }
    return false;
  }

  /**
   * @extended: TreeList's selection
   */
  protected _updateSelectedItems(e: SelectionChangeEvent<unknown, unknown>): void {
    const isDeferredMode = this.option('selection.deferred');
    const selectionFilter = this._selection.selectionFilter();
    const dataController = this._dataController;
    const items = dataController.items(true);
    const visibleItems = dataController.items();

    if (!items) {
      return;
    }

    const isSelectionWithCheckboxes = this.isSelectionWithCheckboxes();
    const changedItemIndexes = this.getChangedItemIndexes(items);
    const visibleChangedItemIndexes = this.getChangedItemIndexes(visibleItems);

    this._updateCheckboxesState({
      selectedItemKeys: e.selectedItemKeys,
      removedItemKeys: e.removedItemKeys,
      selectionFilter,
    });

    if (changedItemIndexes.length
      || (isSelectionWithCheckboxes !== this.isSelectionWithCheckboxes())) {
      dataController.updateItems({
        changeType: 'updateSelection',
        itemIndexes: visibleChangedItemIndexes,
      });
    }

    if (isDeferredMode) {
      this.option('selectionFilter', selectionFilter);
      this._fireSelectionChanged({});
    } else if (e.addedItemKeys.length || e.removedItemKeys.length) {
      this._selectedItemsInternalChange = true;
      this.option('selectedRowKeys', e.selectedItemKeys.slice(0));
      this._selectedItemsInternalChange = false;
      this._fireSelectionChanged({
        selectedRowsData: e.selectedItems.slice(0),
        selectedRowKeys: e.selectedItemKeys.slice(0),
        currentSelectedRowKeys: e.addedItemKeys.slice(0),
        currentDeselectedRowKeys: e.removedItemKeys.slice(0),
      });
    } else {
      this._fireSelectionChanged();
    }
  }

  private getChangedItemIndexes(items: ProcessedItem[]): number[] {
    const itemIndexes: number[] = [];
    const isDeferredSelection = this.option('selection.deferred');

    for (let i = 0, { length } = items; i < length; i += 1) {
      const row = items[i];
      const isItemSelected = this.isRowSelected(isDeferredSelection ? row.data : row.key);

      if (this._selection.isDataItem(row) && row.isSelected !== isItemSelected) {
        itemIndexes.push(i);
      }
    }

    return itemIndexes;
  }

  protected callbackNames(): string[] {
    return ['selectionChanged'];
  }

  public optionChanged(args: OptionChanged): void {
    super.optionChanged(args);

    const selectionOptionsExists = !!this._selection?.options;

    switch (args.name) {
      case 'selection': {
        const oldSelectionMode = this._selectionMode;

        this.init();

        if (selectionOptionsExists && args.fullName === 'selection.sensitivity') {
          this._selection.options.sensitivity = args.value;
        }

        if (args.fullName !== 'selection.showCheckBoxesMode') {
          const selectionMode = this._selectionMode;
          const isModeChanged = oldSelectionMode !== selectionMode;
          let selectedRowKeys = this.option('selectedRowKeys') ?? [];

          if (isModeChanged && selectionMode === 'single' && selectedRowKeys.length > 1) {
            selectedRowKeys = [selectedRowKeys[0]];
          }
          if (isModeChanged && selectionMode !== 'single' && selectionMode !== 'multiple') {
            selectedRowKeys = [];
          }

          this.selectRows(selectedRowKeys).always(() => {
            this._fireSelectionChanged();
          });
        } else {
          this.refresh().always(() => {
            this._fireSelectionChanged();
          });
        }

        this._columnsController.updateColumns();
        args.handled = true;
        break;
      }
      case 'selectionFilter':
        // @ts-expect-error poorly typed SelectionOptions
        this._selection.selectionFilter(args.value);
        args.handled = true;
        break;
      case 'selectedRowKeys': {
        const value = args.value || [];
        if (Array.isArray(value) && !this._selectedItemsInternalChange
          && (this.component.getDataSource() || !value.length)) {
          this.selectRows(value);
        }
        args.handled = true;
        break;
      }
      default:
        break;
    }
  }

  public publicMethods(): string[] {
    return ['selectRows', 'deselectRows', 'selectRowsByIndexes', 'getSelectedRowKeys', 'getSelectedRowsData', 'clearSelection', 'selectAll', 'deselectAll', 'startSelectionWithCheckboxes', 'stopSelectionWithCheckboxes', 'isRowSelected'];
  }

  public isRowSelected(arg: RowKey | RawItemData): boolean | undefined {
    return this._selection.isItemSelected(arg);
  }

  public isSelectColumnVisible(): boolean {
    return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this.option(SHOW_CHECKBOXES_MODE) === 'onClick' || this._isSelectionWithCheckboxes);
  }

  private _isOnePageSelectAll(): boolean {
    return this.option('selection.selectAllMode') === 'page';
  }

  public isSelectAll(): boolean | undefined {
    return this._selection.getSelectAllState(this._isOnePageSelectAll());
  }

  /**
   * @extended: TreeList's selection
   */
  public selectAll(): DeferredObj<unknown> {
    if (this.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      this.startSelectionWithCheckboxes();
    }

    return this._selection.selectAll(this._isOnePageSelectAll());
  }

  /**
   * @extended: TreeList's selection
   */
  public deselectAll(): DeferredObj<unknown> {
    return this._selection.deselectAll(this._isOnePageSelectAll());
  }

  private clearSelection(): DeferredObj<unknown> {
    return this.selectedItemKeys([]);
  }

  public refresh(): DeferredObj<unknown> {
    const selectedRowKeys = this.option('selectedRowKeys') ?? [];

    if (!this.option('selection.deferred') && selectedRowKeys.length) {
      return this.selectedItemKeys(selectedRowKeys);
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return Deferred().resolve().promise();
  }

  protected selectedItemKeys(
    value: RowKey[],
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
  ): DeferredObj<unknown[]> {
    return this._selection.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getSelectedRowKeys(mode?: string): RowKey[] | Promise<RowKey[]> {
    return this._selection.getSelectedItemKeys();
  }

  /**
   * @extended: TreeList's selection
   */
  protected selectRows(keys: RowKey[], preserve?: boolean): DeferredObj<unknown> {
    return this.selectedItemKeys(keys, preserve);
  }

  protected deselectRows(keys: RowKey[]): DeferredObj<unknown> {
    return this.selectedItemKeys(keys, true, true);
  }

  private selectRowsByIndexes(
    indexes: number[] | number,
    ...restIndexes: number[]
  ): DeferredObj<unknown> {
    const items = this._dataController.items();
    const keys: RowKey[] = [];
    const itemIndexes = Array.isArray(indexes) ? indexes : [indexes, ...restIndexes];

    each(itemIndexes, (_, itemIndex) => {
      const item = items[itemIndex];
      if (item?.rowType === 'data') {
        keys.push(item.key);
      }
    });
    return this.selectRows(keys);
  }

  /**
   * @extended: TreeList's selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getSelectedRowsData(mode?: string): RawItemData[] | Promise<RawItemData[]> {
    return this._selection.getSelectedItems();
  }

  public loadSelectedItemsWithFilter(): DeferredObj<unknown> {
    return this._selection.loadSelectedItemsWithFilter();
  }

  public changeItemSelection(
    visibleItemIndex: number,
    keys?: SelectionModifierKeys,
    setFocusOnly?: boolean,
  ): boolean | DeferredObj<unknown> | undefined {
    const modifierKeys = keys ?? {};
    if (this.isSelectionWithCheckboxes()) {
      modifierKeys.control = true;
    }
    const loadedItemIndex = visibleItemIndex
      + this._dataController.getRowIndexOffset()
      - this._dataController.getRowIndexOffset(true);
    return this._selection.changeItemSelection(loadedItemIndex, modifierKeys, setFocusOnly);
  }

  public focusedItemIndex(): number;
  public focusedItemIndex(itemIndex: number): void;
  public focusedItemIndex(itemIndex?: number): number | undefined {
    if (isDefined(itemIndex)) {
      this._selection._focusedItemIndex = itemIndex;
    } else {
      return this._selection._focusedItemIndex;
    }

    return undefined;
  }

  public isSelectionWithCheckboxes(): boolean {
    return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this._isSelectionWithCheckboxes);
  }

  public startSelectionWithCheckboxes(): boolean {
    if (this.option(SELECTION_MODE) === 'multiple' && !this.isSelectionWithCheckboxes()) {
      this._isSelectionWithCheckboxes = true;
      this._updateSelectColumn();
      return true;
    }
    return false;
  }

  public stopSelectionWithCheckboxes(): boolean {
    if (this._isSelectionWithCheckboxes) {
      this._isSelectionWithCheckboxes = false;
      this._updateSelectColumn();
      return true;
    }
    return false;
  }
}

export const selectionContextMenuControllerExtender = (
  Base: ModuleType<ContextMenuController>,
): ModuleType<ContextMenuController> => class SelectionContextMenuControllerExtender extends Base {
  protected _contextMenuPrepared(options: ContextMenuPreparingOptions): void {
    const { event, items } = options;

    if (
      (event.originalEvent && event.originalEvent.type !== 'dxhold')
      || !!items?.length
    ) {
      return;
    }

    processLongTap(this, event);
  }
};

export const selectionColumnHeadersViewExtender = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<SelectionColumnHeadersView> => class SelectionColumnHeadersViewExtender extends Base {
  public init(): void {
    super.init();
    this._selectionController.selectionChanged.add(this._updateSelectAllValue.bind(this));
  }

  private _isSelectAllCheckBoxVisible(): boolean {
    const isEmptyData = this._dataController.isEmpty();
    const allowSelectAll = this.option('selection.allowSelectAll');
    const isSelectAll = this._selectionController.isSelectAll();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return !isEmptyData && (allowSelectAll || isSelectAll !== false);
  }

  private _updateSelectAllValue(): void {
    const $element = this.element();
    const $editor = $element?.find(`.${SELECT_CHECKBOX_CLASS}`);

    if ($element && $editor?.length && this.option('selection.mode') === 'multiple') {
      const selectAllValue = this._selectionController.isSelectAll();
      const isVisible = this._isSelectAllCheckBoxVisible();

      // @ts-expect-error dxCheckBox is added to the renderer at runtime
      $editor.dxCheckBox('instance').option({
        visible: isVisible,
        value: selectAllValue,
      });
    }
  }

  protected _handleDataChanged(e: DataChange): void {
    super._handleDataChanged(e);

    if (!e || e.changeType === 'refresh' || (e.repaintChangesOnly && e.changeType === 'update')) {
      this.waitAsyncTemplates().done(() => {
        this._updateSelectAllValue();
      });
    }
  }

  public renderSelectAllCheckBox(
    $container: dxElementWrapper,
    column?: Column,
  ): dxElementWrapper {
    const $checkbox = this.createSelectAllCheckboxElement(column);
    $checkbox.appendTo($container);

    return $checkbox;
  }

  public createSelectAllCheckboxElement(
    column?: Column,
  ): dxElementWrapper {
    const $groupElement = $('<div>')
      .addClass(SELECT_CHECKBOX_CLASS);

    this.setAria('label', messageLocalization.format('dxDataGrid-ariaSelectAll'), $groupElement);

    this._editorFactoryController.createEditor($groupElement, extend({}, column, {
      parentType: 'headerRow',
      dataType: 'boolean',
      value: this._selectionController.isSelectAll(),
      editorOptions: {
        visible: this._isSelectAllCheckBoxVisible(),
      },
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      tabIndex: this.option('useLegacyKeyboardNavigation') ? -1 : this.option('tabIndex') || 0,
      setValue: (value, e) => {
        const allowSelectAll = this.option('selection.allowSelectAll');
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        e.component.option('visible', allowSelectAll || e.component.option('value') !== false);

        if (!e.event || this._selectionController.isSelectAll() === value) {
          return;
        }

        if (e.value && !allowSelectAll) {
          e.component.option('value', false);
        } else if (e.value) {
          this._selectionController.selectAll();
        } else {
          this._selectionController.deselectAll();
        }

        e.event.preventDefault();
      },
    }));

    return $groupElement;
  }

  public attachSelectAllCheckBoxClickEvent($element: dxElementWrapper): void {
    eventsEngine.on($element, clickEventName, this.createAction((e) => {
      const { event } = e;

      if (!this._isSelectAllCheckBoxVisible()) {
        event.preventDefault();
        return;
      }

      if (!$(event.target).closest(`.${SELECT_CHECKBOX_CLASS}`).length) {
        // @ts-expect-error eventsEngine.trigger is not fully typed
        eventsEngine.trigger($(event.currentTarget).children(`.${SELECT_CHECKBOX_CLASS}`), clickEventName);
      }
      event.preventDefault();
    }));
  }
};

export const selectionRowsViewExtender = <TBase extends ModuleType<RowsView>>(
  Base: TBase,
): TBase & ModuleType<SelectionRowsView> => class SelectionRowsViewExtender extends Base {
  public renderSelectCheckBoxContainer(
    $container: dxElementWrapper,
    options: SelectionCellOptions,
  ): void {
    if (options.rowType === 'data' && !options.row.isNewRow) {
      $container.addClass(EDITOR_CELL_CLASS);
      this.attachCheckBoxClickEvent($container);

      this.renderSelectCheckBox($container, options);
    } else {
      gridCoreUtils.setEmptyText($container);
    }
  }

  public renderSelectCheckBox(
    container: dxElementWrapper,
    options: SelectCheckBoxOptions,
  ): dxElementWrapper {
    const groupElement = $('<div>')
      .addClass(SELECT_CHECKBOX_CLASS)
      .appendTo(container);

    this.setAria('label', messageLocalization.format('dxDataGrid-ariaSelectRow'), groupElement);

    this._editorFactoryController.createEditor(groupElement, extend({}, options.column, {
      parentType: 'dataRow',
      dataType: 'boolean',
      lookup: null,
      value: options.value,
      setValue(value, e) {
        if (e?.event?.type === 'keydown') {
          // @ts-expect-error eventsEngine.trigger is not fully typed
          eventsEngine.trigger(e.element, clickEventName, e);
        }
      },
      row: options.row,
    }));

    return groupElement;
  }

  public attachCheckBoxClickEvent($element: dxElementWrapper): void {
    eventsEngine.on($element, clickEventName, this.createAction((e) => {
      const { event } = e;
      const rowIndex = this.getRowIndex($(event.currentTarget).closest(`.${VIEW_CLASSES.row}`));

      if (rowIndex >= 0) {
        this._selectionController.startSelectionWithCheckboxes();
        this._selectionController.changeItemSelection(rowIndex, { shift: event.shiftKey });

        if ($(event.target).closest(`.${SELECT_CHECKBOX_CLASS}`).length) {
          this._dataController.updateItems({
            changeType: 'updateSelection',
            itemIndexes: [rowIndex],
          });
        }
      }
    }));
  }

  protected _update(change: DataChange): void {
    const tableElements = this.getTableElements();

    if (change.changeType === 'updateSelection') {
      if (tableElements.length === 0 || !change.items) {
        return;
      }

      const changeItems = change.items;

      each(tableElements, (_, tableElement) => {
        change.itemIndexes.forEach((index) => {
          const changeItem = changeItems[index];
          const $row = this._getRowElements($(tableElement)).eq(index);

          // T108078
          if (!changeItem || !$row.length) {
            return;
          }

          const { isSelected } = changeItem;
          const needSelectionClass = Boolean(isSelected) && !isEditRow($row);

          $row
            .toggleClass(ROW_SELECTION_CLASS, needSelectionClass)
            // @ts-expect-error dxCheckBox is added to the renderer at runtime
            .find(`.${SELECT_CHECKBOX_CLASS}`).dxCheckBox('option', 'value', isSelected);
          this.setAria('selected', String(isSelected), $row);
        });
      });

      this._updateCheckboxesClass();
    } else {
      super._update(change);
    }
  }

  protected _createTable(columns?: Column[], isAppend?: boolean): dxElementWrapper {
    const selectionMode = this.option('selection.mode');
    const $table = super._createTable(columns, isAppend);

    if (selectionMode !== 'none') {
      if (this.option(SHOW_CHECKBOXES_MODE) === 'onLongTap' || !supportUtils.touch) {
        // TODO Not working timeout by hold when it is larger than other timeouts by hold
        eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), `.${VIEW_CLASSES.dataRow}`, this.createAction((e) => {
          processLongTap(this.component, e.event);

          e.event.stopPropagation();
        }));
      }
      eventsEngine.on($table, 'mousedown selectstart', this.createAction((e) => {
        const { event } = e;

        if (event.shiftKey) {
          event.preventDefault();
        }
      }));
    }

    return $table;
  }

  protected _createRow(row?: ProcessedItem, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (row) {
      const { isSelected } = row;
      if (isSelected) {
        $row.addClass(ROW_SELECTION_CLASS);
      }

      const selectionMode = this.option(SELECTION_MODE);
      if (selectionMode !== 'none') {
        this.setAria('selected', String(isSelected), $row);
      }
    }

    return $row;
  }

  /**
   * @extended: TreeList's selection
   */
  public handleRowClickBySelection(e: ViewRowEvent): void {
    const dxEvent = e.event;
    const isSelectionDisabled = $(dxEvent.target).closest(`.${SELECTION_DISABLED_CLASS}`).length;

    if (!isSelectionDisabled && (this.option(SELECTION_MODE) !== 'multiple' || this.option(SHOW_CHECKBOXES_MODE) !== 'always')) {
      if (this._selectionController.changeItemSelection(e.rowIndex, {
        control: isCommandKeyPressed(dxEvent),
        shift: dxEvent.shiftKey,
      })) {
        dxEvent.preventDefault();
        e.handled = true;
      }
    }
  }

  protected _rowClick(e: ViewRowEvent): void {
    if (!this.isClickableElement($(e.event.target))) {
      this.handleRowClickBySelection(e);
      super._rowClick(e);
    }
  }

  private isClickableElement($target: dxElementWrapper): boolean {
    const isCommandSelect = $target.closest(`.${COMMAND_SELECT_CLASS}`).length;

    return !!isCommandSelect;
  }

  protected _renderCore(change?: DataChange): DeferredObj<unknown> {
    const deferred = super._renderCore(change);
    this._updateCheckboxesClass();
    return deferred;
  }

  private _updateCheckboxesClass(): void {
    const tableElements = this.getTableElements();
    const isCheckBoxesHidden = this._selectionController.isSelectColumnVisible()
      && !this._selectionController.isSelectionWithCheckboxes();

    each(tableElements, (_, tableElement) => {
      $(tableElement).toggleClass(CHECKBOXES_HIDDEN_CLASS, isCheckBoxesHidden);
    });
  }
};
