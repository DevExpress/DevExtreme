import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import { resetActiveElement } from '../../core/utils/dom';
import { isDefined, isObject, isFunction, isEmptyObject } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import modules from './ui.grid_core.modules';
import { name as clickEventName } from '../../events/click';
import pointerEvents from '../../events/pointer';
import gridCoreUtils from './ui.grid_core.utils';
import { createObjectWithChanges } from '../../data/array_utils';
import { addNamespace } from '../../events/utils/index';
import { confirm } from '../dialog';
import messageLocalization from '../../localization/message';
import devices from '../../core/devices';
import { when, Deferred, fromPromise } from '../../core/utils/deferred';
import { equalByValue, noop } from '../../core/utils/common';
import * as iconUtils from '../../core/utils/icon';
import {
    EDITOR_CELL_CLASS,
    ROW_CLASS,
    EDIT_FORM_CLASS,
    DATA_EDIT_DATA_INSERT_TYPE,
    DATA_EDIT_DATA_REMOVE_TYPE,
    EDITING_POPUP_OPTION_NAME,
    EDITING_EDITROWKEY_OPTION_NAME,
    EDITING_EDITCOLUMNNAME_OPTION_NAME,
    TARGET_COMPONENT_NAME,
    EDITORS_INPUT_SELECTOR,
    FOCUSABLE_ELEMENT_SELECTOR,
    EDIT_MODE_ROW,
    EDIT_MODES,
    ROW_BASED_MODES,
    FIRST_NEW_ROW_POSITION,
    LAST_NEW_ROW_POSITION,
    PAGE_BOTTOM_NEW_ROW_POSITION,
    PAGE_TOP_NEW_ROW_POSITION,
    VIEWPORT_BOTTOM_NEW_ROW_POSITION,
    VIEWPORT_TOP_NEW_ROW_POSITION
} from './ui.grid_core.editing_constants';
import { deepExtendArraySafe } from '../../core/utils/object';

const READONLY_CLASS = 'readonly';
const LINK_CLASS = 'dx-link';
const ROW_SELECTED = 'dx-selection';
const EDIT_BUTTON_CLASS = 'dx-edit-button';
const COMMAND_EDIT_CLASS = 'dx-command-edit';
const COMMAND_EDIT_WITH_ICONS_CLASS = COMMAND_EDIT_CLASS + '-with-icons';


const INSERT_INDEX = '__DX_INSERT_INDEX__';
const ROW_INSERTED = 'dx-row-inserted';
const ROW_MODIFIED = 'dx-row-modified';
const CELL_MODIFIED = 'dx-cell-modified';
const EDITING_NAMESPACE = 'dxDataGridEditing';

const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

const DATA_EDIT_DATA_UPDATE_TYPE = 'update';

const DEFAULT_START_EDIT_ACTION = 'click';

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

const EDITING_CHANGES_OPTION_NAME = 'editing.changes';

