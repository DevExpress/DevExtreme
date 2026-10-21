/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { removeEvent } from '@js/common/core/events/remove';
import { addNamespace } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import { createObjectWithChanges } from '@js/common/data/array_utils';
import type { GridsEditMode, NewRowInfo, NewRowPosition } from '@js/common/grids';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import type { DxElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue, getKeyHash } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import * as iconUtils from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { deepExtendArraySafe } from '@js/core/utils/object';
import {
  isDefined, isEmptyObject, isFunction, isObject,
} from '@js/core/utils/type';
import type { StoreChange } from '@js/data/store';
import type { DxEvent } from '@js/events';
import type {
  InitializedEvent as ButtonInitializedEvent,
  Properties as ButtonProperties,
} from '@js/ui/button';
import { confirm } from '@js/ui/dialog';
import type Form from '@js/ui/form';
import type { HidingEvent as PopupHidingEvent } from '@js/ui/popup';
import { current, isFluent } from '@js/ui/themes';
import { Deferred, fromPromise, when } from '@ts/core/utils/deferred';
import domUtils from '@ts/core/utils/m_dom';
import type Store from '@ts/data/abstract_store';
import type { AdaptiveColumnsViewController } from '@ts/grids/grid_core/adaptivity/adaptivity';
import { HIDDEN_COLUMNS_WIDTH } from '@ts/grids/grid_core/adaptivity/const';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { ColumnsResizerViewController } from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import { generateRowValues } from '@ts/grids/grid_core/data_controller/utils/row_values';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { ValidatingController } from '@ts/grids/grid_core/validating/m_validating';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';

import type { Column, ColumnTemplateSource } from '../columns_controller/types';
import type {
  DataChange,
  GeneratedItem,
  ItemProcessingOptions,
  ProcessedItem,
  RefreshOptions,
} from '../data_controller/types';
import type { RawItemData } from '../data_source_adapter/types';
import modules from '../modules/modules';
import type {
  GridPropertyType,
  InternalGridOptions,
  ModuleType,
  OptionChanged,
  RowKey,
} from '../types';
import gridCoreUtils from '../utils';
import type {
  CellRenderOptions, ViewCellOptions, ViewDataChange, ViewRowEvent,
} from '../views/types';
import {
  ACTION_OPTION_NAMES,
  BUTTON_NAMES,
  CELL_BASED_MODES,
  CELL_FOCUS_DISABLED_CLASS,
  CELL_MODIFIED,
  COMMAND_EDIT_CLASS,
  COMMAND_EDIT_WITH_ICONS_CLASS,
  DATA_EDIT_DATA_INSERT_TYPE,
  DATA_EDIT_DATA_REMOVE_TYPE,
  DATA_EDIT_DATA_UPDATE_TYPE,
  DEFAULT_START_EDIT_ACTION,
  EDIT_BUTTON_CLASS,
  EDIT_FORM_CLASS,
  EDIT_ICON_CLASS,
  EDIT_LINK_CLASS,
  EDIT_MODE_POPUP,
  EDIT_MODE_ROW,
  EDIT_MODES,
  EDITING_CHANGES_OPTION_NAME,
  EDITING_EDITCOLUMNNAME_OPTION_NAME,
  EDITING_EDITROWKEY_OPTION_NAME,
  EDITING_NAMESPACE,
  EDITING_POPUP_OPTION_NAME,
  EDITOR_CELL_CLASS,
  EDITORS_INPUT_SELECTOR,
  FIRST_NEW_ROW_POSITION,
  FOCUSABLE_ELEMENT_SELECTOR,
  INSERT_INDEX,
  LAST_NEW_ROW_POSITION,
  LINK_CLASS,
  LINK_ICON_CLASS,
  METHOD_NAMES,
  PAGE_BOTTOM_NEW_ROW_POSITION,
  PAGE_TOP_NEW_ROW_POSITION,
  READONLY_CLASS,
  REQUIRED_EDITOR_LABELLEDBY_MODES,
  ROW_BASED_MODES,
  ROW_INSERTED,
  ROW_MODIFIED,
  ROW_SELECTED,
  TARGET_COMPONENT_NAME,
  VIEWPORT_BOTTOM_NEW_ROW_POSITION,
  VIEWPORT_TOP_NEW_ROW_POSITION,
} from './const';
import {
  createFailureHandler,
  generateNewRowTempKey,
  getButtonIndex,
  getButtonName,
  getEditingTexts,
  isEditingCell,
  isEditingOrShowEditorAlwaysDataCell,
} from './editing_utils';
import { editingDataControllerExtender } from './extenders/editing_data_controller';
import type { ICellBasedEditingControllerExtender } from './m_editing_cell_based';
import type { IFormBasedEditingControllerExtender } from './m_editing_form_based';
import type {
  AllowEditActionValue,
  EditActionOptions,
  EditActions,
  EditingActionParams,
  EditingButton,
  EditingButtonLocalizationNames,
  EditingChange,
  EditingChangeParams,
  EditingChangesOptionChanged,
  EditingColumn,
  EditingModuleOptionChanged,
  EditingModuleOptions,
  EditingOptions,
  EditingStartOptions,
  EditorCellOptions,
  EditorTemplate,
  InsertInfo,
  InternalColumnButton,
  InternalColumnButtonClickEvent,
  InternalEditData,
  NormalizedEditCellOptions,
  OnSavingParams,
  OnSavingResult,
  ProcessedChanges,
  SavedRowInfo,
  SaveResult,
} from './types';

class EditingControllerImpl extends modules.ViewController {
  protected _columnsController!: ColumnsController;

  protected _dataController!: DataController;

  protected dataSourceController!: DataSourceController;

  protected adaptiveColumnsController!: AdaptiveColumnsViewController;

  protected _validatingController!: ValidatingController;

  protected _editorFactoryController!: EditorFactory;

  protected _focusController!: FocusController;

  protected _columnsResizerController!: ColumnsResizerViewController;

  protected _keyboardNavigationController!: KeyboardNavigationController;

  protected _rowsView!: RowsView;

  private _headerPanelView!: HeaderPanel;

  private _lastOperation?: DeferredObj<unknown> | null;

  private _changes!: EditingChange[];

  private pendingOperations!: DeferredObj<unknown>[];

  private _dataChangedHandler?: (args: DataChange) => void;

  protected _saveEditorHandler?: (e: DxEvent) => void;

  private _internalState!: Map<RowKey, InternalEditData>;

  protected _refocusEditCell?: boolean;

  protected _editCellInProgress?: boolean;

  protected _needFocusEditor?: boolean;

  private _beforeFocusCallback?: (() => void) | null;

  private _saving?: boolean;

  protected _editForm?: Form | null;

  protected _pageIndex?: number;

  protected _inputFocusTimeoutID?: ReturnType<typeof setTimeout>;

  public init(): void {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this.dataSourceController = this.getController('dataSource');
    this.adaptiveColumnsController = this.getController('adaptiveColumns');
    this._validatingController = this.getController('validating');
    this._editorFactoryController = this.getController('editorFactory');
    this._focusController = this.getController('focus');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._columnsResizerController = this.getController('columnsResizer');
    this._rowsView = this.getView('rowsView');
    this._headerPanelView = this.getView('headerPanel');
    this._lastOperation = null;
    // a copy of editing.changes, compared in optionChanged
    this._changes = [];

    if (this.pendingOperations) {
      this.pendingOperations.forEach((d) => { d.reject('cancel'); });
    }
    this.pendingOperations = [];

    if (!this._dataChangedHandler) {
      this._dataChangedHandler = this._handleDataChanged.bind(this);
      this._dataController.changed.add(this._dataChangedHandler);
    }

    if (!this._saveEditorHandler) {
      this.createAction('onInitNewRow', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onRowInserting', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onRowInserted', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onEditingStart', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onRowUpdating', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onRowUpdated', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onRowRemoving', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onRowRemoved', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onSaved', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onSaving', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onEditCanceling', { excludeValidators: ['disabled', 'readOnly'] });
      this.createAction('onEditCanceled', { excludeValidators: ['disabled', 'readOnly'] });
    }
    this._updateEditColumn();
    this._updateEditButtons();

    if (!this._internalState) {
      this._internalState = new Map();
    }

    this.component._optionsByReference[EDITING_EDITROWKEY_OPTION_NAME] = true;
    this.component._optionsByReference[EDITING_CHANGES_OPTION_NAME] = true;
  }

  public getEditMode(): GridsEditMode {
    const editMode = this.option('editing.mode') ?? EDIT_MODE_ROW;
    if (EDIT_MODES.includes(editMode)) {
      return editMode;
    }

    return EDIT_MODE_ROW;
  }

  public isCellBasedEditMode(): boolean {
    const editMode: GridsEditMode = this.getEditMode();
    return CELL_BASED_MODES.includes(editMode);
  }

  private _getDefaultEditorTemplate(): EditorTemplate {
    return (container, options): void => {
      const $editor = $('<div>').appendTo(container);

      const editorOptions = extend({}, options.column, {
        value: options.value,
        setValue: options.setValue,
        row: options.row,
        parentType: 'dataRow',
        width: null,
        readOnly: !options.setValue,
        isOnForm: options.isOnForm,
        id: options.id,
      });

      const needLabel = REQUIRED_EDITOR_LABELLEDBY_MODES.includes(this.getEditMode());
      if (needLabel) { editorOptions['aria-labelledby'] = options.column.headerId; }

      this._editorFactoryController.createEditor($editor, editorOptions);
    };
  }

  private _getNewRowPosition(): NewRowPosition | undefined {
    const newRowPosition = this.option('editing.newRowPosition');
    const scrollingMode = this.option('scrolling.mode');

    if (scrollingMode === 'virtual') {
      switch (newRowPosition) {
        case PAGE_TOP_NEW_ROW_POSITION:
          return VIEWPORT_TOP_NEW_ROW_POSITION;
        case PAGE_BOTTOM_NEW_ROW_POSITION:
          return VIEWPORT_BOTTOM_NEW_ROW_POSITION;
        default:
          return newRowPosition;
      }
    }

    return newRowPosition;
  }

  public getChanges(): EditingChange[] {
    // @ts-expect-error editing.changes is typed as optional, it defaults to []
    return this.option(EDITING_CHANGES_OPTION_NAME);
  }

  private resetChanges(): void {
    const changes = this.getChanges();
    const needReset = changes?.length;
    if (needReset) {
      this._silentOption(EDITING_CHANGES_OPTION_NAME, []);
      this._internalState.clear();
    }
  }

  protected _getInternalData(key: RowKey): InternalEditData | undefined {
    return this._internalState.get(getKeyHash(key));
  }

  public _addInternalData(params: InternalEditData): InternalEditData {
    const internalData = this._getInternalData(params.key) ?? {};

    this._internalState.set(getKeyHash(params.key), { ...internalData, ...params });

    return params;
  }

  /**
   * @extended: validating
   */
  public _getOldData(key: RowKey): RawItemData | undefined {
    return this._getInternalData(key)?.oldData;
  }

  public getUpdatedData(data: RawItemData): RawItemData {
    const key = this.dataSourceController.keyOf(data);
    const changes = this.getChanges();
    const editIndex = gridCoreUtils.getIndexByKey(key, changes);

    if (changes[editIndex]) {
      return createObjectWithChanges(data, changes[editIndex].data);
    }

    return data;
  }

  public getInsertedData(): RawItemData[] {
    return this.getChanges()
      .filter((change) => change.data && change.type === DATA_EDIT_DATA_INSERT_TYPE)
      .map((change) => change.data);
  }

