/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import { createObjectWithChanges } from '@js/common/data/array_utils';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isElementInDom } from '@js/core/utils/dom';
import { isDefined, isString } from '@js/core/utils/type';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import type { ModuleType } from '../m_types';
import {
  ADD_ROW_BUTTON_CLASS,
  CELL_MODIFIED_CLASS,
  DATA_EDIT_DATA_REMOVE_TYPE,
  DATA_ROW_CLASS,
  DROPDOWN_EDITOR_OVERLAY_CLASS,
  EDIT_MODE_BATCH,
  EDIT_MODE_CELL,
  EDITING_EDITCOLUMNNAME_OPTION_NAME,
  EDITING_EDITROWKEY_OPTION_NAME,
  EDITOR_CELL_CLASS,
  FOCUS_OVERLAY_CLASS,
  ROW_CLASS,
  ROW_REMOVED,
  TARGET_COMPONENT_NAME,
} from './const';
import type { EditingController } from './m_editing';
import { isEditable } from './m_editing_utils';

export interface ICellBasedEditingControllerExtender {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  isCellOrBatchEditMode(): any;

  // eslint-disable-next-line @typescript-eslint/method-signature-style
  closeEditCell(isError?, withoutSaveEditData?): any;

  // eslint-disable-next-line @typescript-eslint/method-signature-style
  editCell(rowIndex, columnIndex): any;
}

