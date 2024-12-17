/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-vars, max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { removeEvent } from '@js/common/core/events/remove';
import { addNamespace } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import { createObjectWithChanges } from '@js/common/data/array_utils';
import type { GridsEditMode } from '@js/common/grids';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue, getKeyHash } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
// @ts-expect-error
import { Deferred, fromPromise, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import * as iconUtils from '@js/core/utils/icon';
import { each } from '@js/core/utils/iterator';
import { deepExtendArraySafe } from '@js/core/utils/object';
import {
  isDefined, isEmptyObject,
  isFunction, isObject,
} from '@js/core/utils/type';
import { confirm } from '@js/ui/dialog';
import { current, isFluent } from '@js/ui/themes';
import domUtils from '@ts/core/utils/m_dom';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/m_header_panel';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import modules from '../m_modules';
import type { Controllers, ModuleType, Views } from '../m_types';
import gridCoreUtils from '../m_utils';
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
  ROW_CLASS,
  ROW_INSERTED,
  ROW_MODIFIED,
  ROW_SELECTED,
  TARGET_COMPONENT_NAME,
  VIEWPORT_BOTTOM_NEW_ROW_POSITION,
  VIEWPORT_TOP_NEW_ROW_POSITION,
} from './const';
import type { ICellBasedEditingControllerExtender } from './m_editing_cell_based';
import type { IFormBasedEditingControllerExtender } from './m_editing_form_based';
import {
  createFailureHandler,
  generateNewRowTempKey,
  getButtonIndex,
  getButtonName,
  getEditingTexts,
  isEditingCell,
  isEditingOrShowEditorAlwaysDataCell,
} from './m_editing_utils';

class EditingControllerImpl extends modules.ViewController {
  protected _columnsController!: Controllers['columns'];

  protected _dataController!: Controllers['data'];

  protected _adaptiveColumnsController!: Controllers['adaptiveColumns'];

  protected _validatingController!: Controllers['validating'];

  protected _editorFactoryController!: Controllers['editorFactory'];

  protected _focusController!: Controllers['focus'];

  protected _columnsResizerController!: Controllers['columnsResizer'];

  protected _keyboardNavigationController!: Controllers['keyboardNavigation'];

  protected _errorHandlingController!: Controllers['errorHandling'];

  protected _rowsView!: Views['rowsView'];

  private _headerPanelView!: Views['headerPanel'];

  private _lastOperation: any;

  private _changes: any;

  /**
   * A collection of deferred objects that are awaited before other operations are executed.
   *
   * @see {@link this.waitForDeferredOperations}
   * @see {@link this.addDeferred}
   */
  private _deferreds!: DeferredObj<any>[];

  private _dataChangedHandler: any;

  protected _saveEditorHandler: any;

  private _internalState!: Map<unknown, any>;

  protected _refocusEditCell: any;

  protected _editCellInProgress: any;

  protected _needFocusEditor: any;

  private _beforeFocusCallback: any;

  private _saving: any;

  protected _editForm: any;

  protected _pageIndex: any;

  protected _inputFocusTimeoutID: any;

