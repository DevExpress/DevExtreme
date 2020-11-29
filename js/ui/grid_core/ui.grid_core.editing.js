import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import { isDefined, isObject, isFunction, isString, isEmptyObject } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import modules from './ui.grid_core.modules';
import { name as clickEventName } from '../../events/click';
import { name as doubleClickEvent } from '../../events/double_click';
import pointerEvents from '../../events/pointer';
import gridCoreUtils from './ui.grid_core.utils';
import { createObjectWithChanges } from '../../data/array_utils';
import { addNamespace } from '../../events/utils/index';
import { confirm } from '../dialog';
import messageLocalization from '../../localization/message';
import Button from '../button';
import Popup from '../popup';
import devices from '../../core/devices';
import Form from '../form';
import holdEvent from '../../events/hold';
import { when, Deferred, fromPromise } from '../../core/utils/deferred';
import { deferRender } from '../../core/utils/common';
import * as iconUtils from '../../core/utils/icon';
import Scrollable from '../scroll_view/ui.scrollable';

const EDIT_FORM_CLASS = 'edit-form';
const EDIT_FORM_ITEM_CLASS = 'edit-form-item';
const FOCUS_OVERLAY_CLASS = 'focus-overlay';
const READONLY_CLASS = 'readonly';
const EDIT_POPUP_CLASS = 'edit-popup';
const FORM_BUTTONS_CONTAINER_CLASS = 'form-buttons-container';
const ADD_ROW_BUTTON_CLASS = 'addrow-button';
const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const LINK_CLASS = 'dx-link';
const EDITOR_CELL_CLASS = 'dx-editor-cell';
const ROW_SELECTED = 'dx-selection';
const EDIT_ROW = 'dx-edit-row';
const EDIT_BUTTON_CLASS = 'dx-edit-button';
const COMMAND_EDIT_CLASS = 'dx-command-edit';
const COMMAND_EDIT_WITH_ICONS_CLASS = COMMAND_EDIT_CLASS + '-with-icons';
const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';

const BUTTON_CLASS = 'dx-button';

const INSERT_INDEX = '__DX_INSERT_INDEX__';
const ROW_CLASS = 'dx-row';
const ROW_REMOVED = 'dx-row-removed';
const ROW_INSERTED = 'dx-row-inserted';
const ROW_MODIFIED = 'dx-row-modified';
const CELL_MODIFIED = 'dx-cell-modified';
const EDITING_NAMESPACE = 'dxDataGridEditing';
const DATA_ROW_CLASS = 'dx-data-row';

const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
const FOCUSABLE_ELEMENT_SELECTOR = '[tabindex], ' + EDITORS_INPUT_SELECTOR;

const EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_ROW = 'row';
const EDIT_MODE_CELL = 'cell';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_POPUP = 'popup';

const DATA_EDIT_DATA_INSERT_TYPE = 'insert';
const DATA_EDIT_DATA_UPDATE_TYPE = 'update';
const DATA_EDIT_DATA_REMOVE_TYPE = 'remove';

const DEFAULT_START_EDIT_ACTION = 'click';

const EDIT_MODES = [EDIT_MODE_BATCH, EDIT_MODE_ROW, EDIT_MODE_CELL, EDIT_MODE_FORM, EDIT_MODE_POPUP];
const ROW_BASED_MODES = [EDIT_MODE_ROW, EDIT_MODE_FORM, EDIT_MODE_POPUP];
const CELL_BASED_MODES = [EDIT_MODE_BATCH, EDIT_MODE_CELL];
const FORM_BASED_MODES = [EDIT_MODE_FORM, EDIT_MODE_POPUP];
const MODES_WITH_DELAYED_FOCUS = [EDIT_MODE_ROW, EDIT_MODE_FORM];

const TARGET_COMPONENT_NAME = 'targetComponent';

const EDIT_LINK_CLASS = {
    save: 'dx-link-save',
    cancel: 'dx-link-cancel',
    edit: 'dx-link-edit',
    undelete: 'dx-link-undelete',
    delete: 'dx-link-delete',
    add: 'dx-link-add'
};
const EDIT_ICON_CLASS = {
    save: 'save',
    cancel: 'revert',
    edit: 'edit',
    undelete: 'revert',
    delete: 'trash',
    add: 'add'
};
const METHOD_NAMES = {
    edit: 'editRow',
    delete: 'deleteRow',
    undelete: 'undeleteRow',
    save: 'saveEditData',
    cancel: 'cancelEditData',
    add: 'addRowByRowIndex'
};
const ACTION_OPTION_NAMES = {
    add: 'allowAdding',
    edit: 'allowUpdating',
    delete: 'allowDeleting'
};
const BUTTON_NAMES = ['edit', 'save', 'cancel', 'delete', 'undelete'];

const EDITING_POPUP_OPTION_NAME = 'editing.popup';
const EDITING_CHANGES_OPTION_NAME = 'editing.changes';
const EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
const EDITING_EDITCOLUMNNAME_OPTION_NAME = 'editing.editColumnName';

const createFailureHandler = function(deferred) {
    return function(arg) {
        const error = arg instanceof Error ? arg : new Error(arg && String(arg) || 'Unknown error');
        deferred.reject(error);
    };
};

const getEditMode = function(that) {
    const editMode = that.option('editing.mode');

    if(EDIT_MODES.indexOf(editMode) !== -1) {
        return editMode;
    }
    return EDIT_MODE_ROW;
};

const isRowEditMode = function(that) {
    const editMode = getEditMode(that);
    return ROW_BASED_MODES.indexOf(editMode) !== -1;
};

const isEditingCell = function(isEditRow, cellOptions) {
    return cellOptions.isEditing || isEditRow && cellOptions.column.allowEditing;
};

const isEditingOrShowEditorAlwaysDataCell = function(isEditRow, cellOptions) {
    const isCommandCell = !!cellOptions.column.command;
    const isEditing = isEditingCell(isEditRow, cellOptions);
    const isEditorCell = !isCommandCell && (isEditing || cellOptions.column.showEditorAlways);
    return cellOptions.rowType === 'data' && isEditorCell;
};