const editingControllerExtender = (Base: ModuleType<EditingController>) => class CellBasedEditingControllerExtender extends Base implements ICellBasedEditingControllerExtender {
  private _pointerUpEditorHandler: any;

  private _pointerDownEditorHandler: any;

  public init() {
    const needCreateHandlers = !this._saveEditorHandler;

    super.init();

    if (needCreateHandlers) {
      // chrome 73+
      let $pointerDownTarget;
      let isResizing;
      this._pointerUpEditorHandler = () => { isResizing = this._columnsResizerController?.isResizing(); };
      // eslint-disable-next-line no-return-assign
      this._pointerDownEditorHandler = (e: any) => $pointerDownTarget = $(e.target);
      this._saveEditorHandler = this.createAction(function (e) {
        const { event } = e;
        const $target = $(event.target);
        const targetComponent = event[TARGET_COMPONENT_NAME];
        const { component } = this;

        if (isEditable($pointerDownTarget) && !$pointerDownTarget.is($target)) {
          return;
        }

        function checkEditorPopup($element) {
          if (!$element) {
            return false;
          }
          const $dropDownEditorOverlay = $element.closest(`.${DROPDOWN_EDITOR_OVERLAY_CLASS}`);
          const $componentElement = component.$element();
          return $dropDownEditorOverlay.length > 0 && $componentElement.closest($dropDownEditorOverlay).length === 0;
        }

        if (this.isCellOrBatchEditMode() && !this._editCellInProgress) {
          const isEditorPopup = checkEditorPopup($target) || checkEditorPopup(targetComponent?.$element());
          const isAnotherComponent = targetComponent && !targetComponent._disposed && targetComponent !== this.component;
          const isAddRowButton = !!$target.closest(`.${this.addWidgetPrefix(ADD_ROW_BUTTON_CLASS)}`).length;
          const isFocusOverlay = $target.hasClass(this.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
          const isCellEditMode = this.isCellEditMode();
          if (!isResizing && !isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && this.isEditing()) && (isElementInDom($target) || isAnotherComponent)) {
            this._closeEditItem.bind(this)($target);
          }
        }
      });

      eventsEngine.on(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
      eventsEngine.on(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
      eventsEngine.on(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
    }
  }

  private isCellEditMode() {
    return this.option('editing.mode') === EDIT_MODE_CELL;
  }

  private isBatchEditMode() {
    return this.option('editing.mode') === EDIT_MODE_BATCH;
  }

  /**
   * interface override
   */
  public isCellOrBatchEditMode(): any {
    return this.isCellEditMode() || this.isBatchEditMode();
  }

  protected _needToCloseEditableCell($targetElement) {
    const $element = this.component.$element();
    let result = this.isEditing();
    const isCurrentComponentElement = !$element || !!$targetElement.closest($element).length;

    if (isCurrentComponentElement) {
      const isDataRow = $targetElement.closest(`.${DATA_ROW_CLASS}`).length;

      if (isDataRow) {
        const $targetCell = $targetElement.closest(`.${ROW_CLASS}> td`);
        const rowIndex = this._rowsView.getRowIndex($targetCell.parent());
        const cellElements = this._rowsView.getCellElements(rowIndex);

        if (cellElements?.length) {
          const columnIndex = cellElements.index($targetCell);
          const visibleColumns = this._columnsController.getVisibleColumns();
          // TODO jsdmitry: Move this code to _rowClick method of rowsView
          const allowEditing = visibleColumns[columnIndex]?.allowEditing;
          const isEditingCell = this.isEditCell(rowIndex, columnIndex);

          result = result && !allowEditing && !isEditingCell;
        }
      }
    }

    return result || super._needToCloseEditableCell($targetElement);
  }

  protected _closeEditItem($targetElement) {
    if (this._needToCloseEditableCell($targetElement)) {
      this.closeEditCell();
    }
  }

  public _focusEditorIfNeed() {
    if (this._needFocusEditor && this.isCellOrBatchEditMode()) {
      const editColumnIndex = this._getVisibleEditColumnIndex();
      const $cell = this._rowsView?._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex); // T319885

      // NOTE: Cancel redundant editor refocus [T1194403]
      this._refocusEditCell = false;
      clearTimeout(this._inputFocusTimeoutID);

      if ($cell && !$cell.find(':focus').length) {
        this._focusEditingCell(() => {
          this._editCellInProgress = false;
        }, $cell, true);
      } else {
        this._editCellInProgress = false;
      }

      this._needFocusEditor = false;
    } else {
      super._focusEditorIfNeed();
    }
  }

  public isEditing() {
    if (this.isCellOrBatchEditMode()) {
      const isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));
      const isEditColumnNameDefined = isDefined(this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME));

      return isEditRowKeyDefined && isEditColumnNameDefined;
    }

    return super.isEditing();
  }

  private _handleEditColumnNameChange(args) {
    const oldRowIndex = this._getVisibleEditRowIndex(args.previousValue);

    if (this.isCellOrBatchEditMode() && oldRowIndex !== -1 && isDefined(args.value) && args.value !== args.previousValue) {
      const columnIndex = this._columnsController.getVisibleColumnIndex(args.value);
      const oldColumnIndex = this._columnsController.getVisibleColumnIndex(args.previousValue);

      this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
    }
  }

  protected _addRow(parentKey) {
    if (this.isCellEditMode() && this.hasChanges()) {
      // @ts-expect-error
      const deferred = new Deferred();

      this.saveEditData().done(() => {
        // T804894
        if (!this.hasChanges()) {
          this.addRow(parentKey).done(deferred.resolve).fail(deferred.reject);
        } else {
          deferred.reject('cancel');
        }
      });
      return deferred.promise();
    }

    return super._addRow(parentKey);
  }

  /**
   * interface override
   */
  public editCell(rowIndex, columnIndex) {
    return this._editCell({ rowIndex, columnIndex });
  }

  private _editCell(options) {
    // @ts-expect-error
    const d = new Deferred();
    let coreResult;

    this.executeOperation(d, () => {
      coreResult = this._editCellCore(options);
      when(coreResult)
        .done(d.resolve)
        .fail(d.reject);
    });

    return coreResult !== undefined ? coreResult : d.promise();
  }

  private _editCellCore(options) {
    const dataController = this._dataController;
    const isEditByOptionChanged = isDefined(options.oldColumnIndex) || isDefined(options.oldRowIndex);
    const {
      columnIndex, rowIndex, column, item,
    } = this._getNormalizedEditCellOptions(options) as any;
    const params = {
      data: item?.data,
      cancel: false,
      column,
    };

    if (item.key === undefined) {
      this._dataController.fireError('E1043');
      return;
    }

    if (column && (item.rowType === 'data' || item.rowType === 'detailAdaptive') && !item.removed && this.isCellOrBatchEditMode()) {
      if (!isEditByOptionChanged && this.isEditCell(rowIndex, columnIndex)) {
        return true;
      }

      const editRowIndex = rowIndex + dataController.getRowIndexOffset();

      return when(this._beforeEditCell(rowIndex, columnIndex, item)).done((cancel) => {
        if (cancel) {
          return;
        }

        if (!this._prepareEditCell(params, item, columnIndex, editRowIndex)) {
          this._processCanceledEditingCell();
        }
      });
    }
    return false;
  }

  /**
   * @returns whether to cancel cell editing
   */
  private _beforeEditCell(rowIndex: number, columnIndex: number, item: any): DeferredObj<boolean> | boolean {
    if (this.isCellEditMode() && !item.isNewRow && this.hasChanges()) {
      // @ts-expect-error
      const isSaving = new Deferred();
      this.saveEditData().always(() => {
        isSaving.resolve(this.hasChanges());
      });
      this.addDeferred(isSaving);
      return isSaving;
    }
    return false;
  }

  public publicMethods() {
    const publicMethods = super.publicMethods();

    return publicMethods.concat(['editCell', 'closeEditCell']);
  }

  private _getNormalizedEditCellOptions({
    oldColumnIndex, oldRowIndex, columnIndex, rowIndex,
  }) {
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const items = this._dataController.items();
    const item = items[rowIndex];

    let oldColumn;
    if (isDefined(oldColumnIndex)) {
      oldColumn = visibleColumns[oldColumnIndex];
    } else {
      oldColumn = this._getEditColumn();
    }

    if (!isDefined(oldRowIndex)) {
      oldRowIndex = this._getVisibleEditRowIndex();
    }

    if (isString(columnIndex)) {
      columnIndex = columnsController.columnOption(columnIndex, 'index');
      columnIndex = columnsController.getVisibleIndex(columnIndex);
    }

    const column = visibleColumns[columnIndex];

    return {
      oldColumn, columnIndex, oldRowIndex, rowIndex, column, item,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _prepareEditCell(params, item, editColumnIndex, editRowIndex) {
    if (!item.isNewRow) {
      params.key = item.key;
    }

    if (this._isEditingStart(params)) {
      return false;
    }

    this._pageIndex = this._dataController.pageIndex();

    this._setEditRowKey(item.key);
    this._setEditColumnNameByIndex(editColumnIndex);

    if (!params.column.showEditorAlways) {
      this._addInternalData({
        key: item.key,
        oldData: item.oldData ?? item.data,
      });
    }

    return true;
  }

  /**
   * interface override
   */
  public closeEditCell(isError?, withoutSaveEditData?) {
    let result = when();
    const oldEditRowIndex = this._getVisibleEditRowIndex();

    if (this.isCellOrBatchEditMode()) {
      // @ts-expect-error
      const deferred = new Deferred();
      // @ts-expect-error
      result = new Deferred();
      this.executeOperation(deferred, () => {
        this._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData).always(result.resolve);
      });
    }

    return result.promise();
  }

  private _closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData) {
    const dataController = this._dataController;
    // @ts-expect-error
    const deferred = new Deferred();
    const promise = deferred.promise();

    if (this.isCellEditMode() && this.hasChanges()) {
      if (!withoutSaveEditData) {
        this.saveEditData().done((error) => {
          if (!this.hasChanges()) {
            (this.closeEditCell(!!error) as any).always(deferred.resolve);
            return;
          }
          deferred.resolve();
        });
        return promise;
      }
    } else {
      this._resetEditRowKey();
      this._resetEditColumnName();

      if (oldEditRowIndex >= 0) {
        const rowIndices = [oldEditRowIndex];
        this._beforeCloseEditCellInBatchMode(rowIndices);
        if (!isError) {
          dataController.updateItems({
            changeType: 'update',
            rowIndices,
          });
        }
      }
    }

    deferred.resolve();
    return promise;
  }

  private _resetModifiedClassCells(changes) {
    if (this.isBatchEditMode()) {
      const columnsCount = this._columnsController.getVisibleColumns().length;
      changes.forEach(({ key }) => {
        const rowIndex = this._dataController.getRowIndexByKey(key);
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
          const cellElement = this._rowsView._getCellElement(rowIndex, columnIndex);
          cellElement?.removeClass(CELL_MODIFIED_CLASS);
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _prepareChange(options, value, text) {
    const $cellElement = $(options.cellElement);

    if (this.isBatchEditMode() && options.key !== undefined) {
      this._applyModified($cellElement, options);
    }

    return super._prepareChange(options, value, text);
  }

  protected _cancelSaving(result) {
    const dataController = this._dataController;

    if (this.isCellOrBatchEditMode()) {
      if (this.isBatchEditMode()) {
        this._resetEditIndices();
      }

      dataController.updateItems();
    }

    super._cancelSaving(result);
  }

  public optionChanged(args) {
    const { fullName } = args;

    if (args.name === 'editing' && fullName === EDITING_EDITCOLUMNNAME_OPTION_NAME) {
      this._handleEditColumnNameChange(args);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  private _editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex) {
    const columns = this._columnsController.getVisibleColumns();

    if (columnIndex > -1) {
      deferRender(() => {
        this._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
      });
    }
  }

  protected _handleEditRowKeyChange(args) {
    if (this.isCellOrBatchEditMode()) {
      const columnIndex = this._getVisibleEditColumnIndex();
      const oldRowIndexCorrection = this._getEditRowIndexCorrection();
      const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;

      if (isDefined(args.value) && args.value !== args.previousValue) {
        this._editCellFromOptionChanged?.(columnIndex, columnIndex, oldRowIndex);
      }
    } else {
      super._handleEditRowKeyChange(args);
    }
  }

  protected deleteRow(rowIndex) {
    if (this.isCellEditMode() && this.isEditing()) {
      const { isNewRow } = this._dataController.items()[rowIndex] as any;
      const rowKey = this._dataController.getKeyByRowIndex(rowIndex);

      // T850905
      (this.closeEditCell(null, isNewRow) as any).always(() => {
        rowIndex = this._dataController.getRowIndexByKey(rowKey);
        this._checkAndDeleteRow(rowIndex);
      });
    } else {
      super.deleteRow(rowIndex);
    }
  }

  protected _checkAndDeleteRow(rowIndex) {
    if (this.isBatchEditMode()) {
      this._deleteRowCore(rowIndex);
    } else {
      super._checkAndDeleteRow(rowIndex);
    }
  }

  protected _refreshCore(params) {
    const { isPageChanged } = params ?? {};
    const needResetIndexes = this.isBatchEditMode() || isPageChanged && this.option('scrolling.mode') !== 'virtual';

    if (this.isCellOrBatchEditMode()) {
      if (needResetIndexes) {
        this._resetEditColumnName();
        this._resetEditRowKey();
      }
    } else {
      super._refreshCore(params);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _allowRowAdding(params) {
    if (this.isBatchEditMode()) {
      return true;
    }

    return super._allowRowAdding(params);
  }

  protected _afterDeleteRow(rowIndex, oldEditRowIndex) {
    const dataController = this._dataController;

    if (this.isBatchEditMode()) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, rowIndex],
      });

      // @ts-expect-error
      return new Deferred().resolve();
    }

    return super._afterDeleteRow(rowIndex, oldEditRowIndex);
  }

  protected _updateEditRow(row, forceUpdateRow, isCustomSetCellValue) {
    if (this.isCellOrBatchEditMode()) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      super._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
    }
  }

  protected _isDefaultButtonVisible(button, options) {
    if (this.isCellOrBatchEditMode()) {
      const isBatchMode = this.isBatchEditMode();

      switch (button.name) {
        case 'save':
        case 'cancel':
        case 'edit':
          return false;
        case 'delete':
          return super._isDefaultButtonVisible(button, options) && (!isBatchMode || !options.row.removed);
        case 'undelete':
          return isBatchMode && this.allowDeleting(options) && options.row.removed;
        default:
          return super._isDefaultButtonVisible(button, options);
      }
    }

    return super._isDefaultButtonVisible(button, options);
  }

  protected _isRowDeleteAllowed() {
    const callBaseResult = super._isRowDeleteAllowed();

    return callBaseResult || this.isBatchEditMode();
  }

  protected _beforeEndSaving(changes) {
    if (this.isCellEditMode()) {
      if (changes[0]?.type !== 'update') {
        super._beforeEndSaving(changes);
      }
    } else {
      if (this.isBatchEditMode()) {
        this._resetModifiedClassCells(changes);
      }
      super._beforeEndSaving(changes);
    }
  }

  public prepareEditButtons(headerPanel) {
    const editingOptions: any = this.option('editing') ?? {};
    const buttonItems = super.prepareEditButtons(headerPanel);
    const needEditingButtons = editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting;

    if (needEditingButtons && this.isBatchEditMode()) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'save', 'saveEditData', 21));
      buttonItems.push(this.prepareButtonItem(headerPanel, 'revert', 'cancelEditData', 22));
    }

    return buttonItems;
  }

  protected _saveEditDataInner() {
    const editRow: any = this._dataController.getVisibleRows()[this.getEditRowIndex()];
    const editColumn = this._getEditColumn();
    const showEditorAlways = editColumn?.showEditorAlways;
    const isUpdateInCellMode = this.isCellEditMode() && !editRow?.isNewRow;
    let deferred;

    if (isUpdateInCellMode && showEditorAlways) {
      // @ts-expect-error
      deferred = new Deferred();
      this.addDeferred(deferred);
    }

    return super._saveEditDataInner().always(deferred?.resolve);
  }

  protected _applyChange(options, params, forceUpdateRow) {
    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
    const { showEditorAlways } = options.column;
    const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
    const focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex);

    if (focusPreviousEditingCell) {
      this._focusEditingCell();
      this._updateEditRow(options.row, true, isCustomSetCellValue);
      return;
    }

    return super._applyChange(options, params, forceUpdateRow);
  }

  protected _applyChangeCore(options, forceUpdateRow) {
    const { showEditorAlways } = options.column;
    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;

    if (showEditorAlways && !forceUpdateRow) {
      if (isUpdateInCellMode) {
        this._setEditRowKey(options.row.key, true);
        this._setEditColumnNameByIndex(options.columnIndex, true);

        return this.saveEditData();
      } if (this.isBatchEditMode()) {
        forceUpdateRow = this._needUpdateRow(options.column);

        return super._applyChangeCore(options, forceUpdateRow);
      }
    }

    return super._applyChangeCore(options, forceUpdateRow);
  }

  protected _processDataItemCore(item, change, key, columns, generateDataValues) {
    const { data, type } = change;

    if (this.isBatchEditMode() && type === DATA_EDIT_DATA_REMOVE_TYPE) {
      item.data = createObjectWithChanges(item.data, data);
    }

    super._processDataItemCore(item, change, key, columns, generateDataValues);
  }

  protected _processRemoveCore(changes, editIndex, processIfBatch): any {
    if (this.isBatchEditMode() && !processIfBatch) {
      return;
    }

    return super._processRemoveCore(changes, editIndex, processIfBatch);
  }

  public _processRemoveIfError(changes, editIndex): any {
    if (this.isBatchEditMode()) {
      return;
    }

    return super._processRemoveIfError(changes, editIndex);
  }

  protected _beforeFocusElementInRow(rowIndex) {
    super._beforeFocusElementInRow(rowIndex);

    const editRowIndex = rowIndex >= 0 ? rowIndex : 0;
    const columnIndex = this.getFirstEditableColumnIndex();
    columnIndex >= 0 && this.editCell(editRowIndex, columnIndex);
  }
};

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewEditingCellBasedExtender extends Base {
  protected _createTable() {
    const $table = super._createTable.apply(this, arguments as any);
    const editingController = this._editingController;

    if (editingController.isCellOrBatchEditMode() && this.option('editing.allowUpdating')) {
      eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), `td:not(.${EDITOR_CELL_CLASS})`, this.createAction(() => {
        if (editingController.isEditing()) {
          editingController.closeEditCell();
        }
      }));
    }

    return $table;
  }

  protected _createRow(row) {
    const $row = super._createRow.apply(this, arguments as any);

    if (row) {
      const editingController = this._editingController;
      const isRowRemoved = !!row.removed;

      // @ts-expect-error
      if (editingController.isBatchEditMode()) {
        isRowRemoved && $row.addClass(ROW_REMOVED);
      }
    }
    return $row;
  }
};

export const editingCellBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender,
    },
    views: {
      rowsView,
    },
  },
};