  public init() {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._validatingController = this.getController('validating');
    this._editorFactoryController = this.getController('editorFactory');
    this._focusController = this.getController('focus');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._columnsResizerController = this.getController('columnsResizer');
    this._errorHandlingController = this.getController('errorHandling');
    this._rowsView = this.getView('rowsView');
    this._headerPanelView = this.getView('headerPanel');
    this._lastOperation = null;
    // this contains the value of 'editing.changes' option, to check if it has changed in onOptionChanged
    this._changes = [];

    if (this._deferreds) {
      this._deferreds.forEach((d) => { d.reject('cancel'); });
    }
    this._deferreds = [];

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

  private _getDefaultEditorTemplate() {
    return (container, options) => {
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

  private _getNewRowPosition() {
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

  public getChanges(): any {
    return this.option(EDITING_CHANGES_OPTION_NAME);
  }

  private getInsertRowCount() {
    const changes: any = this.option(EDITING_CHANGES_OPTION_NAME);
    return changes.filter((change) => change.type === 'insert').length;
  }

  private resetChanges() {
    const changes = this.getChanges();
    const needReset = changes?.length;
    if (needReset) {
      this._silentOption(EDITING_CHANGES_OPTION_NAME, []);
    }
  }

  private _getInternalData(key) {
    return this._internalState.get(getKeyHash(key));
  }

  public _addInternalData(params) {
    const internalData = this._getInternalData(params.key);

    if (internalData) {
      return extend(internalData, params);
    }

    this._internalState.set(getKeyHash(params.key), params);
    return params;
  }

  /**
   * @extended: validating
   */
  public _getOldData(key) {
    return this._getInternalData(key)?.oldData;
  }

  public getUpdatedData(data) {
    const key = this._dataController.keyOf(data);
    const changes = this.getChanges();
    const editIndex = gridCoreUtils.getIndexByKey(key, changes);

    if (changes[editIndex]) {
      return createObjectWithChanges(data, changes[editIndex].data);
    }

    return data;
  }

  public getInsertedData() {
    return this.getChanges()
      .filter((change) => change.data && change.type === DATA_EDIT_DATA_INSERT_TYPE)
      .map((change) => change.data);
  }

  public getRemovedData() {
    return this.getChanges()
      .filter((change) => this._getOldData(change.key) && change.type === DATA_EDIT_DATA_REMOVE_TYPE)
      .map((change) => this._getOldData(change.key));
  }

  private _fireDataErrorOccurred(arg) {
    if (arg === 'cancel') return;
    const $popupContent = this.getPopupContent();
    this._dataController.dataErrorOccurred.fire(arg, $popupContent);
  }

  /**
   * @extended: TreeList's editing
   */
  protected _needToCloseEditableCell($targetElement): any {}

  /**
   * @extended: adaptivity
   */
  protected _closeEditItem($targetElement): any {}

  /**
   * @extended: validating
   */
  protected _handleDataChanged(args): any {}

  protected _isDefaultButtonVisible(button, options) {
    let result = true;

    // eslint-disable-next-line default-case
    switch (button.name) {
      case 'delete':
        result = this.allowDeleting(options);
        break;
      case 'undelete':
        result = false;
    }

    return result;
  }

  protected isPopupEditMode() {
    const editMode = this.option('editing.mode');
    return editMode === EDIT_MODE_POPUP;
  }

  private _isButtonVisible(button, options) {
    const { visible } = button;

    if (!isDefined(visible)) {
      return this._isDefaultButtonVisible(button, options);
    }

    return isFunction(visible) ? visible.call(button, { component: options.component, row: options.row, column: options.column }) : visible;
  }

  private _isButtonDisabled(button, options) {
    const { disabled } = button;

    return isFunction(disabled) ? disabled.call(button, { component: options.component, row: options.row, column: options.column }) : !!disabled;
  }

  protected _getButtonConfig(button, options) {
    const config = isObject(button) ? button : {};
    const buttonName = getButtonName(button);
    const editingTexts = getEditingTexts(options);
    const methodName = METHOD_NAMES[buttonName];
    const editingOptions: any = this.option('editing');
    const actionName = ACTION_OPTION_NAMES[buttonName];
    const allowAction = actionName ? editingOptions[actionName] : true;

    return extend({
      name: buttonName,
      text: editingTexts[buttonName],
      cssClass: EDIT_LINK_CLASS[buttonName],
    }, {
      onClick: methodName && ((e) => {
        const { event } = e;

        event.stopPropagation();
        event.preventDefault();
        setTimeout(() => {
          options.row && allowAction && this[methodName] && this[methodName](options.row.rowIndex);
        });
      }),
    }, config);
  }

  /**
   * @extended: TreeList's editing
   */
  protected _getEditingButtons(options) {
    let buttonIndex;
    const haveCustomButtons = !!options.column.buttons;
    let buttons = (options.column.buttons || []).slice();

    if (haveCustomButtons) {
      buttonIndex = getButtonIndex(buttons, 'edit');

      if (buttonIndex >= 0) {
        if (getButtonIndex(buttons, 'save') < 0) {
          buttons.splice(buttonIndex + 1, 0, 'save');
        }

        if (getButtonIndex(buttons, 'cancel') < 0) {
          buttons.splice(getButtonIndex(buttons, 'save') + 1, 0, 'cancel');
        }
      }

      buttonIndex = getButtonIndex(buttons, 'delete');

      if (buttonIndex >= 0 && getButtonIndex(buttons, 'undelete') < 0) {
        buttons.splice(buttonIndex + 1, 0, 'undelete');
      }
    } else {
      buttons = BUTTON_NAMES.slice();
    }

    return buttons.map((button) => this._getButtonConfig(button, options));
  }

  private _renderEditingButtons($container, buttons, options, change?) {
    buttons.forEach((button) => {
      if (this._isButtonVisible(button, options)) {
        this._createButton($container, button, options, change);
      }
    });
  }

  private _getEditCommandCellTemplate() {
    return (container, options, change) => {
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

  public isRowBasedEditMode() {
    const editMode = this.getEditMode();
    return ROW_BASED_MODES.includes(editMode);
  }

  protected getFirstEditableColumnIndex() {
    let columnIndex;

    const visibleColumns = this._columnsController.getVisibleColumns();
    // @ts-expect-error
    each(visibleColumns, (index, column) => {
      if (column.allowEditing) {
        columnIndex = index;
        return false;
      }
    });

    return columnIndex;
  }

  private getFirstEditableCellInRow(rowIndex): dxElementWrapper | undefined {
    const columnIndex = this.getFirstEditableColumnIndex();

    return this._rowsView?._getCellElement(rowIndex || 0, columnIndex);
  }

  /**
   * @extedned: keyboard_navigation
   * @param rowIndex
   * @protected
   */
  protected getFocusedCellInRow(rowIndex) {
    return this.getFirstEditableCellInRow(rowIndex);
  }

  /**
   * @extended: validating
   */
  public getIndexByKey(key, items) {
    return gridCoreUtils.getIndexByKey(key, items);
  }

  public hasChanges(rowIndex?): boolean {
    const changes = this.getChanges();
    let result = false;

    for (let i = 0; i < changes?.length; i++) {
      if (changes[i].type && (!isDefined(rowIndex) || this._dataController.getRowIndexByKey(changes[i].key) === rowIndex)) {
        result = true;
        break;
      }
    }

    return result;
  }

  public dispose() {
    super.dispose();
    clearTimeout(this._inputFocusTimeoutID);
    eventsEngine.off(domAdapter.getDocument(), pointerEvents.up, (this as any)._pointerUpEditorHandler);
    eventsEngine.off(domAdapter.getDocument(), pointerEvents.down, (this as any)._pointerDownEditorHandler);
    eventsEngine.off(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
  }

  protected _silentOption(name, value) {
    if (name === 'editing.changes') {
      this._changes = deepExtendArraySafe([], value);
    }

    // @ts-expect-error
    super._silentOption(name, value);
  }

  public optionChanged(args) {
    if (args.name === 'editing') {
      const { fullName } = args;

      if (fullName === EDITING_EDITROWKEY_OPTION_NAME) {
        this._handleEditRowKeyChange(args);
      } else if (fullName === EDITING_CHANGES_OPTION_NAME) {
        // to prevent render on optionChanged called by two-way binding - T1128881
        const isEqual = equalByValue(args.value, this._changes, { maxDepth: 4 });

        if (!isEqual) {
          this._changes = deepExtendArraySafe([], args.value);
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

  protected _handleEditRowKeyChange(args) {
    const rowIndex = this._dataController.getRowIndexByKey(args.value);
    const oldRowIndexCorrection = this._getEditRowIndexCorrection();
    const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;

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
  protected _handleChangesChange(args) {
    const dataController = this._dataController;
    const changes = args.value;

    if (!args.value.length && !args.previousValue.length) {
      return;
    }

    changes.forEach((change) => {
      if (change.type === 'insert') {
        this._addInsertInfo(change);
      } else {
        const items = dataController.getCachedStoreData() || dataController.items()?.map((item) => item.data);
        const rowIndex = gridCoreUtils.getIndexByKey(change.key, items, dataController.key());
        this._addInternalData({ key: change.key, oldData: items[rowIndex] });
      }
    });

    dataController.updateItems({
      repaintChangesOnly: true,
      isLiveUpdate: false,
      isOptionChanged: true,
    });
  }

  public publicMethods() {
    return ['addRow', 'deleteRow', 'undeleteRow', 'editRow', 'saveEditData', 'cancelEditData', 'hasEditData'];
  }

  public refresh() {
    if (!isDefined(this._pageIndex)) {
      return;
    }

    // @ts-expect-error
    this._refreshCore.apply(this, arguments);
  }

  protected _refreshCore(params): any {}

  public isEditing() {
    const isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));

    return isEditRowKeyDefined;
  }

  public isEditRow(rowIndex) {
    return false;
  }

  protected _setEditRowKey(value, silent?) {
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

  private _setEditRowKeyByIndex(rowIndex, silent) {
    const key = this._dataController.getKeyByRowIndex(rowIndex);

    if (key === undefined) {
      this._dataController.fireError('E1043');
      return;
    }

    this._setEditRowKey(key, silent);
  }

  public getEditRowIndex() {
    return this._getVisibleEditRowIndex();
  }

  public getEditFormRowIndex() {
    return -1;
  }

  public isEditRowByIndex(rowIndex) {
    const key = this._dataController.getKeyByRowIndex(rowIndex);
    // Vitik: performance optimization equalByValue take O(1)
    const isKeyEqual = isDefined(key) && equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key);
    if (isKeyEqual) {
      // Vitik: performance optimization _getVisibleEditRowIndex take O(n)
      return this._getVisibleEditRowIndex() === rowIndex;
    }
    return isKeyEqual;
  }

  public isEditCell(visibleRowIndex, columnIndex) {
    return this.isEditRowByIndex(visibleRowIndex) && this._getVisibleEditColumnIndex() === columnIndex;
  }

  protected getPopupContent(): any {}

  /**
   * @extended: TreeList's editing
   */
  protected _isProcessedItem(item) {
    return false;
  }

  private _getInsertRowIndex(items, change, isProcessedItems) {
    let result = -1;
    const dataController = this._dataController;
    const key = this._getInsertAfterOrBeforeKey(change);

    if (!isDefined(key) && items.length === 0) {
      result = 0;
    } else if (isDefined(key)) {
      // @ts-expect-error
      // eslint-disable-next-line array-callback-return
      items.some((item, index) => {
        const isProcessedItem = isProcessedItems || this._isProcessedItem(item);

        if (isObject(item)) {
          if (isProcessedItem || isDefined(item[INSERT_INDEX])) {
            // @ts-expect-error
            if (equalByValue(item.key, key)) {
              result = index;
            }
          } else if (equalByValue(dataController.keyOf(item), key)) {
            result = index;
          }
        }

        if (result >= 0) {
          const nextItem = items[result + 1];

          if (nextItem && (nextItem.rowType === 'detail' || nextItem.rowType === 'detailAdaptive') && isDefined(change.insertAfterKey)) {
            return;
          }

          if (isDefined(change.insertAfterKey)) {
            result += 1;
          }
          return true;
        }
      });
    }

    return result;
  }

  /**
   * @extended: TreeList's editing
   */
  protected _generateNewItem(key) {
    const item = {
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
  protected _getLoadedRowIndex(items, change, isProcessedItems?) {
    let loadedRowIndex = this._getInsertRowIndex(items, change, isProcessedItems);
    const dataController = this._dataController;

    if (loadedRowIndex < 0) {
      const newRowPosition: any = this._getNewRowPosition();
      const pageIndex = dataController.pageIndex();
      const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

      if (newRowPosition !== LAST_NEW_ROW_POSITION && pageIndex === 0 && !isDefined(insertAfterOrBeforeKey)) {
        loadedRowIndex = 0;
      } else if (newRowPosition === LAST_NEW_ROW_POSITION && dataController.isLastPageLoaded()) {
        loadedRowIndex = items.length;
      }
    }

    return loadedRowIndex;
  }

  /**
   * @extended: validatiing
   */
  public processItems(items, e) {
    const { changeType } = e;

    this.update(changeType);

    const changes = this.getChanges();
    changes.forEach((change) => {
      const isInsert = change.type === DATA_EDIT_DATA_INSERT_TYPE;

      if (!isInsert) {
        return;
      }

      let { key } = change;

      let insertInfo = this._getInternalData(key)?.insertInfo;
      if (!isDefined(key) || !isDefined(insertInfo)) {
        insertInfo = this._addInsertInfo(change);
        key = insertInfo.key;
      }

      const loadedRowIndex = this._getLoadedRowIndex(items, change);
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
  public processDataItem(item, options, generateDataValues) {
    const columns = options.visibleColumns;
    const key = item.data[INSERT_INDEX] ? item.data.key : item.key;
    const changes = this.getChanges();

    const editIndex = gridCoreUtils.getIndexByKey(key, changes);
    item.isEditing = false;

    if (editIndex >= 0) {
      this._processDataItemCore(item, changes[editIndex], key, columns, generateDataValues);
    }
  }

  protected _processDataItemCore(item, change, key, columns, generateDataValues) {
    const { data, type } = change;

    // eslint-disable-next-line default-case
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
        item.modifiedValues = generateDataValues(data, columns, true);
        break;
      case DATA_EDIT_DATA_REMOVE_TYPE:
        item.removed = true;
        break;
    }
  }

  /**
   * @extended: TreeList's editing
   */
  protected _initNewRow(options) {
    this.executeAction('onInitNewRow', options);

    if (options.promise) {
      // @ts-expect-error
      const deferred = new Deferred();

      when(fromPromise(options.promise))
        .done(deferred.resolve)
        .fail(createFailureHandler(deferred))
        .fail((arg) => this._fireDataErrorOccurred(arg));

      return deferred;
    }
  }

  private _createInsertInfo() {
    const insertInfo = {};

    insertInfo[INSERT_INDEX] = this._getInsertIndex();

    return insertInfo;
  }

  private _addInsertInfo(change, parentKey?) {
    let insertInfo;
    change.key = this.getChangeKeyValue(change);
    const { key } = change;

    insertInfo = this._getInternalData(key)?.insertInfo;
    if (!isDefined(insertInfo)) {
      const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

      insertInfo = this._createInsertInfo();

      if (!isDefined(insertAfterOrBeforeKey)) {
        this._setInsertAfterOrBeforeKey(change, parentKey);
      }
    }

    this._addInternalData({ insertInfo, key });

    return { insertInfo, key };
  }

  private getChangeKeyValue(change: any): unknown {
    if (isDefined(change.key)) {
      return change.key;
    }

    const keyExpr = this._dataController.key();
    let keyValue;
    if (change.data && keyExpr && !Array.isArray(keyExpr)) {
      keyValue = change.data[keyExpr];
    }
    if (!isDefined(keyValue)) {
      keyValue = generateNewRowTempKey();
    }

    return keyValue;
  }

  /**
   * @extended: TreeList's editing
   */
  protected _setInsertAfterOrBeforeKey(change, parentKey) {
    // TODO getView
    const rowsView = this.getView('rowsView');
    const dataController = this._dataController;
    const allItems = dataController.items(true);
    const newRowPosition: any = this._getNewRowPosition();

    switch (newRowPosition) {
      case FIRST_NEW_ROW_POSITION:
      case LAST_NEW_ROW_POSITION:
        break;
      case PAGE_TOP_NEW_ROW_POSITION:
      case PAGE_BOTTOM_NEW_ROW_POSITION:
        if (allItems.length) {
          const itemIndex = newRowPosition === PAGE_TOP_NEW_ROW_POSITION ? 0 : allItems.length - 1;

          change[itemIndex === 0 ? 'insertBeforeKey' : 'insertAfterKey'] = allItems[itemIndex].key;
        }
        break;
      default: {
        const isViewportBottom = newRowPosition === VIEWPORT_BOTTOM_NEW_ROW_POSITION;
        let visibleItemIndex = isViewportBottom
          // @ts-expect-error
          ? rowsView?.getBottomVisibleItemIndex()
          : rowsView?.getTopVisibleItemIndex();
        const row: any = dataController.getVisibleRows()[visibleItemIndex];

        if (row && (!row.isEditing && row.rowType === 'detail' || row.rowType === 'detailAdaptive')) {
          visibleItemIndex++;
        }

        const insertKey = dataController.getKeyByRowIndex(visibleItemIndex);

        if (isDefined(insertKey)) {
          change.insertBeforeKey = insertKey;
        }
      }
    }
  }

  private _getInsertIndex() {
    let maxInsertIndex = 0;
    this.getChanges().forEach((editItem) => {
      const insertInfo = this._getInternalData(editItem.key)?.insertInfo;

      if (isDefined(insertInfo) && editItem.type === DATA_EDIT_DATA_INSERT_TYPE && insertInfo[INSERT_INDEX] > maxInsertIndex) {
        maxInsertIndex = insertInfo[INSERT_INDEX];
      }
    });
    return maxInsertIndex + 1;
  }

  private _getInsertAfterOrBeforeKey(insertChange) {
    return insertChange.insertAfterKey ?? insertChange.insertBeforeKey;
  }

  private _getPageIndexToInsertRow() {
    const newRowPosition: any = this._getNewRowPosition();
    const dataController = this._dataController;
    const pageIndex = dataController.pageIndex();
    const lastPageIndex = dataController.pageCount() - 1;

    if (newRowPosition === FIRST_NEW_ROW_POSITION && pageIndex !== 0) {
      return 0;
    } if (newRowPosition === LAST_NEW_ROW_POSITION && pageIndex !== lastPageIndex) {
      return lastPageIndex;
    }

    return -1;
  }

  /**
   * @extended: keyboard_navigation
   */
  protected addRow(parentKey) {
    const dataController = this._dataController;
    const store = dataController.store();

    if (!store) {
      dataController.fireError('E1052', this.component.NAME);
      // @ts-expect-error
      return new Deferred().reject();
    }

    return this._addRow(parentKey);
  }

  protected _addRow(parentKey) {
    const dataController = this._dataController;
    const store = dataController.store();
    const key = store && store.key();
    const param: any = { data: {} };
    const oldEditRowIndex = this._getVisibleEditRowIndex();
    // @ts-expect-error
    const deferred = new Deferred();

    // @ts-expect-error
    this.refresh({ allowCancelEditing: true });

    if (!this._allowRowAdding()) {
      when(this._navigateToNewRow(oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
      return deferred.promise();
    }

    if (!key) {
      param.data.__KEY__ = String(new Guid());
    }

    // @ts-expect-error
    when(this._initNewRow(param, parentKey)).done(() => {
      if (this._allowRowAdding()) {
        when(this._addRowCore(param.data, parentKey, oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
      } else {
        deferred.reject('cancel');
      }
    }).fail(deferred.reject);

    return deferred.promise();
  }

  protected _allowRowAdding(params?) {
    const insertIndex = this._getInsertIndex();

    if (insertIndex > 1) {
      return false;
    }

    return true;
  }

  /**
   * @exteded: TreeList's editing
   */
  protected _addRowCore(data, parentKey, initialOldEditRowIndex) {
    const change = { data, type: DATA_EDIT_DATA_INSERT_TYPE };
    const editRowIndex = this._getVisibleEditRowIndex();
    const insertInfo = this._addInsertInfo(change, parentKey);
    const { key } = insertInfo;

    this._setEditRowKey(key, true);
    this._addChange(change);

    return this._navigateToNewRow(initialOldEditRowIndex, change, editRowIndex);
  }

  private _navigateToNewRow(oldEditRowIndex, change?, editRowIndex?) {
    // @ts-expect-error
    const d = new Deferred();
    const dataController = this._dataController;
    editRowIndex = editRowIndex ?? -1;
    change = change ?? this.getChanges().filter((c) => c.type === DATA_EDIT_DATA_INSERT_TYPE)[0];

    if (!change) {
      return d.reject('cancel').promise();
    }

    const pageIndexToInsertRow = this._getPageIndexToInsertRow();
    let rowIndex = this._getLoadedRowIndex(dataController.items(), change, true);
    const navigateToRowByKey = (key) => {
      when(this._focusController?.navigateToRow(key)).done(() => {
        rowIndex = dataController.getRowIndexByKey(change.key);
        d.resolve();
      });
    };
    const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

    if (pageIndexToInsertRow >= 0) {
      dataController.pageIndex(pageIndexToInsertRow).done(() => {
        navigateToRowByKey(change.key);
      }).fail(d.reject);
    } else if (rowIndex < 0 && isDefined(insertAfterOrBeforeKey)) {
      navigateToRowByKey(insertAfterOrBeforeKey);
    } else {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, editRowIndex, rowIndex],
      });

      rowIndex = dataController.getRowIndexByKey(change.key);

      if (rowIndex < 0) {
        navigateToRowByKey(change.key);
      } else {
        d.resolve();
      }
    }

    d.done(() => {
      this._rowsView?.waitAsyncTemplates(true).done(() => {
        this._showAddedRow(rowIndex);
        this._afterInsertRow(change.key);
      });
    });

    return d.promise();
  }

  protected _showAddedRow(rowIndex) {
    this._focusFirstEditableCellInRow(rowIndex);
  }

  protected _beforeFocusElementInRow(rowIndex): any {}

  private _focusFirstEditableCellInRow(rowIndex) {
    const dataController = this._dataController;
    const key = dataController.getKeyByRowIndex(rowIndex);
    const $firstCell = this.getFirstEditableCellInRow(rowIndex);

    this._keyboardNavigationController?.focus($firstCell);
    this.option('focusedRowKey', key);

    this._editCellInProgress = true;
    this._delayedInputFocus($firstCell, () => {
      rowIndex = dataController.getRowIndexByKey(key);
      this._editCellInProgress = false;
      this._beforeFocusElementInRow(rowIndex);
    });
  }

  /**
   * @extended: keyboard_navigation
   */
  protected _isEditingStart(options) {
    this.executeAction('onEditingStart', options);

    return options.cancel;
  }

  /**
   * @extended: adaptivity
   */
  protected _beforeUpdateItems(rowIndices, rowIndex): any {}

  protected _getVisibleEditColumnIndex() {
    const editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);

    if (!isDefined(editColumnName)) {
      return -1;
    }

    return this._columnsController.getVisibleColumnIndex(editColumnName);
  }

  protected _setEditColumnNameByIndex(index, silent?) {
    const visibleColumns = this._columnsController.getVisibleColumns();
    this._setEditColumnName(visibleColumns[index]?.name, silent);
  }

  private _setEditColumnName(name, silent) {
    if (silent) {
      this._silentOption(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
    } else {
      this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
    }
  }

  protected _resetEditColumnName() {
    this._setEditColumnName(null, true);
  }

  protected _getEditColumn() {
    const editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);

    return this._getColumnByName(editColumnName);
  }

  private _getColumnByName(name) {
    const visibleColumns = this._columnsController.getVisibleColumns();
    let editColumn;

    // @ts-expect-error
    // eslint-disable-next-line array-callback-return
    isDefined(name) && visibleColumns.some((column) => {
      if (column.name === name) {
        editColumn = column;
        return true;
      }
    });

    return editColumn;
  }

  protected _getVisibleEditRowIndex(columnName?) {
    const dataController = this._dataController;
    const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
    const rowIndex = dataController.getRowIndexByKey(editRowKey);

    if (rowIndex === -1) {
      return rowIndex;
    }

    return rowIndex + this._getEditRowIndexCorrection(columnName);
  }

  protected _getEditRowIndexCorrection(columnName?) {
    const editColumn = columnName ? this._getColumnByName(columnName) : this._getEditColumn();
    const isColumnHidden = editColumn?.visibleWidth === 'adaptiveHidden';

    return isColumnHidden ? 1 : 0;
  }

  protected _resetEditRowKey() {
    this._refocusEditCell = false;
    this._setEditRowKey(null, true);
  }

  protected _resetEditIndices() {
    this._resetEditColumnName();
    this._resetEditRowKey();
  }

  /**
   * @extended: adaptivity, keyboard_navigation
   */
  // @ts-expect-error
  public editRow(rowIndex) {
    const dataController = this._dataController;
    const items = dataController.items();
    const item: any = items[rowIndex];
    const params: any = { data: item && item.data, cancel: false };
    const oldRowIndex = this._getVisibleEditRowIndex();

    if (!item) {
      return;
    }

    if (rowIndex === oldRowIndex) {
      return true;
    }

    if (item.key === undefined) {
      this._dataController.fireError('E1043');
      return;
    }

    if (!item.isNewRow) {
      params.key = item.key;
    }

    if (this._isEditingStart(params)) {
      return;
    }

    this.resetChanges();
    this.init();
    this._resetEditColumnName();
    this._pageIndex = dataController.pageIndex();
    this._addInternalData({
      key: item.key,
      oldData: item.oldData ?? item.data,
    });
    this._setEditRowKey(item.key);
  }

  private _editRowFromOptionChanged(rowIndex, oldRowIndex) {
    const rowIndices = [oldRowIndex, rowIndex];

    // @ts-expect-error
    this._beforeUpdateItems(rowIndices, rowIndex, oldRowIndex);
    this._editRowFromOptionChangedCore(rowIndices, rowIndex);
  }

  protected _editRowFromOptionChangedCore(rowIndices, rowIndex, preventRendering?) {
    this._needFocusEditor = true;
    this._dataController.updateItems({
      changeType: 'update',
      rowIndices,
      cancel: preventRendering,
    });
  }

  public _focusEditorIfNeed(): any {}

  protected _showEditPopup(rowIndex, repaintForm?): any {}

  protected _repaintEditPopup(): any {}

  protected _getEditPopupHiddenHandler() {
    return (e) => {
      if (this.isEditing()) {
        this.cancelEditData();
      }
    };
  }

  protected _getPopupEditFormTemplate(rowIndex): any {}

  protected _getSaveButtonConfig() {
    const buttonConfig: any = {
      text: this.option('editing.texts.saveRowChanges'),
      onClick: this.saveEditData.bind(this),
    };

    if (isFluent(current())) {
      buttonConfig.stylingMode = 'contained';
      buttonConfig.type = 'default';
    }

    return buttonConfig;
  }

  protected _getCancelButtonConfig() {
    const buttonConfig: any = {
      text: this.option('editing.texts.cancelRowChanges'),
      onClick: this.cancelEditData.bind(this),
    };

    if (isFluent(current())) {
      buttonConfig.stylingMode = 'outlined';
    }

    return buttonConfig;
  }

  private _removeInternalData(key) {
    this._internalState.delete(getKeyHash(key));
  }

  private _updateInsertAfterOrBeforeKeys(changes, index) {
    const removeChange = changes[index];

    changes.forEach((change) => {
      if (change.type === DATA_EDIT_DATA_INSERT_TYPE) {
        const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

        if (equalByValue(insertAfterOrBeforeKey, removeChange.key)) {
          change[isDefined(change.insertAfterKey) ? 'insertAfterKey' : 'insertBeforeKey'] = this._getInsertAfterOrBeforeKey(removeChange);
        }
      }
    });
  }

  /**
   * @extended: DataGrid's summary
   */
  protected _removeChange(index) {
    if (index >= 0) {
      const changes = [...this.getChanges()];
      const { key } = changes[index];

      this._removeInternalData(key);

      this._updateInsertAfterOrBeforeKeys(changes, index);
      changes.splice(index, 1);
      this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
      if (equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key)) {
        this._resetEditIndices();
      }
    }
  }

  protected executeOperation(deferred, func) {
    this._lastOperation && this._lastOperation.reject();
    this._lastOperation = deferred;

    this.waitForDeferredOperations().done(() => {
      if (deferred.state() === 'rejected') {
        return;
      }
      func();
      this._lastOperation = null;
    }).fail(() => {
      deferred.reject();
      this._lastOperation = null;
    });
  }

  public waitForDeferredOperations() {
    return when(...this._deferreds);
  }

  /**
   * @extended: keyboard_navigation
   * @protected
   */
  protected _processCanceledEditingCell(): any {}

  protected _repaintEditCell(column, oldColumn, oldEditRowIndex) {
    if (!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
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
  protected _delayedInputFocus($cell, beforeFocusCallback, callBeforeFocusCallbackAlways?) {
    const inputFocus = () => {
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
      if (this._beforeFocusCallback) this._beforeFocusCallback();

      clearTimeout(this._inputFocusTimeoutID);

      if (callBeforeFocusCallbackAlways) {
        this._beforeFocusCallback = beforeFocusCallback;
      }

      this._inputFocusTimeoutID = setTimeout(inputFocus);
    }
  }

  public _focusEditingCell(beforeFocusCallback?, $editCell?, callBeforeFocusCallbackAlways?) {
    const editColumnIndex = this._getVisibleEditColumnIndex();

    $editCell = $editCell || this._rowsView && this._rowsView._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex);

    if ($editCell) {
      this._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
    }
  }

  /**
   * @extended: adaptivity
   */
  protected deleteRow(rowIndex) {
    this._checkAndDeleteRow(rowIndex);
  }

  protected _checkAndDeleteRow(rowIndex) {
    const editingOptions = this.option('editing');
    const editingTexts = editingOptions?.texts;
    const confirmDelete = editingOptions?.confirmDelete;
    const confirmDeleteMessage = editingTexts?.confirmDeleteMessage;
    const item: any = this._dataController.items()[rowIndex];
    const allowDeleting = !this.isEditing() || item.isNewRow; // T741746

    if (item && allowDeleting) {
      if (!confirmDelete || !confirmDeleteMessage) {
        this._deleteRowCore(rowIndex);
      } else {
        const confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle;
        const showDialogTitle = isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
        // @ts-expect-error
        confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done((confirmResult) => {
          if (confirmResult) {
            this._deleteRowCore(rowIndex);
          }
        });
      }
    }
  }

  /**
   * @extended: focus
   */
  protected _deleteRowCore(rowIndex) {
    const dataController = this._dataController;
    const item = dataController.items()[rowIndex];
    const key = item && item.key;
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

  protected _afterDeleteRow(rowIndex, oldEditRowIndex) {
    return this.saveEditData();
  }

  private undeleteRow(rowIndex) {
    const dataController = this._dataController;
    const item = dataController.items()[rowIndex];
    const oldEditRowIndex = this._getVisibleEditRowIndex();
    const key = item && item.key;
    const changes = this.getChanges();

    if (item) {
      const editIndex = gridCoreUtils.getIndexByKey(key, changes);

      if (editIndex >= 0) {
        const { data } = changes[editIndex];

        if (isEmptyObject(data)) {
          this._removeChange(editIndex);
        } else {
          this._addChange({ key, type: DATA_EDIT_DATA_UPDATE_TYPE });
        }

        dataController.updateItems({
          changeType: 'update',
          rowIndices: [oldEditRowIndex, rowIndex],
        });
      }
    }
  }

  private _fireOnSaving() {
    const onSavingParams: any = {
      cancel: false,
      promise: null,
      changes: [...this.getChanges()],
    };
    this.executeAction('onSaving', onSavingParams);
    // @ts-expect-error
    const d = new Deferred();
    when(fromPromise(onSavingParams.promise))
      .done(() => {
        d.resolve(onSavingParams);
      }).fail((arg) => {
        createFailureHandler(d);
        this._fireDataErrorOccurred(arg);
        d.resolve({ cancel: true });
      });

    return d;
  }

  private _executeEditingAction(actionName, params, func) {
    if (this.component._disposed) {
      return null;
    }

    // @ts-expect-error
    const deferred = new Deferred();

    this.executeAction(actionName, params);

    when(fromPromise(params.cancel)).done((cancel) => {
      if (cancel) {
        setTimeout(() => {
          deferred.resolve('cancel');
        });
      } else {
        func(params).done(deferred.resolve).fail(createFailureHandler(deferred));
      }
    }).fail(createFailureHandler(deferred));

    return deferred;
  }

  private _processChanges(deferreds, results, dataChanges, changes) {
    const store = this._dataController.store();

    each(changes, (index, change) => {
      const oldData = this._getOldData(change.key);
      const { data, type } = change;
      const changeCopy = { ...change };
      let deferred;
      let params;

      // @ts-expect-error
      if (this._beforeSaveEditData(change, index)) {
        return;
      }

      // eslint-disable-next-line default-case
      switch (type) {
        case DATA_EDIT_DATA_REMOVE_TYPE:
          params = { data: oldData, key: change.key, cancel: false };
          deferred = this._executeEditingAction('onRowRemoving', params, () => store.remove(change.key).done((key) => {
            dataChanges.push({ type: 'remove', key });
          }));
          break;
        case DATA_EDIT_DATA_INSERT_TYPE:
          params = { data, cancel: false };
          deferred = this._executeEditingAction('onRowInserting', params, () => store.insert(params.data).done((data, key) => {
            if (isDefined(key)) {
              changeCopy.key = key;
            }
            if (data && isObject(data) && data !== params.data) {
              changeCopy.data = data;
            }
            dataChanges.push({ type: 'insert', data, index: 0 });
          }));
          break;
        case DATA_EDIT_DATA_UPDATE_TYPE:
          params = {
            newData: data, oldData, key: change.key, cancel: false,
          };
          deferred = this._executeEditingAction('onRowUpdating', params, () => store.update(change.key, params.newData).done((data, key) => {
            if (data && isObject(data) && data !== params.newData) {
              changeCopy.data = data;
            }
            dataChanges.push({ type: 'update', key, data });
          }));
          break;
      }

      changes[index] = changeCopy;

      if (deferred) {
        // @ts-expect-error
        const doneDeferred = new Deferred();
        deferred
          .always((data) => {
            results.push({ key: change.key, result: data });
          })
          .always(doneDeferred.resolve);

        deferreds.push(doneDeferred.promise());
      }
    });
  }

  public _processRemoveIfError(changes, editIndex): any {
    const change = changes[editIndex];

    if (change?.type === DATA_EDIT_DATA_REMOVE_TYPE) {
      if (editIndex >= 0) {
        changes.splice(editIndex, 1);
      }
    }

    return true;
  }

  private _processRemove(changes, editIndex, cancel) {
    const change = changes[editIndex];

    if (!cancel || !change || change.type === DATA_EDIT_DATA_REMOVE_TYPE) {
      return this._processRemoveCore(changes, editIndex, !cancel || !change);
    }
  }

  protected _processRemoveCore(changes, editIndex, processIfBatch?): any {
    if (editIndex >= 0) {
      changes.splice(editIndex, 1);
    }

    return true;
  }

  private _processSaveEditDataResult(results) {
    let hasSavedData = false;
    const originalChanges = this.getChanges();
    const changes = [...originalChanges];
    const changesLength = changes.length;

    for (let i = 0; i < results.length; i++) {
      const arg = results[i].result;
      const cancel = arg === 'cancel';
      const editIndex = gridCoreUtils.getIndexByKey(results[i].key, changes);
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
        const removedChangeIndex = gridCoreUtils.getIndexByKey(results[i].key, originalChanges);

        this._updateInsertAfterOrBeforeKeys(originalChanges, removedChangeIndex);
      }
    }

    if (changes.length < changesLength) {
      this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
    }

    return hasSavedData;
  }

  private _fireSaveEditDataEvents(changes) {
    each(changes, (_, { data, key, type }) => {
      const internalData = this._addInternalData({ key });
      const params: any = { key, data };

      if (internalData.error) {
        params.error = internalData.error;
      }

      // eslint-disable-next-line default-case
      switch (type) {
        case DATA_EDIT_DATA_REMOVE_TYPE:
          this.executeAction('onRowRemoved', extend({}, params, { data: internalData.oldData }));
          break;
        case DATA_EDIT_DATA_INSERT_TYPE:
          this.executeAction('onRowInserted', params);
          break;
        case DATA_EDIT_DATA_UPDATE_TYPE:
          this.executeAction('onRowUpdated', params);
          break;
      }
    });

    this.executeAction('onSaved', { changes });
  }

  public saveEditData() {
    // @ts-expect-error
    const deferred = new Deferred();
    this.waitForDeferredOperations().done(() => {
      if (this.isSaving()) {
        this._resolveAfterSave(deferred);
        return;
      }
      when(this._beforeSaveEditData()).done((cancel) => {
        if (cancel) {
          // @ts-expect-error
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
          .done(deferred.resolve)
          .fail(deferred.reject);
      }).fail(deferred.reject);
    }).fail(deferred.reject);
    return deferred.promise();
  }

  private _resolveAfterSave(deferred, { cancel = undefined, error = undefined } = {}) {
    // @ts-expect-error
    when(this._afterSaveEditData(cancel)).done(() => {
      deferred.resolve(error);
    }).fail(deferred.reject);
  }

  protected _saveEditDataInner() {
    // @ts-expect-error
    const result = new Deferred();
    const results = [];
    const deferreds = [];
    const dataChanges = [];
    const dataSource = this._dataController.dataSource();

    when(this._fireOnSaving())
      .done(({ cancel, changes }) => {
        if (cancel) {
          return result.resolve().promise();
        }

        this._processChanges(deferreds, results, dataChanges, changes);

        if (deferreds.length) {
          this._refocusEditCell = true;
          dataSource?.beginLoading();

          when(...deferreds).done(() => {
            if (this._processSaveEditDataResult(results)) {
              this._endSaving(dataChanges, changes, result);
            } else {
              dataSource?.endLoading();
              result.resolve();
            }
          }).fail((error) => {
            dataSource?.endLoading();
            result.resolve(error);
          });

          return result
            .always(() => { this._refocusEditCell = true; })
            .promise();
        }

        this._cancelSaving(result);
      })
      .fail(result.reject);

    return result.promise();
  }

  protected _beforeEndSaving(changes) {
    this._resetEditIndices();
  }

  private _endSaving(dataChanges, changes, deferred) {
    const dataSource = this._dataController.dataSource();

    this._beforeEndSaving(changes);

    dataSource?.endLoading();

    this._refreshDataAfterSave(dataChanges, changes, deferred);
  }

  protected _cancelSaving(result) {
    this.executeAction('onSaved', { changes: [] });
    this._resolveAfterSave(result);
  }

  private _refreshDataAfterSave(dataChanges, changes, deferred) {
    const dataController = this._dataController;
    const refreshMode = this.option('editing.refreshMode');
    const isFullRefresh = refreshMode !== 'reshape' && refreshMode !== 'repaint';

    if (!isFullRefresh) {
      dataController.push(dataChanges);
    }

    when(dataController.refresh({
      selection: isFullRefresh,
      reload: isFullRefresh,
      load: refreshMode === 'reshape',
      changesOnly: this.option('repaintChangesOnly'),
    })).always(() => {
      this._fireSaveEditDataEvents(changes);
    }).done(() => {
      this._resolveAfterSave(deferred);
    }).fail((error) => {
      this._resolveAfterSave(deferred, { error });
    });
  }

  public isSaving() {
    return this._saving;
  }

  private _updateEditColumn() {
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

  protected _isEditColumnVisible() {
    const editingOptions: any = this.option('editing');

    return editingOptions.allowDeleting;
  }

  private _isEditButtonDisabled() {
    const hasChanges = this.hasChanges();
    const isEditRowDefined = isDefined(this.option('editing.editRowKey'));

    return !(isEditRowDefined || hasChanges);
  }

  /**
   * @extended: DataGrid's export
   */
  protected _updateEditButtons() {
    const isButtonDisabled = this._isEditButtonDisabled();

    if (this._headerPanelView) {
      this._headerPanelView.setToolbarItemDisabled('saveButton', isButtonDisabled);
      this._headerPanelView.setToolbarItemDisabled('revertButton', isButtonDisabled);
    }
  }

  protected _applyModified($element, options) {
    $element && $element.addClass(CELL_MODIFIED);
  }

  /**
   * @extended: adaptivity
   */
  protected _beforeCloseEditCellInBatchMode(rowIndices): any {}

  /**
   * @extended: DataGird's summary
   */
  public cancelEditData() {
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

  protected _cancelEditDataCore() {
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
  protected _afterCancelEditData(rowIndex) {
    const dataController = this._dataController;

    dataController.updateItems({
      repaintChangesOnly: this.option('repaintChangesOnly'),
    });
  }

  protected _hideEditPopup(): any {}

  protected hasEditData() {
    return this.hasChanges();
  }

  private update(changeType) {
    const dataController = this._dataController;

    if (dataController && this._pageIndex !== dataController.pageIndex()) {
      if (changeType === 'refresh') {
        // @ts-expect-error
        this.refresh({ isPageChanged: true });
      }
      this._pageIndex = dataController.pageIndex();
    }
    this._updateEditButtons();
  }

  /**
   * @extended: adaptivity
   */
  protected _getRowIndicesForCascadeUpdating(row, skipCurrentRow) {
    return skipCurrentRow ? [] : [row.rowIndex];
  }

  /**
   * Adds a deferred object to be awaited before other operations are executed
   */
  public addDeferred(deferred: DeferredObj<any>): void {
    if (!this._deferreds.includes(deferred)) {
      this._deferreds.push(deferred);
      deferred.always(() => {
        const index = this._deferreds.indexOf(deferred);
        if (index >= 0) {
          this._deferreds.splice(index, 1);
        }
      });
    }
  }

  protected _prepareChange(options, value, text) {
    const newData = {};
    const oldData = options.row?.data;
    const rowKey = options.key;
    // @ts-expect-error
    const deferred = new Deferred();

    if (rowKey !== undefined) {
      options.value = value;

      const setCellValueResult = fromPromise(options.column.setCellValue(newData, value, extend(true, {}, oldData), text));
      setCellValueResult.done(() => {
        deferred.resolve({
          data: newData,
          key: rowKey,
          oldData,
          type: DATA_EDIT_DATA_UPDATE_TYPE,
        });
      }).fail(createFailureHandler(deferred)).fail((arg) => this._fireDataErrorOccurred(arg));

      if (isDefined(text) && options.column.displayValueMap) {
        options.column.displayValueMap[value] = text;
      }

      this._updateRowValues(options);

      this.addDeferred(deferred);
    }

    return deferred;
  }

  private _updateRowValues(options) {
    if (options.values) {
      const dataController = this._dataController;
      const rowIndex = dataController.getRowIndexByKey(options.key);
      const row = dataController.getVisibleRows()[rowIndex];

      if (row) {
        options.row.values = row.values; // T1122209
        options.values = row.values;
      }

      options.values[options.columnIndex] = options.value;
    }
  }

  /**
   * @extended: filter_row, validating
   */
  public updateFieldValue(options, value, text, forceUpdateRow?) {
    const rowKey = options.key;
    // @ts-expect-error
    const deferred = new Deferred();

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

    return deferred.promise();
  }

  // @ts-expect-error
  private _focusPreviousEditingCellIfNeed(options) {
    if (this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex)) {
      this._focusEditingCell();
      this._updateEditRow(options.row, true);
      return true;
    }
  }

  protected _needUpdateRow(column?) {
    const visibleColumns = this._columnsController.getVisibleColumns();

    if (!column) {
      column = this._getEditColumn();
    }

    const isCustomSetCellValue = column && column.setCellValue !== column.defaultSetCellValue;
    const isCustomCalculateCellValue = visibleColumns.some((visibleColumn) => visibleColumn.calculateCellValue !== visibleColumn.defaultCalculateCellValue);

    return isCustomSetCellValue || isCustomCalculateCellValue;
  }

  protected _applyChange(options, params, forceUpdateRow) {
    const changeOptions = { ...options, forceUpdateRow };

    this._addChange(params, changeOptions);
    this._updateEditButtons();

    return this._applyChangeCore(options, changeOptions.forceUpdateRow);
  }

  protected _applyChangeCore(options, forceUpdateRow) {
    const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;

    const { row } = options;
    if (row) {
      if (forceUpdateRow || isCustomSetCellValue) {
        this._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
      } else if (row.update) {
        row.update();
      }
    }
  }

  protected _updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue) {
    this._dataController.updateItems({
      changeType: 'update',
      rowIndices: this._getRowIndicesForCascadeUpdating(row, skipCurrentRow),
    });
  }

  protected _updateEditRow(row, forceUpdateRow, isCustomSetCellValue?) {
    if (forceUpdateRow) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      this._updateRowWithDelay(row, isCustomSetCellValue);
    }
  }

  protected _updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue) {
    this._updateEditRowCore(row, !forceUpdateRow, isCustomSetCellValue);
    // @ts-expect-error
    this._validateEditFormAfterUpdate(row, isCustomSetCellValue);
    if (!forceUpdateRow) {
      this._focusEditingCell();
    }
  }

  private _updateRowWithDelay(row, isCustomSetCellValue) {
    // @ts-expect-error
    const deferred = new Deferred();
    this.addDeferred(deferred);
    setTimeout(() => {
      // NOTE: if the editForm is enabled then we need to search for focused element in the document root
      // otherwise we need to search for element in the shadow dom
      // @ts-expect-error
      const elementContainer = this._editForm?.element() || this.component.$element().get(0);
      const $focusedElement = $(domAdapter.getActiveElement(elementContainer));
      const columnIndex = this._rowsView.getCellIndex($focusedElement, row.rowIndex);
      let focusedElement = $focusedElement.get(0);
      const selectionRange = gridCoreUtils.getSelectionRange(focusedElement);

      this._updateEditRowCore(row, false, isCustomSetCellValue);
      // @ts-expect-error
      this._validateEditFormAfterUpdate(row, isCustomSetCellValue);

      if (columnIndex >= 0) {
        const $focusedItem = this._rowsView._getCellElement(row.rowIndex, columnIndex);
        this._delayedInputFocus($focusedItem, () => {
          setTimeout(() => {
            // @ts-expect-error
            focusedElement = domAdapter.getActiveElement(this.component.$element()?.get(0));
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
  protected _validateEditFormAfterUpdate(): any {}

  /**
   * @extended: validating
   */
  protected _addChange(changeParams, options?) {
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
  protected _getFormEditItemTemplate(cellOptions, column) {
    return column.editCellTemplate || this._getDefaultEditorTemplate();
  }

  public getColumnTemplate(options) {
    const { column } = options;
    const rowIndex = options.row && options.row.rowIndex;
    let template;
    const isRowMode = this.isRowBasedEditMode();
    const isRowEditing = this.isEditRow(rowIndex);
    const isCellEditing = this.isEditCell(rowIndex, options.columnIndex);
    let editingStartOptions;

    if ((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing))
              && (options.rowType === 'data' || options.rowType === 'detailAdaptive') && !column.command) {
      const allowUpdating = this.allowUpdating(options);
      if (((allowUpdating || isRowEditing) && column.allowEditing || isCellEditing) && (isRowEditing || !isRowMode)) {
        if (column.showEditorAlways && !isRowMode) {
          editingStartOptions = {
            cancel: false,
            key: options.row.isNewRow ? undefined : options.row.key,
            data: options.row.data,
            column,
          };
          this._isEditingStart(editingStartOptions);
        }
        if (!editingStartOptions || !editingStartOptions.cancel) {
          options.setValue = (value, text) => {
            this.updateFieldValue(options, value, text);
          };
        }
      }
      template = column.editCellTemplate || this._getDefaultEditorTemplate();
    } else if (column.command === 'detail' && options.rowType === 'detail' && isRowEditing) {
      template = (this as any)?.getEditFormTemplate(options);
    }

    return template;
  }

  private _createButton($container, button, options, change) {
    let icon = EDIT_ICON_CLASS[button.name];
    const useIcons = this.option('editing.useIcons');
    const useLegacyColumnButtonTemplate = this.option('useLegacyColumnButtonTemplate');
    let $button = $('<a>')
      .attr('href', '#')
      .addClass(LINK_CLASS)
      .addClass(button.cssClass);

    if (button.template && useLegacyColumnButtonTemplate) {
      this._rowsView.renderTemplate($container, button.template, options, true);
    } else {
      if (button.template) {
        $button = $('<span>').addClass(button.cssClass);
      } else if (useIcons && icon || button.icon) {
        icon = button.icon || icon;
        const iconType = iconUtils.getImageSourceType(icon);

        if (iconType === 'image' || iconType === 'svg') {
          // @ts-expect-error
          $button = iconUtils.getImageContainer(icon).addClass(button.cssClass);
        } else {
          $button.addClass(`dx-icon${iconType === 'dxIcon' ? '-' : ' '}${icon}`).attr('title', button.text);
        }

        $button.addClass(LINK_ICON_CLASS);
        $container.addClass(COMMAND_EDIT_WITH_ICONS_CLASS);

        const localizationName = this.getButtonLocalizationNames()[button.name];
        localizationName && $button.attr('aria-label', messageLocalization.format(localizationName));
      } else {
        $button.text(button.text);
      }

      if (isDefined(button.hint)) {
        $button.attr('title', button.hint);
      }

      if (this._isButtonDisabled(button, options)) {
        $button.addClass('dx-state-disabled');
      } else if (!button.template || button.onClick) {
        eventsEngine.on($button, addNamespace('click', EDITING_NAMESPACE), this.createAction((e) => {
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
  protected getButtonLocalizationNames() {
    return {
      edit: 'dxDataGrid-editingEditRow',
      save: 'dxDataGrid-editingSaveRowChanges',
      delete: 'dxDataGrid-editingDeleteRow',
      undelete: 'dxDataGrid-editingUndeleteRow',
      cancel: 'dxDataGrid-editingCancelRowChanges',
    };
  }

  protected prepareButtonItem(headerPanel, name, methodName, sortIndex) {
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
    const onInitialized = (e) => {
      $(e.element).addClass(headerPanel._getToolbarButtonClass(`${EDIT_BUTTON_CLASS} ${this.addWidgetPrefix(className)}-button`));
    };
    const hintText = titleButtonTextByClassNames[name];
    const isButtonDisabled = (className === 'save' || className === 'cancel') && this._isEditButtonDisabled();

    return {
      widget: 'dxButton',
      options: {
        onInitialized,
        icon: `edit-button-${className}`,
        disabled: isButtonDisabled,
        onClick: () => {
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

  public prepareEditButtons(headerPanel) {
    const editingOptions: any = this.option('editing') ?? {};
    const buttonItems: any = [];

    if (editingOptions.allowAdding) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'addRow', 'addRow', 20));
    }

    return buttonItems;
  }

  /**
   * @extended: validating
   */
  public highlightDataCell($cell, params) { this.shouldHighlightCell(params) && $cell.addClass(CELL_MODIFIED); }

  /**
   * @extended: adaptivity
   */
  protected _afterInsertRow(key): any {}

  /**
   * @extended: validating, TreeList's editing
   */
  // @ts-expect-error
  protected _beforeSaveEditData(change?) {
    if (change && !isDefined(change.key) && isDefined(change.type)) {
      return true;
    }
  }

  /**
   * @extended: adaptivity, filter_row, validating
   */
  protected _afterSaveEditData(): any {}

  /**
   * @extended: adaptivity, validating
   */
  protected _beforeCancelEditData(): any {}

  protected _allowEditAction(actionName, options) {
    let allowEditAction: any = this.option(`editing.${actionName}`);

    if (isFunction(allowEditAction)) {
      allowEditAction = allowEditAction({ component: this.component, row: options.row });
    }

    return allowEditAction;
  }

  public allowUpdating(options, eventName?) {
    const startEditAction = this.option('editing.startEditAction') ?? DEFAULT_START_EDIT_ACTION;
    const needCallback = arguments.length > 1 ? startEditAction === eventName || eventName === 'down' : true;

    return needCallback && this._allowEditAction('allowUpdating', options);
  }

  protected allowDeleting(options) {
    return this._allowEditAction('allowDeleting', options);
  }

  /**
   * @extended: validating
   */
  public isCellModified(parameters) {
    const { columnIndex } = parameters;
    let modifiedValue = parameters?.row?.modifiedValues?.[columnIndex];

    if (parameters?.row?.isNewRow) {
      modifiedValue = parameters.value;
    }

    return modifiedValue !== undefined;
  }

  public isNewRowInEditMode() {
    const visibleEditRowIndex = this._getVisibleEditRowIndex();
    const rows: any[] = this._dataController.items();

    return visibleEditRowIndex >= 0 ? rows[visibleEditRowIndex].isNewRow : false;
  }

  protected _isRowDeleteAllowed(): any {}

  public shouldHighlightCell(parameters) {
    const cellModified = this.isCellModified(parameters);
    return cellModified
              && parameters.column.setCellValue
              && (
                this.getEditMode() !== EDIT_MODE_ROW
                  || !parameters.row.isEditing
              );
  }
}

export type EditingController =
  EditingControllerImpl
  & ICellBasedEditingControllerExtender
  & IFormBasedEditingControllerExtender;

export const dataControllerEditingExtenderMixin = (Base: ModuleType<DataController>) => class DataControllerEditingExtender extends Base {
  public reload(full, repaintChangesOnly) {
    !repaintChangesOnly && this._editingController.refresh();

    return super.reload.apply(this, arguments as any);
  }

  public repaintRows() {
    if (this._editingController.isSaving()) return;
    return super.repaintRows.apply(this, arguments as any);
  }

  private _updateEditRow(items) {
    const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
    const editRowIndex = gridCoreUtils.getIndexByKey(editRowKey, items);
    const editItem = items[editRowIndex];
    if (editItem) {
      editItem.isEditing = true;
      // @ts-expect-error Badly typed based class
      this._updateEditItem?.(editItem);
    }
  }

  protected _updateItemsCore(change) {
    super._updateItemsCore(change);
    this._updateEditRow(this.items(true));
  }

  protected _applyChangeUpdate(change) {
    this._updateEditRow(change.items);
    super._applyChangeUpdate(change);
  }

  protected _applyChangesOnly(change) {
    this._updateEditRow(change.items);
    super._applyChangesOnly(change);
  }

  protected _processItems(items, change) {
    items = this._editingController.processItems(items, change);
    return super._processItems(items, change);
  }

  protected _processDataItem(dataItem, options) {
    this._editingController.processDataItem(dataItem, options, this.generateDataValues);
    return super._processDataItem(dataItem, options);
  }

  protected _processItem(item, options) {
    item = super._processItem(item, options);

    if (item.isNewRow) {
      options.dataIndex--;
      delete item.dataIndex;
    }

    return item;
  }

  protected _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
    if (oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed) {
      return;
    }

    return super._getChangedColumnIndices.apply(this, arguments as any);
  }

  protected _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
    const cell = oldRow.cells && oldRow.cells[columnIndex];
    const isEditing = this._editingController && this._editingController.isEditCell(visibleRowIndex, columnIndex);

    if (isLiveUpdate && isEditing) {
      return false;
    }

    if (cell && cell.column && !cell.column.showEditorAlways && cell.isEditing !== isEditing) {
      return true;
    }

    return super._isCellChanged.apply(this, arguments as any);
  }

  protected needToRefreshOnDataSourceChange(args) {
    const isParasiteChange = Array.isArray(args.value) && args.value === args.previousValue && this._editingController.isSaving();
    return !isParasiteChange;
  }

  protected _handleDataSourceChange(args) {
    const result = super._handleDataSourceChange(args);
    const changes: any = this.option('editing.changes');
    const dataSource = args.value;
    if (Array.isArray(dataSource) && changes.length) {
      const dataSourceKeys = dataSource.map((item) => this.keyOf(item));
      const newChanges = changes.filter((change) => change.type === 'insert' || dataSourceKeys.some((key) => equalByValue(change.key, key)));
      if (newChanges.length !== changes.length) {
        this.option('editing.changes', newChanges);
      }
      const editRowKey = this.option('editing.editRowKey');
      const isEditNewItem = newChanges.some(
        (change) => change.type === 'insert' && equalByValue(editRowKey, change.key),
      );
      if (!isEditNewItem && dataSourceKeys.every((key) => !equalByValue(editRowKey, key))) {
        this.option('editing.editRowKey', null);
      }
    }
    return result;
  }
};

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewEditingExtender extends Base {
  private _pointerDownTarget: any;

  private _pointerDownTimeout: any;

  public getCellIndex($cell, rowIndex?) {
    if (!$cell.is('td') && rowIndex >= 0) {
      const $cellElements = this.getCellElements(rowIndex);
      let cellIndex = -1;

      each($cellElements, (index, cellElement) => {
        if ($(cellElement).find($cell).length) {
          cellIndex = index;
        }
      });

      return cellIndex;
    }

    return super.getCellIndex.apply(this, arguments as any);
  }

  public publicMethods() {
    return super.publicMethods().concat(['cellValue']);
  }

  protected _getCellTemplate(options) {
    const template = this._editingController.getColumnTemplate(options);

    return template || super._getCellTemplate(options);
  }

  protected _createRow(row) {
    const $row = super._createRow.apply(this, arguments as any);

    if (row) {
      const isRowRemoved = !!row.removed;
      const isRowInserted = !!row.isNewRow;
      const isRowModified = !!row.modified;

      isRowInserted && $row.addClass(ROW_INSERTED);
      isRowModified && $row.addClass(ROW_MODIFIED);

      if (isRowInserted || isRowRemoved) {
        $row.removeClass(ROW_SELECTED);
      }
    }
    return $row;
  }

  private _getColumnIndexByElement($element) {
    let $tableElement = $element.closest('table');
    const $tableElements = this.getTableElements();

    while ($tableElement.length && !$tableElements.filter($tableElement).length) {
      $element = $tableElement.closest('td');
      $tableElement = $element.closest('table');
    }

    return this._getColumnIndexByElementCore($element);
  }

  private _getColumnIndexByElementCore($element) {
    const $targetElement = $element.closest(`.${ROW_CLASS}> td:not(.dx-master-detail-cell)`);

    return this.getCellIndex($targetElement);
  }

  private _editCellByClick(e, eventName) {
    const editingController = this._editingController;
    const $targetElement = $(e.event.target);
    const columnIndex = this._getColumnIndexByElement($targetElement);
    const row: any = this._dataController.items()[e.rowIndex];
    const allowUpdating = editingController.allowUpdating({ row }, eventName) || row && row.isNewRow;
    const column = this._columnsController.getVisibleColumns()[columnIndex];
    const isEditedCell = editingController.isEditCell(e.rowIndex, columnIndex);
    const allowEditing = allowUpdating && column && (column.allowEditing || isEditedCell);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const startEditAction = this.option('editing.startEditAction') || 'click';
    const isShowEditorAlways = column && column.showEditorAlways;

    if (isEditedCell) {
      return true;
    }

    if (eventName === 'down') {
      if (devices.real().ios || devices.real().android) {
        domUtils.resetActiveElement();
      }

      return isShowEditorAlways && allowEditing && editingController.editCell(e.rowIndex, columnIndex);
    }

    if (eventName === 'click' && startEditAction === 'dblClick' && this._pointerDownTarget === $targetElement.get(0)) {
      const isError = false;
      const withoutSaveEditData = row?.isNewRow;
      editingController.closeEditCell(isError, withoutSaveEditData);
    }

    if (allowEditing && eventName === startEditAction) {
      return editingController.editCell(e.rowIndex, columnIndex) || editingController.isEditRow(e.rowIndex);
    }
  }

  protected _rowPointerDown(e) {
    this._pointerDownTarget = e.event.target;
    this._pointerDownTimeout = setTimeout(() => {
      this._editCellByClick(e, 'down');
    });
  }

  private _rowClickTreeListHack(e) {
    // @ts-expect-error
    super._rowClick.apply(this, arguments);
  }

  protected _rowClick(e) {
    const isEditForm = $(e.rowElement).hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS));

    e.event[TARGET_COMPONENT_NAME] = this.component;

    if (!this._editCellByClick(e, 'click') && !isEditForm) {
      super._rowClick.apply(this, arguments as any);
    }
  }

  private _rowDblClickTreeListHack(e) {
    // @ts-expect-error
    super._rowDblClick.apply(this, arguments);
  }

  protected _rowDblClick(e) {
    if (!this._editCellByClick(e, 'dblClick')) {
      super._rowDblClick.apply(this, arguments as any);
    }
  }

  public _cellPrepared($cell, parameters) {
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
      // @ts-expect-error
      this._editCellPrepared($cell);
    }

    const hasTemplate = !!parameters.column?.cellTemplate;

    if (parameters.column && !isCommandCell && (!hasTemplate || editingController.shouldHighlightCell(parameters))) {
      editingController.highlightDataCell($cell, parameters);
    }
    super._cellPrepared.apply(this, arguments as any);
  }

  public _getCellOptions(options) {
    const cellOptions = super._getCellOptions(options);
    const { columnIndex, row } = options;

    cellOptions.isEditing = this._editingController.isEditCell(cellOptions.rowIndex, cellOptions.columnIndex);
    cellOptions.removed = row.removed;

    if (row.modified) {
      cellOptions.modified = row.modifiedValues[columnIndex] !== undefined;
    }

    return cellOptions;
  }

  protected _setCellAriaAttributes($cell, cellOptions, options?) {
    super._setCellAriaAttributes($cell, cellOptions, options);

    if (cellOptions.removed) {
      this.setAria('roledescription', messageLocalization.format('dxDataGrid-ariaDeletedCell'), $cell);
    }
    if (cellOptions.modified) {
      this.setAria('roledescription', messageLocalization.format('dxDataGrid-ariaModifiedCell'), $cell);
    }

    const isEditableCell = cellOptions.column.allowEditing
      && !cellOptions.removed
      && !cellOptions.modified
      && cellOptions.rowType === 'data'
      && cellOptions.column.calculateCellValue === cellOptions.column.defaultCalculateCellValue
      && this._editingController.isCellBasedEditMode();

    if (isEditableCell) {
      this.setAria('roledescription', messageLocalization.format('dxDataGrid-ariaEditableCell'), $cell);
    }
  }

  protected _createCell(options) {
    const $cell = super._createCell(options);
    const isEditRow = this._editingController.isEditRow(options.rowIndex);

    isEditingOrShowEditorAlwaysDataCell(isEditRow, options) && $cell.addClass(EDITOR_CELL_CLASS);

    return $cell;
  }

  private cellValue(rowIndex, columnIdentifier, value, text) {
    const cellOptions = this.getCellOptions(rowIndex, columnIdentifier);

    if (cellOptions) {
      if (value === undefined) {
        return cellOptions.value;
      }
      this._editingController.updateFieldValue(cellOptions, value, text, true);
    }
  }

  public dispose() {
    super.dispose.apply(this, arguments as any);
    clearTimeout(this._pointerDownTimeout);
  }

  protected _renderCore() {
    super._renderCore.apply(this, arguments as any);

    return this.waitAsyncTemplates(true).done(() => {
      this._editingController._focusEditorIfNeed();
    });
  }

  private _editCellPrepared() {

  }

  private _formItemPrepared() {

  }
};

const headerPanel = (Base: ModuleType<HeaderPanel>) => class HeaderPanelEditingExtender extends Base {
  public optionChanged(args) {
    const { fullName } = args;
    switch (args.name) {
      case 'editing': {
        const excludedOptions = [EDITING_POPUP_OPTION_NAME, EDITING_CHANGES_OPTION_NAME, EDITING_EDITCOLUMNNAME_OPTION_NAME, EDITING_EDITROWKEY_OPTION_NAME];
        const shouldInvalidate = fullName && !excludedOptions.some((optionName) => optionName === fullName);

        shouldInvalidate && this._invalidate();
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

  protected _getToolbarItems() {
    const items = super._getToolbarItems();
    const editButtonItems = this._editingController.prepareEditButtons(this);

    return editButtonItems.concat(items);
  }

  public isVisible() {
    const editingOptions = this._editingController.option('editing');

    // @ts-expect-error
    return super.isVisible() || editingOptions?.allowAdding;
  }
};

export const editingModule = {
  defaultOptions() {
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

        editRowKey: null,

        editColumnName: null,

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
      data: dataControllerEditingExtenderMixin,
    },
    views: {
      rowsView,
      headerPanel,
    },
  },
};
