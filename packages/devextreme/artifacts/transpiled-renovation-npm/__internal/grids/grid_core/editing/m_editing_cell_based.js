"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editingCellBasedModule = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred2 = require("../../../../core/utils/deferred");
var _dom = require("../../../../core/utils/dom");
var _type = require("../../../../core/utils/type");
var _array_utils = require("../../../../data/array_utils");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _hold = _interopRequireDefault(require("../../../../events/hold"));
var _pointer = _interopRequireDefault(require("../../../../events/pointer"));
var _index = require("../../../../events/utils/index");
var _const = require("./const");
var _m_editing_utils = require("./m_editing_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const editingControllerExtender = Base => class CellBasedEditingControllerExtender extends Base {
  init() {
    const needCreateHandlers = !this._saveEditorHandler;
    super.init();
    if (needCreateHandlers) {
      // chrome 73+
      let $pointerDownTarget;
      let isResizing;
      this._pointerUpEditorHandler = () => {
        var _this$_columnsResizer;
        isResizing = (_this$_columnsResizer = this._columnsResizerController) === null || _this$_columnsResizer === void 0 ? void 0 : _this$_columnsResizer.isResizing();
      };
      // eslint-disable-next-line no-return-assign
      this._pointerDownEditorHandler = e => $pointerDownTarget = (0, _renderer.default)(e.target);
      this._saveEditorHandler = this.createAction(function (e) {
        const {
          event
        } = e;
        const $target = (0, _renderer.default)(event.target);
        const targetComponent = event[_const.TARGET_COMPONENT_NAME];
        const {
          component
        } = this;
        if ((0, _m_editing_utils.isEditable)($pointerDownTarget) && !$pointerDownTarget.is($target)) {
          return;
        }
        function checkEditorPopup($element) {
          if (!$element) {
            return false;
          }
          const $dropDownEditorOverlay = $element.closest(`.${_const.DROPDOWN_EDITOR_OVERLAY_CLASS}`);
          const $componentElement = component.$element();
          return $dropDownEditorOverlay.length > 0 && $componentElement.closest($dropDownEditorOverlay).length === 0;
        }
        if (this.isCellOrBatchEditMode() && !this._editCellInProgress) {
          const isEditorPopup = checkEditorPopup($target) || checkEditorPopup(targetComponent === null || targetComponent === void 0 ? void 0 : targetComponent.$element());
          const isAnotherComponent = targetComponent && !targetComponent._disposed && targetComponent !== this.component;
          const isAddRowButton = !!$target.closest(`.${this.addWidgetPrefix(_const.ADD_ROW_BUTTON_CLASS)}`).length;
          const isFocusOverlay = $target.hasClass(this.addWidgetPrefix(_const.FOCUS_OVERLAY_CLASS));
          const isCellEditMode = this.isCellEditMode();
          if (!isResizing && !isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && this.isEditing()) && ((0, _dom.isElementInDom)($target) || isAnotherComponent)) {
            this._closeEditItem.bind(this)($target);
          }
        }
      });
      _events_engine.default.on(_dom_adapter.default.getDocument(), _pointer.default.up, this._pointerUpEditorHandler);
      _events_engine.default.on(_dom_adapter.default.getDocument(), _pointer.default.down, this._pointerDownEditorHandler);
      _events_engine.default.on(_dom_adapter.default.getDocument(), _click.name, this._saveEditorHandler);
    }
  }
  isCellEditMode() {
    return this.option('editing.mode') === _const.EDIT_MODE_CELL;
  }
  isBatchEditMode() {
    return this.option('editing.mode') === _const.EDIT_MODE_BATCH;
  }
  /**
   * interface override
   */
  isCellOrBatchEditMode() {
    return this.isCellEditMode() || this.isBatchEditMode();
  }
  _needToCloseEditableCell($targetElement) {
    const $element = this.component.$element();
    let result = this.isEditing();
    const isCurrentComponentElement = !$element || !!$targetElement.closest($element).length;
    if (isCurrentComponentElement) {
      const isDataRow = $targetElement.closest(`.${_const.DATA_ROW_CLASS}`).length;
      if (isDataRow) {
        const $targetCell = $targetElement.closest(`.${_const.ROW_CLASS}> td`);
        const rowIndex = this._rowsView.getRowIndex($targetCell.parent());
        const cellElements = this._rowsView.getCellElements(rowIndex);
        if (cellElements !== null && cellElements !== void 0 && cellElements.length) {
          var _visibleColumns$colum;
          const columnIndex = cellElements.index($targetCell);
          const visibleColumns = this._columnsController.getVisibleColumns();
          // TODO jsdmitry: Move this code to _rowClick method of rowsView
          const allowEditing = (_visibleColumns$colum = visibleColumns[columnIndex]) === null || _visibleColumns$colum === void 0 ? void 0 : _visibleColumns$colum.allowEditing;
          const isEditingCell = this.isEditCell(rowIndex, columnIndex);
          result = result && !allowEditing && !isEditingCell;
        }
      }
    }
    return result || super._needToCloseEditableCell($targetElement);
  }
  _closeEditItem($targetElement) {
    if (this._needToCloseEditableCell($targetElement)) {
      this.closeEditCell();
    }
  }
  _focusEditorIfNeed() {
    if (this._needFocusEditor && this.isCellOrBatchEditMode()) {
      var _this$_rowsView;
      const editColumnIndex = this._getVisibleEditColumnIndex();
      const $cell = (_this$_rowsView = this._rowsView) === null || _this$_rowsView === void 0 ? void 0 : _this$_rowsView._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex); // T319885
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
  isEditing() {
    if (this.isCellOrBatchEditMode()) {
      const isEditRowKeyDefined = (0, _type.isDefined)(this.option(_const.EDITING_EDITROWKEY_OPTION_NAME));
      const isEditColumnNameDefined = (0, _type.isDefined)(this.option(_const.EDITING_EDITCOLUMNNAME_OPTION_NAME));
      return isEditRowKeyDefined && isEditColumnNameDefined;
    }
    return super.isEditing();
  }
  _handleEditColumnNameChange(args) {
    const oldRowIndex = this._getVisibleEditRowIndex(args.previousValue);
    if (this.isCellOrBatchEditMode() && oldRowIndex !== -1 && (0, _type.isDefined)(args.value) && args.value !== args.previousValue) {
      const columnIndex = this._columnsController.getVisibleColumnIndex(args.value);
      const oldColumnIndex = this._columnsController.getVisibleColumnIndex(args.previousValue);
      this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
    }
  }
  _addRow(parentKey) {
    if (this.isCellEditMode() && this.hasChanges()) {
      // @ts-expect-error
      const deferred = new _deferred2.Deferred();
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
  editCell(rowIndex, columnIndex) {
    return this._editCell({
      rowIndex,
      columnIndex
    });
  }
  _editCell(options) {
    // @ts-expect-error
    const d = new _deferred2.Deferred();
    let coreResult;
    this.executeOperation(d, () => {
      coreResult = this._editCellCore(options);
      (0, _deferred2.when)(coreResult).done(d.resolve).fail(d.reject);
    });
    return coreResult !== undefined ? coreResult : d.promise();
  }
  _editCellCore(options) {
    const dataController = this._dataController;
    const isEditByOptionChanged = (0, _type.isDefined)(options.oldColumnIndex) || (0, _type.isDefined)(options.oldRowIndex);
    const {
      columnIndex,
      rowIndex,
      column,
      item
    } = this._getNormalizedEditCellOptions(options);
    const params = {
      data: item === null || item === void 0 ? void 0 : item.data,
      cancel: false,
      column
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
      return (0, _deferred2.when)(this._beforeEditCell(rowIndex, columnIndex, item)).done(cancel => {
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
  _beforeEditCell(rowIndex, columnIndex, item) {
    if (this.isCellEditMode() && !item.isNewRow && this.hasChanges()) {
      // @ts-expect-error
      const isSaving = new _deferred2.Deferred();
      this.saveEditData().always(() => {
        isSaving.resolve(this.hasChanges());
      });
      this.addDeferred(isSaving);
      return isSaving;
    }
    return false;
  }
  publicMethods() {
    const publicMethods = super.publicMethods();
    return publicMethods.concat(['editCell', 'closeEditCell']);
  }
  _getNormalizedEditCellOptions(_ref) {
    let {
      oldColumnIndex,
      oldRowIndex,
      columnIndex,
      rowIndex
    } = _ref;
    const columnsController = this._columnsController;
    const visibleColumns = columnsController.getVisibleColumns();
    const items = this._dataController.items();
    const item = items[rowIndex];
    let oldColumn;
    if ((0, _type.isDefined)(oldColumnIndex)) {
      oldColumn = visibleColumns[oldColumnIndex];
    } else {
      oldColumn = this._getEditColumn();
    }
    if (!(0, _type.isDefined)(oldRowIndex)) {
      oldRowIndex = this._getVisibleEditRowIndex();
    }
    if ((0, _type.isString)(columnIndex)) {
      columnIndex = columnsController.columnOption(columnIndex, 'index');
      columnIndex = columnsController.getVisibleIndex(columnIndex);
    }
    const column = visibleColumns[columnIndex];
    return {
      oldColumn,
      columnIndex,
      oldRowIndex,
      rowIndex,
      column,
      item
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prepareEditCell(params, item, editColumnIndex, editRowIndex) {
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
        oldData: item.oldData ?? item.data
      });
    }
    return true;
  }
  /**
   * interface override
   */
  closeEditCell(isError, withoutSaveEditData) {
    let result = (0, _deferred2.when)();
    const oldEditRowIndex = this._getVisibleEditRowIndex();
    if (this.isCellOrBatchEditMode()) {
      // @ts-expect-error
      const deferred = new _deferred2.Deferred();
      // @ts-expect-error
      result = new _deferred2.Deferred();
      this.executeOperation(deferred, () => {
        this._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData).always(result.resolve);
      });
    }
    return result.promise();
  }
  _closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData) {
    const dataController = this._dataController;
    // @ts-expect-error
    const deferred = new _deferred2.Deferred();
    const promise = deferred.promise();
    if (this.isCellEditMode() && this.hasChanges()) {
      if (!withoutSaveEditData) {
        this.saveEditData().done(error => {
          if (!this.hasChanges()) {
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
        this._beforeCloseEditCellInBatchMode(rowIndices);
        if (!isError) {
          dataController.updateItems({
            changeType: 'update',
            rowIndices
          });
        }
      }
    }
    deferred.resolve();
    return promise;
  }
  _resetModifiedClassCells(changes) {
    if (this.isBatchEditMode()) {
      const columnsCount = this._columnsController.getVisibleColumns().length;
      changes.forEach(_ref2 => {
        let {
          key
        } = _ref2;
        const rowIndex = this._dataController.getRowIndexByKey(key);
        for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
          const cellElement = this._rowsView._getCellElement(rowIndex, columnIndex);
          cellElement === null || cellElement === void 0 || cellElement.removeClass(_const.CELL_MODIFIED_CLASS);
        }
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prepareChange(options, value, text) {
    const $cellElement = (0, _renderer.default)(options.cellElement);
    if (this.isBatchEditMode() && options.key !== undefined) {
      this._applyModified($cellElement, options);
    }
    return super._prepareChange(options, value, text);
  }
  _cancelSaving(result) {
    const dataController = this._dataController;
    if (this.isCellOrBatchEditMode()) {
      if (this.isBatchEditMode()) {
        this._resetEditIndices();
      }
      dataController.updateItems();
    }
    super._cancelSaving(result);
  }
  optionChanged(args) {
    const {
      fullName
    } = args;
    if (args.name === 'editing' && fullName === _const.EDITING_EDITCOLUMNNAME_OPTION_NAME) {
      this._handleEditColumnNameChange(args);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
  _editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex) {
    const columns = this._columnsController.getVisibleColumns();
    if (columnIndex > -1) {
      (0, _common.deferRender)(() => {
        this._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
      });
    }
  }
  _handleEditRowKeyChange(args) {
    if (this.isCellOrBatchEditMode()) {
      const columnIndex = this._getVisibleEditColumnIndex();
      const oldRowIndexCorrection = this._getEditRowIndexCorrection();
      const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;
      if ((0, _type.isDefined)(args.value) && args.value !== args.previousValue) {
        var _this$_editCellFromOp;
        (_this$_editCellFromOp = this._editCellFromOptionChanged) === null || _this$_editCellFromOp === void 0 || _this$_editCellFromOp.call(this, columnIndex, columnIndex, oldRowIndex);
      }
    } else {
      super._handleEditRowKeyChange(args);
    }
  }
  deleteRow(rowIndex) {
    if (this.isCellEditMode() && this.isEditing()) {
      const {
        isNewRow
      } = this._dataController.items()[rowIndex];
      const rowKey = this._dataController.getKeyByRowIndex(rowIndex);
      // T850905
      this.closeEditCell(null, isNewRow).always(() => {
        rowIndex = this._dataController.getRowIndexByKey(rowKey);
        this._checkAndDeleteRow(rowIndex);
      });
    } else {
      super.deleteRow(rowIndex);
    }
  }
  _checkAndDeleteRow(rowIndex) {
    if (this.isBatchEditMode()) {
      this._deleteRowCore(rowIndex);
    } else {
      super._checkAndDeleteRow(rowIndex);
    }
  }
  _refreshCore(params) {
    const {
      isPageChanged
    } = params ?? {};
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
  _allowRowAdding(params) {
    if (this.isBatchEditMode()) {
      return true;
    }
    return super._allowRowAdding(params);
  }
  _afterDeleteRow(rowIndex, oldEditRowIndex) {
    const dataController = this._dataController;
    if (this.isBatchEditMode()) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [oldEditRowIndex, rowIndex]
      });
      // @ts-expect-error
      return new _deferred2.Deferred().resolve();
    }
    return super._afterDeleteRow(rowIndex, oldEditRowIndex);
  }
  _updateEditRow(row, forceUpdateRow, isCustomSetCellValue) {
    if (this.isCellOrBatchEditMode()) {
      this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
    } else {
      super._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
    }
  }
  _isDefaultButtonVisible(button, options) {
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
  _isRowDeleteAllowed() {
    const callBaseResult = super._isRowDeleteAllowed();
    return callBaseResult || this.isBatchEditMode();
  }
  _beforeEndSaving(changes) {
    if (this.isCellEditMode()) {
      var _changes$;
      if (((_changes$ = changes[0]) === null || _changes$ === void 0 ? void 0 : _changes$.type) !== 'update') {
        super._beforeEndSaving(changes);
      }
    } else {
      if (this.isBatchEditMode()) {
        this._resetModifiedClassCells(changes);
      }
      super._beforeEndSaving(changes);
    }
  }
  prepareEditButtons(headerPanel) {
    const editingOptions = this.option('editing') ?? {};
    const buttonItems = super.prepareEditButtons(headerPanel);
    const needEditingButtons = editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting;
    if (needEditingButtons && this.isBatchEditMode()) {
      buttonItems.push(this.prepareButtonItem(headerPanel, 'save', 'saveEditData', 21));
      buttonItems.push(this.prepareButtonItem(headerPanel, 'revert', 'cancelEditData', 22));
    }
    return buttonItems;
  }
  _saveEditDataInner() {
    var _deferred;
    const editRow = this._dataController.getVisibleRows()[this.getEditRowIndex()];
    const editColumn = this._getEditColumn();
    const showEditorAlways = editColumn === null || editColumn === void 0 ? void 0 : editColumn.showEditorAlways;
    const isUpdateInCellMode = this.isCellEditMode() && !(editRow !== null && editRow !== void 0 && editRow.isNewRow);
    let deferred;
    if (isUpdateInCellMode && showEditorAlways) {
      // @ts-expect-error
      deferred = new _deferred2.Deferred();
      this.addDeferred(deferred);
    }
    return super._saveEditDataInner().always((_deferred = deferred) === null || _deferred === void 0 ? void 0 : _deferred.resolve);
  }
  _applyChange(options, params, forceUpdateRow) {
    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
    const {
      showEditorAlways
    } = options.column;
    const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
    const focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex);
    if (focusPreviousEditingCell) {
      this._focusEditingCell();
      this._updateEditRow(options.row, true, isCustomSetCellValue);
      return;
    }
    return super._applyChange(options, params, forceUpdateRow);
  }
  _applyChangeCore(options, forceUpdateRow) {
    const {
      showEditorAlways
    } = options.column;
    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
    if (showEditorAlways && !forceUpdateRow) {
      if (isUpdateInCellMode) {
        this._setEditRowKey(options.row.key, true);
        this._setEditColumnNameByIndex(options.columnIndex, true);
        return this.saveEditData();
      }
      if (this.isBatchEditMode()) {
        forceUpdateRow = this._needUpdateRow(options.column);
        return super._applyChangeCore(options, forceUpdateRow);
      }
    }
    return super._applyChangeCore(options, forceUpdateRow);
  }
  _processDataItemCore(item, change, key, columns, generateDataValues) {
    const {
      data,
      type
    } = change;
    if (this.isBatchEditMode() && type === _const.DATA_EDIT_DATA_REMOVE_TYPE) {
      item.data = (0, _array_utils.createObjectWithChanges)(item.data, data);
    }
    super._processDataItemCore(item, change, key, columns, generateDataValues);
  }
  _processRemoveCore(changes, editIndex, processIfBatch) {
    if (this.isBatchEditMode() && !processIfBatch) {
      return;
    }
    return super._processRemoveCore(changes, editIndex, processIfBatch);
  }
  _processRemoveIfError(changes, editIndex) {
    if (this.isBatchEditMode()) {
      return;
    }
    return super._processRemoveIfError(changes, editIndex);
  }
  _beforeFocusElementInRow(rowIndex) {
    super._beforeFocusElementInRow(rowIndex);
    const editRowIndex = rowIndex >= 0 ? rowIndex : 0;
    const columnIndex = this.getFirstEditableColumnIndex();
    columnIndex >= 0 && this.editCell(editRowIndex, columnIndex);
  }
};
const rowsView = Base => class RowsViewEditingCellBasedExtender extends Base {
  _createTable() {
    const $table = super._createTable.apply(this, arguments);
    const editingController = this._editingController;
    if (editingController.isCellOrBatchEditMode() && this.option('editing.allowUpdating')) {
      _events_engine.default.on($table, (0, _index.addNamespace)(_hold.default.name, 'dxDataGridRowsView'), `td:not(.${_const.EDITOR_CELL_CLASS})`, this.createAction(() => {
        if (editingController.isEditing()) {
          editingController.closeEditCell();
        }
      }));
    }
    return $table;
  }
  _createRow(row) {
    const $row = super._createRow.apply(this, arguments);
    if (row) {
      const editingController = this._editingController;
      const isRowRemoved = !!row.removed;
      // @ts-expect-error
      if (editingController.isBatchEditMode()) {
        isRowRemoved && $row.addClass(_const.ROW_REMOVED);
      }
    }
    return $row;
  }
};
const headerPanel = Base => class HeaderPanelEditingCellBasedExtender extends Base {
  isVisible() {
    const editingOptions = this._editingController.option('editing');
    // @ts-expect-error
    return super.isVisible() || editingOptions && (editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === _const.EDIT_MODE_BATCH;
  }
};
const editingCellBasedModule = exports.editingCellBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender
    },
    views: {
      rowsView,
      headerPanel
    }
  }
};