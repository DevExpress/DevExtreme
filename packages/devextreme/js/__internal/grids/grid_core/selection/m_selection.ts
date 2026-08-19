/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import { applyBatch } from '@js/common/data/array_utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import supportUtils from '@ts/core/utils/m_support';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ContextMenuController } from '@ts/grids/grid_core/context_menu/m_context_menu';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { StateStoringController } from '@ts/grids/grid_core/state_storing/state_storing_controller_core';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';
import Selection from '@ts/ui/selection/selection';
import type { SelectionChangeEvent, SelectionFilter, SelectionOptions } from '@ts/ui/selection/types';

import type { DataController } from '../data_controller/data_controller';
import type { DataChange } from '../data_controller/types';
import { isEditRow } from '../keyboard_navigation/utils';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
import {
  CHECKBOXES_HIDDEN_CLASS,
  COMMAND_SELECT_CLASS,
  DATA_ROW_CLASS,
  EDITOR_CELL_CLASS,
  ROW_CLASS,
  ROW_SELECTION_CLASS,
  SELECT_CHECKBOX_CLASS,
  SELECTION_DISABLED_CLASS,
  SELECTION_MODE,
  SHOW_CHECKBOXES_MODE,
} from './const';

const processLongTap = function (that, dxEvent) {
  // TODO getView
  const rowsView = that.getView('rowsView');
  // TODO getController
  const selectionController = that.getController('selection');
  const $row = $(dxEvent.target).closest(`.${DATA_ROW_CLASS}`);
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

const isSeveralRowsSelected = function (that, selectionFilter) {
  let keyIndex = 0;
  const store = that._dataController.store();
  const key = store?.key();
  const isComplexKey = Array.isArray(key);

  if (!selectionFilter.length) {
    return false;
  }

  if (isComplexKey && Array.isArray(selectionFilter[0]) && selectionFilter[1] === 'and') {
    for (let i = 0; i < selectionFilter.length; i++) {
      if (Array.isArray(selectionFilter[i])) {
        if (selectionFilter[i][0] !== key[keyIndex] || selectionFilter[i][1] !== '=') {
          return true;
        }
        keyIndex++;
      }
    }
    return false;
  }

  return key !== selectionFilter[0];
};

const selectionCellTemplate = (container, options) => {
  const { component } = options;
  // TODO getView
  const rowsView = component.getView('rowsView');

  if (component.option('renderAsync') && !component.option('selection.deferred')) {
    options.value = component.isRowSelected(options.row.key);
  }

  rowsView.renderSelectCheckBoxContainer($(container), options);
};

const selectionHeaderTemplate = (container, options) => {
  const { column } = options;
  const $cellElement = $(container);
  // TODO getView
  const columnHeadersView = options.component.getView('columnHeadersView');

  $cellElement.addClass(EDITOR_CELL_CLASS);
  columnHeadersView._renderSelectAllCheckBox($cellElement, column);
  columnHeadersView._attachSelectAllCheckBoxClickEvent($cellElement);
};

export class SelectionController extends modules.Controller {
  protected _dataController!: DataController;

  private _columnsController!: ColumnsController;

  protected _stateStoringController!: StateStoringController;

  private _selectionMode!: string;

  private _isSelectionWithCheckboxes?: boolean;

  private _selection!: Selection;

  public selectionChanged: any;

  private _selectedItemsInternalChange?: boolean;

  private _dataPushedHandler: any;

  public init() {
    // @ts-expect-error
    const { deferred, selectAllMode, mode } = this.option('selection') ?? {};
    if (this.option('scrolling.mode') === 'infinite' && !deferred && mode === 'multiple' && selectAllMode === 'allPages') {
      errors.log('W1018');
    }

    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._stateStoringController = this.getController('stateStoring');
    // mode has a default value
    this._selectionMode = mode!;
    this._isSelectionWithCheckboxes = false;

    this._selection = this._createSelection();
    this._updateSelectColumn();
    this.createAction('onSelectionChanged', { excludeValidators: ['disabled', 'readOnly'] });

    if (!this._dataPushedHandler) {
      this._dataPushedHandler = this._handleDataPushed.bind(this);
      this._dataController.pushed.add(this._dataPushedHandler);
    }
  }

  private _handleDataPushed(changes) {
    this._deselectRemovedOnPush(changes);
    this._updateSelectedOnPush(changes);
  }

  private _deselectRemovedOnPush(changes) {
    const isDeferredSelection = this.option('selection.deferred');

    let removedKeys = changes
      .filter((change) => change.type === 'remove')
      .map((change) => change.key);

    if (isDeferredSelection) {
      const selectedKeys = this._dataController.items()
        .filter((item) => item.isSelected)
        .map((item) => item.key);

      removedKeys = removedKeys
        .filter((key) => selectedKeys.find((selectedKey) => equalByValue(selectedKey, key)));
    }

    removedKeys.length && this.deselectRows(removedKeys);
  }

  private _updateSelectedOnPush(changes) {
    const isDeferredSelection = this.option('selection.deferred');

    if (isDeferredSelection) {
      return;
    }

    const updateChanges = changes.filter((change) => change.type === 'update');
    const data = this.getSelectedRowsData();

    applyBatch({
      keyInfo: this._selection.options,
      data,
      changes: updateChanges,
    } as any);
  }

  /**
   * @extended: TreeList's selection
   */
  protected _getSelectionConfig(): SelectionOptions {
    const dataController = this._dataController;
    const columnsController = this._columnsController;
    const selectionOptions: any = this.option('selection') ?? {};
    const { deferred } = selectionOptions;
    const scrollingMode = this.option('scrolling.mode');
    const virtualPaging = scrollingMode === 'virtual' || scrollingMode === 'infinite';
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
      allowLoadByRange() {
        const hasGroupColumns = columnsController.getGroupColumns().length > 0;
        return virtualPaging && !legacyScrollingMode && !hasGroupColumns && allowSelectAll && !deferred;
      },
      key() {
        return dataController?.key();
      },
      keyOf(item) {
        return dataController?.keyOf(item);
      },
      dataFields() {
        return dataController.dataSource()?.select();
      },
      load(options) {
        // @ts-expect-error
        return dataController.dataSource()?.load(options) || new Deferred().resolve([]);
      },
      // eslint-disable-next-line
      plainItems(cached?) {
        return dataController.items(true);
      },
      isItemSelected(item) {
        return item.selected;
      },
      isSelectableItem(item) {
        return item?.rowType === 'data' && !item.isNewRow;
      },
      getItemData(item) {
        return isDefined(item?.rowType) ? item?.oldData || item?.data : item;
      },
      // @ts-expect-error poorly typed SelectionOptions
      filter() {
        return dataController.getCombinedFilter(deferred);
      },
      totalCount: () => dataController.totalCount(),
      getLoadOptions(loadItemIndex, focusedItemIndex, shiftItemIndex) {
        const { sort, filter } = dataController.dataSource()?.lastLoadOptions() ?? {};
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

  protected _updateSelectColumn() {
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

  private _createSelection() {
    const options = this._getSelectionConfig();

    return new Selection(options);
  }

  /**
   * @extended: state_storing, TreeList's selection
   */
  protected _fireSelectionChanged(options?) {
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
      ? !!selectionFilter && isSeveralRowsSelected(this, selectionFilter)
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

  /**
   * @extended: TreeList's selection
   */
  protected _updateSelectedItems(e: SelectionChangeEvent<unknown, unknown>): void {
    const that = this;
    let selectionChangedOptions;
    const isDeferredMode = that.option('selection.deferred');
    const selectionFilter = that._selection.selectionFilter();
    const dataController = that._dataController;
    const items = dataController.items(true);
    const visibleItems = dataController.items();

    if (!items) {
      return;
    }

    const isSelectionWithCheckboxes = that.isSelectionWithCheckboxes();
    const changedItemIndexes = that.getChangedItemIndexes(items);
    const visibleChangedItemIndexes = that.getChangedItemIndexes(visibleItems);

    that._updateCheckboxesState({
      selectedItemKeys: e.selectedItemKeys,
      removedItemKeys: e.removedItemKeys,
      selectionFilter,
    });

    if (changedItemIndexes.length || (isSelectionWithCheckboxes !== that.isSelectionWithCheckboxes())) {
      dataController.updateItems({
        changeType: 'updateSelection',
        itemIndexes: visibleChangedItemIndexes,
      });
    }

    if (isDeferredMode) {
      that.option('selectionFilter', selectionFilter);
      selectionChangedOptions = {};
    } else if (e.addedItemKeys.length || e.removedItemKeys.length) {
      that._selectedItemsInternalChange = true;
      that.option('selectedRowKeys', e.selectedItemKeys.slice(0));
      that._selectedItemsInternalChange = false;
      selectionChangedOptions = {
        selectedRowsData: e.selectedItems.slice(0),
        selectedRowKeys: e.selectedItemKeys.slice(0),
        currentSelectedRowKeys: e.addedItemKeys.slice(0),
        currentDeselectedRowKeys: e.removedItemKeys.slice(0),
      };
    }

    that._fireSelectionChanged(selectionChangedOptions);
  }

  private getChangedItemIndexes(items) {
    const that = this;
    const itemIndexes: any[] = [];
    const isDeferredSelection = this.option('selection.deferred');

    for (let i = 0, { length } = items; i < length; i++) {
      const row = items[i];
      const isItemSelected = that.isRowSelected(isDeferredSelection ? row.data : row.key);

      if (that._selection.isDataItem(row) && row.isSelected !== isItemSelected) {
        itemIndexes.push(i);
      }
    }

    return itemIndexes;
  }

  protected callbackNames() {
    return ['selectionChanged'];
  }

  public optionChanged(args) {
    super.optionChanged(args);

    const selectionOptionsExists = !!this._selection?.options;

    // eslint-disable-next-line default-case
    switch (args.name) {
      case 'selection': {
        const oldSelectionMode = this._selectionMode;

        this.init();

        if (selectionOptionsExists && args.fullName === 'selection.sensitivity') {
          this._selection.options.sensitivity = args.value;
        }

        if (args.fullName !== 'selection.showCheckBoxesMode') {
          const selectionMode = this._selectionMode;
          let selectedRowKeys: any = this.option('selectedRowKeys');

          if (oldSelectionMode !== selectionMode) {
            if (selectionMode === 'single') {
              if (selectedRowKeys.length > 1) {
                selectedRowKeys = [selectedRowKeys[0]];
              }
            } else if (selectionMode !== 'multiple') {
              selectedRowKeys = [];
            }
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
        this._selection.selectionFilter(args.value);
        args.handled = true;
        break;
      case 'selectedRowKeys': {
        const value = args.value || [];
        if (Array.isArray(value) && !this._selectedItemsInternalChange && (this.component.getDataSource() || !value.length)) {
          this.selectRows(value);
        }
        args.handled = true;
        break;
      }
    }
  }

  public publicMethods() {
    return ['selectRows', 'deselectRows', 'selectRowsByIndexes', 'getSelectedRowKeys', 'getSelectedRowsData', 'clearSelection', 'selectAll', 'deselectAll', 'startSelectionWithCheckboxes', 'stopSelectionWithCheckboxes', 'isRowSelected'];
  }

  public isRowSelected(arg) {
    return this._selection.isItemSelected(arg);
  }

  public isSelectColumnVisible() {
    return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this.option(SHOW_CHECKBOXES_MODE) === 'onClick' || this._isSelectionWithCheckboxes);
  }

  private _isOnePageSelectAll() {
    return this.option('selection.selectAllMode') === 'page';
  }

  public isSelectAll() {
    return this._selection.getSelectAllState(this._isOnePageSelectAll());
  }

  /**
   * @extended: TreeList's selection
   */
  public selectAll() {
    if (this.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      this.startSelectionWithCheckboxes();
    }

    return this._selection.selectAll(this._isOnePageSelectAll());
  }

  /**
   * @extended: TreeList's selection
   */
  public deselectAll() {
    return this._selection.deselectAll(this._isOnePageSelectAll());
  }

  private clearSelection() {
    return this.selectedItemKeys([]);
  }

  public refresh() {
    const selectedRowKeys = this.option('selectedRowKeys') ?? [];

    if (!this.option('selection.deferred') && selectedRowKeys.length) {
      return this.selectedItemKeys(selectedRowKeys);
    }

    // @ts-expect-error
    return new Deferred().resolve().promise();
  }

  protected selectedItemKeys(value, preserve?, isDeselect?, isSelectAll?) {
    return this._selection.selectedItemKeys(value, preserve, isDeselect, isSelectAll);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getSelectedRowKeys(mode?) {
    return this._selection.getSelectedItemKeys();
  }

  /**
   * @extended: TreeList's selection
   */
  protected selectRows(keys, preserve?) {
    return this.selectedItemKeys(keys, preserve);
  }

  protected deselectRows(keys) {
    return this.selectedItemKeys(keys, true, true);
  }

  private selectRowsByIndexes(indexes) {
    const items = this._dataController.items();
    const keys: any[] = [];

    if (!Array.isArray(indexes)) {
      indexes = Array.prototype.slice.call(arguments, 0);
    }

    each(indexes, function () {
      const item = items[this];
      if (item && item.rowType === 'data') {
        keys.push(item.key);
      }
    });
    return this.selectRows(keys);
  }

  /**
   * @extended: TreeList's selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getSelectedRowsData(mode?) {
    return this._selection.getSelectedItems();
  }

  public loadSelectedItemsWithFilter() {
    return this._selection.loadSelectedItemsWithFilter();
  }

  public changeItemSelection(visibleItemIndex, keys, setFocusOnly?: boolean): boolean | DeferredObj<unknown> | undefined {
    keys = keys || {};
    if (this.isSelectionWithCheckboxes()) {
      keys.control = true;
    }
    const loadedItemIndex = visibleItemIndex + this._dataController.getRowIndexOffset() - this._dataController.getRowIndexOffset(true);
    return this._selection.changeItemSelection(loadedItemIndex, keys, setFocusOnly);
  }

  public focusedItemIndex(itemIndex) {
    const that = this;

    if (isDefined(itemIndex)) {
      that._selection._focusedItemIndex = itemIndex;
    } else {
      return that._selection._focusedItemIndex;
    }

    return undefined;
  }

  public isSelectionWithCheckboxes() {
    return this.option(SELECTION_MODE) === 'multiple' && (this.option(SHOW_CHECKBOXES_MODE) === 'always' || this._isSelectionWithCheckboxes);
  }

  public startSelectionWithCheckboxes() {
    const that = this;

    if (that.option(SELECTION_MODE) === 'multiple' && !that.isSelectionWithCheckboxes()) {
      that._isSelectionWithCheckboxes = true;
      that._updateSelectColumn();
      return true;
    }
    return false;
  }

  private stopSelectionWithCheckboxes() {
    const that = this;

    if (that._isSelectionWithCheckboxes) {
      that._isSelectionWithCheckboxes = false;
      that._updateSelectColumn();
      return true;
    }
    return false;
  }
}

export const selectionContextMenuControllerExtender = (Base: ModuleType<ContextMenuController>) => class SelectionContextMenuControllerExtender extends Base {
  protected _contextMenuPrepared(options) {
    const dxEvent = options.event;

    if (dxEvent.originalEvent && dxEvent.originalEvent.type !== 'dxhold' || options.items && options.items.length > 0) return;

    processLongTap(this, dxEvent);
  }
};

export const selectionColumnHeadersViewExtender = (Base: ModuleType<ColumnHeadersView>) => class SelectionColumnHeadersViewExtender extends Base {
  public init() {
    super.init();
    this._selectionController.selectionChanged.add(this._updateSelectAllValue.bind(this));
  }

  private _isSelectAllCheckBoxVisible() {
    const isEmptyData = this._dataController.isEmpty();
    const allowSelectAll = this.option('selection.allowSelectAll');
    const isSelectAll = this._selectionController.isSelectAll();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return !isEmptyData && (allowSelectAll || isSelectAll !== false);
  }

  private _updateSelectAllValue() {
    const that = this;
    const $element = that.element();
    const $editor = $element?.find(`.${SELECT_CHECKBOX_CLASS}`);

    if ($element && $editor.length && this.option('selection.mode') === 'multiple') {
      const selectAllValue = this._selectionController.isSelectAll();
      const isVisible = this._isSelectAllCheckBoxVisible();

      $editor.dxCheckBox('instance').option({
        visible: isVisible,
        value: selectAllValue,
      });
    }
  }

  protected _handleDataChanged(e) {
    super._handleDataChanged(e);

    if (!e || e.changeType === 'refresh' || (e.repaintChangesOnly && e.changeType === 'update')) {
      this.waitAsyncTemplates().done(() => {
        this._updateSelectAllValue();
      });
    }
  }

  protected _renderSelectAllCheckBox(
    $container: dxElementWrapper,
    column?: Column,
  ): dxElementWrapper {
    const $checkbox = this._createSelectAllCheckboxElement(column);
    $checkbox.appendTo($container);

    return $checkbox;
  }

  protected _createSelectAllCheckboxElement(
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
        } else {
          e.value ? this._selectionController.selectAll() : this._selectionController.deselectAll();
        }

        e.event.preventDefault();
      },
    }));

    return $groupElement;
  }

  private _attachSelectAllCheckBoxClickEvent($element) {
    eventsEngine.on($element, clickEventName, this.createAction((e) => {
      const { event } = e;

      if (!this._isSelectAllCheckBoxVisible()) {
        event.preventDefault();
        return;
      }

      if (!$(event.target).closest(`.${SELECT_CHECKBOX_CLASS}`).length) {
        // @ts-expect-error
        eventsEngine.trigger($(event.currentTarget).children(`.${SELECT_CHECKBOX_CLASS}`), clickEventName);
      }
      event.preventDefault();
    }));
  }
};

export const selectionRowsViewExtender = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class SelectionRowsViewExtender extends Base {
  private renderSelectCheckBoxContainer($container, options) {
    if (options.rowType === 'data' && !options.row.isNewRow) {
      $container.addClass(EDITOR_CELL_CLASS);
      this._attachCheckBoxClickEvent($container);

      this._renderSelectCheckBox($container, options);
    } else {
      gridCoreUtils.setEmptyText($container);
    }
  }

  private _renderSelectCheckBox(container, options) {
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
          // @ts-expect-error
          eventsEngine.trigger(e.element, clickEventName, e);
        }
      },
      row: options.row,
    }));

    return groupElement;
  }

  private _attachCheckBoxClickEvent($element) {
    eventsEngine.on($element, clickEventName, this.createAction(function (e) {
      const { event } = e;
      const rowIndex = this.getRowIndex($(event.currentTarget).closest(`.${ROW_CLASS}`));

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
    const that = this;
    const tableElements = that.getTableElements();

    if (change.changeType === 'updateSelection') {
      if (tableElements.length === 0 || !change.items) {
        return;
      }

      const changeItems = change.items;

      each(tableElements, (_, tableElement) => {
        change.itemIndexes.forEach((index) => {
          const changeItem = changeItems[index];
          const $row = that._getRowElements($(tableElement)).eq(index);

          // T108078
          if (!changeItem || !$row.length) {
            return;
          }

          const { isSelected } = changeItem;
          const needSelectionClass = Boolean(isSelected) && !isEditRow($row);

          $row
            .toggleClass(ROW_SELECTION_CLASS, needSelectionClass)
            .find(`.${SELECT_CHECKBOX_CLASS}`).dxCheckBox('option', 'value', isSelected);
          that.setAria('selected', String(isSelected), $row);
        });
      });

      that._updateCheckboxesClass();
    } else {
      super._update(change);
    }
  }

  protected _createTable() {
    const that = this;
    const selectionMode = that.option('selection.mode');
    const $table = super._createTable.apply(that, arguments as any);

    if (selectionMode !== 'none') {
      if (that.option(SHOW_CHECKBOXES_MODE) === 'onLongTap' || !supportUtils.touch) {
        // TODO Not working timeout by hold when it is larger than other timeouts by hold
        eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), `.${DATA_ROW_CLASS}`, that.createAction((e) => {
          processLongTap(that.component, e.event);

          e.event.stopPropagation();
        }));
      }
      eventsEngine.on($table, 'mousedown selectstart', that.createAction((e) => {
        const { event } = e;

        if (event.shiftKey) {
          event.preventDefault();
        }
      }));
    }

    return $table;
  }

  protected _createRow(row) {
    const $row = super._createRow.apply(this, arguments as any);

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

  public _rowClickForTreeList(e): void {
    super._rowClick(e);
  }

  protected _rowClick(e) {
    const that = this;
    const dxEvent = e.event;
    const isSelectionDisabled = $(dxEvent.target).closest(`.${SELECTION_DISABLED_CLASS}`).length;

    if (!that.isClickableElement($(dxEvent.target))) {
      if (!isSelectionDisabled && (that.option(SELECTION_MODE) !== 'multiple' || that.option(SHOW_CHECKBOXES_MODE) !== 'always')) {
        if (that._selectionController.changeItemSelection(e.rowIndex, {
          control: isCommandKeyPressed(dxEvent),
          shift: dxEvent.shiftKey,
        })) {
          dxEvent.preventDefault();
          e.handled = true;
        }
      }
      super._rowClick(e);
    }
  }

  private isClickableElement($target) {
    const isCommandSelect = $target.closest(`.${COMMAND_SELECT_CLASS}`).length;

    return !!isCommandSelect;
  }

  protected _renderCore(change) {
    const deferred = super._renderCore(change);
    this._updateCheckboxesClass();
    return deferred;
  }

  private _updateCheckboxesClass() {
    const tableElements = this.getTableElements();
    const isCheckBoxesHidden = this._selectionController.isSelectColumnVisible()
      && !this._selectionController.isSelectionWithCheckboxes();

    each(tableElements, (_, tableElement) => {
      $(tableElement).toggleClass(CHECKBOXES_HIDDEN_CLASS, isCheckBoxesHidden);
    });
  }
};