const createFailureHandler = function(deferred) {
    return function(arg) {
        const error = arg instanceof Error ? arg : new Error(arg && String(arg) || 'Unknown error');
        deferred.reject(error);
    };
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

    return {
        init: function() {
            this._columnsController = this.getController('columns');
            this._dataController = this.getController('data');
            this._rowsView = this.getView('rowsView');
            this._lastOperation = null;
            // this contains the value of 'editing.changes' option, to check if it has changed in onOptionChanged
            this._changes = [];

            if(this._deferreds) {
                this._deferreds.forEach(d => d.reject('cancel'));
            }
            this._deferreds = [];

            if(!this._dataChangedHandler) {
                this._dataChangedHandler = this._handleDataChanged.bind(this);
                this._dataController.changed.add(this._dataChangedHandler);
            }

            if(!this._saveEditorHandler) {
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

            if(!this._internalState) {
                this._internalState = [];
            }

            this.component._optionsByReference[EDITING_EDITROWKEY_OPTION_NAME] = true;
            this.component._optionsByReference[EDITING_CHANGES_OPTION_NAME] = true;
        },

        getEditMode: function() {
            const editMode = this.option('editing.mode');

            if(EDIT_MODES.indexOf(editMode) !== -1) {
                return editMode;
            }

            return EDIT_MODE_ROW;
        },

        _getDefaultEditorTemplate: function() {
            return (container, options) => {
                const $editor = $('<div>').appendTo(container);

                this.getController('editorFactory').createEditor($editor, extend({}, options.column, {
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
        },

        _getNewRowPosition: function() {
            const newRowPosition = this.option('editing.newRowPosition');
            const scrollingMode = this.option('scrolling.mode');

            if(scrollingMode === 'virtual') {
                switch(newRowPosition) {
                    case PAGE_TOP_NEW_ROW_POSITION:
                        return VIEWPORT_TOP_NEW_ROW_POSITION;
                    case PAGE_BOTTOM_NEW_ROW_POSITION:
                        return VIEWPORT_BOTTOM_NEW_ROW_POSITION;
                    default:
                        return newRowPosition;
                }
            }

            return newRowPosition;
        },

        getChanges: function() {
            return this.option(EDITING_CHANGES_OPTION_NAME);
        },

        getInsertRowCount: function() {
            const changes = this.option(EDITING_CHANGES_OPTION_NAME);
            return changes.filter(change => change.type === 'insert').length;
        },

        resetChanges: function() {
            const changes = this.getChanges();
            const needReset = changes?.length;
            if(needReset) {
                this._silentOption(EDITING_CHANGES_OPTION_NAME, []);
            }
        },

        _getInternalData: function(key) {
            return this._internalState.filter(item => equalByValue(item.key, key))[0];
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

        _needToCloseEditableCell: noop,

        _closeEditItem: noop,

        _handleDataChanged: noop,

        _isDefaultButtonVisible: function(button, options) {
            let result = true;

            switch(button.name) {
                case 'delete':
                    result = this.allowDeleting(options);
                    break;
                case 'undelete':
                    result = false;
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

        _isButtonDisabled: function(button, options) {
            const disabled = button.disabled;

            return isFunction(disabled) ? disabled.call(button, { component: options.component, row: options.row, column: options.column }) : !!disabled;
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
                cssClass: EDIT_LINK_CLASS[buttonName]
            }, {
                onClick: methodName && ((e) => {
                    const event = e.event;

                    event.stopPropagation();
                    event.preventDefault();
                    setTimeout(() => {
                        options.row && allowAction && this[methodName] && this[methodName](options.row.rowIndex);
                    });
                })
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

        _renderEditingButtons: function($container, buttons, options, change) {
            buttons.forEach((button) => {
                if(this._isButtonVisible(button, options)) {
                    this._createButton($container, button, options, change);
                }
            });
        },

        _getEditCommandCellTemplate: function() {
            return (container, options, change) => {
                const $container = $(container);

                if(options.rowType === 'data') {
                    const buttons = this._getEditingButtons(options);

                    this._renderEditingButtons($container, buttons, options, change);

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

        isRowBasedEditMode: function() {
            const editMode = this.getEditMode();
            return ROW_BASED_MODES.indexOf(editMode) !== -1;
        },

        getFirstEditableColumnIndex: function() {
            const columnsController = this.getController('columns');
            let columnIndex;

            const visibleColumns = columnsController.getVisibleColumns();
            each(visibleColumns, function(index, column) {
                if(column.allowEditing) {
                    columnIndex = index;
                    return false;
                }
            });

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

        _silentOption: function(name, value) {
            if(name === 'editing.changes') {
                this._changes = deepExtendArraySafe([], value);
            }

            this.callBase.apply(this, arguments);
        },

        optionChanged: function(args) {
            if(args.name === 'editing') {
                const fullName = args.fullName;

                if(fullName === EDITING_EDITROWKEY_OPTION_NAME) {
                    this._handleEditRowKeyChange(args);
                } else if(fullName === EDITING_CHANGES_OPTION_NAME) {
                    // to prevent render on optionChanged called by two-way binding - T1128881
                    const isEqual = equalByValue(args.value, this._changes, -1);

                    if(!isEqual) {
                        this._changes = deepExtendArraySafe([], args.value);
                        this._handleChangesChange(args);
                    }
                } else if(!args.handled) {
                    this._columnsController.reinit();
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

            if(isDefined(args.value)) {
                if(args.value !== args.previousValue) {
                    this._editRowFromOptionChanged(rowIndex, oldRowIndex);
                }
            } else {
                this.cancelEditData();
            }
        },

        _handleChangesChange: function(args) {
            const dataController = this._dataController;
            const changes = args.value;

            if(!args.value.length && !args.previousValue.length) {
                return;
            }

            changes.forEach(change => {
                if(change.type === 'insert') {
                    this._addInsertInfo(change);
                } else {
                    const items = dataController.items();
                    const rowIndex = dataController.getRowIndexByKey(change.key);

                    this._addInternalData({ key: change.key, oldData: items[rowIndex]?.data });
                }
            });

            dataController.updateItems({
                repaintChangesOnly: true,
                isLiveUpdate: false,
                isOptionChanged: true
            });
        },

        publicMethods: function() {
            return ['addRow', 'deleteRow', 'undeleteRow', 'editRow', 'saveEditData', 'cancelEditData', 'hasEditData'];
        },

        refresh: function() {
            if(!isDefined(this._pageIndex)) {
                return;
            }

            this._refreshCore.apply(this, arguments);
        },

        _refreshCore: noop,

        isEditing: function() {
            const isEditRowKeyDefined = isDefined(this.option(EDITING_EDITROWKEY_OPTION_NAME));

            return isEditRowKeyDefined;
        },

        isEditRow: function() {
            return false;
        },

        _setEditRowKey: function(value, silent) {
            if(silent) {
                this._silentOption(EDITING_EDITROWKEY_OPTION_NAME, value);
            } else {
                this.option(EDITING_EDITROWKEY_OPTION_NAME, value);
            }

            if(this._refocusEditCell) {
                this._refocusEditCell = false;
                this._focusEditingCell();
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
            return -1;
        },

        isEditRowByIndex(rowIndex) {
            const key = this._dataController.getKeyByRowIndex(rowIndex);
            // Vitik: performance optimization equalByValue take O(1)
            const isKeyEqual = isDefined(key) && equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key);
            if(isKeyEqual) {
                // Vitik: performance optimization _getVisibleEditRowIndex take O(n)
                return this._getVisibleEditRowIndex() === rowIndex;
            }
            return isKeyEqual;
        },

        isEditCell: function(visibleRowIndex, columnIndex) {
            return this.isEditRowByIndex(visibleRowIndex) && this._getVisibleEditColumnIndex() === columnIndex;
        },

        getPopupContent: noop,

        _isProcessedItem: function(item) {
            return false;
        },

        _getInsertRowIndex: function(items, change, isProcessedItems) {
            let result = -1;
            const dataController = this._dataController;
            const key = this._getInsertAfterOrBeforeKey(change);

            if(!isDefined(key) && items.length === 0) {
                result = 0;
            } else if(isDefined(key)) {
                items.some((item, index) => {
                    const isProcessedItem = isProcessedItems || this._isProcessedItem(item);

                    if(isObject(item)) {
                        if(isProcessedItem || isDefined(item[INSERT_INDEX])) {
                            if(equalByValue(item.key, key)) {
                                result = index;
                            }
                        } else if(equalByValue(dataController.keyOf(item), key)) {
                            result = index;
                        }
                    }

                    if(result >= 0) {
                        const nextItem = items[result + 1];

                        if(nextItem && (nextItem.rowType === 'detail' || nextItem.rowType === 'detailAdaptive') && isDefined(change.insertAfterKey)) {
                            return;
                        }

                        if(isDefined(change.insertAfterKey)) {
                            result += 1;
                        }
                        return true;
                    }
                });
            }

            return result;
        },

        _generateNewItem: function(key) {
            const item = {
                key: key
            };
            const insertInfo = this._getInternalData(key)?.insertInfo;

            if(insertInfo?.[INSERT_INDEX]) {
                item[INSERT_INDEX] = insertInfo[INSERT_INDEX];
            }

            return item;
        },
        _getLoadedRowIndex: function(items, change, isProcessedItems) {
            let loadedRowIndex = this._getInsertRowIndex(items, change, isProcessedItems);
            const dataController = this._dataController;

            if(loadedRowIndex < 0) {
                const newRowPosition = this._getNewRowPosition();
                const pageIndex = dataController.pageIndex();
                const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

                if(newRowPosition !== LAST_NEW_ROW_POSITION && pageIndex === 0 && !isDefined(insertAfterOrBeforeKey)) {
                    loadedRowIndex = 0;
                } else if(newRowPosition === LAST_NEW_ROW_POSITION && dataController.isLastPageLoaded()) {
                    loadedRowIndex = items.length;
                }
            }

            return loadedRowIndex;
        },
        processItems: function(items, e) {
            const changeType = e.changeType;

            this.update(changeType);

            const changes = this.getChanges();
            changes.forEach(change => {
                const isInsert = change.type === DATA_EDIT_DATA_INSERT_TYPE;

                if(!isInsert) {
                    return;
                }

                let key = change.key;

                let insertInfo = this._getInternalData(key)?.insertInfo;
                if(!isDefined(key) || !isDefined(insertInfo)) {
                    insertInfo = this._addInsertInfo(change);
                    key = insertInfo.key;
                }

                const loadedRowIndex = this._getLoadedRowIndex(items, change);
                const item = this._generateNewItem(key);

                if(loadedRowIndex >= 0) {
                    items.splice(loadedRowIndex, 0, item);
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
                this._processDataItemCore(item, changes[editIndex], key, columns, generateDataValues);
            }
        },

        _processDataItemCore: function(item, change, key, columns, generateDataValues) {
            const { data, type } = change;

            switch(type) {
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

        _createInsertInfo: function() {
            const insertInfo = {};

            insertInfo[INSERT_INDEX] = this._getInsertIndex();

            return insertInfo;
        },

        _addInsertInfo: function(change, parentKey) {
            let insertInfo;
            let { key } = change;

            if(!isDefined(key)) {
                key = String(new Guid());
                change.key = key;
            }

            insertInfo = this._getInternalData(key)?.insertInfo;
            if(!isDefined(insertInfo)) {
                const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

                insertInfo = this._createInsertInfo();

                if(!isDefined(insertAfterOrBeforeKey)) {
                    this._setInsertAfterOrBeforeKey(change, parentKey);
                }
            }

            this._addInternalData({ insertInfo, key });

            return { insertInfo, key };
        },

        _setInsertAfterOrBeforeKey: function(change, parentKey) {
            const dataController = this._dataController;
            const allItems = dataController.items(true);
            const rowsView = this.getView('rowsView');
            const newRowPosition = this._getNewRowPosition();

            switch(newRowPosition) {
                case FIRST_NEW_ROW_POSITION:
                case LAST_NEW_ROW_POSITION:
                    break;
                case PAGE_TOP_NEW_ROW_POSITION:
                case PAGE_BOTTOM_NEW_ROW_POSITION:
                    if(allItems.length) {
                        const itemIndex = newRowPosition === PAGE_TOP_NEW_ROW_POSITION ? 0 : allItems.length - 1;

                        change[itemIndex === 0 ? 'insertBeforeKey' : 'insertAfterKey'] = allItems[itemIndex].key;
                    }
                    break;
                default: {
                    const isViewportBottom = newRowPosition === VIEWPORT_BOTTOM_NEW_ROW_POSITION;
                    let visibleItemIndex = isViewportBottom ? rowsView?.getBottomVisibleItemIndex() : rowsView?.getTopVisibleItemIndex();
                    const row = dataController.getVisibleRows()[visibleItemIndex];

                    if(row && (!row.isEditing && row.rowType === 'detail' || row.rowType === 'detailAdaptive')) {
                        visibleItemIndex++;
                    }

                    const insertKey = dataController.getKeyByRowIndex(visibleItemIndex);

                    if(isDefined(insertKey)) {
                        change['insertBeforeKey'] = insertKey;
                    }
                }
            }
        },

        _getInsertIndex: function() {
            let maxInsertIndex = 0;
            this.getChanges().forEach(editItem => {
                const insertInfo = this._getInternalData(editItem.key)?.insertInfo;

                if(isDefined(insertInfo) && editItem.type === DATA_EDIT_DATA_INSERT_TYPE && insertInfo[INSERT_INDEX] > maxInsertIndex) {
                    maxInsertIndex = insertInfo[INSERT_INDEX];
                }
            });
            return maxInsertIndex + 1;
        },

        _getInsertAfterOrBeforeKey: function(insertChange) {
            return insertChange.insertAfterKey ?? insertChange.insertBeforeKey;
        },

        _getPageIndexToInsertRow: function() {
            const newRowPosition = this._getNewRowPosition();
            const dataController = this._dataController;
            const pageIndex = dataController.pageIndex();
            const lastPageIndex = dataController.pageCount() - 1;

            if(newRowPosition === FIRST_NEW_ROW_POSITION && pageIndex !== 0) {
                return 0;
            } else if(newRowPosition === LAST_NEW_ROW_POSITION && pageIndex !== lastPageIndex) {
                return lastPageIndex;
            }

            return -1;
        },

        addRow: function(parentKey) {
            const dataController = this._dataController;
            const store = dataController.store();

            if(!store) {
                dataController.fireError('E1052', this.component.NAME);
                return new Deferred().reject();
            }

            return this._addRow(parentKey);
        },

        _addRow: function(parentKey) {
            const dataController = this._dataController;
            const store = dataController.store();
            const key = store && store.key();
            const param = { data: {} };
            const oldEditRowIndex = this._getVisibleEditRowIndex();
            const deferred = new Deferred();

            this.refresh({ allowCancelEditing: true });

            if(!this._allowRowAdding()) {
                when(this._navigateToNewRow(oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
                return deferred.promise();
            }

            if(!key) {
                param.data.__KEY__ = String(new Guid());
            }

            when(this._initNewRow(param, parentKey)).done(() => {
                if(this._allowRowAdding()) {
                    when(this._addRowCore(param.data, parentKey, oldEditRowIndex)).done(deferred.resolve).fail(deferred.reject);
                } else {
                    deferred.reject('cancel');
                }
            }).fail(deferred.reject);

            return deferred.promise();
        },

        _allowRowAdding: function() {
            const insertIndex = this._getInsertIndex();

            if(insertIndex > 1) {
                return false;
            }

            return true;
        },

        _addRowCore: function(data, parentKey, initialOldEditRowIndex) {
            const change = { data, type: DATA_EDIT_DATA_INSERT_TYPE };
            const editRowIndex = this._getVisibleEditRowIndex();
            const insertInfo = this._addInsertInfo(change, parentKey);
            const key = insertInfo.key;

            this._setEditRowKey(key, true);
            this._addChange(change);

            return this._navigateToNewRow(initialOldEditRowIndex, change, editRowIndex);
        },

        _navigateToNewRow: function(oldEditRowIndex, change, editRowIndex) {
            const d = new Deferred();
            const dataController = this._dataController;
            const focusController = this.getController('focus');
            editRowIndex = editRowIndex ?? -1;
            change = change ?? this.getChanges().filter(c => c.type === DATA_EDIT_DATA_INSERT_TYPE)[0];

            if(!change) {
                return d.reject('cancel').promise();
            }

            const pageIndexToInsertRow = this._getPageIndexToInsertRow();
            let rowIndex = this._getLoadedRowIndex(dataController.items(), change, true);
            const navigateToRowByKey = (key) => {
                when(focusController?.navigateToRow(key)).done(() => {
                    rowIndex = dataController.getRowIndexByKey(change.key);
                    d.resolve();
                });
            };
            const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

            if(pageIndexToInsertRow >= 0) {
                dataController.pageIndex(pageIndexToInsertRow).done(() => {
                    navigateToRowByKey(change.key);
                }).fail(d.reject);
            } else if(rowIndex < 0 && isDefined(insertAfterOrBeforeKey)) {
                navigateToRowByKey(insertAfterOrBeforeKey);
            } else {
                dataController.updateItems({
                    changeType: 'update',
                    rowIndices: [oldEditRowIndex, editRowIndex, rowIndex]
                });

                rowIndex = dataController.getRowIndexByKey(change.key);

                if(rowIndex < 0) {
                    navigateToRowByKey(change.key);
                } else {
                    d.resolve();
                }
            }

            d.done(() => {
                this._showAddedRow(rowIndex);
                this._afterInsertRow(change.key);
            });

            return d.promise();
        },

        _showAddedRow: function(rowIndex) {
            this._focusFirstEditableCellInRow(rowIndex);
        },

        _beforeFocusElementInRow: noop,

        _focusFirstEditableCellInRow: function(rowIndex) {
            const dataController = this._dataController;
            const key = dataController.getKeyByRowIndex(rowIndex);
            const $firstCell = this.getFirstEditableCellInRow(rowIndex);

            this._editCellInProgress = true;
            this._delayedInputFocus($firstCell, () => {
                rowIndex = dataController.getRowIndexByKey(key);
                this._editCellInProgress = false;
                this._beforeFocusElementInRow(rowIndex);
            });
        },

        _isEditingStart: function(options) {
            this.executeAction('onEditingStart', options);

            return options.cancel;
        },

        _beforeUpdateItems: noop,

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
                oldData: item.oldData ?? item.data
            });
            this._setEditRowKey(item.key);
        },

        _editRowFromOptionChanged: function(rowIndex, oldRowIndex) {
            const rowIndices = [oldRowIndex, rowIndex];

            this._beforeUpdateItems(rowIndices, rowIndex, oldRowIndex);
            this._editRowFromOptionChangedCore(rowIndices, rowIndex);
        },

        _editRowFromOptionChangedCore: function(rowIndices, rowIndex, preventRendering) {
            this._needFocusEditor = true;
            this._dataController.updateItems({
                changeType: 'update',
                rowIndices: rowIndices,
                cancel: preventRendering
            });
        },

        _focusEditorIfNeed: noop,

        _showEditPopup: noop,

        _repaintEditPopup: noop,

        _getEditPopupHiddenHandler: function() {
            return (e) => {
                if(this.isEditing()) {
                    this.cancelEditData();
                }
            };
        },

        _getPopupEditFormTemplate: noop,

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

        _updateInsertAfterOrBeforeKeys: function(changes, index) {
            const removeChange = changes[index];

            changes.forEach((change) => {
                const insertAfterOrBeforeKey = this._getInsertAfterOrBeforeKey(change);

                if(equalByValue(insertAfterOrBeforeKey, removeChange.key)) {
                    change[isDefined(change.insertAfterKey) ? 'insertAfterKey' : 'insertBeforeKey'] = this._getInsertAfterOrBeforeKey(removeChange);
                }
            });
        },

        _removeChange: function(index) {
            if(index >= 0) {
                const changes = [...this.getChanges()];
                const key = changes[index].key;

                this._removeInternalData(key);

                this._updateInsertAfterOrBeforeKeys(changes, index);
                changes.splice(index, 1);
                this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
                if(equalByValue(this.option(EDITING_EDITROWKEY_OPTION_NAME), key)) {
                    this._resetEditIndices();
                }
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

        _processCanceledEditingCell: noop,

        _repaintEditCell: function(column, oldColumn, oldEditRowIndex) {
            this._needFocusEditor = true;
            if(!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
                this._editCellInProgress = true;

                // T316439
                this.getController('editorFactory').loseFocus();

                this._dataController.updateItems({
                    changeType: 'update',
                    rowIndices: [oldEditRowIndex, this._getVisibleEditRowIndex()]
                });
            } else if(column !== oldColumn) {
                // TODO check this necessity T816039
                this._dataController.updateItems({
                    changeType: 'update',
                    rowIndices: []
                });
            }
        },

        _delayedInputFocus: function($cell, beforeFocusCallback, callBeforeFocusCallbackAlways) {
            const inputFocus = () => {
                if(beforeFocusCallback) {
                    beforeFocusCallback();
                }

                if($cell) {
                    const $focusableElement = $cell.find(FOCUSABLE_ELEMENT_SELECTOR).first();
                    gridCoreUtils.focusAndSelectElement(this, $focusableElement);
                }

                this._beforeFocusCallback = null;
            };

            if(devices.real().ios || devices.real().android) {
                inputFocus();
            } else {
                if(this._beforeFocusCallback) this._beforeFocusCallback();

                clearTimeout(this._inputFocusTimeoutID);

                if(callBeforeFocusCallbackAlways) {
                    this._beforeFocusCallback = beforeFocusCallback;
                }

                this._inputFocusTimeoutID = setTimeout(inputFocus);
            }
        },

        _focusEditingCell: function(beforeFocusCallback, $editCell, callBeforeFocusCallbackAlways) {
            const rowsView = this.getView('rowsView');
            const editColumnIndex = this._getVisibleEditColumnIndex();

            $editCell = $editCell || rowsView && rowsView._getCellElement(this._getVisibleEditRowIndex(), editColumnIndex);

            if($editCell) {
                this._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
            }
        },

        deleteRow: function(rowIndex) {
            this._checkAndDeleteRow(rowIndex);
        },

        _checkAndDeleteRow: function(rowIndex) {
            const editingOptions = this.option('editing');
            const editingTexts = editingOptions?.texts;
            const confirmDelete = editingOptions?.confirmDelete;
            const confirmDeleteMessage = editingTexts?.confirmDeleteMessage;
            const item = this._dataController.items()[rowIndex];
            const allowDeleting = !this.isEditing() || item.isNewRow; // T741746

            if(item && allowDeleting) {
                if(!confirmDelete || !confirmDeleteMessage) {
                    this._deleteRowCore(rowIndex);
                } else {
                    const confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle;
                    const showDialogTitle = isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
                    confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done(confirmResult => {
                        if(confirmResult) {
                            this._deleteRowCore(rowIndex);
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

            return this._afterDeleteRow(rowIndex, oldEditRowIndex);
        },
        _afterDeleteRow: function(rowIndex, oldEditRowIndex) {
            return this.saveEditData();
        },
        undeleteRow: function(rowIndex) {
            const dataController = this._dataController;
            const item = dataController.items()[rowIndex];
            const oldEditRowIndex = this._getVisibleEditRowIndex();
            const key = item && item.key;
            const changes = this.getChanges();

            if(item) {
                const editIndex = gridCoreUtils.getIndexByKey(key, changes);

                if(editIndex >= 0) {
                    const { data } = changes[editIndex];

                    if(isEmptyObject(data)) {
                        this._removeChange(editIndex);
                    } else {
                        this._addChange({ key: key, type: DATA_EDIT_DATA_UPDATE_TYPE });
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

        _processRemoveIfError: function(changes, editIndex) {
            const change = changes[editIndex];

            if(change?.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                if(editIndex >= 0) {
                    changes.splice(editIndex, 1);
                }
            }

            return true;
        },

        _processRemove: function(changes, editIndex, cancel) {
            const change = changes[editIndex];

            if(!cancel || !change || change.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                return this._processRemoveCore(changes, editIndex, !cancel || !change);
            }
        },

        _processRemoveCore: function(changes, editIndex) {
            if(editIndex >= 0) {
                changes.splice(editIndex, 1);
            }

            return true;
        },

        _processSaveEditDataResult: function(results) {
            let hasSavedData = false;
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
                    this._fireDataErrorOccurred(arg);
                    if(this._processRemoveIfError(changes, editIndex)) {
                        break;
                    }
                } else {
                    if(this._processRemove(changes, editIndex, cancel)) {
                        hasSavedData = !cancel;
                    }
                }
            }

            if(changes.length < changesLength) {
                this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);
            }

            return hasSavedData;
        },
        _fireSaveEditDataEvents: function(changes) {
            each(changes, (_, { data, key, type }) => {
                const internalData = this._addInternalData({ key });
                const params = { key: key, data: data };

                if(internalData.error) {
                    params.error = internalData.error;
                }

                switch(type) {
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
                        .always(() => {
                            this._saving = false;
                            if(this._refocusEditCell) {
                                this._focusEditingCell();
                            }
                        })
                        .done(deferred.resolve)
                        .fail(deferred.reject);
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
            // @ts-expect-error
            const result = new Deferred();
            const results = [];
            const deferreds = [];
            const dataChanges = [];
            const dataSource = this._dataController.dataSource();

            when(this._fireOnSaving())
                .done(({ cancel, changes }) => {
                    if(cancel) {
                        return result.resolve().promise();
                    }

                    this._processChanges(deferreds, results, dataChanges, changes);

                    if(deferreds.length) {
                        this._refocusEditCell = true;
                        // @ts-expect-error
                        dataSource?.beginLoading();

                        when(...deferreds).done(() => {
                            if(this._processSaveEditDataResult(results)) {
                                this._endSaving(dataChanges, changes, result);
                            } else {
                                // @ts-expect-error
                                dataSource?.endLoading();
                                result.resolve();
                            }
                        }).fail(error => {
                            // @ts-expect-error
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
        },

        _beforeEndSaving: function(changes) {
            this._resetEditIndices();
        },

        _endSaving: function(dataChanges, changes, deferred) {
            const dataSource = this._dataController.dataSource();

            this._beforeEndSaving(changes);

            dataSource?.endLoading();

            this._refreshDataAfterSave(dataChanges, changes, deferred);
        },

        _cancelSaving: function(result) {
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
            const isEditColumnVisible = this._isEditColumnVisible();
            const useIcons = this.option('editing.useIcons');
            const cssClass = COMMAND_EDIT_CLASS + (useIcons ? ' ' + COMMAND_EDIT_WITH_ICONS_CLASS : '');

            this._columnsController.addCommandColumn({
                type: 'buttons',
                command: 'edit',
                visible: isEditColumnVisible,
                cssClass: cssClass,
                width: 'auto',
                alignment: 'center',
                cellTemplate: this._getEditCommandCellTemplate(),
                fixedPosition: 'right'
            });

            this._columnsController.columnOption('command:edit', {
                visible: isEditColumnVisible,
                cssClass: cssClass
            });
        },

        _isEditColumnVisible: function() {
            const editingOptions = this.option('editing');

            return editingOptions.allowDeleting;
        },

        _isEditButtonDisabled: function() {
            const hasChanges = this.hasChanges();
            const isEditRowDefined = isDefined(this.option('editing.editRowKey'));

            return !(isEditRowDefined || hasChanges);
        },

        _updateEditButtons: function() {
            const headerPanel = this.getView('headerPanel');
            const isButtonDisabled = this._isEditButtonDisabled();

            if(headerPanel) {
                headerPanel.setToolbarItemDisabled('saveButton', isButtonDisabled);
                headerPanel.setToolbarItemDisabled('revertButton', isButtonDisabled);
            }
        },

        _applyModified: function($element) {
            $element && $element.addClass(CELL_MODIFIED);
        },

        _beforeCloseEditCellInBatchMode: noop,

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
            const rowIndex = this._getVisibleEditRowIndex();

            this._beforeCancelEditData();

            this.init();
            this.resetChanges();
            this._resetEditColumnName();
            this._resetEditRowKey();

            this._afterCancelEditData(rowIndex);
        },

        _afterCancelEditData: function(rowIndex) {
            const dataController = this._dataController;

            dataController.updateItems({
                repaintChangesOnly: this.option('repaintChangesOnly')
            });
        },

        _hideEditPopup: noop,

        hasEditData: function() {
            return this.hasChanges();
        },

        update: function(changeType) {
            const dataController = this._dataController;

            if(dataController && this._pageIndex !== dataController.pageIndex()) {
                if(changeType === 'refresh') {
                    this.refresh({ isPageChanged: true });
                }
                this._pageIndex = dataController.pageIndex();
            }
            this._updateEditButtons();
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
            const newData = {};
            const oldData = options.row?.data;
            const rowKey = options.key;
            const deferred = new Deferred();

            if(rowKey !== undefined) {
                options.value = value;

                const setCellValueResult = fromPromise(options.column.setCellValue(newData, value, extend(true, {}, oldData), text));
                setCellValueResult.done(function() {
                    deferred.resolve({
                        data: newData,
                        key: rowKey,
                        oldData: oldData,
                        type: DATA_EDIT_DATA_UPDATE_TYPE
                    });
                }).fail(createFailureHandler(deferred)).fail((arg) => this._fireDataErrorOccurred(arg));

                if(isDefined(text) && options.column.displayValueMap) {
                    options.column.displayValueMap[value] = text;
                }

                this._updateRowValues(options);

                this.addDeferred(deferred);
            }

            return deferred;
        },

        _updateRowValues: function(options) {
            if(options.values) {
                const dataController = this._dataController;
                const rowIndex = dataController.getRowIndexByKey(options.key);
                const row = dataController.getVisibleRows()[rowIndex];

                if(row) {
                    options.row.values = row.values; // T1122209
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
            if(this.hasEditData() && !this.isEditCell(options.rowIndex, options.columnIndex)) {
                this._focusEditingCell();
                this._updateEditRow(options.row, true);
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
            const changeOptions = { ...options, forceUpdateRow };

            this._addChange(params, changeOptions);
            this._updateEditButtons();

            return this._applyChangeCore(options, changeOptions.forceUpdateRow);
        },
        _applyChangeCore: function(options, forceUpdateRow) {
            const isCustomSetCellValue = options.column.setCellValue !== options.column.defaultSetCellValue;

            const row = options.row;
            if(row) {
                if(forceUpdateRow || isCustomSetCellValue) {
                    this._updateEditRow(row, forceUpdateRow, isCustomSetCellValue);
                } else if(row.update) {
                    row.update();
                }
            }
        },
        _updateEditRowCore: function(row, skipCurrentRow, isCustomSetCellValue) {
            this._dataController.updateItems({
                changeType: 'update',
                rowIndices: this._getRowIndicesForCascadeUpdating(row, skipCurrentRow)
            });
        },

        _updateEditRow: function(row, forceUpdateRow, isCustomSetCellValue) {
            if(forceUpdateRow) {
                this._updateRowImmediately(row, forceUpdateRow, isCustomSetCellValue);
            } else {
                this._updateRowWithDelay(row, isCustomSetCellValue);
            }
        },

        _updateRowImmediately: function(row, forceUpdateRow, isCustomSetCellValue) {
            this._updateEditRowCore(row, !forceUpdateRow, isCustomSetCellValue);
            this._validateEditFormAfterUpdate(row, isCustomSetCellValue);
            if(!forceUpdateRow) {
                this._focusEditingCell();
            }
        },

        _updateRowWithDelay: function(row, isCustomSetCellValue) {
            const deferred = new Deferred();
            this.addDeferred(deferred);
            setTimeout(() => {
                const $focusedElement = $(domAdapter.getActiveElement());
                const columnIndex = this._rowsView.getCellIndex($focusedElement, row.rowIndex);
                let focusedElement = $focusedElement.get(0);
                const selectionRange = gridCoreUtils.getSelectionRange(focusedElement);

                this._updateEditRowCore(row, false, isCustomSetCellValue);
                this._validateEditFormAfterUpdate(row, isCustomSetCellValue);

                if(columnIndex >= 0) {
                    const $focusedItem = this._rowsView._getCellElement(row.rowIndex, columnIndex);
                    this._delayedInputFocus($focusedItem, () => {
                        setTimeout(() => {
                            focusedElement = domAdapter.getActiveElement();
                            if(selectionRange.selectionStart >= 0) {
                                gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
                            }
                        });
                    });
                }
                deferred.resolve();
            });
        },

        _validateEditFormAfterUpdate: noop,

        _addChange: function(changeParams, options) {
            const row = options?.row;
            const changes = [...this.getChanges()];
            let index = gridCoreUtils.getIndexByKey(changeParams.key, changes);

            if(index < 0) {
                index = changes.length;

                this._addInternalData({
                    key: changeParams.key,
                    oldData: changeParams.oldData
                });

                delete changeParams.oldData;

                changes.push(changeParams);
            }

            const change = { ...changes[index] };

            if(change) {
                if(changeParams.data) {
                    change.data = createObjectWithChanges(change.data, changeParams.data);
                }
                if((!change.type || !changeParams.data) && changeParams.type) {
                    change.type = changeParams.type;
                }
                if(row) {
                    row.oldData = this._getOldData(row.key);
                    row.data = createObjectWithChanges(row.data, changeParams.data);
                }
            }

            changes[index] = change;

            this._silentOption(EDITING_CHANGES_OPTION_NAME, changes);

            // T1043517
            if(options && change !== this.getChanges()?.[index]) {
                options.forceUpdateRow = true;
            }

            return change;
        },

        _getFormEditItemTemplate: function(cellOptions, column) {
            return column.editCellTemplate || this._getDefaultEditorTemplate();
        },

        getColumnTemplate: function(options) {
            const column = options.column;
            const rowIndex = options.row && options.row.rowIndex;
            let template;
            const isRowMode = this.isRowBasedEditMode();
            const isRowEditing = this.isEditRow(rowIndex);
            const isCellEditing = this.isEditCell(rowIndex, options.columnIndex);
            let editingStartOptions;

            if((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing)) &&
                (options.rowType === 'data' || options.rowType === 'detailAdaptive') && !column.command) {
                const allowUpdating = this.allowUpdating(options);
                if(((allowUpdating || isRowEditing) && column.allowEditing || isCellEditing) && (isRowEditing || !isRowMode)) {
                    if(column.showEditorAlways && !isRowMode) {
                        editingStartOptions = {
                            cancel: false,
                            key: options.row.isNewRow ? undefined : options.row.key,
                            data: options.row.data,
                            column: column
                        };
                        this._isEditingStart(editingStartOptions);
                    }
                    if(!editingStartOptions || !editingStartOptions.cancel) {
                        options.setValue = (value, text) => {
                            this.updateFieldValue(options, value, text);
                        };
                    }
                }
                template = column.editCellTemplate || this._getDefaultEditorTemplate();
            } else if(column.command === 'detail' && options.rowType === 'detail' && isRowEditing) {
                template = this?.getEditFormTemplate(options);
            }

            return template;
        },

        _createButton: function($container, button, options, change) {
            let icon = EDIT_ICON_CLASS[button.name];
            const useIcons = this.option('editing.useIcons');
            const useLegacyColumnButtonTemplate = this.option('useLegacyColumnButtonTemplate');
            let $button = $('<a>')
                .attr('href', '#')
                .addClass(LINK_CLASS)
                .addClass(button.cssClass);

            if(button.template && useLegacyColumnButtonTemplate) {
                this._rowsView.renderTemplate($container, button.template, options, true);
            } else {
                if(button.template) {
                    $button = $('<span>').addClass(button.cssClass);
                } else if(useIcons && icon || button.icon) {
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

                if(this._isButtonDisabled(button, options)) {
                    $button.addClass('dx-state-disabled');
                } else if(!button.template || button.onClick) {
                    eventsEngine.on($button, addNamespace('click', EDITING_NAMESPACE), this.createAction(function(e) {
                        button.onClick?.call(button, extend({}, e, { row: options.row, column: options.column }));
                        e.event.preventDefault();
                        e.event.stopPropagation();
                    }));
                }

                $container.append($button, '&nbsp;');

                if(button.template) {
                    this._rowsView.renderTemplate($button, button.template, { ...options, column: undefined }, true, change);
                }
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

        prepareButtonItem: function(headerPanel, name, methodName, sortIndex) {
            const editingTexts = this.option('editing.texts') || {};

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

            const className = classNameButtonByNames[name];
            const onInitialized = (e) => {
                $(e.element).addClass(headerPanel._getToolbarButtonClass(EDIT_BUTTON_CLASS + ' ' + this.addWidgetPrefix(className) + '-button'));
            };
            const hintText = titleButtonTextByClassNames[name];
            const isButtonDisabled = (className === 'save' || className === 'cancel') && this._isEditButtonDisabled();

            return {
                widget: 'dxButton',
                options: {
                    onInitialized: onInitialized,
                    icon: 'edit-button-' + className,
                    disabled: isButtonDisabled,
                    onClick: () => {
                        setTimeout(() => {
                            this[methodName]();
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
        },

        prepareEditButtons: function(headerPanel) {
            const editingOptions = this.option('editing') || {};
            const buttonItems = [];

            if(editingOptions.allowAdding) {
                buttonItems.push(this.prepareButtonItem(headerPanel, 'addRow', 'addRow', 20));
            }

            return buttonItems;
        },

        highlightDataCell: function($cell, params) { this.shouldHighlightCell(params) && $cell.addClass(CELL_MODIFIED); },

        _afterInsertRow: noop,

        _beforeSaveEditData: function(change) {
            if(change && !isDefined(change.key) && isDefined(change.type)) {
                return true;
            }
        },

        _afterSaveEditData: noop,

        _beforeCancelEditData: noop,

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
        },

        isNewRowInEditMode: function() {
            const visibleEditRowIndex = this._getVisibleEditRowIndex();
            const rows = this._dataController.items();

            return visibleEditRowIndex >= 0 ? rows[visibleEditRowIndex].isNewRow : false;
        },

        shouldHighlightCell: function(parameters) {
            const cellModified = this.isCellModified(parameters);
            return cellModified &&
                parameters.column.setCellValue &&
                (
                    this.getEditMode() !== EDIT_MODE_ROW ||
                    !parameters.row.isEditing
                );

        }
    };
})());

export const editingModule = {
    defaultOptions: function() {
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
            },
            useLegacyColumnButtonTemplate: false
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
                    const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
                    const editRowIndex = gridCoreUtils.getIndexByKey(editRowKey, items);
                    const editItem = items[editRowIndex];
                    if(editItem) {
                        editItem.isEditing = true;
                        this._updateEditItem?.(editItem);
                    }
                },
                _updateItemsCore: function(change) {
                    this.callBase(change);
                    this._updateEditRow(this.items(true));
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
                    if(oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed) {
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
                },
                needToRefreshOnDataSourceChange: function(args) {
                    const editingController = this.getController('editing');
                    const isParasiteChange = Array.isArray(args.value) && args.value === args.previousValue && editingController.isSaving();
                    return !isParasiteChange;
                },
                _handleDataSourceChange(args) {
                    const result = this.callBase(args);
                    const changes = this.option('editing.changes');
                    const dataSource = args.value;
                    if(Array.isArray(dataSource) && changes.length) {
                        const dataSourceKeys = dataSource.map(item => this.keyOf(item));
                        const newChanges = changes.filter((change) => {
                            return change.type === 'insert' || dataSourceKeys.some(key => equalByValue(change.key, key));
                        });
                        if(newChanges.length !== changes.length) {
                            this.option('editing.changes', newChanges);

                        }
                        const editRowKey = this.option('editing.editRowKey');
                        const isEditNewItem = newChanges.some(
                            (change) => change.type === 'insert' && equalByValue(editRowKey, change.key)
                        );
                        if(!isEditNewItem && dataSourceKeys.every(key => !equalByValue(editRowKey, key))) {
                            this.option('editing.editRowKey', null);
                        }
                    }
                    return result;
                }
            }
        },
        views: {
            rowsView: {
                init: function() {
                    this.callBase();
                    this._editingController = this.getController('editing');
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
                publicMethods: function() {
                    return this.callBase().concat(['cellValue']);
                },
                _getCellTemplate: function(options) {
                    const template = this._editingController.getColumnTemplate(options);

                    return template || this.callBase(options);
                },
                _createRow: function(row) {
                    const $row = this.callBase.apply(this, arguments);

                    if(row) {
                        const isRowRemoved = !!row.removed;
                        const isRowInserted = !!row.isNewRow;
                        const isRowModified = !!row.modified;

                        isRowInserted && $row.addClass(ROW_INSERTED);
                        isRowModified && $row.addClass(ROW_MODIFIED);

                        if(isRowInserted || isRowRemoved) {
                            $row.removeClass(ROW_SELECTED);
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
                    const editingController = this._editingController;
                    const $targetElement = $(e.event.target);
                    const columnIndex = this._getColumnIndexByElement($targetElement);
                    const row = this._dataController.items()[e.rowIndex];
                    const allowUpdating = editingController.allowUpdating({ row: row }, eventName) || row && row.isNewRow;
                    const column = this._columnsController.getVisibleColumns()[columnIndex];
                    const isEditedCell = editingController.isEditCell(e.rowIndex, columnIndex);
                    const allowEditing = allowUpdating && column && (column.allowEditing || isEditedCell);
                    const startEditAction = this.option('editing.startEditAction') || 'click';
                    const isShowEditorAlways = column && column.showEditorAlways;

                    if(isEditedCell) {
                        return true;
                    }

                    if(eventName === 'down') {
                        if(devices.real().ios || devices.real().android) {
                            resetActiveElement();
                        }

                        return isShowEditorAlways && allowEditing && editingController.editCell(e.rowIndex, columnIndex);
                    }

                    if(eventName === 'click' && startEditAction === 'dblClick') {
                        const isError = false;
                        const withoutSaveEditData = row?.isNewRow;
                        editingController.closeEditCell(isError, withoutSaveEditData);
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

                    const hasTemplate = !!parameters.column?.cellTemplate;

                    if(parameters.column && !isCommandCell && (!hasTemplate || editingController.shouldHighlightCell(parameters))) {
                        editingController.highlightDataCell($cell, parameters);
                    }
                    this.callBase.apply(this, arguments);
                },
                _editCellPrepared: noop,
                _formItemPrepared: noop,
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
                _renderCore: function(change) {
                    this.callBase.apply(this, arguments);

                    return this.waitAsyncTemplates(change, true).done(() => {
                        this._editingController._focusEditorIfNeed();
                    });
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
                        case 'useLegacyColumnButtonTemplate':
                            args.handled = true;
                            break;
                        default:
                            this.callBase(args);
                    }
                },

                isVisible: function() {
                    const editingOptions = this.getController('editing').option('editing');

                    return this.callBase() || editingOptions?.allowAdding;

                }
            }
        }
    }
};
