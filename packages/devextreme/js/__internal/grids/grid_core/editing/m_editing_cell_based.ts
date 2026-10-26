/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils';
import { createObjectWithChanges } from '@js/common/data/array_utils';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isElementInDom } from '@js/core/utils/dom';
import { isDefined, isString } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type {
  GeneratedItem,
  ProcessedItem,
  RefreshOptions,
} from '@ts/grids/grid_core/data_controller/types';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ToolbarItem } from '@ts/grids/new/grid_core/toolbar/types';

import type {
  InternalGrid, ModuleType, OptionChanged, RowKey,
} from '../types';
import {
  CLASSES,
  DATA_CHANGE_TYPE,
  EDIT_MODE,
  EDITING_EDITCOLUMNNAME_OPTION_NAME,
  EDITING_EDITROWKEY_OPTION_NAME,
  TARGET_COMPONENT_NAME,
} from './const';
import type { EditingController } from './editing';
import { isCellBasedEditMode, isEditable } from './editing_utils';
import type {
  EditCellOptions,
  EditCellResult,
  EditColumnNameOptionChanged,
  EditingChange,
  EditingChangeParams,
  EditingOptions,
  EditorCellOptions,
  InternalColumnButton,
  NormalizedEditCellOptions,
  PrepareEditCellOptions,
} from './types';

export interface CellBasedEditingControllerExtension {
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  closeEditCell(isError?: boolean | null, withoutSaveEditData?: boolean): DeferredObj<unknown>;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  editCell(rowIndex: number, columnIndex: number | string): EditCellResult;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  beforeCloseEditCell(rowIndices: number[]): void;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  _beforeEditCell(
    rowIndex: number,
    columnIndex: number,
    item: ProcessedItem,
  ): DeferredObj<boolean> | boolean;
}

export type CellBasedEditingController = EditingController & CellBasedEditingControllerExtension;