  public getRemovedData(): (RawItemData | undefined)[] {
    return this.getChanges()
      .filter((change) => this._getOldData(change.key)
        && change.type === DATA_EDIT_DATA_REMOVE_TYPE)
      .map((change) => this._getOldData(change.key));
  }

  private _fireDataErrorOccurred(error: Error | string): void {
    if (error === 'cancel') {
      return;
    }

    const $popupContent = this.getPopupContent();
    this._dataController.dataErrorOccurred.fire(error, $popupContent);
  }

  /**
   * @extended: TreeList's editing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _needToCloseEditableCell($targetElement: dxElementWrapper): boolean | undefined {
    return undefined;
  }

  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _closeEditItem($targetElement: dxElementWrapper): void {}

  /**
   * @extended: validating
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _handleDataChanged(args: DataChange): void {}

  protected _isDefaultButtonVisible(
    button: InternalColumnButton,
    options: EditorCellOptions,
  ): boolean {
    if (button.name === 'delete') {
      return this.allowDeleting(options);
    }

    if (button.name === 'undelete') {
      return false;
    }

    return true;
  }

  protected isPopupEditMode(): boolean {
    const editMode = this.option('editing.mode');
    return editMode === EDIT_MODE_POPUP;
  }

  private _isButtonVisible(button: InternalColumnButton, options: EditorCellOptions): boolean {
    const { visible } = button;

    if (!isDefined(visible)) {
      return this._isDefaultButtonVisible(button, options);
    }

    return isFunction(visible)
      ? visible.call(button, {
        component: options.component,
        row: options.row,
        column: options.column,
      })
      : visible;
  }

  private _isButtonDisabled(button: InternalColumnButton, options: EditorCellOptions): boolean {
    const { disabled } = button;

    return isFunction(disabled)
      ? disabled.call(button, {
        component: options.component,
        row: options.row,
        column: options.column,
      })
      : !!disabled;
  }

  protected _getButtonConfig(
    button: EditingButton,
    options: EditorCellOptions,
  ): InternalColumnButton {
    // @ts-expect-error the button callbacks are typed with the public component, row and column
    const userButton: InternalColumnButton = isObject(button) ? button : {};
    const buttonName = getButtonName(button);
    const buttonText = isDefined(buttonName)
      ? getEditingTexts({ component: this.component })[buttonName]
      : undefined;
    const buttonCssClass = isDefined(buttonName) ? EDIT_LINK_CLASS[buttonName] : undefined;

    return extend({
      name: buttonName,
      text: buttonText,
      cssClass: buttonCssClass,
      onClick: this.getEditingButtonClickHandler(buttonName, options),
    }, userButton);
  }

  private getEditingButtonClickHandler(
    buttonName: string | undefined,
    options: EditorCellOptions,
  ): ((e: InternalColumnButtonClickEvent) => void) | undefined {
    if (!isDefined(buttonName)) {
      return undefined;
    }

    const methodName = METHOD_NAMES[buttonName];

    if (!methodName) {
      return undefined;
    }

    const actionName = ACTION_OPTION_NAMES[buttonName];

    return (e): void => {
      e.event.stopPropagation();
      e.event.preventDefault();

      // @ts-expect-error the editing option has defaults
      const allowAction = actionName ? this.option('editing')[actionName] : true;

      if (!allowAction || !this[methodName]) {
        return;
      }

      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => {
        if (options.row) {
          this[methodName](options.row.rowIndex);
        }
      });
    };
  }

  /**
   * @extended: TreeList's editing
   */
  protected _getEditingButtons(options: EditorCellOptions): InternalColumnButton[] {
    const customButtons = options.column.buttons?.slice();

    if (customButtons) {
      const editButtonIndex = getButtonIndex(customButtons, 'edit');

      if (editButtonIndex >= 0) {
        if (getButtonIndex(customButtons, 'save') < 0) {
          customButtons.splice(editButtonIndex + 1, 0, 'save');
        }

        if (getButtonIndex(customButtons, 'cancel') < 0) {
          customButtons.splice(getButtonIndex(customButtons, 'save') + 1, 0, 'cancel');
        }
      }

      const deleteButtonIndex = getButtonIndex(customButtons, 'delete');

      if (deleteButtonIndex >= 0 && getButtonIndex(customButtons, 'undelete') < 0) {
        customButtons.splice(deleteButtonIndex + 1, 0, 'undelete');
      }
    }

    return (customButtons ?? BUTTON_NAMES).map((button) => this._getButtonConfig(button, options));
  }

  private _renderEditingButtons(
    $container: dxElementWrapper,
    buttons: InternalColumnButton[],
    options: EditorCellOptions,
    change?: ViewDataChange,
  ): void {
    buttons.forEach((button) => {
      if (this._isButtonVisible(button, options)) {
        this._createButton($container, button, options, change);
      }
    });
  }

  private _getEditCommandCellTemplate(): EditorTemplate {
    return (container, options, change): void => {
      const $container = $(container);

      if (options.rowType === 'data') {
        const buttons = this._getEditingButtons(options);

        this._renderEditingButtons($container, buttons, options, change);

        if (options.watch) {
          const dispose = options.watch(
            () => buttons.map((button) => ({
              visible: this._isButtonVisible(button, options),
              disabled: this._isButtonDisabled(button, options),
            })),
            () => {
              $container.empty();
              this._renderEditingButtons($container, buttons, options);
            },
          );

          eventsEngine.on($container, removeEvent, dispose);
        }
      } else {
        gridCoreUtils.setEmptyText($container);
      }
    };
  }

  public isRowBasedEditMode(): boolean {
    const editMode = this.getEditMode();
    return ROW_BASED_MODES.includes(editMode);
  }

  protected getFirstEditableColumnIndex(): number | undefined {
    const columnIndex = this._columnsController.getVisibleColumns()
      .findIndex((column) => column.allowEditing);

    return columnIndex >= 0 ? columnIndex : undefined;
  }

  private getFirstEditableCellInRow(rowIndex: number): dxElementWrapper | undefined {
    const columnIndex = this.getFirstEditableColumnIndex();

    if (columnIndex === undefined) {
      return undefined;
    }

    return this._rowsView?._getCellElement(rowIndex || 0, columnIndex);
  }

  /**
   * @extedned: keyboard_navigation
   */
  protected getFocusedCellInRow(rowIndex: number): dxElementWrapper | undefined {
    return this.getFirstEditableCellInRow(rowIndex);
  }

  /**
   * @extended: validating
   */
  public getIndexByKey(key: RowKey, items: unknown[] | null | undefined): number {
    return gridCoreUtils.getIndexByKey(key, items);
  }

  public hasChanges(rowIndex?: number): boolean {
    return this.getChanges()?.some((change) => {
      const isChangeInRow = !isDefined(rowIndex)
        || this._dataController.getRowIndexByKey(change.key) === rowIndex;

      return change.type && isChangeInRow;
    });
  }