const EditingController = modules.ViewController.inherit((function() {
    const getDefaultEditorTemplate = function(that) {
        return function(container, options) {
            const $editor = $('<div>').appendTo(container);

            that.getController('editorFactory').createEditor($editor, extend({}, options.column, {
                value: options.value,
                setValue: options.setValue,
                row: options.row,
                parentType: 'dataRow',
                width: null,
                readOnly: !options.setValue,
                isOnForm: options.isOnForm,
                id: options.id
            }));
        };
    };

    const getEditingTexts = (options) => {
        const editingTexts = options.component.option('editing.texts') || {};

        return {
            save: editingTexts.saveRowChanges,
            cancel: editingTexts.cancelRowChanges,
            edit: editingTexts.editRow,
            undelete: editingTexts.undeleteRow,
            delete: editingTexts.deleteRow,
            add: editingTexts.addRowToNode
        };
    };

    const getButtonIndex = (buttons, name) => {
        let result = -1;

        buttons.some((button, index) => {
            if(getButtonName(button) === name) {
                result = index;
                return true;
            }
        });

        return result;
    };

    function getButtonName(button) {
        return isObject(button) ? button.name : button;
    }

    const getEditorType = (item) => {
        const column = item.column;

        return item.isCustomEditorType ? item.editorType : column.formItem && column.formItem.editorType;
    };

    const forEachFormItems = (items, callBack) => {
        items.forEach((item) => {
            if(item.items || item.tabs) {
                forEachFormItems(item.items || item.tabs, callBack);
            } else {
                callBack(item);
            }
        });
    };

    return {
        init: function() {
            const that = this;

            that._columnsController = that.getController('columns');
            that._dataController = that.getController('data');
            that._rowsView = that.getView('rowsView');
            that._editForm = null;
            that._updateEditFormDeferred = null;
            that._lastOperation = null;

            if(that._deferreds) {
                that._deferreds.forEach(d => d.reject('cancel'));
            }
            that._deferreds = [];

            if(!that._dataChangedHandler) {
                that._dataChangedHandler = that._handleDataChanged.bind(that);
                that._dataController.changed.add(that._dataChangedHandler);
            }

            if(!that._saveEditorHandler) {
                that.createAction('onInitNewRow', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onRowInserting', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onRowInserted', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onEditingStart', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onRowUpdating', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onRowUpdated', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onRowRemoving', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onRowRemoved', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onSaved', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onSaving', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onEditCanceling', { excludeValidators: ['disabled', 'readOnly'] });
                that.createAction('onEditCanceled', { excludeValidators: ['disabled', 'readOnly'] });
                // chrome 73+
                let $pointerDownTarget;
                let isResizing;
                that._pointerUpEditorHandler = () => { isResizing = that.getController('columnsResizer')?.isResizing(); };
                that._pointerDownEditorHandler = e => $pointerDownTarget = $(e.target);
                that._saveEditorHandler = that.createAction(function(e) {
                    const event = e.event;
                    const $target = $(event.target);
                    const targetComponent = event[TARGET_COMPONENT_NAME];

                    if($pointerDownTarget && $pointerDownTarget.is('input') && !$pointerDownTarget.is($target)) {
                        return;
                    }

                    function checkEditorPopup($element) {
                        return $element && !!$element.closest(`.${DROPDOWN_EDITOR_OVERLAY_CLASS}`).length;
                    }

                    if(!isRowEditMode(that) && !that._editCellInProgress) {
                        const isEditorPopup = checkEditorPopup($target) || checkEditorPopup(targetComponent?.$element());
                        const isDomElement = !!$target.closest(getWindow().document).length;
                        const isAnotherComponent = targetComponent && !targetComponent._disposed && targetComponent !== that.component;
                        const isAddRowButton = !!$target.closest(`.${that.addWidgetPrefix(ADD_ROW_BUTTON_CLASS)}`).length;
                        const isFocusOverlay = $target.hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
                        const isCellEditMode = getEditMode(that) === EDIT_MODE_CELL;
                        if(!isResizing && !isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && that.isEditing()) && (isDomElement || isAnotherComponent)) {
                            that._closeEditItem.bind(that)($target);
                        }
                    }
                });
                eventsEngine.on(domAdapter.getDocument(), pointerEvents.up, that._pointerUpEditorHandler);
                eventsEngine.on(domAdapter.getDocument(), pointerEvents.down, that._pointerDownEditorHandler);
                eventsEngine.on(domAdapter.getDocument(), clickEventName, that._saveEditorHandler);
            }
            that._updateEditColumn();
            that._updateEditButtons();

            if(!this._internalState) {
                this._internalState = [];
            }

            this.component._optionsByReference[EDITING_EDITROWKEY_OPTION_NAME] = true;
            this.component._optionsByReference[EDITING_CHANGES_OPTION_NAME] = true;
        },

        getChanges: function() {
            return this.option(EDITING_CHANGES_OPTION_NAME);
        },

        resetChanges: function() {
            const changes = this.getChanges();
            const needReset = changes?.length;
            if(needReset) {
                this._silentOption(EDITING_CHANGES_OPTION_NAME, []);
            }
        },

        _getInternalData: function(key) {
            return this._internalState.filter(item => item.key === key)[0];
        },

        _addInternalData: function(params) {
            const internalData = this._getInternalData(params.key);

            if(internalData) {
                return extend(internalData, params);
            }

            this._internalState.push(params);
            return params;
        },

        _getOldData: function(key) {
            return this._getInternalData(key)?.oldData;
        },

        getUpdatedData: function(data) {
            const key = this._dataController.keyOf(data);
            const changes = this.getChanges();
            const editIndex = gridCoreUtils.getIndexByKey(key, changes);

            if(changes[editIndex]) {
                return createObjectWithChanges(data, changes[editIndex].data);
            }

            return data;
        },

        getInsertedData: function() {
            return this.getChanges()
                .filter(change => change.data && change.type === DATA_EDIT_DATA_INSERT_TYPE)
                .map(change => change.data);
        },

        getRemovedData: function() {
            return this.getChanges()
                .filter(change => this._getOldData(change.key) && change.type === DATA_EDIT_DATA_REMOVE_TYPE)
                .map(change => this._getOldData(change.key));
        },

        _fireDataErrorOccurred: function(arg) {
            if(arg === 'cancel') return;
            const $popupContent = this.getPopupContent();
            this._dataController.dataErrorOccurred.fire(arg, $popupContent);
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

            return result;
        },

        _closeEditItem: function($targetElement) {
            if(this._needToCloseEditableCell($targetElement)) {
                this.closeEditCell();
            }
        },

        _handleDataChanged: function(args) {
            const editForm = this._editForm;

            if(args.changeType === 'refresh' && getEditMode(this) === EDIT_MODE_POPUP && editForm && editForm.option('visible')) {
                this._repaintEditPopup();
            }
        },

        _isDefaultButtonVisible: function(button, options) {
            let result = true;
            const isRowMode = isRowEditMode(this);
            const isBatchMode = getEditMode(this) === EDIT_MODE_BATCH;
            const isEditRow = options.row && options.row.rowIndex === this._getVisibleEditRowIndex() && isRowMode;

            switch(button.name) {
                case 'edit':
                    result = !isEditRow && this.allowUpdating(options) && isRowMode;
                    break;
                case 'save':
                case 'cancel':
                    result = isEditRow;
                    break;
                case 'delete':
                    result = !isEditRow && this.allowDeleting(options) && (!isBatchMode || !options.row.removed);
                    break;
                case 'undelete':
                    result = isBatchMode && this.allowDeleting(options) && options.row.removed;
                    break;
            }

            return result;
        },

        _isButtonVisible: function(button, options) {
            const visible = button.visible;

            if(!isDefined(visible)) {
                return this._isDefaultButtonVisible(button, options);
            }

            return isFunction(visible) ? visible.call(button, { component: options.component, row: options.row, column: options.column }) : visible;
        },

        _getButtonConfig: function(button, options) {
            const config = isObject(button) ? button : {};
            const buttonName = getButtonName(button);
            const editingTexts = getEditingTexts(options);
            const methodName = METHOD_NAMES[buttonName];
            const editingOptions = this.option('editing');
            const actionName = ACTION_OPTION_NAMES[buttonName];
            const allowAction = actionName ? editingOptions[actionName] : true;

            return extend({
                name: buttonName,
                text: editingTexts[buttonName],
                cssClass: EDIT_LINK_CLASS[buttonName],
                onClick: (e) => {
                    const event = e.event;

                    event.stopPropagation();
                    event.preventDefault();
                    setTimeout(() => {
                        options.row && allowAction && this[methodName] && this[methodName](options.row.rowIndex);
                    });
                }
            }, config);
        },

        _getEditingButtons: function(options) {
            let buttonIndex;
            const haveCustomButtons = !!options.column.buttons;
            let buttons = (options.column.buttons || []).slice();

            if(haveCustomButtons) {
                buttonIndex = getButtonIndex(buttons, 'edit');

                if(buttonIndex >= 0) {
                    if(getButtonIndex(buttons, 'save') < 0) {
                        buttons.splice(buttonIndex + 1, 0, 'save');
                    }

                    if(getButtonIndex(buttons, 'cancel') < 0) {
                        buttons.splice(getButtonIndex(buttons, 'save') + 1, 0, 'cancel');
                    }
                }

                buttonIndex = getButtonIndex(buttons, 'delete');

                if(buttonIndex >= 0 && getButtonIndex(buttons, 'undelete') < 0) {
                    buttons.splice(buttonIndex + 1, 0, 'undelete');
                }
            } else {
                buttons = BUTTON_NAMES.slice();
            }

            return buttons.map((button) => {
                return this._getButtonConfig(button, options);
            });
        },

        _renderEditingButtons: function($container, buttons, options) {
            buttons.forEach((button) => {
                if(this._isButtonVisible(button, options)) {
                    this._createButton($container, button, options);
                }
            });
        },

        _getEditCommandCellTemplate: function() {
            return (container, options) => {
                const $container = $(container);

                if(options.rowType === 'data') {
                    const buttons = this._getEditingButtons(options);

                    this._renderEditingButtons($container, buttons, options);

                    options.watch && options.watch(
                        () => buttons.map(button => this._isButtonVisible(button, options)),
                        () => {
                            $container.empty();
                            this._renderEditingButtons($container, buttons, options);
                        }
                    );
                } else {
                    gridCoreUtils.setEmptyText($container);
                }
            };
        },

        isRowEditMode: function() {
            return isRowEditMode(this);
        },

        isFormEditMode: function() {
            const editMode = getEditMode(this);
            return FORM_BASED_MODES.indexOf(editMode) !== -1;
        },

        isCellOrBatchEditMode: function() {
            const editMode = this.getEditMode();
            return CELL_BASED_MODES.indexOf(editMode) !== -1;
        },

        getEditMode: function() {
            return getEditMode(this);
        },

        getFirstEditableColumnIndex: function() {
            const columnsController = this.getController('columns');
            const firstFormItem = this._firstFormItem;
            let columnIndex;

            if(getEditMode(this) === EDIT_MODE_FORM && firstFormItem) {
                const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
                const editRowIndex = this._dataController.getRowIndexByKey(editRowKey);
                const $editFormElements = this._rowsView.getCellElements(editRowIndex);
                columnIndex = this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
            } else {
                const visibleColumns = columnsController.getVisibleColumns();
                each(visibleColumns, function(index, column) {
                    if(column.allowEditing) {
                        columnIndex = index;
                        return false;
                    }
                });
            }

            return columnIndex;
        },

        getFirstEditableCellInRow: function(rowIndex) {
            const rowsView = this.getView('rowsView');
            return rowsView && rowsView._getCellElement(rowIndex ? rowIndex : 0, this.getFirstEditableColumnIndex());
        },

        getFocusedCellInRow: function(rowIndex) {
            return this.getFirstEditableCellInRow(rowIndex);
        },

        getIndexByKey: function(key, items) {
            return gridCoreUtils.getIndexByKey(key, items);
        },

        hasChanges: function(rowIndex) {
            const changes = this.getChanges();
            let result = false;

            for(let i = 0; i < changes?.length; i++) {
                if(changes[i].type && (!isDefined(rowIndex) || this._dataController.getRowIndexByKey(changes[i].key) === rowIndex)) {
                    result = true;
                    break;
                }
            }

            return result;
        },

        dispose: function() {
            this.callBase();
            clearTimeout(this._inputFocusTimeoutID);
            eventsEngine.off(domAdapter.getDocument(), pointerEvents.up, this._pointerUpEditorHandler);
            eventsEngine.off(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
            eventsEngine.off(domAdapter.getDocument(), clickEventName, this._saveEditorHandler);
        },

        optionChanged: function(args) {
            if(args.name === 'editing') {
                const fullName = args.fullName;
                const editPopup = this._editPopup;

                if(fullName && fullName.indexOf(EDITING_POPUP_OPTION_NAME) === 0) {
                    if(editPopup) {
                        const popupOptionName = fullName.slice(EDITING_POPUP_OPTION_NAME.length + 1);
                        if(popupOptionName) {
                            editPopup.option(popupOptionName, args.value);
                        } else {
                            editPopup.option(args.value);
                        }
                    }
                } else if(editPopup && editPopup.option('visible') && fullName.indexOf('editing.form') === 0) {
                    this._repaintEditPopup();
                } else if(fullName === EDITING_EDITROWKEY_OPTION_NAME) {
                    this._handleEditRowKeyChange(args);
                } else if(fullName === EDITING_EDITCOLUMNNAME_OPTION_NAME) {
                    this._handleEditColumnNameChange(args);
                } else if(fullName === EDITING_CHANGES_OPTION_NAME) {
                    this._handleChangesChange(args);
                } else {
                    this.init();
                    this.resetChanges();
                    this._resetEditColumnName();
                    this._resetEditRowKey();
                }
                args.handled = true;
            } else {
                this.callBase(args);
            }
        },

        _handleEditRowKeyChange: function(args) {
            const rowIndex = this._dataController.getRowIndexByKey(args.value);
            const oldRowIndexCorrection = this._getEditRowIndexCorrection();
            const oldRowIndex = this._dataController.getRowIndexByKey(args.previousValue) + oldRowIndexCorrection;
            const columnIndex = this._getVisibleEditColumnIndex();

            if(!this.isCellOrBatchEditMode()) {
                if(isDefined(args.value)) {
                    if(args.value !== args.previousValue) {
                        this._editRowFromOptionChanged(rowIndex, oldRowIndex);
                    }
                } else {
                    this.cancelEditData();
                }
            } else {
                if(isDefined(args.value) && args.value !== args.previousValue) {
                    this._editCellFromOptionChanged(columnIndex, columnIndex, oldRowIndex);
                }
            }
        },

        _handleEditColumnNameChange: function(args) {
            const oldRowIndex = this._getVisibleEditRowIndex(args.previousValue);

            if(this.isCellOrBatchEditMode() && oldRowIndex !== -1 && isDefined(args.value) && args.value !== args.previousValue) {
                const columnIndex = this._columnsController.getVisibleColumnIndex(args.value);
                const oldColumnIndex = this._columnsController.getVisibleColumnIndex(args.previousValue);

                this._editCellFromOptionChanged(columnIndex, oldColumnIndex, oldRowIndex);
            }
        },

        _handleChangesChange: function(args) {
            const dataController = this._dataController;

            if(!args.value.length && !args.previousValue.length) {
                return;
            }

            dataController.updateItems({
                repaintChangesOnly: true
            });
        },

        _editCellFromOptionChanged: function(columnIndex, oldColumnIndex, oldRowIndex) {
            const columns = this._columnsController.getVisibleColumns();

            if(columnIndex > -1) {
                deferRender(() => {
                    this._repaintEditCell(columns[columnIndex], columns[oldColumnIndex], oldRowIndex);
                });
            }
        },

        publicMethods: function() {
            return ['addRow', 'deleteRow', 'undeleteRow', 'editRow', 'editCell', 'closeEditCell', 'saveEditData', 'cancelEditData', 'hasEditData'];
        },

        refresh: function(isPageChanged) {
            const editMode = getEditMode(this);

            const needResetIndexes = editMode === EDIT_MODE_BATCH || isPageChanged && this.option('scrolling.mode') !== 'virtual';

            if(!isDefined(this._pageIndex)) {
                return;
            }

            if(!this.isCellOrBatchEditMode()) {
                this.resetChanges();
                this.init();
                // TODO this condition is for T733748
                if(isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME))) {
                    this._resetEditRowKey();
                }
            } else if(needResetIndexes) {
                this._resetEditColumnName();
                this._resetEditRowKey();
            }
        },

        isEditing: function() {
            const isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));
            const isEditColumnNameDefined = isDefined(this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME));

            if(this.isCellOrBatchEditMode()) {
                return isEditRowKeyDefined && isEditColumnNameDefined;
            }

            return isEditRowKeyDefined;
        },

        isEditRow: function(rowIndex) {
            const editMode = getEditMode(this);
            return this._getVisibleEditRowIndex() === rowIndex && ROW_BASED_MODES.indexOf(editMode) !== -1;
        },

        _setEditRowKey: function(value, silent) {
            if(silent) {
                this._silentOption(EDITING_EDITROWKEY_OPTION_NAME, value);
            } else {
                this.option(EDITING_EDITROWKEY_OPTION_NAME, value);
            }
        },

        _setEditRowKeyByIndex: function(rowIndex, silent) {
            const key = this._dataController.getKeyByRowIndex(rowIndex);

            if(key === undefined) {
                this._dataController.fireError('E1043');
                return;
            }

            this._setEditRowKey(key, silent);
        },

        getEditRowIndex: function() {
            return this._getVisibleEditRowIndex();
        },

        getEditFormRowIndex: function() {
            const editMode = getEditMode(this);

            return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP ? this._getVisibleEditRowIndex() : -1;
        },

        isEditCell: function(visibleRowIndex, columnIndex) {
            return this._getVisibleEditRowIndex() === visibleRowIndex && this._getVisibleEditColumnIndex() === columnIndex;
        },

        getPopupContent: function() {
            const editMode = getEditMode(this);
            const popupVisible = this._editPopup && this._editPopup.option('visible');

            if(editMode === EDIT_MODE_POPUP && popupVisible) {
                return this._$popupContent;
            }
        },

        getEditForm: function() {
            return this._editForm;
        },

        _needInsertItem: function(change, changeType) {
            const that = this;
            const dataSource = that._dataController.dataSource();
            const scrollingMode = that.option('scrolling.mode');
            const pageIndex = dataSource.pageIndex();
            const beginPageIndex = dataSource.beginPageIndex ? dataSource.beginPageIndex() : pageIndex;
            const endPageIndex = dataSource.endPageIndex ? dataSource.endPageIndex() : pageIndex;

            if(scrollingMode !== 'standard') {
                switch(changeType) {
                    case 'append':
                        return change.key.pageIndex === endPageIndex;
                    case 'prepend':
                        return change.key.pageIndex === beginPageIndex;
                    case 'refresh':
                        change.key.rowIndex = 0;
                        change.key.dataRowIndex = 0;
                        change.key.pageIndex = 0;
                        break;
                    default:
                        return change.key.pageIndex >= beginPageIndex && change.key.pageIndex <= endPageIndex;
                }
            }

            return change.key.pageIndex === pageIndex;
        },

        _generateNewItem: function(key) {
            const item = {
                key: key
            };

            if(key && key[INSERT_INDEX]) {
                item[INSERT_INDEX] = key[INSERT_INDEX];
            }

            return item;
        },
        _getLoadedRowIndexByInsertKey: function(items, change, key) {
            const dataController = this._dataController;
            const loadedRowIndexOffset = dataController.getRowIndexOffset(true);
            let loadedRowIndex = key.dataRowIndex - loadedRowIndexOffset;

            if(change.changeType === 'append') {
                loadedRowIndex -= dataController.items(true).length;
                if(change.removeCount) {
                    loadedRowIndex += change.removeCount;
                }
            }

            for(let i = 0; i < loadedRowIndex; i++) {
                if(items[i] && items[i][INSERT_INDEX]) {
                    loadedRowIndex++;
                }
            }

            return loadedRowIndex;
        },
        processItems: function(items, e) {
            const changeType = e.changeType;

            this.update(changeType);

            const changes = this.getChanges();
            changes.forEach(change => {
                const key = change.key;

                if(isDefined(key) && change.type === DATA_EDIT_DATA_INSERT_TYPE) {
                    const loadedRowIndex = this._getLoadedRowIndexByInsertKey(items, e, key);

                    const item = this._generateNewItem(key);
                    if(loadedRowIndex >= 0 && this._needInsertItem(change, changeType, items, item)) {
                        items.splice(key.dataRowIndex ? loadedRowIndex : 0, 0, item);
                    }
                }
            });

            return items;
        },

        processDataItem: function(item, options, generateDataValues) {
            const columns = options.visibleColumns;
            const key = item.data[INSERT_INDEX] ? item.data.key : item.key;
            const changes = this.getChanges();

            const editIndex = gridCoreUtils.getIndexByKey(key, changes);
            item.isEditing = false;

            if(editIndex >= 0) {
                const editMode = getEditMode(this);
                const { data, type } = changes[editIndex];

                switch(type) {
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        if(editMode === EDIT_MODE_POPUP) {
                            item.visible = false;
                        }
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
                        if(editMode === EDIT_MODE_BATCH) {
                            item.data = createObjectWithChanges(item.data, data);
                        }
                        item.removed = true;
                        break;
                }
            }
        },

        _initNewRow: function(options) {
            this.executeAction('onInitNewRow', options);

            if(options.promise) {
                const deferred = new Deferred();

                when(fromPromise(options.promise))
                    .done(deferred.resolve)
                    .fail(createFailureHandler(deferred))
                    .fail((arg) => this._fireDataErrorOccurred(arg));

                return deferred;
            }
        },

        _getInsertKey: function(parentKey) {
            const that = this;
            const dataController = that._dataController;
            const rows = dataController.items();
            const editMode = getEditMode(that);

            const insertKey = {
                parentKey,
                pageIndex: dataController.pageIndex(),
                rowIndex: that._getInsertRowIndex(parentKey)
            };

            const row = rows[insertKey.rowIndex];

            if(row && (!row.isEditing && row.rowType === 'detail' || row.rowType === 'detailAdaptive')) {
                insertKey.rowIndex++;
            }

            insertKey.dataRowIndex = dataController.getRowIndexOffset() + rows.filter(function(row, index) {
                return index < insertKey.rowIndex && (row.rowType === 'data' && !row.isNewRow || row.rowType === 'group');
            }).length;

            if(editMode !== EDIT_MODE_BATCH) {
                this._setEditRowKey(insertKey, true);
            }

            insertKey[INSERT_INDEX] = that._getInsertIndex();

            return insertKey;
        },

        _getInsertRowIndex: function(parentKey) {
            const that = this;
            const rowsView = that.getView('rowsView');
            const parentRowIndex = that._dataController.getRowIndexByKey(parentKey);

            if(parentRowIndex >= 0) {
                return parentRowIndex + 1;
            }

            if(rowsView) {
                return rowsView.getTopVisibleItemIndex(true);
            }

            return 0;
        },

        _getInsertIndex: function() {
            let maxInsertIndex = 0;
            this.getChanges().forEach(function(editItem) {
                if(editItem.type === DATA_EDIT_DATA_INSERT_TYPE && editItem.key[INSERT_INDEX] > maxInsertIndex) {
                    maxInsertIndex = editItem.key[INSERT_INDEX];
                }
            });
            return maxInsertIndex + 1;
        },

        addRow: function(parentKey) {
            const that = this;
            const dataController = that._dataController;
            const store = dataController.store();
            const key = store && store.key();
            const param = { data: {} };
            const editMode = getEditMode(that);
            const oldEditRowIndex = that._getVisibleEditRowIndex();
            const deferred = new Deferred();

            if(!store) {
                dataController.fireError('E1052', this.component.NAME);
                return deferred.reject();
            }

            if(editMode === EDIT_MODE_CELL && that.hasChanges()) {
                that.saveEditData().done(function() {
                    // T804894
                    if(!that.hasChanges()) {
                        that.addRow(parentKey).done(deferred.resolve).fail(deferred.reject);
                    } else {
                        deferred.reject('cancel');
                    }
                });
                return deferred.promise();
            }

            that.refresh();

            if(!that._allowRowAdding()) {
                return deferred.reject('cancel');
            }

            if(!key) {
                param.data.__KEY__ = String(new Guid());
            }

            when(that._initNewRow(param, parentKey)).done(() => {
                if(that._allowRowAdding()) {
                    that._addRowCore(param.data, parentKey, oldEditRowIndex);
                    deferred.resolve();
                } else {
                    deferred.reject('cancel');
                }
            }).fail(deferred.reject);

            return deferred.promise();
        },

        _allowRowAdding: function() {
            const that = this;
            const editMode = getEditMode(that);
            const insertIndex = that._getInsertIndex();

            if(editMode !== EDIT_MODE_BATCH && insertIndex > 1) {
                return false;
            }

            return true;
        },

        _addRowCore: function(data, parentKey, initialOldEditRowIndex) {
            const that = this;
            const oldEditRowIndex = that._getVisibleEditRowIndex();
            const insertKey = that._getInsertKey(parentKey);
            const editMode = getEditMode(that);

            that._addChange({ key: insertKey, data: data, type: DATA_EDIT_DATA_INSERT_TYPE });

            that._dataController.updateItems({
                changeType: 'update',
                rowIndices: [initialOldEditRowIndex, oldEditRowIndex, insertKey.rowIndex]
            });

            if(editMode === EDIT_MODE_POPUP) {
                that._showEditPopup(insertKey.rowIndex);
            } else {
                that._focusFirstEditableCellInRow(insertKey.rowIndex);
            }

            that._afterInsertRow({ key: insertKey, data: data });
        },

        _focusFirstEditableCellInRow: function(rowIndex) {
            const that = this;
            const $firstCell = that.getFirstEditableCellInRow(rowIndex);

            that._editCellInProgress = true;

            that._delayedInputFocus($firstCell, function() {
                that._editCellInProgress = false;

                const $cell = that.getFirstEditableCellInRow(rowIndex);
                const eventToTrigger = that.option('editing.startEditAction') === 'dblClick' ? doubleClickEvent : clickEventName;

                $cell && eventsEngine.trigger($cell, eventToTrigger);
            });
        },

        _isEditingStart: function(options) {
            this.executeAction('onEditingStart', options);

            return options.cancel;
        },

        _beforeEditCell: function(rowIndex, columnIndex, item) {
            const that = this;

            if(getEditMode(that) === EDIT_MODE_CELL && !item.isNewRow && that.hasChanges()) {
                const d = new Deferred();
                that.saveEditData().always(function() {
                    d.resolve(that.hasChanges());
                });
                return d;
            }
        },

        _beforeUpdateItems: function() { },

        _getVisibleEditColumnIndex: function() {
            const editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);

            if(!isDefined(editColumnName)) {
                return -1;
            }

            return this._columnsController.getVisibleColumnIndex(editColumnName);
        },

        _setEditColumnNameByIndex: function(index, silent) {
            const visibleColumns = this._columnsController.getVisibleColumns();
            this._setEditColumnName(visibleColumns[index]?.name, silent);
        },

        _setEditColumnName: function(name, silent) {
            if(silent) {
                this._silentOption(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
            } else {
                this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME, name);
            }
        },

        _resetEditColumnName: function() {
            this._setEditColumnName(null, true);
        },

        _getEditColumn: function() {
            const editColumnName = this.option(EDITING_EDITCOLUMNNAME_OPTION_NAME);

            return this._getColumnByName(editColumnName);
        },

        _getColumnByName: function(name) {
            const visibleColumns = this._columnsController.getVisibleColumns();
            let editColumn;

            isDefined(name) && visibleColumns.some(column => {
                if(column.name === name) {
                    editColumn = column;
                    return true;
                }
            });

            return editColumn;
        },

        _getVisibleEditRowIndex: function(columnName) {
            const dataController = this._dataController;
            const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
            const rowIndex = dataController.getRowIndexByKey(editRowKey);

            if(rowIndex === -1) {
                return rowIndex;
            }

            return rowIndex + this._getEditRowIndexCorrection(columnName);
        },

        _getEditRowIndexCorrection: function(columnName) {
            const editColumn = columnName ? this._getColumnByName(columnName) : this._getEditColumn();
            const isColumnHidden = editColumn?.visibleWidth === 'adaptiveHidden';

            return isColumnHidden ? 1 : 0;
        },

        _resetEditRowKey: function() {
            this._setEditRowKey(null, true);
        },

        _resetEditIndices: function() {
            this._resetEditColumnName();
            this._resetEditRowKey();
        },

        editRow: function(rowIndex) {
            const dataController = this._dataController;
            const items = dataController.items();
            const item = items[rowIndex];
            const params = { data: item && item.data, cancel: false };
            const oldRowIndex = this._getVisibleEditRowIndex();

            if(!item) {
                return;
            }

            if(rowIndex === oldRowIndex) {
                return true;
            }

            if(item.key === undefined) {
                this._dataController.fireError('E1043');
                return;
            }

            if(!item.isNewRow) {
                params.key = item.key;
            }

            if(this._isEditingStart(params)) {
                return;
            }

            this.resetChanges();
            this.init();
            this._resetEditColumnName();
            this._pageIndex = dataController.pageIndex();
            this._addInternalData({
                key: item.key,
                oldData: item.data
            });
            this._setEditRowKey(item.key);
        },

        _editRowFromOptionChanged: function(rowIndex, oldRowIndex) {
            const rowIndices = [oldRowIndex, rowIndex];
            const editMode = getEditMode(this);

            this._beforeUpdateItems(rowIndices, rowIndex, oldRowIndex);

            if(editMode === EDIT_MODE_POPUP) {
                this._showEditPopup(rowIndex);
            } else {
                this._needFocusEditor = true;
                this._dataController.updateItems({
                    changeType: 'update',
                    rowIndices: rowIndices
                });
            }
        },

        _focusEditorIfNeed: function() {
            const editMode = getEditMode(this);

            if(this._needFocusEditor) {
                if(MODES_WITH_DELAYED_FOCUS.indexOf(editMode) !== -1) {
                    const $editingCell = this.getFocusedCellInRow(this._getVisibleEditRowIndex());

                    this._delayedInputFocus($editingCell, () => {
                        $editingCell && this.component.focus($editingCell);
                    });
                } else if(CELL_BASED_MODES.indexOf(editMode) !== -1) {
                    const editColumnIndex = this._getVisibleEditColumnIndex();
                    const $cell = this._rowsView?._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex); // T319885

                    if($cell && !$cell.find(':focus').length) {
                        this._focusEditingCell(() => {
                            this._editCellInProgress = false;
                        }, $cell, true);
                    } else {
                        this._editCellInProgress = false;
                    }
                }

                this._needFocusEditor = false;
            }
        },

        _showEditPopup: function(rowIndex, repaintForm) {
            const that = this;
            const isMobileDevice = devices.current().deviceType !== 'desktop';
            const popupOptions = extend(
                {
                    showTitle: false,
                    fullScreen: isMobileDevice,
                    toolbarItems: [
                        { toolbar: 'bottom', location: 'after', widget: 'dxButton', options: that._getSaveButtonConfig() },
                        { toolbar: 'bottom', location: 'after', widget: 'dxButton', options: that._getCancelButtonConfig() }
                    ],
                    contentTemplate: that._getPopupEditFormTemplate(rowIndex)
                },
                that.option(EDITING_POPUP_OPTION_NAME)
            );

            if(!that._editPopup) {
                const $popupContainer = $('<div>')
                    .appendTo(that.component.$element())
                    .addClass(that.addWidgetPrefix(EDIT_POPUP_CLASS));

                that._editPopup = that._createComponent($popupContainer, Popup, {});
                that._editPopup.on('hiding', that._getEditPopupHiddenHandler());
                that._editPopup.on('shown', function(e) {
                    eventsEngine.trigger(e.component.$content().find(FOCUSABLE_ELEMENT_SELECTOR).not('.' + SCROLLABLE_CONTAINER_CLASS).first(), 'focus');

                    if(repaintForm) {
                        that._editForm && that._editForm.repaint();
                    }
                });
            }

            that._editPopup.option(popupOptions);
            that._editPopup.show();
        },

        _repaintEditPopup: function() {
            const rowIndex = this._getVisibleEditRowIndex();

            if(this._editPopup && this._editPopup.option('visible') && rowIndex >= 0) {
                const defaultAnimation = this._editPopup.option('animation');

                this._editPopup.option('animation', null);
                this._showEditPopup(rowIndex, true);
                this._editPopup.option('animation', defaultAnimation);
            }
        },

        _getEditPopupHiddenHandler: function() {
            const that = this;

            return function(e) {
                if(that.isEditing()) {
                    that.cancelEditData();
                }
            };
        },

        _getPopupEditFormTemplate: function(rowIndex) {
            const that = this;
            const row = that.component.getVisibleRows()[rowIndex];
            const templateOptions = {
                row: row,
                rowType: row.rowType,
                key: row.key
            };

            return function(container) {
                const formTemplate = that.getEditFormTemplate();
                const scrollable = that._createComponent($('<div>').appendTo(container), Scrollable);

                that._$popupContent = scrollable.$content();

                formTemplate(that._$popupContent, templateOptions, true);
            };
        },

        _getSaveButtonConfig: function() {
            return {
                text: this.option('editing.texts.saveRowChanges'),
                onClick: this.saveEditData.bind(this)
            };
        },

        _getCancelButtonConfig: function() {
            return {
                text: this.option('editing.texts.cancelRowChanges'),
                onClick: this.cancelEditData.bind(this)
            };
        },

        _removeInternalData: function(key) {
            const internalData = this._getInternalData(key);
            const index = this._internalState.indexOf(internalData);

            if(index > -1) {
                this._internalState.splice(index, 1);
            }
        },

        _removeChange: function(index) {
            if(index >= 0) {
                const changes = [...this.getChanges()];

                this._removeInternalData(changes[index].key);

                changes.splice(index, 1);
                this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
            }
        },

        executeOperation: function(deferred, func) {
            this._lastOperation && this._lastOperation.reject();
            this._lastOperation = deferred;

            this.waitForDeferredOperations().done(() => {
                if(deferred.state() === 'rejected') {
                    return;
                }
                func();
                this._lastOperation = null;
            }).fail(() => {
                deferred.reject();
                this._lastOperation = null;
            });
        },

        waitForDeferredOperations: function() {
            return when(...this._deferreds);
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

            if(column && item && (item.rowType === 'data' || item.rowType === 'detailAdaptive') && !item.removed && !isRowEditMode(this)) {
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

        _processCanceledEditingCell: function() { },

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

        _repaintEditCell: function(column, oldColumn, oldEditRowIndex) {
            const that = this;

            this._needFocusEditor = true;
            if(!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
                that._editCellInProgress = true;

                // T316439
                that.getController('editorFactory').loseFocus();

                that._dataController.updateItems({
                    changeType: 'update',
                    rowIndices: [oldEditRowIndex, that._getVisibleEditRowIndex()]
                });
            } else {
                // TODO check this necessity T816039
                that._dataController.updateItems({
                    changeType: 'update',
                    rowIndices: []
                });
            }
        },

        _delayedInputFocus: function($cell, beforeFocusCallback, callBeforeFocusCallbackAlways) {
            const that = this;

            function inputFocus() {
                if(beforeFocusCallback) {
                    beforeFocusCallback();
                }

                if($cell) {
                    const $focusableElement = $cell.find(FOCUSABLE_ELEMENT_SELECTOR).first();
                    gridCoreUtils.focusAndSelectElement(that, $focusableElement);
                }

                that._beforeFocusCallback = null;
            }

            if(devices.real().ios || devices.real().android) {
                inputFocus();
            } else {
                if(that._beforeFocusCallback) that._beforeFocusCallback();

                clearTimeout(that._inputFocusTimeoutID);

                if(callBeforeFocusCallbackAlways) {
                    that._beforeFocusCallback = beforeFocusCallback;
                }

                that._inputFocusTimeoutID = setTimeout(inputFocus);
            }
        },

        _focusEditingCell: function(beforeFocusCallback, $editCell, callBeforeFocusCallbackAlways) {
            const that = this;
            const rowsView = that.getView('rowsView');
            const editColumnIndex = this._getVisibleEditColumnIndex();

            $editCell = $editCell || rowsView && rowsView._getCellElement(that._getVisibleEditRowIndex(), editColumnIndex);
            that._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
        },

        deleteRow: function(rowIndex) {
            if(this.option('editing.mode') === 'cell' && this.isEditing()) {
                const isNewRow = this._dataController.items()[rowIndex].isNewRow;

                // T850905
                this.closeEditCell(null, isNewRow).always(() => {
                    this._checkAndDeleteRow(rowIndex);
                });
            } else {
                this._checkAndDeleteRow(rowIndex);
            }
        },
        _checkAndDeleteRow: function(rowIndex) {
            const that = this;
            const editingOptions = that.option('editing');
            const editingTexts = editingOptions && editingOptions.texts;
            const isBatchMode = editingOptions && editingOptions.mode === EDIT_MODE_BATCH;
            const confirmDelete = editingOptions && editingOptions.confirmDelete;
            const confirmDeleteMessage = editingTexts && editingTexts.confirmDeleteMessage;
            const item = that._dataController.items()[rowIndex];
            const allowDeleting = isBatchMode || !that.isEditing() || item.isNewRow; // T741746

            if(item && allowDeleting) {
                if(isBatchMode || !confirmDelete || !confirmDeleteMessage) {
                    that._deleteRowCore(rowIndex);
                } else {
                    const confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle;
                    const showDialogTitle = isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
                    confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done(function(confirmResult) {
                        if(confirmResult) {
                            that._deleteRowCore(rowIndex);
                        }
                    });
                }
            }
        },
        _deleteRowCore: function(rowIndex) {
            const dataController = this._dataController;
            const item = dataController.items()[rowIndex];
            const key = item && item.key;
            const oldEditRowIndex = this._getVisibleEditRowIndex();
            const isBatchMode = this.option('editing.mode') === EDIT_MODE_BATCH;

            this.refresh();

            const changes = this.getChanges();
            const editIndex = gridCoreUtils.getIndexByKey(key, changes);
            if(editIndex >= 0) {
                if(changes[editIndex].type === DATA_EDIT_DATA_INSERT_TYPE) {
                    this._removeChange(editIndex);
                } else {
                    this._addChange({ key: key, type: DATA_EDIT_DATA_REMOVE_TYPE });
                }
            } else {
                this._addChange({ key: key, oldData: item.data, type: DATA_EDIT_DATA_REMOVE_TYPE });
            }

            if(isBatchMode) {
                dataController.updateItems({
                    changeType: 'update',
                    rowIndices: [oldEditRowIndex, rowIndex]
                });
            } else {
                this.saveEditData();
            }
        },
        undeleteRow: function(rowIndex) {
            const that = this;
            const dataController = that._dataController;
            const item = dataController.items()[rowIndex];
            const oldEditRowIndex = that._getVisibleEditRowIndex();
            const key = item && item.key;
            const changes = this.getChanges();

            if(item) {
                const editIndex = gridCoreUtils.getIndexByKey(key, changes);

                if(editIndex >= 0) {
                    const { data } = changes[editIndex];

                    if(isEmptyObject(data)) {
                        that._removeChange(editIndex);
                    } else {
                        that._addChange({ key: key, type: DATA_EDIT_DATA_UPDATE_TYPE });
                    }

                    dataController.updateItems({
                        changeType: 'update',
                        rowIndices: [oldEditRowIndex, rowIndex]
                    });
                }
            }
        },
        _fireOnSaving: function() {
            const onSavingParams = {
                cancel: false,
                promise: null,
                changes: [...this.getChanges()]
            };
            this.executeAction('onSaving', onSavingParams);
            const d = new Deferred();
            when(fromPromise(onSavingParams.promise))
                .done(() => {
                    d.resolve(onSavingParams);
                }).fail(arg => {
                    createFailureHandler(d);
                    this._fireDataErrorOccurred(arg);
                    d.resolve({ cancel: true });
                });

            return d;
        },

        _executeEditingAction: function(actionName, params, func) {
            if(this.component._disposed) {
                return null;
            }

            const deferred = new Deferred();

            this.executeAction(actionName, params);

            when(fromPromise(params.cancel)).done(function(cancel) {
                if(cancel) {
                    setTimeout(function() {
                        deferred.resolve('cancel');
                    });
                } else {
                    func(params).done(deferred.resolve).fail(createFailureHandler(deferred));
                }
            }).fail(createFailureHandler(deferred));

            return deferred;
        },

        _processChanges: function(deferreds, results, dataChanges, changes) {
            const store = this._dataController.store();

            each(changes, (index, change) => {
                const oldData = this._getOldData(change.key);
                const { data, type } = change;
                const changeCopy = { ...change };
                let deferred;
                let params;

                if(this._beforeSaveEditData(change, index)) {
                    return;
                }

                switch(type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        params = { data: oldData, key: change.key, cancel: false };
                        deferred = this._executeEditingAction('onRowRemoving', params, function() {
                            return store.remove(change.key).done(function(key) {
                                dataChanges.push({ type: 'remove', key: key });
                            });
                        });
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        params = { data: data, cancel: false };
                        deferred = this._executeEditingAction('onRowInserting', params, function() {
                            return store.insert(params.data).done(function(data, key) {
                                if(isDefined(key)) {
                                    changeCopy.key = key;
                                }
                                if(data && isObject(data) && data !== params.data) {
                                    changeCopy.data = data;
                                }
                                dataChanges.push({ type: 'insert', data: data, index: 0 });
                            });
                        });
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        params = { newData: data, oldData: oldData, key: change.key, cancel: false };
                        deferred = this._executeEditingAction('onRowUpdating', params, function() {
                            return store.update(change.key, params.newData).done(function(data, key) {
                                if(data && isObject(data) && data !== params.newData) {
                                    changeCopy.data = data;
                                }
                                dataChanges.push({ type: 'update', key: key, data: data });
                            });
                        });
                        break;
                }

                changes[index] = changeCopy;

                if(deferred) {
                    const doneDeferred = new Deferred();
                    deferred
                        .always(function(data) {
                            results.push({ key: change.key, result: data });
                        })
                        .always(doneDeferred.resolve);

                    deferreds.push(doneDeferred.promise());
                }
            });
        },

        _processSaveEditDataResult: function(results) {
            const that = this;
            let hasSavedData = false;
            const editMode = getEditMode(that);
            const changes = [...this.getChanges()];
            const changesLength = changes.length;

            for(let i = 0; i < results.length; i++) {
                const arg = results[i].result;
                const cancel = arg === 'cancel';
                const editIndex = gridCoreUtils.getIndexByKey(results[i].key, changes);
                const change = changes[editIndex];
                const isError = arg && arg instanceof Error;

                if(isError) {
                    if(change) {
                        this._addInternalData({ key: change.key, error: arg });
                    }
                    that._fireDataErrorOccurred(arg);
                    if(editMode !== EDIT_MODE_BATCH) {
                        if(change?.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                            if(editIndex >= 0) {
                                changes.splice(editIndex, 1);
                            }
                        }
                        break;
                    }
                } else if(!cancel || !change || editMode !== EDIT_MODE_BATCH && change.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                    if(editIndex >= 0) {
                        changes.splice(editIndex, 1);
                    }
                    hasSavedData = !cancel;
                }
            }

            if(changes.length < changesLength) {
                this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
            }

            return hasSavedData;
        },
        _fireSaveEditDataEvents: function(changes) {
            const that = this;

            each(changes, function(_, { data, key, type }) {
                const internalData = that._addInternalData({ key });
                const params = { key: key, data: data };

                if(internalData.error) {
                    params.error = internalData.error;
                }

                switch(type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        that.executeAction('onRowRemoved', extend({}, params, { data: internalData.oldData }));
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        that.executeAction('onRowInserted', params);
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        that.executeAction('onRowUpdated', params);
                        break;
                }
            });

            this.executeAction('onSaved', { changes });
        },

        saveEditData: function() {
            const deferred = new Deferred();
            this.waitForDeferredOperations().done(() => {
                if(this.isSaving()) {
                    this._resolveAfterSave(deferred);
                    return;
                }
                when(this._beforeSaveEditData()).done(cancel => {
                    if(cancel) {
                        this._resolveAfterSave(deferred, { cancel });
                        return;
                    }
                    this._saving = true;
                    this._saveEditDataInner()
                        .done(deferred.resolve)
                        .fail(deferred.reject)
                        .always(() => {
                            this._saving = false;
                        });
                }).fail(deferred.reject);
            }).fail(deferred.reject);
            return deferred.promise();
        },

        _resolveAfterSave: function(deferred, { cancel, error } = {}) {
            when(this._afterSaveEditData(cancel)).done(function() {
                deferred.resolve(error);
            }).fail(deferred.reject);
        },

        _saveEditDataInner: function() {
            const results = [];
            const deferreds = [];
            const dataChanges = [];
            const dataController = this._dataController;
            const dataSource = dataController.dataSource();
            const result = new Deferred();

            when(this._fireOnSaving()).done(({ cancel, changes }) => {
                if(cancel) {
                    return result.resolve().promise();
                }

                this._processChanges(deferreds, results, dataChanges, changes);

                if(deferreds.length) {
                    dataSource?.beginLoading();

                    when(...deferreds).done(() => {
                        if(this._processSaveEditDataResult(results)) {
                            this._endSaving(dataChanges, changes, result);
                        } else {
                            dataSource?.endLoading();
                            result.resolve();
                        }
                    }).fail(error => {
                        dataSource?.endLoading();
                        result.resolve(error);
                    });

                    return result.always(() => {
                        this._focusEditingCell();
                    }).promise();
                }

                this._cancelSaving(result);
            }).fail(result.reject);

            return result.promise();
        },

        _resetModifiedClassCells: function(changes) {
            const editMode = getEditMode(this);

            if(editMode === EDIT_MODE_BATCH) {
                const columnsCount = this._columnsController.getVisibleColumns().length;
                changes.forEach(({ key }) => {
                    const rowIndex = this._dataController.getRowIndexByKey(key);
                    if(rowIndex !== -1) {
                        for(let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                            this._rowsView._getCellElement(rowIndex, columnIndex).removeClass(CELL_MODIFIED);
                        }
                    }
                });
            }
        },

        _endSaving: function(dataChanges, changes, deferred) {
            const editMode = getEditMode(this);
            const dataSource = this._dataController.dataSource();

            if(editMode !== EDIT_MODE_CELL) {
                this._resetModifiedClassCells(changes);
                this._resetEditIndices();
            } else if(changes[0]?.type !== 'update') {
                this._resetEditIndices();
            }

            if(editMode === EDIT_MODE_POPUP && this._editPopup) {
                this._editPopup.hide();
            }

            dataSource?.endLoading();

            this._refreshDataAfterSave(dataChanges, changes, deferred);
        },

        _cancelSaving: function(result) {
            const editMode = getEditMode(this);
            const dataController = this._dataController;

            if(isRowEditMode(this)) {
                if(!this.hasChanges()) {
                    this._cancelEditDataCore();
                }
            } else if(this.isCellOrBatchEditMode()) {
                if(editMode !== EDIT_MODE_CELL) {
                    this._resetEditIndices();
                }

                dataController.updateItems();
            } else {
                this._focusEditingCell();
            }

            this.executeAction('onSaved', { changes: [] });
            this._resolveAfterSave(result);
        },

        _refreshDataAfterSave: function(dataChanges, changes, deferred) {
            const dataController = this._dataController;
            const refreshMode = this.option('editing.refreshMode');
            const isFullRefresh = refreshMode !== 'reshape' && refreshMode !== 'repaint';

            if(!isFullRefresh) {
                dataController.push(dataChanges);
            }

            when(dataController.refresh({
                selection: isFullRefresh,
                reload: isFullRefresh,
                load: refreshMode === 'reshape',
                changesOnly: this.option('repaintChangesOnly')
            })).always(() => {
                this._fireSaveEditDataEvents(changes);
            }).done(() => {
                this._resolveAfterSave(deferred);
            }).fail((error) => {
                this._resolveAfterSave(deferred, { error });
            });
        },

        isSaving: function() {
            return this._saving;
        },

        _updateEditColumn: function() {
            const that = this;
            const isEditColumnVisible = that._isEditColumnVisible();
            const useIcons = that.option('editing.useIcons');
            const cssClass = COMMAND_EDIT_CLASS + (useIcons ? ' ' + COMMAND_EDIT_WITH_ICONS_CLASS : '');

            that._columnsController.addCommandColumn({
                type: 'buttons',
                command: 'edit',
                visible: isEditColumnVisible,
                cssClass: cssClass,
                width: 'auto',
                alignment: 'center',
                cellTemplate: that._getEditCommandCellTemplate(),
                fixedPosition: 'right'
            });

            that._columnsController.columnOption('command:edit', {
                visible: isEditColumnVisible,
                cssClass: cssClass
            });
        },

        _isEditColumnVisible: function() {
            const that = this;
            const editingOptions = that.option('editing');

            if(editingOptions) {
                const editMode = getEditMode(that);
                let isVisibleWithCurrentEditMode = false;

                switch(editMode) {
                    case EDIT_MODE_ROW:
                        isVisibleWithCurrentEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;
                        break;
                    case EDIT_MODE_FORM:
                    case EDIT_MODE_POPUP:
                        isVisibleWithCurrentEditMode = editingOptions.allowUpdating;
                        break;
                }

                return editingOptions.allowDeleting || isVisibleWithCurrentEditMode;
            }
        },

        _updateEditButtons: function() {
            const that = this;
            const headerPanel = that.getView('headerPanel');
            const hasChanges = that.hasChanges();

            if(headerPanel) {
                headerPanel.setToolbarItemDisabled('saveButton', !hasChanges);
                headerPanel.setToolbarItemDisabled('revertButton', !hasChanges);
            }
        },

        _applyModified: function($element) {
            $element && $element.addClass(CELL_MODIFIED);
        },

        _beforeCloseEditCellInBatchMode: function() { },

        cancelEditData: function() {
            const changes = this.getChanges();
            const params = {
                cancel: false,
                changes: changes
            };

            this.executeAction('onEditCanceling', params);
            if(!params.cancel) {
                this._cancelEditDataCore();
                this.executeAction('onEditCanceled', { changes });
            }
        },

        _cancelEditDataCore: function() {
            const editMode = getEditMode(this);
            const rowIndex = this._getVisibleEditRowIndex();
            const dataController = this._dataController;

            this._beforeCancelEditData();

            this.init();
            this.resetChanges();
            this._resetEditColumnName();
            this._resetEditRowKey();

            if(ROW_BASED_MODES.indexOf(editMode) !== -1 && rowIndex >= 0) {
                dataController.updateItems({
                    changeType: 'update',
                    rowIndices: [rowIndex, rowIndex + 1]
                });
            } else {
                dataController.updateItems({
                    repaintChangesOnly: this.option('repaintChangesOnly')
                });
            }

            if(editMode === EDIT_MODE_POPUP) {
                this._hideEditPopup();
            }
        },

        _hideEditPopup: function() {
            this._editPopup && this._editPopup.option('visible', false);
        },

        hasEditData: function() {
            return this.hasChanges();
        },

        closeEditCell: function(isError, withoutSaveEditData) {
            const that = this;
            let result = when();
            const oldEditRowIndex = that._getVisibleEditRowIndex();

            if(!isRowEditMode(that)) {
                result = Deferred();
                this.executeOperation(result, () => {
                    this._closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData);
                    result.resolve();
                });
            }
            return result.promise();
        },

        _closeEditCellCore(isError, oldEditRowIndex, withoutSaveEditData) {
            const that = this;
            const editMode = getEditMode(that);
            const dataController = that._dataController;

            if(editMode === EDIT_MODE_CELL && that.hasChanges()) {
                if(!withoutSaveEditData) {
                    that.saveEditData().done(function(error) {
                        if(!that.hasChanges()) {
                            that.closeEditCell(!!error);
                        }
                    });
                }
            } else if(oldEditRowIndex >= 0) {
                const rowIndices = [oldEditRowIndex];

                this._resetEditRowKey();
                that._resetEditColumnName();

                that._beforeCloseEditCellInBatchMode(rowIndices);
                if(!isError) {
                    dataController.updateItems({
                        changeType: 'update',
                        rowIndices: rowIndices
                    });
                }
            }
        },

        update: function(changeType) {
            const that = this;
            const dataController = that._dataController;

            if(dataController && that._pageIndex !== dataController.pageIndex()) {
                if(changeType === 'refresh') {
                    that.refresh(true);
                }
                that._pageIndex = dataController.pageIndex();
            }
            that._updateEditButtons();
        },

        _getRowIndicesForCascadeUpdating: function(row, skipCurrentRow) {
            return skipCurrentRow ? [] : [row.rowIndex];
        },

        addDeferred: function(deferred) {
            if(this._deferreds.indexOf(deferred) < 0) {
                this._deferreds.push(deferred);
                deferred.always(() => {
                    const index = this._deferreds.indexOf(deferred);
                    if(index >= 0) {
                        this._deferreds.splice(index, 1);
                    }
                });
            }
        },

        _prepareChange: function(options, value, text) {
            const that = this;
            const newData = {};
            const oldData = options.row?.data;
            const rowKey = options.key;
            const $cellElement = $(options.cellElement);
            const editMode = getEditMode(that);
            const deferred = new Deferred();

            if(rowKey !== undefined) {
                if(editMode === EDIT_MODE_BATCH) {
                    that._applyModified($cellElement, options);
                }
                options.value = value;

                const setCellValueResult = fromPromise(options.column.setCellValue(newData, value, extend(true, {}, oldData), text));
                setCellValueResult.done(function() {
                    deferred.resolve({
                        data: newData,
                        key: rowKey,
                        oldData: oldData,
                        type: DATA_EDIT_DATA_UPDATE_TYPE
                    });
                }).fail(createFailureHandler(deferred)).fail((arg) => that._fireDataErrorOccurred(arg));

                if(isDefined(text) && options.column.displayValueMap) {
                    options.column.displayValueMap[value] = text;
                }

                that._updateRowValues(options);

                that.addDeferred(deferred);
            }

            return deferred;
        },

        _updateRowValues: function(options) {
            if(options.values) {
                const dataController = this._dataController;
                const rowIndex = dataController.getRowIndexByKey(options.key);
                const row = dataController.getVisibleRows()[rowIndex];

                if(row) {
                    options.values = row.values;
                }

                options.values[options.columnIndex] = options.value;
            }
        },

        updateFieldValue: function(options, value, text, forceUpdateRow) {
            const rowKey = options.key;
            const deferred = new Deferred();

            if(rowKey === undefined) {
                this._dataController.fireError('E1043');
            }

            if(options.column.setCellValue) {
                this._prepareChange(options, value, text).done(params => {
                    when(this._applyChange(options, params, forceUpdateRow)).always(() => {
                        deferred.resolve();
                    });
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise();
        },
        _focusPreviousEditingCellIfNeed: function(options) {
            const that = this;

            if(that.hasEditData() && !that.isEditCell(options.rowIndex, options.columnIndex)) {
                that._focusEditingCell();
                that._updateEditRow(options.row, true);
                return true;
            }
        },
        _needUpdateRow: function(column) {
            const visibleColumns = this._columnsController.getVisibleColumns();

            if(!column) {
                column = this._getEditColumn();
            }

            const isCustomSetCellValue = column && column.setCellValue !== column.defaultSetCellValue;
            const isCustomCalculateCellValue = visibleColumns.some((visibleColumn) => visibleColumn.calculateCellValue !== visibleColumn.defaultCalculateCellValue);

            return isCustomSetCellValue || isCustomCalculateCellValue;
        },
        _applyChange: function(options, params, forceUpdateRow) {
            const that = this;
            const editMode = getEditMode(that);
            const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;
            const showEditorAlways = options.column.showEditorAlways;
            const isUpdateInCellMode = editMode === EDIT_MODE_CELL && options.row && !options.row.isNewRow;
            const focusPreviousEditingCell = showEditorAlways && !forceUpdateRow && isUpdateInCellMode && that.hasEditData() && !that.isEditCell(options.rowIndex, options.columnIndex);

            if(focusPreviousEditingCell) {
                that._focusEditingCell();
                that._updateEditRow(options.row, true, isCustomSetCellValue);
                return;
            }
            that._addChange(params, options.row);
            that._updateEditButtons();

            if(showEditorAlways && !forceUpdateRow) {
                if(isUpdateInCellMode) {
                    that._setEditRowKey(options.row.key, true);
                    that._setEditColumnNameByIndex(options.columnIndex, true);

                    return that.saveEditData();
                } else if(editMode === EDIT_MODE_BATCH) {
                    forceUpdateRow = that._needUpdateRow(options.column);
                }
            }

            const row = options.row;
            if(row) {
                if(forceUpdateRow || isCustomSetCellValue) {
                    that._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
                } else if(row.update) {
                    row.update();
                }
            }
        },
        _updateEditRowCore: function(row, skipCurrentRow, isCustomSetCellValue) {
            const that = this;
            const editForm = that._editForm;
            const editMode = getEditMode(that);

            if(editMode === EDIT_MODE_POPUP) {
                if(that.option('repaintChangesOnly')) {
                    row.update && row.update(row);
                } else if(editForm) {
                    that._updateEditFormDeferred = new Deferred().done(() => editForm.repaint());
                    if(!that._updateLockCount) {
                        that._updateEditFormDeferred.resolve();
                    }
                }
            } else {
                that._dataController.updateItems({
                    changeType: 'update',
                    rowIndices: that._getRowIndicesForCascadeUpdating(row, skipCurrentRow)
                });
            }
        },

        _endUpdateCore: function() {
            this._updateEditFormDeferred && this._updateEditFormDeferred.resolve();
        },

        _updateEditRow: function(row, forceUpdateRow, isCustomSetCellValue) {
            const that = this;
            if(forceUpdateRow || !isRowEditMode(that)) {
                that._updateEditRowCore(row, !forceUpdateRow, isCustomSetCellValue);
                if(!forceUpdateRow) {
                    that._focusEditingCell();
                }
            } else {
                const deferred = new Deferred();
                that.addDeferred(deferred);
                setTimeout(function() {
                    const $focusedElement = $(domAdapter.getActiveElement());
                    const columnIndex = that._rowsView.getCellIndex($focusedElement, row.rowIndex);
                    let focusedElement = $focusedElement.get(0);
                    const selectionRange = gridCoreUtils.getSelectionRange(focusedElement);

                    that._updateEditRowCore(row, false, isCustomSetCellValue);

                    if(columnIndex >= 0) {
                        const $focusedItem = that._rowsView._getCellElement(row.rowIndex, columnIndex);
                        that._delayedInputFocus($focusedItem, function() {
                            setTimeout(function() {
                                focusedElement = domAdapter.getActiveElement();
                                if(selectionRange.selectionStart >= 0) {
                                    gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
                                }
                            });
                        });
                    }
                    deferred.resolve();
                });
            }
        },

        _addChange: function(options, row) {
            const changes = [...this.getChanges()];
            let index = gridCoreUtils.getIndexByKey(options.key, changes);

            if(index < 0) {
                index = changes.length;

                this._addInternalData({
                    key: options.key,
                    oldData: options.oldData
                });

                delete options.oldData;

                changes.push(options);
            }

            const change = { ...changes[index] };

            if(change) {
                if(options.data) {
                    change.data = createObjectWithChanges(change.data, options.data);
                }
                if((!change.type || !options.data) && options.type) {
                    change.type = options.type;
                }
                if(row) {
                    row.oldData = this._getOldData(row.key);
                    row.data = createObjectWithChanges(row.data, options.data);
                }
            }

            changes[index] = change;

            this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);

            return index;
        },

        _getFormEditItemTemplate: function(cellOptions, column) {
            return column.editCellTemplate || getDefaultEditorTemplate(this);
        },

        renderFormEditTemplate: function(detailCellOptions, item, form, container, isReadOnly) {
            const that = this;
            const $container = $(container);
            const column = item.column;
            const editorType = getEditorType(item);
            const rowData = detailCellOptions?.row.data;
            const cellOptions = extend({}, detailCellOptions, {
                data: rowData,
                cellElement: null,
                isOnForm: true,
                item: item,
                column: extend({}, column, { editorType: editorType, editorOptions: item.editorOptions }),
                id: form.getItemID(item.name || item.dataField),
                columnIndex: column.index,
                setValue: !isReadOnly && column.allowEditing && function(value) {
                    that.updateFieldValue(cellOptions, value);
                }
            });

            cellOptions.value = column.calculateCellValue(rowData);

            const template = that._getFormEditItemTemplate.bind(that)(cellOptions, column);
            that._rowsView.renderTemplate($container, template, cellOptions, !!$container.closest(getWindow().document).length).done(() => {
                that._rowsView._updateCell($container, cellOptions);
            });
            return cellOptions;
        },

        getFormEditorTemplate: function(cellOptions, item) {
            const that = this;
            const column = this.component.columnOption(item.dataField);

            return function(options, container) {
                const $container = $(container);

                cellOptions.row.watch && cellOptions.row.watch(function() {
                    return column.selector(cellOptions.row.data);
                }, function() {
                    let $editorElement = $container.find('.dx-widget').first();
                    let validator = $editorElement.data('dxValidator');
                    const validatorOptions = validator?.option();

                    $container.contents().remove();
                    cellOptions = that.renderFormEditTemplate.bind(that)(cellOptions, item, options.component, $container);

                    $editorElement = $container.find('.dx-widget').first();
                    validator = $editorElement.data('dxValidator');
                    if(validatorOptions && !validator) {
                        $editorElement.dxValidator({
                            validationRules: validatorOptions.validationRules,
                            validationGroup: validatorOptions.validationGroup,
                            dataGetter: validatorOptions.dataGetter
                        });
                    }
                });

                cellOptions = that.renderFormEditTemplate.bind(that)(cellOptions, item, options.component, $container);
            };
        },

        getEditFormOptions: function(detailOptions) {
            const userCustomizeItem = this.option('editing.form.customizeItem');
            const editFormItemClass = this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS);
            let items = this.option('editing.form.items');
            const isCustomEditorType = {};
            const that = this;

            if(!items) {
                const columns = this.getController('columns').getColumns();
                items = [];
                each(columns, function(_, column) {
                    if(!column.isBand && !column.type) {
                        items.push({
                            column: column,
                            name: column.name,
                            dataField: column.dataField
                        });
                    }
                });
            } else {
                forEachFormItems(items, (item) => {
                    const itemId = item?.name || item?.dataField;

                    if(itemId) {
                        isCustomEditorType[itemId] = !!item.editorType;
                    }
                });
            }

            return {
                items,
                formID: 'dx-' + new Guid(),
                customizeItem: function(item) {
                    let column;
                    const itemId = item.name || item.dataField;

                    if(item.column || itemId) {
                        column = item.column || that._columnsController.columnOption(item.name ? 'name:' + item.name : 'dataField:' + item.dataField);
                    }
                    if(column) {
                        item.label = item.label || {};
                        item.label.text = item.label.text || column.caption;
                        item.template = item.template || that.getFormEditorTemplate(detailOptions, item);
                        item.column = column;
                        item.isCustomEditorType = isCustomEditorType[itemId];
                        if(column.formItem) {
                            extend(item, column.formItem);
                        }
                        if(item.isRequired === undefined && column.validationRules) {
                            item.isRequired = column.validationRules.some(function(rule) { return rule.type === 'required'; });
                            item.validationRules = [];
                        }

                        const itemVisible = isDefined(item.visible) ? item.visible : true;
                        if(!that._firstFormItem && itemVisible) {
                            that._firstFormItem = item;
                        }
                    }
                    userCustomizeItem && userCustomizeItem.call(this, item);
                    item.cssClass = isString(item.cssClass) ? item.cssClass + ' ' + editFormItemClass : editFormItemClass;
                }
            };
        },

        getEditFormTemplate: function() {
            const that = this;

            return function($container, detailOptions, renderFormOnly) {
                const editFormOptions = that.option('editing.form');
                const baseEditFormOptions = that.getEditFormOptions(detailOptions);

                that._firstFormItem = undefined;

                that._editForm = that._createComponent($('<div>').appendTo($container), Form, extend({}, editFormOptions, baseEditFormOptions));

                if(!renderFormOnly) {
                    const $buttonsContainer = $('<div>').addClass(that.addWidgetPrefix(FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);
                    that._createComponent($('<div>').appendTo($buttonsContainer), Button, that._getSaveButtonConfig());
                    that._createComponent($('<div>').appendTo($buttonsContainer), Button, that._getCancelButtonConfig());
                }

                that._editForm.on('contentReady', function() {
                    that._editPopup && that._editPopup.repaint();
                });
            };
        },

        getColumnTemplate: function(options) {
            const that = this;
            const column = options.column;
            const rowIndex = options.row && options.row.rowIndex;
            let template;
            const isRowMode = isRowEditMode(that);
            const isRowEditing = that.isEditRow(rowIndex);
            const isCellEditing = that.isEditCell(rowIndex, options.columnIndex);
            let editingStartOptions;

            if((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing)) &&
                (options.rowType === 'data' || options.rowType === 'detailAdaptive') && !column.command) {
                const allowUpdating = that.allowUpdating(options);
                if(((allowUpdating || isRowEditing) && column.allowEditing || isCellEditing) && (isRowMode && isRowEditing || !isRowMode)) {
                    if(column.showEditorAlways && !isRowMode) {
                        editingStartOptions = {
                            cancel: false,
                            key: options.row.isNewRow ? undefined : options.row.key,
                            data: options.row.data,
                            column: column
                        };
                        that._isEditingStart(editingStartOptions);
                    }
                    if(!editingStartOptions || !editingStartOptions.cancel) {
                        options.setValue = function(value, text) {
                            that.updateFieldValue(options, value, text);
                        };
                    }
                }
                template = column.editCellTemplate || getDefaultEditorTemplate(that);
            } else if(column.command === 'detail' && options.rowType === 'detail' && isRowEditing) {
                template = that.getEditFormTemplate(options);
            }

            return template;
        },

        _createButton: function($container, button, options) {
            const that = this;
            let icon = EDIT_ICON_CLASS[button.name];
            const useIcons = that.option('editing.useIcons');
            let $button = $('<a>')
                .attr('href', '#')
                .addClass(LINK_CLASS)
                .addClass(button.cssClass);

            if(button.template) {
                that._rowsView.renderTemplate($container, button.template, options, true);
            } else {
                if(useIcons && icon || button.icon) {
                    icon = button.icon || icon;
                    const iconType = iconUtils.getImageSourceType(icon);

                    if(iconType === 'image' || iconType === 'svg') {
                        $button = iconUtils.getImageContainer(icon).addClass(button.cssClass);
                    } else {
                        $button.addClass('dx-icon' + (iconType === 'dxIcon' ? '-' : ' ') + icon).attr('title', button.text);
                    }

                    $button.addClass('dx-link-icon');
                    $container.addClass(COMMAND_EDIT_WITH_ICONS_CLASS);

                    const localizationName = this.getButtonLocalizationNames()[button.name];
                    localizationName && $button.attr('aria-label', messageLocalization.format(localizationName));
                } else {
                    $button.text(button.text);
                }

                if(isDefined(button.hint)) {
                    $button.attr('title', button.hint);
                }

                eventsEngine.on($button, addNamespace('click', EDITING_NAMESPACE), that.createAction(function(e) {
                    button.onClick.call(button, extend({}, e, { row: options.row, column: options.column }));
                    e.event.preventDefault();
                    e.event.stopPropagation();
                }));
                $container.append($button, '&nbsp;');
            }
        },

        getButtonLocalizationNames() {
            return {
                edit: 'dxDataGrid-editingEditRow',
                save: 'dxDataGrid-editingSaveRowChanges',
                delete: 'dxDataGrid-editingDeleteRow',
                undelete: 'dxDataGrid-editingUndeleteRow',
                cancel: 'dxDataGrid-editingCancelRowChanges'
            };
        },

        prepareEditButtons: function(headerPanel) {
            const that = this;
            const editingOptions = that.option('editing') || {};
            const editingTexts = that.option('editing.texts') || {};
            const titleButtonTextByClassNames = {
                'revert': editingTexts.cancelAllChanges,
                'save': editingTexts.saveAllChanges,
                'addRow': editingTexts.addRow
            };
            const classNameButtonByNames = {
                'revert': 'cancel',
                'save': 'save',
                'addRow': 'addrow'
            };
            const buttonItems = [];

            const prepareButtonItem = function(name, methodName, sortIndex) {
                const className = classNameButtonByNames[name];
                const onInitialized = function(e) {
                    $(e.element).addClass(headerPanel._getToolbarButtonClass(EDIT_BUTTON_CLASS + ' ' + that.addWidgetPrefix(className) + '-button'));
                };
                const hintText = titleButtonTextByClassNames[name];
                const isButtonDisabled = (className === 'save' || className === 'cancel') && !that.hasChanges();

                return {
                    widget: 'dxButton',
                    options: {
                        onInitialized: onInitialized,
                        icon: 'edit-button-' + className,
                        disabled: isButtonDisabled,
                        onClick: function() {
                            setTimeout(function() {
                                that[methodName]();
                            });
                        },
                        text: hintText,
                        hint: hintText
                    },
                    showText: 'inMenu',
                    name: name + 'Button',
                    location: 'after',
                    locateInMenu: 'auto',
                    sortIndex: sortIndex
                };
            };

            if(editingOptions.allowAdding) {
                buttonItems.push(prepareButtonItem('addRow', 'addRow', 20));
            }

            if((editingOptions.allowUpdating || editingOptions.allowAdding || editingOptions.allowDeleting) && getEditMode(that) === EDIT_MODE_BATCH) {
                buttonItems.push(prepareButtonItem('save', 'saveEditData', 21));
                buttonItems.push(prepareButtonItem('revert', 'cancelEditData', 22));
            }

            return buttonItems;
        },

        highlightDataCell: function($cell, parameters) {
            const cellModified = this.isCellModified(parameters);
            cellModified && parameters.column.setCellValue && $cell.addClass(CELL_MODIFIED);
        },

        _afterInsertRow: function() { },

        _beforeSaveEditData: function(change) {
            if(change && !isDefined(change.key) && isDefined(change.type)) {
                return true;
            }
        },

        _afterSaveEditData: function() { },

        _beforeCancelEditData: function() { },

        _allowEditAction: function(actionName, options) {
            let allowEditAction = this.option('editing.' + actionName);

            if(isFunction(allowEditAction)) {
                allowEditAction = allowEditAction({ component: this.component, row: options.row });
            }

            return allowEditAction;
        },

        allowUpdating: function(options, eventName) {
            const startEditAction = this.option('editing.startEditAction') || DEFAULT_START_EDIT_ACTION;
            const needCallback = arguments.length > 1 ? startEditAction === eventName || eventName === 'down' : true;

            return needCallback && this._allowEditAction('allowUpdating', options);
        },

        allowDeleting: function(options) {
            return this._allowEditAction('allowDeleting', options);
        },

        isCellModified: function(parameters) {
            const columnIndex = parameters.columnIndex;
            const modifiedValues = parameters.row && (parameters.row.isNewRow ? parameters.row.values : parameters.row.modifiedValues);
            return !!modifiedValues && modifiedValues[columnIndex] !== undefined;
        }
    };
})());

