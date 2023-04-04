import { Controllers, ViewController, Views } from './ui.grid_core.modules';

interface State {
  _columnsController: Controllers['columns'];
  _dataController: Controllers['data'];
  _rowsView: Views['rowsView'];
  _keyboardNavigationController: Controllers['keyboardNavigation'];
  _adaptiveController: Controllers['adaptiveColumns'];

  _lastOperation: any;
  _changes: any;
  _deferreds: any;
  _dataChangedHandler: any;
  _saveEditorHandler: any;
  _internalState: any;
  _inputFocusTimeoutID: any;
  _pointerUpEditorHandler: any;
  _pointerDownEditorHandler: any;
  _pageIndex: any;
  _needFocusEditor: any;
  _beforeFocusCallback: any;
  _editCellInProgress: any;
  _saving: any;
  _editForm: any;
  _isForceRowAdaptiveExpand: any;

  // private flag for refocus edit cell after data source reload
  // for details see these issues:
  // remote DataSource: https://supportcenter.devexpress.com/internal/ticket/details/T1037019
  // local DataSource: https://supportcenter.devexpress.com/internal/ticket/details/T1154721
  _refocusEditCell: boolean;
}

export interface EditingController extends ViewController, State {
  getEditMode: (this: this) => any;

  _getDefaultEditorTemplate: (this: this) => any;

  _getNewRowPosition: (this: this) => any;

  getChanges: (this: this) => any;

  getInsertRowCount: (this: this) => any;

  resetChanges: (this: this) => any;

  _getInternalData: (this: this, key) => any;

  _addInternalData: (this: this, params) => any;

  _getOldData: (this: this, key) => any;

  getUpdatedData: (this: this, data) => any;

  getInsertedData: (this: this) => any;

  getRemovedData: (this: this) => any;

  _fireDataErrorOccurred: (this: this, arg) => any;

  _needToCloseEditableCell: (this: this, ...args: any[]) => any;

  _closeEditItem: (this: this, ...args: any[]) => any;

  _handleDataChanged: (this: this, ...args: any[]) => any;

  _isDefaultButtonVisible: (this: this, button, options) => any;

  _isButtonVisible: (this: this, button, options) => any;

  _isButtonDisabled: (this: this, button, options) => any;

  _getButtonConfig: (this: this, button, options) => any;

  _getEditingButtons: (this: this, options) => any;

  _renderEditingButtons: (this: this, $container, buttons, options, change?) => any;

  _getEditCommandCellTemplate: (this: this) => any;

  isRowBasedEditMode: (this: this) => any;

  getFirstEditableColumnIndex: (this: this) => any;

  getFirstEditableCellInRow: (this: this, rowIndex) => any;

  getFocusedCellInRow: (this: this, rowIndex) => any;

  getIndexByKey: (this: this, key, items) => any;

  hasChanges: (this: this, rowIndex?) => any;

  dispose: (this: this) => any;

  _silentOption: (this: this, name, value) => any;

  _handleEditRowKeyChange: (this: this, args) => any;

  _handleChangesChange: (this: this, args) => any;

  publicMethods: (this: this) => any;

  refresh: (this: this, options?) => any;

  _refreshCore: any;

  isEditing: (this: this) => any;

  isEditRow: (this: this, rowIndex) => any;

  _setEditRowKey: (this: this, value, silent?) => any;

  _setEditRowKeyByIndex: (this: this, rowIndex, silent) => any;

  getEditRowIndex: (this: this) => any;

  getEditFormRowIndex: (this: this) => any;

  isEditRowByIndex: (this: this, rowIndex) => any;

  isEditCell: (this: this, visibleRowIndex, columnIndex) => any;

  getPopupContent: any;

  _isProcessedItem: (this: this, item) => any;

  _getInsertRowIndex: (this: this, items, change, isProcessedItems) => any;

  _generateNewItem: (this: this, key) => any;

  _getLoadedRowIndex: (this: this, items, change, isProcessedItems?) => any;