  public dispose(): void {
    super.dispose();
    clearTimeout(this._inputFocusTimeoutID);
    // @ts-expect-error the cell-based extender sets the pointer handlers
    eventsEngine.off(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
    // @ts-expect-error the cell-based extender sets the pointer handlers
    eventsEngine.off(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
    eventsEngine.off(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
  }

  protected _silentOption<TPropertyName extends string>(
    name: TPropertyName,
    value: GridPropertyType<InternalGridOptions, TPropertyName>,
  ): void {
    if (name === 'editing.changes') {
      this._changes = deepExtendArraySafe([], value);
    }

    super._silentOption(name, value);
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'editing') {
      if (args.fullName === EDITING_EDITROWKEY_OPTION_NAME) {
        this._handleEditRowKeyChange(args);
      } else if (args.fullName === EDITING_CHANGES_OPTION_NAME) {
        // to prevent render on optionChanged called by two-way binding - T1128881
        const isEqual = equalByValue(args.value, this._changes, { maxDepth: 4 });

        if (!isEqual) {
          this._changes = deepExtendArraySafe([], args.value);
          // @ts-expect-error editing.changes is typed as optional, it defaults to []
          this._handleChangesChange(args);
        }
      } else if (!args.handled) {
        this._columnsController.reinit();
        this.init();
        this.resetChanges();
        this._resetEditColumnName();
        this._resetEditRowKey();
      }
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  protected _handleEditRowKeyChange(args: OptionChanged): void {
    const rowIndex = this._dataController.getRowIndexByKey(args.value);
    const oldRowIndexCorrection = this._getEditRowIndexCorrection();
    const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue)
      + oldRowIndexCorrection;

    if (isDefined(args.value)) {
      if (args.value !== args.previousValue) {
        this._editRowFromOptionChanged(rowIndex, oldRowIndex);
      }
    } else {
      this.cancelEditData();
    }
  }

  /**
   * @extended: validating
   */
  protected _handleChangesChange(args: EditingChangesOptionChanged): void {
    const dataController = this._dataController;
    const changes = args.value;

    if (!args.value.length && !args.previousValue.length) {
      return;
    }

    changes.forEach((change) => {
      if (change.type === 'insert') {
        this._addInsertInfo(change);
      } else {
        const items = this.dataSourceController.getCachedStoreData()
          ?? dataController.items()?.map((item) => item.data);
        const rowIndex = gridCoreUtils.getIndexByKey(
          change.key,
          items,
          this.dataSourceController.key(),
        );
        this._addInternalData({ key: change.key, oldData: items[rowIndex] });
      }
    });

    dataController.updateItems({
      changeType: 'refresh',
      repaintChangesOnly: true,
      isLiveUpdate: false,
      isOptionChanged: true,
    });
  }

  public publicMethods(): string[] {
    return ['addRow', 'deleteRow', 'undeleteRow', 'editRow', 'saveEditData', 'cancelEditData', 'hasEditData'];
  }

  public refresh(params?: RefreshOptions): void {
    if (!isDefined(this._pageIndex)) {
      return;
    }

    this._refreshCore(params);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _refreshCore(params?: RefreshOptions): void {}

  public isEditing(): boolean {
    return isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  public isEditRow(rowIndex: number | undefined): boolean {
    return false;
  }

  protected _setEditRowKey(value: RowKey, silent?: boolean): void {
    if (silent) {
      this._silentOption(EDITING_EDITROWKEY_OPTION_NAME, value);
    } else {
      this.option(EDITING_EDITROWKEY_OPTION_NAME, value);
    }

    if (this._refocusEditCell) {
      this._refocusEditCell = false;
      this._focusEditingCell();
    }
  }

  public getEditRowIndex(): number {
    return this._getVisibleEditRowIndex();
  }

  public getEditFormRowIndex(): number {
    return -1;
  }

  public isEditRowByIndex(rowIndex: number | undefined): boolean {
    if (rowIndex === undefined) {
      return false;
    }

    const key = this._dataController.getKeyByRowIndex(rowIndex);
    const isKeyEqual = isDefined(key)
      && equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key);
    if (isKeyEqual) {
      return this._getVisibleEditRowIndex() === rowIndex;
    }
    return isKeyEqual;
  }

  public isEditCell(visibleRowIndex: number | undefined, columnIndex: number | undefined): boolean {
    return this.isEditRowByIndex(visibleRowIndex)
      && this._getVisibleEditColumnIndex() === columnIndex;
  }

  protected getPopupContent(): dxElementWrapper | undefined {
    return undefined;
  }

  /**
   * @extended: TreeList's editing, DataGrid's grouping
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _isProcessedItem(item: RawItemData | ProcessedItem): boolean {
    return false;
  }

  private _getInsertRowIndex(
    items: (RawItemData | ProcessedItem)[],
    change: Partial<EditingChange>,
    isProcessedItems?: boolean,
  ): number {
    const key = this._getInsertAfterOrBeforeKey(change);

    if (!isDefined(key)) {
      return items.length === 0 ? 0 : -1;
    }

    const isAnchorRow = (item: RawItemData | ProcessedItem): boolean => {
      if (!isObject(item)) {
        return false;
      }

      const isProcessedItem = !!isProcessedItems || this._isProcessedItem(item);
      const hasKeyField = isProcessedItem || isDefined(item[INSERT_INDEX]);
      const itemKey = hasKeyField
        ? item.key
        : this.dataSourceController.keyOf(item as RawItemData);

      return equalByValue(itemKey, key);
    };

    if (!isDefined(change.insertAfterKey)) {
      return items.findIndex(isAnchorRow);
    }

    const isFollowedByDetailRow = (index: number): boolean => {
      const nextRowType = items[index + 1]?.rowType;

      // detail rows are added after processItems; on raw items, a detail rowType is user data
      return !!isProcessedItems && (nextRowType === 'detail' || nextRowType === 'detailAdaptive');
    };
    let lastAnchorRowIndex = -1;

    for (let index = 0; index < items.length; index += 1) {
      if (isAnchorRow(items[index])) {
        if (!isFollowedByDetailRow(index)) {
          return index + 1;
        }

        lastAnchorRowIndex = index;
      }
    }

    // the last anchor row is followed by a row edited in form mode (typed 'detail'):
    // return the anchor row index, as -1 would mean the anchor isn't loaded
    return lastAnchorRowIndex;
  }

  /**
   * @extended: TreeList's editing
   */
  protected _generateNewItem(key: RowKey): RawItemData {
    const item: RawItemData = {
      key,
    };
    const insertInfo = this._getInternalData(key)?.insertInfo;

    if (insertInfo?.[INSERT_INDEX]) {
      item[INSERT_INDEX] = insertInfo[INSERT_INDEX];
    }

    return item;
  }

  /**
   * @extended: TreeList's editing
   */
  protected _getLoadedRowIndex(
    items: (RawItemData | ProcessedItem)[],
    change: Partial<EditingChange>,
    isProcessedItems?: boolean,
  ): number {
    const loadedRowIndex = this._getInsertRowIndex(items, change, isProcessedItems);

    if (loadedRowIndex >= 0) {
      return loadedRowIndex;
    }

    const isLastNewRowPosition = this._getNewRowPosition() === LAST_NEW_ROW_POSITION;
    const isFirstPage = this._dataController.pageIndex() === 0;
    const hasAfterOrBeforeKey = isDefined(this._getInsertAfterOrBeforeKey(change));

    if (!isLastNewRowPosition && isFirstPage && !hasAfterOrBeforeKey) {
      return 0;
    }

    if (isLastNewRowPosition && this._dataController.isLastPageLoaded()) {
      return items.length;
    }

    return loadedRowIndex;
  }

  /**
   * @extended: validatiing
   */
  public processItems(items: RawItemData[], change: DataChange): RawItemData[] {
    const { changeType } = change;

    this.update(changeType);

    const changes = this.getChanges();

    changes.forEach((editChange) => {
      const isInsert = editChange.type === DATA_EDIT_DATA_INSERT_TYPE;

      if (!isInsert) {
        return;
      }

      let { key } = editChange;

      const insertInfo = this._getInternalData(key)?.insertInfo;

      if (!isDefined(key) || !isDefined(insertInfo)) {
        key = this._addInsertInfo(editChange).key;
      }

      const loadedRowIndex = this._getLoadedRowIndex(items, editChange);
      const item = this._generateNewItem(key);

      if (loadedRowIndex >= 0) {
        items.splice(loadedRowIndex, 0, item);
      }
    });

    return items;
  }

  /**
   * @extended: validating
   */
  public processDataItem(generatedItem: GeneratedItem, options: ItemProcessingOptions): void {
    const columns = options.visibleColumns;
    const key = generatedItem.data[INSERT_INDEX] ? generatedItem.data.key : generatedItem.key;
    const changes = this.getChanges();

    const editIndex = gridCoreUtils.getIndexByKey(key, changes);
    generatedItem.isEditing = false;

    if (editIndex >= 0) {
      this._processDataItemCore(generatedItem, changes[editIndex], key, columns);
    }
  }

  protected _processDataItemCore(
    item: GeneratedItem,
    change: EditingChange,
    key: RowKey,
    columns: Column[],
  ): void {
    const { data, type } = change;

    switch (type) {
      case DATA_EDIT_DATA_INSERT_TYPE:
        item.isNewRow = true;
        item.key = key;
        item.data = data;
        break;
      case DATA_EDIT_DATA_UPDATE_TYPE:
        item.modified = true;
        item.oldData = item.data;
        item.data = createObjectWithChanges(item.data, data);
        item.modifiedValues = generateRowValues(data, columns, true);
        break;
      case DATA_EDIT_DATA_REMOVE_TYPE:
        item.removed = true;
        break;
      default:
        break;
    }
  }

  /**
   * @extended: TreeList's editing
   */
  protected _initNewRow(
    options: NewRowInfo<RawItemData>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    parentKey?: RowKey,
  ): DeferredObj<unknown> | undefined {
    this.executeAction('onInitNewRow', options);

    if (options.promise) {
      const deferred = Deferred<unknown>();

      when(fromPromise(options.promise))
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .done(deferred.resolve)
        .fail(createFailureHandler(deferred))
        // @ts-expect-error fail() gets the error, but is typed with the resolve value
        .fail((error) => this._fireDataErrorOccurred(error));

      return deferred;
    }

    return undefined;
  }

  private _createInsertInfo(parentKey?: RowKey): InsertInfo {
    return {
      [INSERT_INDEX]: this._getInsertIndex(),
      parentKey,
    };
  }

  private _addInsertInfo(
    change: Partial<EditingChange>,
    parentKey?: RowKey,
  ): { insertInfo: InsertInfo; key: RowKey } {
    change.key = this.getChangeKeyValue(change);

    const { key } = change;

    let insertInfo: InsertInfo | undefined = this._getInternalData(key)?.insertInfo;

    if (!isDefined(insertInfo)) {
      const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

      insertInfo = this._createInsertInfo(parentKey);

      if (!isDefined(insertAfterOrBeforeKey)) {
        this._setInsertAfterOrBeforeKey(change, parentKey);
      }
    }

    this._addInternalData({ insertInfo, key });

    return { insertInfo, key };
  }

  private getChangeKeyValue(change: Partial<EditingChange>): RowKey {
    if (isDefined(change.key)) {
      return change.key;
    }

    const keyExpr = this.dataSourceController.key();

    if (change.data && keyExpr && !Array.isArray(keyExpr)) {
      const keyValue = change.data[keyExpr];

      if (isDefined(keyValue)) {
        return keyValue;
      }
    }

    return generateNewRowTempKey();
  }

  /**
   * @extended: TreeList's editing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _setInsertAfterOrBeforeKey(change: Partial<EditingChange>, parentKey?: RowKey): void {
    // TODO getView
    const rowsView = this.getView('rowsView');
    const allItems = this._dataController.items(true);
    const newRowPosition = this._getNewRowPosition();

    switch (newRowPosition) {
      case FIRST_NEW_ROW_POSITION:
      case LAST_NEW_ROW_POSITION:
        break;
      case PAGE_TOP_NEW_ROW_POSITION:
        if (allItems.length) {
          change.insertBeforeKey = allItems[0].key;
        }
        break;
      case PAGE_BOTTOM_NEW_ROW_POSITION:
        if (allItems.length) {
          change.insertAfterKey = allItems[allItems.length - 1].key;
        }
        break;
      default: {
        const isViewportBottom = newRowPosition === VIEWPORT_BOTTOM_NEW_ROW_POSITION;
        let visibleItemIndex = isViewportBottom
          ? rowsView?.getBottomVisibleItemIndex()
          : rowsView?.getTopVisibleItemIndex();
        const row = this._dataController.getVisibleRows()[visibleItemIndex];

        if (row && ((!row.isEditing && row.rowType === 'detail') || row.rowType === 'detailAdaptive')) {
          visibleItemIndex += 1;
        }

        const insertKey = this._dataController.getKeyByRowIndex(visibleItemIndex);

        if (isDefined(insertKey)) {
          change.insertBeforeKey = insertKey;
        }
      }
    }
  }

  private _getInsertIndex(): number {
    let maxInsertIndex = 0;
    this.getChanges().forEach((editItem) => {
      const insertInfo = this._getInternalData(editItem.key)?.insertInfo;

      if (
        isDefined(insertInfo)
        && editItem.type === DATA_EDIT_DATA_INSERT_TYPE
        && insertInfo[INSERT_INDEX] > maxInsertIndex
      ) {
        maxInsertIndex = insertInfo[INSERT_INDEX];
      }
    });
    return maxInsertIndex + 1;
  }

  private _getInsertAfterOrBeforeKey(insertChange: Partial<EditingChange>): RowKey | undefined {
    return insertChange.insertAfterKey ?? insertChange.insertBeforeKey;
  }

  private _getPageIndexToInsertRow(): number {
    const newRowPosition = this._getNewRowPosition();
    const pageIndex = this._dataController.pageIndex();
    const lastPageIndex = this.dataSourceController.pageCount() - 1;

    if (newRowPosition === FIRST_NEW_ROW_POSITION && pageIndex !== 0) {
      return 0;
    }

    if (newRowPosition === LAST_NEW_ROW_POSITION && pageIndex !== lastPageIndex) {
      return lastPageIndex;
    }

    return -1;
  }

  /**
   * @extended: keyboard_navigation
   */
  protected addRow(parentKey?: RowKey): DeferredObj<unknown> {
    const store = this.dataSourceController.store();

    if (!store) {
      this._dataController.fireError('E1052', this.component.NAME);
      return Deferred<unknown>().reject();
    }

    return this._addRow(parentKey);
  }

  protected _addRow(parentKey?: RowKey): DeferredObj<unknown> {
    const key = this.dataSourceController.store()?.key();
    const param: NewRowInfo<RawItemData> = { data: {} };
    const oldEditRowIndex = this._getVisibleEditRowIndex();
    const deferred = Deferred<unknown>();

    this.refresh({ allowCancelEditing: true });

    if (!this._allowRowAdding()) {
      when(this._navigateToNewRow(oldEditRowIndex))
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .done(deferred.resolve)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .fail(deferred.reject);
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return deferred.promise();
    }

    if (!key) {
      param.data.__KEY__ = String(new Guid());
    }

    when(this._initNewRow(param, parentKey)).done(() => {
      if (this._allowRowAdding()) {
        when(this._addRowCore(param.data, parentKey, oldEditRowIndex))
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          .done(deferred.resolve)
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          .fail(deferred.reject);
      } else {
        deferred.reject('cancel');
      }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(deferred.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  protected _allowRowAdding(): boolean {
    const insertIndex = this._getInsertIndex();

    return insertIndex <= 1;
  }

  /**
   * @exteded: TreeList's editing
   */
  protected _addRowCore(
    data: RawItemData,
    parentKey: RowKey | undefined,
    initialOldEditRowIndex: number,
  ): DeferredObj<unknown> {
    const change: Partial<EditingChange> = { data, type: DATA_EDIT_DATA_INSERT_TYPE };
    const editRowIndex = this._getVisibleEditRowIndex();
    const insertInfo = this._addInsertInfo(change, parentKey);
    const { key } = insertInfo;

    this._setEditRowKey(key, true);
    this._addChange(change);

    return this._navigateToNewRow(initialOldEditRowIndex, change, editRowIndex);
  }

  private _navigateToNewRow(
    oldEditRowIndex: number,
    change?: Partial<EditingChange>,
    editRowIndex = -1,
  ): DeferredObj<unknown> {
    const d = Deferred<unknown>();
    const dataController = this._dataController;
    const newRowChange = change
      ?? this.getChanges().filter((c) => c.type === DATA_EDIT_DATA_INSERT_TYPE)[0];

    if (!newRowChange) {
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return d.reject('cancel').promise();
    }

    const pageIndexToInsertRow = this._getPageIndexToInsertRow();
    let rowIndex = this._getLoadedRowIndex(dataController.items(), newRowChange, true);
    const navigateToRowByKey = (key: RowKey): void => {
      when(this._focusController?.navigateToRow(key))
        .done(() => {
          rowIndex = dataController.getRowIndexByKey(newRowChange.key);
          d.resolve();
        });
    };
    const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(newRowChange);

    if (pageIndexToInsertRow >= 0) {
      dataController.pageIndex(pageIndexToInsertRow)
        .done(() => {
          navigateToRowByKey(newRowChange.key);
        })
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .fail(d.reject);
    } else if (rowIndex < 0 && isDefined(insertAfterOrBeforeKey)) {
      navigateToRowByKey(insertAfterOrBeforeKey);
    } else {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, editRowIndex, rowIndex],
      });

      rowIndex = dataController.getRowIndexByKey(newRowChange.key);

      if (rowIndex < 0) {
        navigateToRowByKey(newRowChange.key);
      } else {
        d.resolve();
      }
    }

    d.done(() => {
      this._rowsView?.waitAsyncTemplates(true).done(() => {
        this._showAddedRow(rowIndex);
        this._afterInsertRow(newRowChange.key);
      });
    });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return d.promise();
  }

  protected _showAddedRow(rowIndex: number): void {
    this._focusFirstEditableCellInRow(rowIndex);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _beforeFocusElementInRow(rowIndex: number): void {}

  private _focusFirstEditableCellInRow(rowIndex: number): void {
    const key = this._dataController.getKeyByRowIndex(rowIndex);
    const $firstCell = this.getFirstEditableCellInRow(rowIndex);

    this._keyboardNavigationController?.focus($firstCell);
    this.option('focusedRowKey', key);

    this._editCellInProgress = true;
    this._delayedInputFocus($firstCell, () => {
      const focusedRowIndex = this._dataController.getRowIndexByKey(key);
      this._editCellInProgress = false;
      this._beforeFocusElementInRow(focusedRowIndex);
    });
  }

  /**
   * @extended: keyboard_navigation
   */
  protected _isEditingStart(options: EditingStartOptions): boolean {
    this.executeAction('onEditingStart', options);

    return options.cancel;
  }

  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _beforeUpdateItems(rowIndices: number[], rowIndex: number): void {}

  protected _getVisibleEditColumnIndex(): number {
    const editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);

    if (!isDefined(editColumnName)) {
      return -1;
    }

    return this._columnsController.getVisibleColumnIndex(editColumnName);
  }

  protected _setEditColumnNameByIndex(index: number, silent?: boolean): void {
    const visibleColumns = this._columnsController.getVisibleColumns();
    this._setEditColumnName(visibleColumns[index]?.name, silent);
  }

  private _setEditColumnName(name: string | undefined, silent?: boolean): void {
    if (silent) {
      this._silentOption(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
    } else {
      this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
    }
  }

  protected _resetEditColumnName(): void {
    this._setEditColumnName(undefined, true);
  }

  protected _getEditColumn(): Column | undefined {
    const editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);

    return this._getColumnByName(editColumnName);
  }

  private _getColumnByName(name: string | undefined): Column | undefined {
    const visibleColumns = this._columnsController.getVisibleColumns();

    if (!isDefined(name)) {
      return undefined;
    }

    return visibleColumns.find((column) => column.name === name);
  }

  protected _getVisibleEditRowIndex(columnName?: string): number {
    const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
    const rowIndex = this._dataController.getRowIndexByKey(editRowKey);

    if (rowIndex === -1) {
      return rowIndex;
    }

    return rowIndex + this._getEditRowIndexCorrection(columnName);
  }

  protected _getEditRowIndexCorrection(columnName?: string): number {
    const editColumn = columnName ? this._getColumnByName(columnName) : this._getEditColumn();
    const isColumnHidden = editColumn?.visibleWidth === HIDDEN_COLUMNS_WIDTH;

    return isColumnHidden ? 1 : 0;
  }

  protected _resetEditRowKey(): void {
    this._refocusEditCell = false;
    this._setEditRowKey(undefined, true);
  }

  protected _resetEditIndices(): void {
    this._resetEditColumnName();
    this._resetEditRowKey();
  }

  /**
   * @extended: adaptivity, keyboard_navigation
   */
  public editRow(rowIndex: number): boolean | undefined {
    const item = this._dataController.items()[rowIndex];
    const params: EditingStartOptions = { data: item?.data, cancel: false };
    const oldRowIndex = this._getVisibleEditRowIndex();

    if (!item) {
      return undefined;
    }

    if (rowIndex === oldRowIndex) {
      return true;
    }

    if (item.key === undefined) {
      this._dataController.fireError('E1043');
      return undefined;
    }

    if (!item.isNewRow) {
      params.key = item.key;
    }

    if (this._isEditingStart(params)) {
      return undefined;
    }

    this.resetChanges();
    this.init();
    this._resetEditColumnName();
    this._pageIndex = this._dataController.pageIndex();
    this._addInternalData({
      key: item.key,
      oldData: item.oldData ?? item.data,
    });
    this._setEditRowKey(item.key);

    return undefined;
  }

  private _editRowFromOptionChanged(rowIndex: number, oldRowIndex: number): void {
    const rowIndices = [oldRowIndex, rowIndex];

    this._beforeUpdateItems(rowIndices, rowIndex);
    this._editRowFromOptionChangedCore(rowIndices, rowIndex);
  }

  protected _editRowFromOptionChangedCore(
    rowIndices: number[],
    rowIndex: number,
    preventRendering?: boolean,
  ): void {
    this._needFocusEditor = true;
    this._dataController.updateItems({
      changeType: 'update',
      rowIndices,
      cancel: preventRendering,
    });
  }

  public _focusEditorIfNeed(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _showEditPopup(rowIndex: number, repaintForm?: boolean): void {}

  protected _repaintEditPopup(): void {}

  protected getEditPopupHidingHandler(): (e: PopupHidingEvent) => void {
    return (): void => {
      if (this.isEditing()) {
        this.cancelEditData();
      }
    };
  }

  protected _getPopupEditFormTemplate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    rowIndex: number,
  ): ((container: DxElement) => void) | undefined {
    return undefined;
  }

  protected _getSaveButtonConfig(): ButtonProperties {
    const buttonConfig: ButtonProperties = {
      text: this.option('editing.texts.saveRowChanges'),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      onClick: this.saveEditData.bind(this),
    };

    if (isFluent(current())) {
      buttonConfig.stylingMode = 'contained';
      buttonConfig.type = 'default';
    }

    return buttonConfig;
  }

  protected _getCancelButtonConfig(): ButtonProperties {
    const buttonConfig: ButtonProperties = {
      text: this.option('editing.texts.cancelRowChanges'),
      onClick: this.cancelEditData.bind(this),
    };

    if (isFluent(current())) {
      buttonConfig.stylingMode = 'outlined';
    }

    return buttonConfig;
  }

  private _removeInternalData(key: RowKey): void {
    this._internalState.delete(getKeyHash(key));
  }

  private updateInternalDataKey(oldKey: RowKey, newKey: RowKey): void {
    const internalData = this._getInternalData(oldKey) ?? {};

    this._removeInternalData(oldKey);
    this._addInternalData({ ...internalData, key: newKey });
  }

  private _updateInsertAfterOrBeforeKeys(changes: EditingChange[], index: number): void {
    const removeChange = changes[index];

    changes.forEach((change) => {
      if (change.type === DATA_EDIT_DATA_INSERT_TYPE) {
        const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

        if (equalByValue(insertAfterOrBeforeKey, removeChange.key)) {
          const keyName = isDefined(change.insertAfterKey) ? 'insertAfterKey' : 'insertBeforeKey';
          change[keyName] = this._getInsertAfterOrBeforeKey(removeChange);
        }
      }
    });
  }

  /**
   * @extended: DataGrid's summary
   */
  protected _removeChange(index: number): void {
    if (index >= 0) {
      const changes = [...this.getChanges()];
      const { key, type } = changes[index];

      this._removeInternalData(key);

      if (type !== DATA_EDIT_DATA_REMOVE_TYPE) {
        this._updateInsertAfterOrBeforeKeys(changes, index);
      }

      changes.splice(index, 1);
      this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);

      if (equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key)) {
        this._resetEditIndices();
      }
    }
  }

  protected executeOperation(deferred: DeferredObj<unknown>, func: () => void): void {
    if (this._lastOperation) {
      this._lastOperation.reject();
    }
    this._lastOperation = deferred;

    this.waitForDeferredOperations()
      .done(() => {
        if (deferred.state() === 'rejected') {
          return;
        }
        func();
        this._lastOperation = null;
      })
      .fail(() => {
        deferred.reject();
        this._lastOperation = null;
      });
  }

  public waitForDeferredOperations(): DeferredObj<unknown> {
    return when(...this.pendingOperations);
  }

  /**
   * @extended: keyboard_navigation
   * @protected
   */
  protected _processCanceledEditingCell(): void {}

  protected _repaintEditCell(
    column: Column | undefined,
    oldColumn: Column | undefined,
    oldEditRowIndex: number,
  ): void {
    const isOldEditorTemporary = !!oldColumn && !oldColumn.showEditorAlways;

    if (!column?.showEditorAlways || isOldEditorTemporary) {
      this._editCellInProgress = true;
      this._needFocusEditor = true;

      // T316439
      this._editorFactoryController.loseFocus();

      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, this._getVisibleEditRowIndex()],
      });
    } else if (column !== oldColumn) {
      this._needFocusEditor = true;
      // TODO check this necessity T816039
      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: [],
      });
    }
  }

  /**
   * @extended: keyboard_navigation
   */
  protected _delayedInputFocus(
    $cell: dxElementWrapper | undefined,
    beforeFocusCallback?: (() => void) | null,
    callBeforeFocusCallbackAlways?: boolean,
  ): void {
    const inputFocus = (): void => {
      if (beforeFocusCallback) {
        beforeFocusCallback();
      }

      if ($cell) {
        const $focusableElement = $cell.find(FOCUSABLE_ELEMENT_SELECTOR).first();
        gridCoreUtils.focusAndSelectElement(this, $focusableElement);
      }

      this._beforeFocusCallback = null;
    };

    if (devices.real().ios || devices.real().android) {
      inputFocus();
    } else {
      if (this._beforeFocusCallback) {
        this._beforeFocusCallback();
      }

      clearTimeout(this._inputFocusTimeoutID);

      if (callBeforeFocusCallbackAlways) {
        this._beforeFocusCallback = beforeFocusCallback;
      }

      // eslint-disable-next-line no-restricted-globals
      this._inputFocusTimeoutID = setTimeout(inputFocus);
    }
  }

  public _focusEditingCell(
    beforeFocusCallback?: (() => void) | null,
    $editCell?: dxElementWrapper,
    callBeforeFocusCallbackAlways?: boolean,
  ): void {
    const editColumnIndex = this._getVisibleEditColumnIndex();

    const $cellToFocus = $editCell
      ?? this._rowsView?._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex);

    if ($cellToFocus) {
      this._delayedInputFocus($cellToFocus, beforeFocusCallback, callBeforeFocusCallbackAlways);
    }
  }

  /**
   * @extended: adaptivity
   */
  protected deleteRow(rowIndex: number): void {
    this._checkAndDeleteRow(rowIndex);
  }

  protected _checkAndDeleteRow(rowIndex: number): void {
    const { texts, confirmDelete } = this.option('editing') ?? {};
    const { confirmDeleteMessage, confirmDeleteTitle } = texts ?? {};
    const item = this._dataController.items()[rowIndex];
    const allowDeleting = !this.isEditing() || item.isNewRow; // T741746

    if (!item || !allowDeleting) {
      return;
    }

    if (!confirmDelete || !confirmDeleteMessage) {
      this._deleteRowCore(rowIndex);
    } else {
      const showDialogTitle = isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
      // @ts-expect-error confirm() is typed with 2 required params
      confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle)
        // @ts-expect-error confirm() is typed as returning a Promise, not a Deferred
        .done((confirmResult: boolean) => {
          if (confirmResult) {
            this._deleteRowCore(rowIndex);
          }
        });
    }
  }

  /**
   * @extended: focus
   */
  protected _deleteRowCore(rowIndex: number): DeferredObj<unknown> {
    const item = this._dataController.items()[rowIndex];
    const key = item?.key;
    const oldEditRowIndex = this._getVisibleEditRowIndex();

    this.refresh();

    const changes = this.getChanges();
    const editIndex = gridCoreUtils.getIndexByKey(key, changes);

    if (editIndex >= 0) {
      if (changes[editIndex].type === DATA_EDIT_DATA_INSERT_TYPE) {
        this._removeChange(editIndex);
      } else {
        this._addChange({ key, type: DATA_EDIT_DATA_REMOVE_TYPE });
      }
    } else {
      this._addChange({ key, oldData: item.data, type: DATA_EDIT_DATA_REMOVE_TYPE });
    }

    return this._afterDeleteRow(rowIndex, oldEditRowIndex);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _afterDeleteRow(rowIndex: number, oldEditRowIndex: number): DeferredObj<unknown> {
    return this.saveEditData();
  }

  private undeleteRow(rowIndex: number): void {
    const item = this._dataController.items()[rowIndex];
    const oldEditRowIndex = this._getVisibleEditRowIndex();
    const changes = this.getChanges();

    if (!item) {
      return;
    }

    const { key } = item;
    const editIndex = gridCoreUtils.getIndexByKey(key, changes);

    if (editIndex >= 0) {
      const { data } = changes[editIndex];

      if (isEmptyObject(data)) {
        this._removeChange(editIndex);
      } else {
        this._addChange({ key, type: DATA_EDIT_DATA_UPDATE_TYPE });
      }

      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, rowIndex],
      });
    }
  }

  private _fireOnSaving(): DeferredObj<OnSavingResult> {
    const onSavingParams: OnSavingParams = {
      cancel: false,
      promise: null,
      changes: [...this.getChanges()],
    };
    this.executeAction('onSaving', onSavingParams);

    const d = Deferred<OnSavingResult>();

    when(fromPromise(onSavingParams.promise))
      .done(() => {
        d.resolve(onSavingParams);
      })
      .fail((error) => {
        // @ts-expect-error fail() gets the error, but is typed with the resolve value
        this._fireDataErrorOccurred(error);
        d.resolve({ cancel: true });
      });

    return d;
  }

  private _executeEditingAction(
    actionName: string,
    params: EditingActionParams,
    func: (params: EditingActionParams) => DeferredObj<unknown>,
  ): DeferredObj<unknown> | null {
    if (this.component._disposed) {
      return null;
    }

    const deferred = Deferred<unknown>();

    this.executeAction(actionName, params);

    when(fromPromise<unknown>(params.cancel))
      .done((cancel) => {
        if (cancel) {
          // eslint-disable-next-line no-restricted-globals
          setTimeout(() => {
            deferred.resolve('cancel');
          });
        } else {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          func(params).done(deferred.resolve).fail(createFailureHandler(deferred));
        }
      })
      .fail(createFailureHandler(deferred));

    return deferred;
  }

  private _processChanges(changes: EditingChange[]): ProcessedChanges {
    const pendingSaves: DeferredObj<unknown>[] = [];
    const saveResults: SaveResult[] = [];
    const dataChanges: StoreChange[] = [];
    const store = this.dataSourceController.store() as Store;

    changes.forEach((change, index) => {
      if (this._beforeSaveEditData(change)) {
        return;
      }

      const savedChange = { ...change };
      const saveOperation = this.saveChange(store, change, savedChange, dataChanges);

      changes[index] = savedChange;

      if (saveOperation) {
        const pendingSave = Deferred<unknown>();
        saveOperation
          .always((result) => {
            saveResults.push({ key: change.key, result });
          })
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          .always(pendingSave.resolve);

        // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value
        pendingSaves.push(pendingSave.promise());
      }
    });

    return { pendingSaves, saveResults, dataChanges };
  }

  private saveChange(
    store: Store,
    change: EditingChange,
    savedChange: EditingChange,
    dataChanges: StoreChange[],
  ): DeferredObj<unknown> | null {
    const oldData = this._getOldData(change.key);
    const { data, type } = change;

    switch (type) {
      case DATA_EDIT_DATA_REMOVE_TYPE: {
        const params: EditingActionParams = { data: oldData, key: change.key, cancel: false };
        return this._executeEditingAction(
          'onRowRemoving',
          params,
          () => fromPromise(store.remove(change.key))
            .done((key: RowKey) => {
              dataChanges.push({ type: 'remove', key });
            }),
        );
      }
      case DATA_EDIT_DATA_INSERT_TYPE: {
        const params: EditingActionParams = { data, cancel: false };
        return this._executeEditingAction(
          'onRowInserting',
          params,
          () => fromPromise(store.insert(params.data))
            .done((insertedData: unknown, key: RowKey) => {
              if (isDefined(key)) {
                const initialKey = savedChange.key;

                savedChange.key = key;
                this.updateInternalDataKey(initialKey, key);
              }
              if (insertedData && isObject(insertedData) && insertedData !== params.data) {
                savedChange.data = insertedData;
              }
              dataChanges.push({ type: 'insert', data: insertedData, index: 0 });
            }),
        );
      }
      case DATA_EDIT_DATA_UPDATE_TYPE: {
        const params: EditingActionParams = {
          newData: data, oldData, key: change.key, cancel: false,
        };
        return this._executeEditingAction(
          'onRowUpdating',
          params,
          () => fromPromise(store.update(change.key, params.newData))
            .done((updatedData: unknown, key: RowKey) => {
              if (updatedData && isObject(updatedData) && updatedData !== params.newData) {
                savedChange.data = updatedData;
              }
              dataChanges.push({ type: 'update', key, data: updatedData });
            }),
        );
      }
      default:
        return null;
    }
  }

  public _processRemoveIfError(changes: EditingChange[], editIndex: number): boolean {
    const change = changes[editIndex];

    if (change?.type === DATA_EDIT_DATA_REMOVE_TYPE && editIndex >= 0) {
      changes.splice(editIndex, 1);
    }

    return true;
  }

  private _processRemove(
    changes: EditingChange[],
    editIndex: number,
    cancel: boolean,
  ): boolean {
    const change = changes[editIndex];

    if (!cancel || !change || change.type === DATA_EDIT_DATA_REMOVE_TYPE) {
      return this._processRemoveCore(changes, editIndex, !cancel || !change);
    }

    return false;
  }

  protected _processRemoveCore(
    changes: EditingChange[],
    editIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    processIfBatch: boolean,
  ): boolean {
    if (editIndex >= 0) {
      changes.splice(editIndex, 1);
    }

    return true;
  }

  private _processSaveEditDataResult(saveResults: SaveResult[]): boolean {
    let hasSavedData = false;
    const originalChanges = this.getChanges();
    const changes = [...originalChanges];
    const changesLength = changes.length;

    for (const saveResult of saveResults) {
      const arg = saveResult.result;
      const cancel = arg === 'cancel';
      const editIndex = gridCoreUtils.getIndexByKey(saveResult.key, changes);
      const change = changes[editIndex];
      const isError = arg && arg instanceof Error;

      if (isError) {
        if (change) {
          this._addInternalData({ key: change.key, error: arg });
        }
        this._fireDataErrorOccurred(arg);
        if (this._processRemoveIfError(changes, editIndex)) {
          break;
        }
      } else if (this._processRemove(changes, editIndex, cancel)) {
        hasSavedData = !cancel;
        const removedChangeIndex = gridCoreUtils.getIndexByKey(saveResult.key, originalChanges);

        this._updateInsertAfterOrBeforeKeys(originalChanges, removedChangeIndex);
      }
    }

    if (changes.length < changesLength) {
      this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
    }

    return hasSavedData;
  }

  private _fireSaveEditDataEvents(changes: EditingChange[]): void {
    changes.forEach(({ data, key, type }) => {
      const internalData = this._getInternalData(key);
      const params: SavedRowInfo = { key, data };

      if (internalData?.error) {
        params.error = internalData.error;
      }

      switch (type) {
        case DATA_EDIT_DATA_REMOVE_TYPE:
          this.executeAction('onRowRemoved', { ...params, data: internalData?.oldData });
          break;
        case DATA_EDIT_DATA_INSERT_TYPE:
          this.executeAction('onRowInserted', params);
          break;
        case DATA_EDIT_DATA_UPDATE_TYPE:
          this.executeAction('onRowUpdated', params);
          break;
        default:
          break;
      }

      this._removeInternalData(key);
    });

    this.executeAction('onSaved', { changes });
  }

  public saveEditData(): DeferredObj<unknown> {
    const deferred = Deferred<unknown>();
    this.waitForDeferredOperations().done(() => {
      if (this.isSaving()) {
        this._resolveAfterSave(deferred);
        return;
      }
      when(this._beforeSaveEditData()).done((cancel) => {
        if (cancel) {
          this._resolveAfterSave(deferred, { cancel });
          return;
        }
        this._saving = true;

        this._saveEditDataInner()
          .always(() => {
            this._saving = false;
            if (this._refocusEditCell) {
              this._focusEditingCell();
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          .done(deferred.resolve)
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          .fail(deferred.reject);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(deferred.reject);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(deferred.reject);
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  private _resolveAfterSave(
    saveDeferred: DeferredObj<unknown>,
    { cancel, error }: { cancel?: boolean; error?: unknown } = {},
  ): void {
    when(this._afterSaveEditData(cancel)).done(() => {
      saveDeferred.resolve(error);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(saveDeferred.reject);
  }

  protected _saveEditDataInner(): DeferredObj<unknown> {
    const saveDeferred = Deferred<unknown>();
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    when(this._fireOnSaving())
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      .done(({ cancel, changes }) => {
        if (cancel) {
          return saveDeferred.resolve().promise();
        }

        const { pendingSaves, saveResults, dataChanges } = this._processChanges(changes);

        if (pendingSaves.length) {
          this._refocusEditCell = true;
          dataSourceAdapter?.beginLoading();

          when(...pendingSaves).done(() => {
            if (this._processSaveEditDataResult(saveResults)) {
              this._endSaving(dataChanges, changes, saveDeferred);
            } else {
              dataSourceAdapter?.endLoading();
              saveDeferred.resolve();
            }
          }).fail((error) => {
            dataSourceAdapter?.endLoading();
            saveDeferred.resolve(error);
          });

          return saveDeferred
            .always(() => { this._refocusEditCell = true; })
            .promise();
        }

        this._cancelSaving(saveDeferred);

        return undefined;
      })
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      .fail(saveDeferred.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return saveDeferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _beforeEndSaving(changes: EditingChange[]): void {
    this._resetEditIndices();
  }

  private _endSaving(
    dataChanges: StoreChange[],
    changes: EditingChange[],
    saveDeferred: DeferredObj<unknown>,
  ): void {
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    this._beforeEndSaving(changes);

    dataSourceAdapter?.endLoading();

    this._refreshDataAfterSave(dataChanges, changes, saveDeferred);
  }

  protected _cancelSaving(saveDeferred: DeferredObj<unknown>): void {
    this.executeAction('onSaved', { changes: [] });
    this._resolveAfterSave(saveDeferred);
  }

  private _refreshDataAfterSave(
    dataChanges: StoreChange[],
    changes: EditingChange[],
    saveDeferred: DeferredObj<unknown>,
  ): void {
    const dataController = this._dataController;
    const refreshMode = this.option('editing.refreshMode');
    const isFullRefresh = refreshMode !== 'reshape' && refreshMode !== 'repaint';

    if (!isFullRefresh) {
      this.dataSourceController.push(dataChanges);
    }

    when(dataController.refresh({
      selection: isFullRefresh,
      reload: isFullRefresh,
      load: refreshMode === 'reshape',
      changesOnly: this.option('repaintChangesOnly'),
    })).always(() => {
      this._fireSaveEditDataEvents(changes);
    }).done(() => {
      this._resolveAfterSave(saveDeferred);
    }).fail((error) => {
      this._resolveAfterSave(saveDeferred, { error });
    });
  }

  public isSaving(): boolean | undefined {
    return this._saving;
  }

  private _updateEditColumn(): void {
    const isEditColumnVisible = this._isEditColumnVisible();
    const useIcons = this.option('editing.useIcons');
    const cssClass = COMMAND_EDIT_CLASS + (useIcons ? ` ${COMMAND_EDIT_WITH_ICONS_CLASS}` : '');

    this._columnsController.addCommandColumn({
      type: 'buttons',
      command: 'edit',
      visible: isEditColumnVisible,
      cssClass,
      width: 'auto',
      alignment: 'center',
      cellTemplate: this._getEditCommandCellTemplate(),
      fixedPosition: 'right',
    });

    this._columnsController.columnOption('command:edit', {
      visible: isEditColumnVisible,
      cssClass,
    });
  }

  protected _isEditColumnVisible(): boolean {
    const editingOptions: EditingOptions | undefined = this.option('editing');

    // @ts-expect-error the editing option has defaults, a callback shows the column
    return editingOptions.allowDeleting;
  }

  private _isEditButtonDisabled(): boolean {
    const hasChanges = this.hasChanges();
    const isEditRowDefined = isDefined(this.option('editing.editRowKey'));

    return !isEditRowDefined && !hasChanges;
  }

  /**
   * @extended: DataGrid's export
   */
  protected _updateEditButtons(): void {
    if (this._headerPanelView) {
      const isButtonDisabled = this._isEditButtonDisabled();

      this._headerPanelView.setToolbarItemDisabled('saveButton', isButtonDisabled);
      this._headerPanelView.setToolbarItemDisabled('revertButton', isButtonDisabled);
    }
  }

  protected _applyModified(
    $element: dxElementWrapper | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- callers pass the cell options
    options: EditorCellOptions,
  ): void {
    if ($element) {
      $element.addClass(CELL_MODIFIED);
    }
  }

  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _beforeCloseEditCellInBatchMode(rowIndices: number[]): void {}

  /**
   * @extended: DataGird's summary
   */
  public cancelEditData(): void {
    const changes = this.getChanges();
    const params = {
      cancel: false,
      changes,
    };

    this.executeAction('onEditCanceling', params);
    if (!params.cancel) {
      this._cancelEditDataCore();
      this.executeAction('onEditCanceled', { changes });
    }
  }

  protected _cancelEditDataCore(): void {
    const rowIndex = this._getVisibleEditRowIndex();

    this._beforeCancelEditData();

    this.init();
    this.resetChanges();
    this._resetEditColumnName();
    this._resetEditRowKey();

    this._afterCancelEditData(rowIndex);
  }

  /**
   * @extended: filter_row
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _afterCancelEditData(rowIndex: number): void {
    this._dataController.updateItems({
      changeType: 'refresh',
      repaintChangesOnly: this.option('repaintChangesOnly'),
    });
  }

  protected _hideEditPopup(): void {}

  protected hasEditData(): boolean {
    return this.hasChanges();
  }

  private update(changeType: DataChange['changeType']): void {
    if (this._dataController && this._pageIndex !== this._dataController.pageIndex()) {
      if (changeType === 'refresh') {
        this.refresh({ isPageChanged: true });
      }
      this._pageIndex = this._dataController.pageIndex();
    }
    this._updateEditButtons();
  }

  /**
   * @extended: adaptivity
   */
  protected _getRowIndicesForCascadeUpdating(
    row: ProcessedItem,
    skipCurrentRow?: boolean,
  ): number[] {
    // @ts-expect-error a rendered row has its rowIndex
    return skipCurrentRow ? [] : [row.rowIndex];
  }

  /**
   * Adds a deferred object to be awaited before other operations are executed
   */
  public addDeferred(deferred: DeferredObj<unknown>): void {
    if (!this.pendingOperations.includes(deferred)) {
      this.pendingOperations.push(deferred);
      deferred.always(() => {
        const index = this.pendingOperations.indexOf(deferred);
        if (index >= 0) {
          this.pendingOperations.splice(index, 1);
        }
      });
    }
  }

  protected _prepareChange(
    options: EditorCellOptions,
    value: unknown,
    text?: string,
  ): DeferredObj<EditingChangeParams> {
    const newData: RawItemData = {};
    const oldData = options.row?.data;
    const rowKey = options.key;
    const deferred = Deferred<EditingChangeParams>();

    if (rowKey !== undefined) {
      options.value = value;

      const setCellValueResult = fromPromise(
        // @ts-expect-error callers check setCellValue, it also gets the display text
        options.column.setCellValue(newData, value, extend(true, {}, oldData), text),
      );
      setCellValueResult
        .done(() => {
          deferred.resolve({
            data: newData,
            key: rowKey,
            oldData,
            type: DATA_EDIT_DATA_UPDATE_TYPE,
          });
        })
        .fail(createFailureHandler(deferred))
        // @ts-expect-error fail() gets the error, but is typed with the resolve value
        .fail((error: Error | string) => this._fireDataErrorOccurred(error));

      if (isDefined(text) && options.column.displayValueMap) {
        // @ts-expect-error displayValueMap is keyed by the values
        options.column.displayValueMap[value] = text;
      }

      this._updateRowValues(options);

      this.addDeferred(deferred);
    }

    return deferred;
  }

  private _updateRowValues(options: EditorCellOptions): void {
    if (options.values) {
      const rowIndex = this._dataController.getRowIndexByKey(options.key);
      const row = this._dataController.getVisibleRows()[rowIndex];

      if (row) {
        // @ts-expect-error a data cell has a row
        options.row.values = row.values; // T1122209
        options.values = row.values;
      }

      options.values[options.columnIndex] = options.value;
    }
  }

  /**
   * @extended: filter_row, validating
   */
  public updateFieldValue(
    options: EditorCellOptions,
    value: unknown,
    text?: string,
    forceUpdateRow?: boolean,
  ): DeferredObj<unknown> {
    const rowKey = options.key;
    const deferred = Deferred<unknown>();

    if (rowKey === undefined) {
      this._dataController.fireError('E1043');
    }

    if (options.column.setCellValue) {
      this._prepareChange(options, value, text).done((params) => {
        when(this._applyChange(options, params, forceUpdateRow)).always(() => {
          deferred.resolve();
        });
      });
    } else {
      deferred.resolve();
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  protected _needUpdateRow(column?: Column): boolean {
    const visibleColumns = this._columnsController.getVisibleColumns();
    const editColumn = column ?? this._getEditColumn();

    const isCustomSetCellValue = !!editColumn
      && editColumn.setCellValue !== editColumn.defaultSetCellValue;
    const isCustomCalculateCellValue = visibleColumns.some(
      (visibleColumn) => visibleColumn.calculateCellValue
        !== visibleColumn.defaultCalculateCellValue,
    );

    return isCustomSetCellValue || isCustomCalculateCellValue;
  }

  protected _applyChange(
    options: EditorCellOptions,
    params: EditingChangeParams,
    forceUpdateRow?: boolean,
  ): DeferredObj<unknown> | undefined {
    const changeOptions = { ...options, forceUpdateRow };

    this._addChange(params, changeOptions);
    this._updateEditButtons();

    return this._applyChangeCore(options, changeOptions.forceUpdateRow);
  }

  protected _applyChangeCore(
    options: EditorCellOptions,
    forceUpdateRow?: boolean,
  ): DeferredObj<unknown> | undefined {
    const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;

    const { row } = options;
    if (row) {
      if (forceUpdateRow || isCustomSetCellValue) {
        this._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
      } else if (row.update) {
        row.update();
      }
    }

    return undefined;
  }

  protected _updateEditRowCore(
    row: ProcessedItem,
    skipCurrentRow: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    isCustomSetCellValue?: boolean,
  ): void {
    this._dataController.updateItems({
      changeType: 'update',
      rowIndices: this._getRowIndicesForCascadeUpdating(row, skipCurrentRow),
    });
  }

  protected _updateEditRow(
    row: ProcessedItem,
    forceUpdateRow?: boolean,
    isCustomSetCellValue?: boolean,
  ): void {
    if (forceUpdateRow) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      this._updateRowWithDelay(row, isCustomSetCellValue);
    }
  }

  protected _updateRowImmediately(
    row: ProcessedItem,
    forceUpdateRow?: boolean,
    isCustomSetCellValue?: boolean,
  ): void {
    this._updateEditRowCore(row, !forceUpdateRow, isCustomSetCellValue);
    this._validateEditFormAfterUpdate(row, isCustomSetCellValue);
    if (!forceUpdateRow) {
      this._focusEditingCell();
    }
  }

  private _updateRowWithDelay(row: ProcessedItem, isCustomSetCellValue?: boolean): void {
    const deferred = Deferred<unknown>();
    this.addDeferred(deferred);
    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => {
      // NOTE: if the editForm is enabled then we need to search for focused element
      // in the document root, otherwise we need to search for element in the shadow dom
      const elementContainer = this._editForm?.element()
        ?? this.component.$element().get(0) as HTMLElement;
      const $focusedElement = $(domAdapter.getActiveElement(elementContainer));
      const columnIndex = this._rowsView.getCellIndex($focusedElement, row.rowIndex);
      let focusedElement = $focusedElement.get(0);
      const selectionRange = gridCoreUtils.getSelectionRange(focusedElement);

      this._updateEditRowCore(row, false, isCustomSetCellValue);
      this._validateEditFormAfterUpdate(row, isCustomSetCellValue);

      if (columnIndex >= 0 && isDefined(row.rowIndex)) {
        const $focusedItem = this._rowsView._getCellElement(row.rowIndex, columnIndex);
        this._delayedInputFocus($focusedItem, () => {
          // eslint-disable-next-line no-restricted-globals
          setTimeout(() => {
            focusedElement = domAdapter.getActiveElement(
              this.component.$element()?.get(0) as HTMLElement,
            );
            if (selectionRange.selectionStart >= 0) {
              gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
            }
          });
        });
      }
      deferred.resolve();
    });
  }

  /**
   * @extended: validating
   */
  protected _validateEditFormAfterUpdate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    row: ProcessedItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    isCustomSetCellValue?: boolean,
  ): void {}

  /**
   * @extended: validating
   */
  protected _addChange(
    changeParams: EditingChangeParams,
    options?: { row?: ProcessedItem; forceUpdateRow?: boolean },
  ): EditingChange {
    const row = options?.row;
    const changes = [...this.getChanges()];
    let index = gridCoreUtils.getIndexByKey(changeParams.key, changes);

    if (index < 0) {
      index = changes.length;

      this._addInternalData({
        key: changeParams.key,
        oldData: changeParams.oldData,
      });

      delete changeParams.oldData;

      // @ts-expect-error callers pass key and type; a remove change has no data
      changes.push(changeParams);
    }

    const change = { ...changes[index] };

    if (change) {
      if (changeParams.data) {
        change.data = createObjectWithChanges(change.data, changeParams.data);
      }
      if ((!change.type || !changeParams.data) && changeParams.type) {
        change.type = changeParams.type;
      }
      if (row) {
        row.oldData = this._getOldData(row.key);
        row.data = createObjectWithChanges(row.data, changeParams.data);
      }
    }

    changes[index] = change;

    this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);

    // T1043517
    if (options && change !== this.getChanges()?.[index]) {
      options.forceUpdateRow = true;
    }

    return change;
  }

  /**
   * @extended: adaptivity
   */
  protected _getFormEditItemTemplate(
    cellOptions: EditorCellOptions,
    column: EditingColumn,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
    return column.editCellTemplate || this._getDefaultEditorTemplate();
  }

  public getColumnTemplate(
    options: EditorCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    const { column, row, rowType } = options;
    const rowIndex = row?.rowIndex;

    const isRowMode = this.isRowBasedEditMode();
    const isRowEditing = this.isEditRow(rowIndex);
    const isCellEditing = this.isEditCell(rowIndex, options.columnIndex);

    const isEditableRowType = rowType === 'data' || rowType === 'detailAdaptive';
    const isEditableByRowState = isRowEditing && !!column.allowEditing;
    const needsEditorTemplate = !!column.showEditorAlways
      || (column.setCellValue && (isEditableByRowState || isCellEditing));

    if (needsEditorTemplate && isEditableRowType && !column.command) {
      const allowUpdating = this.allowUpdating(options);
      const canModifyCell = (allowUpdating || isRowEditing) && !!column.allowEditing;
      const isEditable = (canModifyCell || isCellEditing) && (isRowEditing || !isRowMode);

      if (isEditable) {
        // eslint-disable-next-line @typescript-eslint/init-declarations
        let editingStartOptions: EditingStartOptions | undefined;
        if (column.showEditorAlways && !isRowMode && row) {
          editingStartOptions = {
            cancel: false,
            key: row.isNewRow ? undefined : row.key,
            data: row.data,
            column,
          };
          this._isEditingStart(editingStartOptions);
        }
        if (!editingStartOptions?.cancel) {
          options.setValue = (value, text): void => {
            this.updateFieldValue(options, value, text);
          };
        }
      }
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
      return column.editCellTemplate || this._getDefaultEditorTemplate();
    }

    if (column.command === 'detail' && rowType === 'detail' && isRowEditing) {
      // @ts-expect-error the form-based extender adds getEditFormTemplate
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- form-based extender adds it
      return this?.getEditFormTemplate(options);
    }

    return undefined;
  }

  private _createButton(
    $container: dxElementWrapper,
    button: InternalColumnButton,
    options: EditorCellOptions,
    change?: ViewDataChange,
  ): void {
    // @ts-expect-error a custom button can have no name, then its lookups give undefined
    const buttonName: string = button.name;
    let icon = EDIT_ICON_CLASS[buttonName];
    const useIcons = this.option('editing.useIcons');
    const useLegacyColumnButtonTemplate = this.option('useLegacyColumnButtonTemplate');
    let $button = $('<a>')
      .attr('href', '#')
      .addClass(LINK_CLASS)
      .addClass(button.cssClass ?? '');

    if (button.template && useLegacyColumnButtonTemplate) {
      this._rowsView.renderTemplate($container, button.template, options, true);
    } else {
      if (button.template) {
        $button = $('<span>').addClass(button.cssClass ?? '');
      } else if ((useIcons && icon) || button.icon) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
        icon = button.icon || icon;
        const iconType = iconUtils.getImageSourceType(icon);

        if (iconType === 'image' || iconType === 'svg') {
          // @ts-expect-error an image/svg has a container; addClass() is typed without undefined
          $button = iconUtils.getImageContainer(icon).addClass(button.cssClass);
        } else {
          // @ts-expect-error attr() is typed without undefined
          $button.addClass(`dx-icon${iconType === 'dxIcon' ? '-' : ' '}${icon}`).attr('title', button.text);
        }

        $button.addClass(LINK_ICON_CLASS);
        $container.addClass(COMMAND_EDIT_WITH_ICONS_CLASS);

        const localizationName = this.getButtonLocalizationNames()[buttonName];

        if (localizationName) {
          this.setAria('label', messageLocalization.format(localizationName), $button);
        }
      } else {
        // @ts-expect-error text() is typed without undefined
        $button.text(button.text);
      }

      if (isDefined(button.hint)) {
        $button.attr('title', button.hint);
      }

      if (this._isButtonDisabled(button, options)) {
        $button.addClass('dx-state-disabled');
        this.setAria('disabled', 'true', $button);
      } else if (!button.template || button.onClick) {
        eventsEngine.on($button, addNamespace('click', EDITING_NAMESPACE), this.createAction((e): void => {
          button.onClick?.call(button, extend({}, e, { row: options.row, column: options.column }));
          e.event.preventDefault();
          e.event.stopPropagation();
        }));
      }

      $container.append($button);

      if (button.template) {
        options.renderAsync = false;
        this._rowsView.renderTemplate($button, button.template, options, true, change);
      }
    }
  }

  /**
   * @extended: TreeList's editing
   */
  protected getButtonLocalizationNames(): EditingButtonLocalizationNames {
    return {
      edit: 'dxDataGrid-editingEditRow',
      save: 'dxDataGrid-editingSaveRowChanges',
      delete: 'dxDataGrid-editingDeleteRow',
      undelete: 'dxDataGrid-editingUndeleteRow',
      cancel: 'dxDataGrid-editingCancelRowChanges',
    };
  }

  protected prepareButtonItem(
    headerPanel: HeaderPanel,
    name: string,
    methodName: string,
    sortIndex: number,
  ): ToolbarItem {
    const editingTexts = this.option('editing.texts') ?? {};

    const titleButtonTextByClassNames = {
      revert: editingTexts.cancelAllChanges,
      save: editingTexts.saveAllChanges,
      addRow: editingTexts.addRow,
    };
    const classNameButtonByNames = {
      revert: 'cancel',
      save: 'save',
      addRow: 'addrow',
    };

    const className = classNameButtonByNames[name];
    const onInitialized = (e: ButtonInitializedEvent): void => {
      $(e.element).addClass(headerPanel.getToolbarButtonClass(
        `${EDIT_BUTTON_CLASS} ${this.addWidgetPrefix(className)}-button`,
      ));
    };
    const hintText = titleButtonTextByClassNames[name];
    const isButtonDisabled = (className === 'save' || className === 'cancel')
      && this._isEditButtonDisabled();

    return {
      widget: 'dxButton',
      options: {
        onInitialized,
        icon: `edit-button-${className}`,
        disabled: isButtonDisabled,
        onClick: (): void => {
          // eslint-disable-next-line no-restricted-globals
          setTimeout(() => {
            this[methodName]();
          });
        },
        text: hintText,
        hint: hintText,
      },
      showText: 'inMenu',
      name: `${name}Button`,
      location: 'after',
      locateInMenu: 'auto',
      sortIndex,
    };
  }

  public prepareEditButtons(headerPanel: HeaderPanel): ToolbarItem[] {
    const editingOptions: EditingOptions = this.option('editing') ?? {};
    const buttonItems: ToolbarItem[] = [];

    if (editingOptions.allowAdding) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'addRow', 'addRow', 20));
    }

    return buttonItems;
  }

  /**
   * @extended: validating
   */
  public highlightDataCell($cell: dxElementWrapper, params: EditorCellOptions): void {
    if (this.shouldHighlightCell(params)) {
      $cell.addClass(CELL_MODIFIED);
    }
  }

  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _afterInsertRow(key: RowKey): void {}

  /**
   * @extended: validating, TreeList's editing
   */
  protected _beforeSaveEditData(change?: EditingChange): boolean {
    return !!change && !isDefined(change.key) && isDefined(change.type);
  }

  /**
   * @extended: adaptivity, filter_row, validating
   */
  protected _afterSaveEditData(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
    cancel?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- validating returns void
  ): DeferredObj<unknown> | void {}

  /**
   * @extended: adaptivity, validating
   */
  protected _beforeCancelEditData(): void {}

  protected _allowEditAction(actionName: EditActions, options: EditActionOptions): boolean {
    const allowEditAction: AllowEditActionValue | undefined = this.option('editing')?.[actionName];

    return isFunction(allowEditAction)
      ? allowEditAction({ component: this.component, row: options.row })
      : !!allowEditAction;
  }

  public allowUpdating(
    options: EditActionOptions,
    eventName?: string,
    allowEditingForNewRows = true,
  ): boolean {
    if (allowEditingForNewRows && options.row?.isNewRow) {
      return true;
    }

    const startEditAction = this.option('editing.startEditAction') ?? DEFAULT_START_EDIT_ACTION;
    const isStartEditEvent = !isDefined(eventName)
      || eventName === startEditAction
      || eventName === 'down';

    return isStartEditEvent && this._allowEditAction('allowUpdating', options);
  }

  protected allowDeleting(options: EditActionOptions): boolean {
    return this._allowEditAction('allowDeleting', options);
  }

  /**
   * @extended: validating
   */
  public isCellModified(parameters: EditorCellOptions): boolean {
    const { columnIndex } = parameters;
    const modifiedValue = parameters?.row?.isNewRow
      ? parameters.value
      : parameters?.row?.modifiedValues?.[columnIndex];

    return modifiedValue !== undefined;
  }

  public isNewRowInEditMode(): boolean | undefined {
    const visibleEditRowIndex = this._getVisibleEditRowIndex();
    const rows = this._dataController.items();

    return visibleEditRowIndex >= 0 ? rows[visibleEditRowIndex].isNewRow : false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _prepareEditCell(parameters: NormalizedEditCellOptions): boolean {
    return false;
  }

  /// #DEBUG
  public getInternalStateSize(): number {
    return this._internalState.size;
  }
  /// #ENDDEBUG

  public shouldHighlightCell(parameters: EditorCellOptions): boolean | undefined {
    const cellModified = this.isCellModified(parameters);
    const isEditedInRowMode = this.getEditMode() === EDIT_MODE_ROW && !!parameters.row?.isEditing;

    return cellModified && parameters.column.setCellValue && !isEditedInRowMode;
  }
}

export type EditingController = EditingControllerImpl
  & ICellBasedEditingControllerExtender
  & IFormBasedEditingControllerExtender;

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class RowsViewEditingExtender extends Base {
  private _pointerDownTarget?: EventTarget | null;

  private _pointerDownTimeout?: ReturnType<typeof setTimeout>;

  public getCellIndex($cell: dxElementWrapper, rowIndex?: number): number {
    if (!$cell.is('td') && rowIndex !== undefined && rowIndex >= 0) {
      const $cellElements = this.getCellElements(rowIndex);
      let cellIndex = -1;

      each($cellElements, (index, cellElement) => {
        if ($(cellElement).find($cell).length) {
          cellIndex = index;
        }
      });

      return cellIndex;
    }

    return super.getCellIndex($cell, rowIndex);
  }

  public publicMethods(): string[] {
    return super.publicMethods().concat(['cellValue']);
  }

  protected _getCellTemplate(
    options: EditorCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    const template = this._editingController.getColumnTemplate(options);

    return template ?? super._getCellTemplate(options);
  }

  protected _createRow(row?: ProcessedItem, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (row) {
      const isRowRemoved = !!row.removed;
      const isRowInserted = !!row.isNewRow;
      const isRowModified = !!row.modified;

      if (isRowInserted) {
        $row.addClass(ROW_INSERTED);
      }
      if (isRowModified) {
        $row.addClass(ROW_MODIFIED);
      }

      if (isRowInserted || isRowRemoved) {
        $row.removeClass(ROW_SELECTED);
      }
    }
    return $row;
  }

  private _getColumnIndexByElement($element: dxElementWrapper): number {
    let $cellElement = $element;
    let $tableElement = $cellElement.closest('table');
    const $tableElements = this.getTableElements();

    // @ts-expect-error filter() is typed for selectors only
    while ($tableElement.length && !$tableElements.filter($tableElement).length) {
      $cellElement = $tableElement.closest('td');
      $tableElement = $cellElement.closest('table');
    }

    return this._getColumnIndexByElementCore($cellElement);
  }

  private _getColumnIndexByElementCore($element: dxElementWrapper): number {
    const $targetElement = $element.closest(`.${VIEW_CLASSES.row}> td:not(.dx-master-detail-cell)`);

    return this.getCellIndex($targetElement);
  }

  private _editCellByClick(e: ViewRowEvent, eventName: string): boolean | undefined {
    const editingController = this._editingController;
    const $targetElement = $(e.event.target);
    const columnIndex = this._getColumnIndexByElement($targetElement);
    const row = this._dataController.items()[e.rowIndex];
    const allowUpdating = editingController.allowUpdating({ row }, eventName);
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    const isEditedCell = editingController.isEditCell(e.rowIndex, columnIndex);
    const allowEditing = allowUpdating && column && (!!column.allowEditing || isEditedCell);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const startEditAction = this.option('editing.startEditAction') || 'click';
    const isShowEditorAlways = column?.showEditorAlways;

    if (isEditedCell) {
      return true;
    }

    if (eventName === 'down') {
      if (devices.real().ios || devices.real().android) {
        domUtils.resetActiveElement();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- editCell() isn't typed yet
      return isShowEditorAlways && allowEditing
        && editingController.editCell(e.rowIndex, columnIndex);
    }

    if (
      eventName === 'click'
      && startEditAction === 'dblClick'
      && this._pointerDownTarget === $targetElement.get(0)
    ) {
      const isError = false;
      const withoutSaveEditData = row?.isNewRow;
      editingController.closeEditCell(isError, withoutSaveEditData);
    }

    if (allowEditing && eventName === startEditAction) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- editCell() isn't typed yet
      return editingController.editCell(e.rowIndex, columnIndex)
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- false falls back
        || editingController.isEditRow(e.rowIndex);
    }

    return undefined;
  }

  protected _rowPointerDown(e: ViewRowEvent): void {
    this._pointerDownTarget = e.event.target;
    // eslint-disable-next-line no-restricted-globals
    this._pointerDownTimeout = setTimeout(() => {
      this._editCellByClick(e, 'down');
    });
  }

  private _rowClickTreeListHack(e: ViewRowEvent): void {
    super._rowClick(e);
  }

  protected _rowClick(e: ViewRowEvent): void {
    const isEditForm = $(e.rowElement).hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS));

    e.event[TARGET_COMPONENT_NAME] = this.component;

    if (!this._editCellByClick(e, 'click') && !isEditForm) {
      super._rowClick(e);
    }
  }

  private _rowDblClickTreeListHack(e: ViewRowEvent): void {
    super._rowDblClick(e);
  }

  protected _rowDblClick(e: ViewRowEvent): void {
    if (!this._editCellByClick(e, 'dblClick')) {
      super._rowDblClick(e);
    }
  }

  public _cellPrepared($cell: dxElementWrapper, parameters: EditorCellOptions): void {
    const editingController = this._editingController;
    const isCommandCell = !!parameters.column.command;
    const isEditableCell = parameters.setValue;
    const isEditRow = editingController.isEditRow(parameters.rowIndex);
    const isEditing = isEditingCell(isEditRow, parameters);

    if (isEditingOrShowEditorAlwaysDataCell(isEditRow, parameters)) {
      const { alignment } = parameters.column;

      $cell
        .toggleClass(this.addWidgetPrefix(READONLY_CLASS), !isEditableCell)
        .toggleClass(CELL_FOCUS_DISABLED_CLASS, !isEditableCell);

      if (alignment) {
        $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', alignment);
      }
    }

    if (isEditing) {
      this._editCellPrepared($cell);
    }

    const hasTemplate = !!parameters.column?.cellTemplate;

    if (
      parameters.column
      && !isCommandCell
      && (!hasTemplate || editingController.shouldHighlightCell(parameters))
    ) {
      editingController.highlightDataCell($cell, parameters);
    }
    super._cellPrepared($cell, parameters);
  }

  public _getCellOptions(options: CellRenderOptions): ViewCellOptions {
    const cellOptions = super._getCellOptions(options);
    // @ts-expect-error the rows view types its rows as ViewRow
    const { columnIndex, row }: { columnIndex: number; row: ProcessedItem } = options;

    cellOptions.isEditing = this._editingController.isEditCell(
      cellOptions.rowIndex,
      cellOptions.columnIndex,
    );
    cellOptions.removed = row.removed;

    if (row.modified) {
      // @ts-expect-error a modified row has its modifiedValues
      cellOptions.modified = row.modifiedValues[columnIndex] !== undefined;
    }

    return cellOptions;
  }

  protected _setCellAriaAttributes(
    $cell: dxElementWrapper,
    cellOptions: ViewCellOptions,
    options: CellRenderOptions,
  ): void {
    super._setCellAriaAttributes($cell, cellOptions, options);

    if (cellOptions.removed) {
      this.setAria(
        'roledescription',
        messageLocalization.format('dxDataGrid-ariaDeletedCell'),
        $cell,
      );
    }
    if (cellOptions.modified) {
      this.setAria(
        'roledescription',
        messageLocalization.format('dxDataGrid-ariaModifiedCell'),
        $cell,
      );
    }

    const isEditableCell = cellOptions.column.allowEditing
      && !cellOptions.removed
      && !cellOptions.modified
      && cellOptions.rowType === 'data'
      && cellOptions.column.calculateCellValue === cellOptions.column.defaultCalculateCellValue
      && this._editingController.isCellBasedEditMode();

    if (isEditableCell) {
      this.setAria(
        'roledescription',
        messageLocalization.format('dxDataGrid-ariaEditableCell'),
        $cell,
      );
    }
  }

  protected _createCell(options: ViewCellOptions): dxElementWrapper {
    const $cell = super._createCell(options);
    const isEditRow = this._editingController.isEditRow(options.rowIndex);

    if (isEditingOrShowEditorAlwaysDataCell(isEditRow, options)) {
      $cell.addClass(EDITOR_CELL_CLASS);
    }

    return $cell;
  }

  private cellValue(
    rowIndex: number,
    columnIdentifier: string | number,
    value?: unknown,
    text?: string,
  ): unknown {
    const cellOptions = this.getCellOptions(rowIndex, columnIdentifier);

    if (cellOptions) {
      if (value === undefined) {
        return cellOptions.value;
      }
      // @ts-expect-error the rows view types its rows as ViewRow
      this._editingController.updateFieldValue(cellOptions, value, text, true);
    }

    return undefined;
  }

  public dispose(): void {
    super.dispose();
    clearTimeout(this._pointerDownTimeout);
  }

  protected _renderCore(change?: DataChange): DeferredObj<unknown> {
    super._renderCore(change);

    return this.waitAsyncTemplates(true).done(() => {
      this._editingController._focusEditorIfNeed();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _editCellPrepared($cell: dxElementWrapper): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  protected _formItemPrepared(cellOptions: ViewCellOptions, $container: dxElementWrapper): void {}
};

const headerPanel = (
  Base: ModuleType<HeaderPanel>,
): ModuleType<HeaderPanel> => class HeaderPanelEditingExtender extends Base {
  public optionChanged(args: EditingModuleOptionChanged): void {
    const { fullName } = args;
    switch (args.name) {
      case 'editing': {
        const excludedOptions = [
          EDITING_POPUP_OPTION_NAME,
          EDITING_CHANGES_OPTION_NAME,
          EDITING_EDITCOLUMNNAME_OPTION_NAME,
          EDITING_EDITROWKEY_OPTION_NAME,
        ];
        const shouldInvalidate = fullName
          && !excludedOptions.some((optionName) => optionName === fullName);

        if (shouldInvalidate) {
          this._invalidate();
        }
        super.optionChanged(args);
        break;
      }
      case 'useLegacyColumnButtonTemplate':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  protected _getToolbarItems(): ToolbarItem[] {
    const items = super._getToolbarItems();
    const editButtonItems = this._editingController.prepareEditButtons(this);

    return editButtonItems.concat(items);
  }
};

export const editingModule = {
  defaultOptions(): { editing: EditingOptions } & EditingModuleOptions {
    return {
      editing: {
        mode: 'row', // "batch"
        refreshMode: 'full',
        newRowPosition: VIEWPORT_TOP_NEW_ROW_POSITION,
        allowAdding: false,
        allowUpdating: false,
        allowDeleting: false,
        useIcons: false,
        selectTextOnEditStart: false,
        confirmDelete: true,
        texts: {
          editRow: messageLocalization.format('dxDataGrid-editingEditRow'),
          saveAllChanges: messageLocalization.format('dxDataGrid-editingSaveAllChanges'),
          saveRowChanges: messageLocalization.format('dxDataGrid-editingSaveRowChanges'),
          cancelAllChanges: messageLocalization.format('dxDataGrid-editingCancelAllChanges'),
          cancelRowChanges: messageLocalization.format('dxDataGrid-editingCancelRowChanges'),
          addRow: messageLocalization.format('dxDataGrid-editingAddRow'),
          deleteRow: messageLocalization.format('dxDataGrid-editingDeleteRow'),
          undeleteRow: messageLocalization.format('dxDataGrid-editingUndeleteRow'),
          confirmDeleteMessage: messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'),
          confirmDeleteTitle: '',
        },
        form: {
          colCount: 2,
        },

        popup: {},

        startEditAction: 'click',

        editRowKey: undefined,

        editColumnName: undefined,

        changes: [],
      },
      useLegacyColumnButtonTemplate: false,
    };
  },
  controllers: {
    editing: EditingControllerImpl,
  },
  extenders: {
    controllers: {
      data: editingDataControllerExtender,
    },
    views: {
      rowsView,
      headerPanel,
    },
  },
};