export default {
    defaultOptions: function() {
        return {


            editing: {
                mode: 'row', // "batch"
                refreshMode: 'full',
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
                    confirmDeleteTitle: ''
                },
                form: {
                    colCount: 2
                },

                popup: {},

                startEditAction: 'click',

                editRowKey: null,

                editColumnName: null,

                changes: []
            }
        };
    },
    controllers: {
        editing: EditingController
    },
    extenders: {
        controllers: {
            data: {
                init: function() {
                    this._editingController = this.getController('editing');
                    this.callBase();
                },
                reload: function(full, repaintChangesOnly) {
                    !repaintChangesOnly && this._editingController.refresh();

                    return this.callBase.apply(this, arguments);
                },
                repaintRows: function() {
                    if(this.getController('editing').isSaving()) return;
                    return this.callBase.apply(this, arguments);
                },
                _updateEditRow: function(items) {
                    const editingController = this._editingController;
                    const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
                    const editRowIndex = gridCoreUtils.getIndexByKey(editRowKey, items);
                    const editItem = items[editRowIndex];

                    if(editItem) {
                        editItem.isEditing = true;
                        if(editingController.getEditMode() === EDIT_MODE_FORM) {
                            editItem.rowType = 'detail';
                        }
                    }
                },
                _updateItemsCore: function(change) {
                    this.callBase(change);
                    this._updateEditRow(this.items());
                },
                _applyChangeUpdate: function(change) {
                    this._updateEditRow(change.items);
                    this.callBase(change);
                },
                _applyChangesOnly: function(change) {
                    this._updateEditRow(change.items);
                    this.callBase(change);
                },
                _processItems: function(items, change) {
                    items = this._editingController.processItems(items, change);
                    return this.callBase(items, change);
                },
                _processDataItem: function(dataItem, options) {
                    this._editingController.processDataItem(dataItem, options, this.generateDataValues);
                    return this.callBase(dataItem, options);
                },
                _processItem: function(item, options) {
                    item = this.callBase(item, options);

                    if(item.isNewRow) {
                        options.dataIndex--;
                        delete item.dataIndex;
                    }

                    return item;
                },
                _getChangedColumnIndices: function(oldItem, newItem, rowIndex, isLiveUpdate) {
                    const editingController = this.getController('editing');
                    const isRowEditMode = editingController.isRowEditMode();

                    if(oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed || (isRowEditMode && oldItem.isEditing !== newItem.isEditing)) {
                        return;
                    }

                    return this.callBase.apply(this, arguments);
                },
                _isCellChanged: function(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
                    const editingController = this.getController('editing');
                    const cell = oldRow.cells && oldRow.cells[columnIndex];
                    const isEditing = editingController && editingController.isEditCell(visibleRowIndex, columnIndex);

                    if(isLiveUpdate && isEditing) {
                        return false;
                    }

                    if(cell && cell.column && !cell.column.showEditorAlways && cell.isEditing !== isEditing) {
                        return true;
                    }

                    return this.callBase.apply(this, arguments);
                }
            }
        },
        views: {
            rowsView: {
                init: function() {
                    this.callBase();
                    this._editingController = this.getController('editing');
                },
                getCellElements: function(rowIndex) {
                    const $cellElements = this.callBase(rowIndex);
                    const editingController = this._editingController;
                    const editForm = editingController.getEditForm();
                    const editFormRowIndex = editingController.getEditFormRowIndex();

                    if(editFormRowIndex === rowIndex && $cellElements && editForm) {
                        return editForm.$element().find('.' + this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS) + ', .' + BUTTON_CLASS);
                    }

                    return $cellElements;
                },
                getCellIndex: function($cell, rowIndex) {
                    if(!$cell.is('td') && rowIndex >= 0) {
                        const $cellElements = this.getCellElements(rowIndex);
                        let cellIndex = -1;

                        each($cellElements, function(index, cellElement) {
                            if($(cellElement).find($cell).length) {
                                cellIndex = index;
                            }
                        });

                        return cellIndex;
                    }

                    return this.callBase.apply(this, arguments);
                },
                _getVisibleColumnIndex: function($cells, rowIndex, columnIdentifier) {
                    const editFormRowIndex = this._editingController.getEditFormRowIndex();

                    if(editFormRowIndex === rowIndex && isString(columnIdentifier)) {
                        const column = this._columnsController.columnOption(columnIdentifier);
                        return this._getEditFormEditorVisibleIndex($cells, column);
                    }

                    return this.callBase.apply(this, arguments);
                },

                _getEditFormEditorVisibleIndex: function($cells, column) {
                    let visibleIndex = -1;

                    each($cells, function(index, cellElement) {
                        const item = $(cellElement).find('.dx-field-item-content').data('dx-form-item');
                        if(item && item.column && column && item.column.index === column.index) {
                            visibleIndex = index;
                            return false;
                        }
                    });
                    return visibleIndex;
                },

                publicMethods: function() {
                    return this.callBase().concat(['cellValue']);
                },
                _getCellTemplate: function(options) {
                    const that = this;
                    const template = that._editingController.getColumnTemplate(options);

                    return template || that.callBase(options);
                },
                _isNativeClick: function() {
                    return (devices.real().ios || devices.real().android) && this.option('editing.allowUpdating');
                },
                _createTable: function() {
                    const that = this;
                    const $table = that.callBase.apply(that, arguments);

                    if(!isRowEditMode(that) && that.option('editing.allowUpdating')) {

                        eventsEngine.on($table, addNamespace(holdEvent.name, 'dxDataGridRowsView'), 'td:not(.' + EDITOR_CELL_CLASS + ')', that.createAction(function() {
                            const editingController = that._editingController;

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
                        const isEditRow = editingController.isEditRow(row.rowIndex);
                        const isRowRemoved = !!row.removed;
                        const isRowInserted = !!row.isNewRow;
                        const isRowModified = !!row.modified;

                        if(getEditMode(this) === EDIT_MODE_BATCH) {
                            isRowRemoved && $row.addClass(ROW_REMOVED);
                        } else {
                            isEditRow && $row.addClass(EDIT_ROW);
                        }

                        isRowInserted && $row.addClass(ROW_INSERTED);
                        isRowModified && $row.addClass(ROW_MODIFIED);

                        if(isEditRow || isRowInserted || isRowRemoved) {
                            $row.removeClass(ROW_SELECTED);
                        }

                        if(isEditRow && row.rowType === 'detail') {
                            $row.addClass(this.addWidgetPrefix(EDIT_FORM_CLASS));
                        }
                    }
                    return $row;
                },
                _getColumnIndexByElement: function($element) {
                    let $tableElement = $element.closest('table');
                    const $tableElements = this.getTableElements();

                    while($tableElement.length && !$tableElements.filter($tableElement).length) {
                        $element = $tableElement.closest('td');
                        $tableElement = $element.closest('table');
                    }

                    return this._getColumnIndexByElementCore($element);
                },
                _getColumnIndexByElementCore: function($element) {
                    const $targetElement = $element.closest('.' + ROW_CLASS + '> td:not(.dx-master-detail-cell)');

                    return this.getCellIndex($targetElement);
                },
                _editCellByClick: function(e, eventName) {
                    const that = this;
                    const editingController = that._editingController;
                    const $targetElement = $(e.event.target);
                    const columnIndex = that._getColumnIndexByElement($targetElement);
                    const row = that._dataController.items()[e.rowIndex];
                    const allowUpdating = editingController.allowUpdating({ row: row }, eventName) || row && row.isNewRow;
                    const column = that._columnsController.getVisibleColumns()[columnIndex];
                    const allowEditing = allowUpdating && column && (column.allowEditing || editingController.isEditCell(e.rowIndex, columnIndex));
                    const startEditAction = that.option('editing.startEditAction') || 'click';

                    if(eventName === 'down') {
                        return column && column.showEditorAlways && allowEditing && editingController.editCell(e.rowIndex, columnIndex);
                    }

                    if(eventName === 'click' && startEditAction === 'dblClick' && !editingController.isEditCell(e.rowIndex, columnIndex)) {
                        editingController.closeEditCell();
                    }

                    if(allowEditing && eventName === startEditAction) {
                        return editingController.editCell(e.rowIndex, columnIndex) || editingController.isEditRow(e.rowIndex);
                    }
                },
                _rowPointerDown: function(e) {
                    this._pointerDownTimeout = setTimeout(() => {
                        this._editCellByClick(e, 'down');
                    });
                },
                _rowClick: function(e) {
                    const isEditForm = $(e.rowElement).hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS));

                    e.event[TARGET_COMPONENT_NAME] = this.component;

                    if(!this._editCellByClick(e, 'click') && !isEditForm) {
                        this.callBase.apply(this, arguments);
                    }
                },
                _rowDblClick: function(e) {
                    if(!this._editCellByClick(e, 'dblClick')) {
                        this.callBase.apply(this, arguments);
                    }
                },
                _cellPrepared: function($cell, parameters) {
                    const editingController = this._editingController;
                    const isCommandCell = !!parameters.column.command;
                    const isEditableCell = parameters.setValue;
                    const isEditRow = editingController.isEditRow(parameters.rowIndex);
                    const isEditing = isEditingCell(isEditRow, parameters);

                    if(isEditingOrShowEditorAlwaysDataCell(isEditRow, parameters)) {
                        const alignment = parameters.column.alignment;

                        $cell
                            .toggleClass(this.addWidgetPrefix(READONLY_CLASS), !isEditableCell)
                            .toggleClass(CELL_FOCUS_DISABLED_CLASS, !isEditableCell);


                        if(alignment) {
                            $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', alignment);
                        }
                    }

                    if(isEditing) {
                        this._editCellPrepared($cell);
                    }

                    if(parameters.column && !isCommandCell) {
                        editingController.highlightDataCell($cell, parameters);
                    }

                    this.callBase.apply(this, arguments);
                },
                _editCellPrepared: function($cell) { },
                _formItemPrepared: function() { },
                _isFormItem: function(parameters) {
                    const isDetailRow = parameters.rowType === 'detail' || parameters.rowType === 'detailAdaptive';
                    const isPopupEditing = parameters.rowType === 'data' && getEditMode(this) === 'popup';
                    return (isDetailRow || isPopupEditing) && parameters.item;
                },
                _updateCell: function($cell, parameters) {
                    if(this._isFormItem(parameters)) {
                        this._formItemPrepared(parameters, $cell);
                    } else {
                        this.callBase($cell, parameters);
                    }
                },
                _update: function(change) {
                    this.callBase(change);
                    if(change.changeType === 'updateSelection') {
                        this.getTableElements().children('tbody').children('.' + EDIT_ROW).removeClass(ROW_SELECTED);
                    }
                },
                _getCellOptions: function(options) {
                    const cellOptions = this.callBase(options);

                    cellOptions.isEditing = this._editingController.isEditCell(cellOptions.rowIndex, cellOptions.columnIndex);

                    return cellOptions;
                },
                _createCell: function(options) {
                    const $cell = this.callBase(options);
                    const isEditRow = this._editingController.isEditRow(options.rowIndex);

                    isEditingOrShowEditorAlwaysDataCell(isEditRow, options) && $cell.addClass(EDITOR_CELL_CLASS);

                    return $cell;
                },
                _renderCellContent: function($cell, options) {
                    if(options.rowType === 'data' && getEditMode(this) === EDIT_MODE_POPUP && options.row.visible === false) {
                        return;
                    }

                    this.callBase.apply(this, arguments);
                },
                cellValue: function(rowIndex, columnIdentifier, value, text) {
                    const cellOptions = this.getCellOptions(rowIndex, columnIdentifier);

                    if(cellOptions) {
                        if(value === undefined) {
                            return cellOptions.value;
                        } else {
                            this._editingController.updateFieldValue(cellOptions, value, text, true);
                        }
                    }
                },
                dispose: function() {
                    this.callBase.apply(this, arguments);
                    clearTimeout(this._pointerDownTimeout);
                },
                _renderCore: function() {
                    this.callBase.apply(this, arguments);

                    this._editingController._focusEditorIfNeed();
                }
            },

            headerPanel: {
                _getToolbarItems: function() {
                    const items = this.callBase();
                    const editButtonItems = this.getController('editing').prepareEditButtons(this);

                    return editButtonItems.concat(items);
                },

                optionChanged: function(args) {
                    const fullName = args.fullName;
                    switch(args.name) {
                        case 'editing': {
                            const excludedOptions = [EDITING_POPUP_OPTION_NAME, EDITING_CHANGES_OPTION_NAME, EDITING_EDITCOLUMNNAME_OPTION_NAME, EDITING_EDITROWKEY_OPTION_NAME];
                            const shouldInvalidate = fullName && !excludedOptions.some(optionName => optionName === fullName);

                            shouldInvalidate && this._invalidate();
                            this.callBase(args);
                            break;
                        }
                        default:
                            this.callBase(args);
                    }
                },

                isVisible: function() {
                    const that = this;
                    const editingOptions = that.getController('editing').option('editing');

                    return that.callBase() || (editingOptions && (editingOptions.allowAdding || ((editingOptions.allowUpdating || editingOptions.allowDeleting) && editingOptions.mode === EDIT_MODE_BATCH)));

                }
            }
        }
    }
};
