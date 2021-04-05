import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import { isDefined, isObject, isFunction, isEmptyObject } from '../../core/utils/type';
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
} from './ui.grid_core.editing_constants';

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
const NEW_SCROLLING_MODE = 'scrolling.newMode';

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

        optionChanged: function(args) {
            if(args.name === 'editing') {
                const fullName = args.fullName;

                if(fullName === EDITING_EDITROWKEY_OPTION_NAME) {
                    this._handleEditRowKeyChange(args);
                } else if(fullName === EDITING_CHANGES_OPTION_NAME) {
                    this._handleChangesChange(args);
                } else if(!args.handled) {
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

            if(!args.value.length && !args.previousValue.length) {
                return;
            }

            this._processInsertChanges(args.value);

            dataController.updateItems({
                repaintChangesOnly: true
            });
        },

        _processInsertChanges: function(changes) {
            changes.forEach(change => {
                if(change.type === 'insert') {
                    this._addInsertInfo(change);
                }
            });
        },

        publicMethods: function() {
            return ['addRow', 'deleteRow', 'undeleteRow', 'editRow', 'saveEditData', 'cancelEditData', 'hasEditData'];
        },

        refresh: function(isPageChanged) {
            if(!isDefined(this._pageIndex)) {
                return;
            }

            this._refreshCore(isPageChanged);
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

        isEditCell: function(visibleRowIndex, columnIndex) {
            return this._getVisibleEditRowIndex() === visibleRowIndex && this._getVisibleEditColumnIndex() === columnIndex;
        },

        getPopupContent: noop,

        _needInsertItem: function(change, changeType) {
            const dataController = this._dataController;
            const dataSource = dataController.dataSource();
            const scrollingMode = this.option('scrolling.mode');
            const pageIndex = dataSource.pageIndex();
            const beginPageIndex = dataSource.beginPageIndex ? dataSource.beginPageIndex() : pageIndex;
            const endPageIndex = dataSource.endPageIndex ? dataSource.endPageIndex() : pageIndex;
            const isLastPage = endPageIndex === dataSource.pageCount() - 1;

            if(scrollingMode !== 'standard') {
                const needInsertOnLastPosition = !isDefined(change.pageIndex) && change.index === -1;

                switch(changeType) {
                    case 'append':
                        return change.pageIndex === endPageIndex || needInsertOnLastPosition && isLastPage;
                    case 'prepend':
                        return change.pageIndex === beginPageIndex;
                    default: {
                        const topItemIndex = dataController.topItemIndex?.();
                        const bottomItemIndex = dataController.bottomItemIndex?.();

                        if(this.option(NEW_SCROLLING_MODE) && isDefined(topItemIndex)) {
                            return change.index >= topItemIndex && change.index <= bottomItemIndex || needInsertOnLastPosition && isLastPage;
                        }

                        return change.pageIndex >= beginPageIndex && change.pageIndex <= endPageIndex || needInsertOnLastPosition && isLastPage;
                    }
                }
            }

            return change.pageIndex === pageIndex || change.pageIndex === -1 && isLastPage;
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
        _getLoadedRowIndex: function(items, change, key) {
            const dataController = this._dataController;
            const loadedRowIndexOffset = dataController.getRowIndexOffset(true);
            const changes = this.getChanges();
            const index = change ? changes.filter(editChange => equalByValue(editChange.key, key))[0].index : 0;
            let loadedRowIndex = index - loadedRowIndexOffset;

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
                const isInsert = change.type === DATA_EDIT_DATA_INSERT_TYPE;

                if(!isInsert) {
                    return;
                }

                let key = change.key;
                let insertInfo = this._getInternalData(key)?.insertInfo;
                if(!isDefined(change.key) || !isDefined(insertInfo)) {
                    const keys = this._addInsertInfo(change);
                    key = keys.key;
                    insertInfo = keys.insertInfo;
                }

                const loadedRowIndex = this._getLoadedRowIndex(items, e, key);
                const item = this._generateNewItem(key);
                if((loadedRowIndex >= 0 || change.index === -1) && this._needInsertItem(change, changeType, items, item)) {
                    if(change.index !== -1) {
                        items.splice(change.index ? loadedRowIndex : 0, 0, item);
                    } else {
                        items.push(item);
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

        _calculateIndex: function(rowIndex) {
            const dataController = this._dataController;
            const rows = dataController.items();

            return dataController.getRowIndexOffset() + rows.filter(function(row, index) {
                return index < rowIndex && (row.rowType === 'data' && !row.isNewRow || row.rowType === 'group');
            }).length;
        },

        _createInsertInfo: function(rowIndex, change) {
            const insertInfo = {
                parentKey: change.parentKey
            };

            insertInfo[INSERT_INDEX] = this._getInsertIndex();

            return insertInfo;
        },

        _getCorrectedInsertRowIndex: function(parentKey) {
            let rowIndex = this._getInsertRowIndex(parentKey);
            const dataController = this._dataController;
            const rows = dataController.items();
            const row = rows[rowIndex];

            if(row && (!row.isEditing && row.rowType === 'detail' || row.rowType === 'detailAdaptive')) {
                rowIndex++;
            }

            return rowIndex;
        },

        _addInsertInfo: function(change) {

            let insertInfo;
            let rowIndex;
            let { key } = change;

            if(!isDefined(key)) {
                key = String(new Guid());
                change.key = key;
            }

            insertInfo = this._getInternalData(key)?.insertInfo;
            if(!isDefined(insertInfo)) {
                rowIndex = this._getCorrectedInsertRowIndex(change.parentKey);
                insertInfo = this._createInsertInfo(rowIndex, change);
                this._setIndexes(change, rowIndex);
            }

            this._addInternalData({ insertInfo, key });

            return { insertInfo, key, rowIndex };
        },

        _setIndexes: function(change, rowIndex) {
            const dataController = this._dataController;

            change.index = change.index ?? this._calculateIndex(rowIndex);

            if(this.option('scrolling.mode') === 'virtual') {
                if(change.index !== -1) {
                    change.pageIndex = Math.min(dataController.pageCount() - 1, Math.floor(change.index / dataController.pageSize()));
                }
            } else {
                change.pageIndex = change.pageIndex ?? dataController.pageIndex();
            }
        },

        _getInsertRowIndex: function(parentKey) {
            const rowsView = this.getView('rowsView');
            const parentRowIndex = this._dataController.getRowIndexByKey(parentKey);

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
            this.getChanges().forEach(editItem => {
                const insertInfo = this._getInternalData(editItem.key)?.insertInfo;

                if(isDefined(insertInfo) && editItem.type === DATA_EDIT_DATA_INSERT_TYPE && insertInfo[INSERT_INDEX] > maxInsertIndex) {
                    maxInsertIndex = insertInfo[INSERT_INDEX];
                }
            });
            return maxInsertIndex + 1;
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

            this.refresh();

            if(!this._allowRowAdding()) {
                return deferred.reject('cancel');
            }

            if(!key) {
                param.data.__KEY__ = String(new Guid());
            }

            when(this._initNewRow(param, parentKey)).done(() => {
                if(this._allowRowAdding()) {
                    this._addRowCore(param.data, parentKey, oldEditRowIndex);
                    deferred.resolve();
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
            const oldEditRowIndex = this._getVisibleEditRowIndex();
            const change = { data, type: DATA_EDIT_DATA_INSERT_TYPE, parentKey };
            const { key, rowIndex } = this._addInsertInfo(change);

            this._setEditRowKey(key, true);

            this._addChange(change);

            this._dataController.updateItems({
                changeType: 'update',
                rowIndices: [initialOldEditRowIndex, oldEditRowIndex, rowIndex]
            });

            this._showAddedRow(rowIndex);

            this._afterInsertRow({ key, data });
        },

        _showAddedRow: function(rowIndex) {
            this._focusFirstEditableCellInRow(rowIndex);
        },

        _focusFirstEditableCellInRow: function(rowIndex) {
            const $firstCell = this.getFirstEditableCellInRow(rowIndex);

            this._editCellInProgress = true;

            this._delayedInputFocus($firstCell, () => {
                this._editCellInProgress = false;

                const $cell = this.getFirstEditableCellInRow(rowIndex);
                const eventToTrigger = this.option('editing.startEditAction') === 'dblClick' ? doubleClickEvent : clickEventName;

                $cell && eventsEngine.trigger($cell, eventToTrigger);
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
                oldData: item.data
            });
            this._setEditRowKey(item.key);
        },

        _editRowFromOptionChanged: function(rowIndex, oldRowIndex) {
            const rowIndices = [oldRowIndex, rowIndex];

            this._beforeUpdateItems(rowIndices, rowIndex, oldRowIndex);
            this._editRowFromOptionChangedCore(rowIndices, rowIndex, oldRowIndex);
        },

        _editRowFromOptionChangedCore: function(rowIndices, rowIndex, oldRowIndex) {
            this._needFocusEditor = true;
            this._dataController.updateItems({
                changeType: 'update',
                rowIndices: rowIndices
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

        _removeChange: function(index) {
            if(index >= 0) {
                const changes = [...this.getChanges()];
                const key = changes[index].key;

                this._removeInternalData(key);

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
            this._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
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

            this._afterDeleteRow(rowIndex, oldEditRowIndex);
        },
        _afterDeleteRow: function(rowIndex, oldEditRowIndex) {
            this.saveEditData();
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
                    this.refresh(true);
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
            this._addChange(params, options.row);
            this._updateEditButtons();

            return this._applyChangeCore(options, forceUpdateRow);
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

        _createButton: function($container, button, options) {
            let icon = EDIT_ICON_CLASS[button.name];
            const useIcons = this.option('editing.useIcons');
            let $button = $('<a>')
                .attr('href', '#')
                .addClass(LINK_CLASS)
                .addClass(button.cssClass);

            if(button.template) {
                this._rowsView.renderTemplate($container, button.template, options, true);
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

                eventsEngine.on($button, addNamespace('click', EDITING_NAMESPACE), this.createAction(function(e) {
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

        highlightDataCell: function($cell, parameters) {
            const cellModified = this.isCellModified(parameters);
            cellModified && parameters.column.setCellValue && $cell.addClass(CELL_MODIFIED);
        },

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
        }
    };
})());

export const editingModule = {
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
                _isNativeClick: function() {
                    return (devices.real().ios || devices.real().android) && this.option('editing.allowUpdating');
                },
                _createRow: function(row) {
                    const $row = this.callBase(row);

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
                    const allowEditing = allowUpdating && column && (column.allowEditing || editingController.isEditCell(e.rowIndex, columnIndex));
                    const startEditAction = this.option('editing.startEditAction') || 'click';

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
                    const editingOptions = this.getController('editing').option('editing');

                    return this.callBase() || editingOptions?.allowAdding;

                }
            }
        }
    }
};