const editingControllerExtender = (
  Base: ModuleType<EditingController>,
): ModuleType<CellBasedEditingController> => class CellBasedEditingControllerExtender extends Base {
  private _pointerUpEditorHandler?: () => void;

  private _pointerDownEditorHandler?: (e: DxEvent) => void;

  private _saveEditorHandler?: (e: DxEvent) => void;

  public init(): void {
    const needCreateHandlers = !this._saveEditorHandler;

    super.init();

    if (needCreateHandlers) {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on pointer down
      let $pointerDownTarget: dxElementWrapper | undefined;
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on pointer up
      let isResizing: boolean | undefined;

      this._pointerUpEditorHandler = (): void => {
        isResizing = this._columnsResizerController?.isResizing();
      };
      this._pointerDownEditorHandler = (e: DxEvent): void => {
        $pointerDownTarget = $(e.target);
      };
      this._saveEditorHandler = this.createAction((e: { event: DxEvent }) => {
        this.closeEditCellOnOutsideClick(e.event, $pointerDownTarget, isResizing);
      });

      eventsEngine.on(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
      eventsEngine.on(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
      eventsEngine.on(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
    }
  }

  private closeEditCellOnOutsideClick(
    event: DxEvent,
    $pointerDownTarget: dxElementWrapper | undefined,
    isResizing: boolean | undefined,
  ): void {
    const $target = $(event.target);
    const targetComponent = event[TARGET_COMPONENT_NAME];

    const isDragOutOfEditor = isEditable($pointerDownTarget)
      && !$pointerDownTarget?.is($target);

    if (isDragOutOfEditor || isResizing) {
      return;
    }

    const editMode = this.getEditMode();

    if (!isCellBasedEditMode(editMode) || this._editCellInProgress) {
      return;
    }

    if (this.isInEditorPopup($target) || this.isInEditorPopup(targetComponent?.$element())) {
      return;
    }

    const addRowButtonSelector = `.${this.addWidgetPrefix(CLASSES.addRowButton)}`;
    const isAddRowButton = !!$target.closest(addRowButtonSelector).length;
    const isAddRowWhileCellEditing = isAddRowButton
      && editMode === EDIT_MODE.cell
      && this.isEditing();
    const isFocusOverlay = $target.hasClass(this.addWidgetPrefix(CLASSES.focusOverlay));

    if (isFocusOverlay || isAddRowWhileCellEditing) {
      return;
    }

    if (isElementInDom($target) || this.isAnotherAliveComponent(targetComponent)) {
      this._closeEditItem($target);
    }
  }

  private isAnotherAliveComponent(component: InternalGrid | undefined): boolean {
    return !!component && !component._disposed && component !== this.component;
  }

  private isInEditorPopup($element: dxElementWrapper | undefined): boolean {
    if (!$element) {
      return false;
    }
    const $dropDownEditorOverlay = $element.closest(`.${CLASSES.dropDownEditorOverlay}`);
    const $componentElement = this.component.$element();
    return $dropDownEditorOverlay.length > 0
      && $componentElement.closest($dropDownEditorOverlay).length === 0;
  }

  public dispose(): void {
    super.dispose();

    eventsEngine.off(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
    eventsEngine.off(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
    eventsEngine.off(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
  }

  protected _needToCloseEditableCell($targetElement: dxElementWrapper): boolean | undefined {
    if (this.isEditing() && !this.isClickOnEditableCell($targetElement)) {
      return true;
    }

    return super._needToCloseEditableCell($targetElement);
  }

  private isClickOnEditableCell($targetElement: dxElementWrapper): boolean {
    const $element = this.component.$element();
    const isInsideGrid = !$element || !!$targetElement.closest($element).length;
    const isInsideDataRow = !!$targetElement.closest(`.${VIEW_CLASSES.dataRow}`).length;

    if (!isInsideGrid || !isInsideDataRow) {
      return false;
    }

    const $targetCell = $targetElement.closest(`.${VIEW_CLASSES.row}> td`);
    const rowIndex = this._rowsView.getRowIndex($targetCell.parent());
    const cellElements = this._rowsView.getCellElements(rowIndex);

    if (!cellElements?.length) {
      return false;
    }

    const columnIndex = cellElements.index($targetCell);
    const visibleColumns = this._columnsController.getVisibleColumns();
    // TODO jsdmitry: Move this code to _rowClick method of rowsView
    const allowEditing = visibleColumns[columnIndex]?.allowEditing;

    return !!allowEditing || this.isEditCell(rowIndex, columnIndex);
  }

  protected _closeEditItem($targetElement: dxElementWrapper): void {
    if (this._needToCloseEditableCell($targetElement)) {
      this.closeEditCell();
    }
  }

  public _focusEditorIfNeed(): void {
    if (this._needFocusEditor && isCellBasedEditMode(this.getEditMode())) {
      const editColumnIndex = this._getVisibleEditColumnIndex();
      const $cell = this._rowsView?._getCellElement(
        this._getVisibleEditRowIndex(),
        editColumnIndex,
      ); // T319885

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

  public isEditing(): boolean {
    if (isCellBasedEditMode(this.getEditMode())) {
      const isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));
      const isEditColumnNameDefined = isDefined(this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME));

      return isEditRowKeyDefined && isEditColumnNameDefined;
    }

    return super.isEditing();
  }

  private _handleEditColumnNameChange(args: EditColumnNameOptionChanged): void {
    const { value: columnName, previousValue: oldColumnName } = args;
    const oldRowIndex = this._getVisibleEditRowIndex(oldColumnName);
    const isEditRowVisible = oldRowIndex !== -1;
    const isColumnChanged = isDefined(columnName) && columnName !== oldColumnName;

    if (!isCellBasedEditMode(this.getEditMode()) || !isEditRowVisible || !isColumnChanged) {
      return;
    }

    const columnIndex = this._columnsController.getVisibleColumnIndex(columnName);
    // @ts-expect-error getVisibleColumnIndex() is typed without undefined
    const oldColumnIndex = this._columnsController.getVisibleColumnIndex(oldColumnName);

    this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
  }

  protected _addRow(parentKey?: RowKey): DeferredObj<unknown> {
    if (this.getEditMode() === EDIT_MODE.cell && this.hasChanges()) {
      const deferred = Deferred<unknown>();

      this.saveEditData().done(() => {
        // T804894
        if (!this.hasChanges()) {
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          this.addRow(parentKey).done(deferred.resolve).fail(deferred.reject);
        } else {
          deferred.reject('cancel');
        }
      });
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return deferred.promise();
    }

    return super._addRow(parentKey);
  }

  public editCell(rowIndex: number, columnIndex: number | string): EditCellResult {
    const d = Deferred<unknown>();
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in executeOperation
    let coreResult: boolean | DeferredObj<boolean> | undefined;

    this.executeOperation(d, () => {
      coreResult = this._editCellCore({ rowIndex, columnIndex });
      when(coreResult)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .done(d.resolve)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .fail(d.reject);
    });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return coreResult ?? d.promise();
  }

  private _editCellCore(options: EditCellOptions): boolean | DeferredObj<boolean> | undefined {
    const editCellOptions = this._getNormalizedEditCellOptions(options);
    const {
      columnIndex,
      rowIndex,
      column,
      item,
    } = editCellOptions;

    if (item.key === undefined) {
      this._dataController.fireError('E1043');
      return undefined;
    }

    if (column && (item.rowType === 'data' || item.rowType === 'detailAdaptive') && !item.removed && isCellBasedEditMode(this.getEditMode())) {
      if (this.isEditCell(rowIndex, columnIndex)) {
        return true;
      }

      return when(this._beforeEditCell(rowIndex, columnIndex, item)).done((cancel) => {
        if (cancel) {
          return;
        }

        if (!this._prepareEditCell({ ...editCellOptions, column })) {
          this._processCanceledEditingCell();
        }
      });
    }
    return false;
  }

  /**
   * @extended: validating
   * @returns whether to cancel cell editing
   */
  public _beforeEditCell(
    rowIndex: number,
    columnIndex: number,
    item: ProcessedItem,
  ): DeferredObj<boolean> | boolean {
    if (this.getEditMode() === EDIT_MODE.cell && !item.isNewRow && this.hasChanges()) {
      const isSaving = Deferred<boolean>();
      this.saveEditData().always(() => {
        isSaving.resolve(this.hasChanges());
      });
      this.addDeferred(isSaving);
      return isSaving;
    }
    return false;
  }

  public publicMethods(): string[] {
    const publicMethods = super.publicMethods();

    return publicMethods.concat(['editCell', 'closeEditCell']);
  }

  private _getNormalizedEditCellOptions({
    oldColumnIndex,
    oldRowIndex,
    columnIndex,
    rowIndex,
  }: EditCellOptions): NormalizedEditCellOptions {
    const visibleColumns = this._columnsController.getVisibleColumns();

    const oldColumn = isDefined(oldColumnIndex)
      ? visibleColumns[oldColumnIndex]
      : this._getEditColumn();

    const normalizedOldRowIndex = isDefined(oldRowIndex)
      ? oldRowIndex
      : this._getVisibleEditRowIndex();

    const normalizedColumnIndex = isString(columnIndex)
      ? this._columnsController.getVisibleColumnIndex(columnIndex)
      : columnIndex;

    return {
      oldColumn,
      columnIndex: normalizedColumnIndex,
      oldRowIndex: normalizedOldRowIndex,
      rowIndex,
      column: visibleColumns[normalizedColumnIndex],
      item: this._dataController.items()[rowIndex],
    };
  }

  protected _prepareEditCell({
    item,
    column,
    oldColumn,
    columnIndex,
    oldRowIndex,
  }: PrepareEditCellOptions): boolean {
    const editingStartParams = {
      data: item?.data,
      cancel: false,
      column,
      key: !item.isNewRow ? item.key : undefined,
    };

    if (this._isEditingStart(editingStartParams)) {
      return false;
    }

    this._pageIndex = this._dataController.pageIndex();

    this._setEditRowKey(item.key, true);
    this._setEditColumnNameByIndex(columnIndex, true);
    this._repaintEditCell(column, oldColumn, oldRowIndex);

    if (!column.showEditorAlways) {
      this._addInternalData({
        key: item.key,
        oldData: item.oldData ?? item.data,
      });
    }

    return true;
  }

  public closeEditCell(
    isError?: boolean | null,
    withoutSaveEditData?: boolean,
  ): DeferredObj<unknown> {
    let result = when();
    const oldEditRowIndex = this._getVisibleEditRowIndex();

    if (isCellBasedEditMode(this.getEditMode())) {
      const deferred = Deferred<unknown>();
      result = Deferred<unknown>();
      this.executeOperation(deferred, () => {
        this._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData)
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          .always(result.resolve);
      });
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return result.promise();
  }

  /**
   * @extended: adaptivity
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by overrides
  public beforeCloseEditCell(rowIndices: number[]): void {}

  private _closeEditCellCore(
    isError: boolean | null | undefined,
    oldEditRowIndex: number,
    withoutSaveEditData: boolean | undefined,
  ): DeferredObj<unknown> {
    const deferred = Deferred<unknown>();
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    const promise: DeferredObj<unknown> = deferred.promise();

    if (this.getEditMode() === EDIT_MODE.cell && this.hasChanges()) {
      if (!withoutSaveEditData) {
        this.saveEditData().done((error) => {
          if (!this.hasChanges()) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
            this.closeEditCell(!!error).always(deferred.resolve);
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
        this.beforeCloseEditCell(rowIndices);
        if (!isError) {
          this._dataController.updateItems({
            changeType: 'update',
            rowIndices,
          });
        }
      }
    }

    deferred.resolve();
    return promise;
  }

  private _resetModifiedClassCells(changes: EditingChange[]): void {
    if (this.getEditMode() === EDIT_MODE.batch) {
      const columnsCount = this._columnsController.getVisibleColumns().length;
      changes.forEach(({ key }) => {
        const rowIndex = this._dataController.getRowIndexByKey(key);
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex += 1) {
          const cellElement = this._rowsView._getCellElement(rowIndex, columnIndex);
          cellElement?.removeClass(CLASSES.cellModified);
        }
      });
    }
  }

  protected _prepareChange(
    options: EditorCellOptions,
    value: unknown,
    text?: string,
  ): DeferredObj<EditingChangeParams> {
    const $cellElement = $(options.cellElement);

    if (this.getEditMode() === EDIT_MODE.batch && options.key !== undefined) {
      this._applyModified($cellElement, options);
    }

    return super._prepareChange(options, value, text);
  }

  protected _cancelSaving(saveDeferred: DeferredObj<unknown>): void {
    const editMode = this.getEditMode();

    if (isCellBasedEditMode(editMode)) {
      if (editMode === EDIT_MODE.batch) {
        this._resetEditIndices();
      }

      this._dataController.updateItems();
    }

    super._cancelSaving(saveDeferred);
  }

  public optionChanged(args: OptionChanged): void {
    const { fullName } = args;

    if (args.name === 'editing' && fullName === EDITING_EDITCOLUMNNAME_OPTION_NAME) {
      this._handleEditColumnNameChange(args);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }

  private _editCellFromOptionChanged(
    columnIndex: number,
    oldColumnIndex: number,
    oldRowIndex: number,
  ): void {
    const columns = this._columnsController.getVisibleColumns();

    if (columnIndex > -1) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      deferRender(() => {
        this._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
      });
    }
  }

  protected _handleEditRowKeyChange(args: OptionChanged): void {
    if (isCellBasedEditMode(this.getEditMode())) {
      const columnIndex = this._getVisibleEditColumnIndex();
      const oldRowIndexCorrection = this._getEditRowIndexCorrection();
      const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue)
        + oldRowIndexCorrection;

      if (isDefined(args.value) && args.value !== args.previousValue) {
        this._editCellFromOptionChanged?.(columnIndex, columnIndex, oldRowIndex);
      }
    } else {
      super._handleEditRowKeyChange(args);
    }
  }

  protected deleteRow(rowIndex: number): void {
    if (this.getEditMode() === EDIT_MODE.cell && this.isEditing()) {
      const { isNewRow } = this._dataController.items()[rowIndex];
      const rowKey = this._dataController.getKeyByRowIndex(rowIndex);

      // T850905
      this.closeEditCell(null, isNewRow).always(() => {
        const currentRowIndex = this._dataController.getRowIndexByKey(rowKey);
        this._checkAndDeleteRow(currentRowIndex);
      });
    } else {
      super.deleteRow(rowIndex);
    }
  }

  protected _checkAndDeleteRow(rowIndex: number): void {
    if (this.getEditMode() === EDIT_MODE.batch) {
      this._deleteRowCore(rowIndex);
    } else {
      super._checkAndDeleteRow(rowIndex);
    }
  }

  protected _refreshCore(params?: RefreshOptions): void {
    const { isPageChanged } = params ?? {};
    const editMode = this.getEditMode();
    const needResetIndexes = editMode === EDIT_MODE.batch
      || (isPageChanged && this.option('scrolling.mode') !== 'virtual');

    if (isCellBasedEditMode(editMode)) {
      if (needResetIndexes) {
        this._resetEditColumnName();
        this._resetEditRowKey();
      }
    } else {
      super._refreshCore(params);
    }
  }

  protected _allowRowAdding(): boolean {
    if (this.getEditMode() === EDIT_MODE.batch) {
      return true;
    }

    return super._allowRowAdding();
  }

  protected _afterDeleteRow(rowIndex: number, oldEditRowIndex: number): DeferredObj<unknown> {
    const dataController = this._dataController;

    if (this.getEditMode() === EDIT_MODE.batch) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, rowIndex],
      });

      return Deferred<unknown>().resolve();
    }

    return super._afterDeleteRow(rowIndex, oldEditRowIndex);
  }

  protected _updateEditRow(
    row: ProcessedItem,
    forceUpdateRow?: boolean,
    isCustomSetCellValue?: boolean,
  ): void {
    if (isCellBasedEditMode(this.getEditMode())) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      super._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
    }
  }

  protected _isDefaultButtonVisible(
    button: InternalColumnButton,
    options: EditorCellOptions,
  ): boolean {
    const editMode = this.getEditMode();

    if (isCellBasedEditMode(editMode)) {
      const isBatchMode = editMode === EDIT_MODE.batch;

      switch (button.name) {
        case 'save':
        case 'cancel':
        case 'edit':
          return false;
        case 'delete':
          return super._isDefaultButtonVisible(button, options)
            && (!isBatchMode || !options.row?.removed);
        case 'undelete':
          // @ts-expect-error removed is undefined for a row that isn't removed
          return isBatchMode && this.allowDeleting(options) && options.row?.removed;
        default:
          return super._isDefaultButtonVisible(button, options);
      }
    }

    return super._isDefaultButtonVisible(button, options);
  }

  protected _beforeEndSaving(changes: EditingChange[]): void {
    const editMode = this.getEditMode();

    if (editMode === EDIT_MODE.cell) {
      if (changes[0]?.type !== 'update') {
        super._beforeEndSaving(changes);
      }
    } else {
      if (editMode === EDIT_MODE.batch) {
        this._resetModifiedClassCells(changes);
      }
      super._beforeEndSaving(changes);
    }
  }

  public prepareEditButtons(headerPanel: HeaderPanel): ToolbarItem[] {
    const editingOptions: EditingOptions = this.option('editing') ?? {};
    const buttonItems = super.prepareEditButtons(headerPanel);
    const needEditingButtons = !!editingOptions.allowUpdating
      || !!editingOptions.allowAdding
      || editingOptions.allowDeleting;

    if (needEditingButtons && this.getEditMode() === EDIT_MODE.batch) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'save', 'saveEditData', 21));
      buttonItems.push(this.prepareButtonItem(headerPanel, 'revert', 'cancelEditData', 22));
    }

    return buttonItems;
  }

  protected _saveEditDataInner(): DeferredObj<unknown> {
    const editRow = this._dataController.getVisibleRows()[this.getEditRowIndex()];
    const editColumn = this._getEditColumn();
    const showEditorAlways = editColumn?.showEditorAlways;
    const isUpdateInCellMode = this.getEditMode() === EDIT_MODE.cell && !editRow?.isNewRow;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
    let deferred: DeferredObj<unknown> | undefined;

    if (isUpdateInCellMode && showEditorAlways) {
      deferred = Deferred<unknown>();
      this.addDeferred(deferred);
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    return super._saveEditDataInner().always(deferred?.resolve);
  }

  protected _applyChange(
    options: EditorCellOptions,
    params: EditingChangeParams,
    forceUpdateRow?: boolean,
  ): DeferredObj<unknown> | undefined {
    const { row } = options;
    const isUpdateInCellMode = this.getEditMode() === EDIT_MODE.cell && row && !row.isNewRow;
    const { showEditorAlways } = options.column;
    const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
    const focusPreviousEditingCell = showEditorAlways
      && !forceUpdateRow
      && isUpdateInCellMode
      && this.hasEditData()
      && !this.isEditCell(options.rowIndex, options.columnIndex);

    if (focusPreviousEditingCell) {
      this._focusEditingCell();
      this._updateEditRow(row, true, isCustomSetCellValue);
      return undefined;
    }

    return super._applyChange(options, params, forceUpdateRow);
  }

  protected _applyChangeCore(
    options: EditorCellOptions,
    forceUpdateRow?: boolean,
  ): DeferredObj<unknown> | undefined {
    const { showEditorAlways } = options.column;
    const { row } = options;
    const editMode = this.getEditMode();
    const isUpdateInCellMode = editMode === EDIT_MODE.cell && row && !row.isNewRow;

    if (showEditorAlways && !forceUpdateRow) {
      if (isUpdateInCellMode) {
        this._setEditRowKey(row.key, true);
        this._setEditColumnNameByIndex(options.columnIndex, true);

        return this.saveEditData();
      } if (editMode === EDIT_MODE.batch) {
        const needUpdateRow = this._needUpdateRow(options.column);

        return super._applyChangeCore(options, needUpdateRow);
      }
    }

    return super._applyChangeCore(options, forceUpdateRow);
  }

  protected _processDataItemCore(
    item: GeneratedItem,
    change: EditingChange,
    key: RowKey,
    columns: Column[],
  ): void {
    const { data, type } = change;

    if (this.getEditMode() === EDIT_MODE.batch && type === DATA_CHANGE_TYPE.remove) {
      item.data = createObjectWithChanges(item.data, data);
    }

    super._processDataItemCore(item, change, key, columns);
  }

  protected _processRemoveCore(
    changes: EditingChange[],
    editIndex: number,
    processIfBatch: boolean,
  ): boolean {
    if (this.getEditMode() === EDIT_MODE.batch && !processIfBatch) {
      return false;
    }

    return super._processRemoveCore(changes, editIndex, processIfBatch);
  }

  public _processRemoveIfError(changes: EditingChange[], editIndex: number): boolean {
    if (this.getEditMode() === EDIT_MODE.batch) {
      return false;
    }

    return super._processRemoveIfError(changes, editIndex);
  }

  protected _beforeFocusElementInRow(rowIndex: number): void {
    super._beforeFocusElementInRow(rowIndex);

    const editRowIndex = rowIndex >= 0 ? rowIndex : 0;
    const columnIndex = this.getFirstEditableColumnIndex();
    if (columnIndex !== undefined && columnIndex >= 0) {
      this.editCell(editRowIndex, columnIndex);
    }
  }
};

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class RowsViewEditingCellBasedExtender extends Base {
  public _editingController!: CellBasedEditingController;

  protected _createTable(columns?: Column[], isAppend?: boolean): dxElementWrapper {
    const $table = super._createTable(columns, isAppend);
    const isCellOrBatchEditMode = isCellBasedEditMode(this._editingController.getEditMode());
    const allowUpdating = this.option('editing.allowUpdating');

    if (isCellOrBatchEditMode && allowUpdating) {
      eventsEngine.on(
        $table,
        addNamespace(holdEvent.name, 'dxDataGridRowsView'),
        `td:not(.${CLASSES.editorCell})`,
        this.createAction(() => {
          if (this._editingController.isEditing()) {
            this._editingController.closeEditCell();
          }
        }),
      );
    }

    return $table;
  }

  protected _createRow(row?: ProcessedItem, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (row) {
      const isRowRemoved = !!row.removed;

      if (this._editingController.getEditMode() === EDIT_MODE.batch) {
        if (isRowRemoved) {
          $row.addClass(CLASSES.rowRemoved);
        }
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
