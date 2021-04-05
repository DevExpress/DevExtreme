import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import { isDefined, isString } from '../../core/utils/type';
import { name as clickEventName } from '../../events/click';
import pointerEvents from '../../events/pointer';
import { addNamespace } from '../../events/utils/index';
import holdEvent from '../../events/hold';
import { when, Deferred } from '../../core/utils/deferred';
import { deferRender } from '../../core/utils/common';
import { createObjectWithChanges } from '../../data/array_utils';
import {
    EDIT_MODE_BATCH,
    EDIT_MODE_CELL,
    TARGET_COMPONENT_NAME,

} from './ui.grid_core.editing_constants';

const FOCUS_OVERLAY_CLASS = 'focus-overlay';
const ADD_ROW_BUTTON_CLASS = 'addrow-button';
const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const ROW_CLASS = 'dx-row';
const CELL_MODIFIED_CLASS = 'dx-cell-modified';
const DATA_ROW_CLASS = 'dx-data-row';
const ROW_REMOVED = 'dx-row-removed';

const EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
const EDITING_EDITCOLUMNNAME_OPTION_NAME = 'editing.editColumnName';

const DATA_EDIT_DATA_REMOVE_TYPE = 'remove';

export default {
    extenders: {
        controllers: {
            editing: {
                init: function() {
                    const needCreateHandlers = !this._saveEditorHandler;

                    this.callBase.apply(this, arguments);

                    if(needCreateHandlers) {
                        // chrome 73+
                        let $pointerDownTarget;
                        let isResizing;
                        this._pointerUpEditorHandler = () => { isResizing = this.getController('columnsResizer')?.isResizing(); };
                        this._pointerDownEditorHandler = e => $pointerDownTarget = $(e.target);
                        this._saveEditorHandler = this.createAction(function(e) {
                            const event = e.event;
                            const $target = $(event.target);
                            const targetComponent = event[TARGET_COMPONENT_NAME];

                            if($pointerDownTarget && $pointerDownTarget.is('input') && !$pointerDownTarget.is($target)) {
                                return;
                            }

                            function checkEditorPopup($element) {
                                return $element && !!$element.closest(`.${DROPDOWN_EDITOR_OVERLAY_CLASS}`).length;
                            }

                            if(this.isCellOrBatchEditMode() && !this._editCellInProgress) {
                                const isEditorPopup = checkEditorPopup($target) || checkEditorPopup(targetComponent?.$element());
                                const isDomElement = !!$target.closest(getWindow().document).length;
                                const isAnotherComponent = targetComponent && !targetComponent._disposed && targetComponent !== this.component;
                                const isAddRowButton = !!$target.closest(`.${this.addWidgetPrefix(ADD_ROW_BUTTON_CLASS)}`).length;
                                const isFocusOverlay = $target.hasClass(this.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
                                const isCellEditMode = this.isCellEditMode();
                                if(!isResizing && !isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && this.isEditing()) && (isDomElement || isAnotherComponent)) {
                                    this._closeEditItem.bind(this)($target);
                                }
                            }
                        });

                        eventsEngine.on(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
                        eventsEngine.on(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
                        eventsEngine.on(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
                    }
                },

                isCellEditMode: function() {
                    return this.option('editing.mode') === EDIT_MODE_CELL;
                },

                isBatchEditMode: function() {
                    return this.option('editing.mode') === EDIT_MODE_BATCH;
                },

                isCellOrBatchEditMode: function() {
                    return this.isCellEditMode() || this.isBatchEditMode();
                },

                _needToCloseEditableCell: function($targetElement) {
                    const $element = this.component.$element();
                    let result = this.isEditing();
                    const isCurrentComponentElement = !$element || !!$targetElement.closest($element).length;

                    if(isCurrentComponentElement) {
                        const isDataRow = $targetElement.closest('.' + DATA_ROW_CLASS).length;

                        if(isDataRow) {
                            const rowsView = this.getView('rowsView');
                            const $targetCell = $targetElement.closest('.' + ROW_CLASS + '> td');
                            const rowIndex = rowsView.getRowIndex($targetCell.parent());
                            const columnIndex = rowsView.getCellElements(rowIndex).index($targetCell);
                            const visibleColumns = this._columnsController.getVisibleColumns();
                            // TODO jsdmitry: Move this code to _rowClick method of rowsView
                            const allowEditing = visibleColumns[columnIndex] && visibleColumns[columnIndex].allowEditing;

                            result = result && !allowEditing && !this.isEditCell(rowIndex, columnIndex);
                        }

                    }

                    return result || this.callBase.apply(this, arguments);
                },

                _closeEditItem: function($targetElement) {
                    if(this._needToCloseEditableCell($targetElement)) {
                        this.closeEditCell();
                    }
                },

                _focusEditorIfNeed: function() {
                    if(this._needFocusEditor && this.isCellOrBatchEditMode()) {
                        const editColumnIndex = this._getVisibleEditColumnIndex();
                        const $cell = this._rowsView?._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex); // T319885

                        if($cell && !$cell.find(':focus').length) {
                            this._focusEditingCell(() => {
                                this._editCellInProgress = false;
                            }, $cell, true);
                        } else {
                            this._editCellInProgress = false;
                        }

                        this._needFocusEditor = false;
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                isEditing: function() {
                    if(this.isCellOrBatchEditMode()) {
                        const isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));
                        const isEditColumnNameDefined = isDefined(this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME));

                        return isEditRowKeyDefined && isEditColumnNameDefined;
                    }

                    return this.callBase.apply(this, arguments);
                },

                _handleEditColumnNameChange: function(args) {
                    const oldRowIndex = this._getVisibleEditRowIndex(args.previousValue);

                    if(this.isCellOrBatchEditMode() && oldRowIndex !== -1 && isDefined(args.value) && args.value !== args.previousValue) {
                        const columnIndex = this._columnsController.getVisibleColumnIndex(args.value);
                        const oldColumnIndex = this._columnsController.getVisibleColumnIndex(args.previousValue);

                        this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
                    }
                },

                _addRow: function(parentKey, deferred) {
                    if(this.isCellEditMode() && this.hasChanges()) {
                        const deferred = new Deferred();

                        this.saveEditData().done(() => {
                            // T804894
                            if(!this.hasChanges()) {
                                this.addRow(parentKey).done(deferred.resolve).fail(deferred.reject);
                            } else {
                                deferred.reject('cancel');
                            }
                        });
                        return deferred.promise();
                    }

                    return this.callBase.apply(this, arguments);
                },

                editCell: function(rowIndex, columnIndex) {
                    return this._editCell({ rowIndex, columnIndex });
                },

                _editCell: function(options) {
                    const d = new Deferred();
                    let coreResult;

                    this.executeOperation(d, () => {
                        coreResult = this._editCellCore(options);
                        when(coreResult)
                            .done(d.resolve)
                            .fail(d.reject);
                    });

                    return coreResult !== undefined ? coreResult : d.promise();
                },

                _editCellCore: function(options) {
                    const dataController = this._dataController;
                    const isEditByOptionChanged = isDefined(options.oldColumnIndex) || isDefined(options.oldRowIndex);
                    const { columnIndex, rowIndex, column, item } = this._getNormalizedEditCellOptions(options);
                    const params = {
                        data: item?.data,
                        cancel: false,
                        column
                    };

                    if(item.key === undefined) {
                        this._dataController.fireError('E1043');
                        return;
                    }

                    if(column && item && (item.rowType === 'data' || item.rowType === 'detailAdaptive') && !item.removed && this.isCellOrBatchEditMode()) {
                        if(!isEditByOptionChanged && this.isEditCell(rowIndex, columnIndex)) {
                            return true;
                        }

                        const editRowIndex = rowIndex + dataController.getRowIndexOffset();

                        return when(this._beforeEditCell(rowIndex, columnIndex, item)).done((cancel) => {
                            if(cancel) {
                                return;
                            }

                            if(!this._prepareEditCell(params, item, columnIndex, editRowIndex)) {
                                this._processCanceledEditingCell();
                            }
                        });
                    }
                    return false;
                },

                _beforeEditCell: function(rowIndex, columnIndex, item) {
                    if(this.isCellEditMode() && !item.isNewRow && this.hasChanges()) {
                        const d = new Deferred();
                        this.saveEditData().always(() => {
                            d.resolve(this.hasChanges());
                        });
                        return d;
                    }
                },

                publicMethods: function() {
                    const publicMethods = this.callBase.apply(this, arguments);

                    return publicMethods.concat(['editCell', 'closeEditCell']);
                },

                _getNormalizedEditCellOptions: function({ oldColumnIndex, oldRowIndex, columnIndex, rowIndex }) {
                    const columnsController = this._columnsController;
                    const visibleColumns = columnsController.getVisibleColumns();
                    const items = this._dataController.items();
                    const item = items[rowIndex];

                    let oldColumn;
                    if(isDefined(oldColumnIndex)) {
                        oldColumn = visibleColumns[oldColumnIndex];
                    } else {
                        oldColumn = this._getEditColumn();
                    }

                    if(!isDefined(oldRowIndex)) {
                        oldRowIndex = this._getVisibleEditRowIndex();
                    }

                    if(isString(columnIndex)) {
                        columnIndex = columnsController.columnOption(columnIndex, 'index');
                        columnIndex = columnsController.getVisibleIndex(columnIndex);
                    }

                    const column = visibleColumns[columnIndex];

                    return { oldColumn, columnIndex, oldRowIndex, rowIndex, column, item };
                },

                _prepareEditCell: function(params, item, editColumnIndex, editRowIndex) {
                    if(!item.isNewRow) {
                        params.key = item.key;
                    }

                    if(this._isEditingStart(params)) {
                        return false;
                    }

                    this._pageIndex = this._dataController.pageIndex();

                    this._setEditRowKey(item.key);
                    this._setEditColumnNameByIndex(editColumnIndex);

                    if(!params.column.showEditorAlways) {
                        this._addInternalData({
                            key: item.key,
                            oldData: item.data
                        });
                    }

                    return true;
                },

                closeEditCell: function(isError, withoutSaveEditData) {
                    let result = when();
                    const oldEditRowIndex = this._getVisibleEditRowIndex();

                    if(this.isCellOrBatchEditMode()) {
                        const deferred = new Deferred();
                        result = new Deferred();
                        this.executeOperation(deferred, () => {
                            this._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData).always(result.resolve);
                        });
                    }

                    return result.promise();
                },

                _closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData) {
                    const dataController = this._dataController;
                    const deferred = new Deferred();
                    const promise = deferred.promise();

                    if(this.isCellEditMode() && this.hasChanges()) {
                        if(!withoutSaveEditData) {
                            this.saveEditData().done((error) => {
                                if(!this.hasChanges()) {
                                    this.closeEditCell(!!error).always(deferred.resolve);
                                    return;
                                }
                                deferred.resolve();
                            });
                            return promise;
                        }
                    } else if(oldEditRowIndex >= 0) {
                        const rowIndices = [oldEditRowIndex];

                        this._resetEditRowKey();
                        this._resetEditColumnName();

                        this._beforeCloseEditCellInBatchMode(rowIndices);
                        if(!isError) {
                            dataController.updateItems({
                                changeType: 'update',
                                rowIndices: rowIndices
                            });
                        }
                    }

                    deferred.resolve();
                    return promise;
                },

                _resetModifiedClassCells: function(changes) {
                    if(this.isBatchEditMode()) {
                        const columnsCount = this._columnsController.getVisibleColumns().length;
                        changes.forEach(({ key }) => {
                            const rowIndex = this._dataController.getRowIndexByKey(key);
                            if(rowIndex !== -1) {
                                for(let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                                    this._rowsView._getCellElement(rowIndex, columnIndex).removeClass(CELL_MODIFIED_CLASS);
                                }
                            }
                        });
                    }
                },

                _prepareChange: function(options, value, text) {
                    const $cellElement = $(options.cellElement);

                    if(this.isBatchEditMode() && options.key !== undefined) {
                        this._applyModified($cellElement, options);
                    }

                    return this.callBase.apply(this, arguments);
                },

                _cancelSaving: function() {
                    const dataController = this._dataController;

                    if(this.isCellOrBatchEditMode()) {
                        if(this.isBatchEditMode()) {
                            this._resetEditIndices();
                        }

                        dataController.updateItems();
                    }

                    this.callBase.apply(this, arguments);
                },

                optionChanged: function(args) {
                    const fullName = args.fullName;

                    if(args.name === 'editing' && fullName === EDITING_EDITCOLUMNNAME_OPTION_NAME) {
                        this._handleEditColumnNameChange(args);
                        args.handled = true;
                    } else {
                        this.callBase(args);
                    }
                },

                _editCellFromOptionChanged: function(columnIndex, oldColumnIndex, oldRowIndex) {
                    const columns = this._columnsController.getVisibleColumns();

                    if(columnIndex > -1) {
                        deferRender(() => {
                            this._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
                        });
                    }
                },

                _handleEditRowKeyChange: function(args) {
                    if(this.isCellOrBatchEditMode()) {
                        const columnIndex = this._getVisibleEditColumnIndex();
                        const oldRowIndexCorrection = this._getEditRowIndexCorrection();
                        const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;

                        if(isDefined(args.value) && args.value !== args.previousValue) {
                            this._editCellFromOptionChanged?.(columnIndex, columnIndex, oldRowIndex);
                        }
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                deleteRow: function(rowIndex) {
                    if(this.isCellEditMode() && this.isEditing()) {
                        const isNewRow = this._dataController.items()[rowIndex].isNewRow;
                        const rowKey = this._dataController.getKeyByRowIndex(rowIndex);

                        // T850905
                        this.closeEditCell(null, isNewRow).always(() => {
                            rowIndex = this._dataController.getRowIndexByKey(rowKey);
                            this._checkAndDeleteRow(rowIndex);
                        });
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                _checkAndDeleteRow: function(rowIndex) {
                    if(this.isBatchEditMode()) {
                        this._deleteRowCore(rowIndex);
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                _refreshCore: function(isPageChanged) {
                    const needResetIndexes = this.isBatchEditMode() || isPageChanged && this.option('scrolling.mode') !== 'virtual';

                    if(this.isCellOrBatchEditMode()) {
                        if(needResetIndexes) {
                            this._resetEditColumnName();
                            this._resetEditRowKey();
                        }
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                _allowRowAdding: function(params) {
                    if(this.isBatchEditMode()) {
                        return true;
                    }

                    return this.callBase.apply(this, arguments);
                },

                _afterDeleteRow: function(rowIndex, oldEditRowIndex) {
                    const dataController = this._dataController;

                    if(this.isBatchEditMode()) {
                        dataController.updateItems({
                            changeType: 'update',
                            rowIndices: [oldEditRowIndex, rowIndex]
                        });
                    } else {
                        return this.callBase.apply(this, arguments);
                    }
                },

                _updateEditRow: function(row, forceUpdateRow, isCustomSetCellValue) {
                    if(this.isCellOrBatchEditMode()) {
                        this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                _isDefaultButtonVisible: function(button, options) {
                    if(this.isCellOrBatchEditMode()) {
                        const isBatchMode = this.isBatchEditMode();

                        switch(button.name) {
                            case 'save':
                            case 'cancel':
                            case 'edit':
                                return false;
                            case 'delete':
                                return this.callBase.apply(this, arguments) && (!isBatchMode || !options.row.removed);
                            case 'undelete':
                                return isBatchMode && this.allowDeleting(options) && options.row.removed;
                            default:
                                return this.callBase.apply(this, arguments);
                        }
                    }

                    return this.callBase.apply(this, arguments);
                },

                _isRowDeleteAllowed: function() {
                    const callBase = this.callBase.apply(this, arguments);

                    return callBase || this.isBatchEditMode();
                },

                _beforeEndSaving: function(changes) {
                    if(this.isCellEditMode()) {
                        if(changes[0]?.type !== 'update') {
                            this.callBase.apply(this, arguments);
                        }
                    } else {
                        if(this.isBatchEditMode()) {
                            this._resetModifiedClassCells(changes);
                        }
                        this.callBase.apply(this, arguments);
                    }
                },

                prepareEditButtons: function(headerPanel) {
                    const editingOptions = this.option('editing') || {};
                    const buttonItems = this.callBase.apply(this, arguments);

                    if((editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting) && this.isBatchEditMode()) {
                        buttonItems.push(this.prepareButtonItem(headerPanel, 'save', 'saveEditData', 21));
                        buttonItems.push(this.prepareButtonItem(headerPanel, 'revert', 'cancelEditData', 22));
                    }

                    return buttonItems;
                },

                _applyChange: function(options, params, forceUpdateRow) {
                    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;
                    const showEditorAlways = options.column.showEditorAlways;
                    const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
                    const focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex);

                    if(focusPreviousEditingCell) {
                        this._focusEditingCell();
                        this._updateEditRow(options.row, true, isCustomSetCellValue);
                        return;
                    }

                    return this.callBase.apply(this, arguments);
                },

                _applyChangeCore: function(options, forceUpdateRow) {
                    const showEditorAlways = options.column.showEditorAlways;
                    const isUpdateInCellMode = this.isCellEditMode() && options.row && !options.row.isNewRow;

                    if(showEditorAlways && !forceUpdateRow) {
                        if(isUpdateInCellMode) {
                            this._setEditRowKey(options.row.key, true);
                            this._setEditColumnNameByIndex(options.columnIndex, true);

                            return this.saveEditData();
                        } else if(this.isBatchEditMode()) {
                            forceUpdateRow = this._needUpdateRow(options.column);

                            return this.callBase(options, forceUpdateRow);
                        }
                    }

                    return this.callBase.apply(this, arguments);
                },

                _processDataItemCore: function(item, { data, type }) {
                    if(this.isBatchEditMode() && type === DATA_EDIT_DATA_REMOVE_TYPE) {
                        item.data = createObjectWithChanges(item.data, data);
                    }

                    this.callBase.apply(this, arguments);
                },

                _processRemoveCore: function(changes, editIndex, processIfBatch) {
                    if(this.isBatchEditMode() && !processIfBatch) {
                        return;
                    }

                    return this.callBase.apply(this, arguments);
                },

                _processRemoveIfError: function() {
                    if(this.isBatchEditMode()) {
                        return;
                    }

                    return this.callBase.apply(this, arguments);
                }
            }
        },
        views: {
            rowsView: {
                _createTable: function() {
                    const $table = this.callBase.apply(this, arguments);
                    const editingController = this._editingController;

                    if(editingController.isCellOrBatchEditMode() && this.option('editing.allowUpdating')) {
                        eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), 'td:not(.' + EDITOR_CELL_CLASS + ')', this.createAction(() => {
                            if(editingController.isEditing()) {
                                editingController.closeEditCell();
                            }
                        }));
                    }

                    return $table;
                },
                _createRow: function(row) {
                    const $row = this.callBase(row);

                    if(row) {
                        const editingController = this._editingController;
                        const isRowRemoved = !!row.removed;

                        if(editingController.isBatchEditMode()) {
                            isRowRemoved && $row.addClass(ROW_REMOVED);
                        }
                    }
                    return $row;
                }
            },
            headerPanel: {
                isVisible: function() {
                    const editingOptions = this.getController('editing').option('editing');

                    return this.callBase() || editingOptions && (editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === EDIT_MODE_BATCH;
                }
            }
        }
    }
};
