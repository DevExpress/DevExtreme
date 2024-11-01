/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import { applyBatch } from '@js/common/data/array_utils';
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
import type { ContextMenuController } from '@ts/grids/grid_core/context_menu/m_context_menu';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { StateStoringController } from '@ts/grids/grid_core/state_storing/m_state_storing_core';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';
import Selection from '@ts/ui/selection/m_selection';

import type { DataController } from '../data_controller/m_data_controller';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';

const EDITOR_CELL_CLASS = 'dx-editor-cell';
const ROW_CLASS = 'dx-row';
const ROW_SELECTION_CLASS = 'dx-selection';
const SELECT_CHECKBOX_CLASS = 'dx-select-checkbox';
const CHECKBOXES_HIDDEN_CLASS = 'dx-select-checkboxes-hidden';
const COMMAND_SELECT_CLASS = 'dx-command-select';
const SELECTION_DISABLED_CLASS = 'dx-selection-disabled';
const DATA_ROW_CLASS = 'dx-data-row';

const SHOW_CHECKBOXES_MODE = 'selection.showCheckBoxesMode';
const SELECTION_MODE = 'selection.mode';

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
  const key = store && store.key();
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

  private _selectionMode?: string;

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
    this._selectionMode = mode;
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
  protected _getSelectionConfig() {
    const dataController = this._dataController;
    const columnsController = this._columnsController;
    const selectionOptions: any = this.option('selection') ?? {};
    const { deferred } = selectionOptions;
    const scrollingMode = this.option('scrolling.mode');
    const virtualPaging = scrollingMode === 'virtual' || scrollingMode === 'infinite';
    const allowSelectAll = this.option('selection.allowSelectAll');
    const legacyScrollingMode = this.option('scrolling.legacyMode');

    return {
      selectedKeys: this.option('selectedRowKeys'),
      mode: this._selectionMode,
      deferred,
      alwaysSelectByShift: selectionOptions.alwaysSelectByShift,
      maxFilterLengthInRequest: selectionOptions.maxFilterLengthInRequest,
      selectionFilter: this.option('selectionFilter'),
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

  public _updateCheckboxesState(options) {
    const { isDeferredMode } = options;
    const { selectionFilter } = options;
    const { selectedItemKeys } = options;
    const { removedItemKeys } = options;

    if (this.option(SHOW_CHECKBOXES_MODE) === 'onClick') {
      if (isDeferredMode ? selectionFilter && isSeveralRowsSelected(this, selectionFilter) : selectedItemKeys.length > 1) {
        this.startSelectionWithCheckboxes();
      } else if (isDeferredMode ? selectionFilter && !selectionFilter.length : selectedItemKeys.length === 0 && removedItemKeys.length) {
        this.stopSelectionWithCheckboxes();
      }
    }
  }

  /**
   * @extended: TreeList's selection
   */
  protected _updateSelectedItems(args) {
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
      selectedItemKeys: args.selectedItemKeys,
      removedItemKeys: args.removedItemKeys,
      selectionFilter,
      isDeferredMode,
    });

    if (changedItemIndexes.length || (isSelectionWithCheckboxes !== that.isSelectionWithCheckboxes())) {
      dataController.updateItems({
        changeType: 'updateSelection',
        itemIndexes: visibleChangedItemIndexes,
      });
    }

    if (isDeferredMode) {
      // @ts-expect-error
      that.option('selectionFilter', selectionFilter);
      selectionChangedOptions = {};
    } else if (args.addedItemKeys.length || args.removedItemKeys.length) {
      that._selectedItemsInternalChange = true;
      that.option('selectedRowKeys', args.selectedItemKeys.slice(0));
      that._selectedItemsInternalChange = false;
      selectionChangedOptions = {
        selectedRowsData: args.selectedItems.slice(0),
        selectedRowKeys: args.selectedItemKeys.slice(0),
        currentSelectedRowKeys: args.addedItemKeys.slice(0),
        currentDeselectedRowKeys: args.removedItemKeys.slice(0),
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

export const dataSelectionExtenderMixin = (Base: ModuleType<DataController>) => class DataControllerSelectionExtender extends Base {
  public init() {
    const isDeferredMode = this.option('selection.deferred');

    super.init.apply(this, arguments as any);

    if (isDeferredMode) {
      this._selectionController._updateCheckboxesState({
        isDeferredMode: true,
        selectionFilter: this.option('selectionFilter'),
      });
    }
  }

  protected _loadDataSource() {
    const that = this;

    return super._loadDataSource().always(() => {
      that._selectionController.refresh();
    });
  }

  protected _processDataItem(item, options) {
    const hasSelectColumn = this._selectionController.isSelectColumnVisible();
    const isDeferredSelection = options.isDeferredSelection = options.isDeferredSelection === undefined ? this.option('selection.deferred') : options.isDeferredSelection;
    const dataItem = super._processDataItem.apply(this, arguments as any);

    dataItem.isSelected = this._selectionController.isRowSelected(isDeferredSelection ? dataItem.data : dataItem.key);

    if (hasSelectColumn && dataItem.values) {
      for (let i = 0; i < options.visibleColumns.length; i++) {
        if (options.visibleColumns[i].command === 'select') {
          dataItem.values[i] = dataItem.isSelected;
          break;
        }
      }
    }
    return dataItem;
  }

  public refresh(options) {
    const that = this;
    // @ts-expect-error
    const d = new Deferred();

    super.refresh.apply(this, arguments as any).done(() => {
      if (!options || options.selection) {
        that._selectionController.refresh().done(d.resolve).fail(d.reject);
      } else {
        d.resolve();
      }
    }).fail(d.reject);

    return d.promise();
  }

  // eslint-disable-next-line
  protected _handleDataChanged(e?) {
    const hasLoadOperation = this.hasLoadOperation();
    super._handleDataChanged.apply(this, arguments as any);

    if (hasLoadOperation && !this._repaintChangesOnly) {
      this._selectionController.focusedItemIndex(-1);
    }
  }

  protected _applyChange(change) {
    if (change && change.changeType === 'updateSelection') {
      change.items.forEach((item, index) => {
        const currentItem = this._items[index];
        if (currentItem) {
          currentItem.isSelected = item.isSelected;
          currentItem.values = item.values;
        }
      });
      return;
    }

    return super._applyChange.apply(this, arguments as any);
  }

  protected _endUpdateCore() {
    const changes = this._changes;
    const isUpdateSelection = changes.length > 1 && changes.every((change) => change.changeType === 'updateSelection');
    if (isUpdateSelection) {
      const itemIndexes = changes.map((change) => change.itemIndexes || []).reduce((a, b) => a.concat(b));
      this._changes = [{ changeType: 'updateSelection', itemIndexes }];
    }
    super._endUpdateCore.apply(this, arguments as any);
  }
};

const contextMenu = (Base: ModuleType<ContextMenuController>) => class ContextMenuControllerSelectionExtender extends Base {
  protected _contextMenuPrepared(options) {
    const dxEvent = options.event;

    if (dxEvent.originalEvent && dxEvent.originalEvent.type !== 'dxhold' || options.items && options.items.length > 0) return;

    processLongTap(this, dxEvent);
  }
};

export const columnHeadersSelectionExtenderMixin = (Base: ModuleType<ColumnHeadersView>) => class ColumnHeadersSelectionExtender extends Base {
  public init() {
    super.init();
    this._selectionController.selectionChanged.add(this._updateSelectAllValue.bind(this));
  }

  private _updateSelectAllValue() {
    const that = this;
    const $element = that.element();
    const $editor = $element && $element.find(`.${SELECT_CHECKBOX_CLASS}`);

    if ($element && $editor.length && that.option('selection.mode') === 'multiple') {
      const selectAllValue = that._selectionController.isSelectAll();
      const hasSelection = selectAllValue !== false;
      const isVisible = that.option('selection.allowSelectAll') ? !that._dataController.isEmpty() : hasSelection;

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

  protected _renderSelectAllCheckBox($container, column?) {
    const that = this;
    const isEmptyData = that._dataController.isEmpty();

    const groupElement = $('<div>')
      .appendTo($container)
      .addClass(SELECT_CHECKBOX_CLASS);

    that.setAria('label', messageLocalization.format('dxDataGrid-ariaSelectAll'), groupElement);

    that._editorFactoryController.createEditor(groupElement, extend({}, column, {
      parentType: 'headerRow',
      dataType: 'boolean',
      value: this._selectionController.isSelectAll(),
      editorOptions: {
        visible: !isEmptyData && (that.option('selection.allowSelectAll') || this._selectionController.isSelectAll() !== false),
      },
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      tabIndex: that.option('useLegacyKeyboardNavigation') ? -1 : that.option('tabIndex') || 0,
      setValue: (value, e) => {
        const allowSelectAll = that.option('selection.allowSelectAll');
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

    return groupElement;
  }

  private _attachSelectAllCheckBoxClickEvent($element) {
    eventsEngine.on($element, clickEventName, this.createAction((e) => {
      const { event } = e;

      if (!$(event.target).closest(`.${SELECT_CHECKBOX_CLASS}`).length) {
        // @ts-expect-error
        eventsEngine.trigger($(event.currentTarget).children(`.${SELECT_CHECKBOX_CLASS}`), clickEventName);
      }
      event.preventDefault();
    }));
  }
};

export const rowsViewSelectionExtenderMixin = (Base: ModuleType<RowsView>) => class RowsViewSelectionExtender extends Base {
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

  protected _update(change) {
    const that = this;
    const tableElements = that.getTableElements();

    if (change.changeType === 'updateSelection') {
      if (tableElements.length > 0) {
        each(tableElements, (_, tableElement) => {
          each(change.itemIndexes || [], (_, index) => {
            let $row;

            // T108078
            if (change.items[index]) {
              $row = that._getRowElements($(tableElement)).eq(index);
              if ($row.length) {
                const { isSelected } = change.items[index];
                $row
                  .toggleClass(ROW_SELECTION_CLASS, isSelected === undefined ? false : isSelected)
                  .find(`.${SELECT_CHECKBOX_CLASS}`).dxCheckBox('option', 'value', isSelected);
                that.setAria('selected', isSelected, $row);
              }
            }
          });
        });

        that._updateCheckboxesClass();
      }
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
        this.setAria('selected', isSelected, $row);
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

export const selectionModule = {
  defaultOptions() {
    return {
      selection: {
        mode: 'none', // "single", "multiple"
        showCheckBoxesMode: 'onClick', // "onLongTap", "always", "none"
        allowSelectAll: true,
        selectAllMode: 'allPages',
        deferred: false,
        maxFilterLengthInRequest: 1500,
        alwaysSelectByShift: false,
      },
      selectionFilter: [],
      selectedRowKeys: [],
    };
  },

  controllers: {
    selection: SelectionController,
  },

  extenders: {
    controllers: {
      data: dataSelectionExtenderMixin,
      contextMenu,
    },

    views: {
      columnHeadersView: columnHeadersSelectionExtenderMixin,
      rowsView: rowsViewSelectionExtenderMixin,
    },
  },
};