  processItems: (this: this, items, e) => any;

  processDataItem: (this: this, item, options, generateDataValues) => any;

  _processDataItemCore: (this: this, item, change, key, columns, generateDataValues) => any;

  _initNewRow: (this: this, options, parentKey?) => any;

  _createInsertInfo: (this: this) => any;

  _addInsertInfo: (this: this, change, parentKey?) => any;

  _setInsertAfterOrBeforeKey: (this: this, change, parentKey) => any;

  _getInsertIndex: (this: this) => any;

  _getInsertAfterOrBeforeKey: (this: this, insertChange) => any;

  _getPageIndexToInsertRow: (this: this) => any;

  addRow: (this: this, parentKey) => any;

  _addRow: (this: this, parentKey) => any;

  _allowRowAdding: (this: this) => any;

  _addRowCore: (this: this, data, parentKey, initialOldEditRowIndex) => any;

  _navigateToNewRow: (this: this, oldEditRowIndex, change?, editRowIndex?) => any;

  _showAddedRow: (this: this, rowIndex) => any;

  _beforeFocusElementInRow: any;

  _focusFirstEditableCellInRow: (this: this, rowIndex) => any;

  _isEditingStart: (this: this, options) => any;

  _beforeUpdateItems: (this: this, ...args: any[]) => any;

  _getVisibleEditColumnIndex: (this: this) => any;

  _setEditColumnNameByIndex: (this: this, index, silent) => any;

  _setEditColumnName: (this: this, name, silent) => any;

  _resetEditColumnName: (this: this) => any;

  _getEditColumn: (this: this) => any;

  _getColumnByName: (this: this, name) => any;

  _getVisibleEditRowIndex: (this: this, columnName?) => any;

  _getEditRowIndexCorrection: (this: this, columnName?) => any;

  _resetEditRowKey: (this: this) => any;

  _resetEditIndices: (this: this) => any;

  editRow: (this: this, rowIndex) => any;

  _editRowFromOptionChanged: (this: this, rowIndex, oldRowIndex) => any;

  _editRowFromOptionChangedCore: (this: this, rowIndices, rowIndex, preventRendering?) => any;

  _focusEditorIfNeed: any;

  _showEditPopup: any;

  _repaintEditPopup: any;

  _getEditPopupHiddenHandler: (this: this) => any;

  _getPopupEditFormTemplate: any;

  _getSaveButtonConfig: (this: this) => any;

  _getCancelButtonConfig: (this: this) => any;

  _removeInternalData: (this: this, key) => any;

  _updateInsertAfterOrBeforeKeys: (this: this, changes, index) => any;

  _removeChange: (this: this, index) => any;

  executeOperation: (this: this, deferred, func) => any;

  waitForDeferredOperations: (this: this) => any;

  _processCanceledEditingCell: (this: this, ...args: any[]) => any;

  _repaintEditCell: (this: this, column, oldColumn, oldEditRowIndex) => any;

  _delayedInputFocus: (this: this, $cell, beforeFocusCallback, callBeforeFocusCallbackAlways?) => any;

  _focusEditingCell: (this: this, beforeFocusCallback?, $editCell?, callBeforeFocusCallbackAlways?) => any;

  deleteRow: (this: this, rowIndex) => any;

  _checkAndDeleteRow: (this: this, rowIndex) => any;

  _deleteRowCore: (this: this, rowIndex) => any;

  _afterDeleteRow: (this: this, rowIndex, oldEditRowIndex) => any;

  undeleteRow: (this: this, rowIndex) => any;

  _fireOnSaving: (this: this) => any;

  _executeEditingAction: (this: this, actionName, params, func) => any;

  _processChanges: (this: this, deferreds, results, dataChanges, changes) => any;

  _processRemoveIfError: (this: this, changes, editIndex) => any;

  _processRemove: (this: this, changes, editIndex, cancel) => any;

  _processRemoveCore: (this: this, ...args: any[]) => any;

  _processSaveEditDataResult: (this: this, results) => any;

  _fireSaveEditDataEvents: (this: this, changes) => any;

  saveEditData: (this: this) => any;

  _resolveAfterSave: (this: this, deferred, options?) => any;

  _saveEditDataInner: (this: this) => any;

  _beforeEndSaving: (this: this, changes) => any;

  _endSaving: (this: this, dataChanges, changes, deferred) => any;

  _cancelSaving: (this: this, result) => any;

  _refreshDataAfterSave: (this: this, dataChanges, changes, deferred) => any;

  isSaving: (this: this) => any;

  _updateEditColumn: (this: this) => any;

  _isEditColumnVisible: (this: this) => any;

  _isEditButtonDisabled: (this: this) => any;

  _updateEditButtons: (this: this) => any;

  _applyModified: (this: this, $element) => any;

  _beforeCloseEditCellInBatchMode: (this: this, ...args: any[]) => any;

  cancelEditData: (this: this) => any;

  _cancelEditDataCore: (this: this) => any;

  _afterCancelEditData: (this: this, rowIndex) => any;

  _hideEditPopup: (this: this, ...args: any[]) => any;

  hasEditData: (this: this) => any;

  update: (this: this, changeType) => any;

  _getRowIndicesForCascadeUpdating: (this: this, row, skipCurrentRow) => any;

  addDeferred: (this: this, deferred) => any;

  _prepareChange: (this: this, options, value, text) => any;

  _updateRowValues: (this: this, options) => any;

  updateFieldValue: (this: this, options, value, text, forceUpdateRow?) => any;

  _focusPreviousEditingCellIfNeed: (this: this, options) => any;

  _needUpdateRow: (this: this, column) => any;

  _applyChange: (this: this, options, params, forceUpdateRow) => any;

  _applyChangeCore: (this: this, options, forceUpdateRow) => any;

  _updateEditRowCore: (this: this, row, skipCurrentRow, isCustomSetCellValue) => any;

  _updateEditRow: (this: this, row, forceUpdateRow, isCustomSetCellValue?) => any;

  _updateRowImmediately: (this: this, row, forceUpdateRow, isCustomSetCellValue) => any;

  _updateRowWithDelay: (this: this, row, isCustomSetCellValue) => any;

  _validateEditFormAfterUpdate: (this: this, ...args: any[]) => any;

  _addChange: (this: this, changeParams, options?) => any;

  _getFormEditItemTemplate: (this: this, cellOptions, column) => any;

  getColumnTemplate: (this: this, options) => any;

  _createButton: (this: this, $container, button, options, change) => any;

  getButtonLocalizationNames: (this: this) => any;

  prepareButtonItem: (this: this, headerPanel, name, methodName, sortIndex) => any;

  prepareEditButtons: (this: this, headerPanel) => any;

  highlightDataCell: (this: this, $cell, params) => any;

  _afterInsertRow: (this: this, ...args: any[]) => any;

  _beforeSaveEditData: (this: this, change?, index?) => any;

  _afterSaveEditData: (this: this, ...args: any[]) => any;

  _beforeCancelEditData: (this: this, ...args: any[]) => any;

  _allowEditAction: (this: this, actionName, options) => any;

  allowUpdating: (this: this, options, eventName?) => any;

  allowDeleting: (this: this, options) => any;

  isCellModified: (this: this, parameters) => any;

  isNewRowInEditMode: (this: this) => any;

  shouldHighlightCell: (this: this, parameters) => any;

  getEditFormTemplate: (this: this, parameters) => any;

  editCell: (this: this, ...args: any[]) => any;

  closeEditCell: (this: this, ...args: any[]) => any;

  _isRowEditMode: (this: this, ...args: any[]) => any;

  isRowEditMode: (this: this, ...args: any[]) => any;

  _collapseAdaptiveDetailRow: (this: this, ...args: any[]) => any;

  _cancelEditAdaptiveDetailRow: (this: this, ...args: any[]) => any;

  isCellOrBatchEditMode: (this: this, ...args: any[]) => any;
}
