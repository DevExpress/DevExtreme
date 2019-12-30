import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import typeUtils from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import modules from './ui.grid_core.modules';
import clickEvent from '../../events/click';
import doubleClickEvent from '../../events/double_click';
import pointerEvents from '../../events/pointer';
import { getIndexByKey, createObjectWithChanges, setEmptyText, getSelectionRange, setSelectionRange, focusAndSelectElement } from './ui.grid_core.utils';
import { addNamespace } from '../../events/utils';
import dialog from '../dialog';
import messageLocalization from '../../localization/message';
import Button from '../button';
import Popup from '../popup';
import errors from '../widget/ui.errors';
import devices from '../../core/devices';
import Form from '../form';
import holdEvent from '../../events/hold';
import { when, Deferred, fromPromise } from '../../core/utils/deferred';
import commonUtils from '../../core/utils/common';
import iconUtils from '../../core/utils/icon';
import Scrollable from '../scroll_view/ui.scrollable';
import deferredUtils from '../../core/utils/deferred';

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
const CELL_HIGHLIGHT_OUTLINE = 'dx-highlight-outline';
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

const POINTER_EVENTS_TARGET_CLASS = 'dx-pointer-events-target';

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
        return typeUtils.isObject(button) ? button.name : button;
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

            that._editRowIndex = -1;
            that._editData = [];
            that._editColumnIndex = -1;
            that._columnsController = that.getController('columns');
            that._dataController = that.getController('data');
            that._rowsView = that.getView('rowsView');
            that._editForm = null;
            that._updateEditFormDeferred = null;

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

                let $pointerDownTarget; // chrome 73+
                that._pointerDownEditorHandler = e => $pointerDownTarget = $(e.target);
                that._saveEditorHandler = that.createAction(function(e) {
                    const event = e.event;
                    let isEditorPopup;
                    let isDomElement;
                    let isFocusOverlay;
                    let isAddRowButton;
                    let isCellEditMode;
                    const $target = $(event.target);
                    let isAnotherComponent;
                    const targetComponent = event[TARGET_COMPONENT_NAME];

                    if($pointerDownTarget && $pointerDownTarget.is('input') && !$pointerDownTarget.is($target)) {
                        return;
                    }

                    if(!isRowEditMode(that) && !that._editCellInProgress) {
                        isEditorPopup = !!$target.closest(`.${DROPDOWN_EDITOR_OVERLAY_CLASS}`).length;
                        isDomElement = !!$target.closest(getWindow().document).length;
                        isAnotherComponent = targetComponent && targetComponent !== that.component;
                        isAddRowButton = !!$target.closest(`.${that.addWidgetPrefix(ADD_ROW_BUTTON_CLASS)}`).length;
                        isFocusOverlay = $target.hasClass(that.addWidgetPrefix(FOCUS_OVERLAY_CLASS));
                        isCellEditMode = getEditMode(that) === EDIT_MODE_CELL;

                        if(!isEditorPopup && !isFocusOverlay && !(isAddRowButton && isCellEditMode && that.isEditing()) && (isDomElement || isAnotherComponent)) {
                            that._closeEditItem.bind(that)($target);
                        }
                    }
                });

                eventsEngine.on(domAdapter.getDocument(), pointerEvents.down, that._pointerDownEditorHandler);
                eventsEngine.on(domAdapter.getDocument(), clickEvent.name, that._saveEditorHandler);
            }
            that._updateEditColumn();
            that._updateEditButtons();
        },

        getUpdatedData: function(data) {
            const key = this._dataController.keyOf(data);
            const editData = this._editData;
            const editIndex = getIndexByKey(key, editData);

            if(editData[editIndex]) {
                return createObjectWithChanges(data, editData[editIndex].data);
            }

            return data;
        },

        getInsertedData: function() {
            return this._editData
                .filter(editData => editData.data && editData.type === DATA_EDIT_DATA_INSERT_TYPE)
                .map(editData => editData.data);
        },

        getRemovedData: function() {
            return this._editData
                .filter(editData => editData.oldData && editData.type === DATA_EDIT_DATA_REMOVE_TYPE)
                .map(editData => editData.oldData);
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
            const that = this;
            const editForm = that._editForm;

            if(that.option('scrolling.mode') === 'standard') {
                that.resetRowAndPageIndices();
            }
            if(args.changeType === 'prepend') {
                each(that._editData, function(_, editData) {
                    editData.rowIndex += args.items.length;
                });
            }

            if(args.changeType === 'refresh' && getEditMode(that) === EDIT_MODE_POPUP && editForm && editForm.option('visible')) {
                this._repaintEditPopup();
            }
        },

        _isDefaultButtonVisible: function(button, options) {
            let result = true;
            const isRowMode = isRowEditMode(this);
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
                    result = !isEditRow && this.allowDeleting(options) && !options.row.removed;
                    break;
                case 'undelete':
                    result = this.allowDeleting(options) && options.row.removed;
                    break;
            }

            return result;
        },

        _isButtonVisible: function(button, options) {
            const visible = button.visible;

            if(!typeUtils.isDefined(visible)) {
                return this._isDefaultButtonVisible(button, options);
            }

            return typeUtils.isFunction(visible) ? visible.call(button, { component: options.component, row: options.row, column: options.column }) : visible;
        },

        _getButtonConfig: function(button, options) {
            const config = typeUtils.isObject(button) ? button : {};
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
                let buttons;

                if(options.rowType === 'data') {
                    options.rtlEnabled = this.option('rtlEnabled');
                    buttons = this._getEditingButtons(options);

                    this._renderEditingButtons($container, buttons, options);

                    options.watch && options.watch(
                        () => buttons.map(button => this._isButtonVisible(button, options)),
                        () => {
                            $container.empty();
                            this._renderEditingButtons($container, buttons, options);
                        }
                    );
                } else {
                    setEmptyText($container);
                }
            };
        },

        correctEditRowIndexAfterExpand: function(key) {
            if(this._editRowIndex > this._dataController.getRowIndexByKey(key)) {
                this._editRowIndex++;
            }
        },

        correctEditRowIndex: function(getRowIndexCorrection) {
            this._editRowIndex += getRowIndexCorrection(this._getVisibleEditRowIndex());
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

            return editMode === EDIT_MODE_BATCH || editMode === EDIT_MODE_CELL;
        },

        getEditMode: function() {
            return getEditMode(this);
        },

        getFirstEditableColumnIndex: function() {
            const columnsController = this.getController('columns');
            const firstFormItem = this._firstFormItem;
            let columnIndex;

            if(getEditMode(this) === EDIT_MODE_FORM && firstFormItem) {
                const $editFormElements = this._rowsView.getCellElements(this._editRowIndex);
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
            return getIndexByKey(key, items);
        },

        hasChanges: function(rowIndex) {
            const that = this;
            let result = false;

            for(let i = 0; i < that._editData.length; i++) {
                if(that._editData[i].type && (!typeUtils.isDefined(rowIndex) || that._dataController.getRowIndexByKey(that._editData[i].key) === rowIndex)) {
                    result = true;
                    break;
                }
            }

            return result;
        },

        dispose: function() {
            this.callBase();
            clearTimeout(this._inputFocusTimeoutID);
            eventsEngine.off(domAdapter.getDocument(), pointerEvents.down, this._pointerDownEditorHandler);
            eventsEngine.off(domAdapter.getDocument(), clickEvent.name, this._saveEditorHandler);
        },

        optionChanged: function(args) {
            if(args.name === 'editing') {
                if(this._editPopup && this._editPopup.option('visible') && args.fullName.indexOf('editing.form') === 0) {
                    this._repaintEditPopup();
                } else {
                    this.init();
                }
                args.handled = true;
            } else {
                this.callBase(args);
            }
        },

        publicMethods: function() {
            return ['insertRow', 'addRow', 'removeRow', 'deleteRow', 'undeleteRow', 'editRow', 'editCell', 'closeEditCell', 'saveEditData', 'cancelEditData', 'hasEditData'];
        },

        refresh: function() {
            if(getEditMode(this) === EDIT_MODE_CELL) return;

            if(getEditMode(this) !== EDIT_MODE_BATCH) {
                this.init();
            } else {
                this._editRowIndex = -1;
                this._editColumnIndex = -1;
            }
        },

        isEditing: function() {
            return this._editRowIndex > -1;
        },

        isEditRow: function(rowIndex) {
            const editMode = getEditMode(this);
            return this._getVisibleEditRowIndex() === rowIndex && ROW_BASED_MODES.indexOf(editMode) !== -1;
        },

        getEditRowKey: function() {
            const items = this._dataController.items();
            const item = items[this._getVisibleEditRowIndex()];

            return item && item.key;
        },

        getEditRowIndex: function() {
            return this._getVisibleEditRowIndex();
        },

        getEditFormRowIndex: function() {
            const editMode = getEditMode(this);

            return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP ? this._getVisibleEditRowIndex() : -1;
        },

        isEditCell: function(visibleRowIndex, columnIndex) {
            const hasEditData = !!(Array.isArray(this._editData) && this._editData.length);

            return hasEditData && this._getVisibleEditRowIndex() === visibleRowIndex && this._editColumnIndex === columnIndex;
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

        _needInsertItem: function(editData, changeType) {
            const that = this;
            const dataSource = that._dataController.dataSource();
            const scrollingMode = that.option('scrolling.mode');
            const pageIndex = dataSource.pageIndex();
            const beginPageIndex = dataSource.beginPageIndex ? dataSource.beginPageIndex() : pageIndex;
            const endPageIndex = dataSource.endPageIndex ? dataSource.endPageIndex() : pageIndex;

            if(scrollingMode !== 'standard') {
                switch(changeType) {
                    case 'append':
                        return editData.key.pageIndex === endPageIndex;
                    case 'prepend':
                        return editData.key.pageIndex === beginPageIndex;
                    case 'refresh':
                        editData.key.rowIndex = 0;
                        editData.key.dataRowIndex = 0;
                        editData.key.pageIndex = 0;
                        break;
                    default:
                        return editData.key.pageIndex >= beginPageIndex && editData.key.pageIndex <= endPageIndex;
                }
            }

            return editData.key.pageIndex === pageIndex;
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

        processItems: function(items, change) {
            const changeType = change.changeType;
            const dataController = this._dataController;
            let key;
            let item;
            let dataRowIndex = -1;
            let rowIndexOffset;

            this.update(changeType);

            const editData = this._editData;
            for(let i = 0; i < editData.length; i++) {
                key = editData[i].key;

                if(key) {
                    rowIndexOffset = dataController.getRowIndexOffset();
                    dataRowIndex = key.dataRowIndex - rowIndexOffset + dataController.getRowIndexDelta();

                    if(changeType === 'append') {
                        dataRowIndex -= dataController.items(true).length;
                        if(change.removeCount) {
                            dataRowIndex += change.removeCount;
                        }
                    }

                    item = this._generateNewItem(key);
                    if(dataRowIndex >= 0 && editData[i].type === DATA_EDIT_DATA_INSERT_TYPE && this._needInsertItem(editData[i], changeType, items, item)) {
                        items.splice(key.dataRowIndex ? dataRowIndex : 0, 0, item);
                    }
                }
            }

            return items;
        },

        processDataItem: function(item, options, generateDataValues) {
            const that = this;
            let data;
            let editMode;
            let editData;
            const columns = options.visibleColumns;
            const key = item.data[INSERT_INDEX] ? item.data.key : item.key;

            const editIndex = getIndexByKey(key, that._editData);

            if(editIndex >= 0) {
                editMode = getEditMode(that);
                editData = that._editData[editIndex];
                data = editData.data;

                item.isEditing = false;

                switch(editData.type) {
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

        /**
         * @name dxDataGridMethods.insertRow
         * @publicName insertRow()
         * @deprecated dxDataGridMethods.addRow
         */
        insertRow: function() {
            errors.log('W0002', 'dxDataGrid', 'insertRow', '15.2', 'Use the \'addRow\' method instead');
            return this.addRow();
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
                return index < insertKey.rowIndex && (row.rowType === 'data' || row.rowType === 'group' || row.isNewRow);
            }).length;

            if(editMode !== EDIT_MODE_BATCH) {
                that._editRowIndex = insertKey.rowIndex + that._dataController.getRowIndexOffset();
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
            this._editData.forEach(function(editItem) {
                if(editItem.type === DATA_EDIT_DATA_INSERT_TYPE && editItem.key[INSERT_INDEX] > maxInsertIndex) {
                    maxInsertIndex = editItem.key[INSERT_INDEX];
                }
            });
            return maxInsertIndex + 1;
        },

        /**
         * @name dxDataGridMethods.addRow
         * @publicName addRow()
         */
        /**
         * @name dxTreeListMethods.addRow
         * @publicName addRow()
         */
        /**
         * @name dxTreeListMethods.addRow
         * @publicName addRow(parentId)
         * @param1 parentId:any
         */
        addRow: function(parentKey) {
            const that = this;
            const dataController = that._dataController;
            const store = dataController.store();
            const key = store && store.key();
            const param = { data: {} };
            const editMode = getEditMode(that);
            const oldEditRowIndex = that._getVisibleEditRowIndex();

            if(!store) {
                dataController.fireError('E1052', this.component.NAME);
                return;
            }

            if(editMode === EDIT_MODE_CELL && that.hasChanges()) {
                that.saveEditData().done(function() {
                    // T804894
                    if(!that.hasChanges()) {
                        that.addRow(parentKey);
                    }
                });
                return;
            }

            that.refresh();

            if(!that._allowRowAdding()) {
                return;
            }

            if(!key) {
                param.data.__KEY__ = String(new Guid());
            }

            when(that._initNewRow(param, parentKey)).done(() => {
                if(that._allowRowAdding()) {
                    that._addRowCore(param.data, parentKey, oldEditRowIndex);
                }
            });
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

            that._addEditData({ key: insertKey, data: data, type: DATA_EDIT_DATA_INSERT_TYPE });

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
                const eventToTrigger = that.option('editing.startEditAction') === 'dblClick' ? doubleClickEvent.name : clickEvent.name;

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

        _getVisibleEditRowIndex: function() {
            return this._editRowIndex >= 0 ? this._editRowIndex - this._dataController.getRowIndexOffset() : -1;
        },

        /**
         * @name GridBaseMethods.editRow
         * @publicName editRow(rowIndex)
         * @param1 rowIndex:number
         */
        editRow: function(rowIndex) {
            const that = this;
            const dataController = that._dataController;
            const items = dataController.items();
            const item = items[rowIndex];
            const params = { data: item && item.data, cancel: false };
            const oldEditRowIndex = that._getVisibleEditRowIndex();
            let $editingCell;

            if(!item) {
                return;
            }

            if(rowIndex === oldEditRowIndex) {
                return true;
            }

            if(!item.isNewRow) {
                params.key = item.key;
            }

            if(that._isEditingStart(params)) {
                return;
            }

            that.init();
            that._pageIndex = dataController.pageIndex();
            that._editRowIndex = (items[0].isNewRow ? rowIndex - 1 : rowIndex) + that._dataController.getRowIndexOffset();
            that._addEditData({
                data: {},
                key: item.key,
                oldData: item.data
            });

            const rowIndices = [oldEditRowIndex, rowIndex];
            const editMode = getEditMode(that);

            that._beforeUpdateItems(rowIndices, rowIndex, oldEditRowIndex);

            if(editMode === EDIT_MODE_POPUP) {
                that._showEditPopup(rowIndex);
            } else {
                dataController.updateItems({
                    changeType: 'update',
                    rowIndices: rowIndices
                });
            }

            if(MODES_WITH_DELAYED_FOCUS.indexOf(editMode) !== -1) {
                $editingCell = that.getFocusedCellInRow(that._getVisibleEditRowIndex());

                that._delayedInputFocus($editingCell, function() {
                    $editingCell && that.component.focus($editingCell);
                });
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
                that.option('editing.popup')
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

        _removeEditDataItem: function(index) {
            if(index >= 0) {
                this._editData.splice(index, 1);
            }
        },

        /**
         * @name GridBaseMethods.editCell
         * @publicName editCell(rowIndex, visibleColumnIndex)
         * @param1 rowIndex:number
         * @param2 visibleColumnIndex:number
         */
        /**
         * @name GridBaseMethods.editCell
         * @publicName editCell(rowIndex, dataField)
         * @param1 rowIndex:number
         * @param2 dataField:string
         */
        editCell: function(rowIndex, columnIndex) {
            const d = new Deferred();
            let coreResult;

            when(...this._deferreds).done(() => {
                coreResult = this._editCellCore(rowIndex, columnIndex);
                when(coreResult)
                    .done(d.resolve)
                    .fail(d.reject);
            });

            return coreResult !== undefined ? coreResult : d.promise();
        },
        _editCellCore: function(rowIndex, columnIndex) {
            const that = this;
            const columnsController = that._columnsController;
            const dataController = that._dataController;
            const items = dataController.items();
            const item = items[rowIndex];
            const params = {
                data: item && item.data,
                cancel: false
            };
            const oldEditRowIndex = that._getVisibleEditRowIndex();
            const visibleColumns = columnsController.getVisibleColumns();
            const oldColumn = visibleColumns[that._editColumnIndex];

            if(typeUtils.isString(columnIndex)) {
                columnIndex = columnsController.columnOption(columnIndex, 'index');
                columnIndex = columnsController.getVisibleIndex(columnIndex);
            }

            const column = params.column = visibleColumns[columnIndex];

            if(column && item && (item.rowType === 'data' || item.rowType === 'detailAdaptive') && !item.removed && !isRowEditMode(that)) {
                if(that.isEditCell(rowIndex, columnIndex)) {
                    return true;
                }

                const editRowIndex = rowIndex + dataController.getRowIndexOffset();

                return when(that._beforeEditCell(rowIndex, columnIndex, item)).done(function(cancel) {
                    if(cancel) {
                        return;
                    }

                    if(that._prepareEditCell(params, item, columnIndex, editRowIndex)) {
                        commonUtils.deferRender(function() {
                            that._repaintEditCell(column, oldColumn, oldEditRowIndex);
                        });
                    } else {
                        that._processCanceledEditingCell();
                    }
                });
            }
            return false;
        },

        _processCanceledEditingCell: function() { },

        _prepareEditCell: function(params, item, editColumnIndex, editRowIndex) {
            const that = this;

            if(!item.isNewRow) {
                params.key = item.key;
            }

            if(that._isEditingStart(params)) {
                return false;
            }

            that._editRowIndex = editRowIndex;
            that._editColumnIndex = editColumnIndex;
            that._pageIndex = that._dataController.pageIndex();

            that._addEditData({
                data: {},
                key: item.key,
                oldData: item.data
            });

            return true;
        },

        _repaintEditCell: function(column, oldColumn, oldEditRowIndex) {
            const that = this;
            const rowsView = that._rowsView;

            if(!column || !column.showEditorAlways || oldColumn && !oldColumn.showEditorAlways) {
                that._editCellInProgress = true;

                // T316439
                that.getController('editorFactory').loseFocus();

                that._dataController.updateItems({
                    changeType: 'update',
                    rowIndices: [oldEditRowIndex, that._getVisibleEditRowIndex()]
                });
            }

            // TODO no focus border when call editCell via API
            const $cell = rowsView && rowsView._getCellElement(that._getVisibleEditRowIndex(), that._editColumnIndex); // T319885
            if($cell && !$cell.find(':focus').length) {
                that._focusEditingCell(function() {
                    that._editCellInProgress = false;
                }, $cell, true);
            } else {
                that._editCellInProgress = false;
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
                    focusAndSelectElement(that, $focusableElement);
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

            $editCell = $editCell || rowsView && rowsView._getCellElement(that._getVisibleEditRowIndex(), that._editColumnIndex);
            that._delayedInputFocus($editCell, beforeFocusCallback, callBeforeFocusCallbackAlways);
        },


        /**
         * @name dxDataGridMethods.removeRow
         * @publicName removeRow(rowIndex)
         * @param1 rowIndex:number
         * @deprecated GridBaseMethods.deleteRow
         */
        removeRow: function(rowIndex) {
            errors.log('W0002', 'dxDataGrid', 'removeRow', '15.2', 'Use the \'deleteRow\' method instead');
            return this.deleteRow(rowIndex);
        },

        /**
         * @name GridBaseMethods.deleteRow
         * @publicName deleteRow(rowIndex)
         * @param1 rowIndex:number
         */
        deleteRow: function(rowIndex) {
            const that = this;
            const editingOptions = that.option('editing');
            const editingTexts = editingOptions && editingOptions.texts;
            const confirmDeleteTitle = editingTexts && editingTexts.confirmDeleteTitle;
            const isBatchMode = editingOptions && editingOptions.mode === EDIT_MODE_BATCH;
            const confirmDelete = editingOptions && editingOptions.confirmDelete;
            const confirmDeleteMessage = editingTexts && editingTexts.confirmDeleteMessage;
            const dataController = that._dataController;
            let removeByKey;
            let showDialogTitle;
            const oldEditRowIndex = that._getVisibleEditRowIndex();
            const item = dataController.items()[rowIndex];
            const key = item && item.key;
            const allowDeleting = isBatchMode || !this.isEditing(); // T741746

            if(item && allowDeleting) {
                removeByKey = function(key) {
                    that.refresh();

                    const editIndex = getIndexByKey(key, that._editData);

                    if(editIndex >= 0) {
                        if(that._editData[editIndex].type === DATA_EDIT_DATA_INSERT_TYPE) {
                            that._removeEditDataItem(editIndex);
                        } else {
                            that._addEditData({ key: key, type: DATA_EDIT_DATA_REMOVE_TYPE });
                        }
                    } else {
                        that._addEditData({ key: key, oldData: item.data, type: DATA_EDIT_DATA_REMOVE_TYPE });
                    }

                    if(isBatchMode) {
                        dataController.updateItems({
                            changeType: 'update',
                            rowIndices: [oldEditRowIndex, rowIndex]
                        });
                    } else {
                        that.saveEditData();
                    }
                };

                if(isBatchMode || !confirmDelete || !confirmDeleteMessage) {
                    removeByKey(key);
                } else {
                    showDialogTitle = typeUtils.isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;
                    dialog.confirm(confirmDeleteMessage, confirmDeleteTitle, showDialogTitle).done(function(confirmResult) {
                        if(confirmResult) {
                            removeByKey(key);
                        }
                    });
                }
            }
        },
        /**
         * @name GridBaseMethods.undeleteRow
         * @publicName undeleteRow(rowIndex)
         * @param1 rowIndex:number
         */
        undeleteRow: function(rowIndex) {
            const that = this;
            const dataController = that._dataController;
            const item = dataController.items()[rowIndex];
            const oldEditRowIndex = that._getVisibleEditRowIndex();
            const key = item && item.key;

            if(item) {
                const editIndex = getIndexByKey(key, that._editData);
                let editData;

                if(editIndex >= 0) {
                    editData = that._editData[editIndex];

                    if(typeUtils.isEmptyObject(editData.data)) {
                        that._removeEditDataItem(editIndex);
                    } else {
                        that._addEditData({ key: key, type: DATA_EDIT_DATA_UPDATE_TYPE });
                    }

                    dataController.updateItems({
                        changeType: 'update',
                        rowIndices: [oldEditRowIndex, rowIndex]
                    });
                }
            }
        },
        _saveEditDataCore: function(deferreds, results, changes) {
            const that = this;
            const store = that._dataController.store();
            let isDataSaved = true;

            function executeEditingAction(actionName, params, func) {
                const deferred = new Deferred();

                that.executeAction(actionName, params);

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
            }

            each(that._editData, function(index, editData) {
                const data = editData.data;
                const oldData = editData.oldData;
                const type = editData.type;
                let deferred;
                let doneDeferred;
                let params;

                if(that._beforeSaveEditData(editData, index)) {
                    return;
                }

                switch(type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        params = { data: oldData, key: editData.key, cancel: false };
                        deferred = executeEditingAction('onRowRemoving', params, function() {
                            return store.remove(editData.key).done(function(key) {
                                changes.push({ type: 'remove', key: key });
                            });
                        });
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        params = { data: data, cancel: false };
                        deferred = executeEditingAction('onRowInserting', params, function() {
                            return store.insert(params.data).done(function(data, key) {
                                if(typeUtils.isDefined(key)) {
                                    editData.key = key;
                                }
                                if(data && typeUtils.isObject(data) && data !== params.data) {
                                    editData.data = data;
                                }
                                changes.push({ type: 'insert', data: data, index: 0 });
                            });
                        });
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        params = { newData: data, oldData: oldData, key: editData.key, cancel: false };
                        deferred = executeEditingAction('onRowUpdating', params, function() {
                            return store.update(editData.key, params.newData).done(function(data, key) {
                                if(data && typeUtils.isObject(data) && data !== params.newData) {
                                    editData.data = data;
                                }
                                changes.push({ type: 'update', key: key, data: data });
                            });
                        });
                        break;
                }

                if(deferred) {
                    doneDeferred = new Deferred();
                    deferred
                        .always(function(data) {
                            isDataSaved = data !== 'cancel';
                            results.push({ key: editData.key, result: data });
                        })
                        .always(doneDeferred.resolve);

                    deferreds.push(doneDeferred.promise());
                }
            });

            return isDataSaved;
        },
        _processSaveEditDataResult: function(results) {
            const that = this;
            let i;
            let arg;
            let cancel;
            let editData;
            let editIndex;
            let isError;
            let hasSavedData = false;
            const editMode = getEditMode(that);

            for(i = 0; i < results.length; i++) {
                arg = results[i].result;
                cancel = arg === 'cancel';
                editIndex = getIndexByKey(results[i].key, that._editData);
                editData = that._editData[editIndex];
                isError = arg && arg instanceof Error;

                if(isError) {
                    if(editData) {
                        editData.error = arg;
                    }
                    that._fireDataErrorOccurred(arg);
                    if(editMode !== EDIT_MODE_BATCH) {
                        if(editData && editData.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                            that._removeEditDataItem(editIndex);
                        }
                        break;
                    }
                } else if(!cancel || !editData || editMode !== EDIT_MODE_BATCH && editData.type === DATA_EDIT_DATA_REMOVE_TYPE) {
                    that._removeEditDataItem(editIndex);
                    hasSavedData = !cancel;
                }
            }
            return hasSavedData;
        },
        _fireSaveEditDataEvents: function(editData) {
            const that = this;

            each(editData, function(_, itemData) {
                const data = itemData.data;
                const key = itemData.key;
                const type = itemData.type;
                const params = { key: key, data: data };

                if(itemData.error) {
                    params.error = itemData.error;
                }

                switch(type) {
                    case DATA_EDIT_DATA_REMOVE_TYPE:
                        that.executeAction('onRowRemoved', extend({}, params, { data: itemData.oldData }));
                        break;
                    case DATA_EDIT_DATA_INSERT_TYPE:
                        that.executeAction('onRowInserted', params);
                        break;
                    case DATA_EDIT_DATA_UPDATE_TYPE:
                        that.executeAction('onRowUpdated', params);
                        break;
                }
            });
        },
        /**
         * @name GridBaseMethods.saveEditData
         * @publicName saveEditData()
         * @return Promise<void>
         */
        saveEditData: function() {
            const deferred = new Deferred();
            const afterSaveEditData = () => {
                when(this._afterSaveEditData()).done(function() {
                    deferred.resolve();
                });
            };
            when(...this._deferreds).done(() => {
                if(this._saving) {
                    afterSaveEditData();
                    return;
                }
                when(this._beforeSaveEditData()).done(cancel => {
                    if(cancel) {
                        afterSaveEditData();
                        return;
                    }
                    this._saveEditDataInner().done(deferred.resolve).fail(deferred.reject);
                });
            }).fail(deferred.reject);
            return deferred.promise();
        },
        _saveEditDataInner: function() {
            const results = [];
            const deferreds = [];
            const changes = [];
            const dataController = this._dataController;
            const dataSource = dataController.dataSource();
            const editMode = getEditMode(this);
            const result = new Deferred();

            const resetEditIndices = () => {
                if(editMode !== EDIT_MODE_CELL) {
                    this._editColumnIndex = -1;
                    this._editRowIndex = -1;
                }
            };

            const afterSaveEditData = (error) => {
                when(this._afterSaveEditData()).done(function() {
                    result.resolve(error);
                });
            };

            const editData = this._editData.slice(0);

            if(!this._saveEditDataCore(deferreds, results, changes) && editMode === EDIT_MODE_CELL) {
                this._focusEditingCell();
            }

            if(deferreds.length) {
                this._saving = true;

                dataSource && dataSource.beginLoading();

                when.apply($, deferreds).done(() => {
                    if(this._processSaveEditDataResult(results)) {
                        resetEditIndices();

                        if(editMode === EDIT_MODE_POPUP && this._editPopup) {
                            this._editPopup.hide();
                        }

                        dataSource && dataSource.endLoading();

                        const refreshMode = this.option('editing.refreshMode');
                        const isFullRefresh = refreshMode !== 'reshape' && refreshMode !== 'repaint';

                        if(!isFullRefresh) {
                            dataController.push(changes);
                        }

                        when(dataController.refresh({
                            selection: isFullRefresh,
                            reload: isFullRefresh,
                            load: refreshMode === 'reshape',
                            changesOnly: this.option('repaintChangesOnly')
                        })).always(() => {
                            this._fireSaveEditDataEvents(editData);
                        }).done(() => {
                            afterSaveEditData();
                        }).fail((error) => {
                            afterSaveEditData(error);
                        });
                    } else {
                        dataSource && dataSource.endLoading();
                        result.resolve();
                    }
                }).fail(function(error) {
                    dataSource && dataSource.endLoading();
                    result.resolve(error);
                });

                return result.always(() => {
                    this._focusEditingCell();
                    this._saving = false;
                }).promise();
            }

            if(isRowEditMode(this)) {
                if(!this.hasChanges()) {
                    this.cancelEditData();
                }
            } else if(CELL_BASED_MODES.indexOf(editMode) !== -1) {
                resetEditIndices();
                dataController.updateItems();
            } else {
                this._focusEditingCell();
            }

            afterSaveEditData();
            return result.promise();
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

        /**
         * @name GridBaseMethods.cancelEditData
         * @publicName cancelEditData()
         */
        cancelEditData: function() {
            const that = this;
            const editMode = getEditMode(that);
            const rowIndex = this._getVisibleEditRowIndex();
            const dataController = that._dataController;

            that._beforeCancelEditData();

            that.init();

            if(ROW_BASED_MODES.indexOf(editMode) !== -1 && rowIndex >= 0) {
                dataController.updateItems({
                    changeType: 'update',
                    rowIndices: [rowIndex, rowIndex + 1]
                });
            } else {
                dataController.updateItems({
                    repaintChangesOnly: that.option('repaintChangesOnly')
                });
            }

            if(editMode === EDIT_MODE_POPUP) {
                that._hideEditPopup();
            }
        },

        _hideEditPopup: function() {
            this._editPopup && this._editPopup.option('visible', false);
        },

        /**
         * @name GridBaseMethods.hasEditData
         * @publicName hasEditData()
         * @return boolean
         */
        hasEditData: function() {
            return this.hasChanges();
        },
        /**
         * @name GridBaseMethods.closeEditCell
         * @publicName closeEditCell()
         */
        closeEditCell: function(isError) {
            const that = this;
            let result = deferredUtils.when();
            const oldEditRowIndex = that._getVisibleEditRowIndex();

            if(!isRowEditMode(that)) {
                result = deferredUtils.Deferred();
                setTimeout(() => {
                    when(...this._deferreds).done(() => {
                        this._closeEditCellCore(isError, oldEditRowIndex);
                        result.resolve();
                    }).fail(result.reject);
                });
            }
            return result.promise();
        },

        _closeEditCellCore(isError, oldEditRowIndex) {
            const that = this;
            const editMode = getEditMode(that);
            const dataController = that._dataController;
            if(editMode === EDIT_MODE_CELL && that.hasChanges()) {
                that.saveEditData().done(function(error) {
                    if(!that.hasChanges()) {
                        that.closeEditCell(!!error);
                    }
                });
            } else if(oldEditRowIndex >= 0) {
                const rowIndices = [oldEditRowIndex];

                that._editRowIndex = -1;
                that._editColumnIndex = -1;

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
                    that.refresh();
                }
                that._pageIndex = dataController.pageIndex();
            }
            that._updateEditButtons();
        },

        _getRowIndicesForCascadeUpdating: function(row, skipCurrentRow) {
            return skipCurrentRow ? [] : [row.rowIndex];
        },

        _prepareEditDataParams: function(options, value, text) {
            const that = this;
            const newData = {};
            const oldData = options.data;
            const rowKey = options.key;
            const $cellElement = $(options.cellElement);
            const editMode = getEditMode(that);
            const deferred = new Deferred();
            let setCellValueResult;

            if(rowKey !== undefined) {
                if(editMode === EDIT_MODE_BATCH) {
                    that._applyModified($cellElement, options);
                }
                options.value = value;

                setCellValueResult = fromPromise(options.column.setCellValue(newData, value, extend(true, {}, oldData), text));
                setCellValueResult.done(function() {
                    deferred.resolve({
                        data: newData,
                        key: rowKey,
                        oldData: oldData,
                        type: DATA_EDIT_DATA_UPDATE_TYPE
                    });
                }).fail(createFailureHandler(deferred)).fail((arg) => that._fireDataErrorOccurred(arg));

                if(typeUtils.isString(text) && options.column.displayValueMap) {
                    options.column.displayValueMap[value] = text;
                }
                if(options.values) {
                    options.values[options.columnIndex] = value;
                }

                that._deferreds.push(setCellValueResult);
                setCellValueResult.always(function() {
                    const index = that._deferreds.indexOf(setCellValueResult);
                    if(index >= 0) {
                        that._deferreds.splice(index, 1);
                    }
                });
            }

            return deferred;
        },

        updateFieldValue: function(options, value, text, forceUpdateRow) {
            const that = this;
            const rowKey = options.key;

            if(rowKey === undefined) {
                that._dataController.fireError('E1043');
            }

            if(options.column.setCellValue) {
                this._prepareEditDataParams(options, value, text).done(params => {
                    this._applyEditDataParams(options, params, forceUpdateRow);
                });
            }
        },
        _focusPreviousEditingCellIfNeed: function(options) {
            const that = this;

            if(that.hasEditData() && !that.isEditCell(options.rowIndex, options.columnIndex)) {
                that._focusEditingCell();
                that._updateEditRow(options.row, true);
                return true;
            }
        },
        _applyEditDataParams: function(options, params, forceUpdateRow) {
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

            that._addEditData(params, options.row);
            that._updateEditButtons();

            if(showEditorAlways && !forceUpdateRow) {
                if(isUpdateInCellMode) {
                    that._editRowIndex = options.rowIndex + that._dataController.getRowIndexOffset();
                    that._editColumnIndex = options.columnIndex;
                    return that.saveEditData();
                } else if(editMode === EDIT_MODE_BATCH) {
                    const columns = that._columnsController.getVisibleColumns();
                    forceUpdateRow = isCustomSetCellValue || columns.some((column) => column.calculateCellValue !== column.defaultCalculateCellValue);
                }
            }

            if(options.row && (forceUpdateRow || isCustomSetCellValue)) {
                that._updateEditRow(options.row, forceUpdateRow, isCustomSetCellValue);
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

            // T816256, T844143
            if(isCustomSetCellValue && that._editForm && !row.isNewRow) {
                that._editForm.validate();
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
                setTimeout(function() {
                    const $focusedElement = $(domAdapter.getActiveElement());
                    const columnIndex = that._rowsView.getCellIndex($focusedElement, row.rowIndex);
                    let focusedElement = $focusedElement.get(0);
                    const selectionRange = getSelectionRange(focusedElement);

                    that._updateEditRowCore(row, false, isCustomSetCellValue);

                    if(columnIndex >= 0) {
                        const $focusedItem = that._rowsView._getCellElement(row.rowIndex, columnIndex);
                        that._delayedInputFocus($focusedItem, function() {
                            setTimeout(function() {
                                focusedElement = domAdapter.getActiveElement();
                                if(selectionRange.selectionStart >= 0) {
                                    setSelectionRange(focusedElement, selectionRange);
                                }
                            });
                        });
                    }
                });
            }
        },

        _addEditData: function(options, row) {
            const that = this;
            let editDataIndex = getIndexByKey(options.key, that._editData);

            if(editDataIndex < 0) {
                editDataIndex = that._editData.length;
                that._editData.push(options);
            }
            if(that._editData[editDataIndex]) {
                if(options.data) {
                    that._editData[editDataIndex].data = createObjectWithChanges(that._editData[editDataIndex].data, options.data);
                }
                if((!that._editData[editDataIndex].type || !options.data) && options.type) {
                    that._editData[editDataIndex].type = options.type;
                }
                if(row) {
                    row.oldData = that._editData[editDataIndex].oldData;
                    row.data = createObjectWithChanges(row.data, options.data);
                }
            }

            return editDataIndex;
        },

        _getFormEditItemTemplate: function(cellOptions, column) {
            return column.editCellTemplate || getDefaultEditorTemplate(this);
        },

        renderFormEditTemplate: function(detailCellOptions, item, form, container, isReadOnly) {
            const that = this;
            const $container = $(container);
            const column = item.column;
            const editorType = getEditorType(item);
            const rowData = detailCellOptions.row && detailCellOptions.row.data;
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

            if(that._rowsView.renderTemplate($container, template, cellOptions, !!$container.closest(getWindow().document).length)) {
                that._rowsView._updateCell($container, cellOptions);
            }
        },

        getFormEditorTemplate: function(cellOptions, item) {
            const that = this;
            const column = this.component.columnOption(item.dataField);

            return function(options, container) {
                const templateOptions = extend({}, cellOptions);
                const $container = $(container);

                templateOptions.column = column;

                templateOptions.row.watch && templateOptions.row.watch(function() {
                    return templateOptions.column.selector(templateOptions.row.data);
                }, function(newValue) {
                    let $editorElement = $container.find('.dx-widget').first();
                    let validator = $editorElement.data('dxValidator');
                    const validatorOptions = validator && validator.option();

                    templateOptions.value = newValue;
                    $container.contents().remove();
                    that.renderFormEditTemplate.bind(that)(cellOptions, item, options.component, $container);

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

                that.renderFormEditTemplate.bind(that)(cellOptions, item, options.component, $container);
            };
        },

        getEditFormTemplate: function() {
            const that = this;

            return function($container, detailOptions, renderFormOnly) {
                const editFormOptions = that.option('editing.form');
                let items = that.option('editing.form.items');
                const userCustomizeItem = that.option('editing.form.customizeItem');
                const editData = that._editData[getIndexByKey(detailOptions.key, that._editData)];
                const editFormItemClass = that.addWidgetPrefix(EDIT_FORM_ITEM_CLASS);
                const isCustomEditorType = {};

                if(!items) {
                    const columns = that.getController('columns').getColumns();
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
                        const itemId = item && (item.name || item.dataField);

                        if(itemId) {
                            isCustomEditorType[itemId] = !!item.editorType;
                        }
                    });
                }

                that._firstFormItem = undefined;

                that._editForm = that._createComponent($('<div>').appendTo($container), Form, extend({}, editFormOptions, {
                    items: items,
                    formID: 'dx-' + new Guid(),
                    validationGroup: editData,
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

                            const itemVisible = typeUtils.isDefined(item.visible) ? item.visible : true;
                            if(!that._firstFormItem && itemVisible) {
                                that._firstFormItem = item;
                            }
                        }
                        userCustomizeItem && userCustomizeItem.call(this, item);
                        item.cssClass = typeUtils.isString(item.cssClass) ? item.cssClass + ' ' + editFormItemClass : editFormItemClass;
                    }
                }));

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
            let allowUpdating;
            const isRowMode = isRowEditMode(that);
            const isRowEditing = that.isEditRow(rowIndex);
            const isCellEditing = that.isEditCell(rowIndex, options.columnIndex);
            let editingStartOptions;

            if((column.showEditorAlways || column.setCellValue && (isRowEditing && column.allowEditing || isCellEditing)) &&
                (options.rowType === 'data' || options.rowType === 'detailAdaptive') && !column.command) {
                allowUpdating = that.allowUpdating(options);
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
            let iconType;
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
                    iconType = iconUtils.getImageSourceType(icon);

                    if(iconType === 'image' || iconType === 'svg') {
                        $button = iconUtils.getImageContainer(icon).addClass(button.cssClass);
                    } else {
                        $button.addClass('dx-icon' + (iconType === 'dxIcon' ? '-' : ' ') + icon).attr('title', button.text);
                    }

                    $container.addClass(COMMAND_EDIT_WITH_ICONS_CLASS);

                    const localizationName = this.getButtonLocalizationNames()[button.name];
                    localizationName && $button.attr('aria-label', messageLocalization.format(localizationName));
                } else {
                    $button.text(button.text);
                }

                if(typeUtils.isDefined(button.hint)) {
                    $button.attr('title', button.hint);
                }

                eventsEngine.on($button, addNamespace('click', EDITING_NAMESPACE), that.createAction(function(e) {
                    button.onClick.call(button, extend({}, e, { row: options.row, column: options.column }));
                    e.event.preventDefault();
                }));
                options.rtlEnabled ? $container.prepend($button, '&nbsp;') : $container.append($button, '&nbsp;');
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

        showHighlighting: function($cell) {
            const $highlight = $cell.find('.' + CELL_HIGHLIGHT_OUTLINE);

            if($cell.get(0).tagName === 'TD' && !$highlight.length) {
                $cell.wrapInner($('<div>').addClass(CELL_HIGHLIGHT_OUTLINE + ' ' + POINTER_EVENTS_TARGET_CLASS));
            }
        },

        resetRowAndPageIndices: function(alwaysRest) {
            const that = this;

            each(that._editData, function(_, editData) {
                if(editData.pageIndex !== that._pageIndex || alwaysRest) {
                    delete editData.pageIndex;
                    delete editData.rowIndex;
                }
            });
        },

        _afterInsertRow: function() { },

        _beforeSaveEditData: function(editData) {
            if(editData && !typeUtils.isDefined(editData.key) && typeUtils.isDefined(editData.type)) {
                return true;
            }
        },

        _afterSaveEditData: function() { },

        _beforeCancelEditData: function() { },

        _allowEditAction: function(actionName, options) {
            let allowEditAction = this.option('editing.' + actionName);

            if(typeUtils.isFunction(allowEditAction)) {
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
        }
    };
})());

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.onInitNewRow
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 promise:Promise<void>
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowInserting
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 cancel:boolean|Promise<void>
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowInserted
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 error:Error
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.onEditingStart
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 cancel:boolean
             * @type_function_param1_field7 column:object
             * @extends Action
             * @action
             */

            /**
             * @name dxTreeListOptions.onEditingStart
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 cancel:boolean
             * @type_function_param1_field7 column:object
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowUpdating
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 oldData:object
             * @type_function_param1_field5 newData:object
             * @type_function_param1_field6 key:any
             * @type_function_param1_field7 cancel:boolean|Promise<void>
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowUpdated
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 error:Error
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowRemoving
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 cancel:boolean|Promise<void>
             * @extends Action
             * @action
             */

            /**
             * @name GridBaseOptions.onRowRemoved
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 data:object
             * @type_function_param1_field5 key:any
             * @type_function_param1_field6 error:Error
             * @extends Action
             * @action
             */

            /**
             * @name dxDataGridOptions.editing
             * @type object
             */
            /**
             * @name dxTreeListOptions.editing
             * @type object
             */
            /**
             * @name GridBaseOptions.editing
             * @type object
             */
            editing: {
                /**
                 * @name GridBaseOptions.editing.mode
                 * @type Enums.GridEditMode
                 * @default "row"
                 */
                mode: 'row', // "batch"
                /**
                 * @name GridBaseOptions.editing.refreshMode
                 * @type Enums.GridEditRefreshMode
                 * @default "full"
                 */
                refreshMode: 'full',
                /**
                 * @name dxDataGridOptions.editing.allowAdding
                 * @type boolean
                 * @default false
                 */
                /**
                 * @name dxTreeListOptions.editing.allowAdding
                 * @type boolean|function
                 * @default false
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:dxTreeList
                 * @type_function_param1_field2 row:dxTreeListRowObject
                 * @type_function_return Boolean
                 */
                allowAdding: false,
                /**
                 * @name dxDataGridOptions.editing.allowUpdating
                 * @type boolean|function
                 * @default false
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:dxDataGrid
                 * @type_function_param1_field2 row:dxDataGridRowObject
                 * @type_function_return Boolean
                 */
                /**
                 * @name dxTreeListOptions.editing.allowUpdating
                 * @type boolean|function
                 * @default false
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:dxTreeList
                 * @type_function_param1_field2 row:dxTreeListRowObject
                 * @type_function_return Boolean
                 */
                allowUpdating: false,
                /**
                 * @name dxDataGridOptions.editing.allowDeleting
                 * @type boolean|function
                 * @default false
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:dxDataGrid
                 * @type_function_param1_field2 row:dxDataGridRowObject
                 * @type_function_return Boolean
                 */
                /**
                 * @name dxTreeListOptions.editing.allowDeleting
                 * @type boolean|function
                 * @default false
                 * @type_function_param1 options:object
                 * @type_function_param1_field1 component:dxTreeList
                 * @type_function_param1_field2 row:dxTreeListRowObject
                 * @type_function_return Boolean
                 */
                allowDeleting: false,
                /**
                 * @name GridBaseOptions.editing.useIcons
                 * @type boolean
                 * @default false
                 */
                useIcons: false,
                /**
                 * @name GridBaseOptions.editing.selectTextOnEditStart
                 * @type boolean
                 * @default false
                 */
                selectTextOnEditStart: false,
                /**
                 * @name GridBaseOptions.editing.confirmDelete
                 * @type boolean
                 * @default true
                 */
                confirmDelete: true,
                /**
                 * @name dxDataGridOptions.editing.texts
                 * @type object
                 */
                /**
                 * @name GridBaseOptions.editing.texts
                 * @type object
                 */
                texts: {
                    /**
                     * @name GridBaseOptions.editing.texts.editRow
                     * @type string
                     * @default "Edit"
                     */
                    editRow: messageLocalization.format('dxDataGrid-editingEditRow'),
                    /**
                     * @name GridBaseOptions.editing.texts.saveAllChanges
                     * @type string
                     * @default "Save changes"
                     */
                    saveAllChanges: messageLocalization.format('dxDataGrid-editingSaveAllChanges'),
                    /**
                     * @name GridBaseOptions.editing.texts.saveRowChanges
                     * @type string
                     * @default "Save"
                     */
                    saveRowChanges: messageLocalization.format('dxDataGrid-editingSaveRowChanges'),
                    /**
                     * @name GridBaseOptions.editing.texts.cancelAllChanges
                     * @type string
                     * @default "Discard changes"
                     */
                    cancelAllChanges: messageLocalization.format('dxDataGrid-editingCancelAllChanges'),
                    /**
                     * @name GridBaseOptions.editing.texts.cancelRowChanges
                     * @type string
                     * @default "Cancel"
                     */
                    cancelRowChanges: messageLocalization.format('dxDataGrid-editingCancelRowChanges'),
                    /**
                     * @name GridBaseOptions.editing.texts.addRow
                     * @type string
                     * @default "Add a row"
                     */
                    addRow: messageLocalization.format('dxDataGrid-editingAddRow'),
                    /**
                     * @name GridBaseOptions.editing.texts.deleteRow
                     * @type string
                     * @default "Delete"
                     */
                    deleteRow: messageLocalization.format('dxDataGrid-editingDeleteRow'),
                    /**
                     * @name GridBaseOptions.editing.texts.undeleteRow
                     * @type string
                     * @default "Undelete"
                     */
                    undeleteRow: messageLocalization.format('dxDataGrid-editingUndeleteRow'),
                    /**
                     * @name GridBaseOptions.editing.texts.confirmDeleteMessage
                     * @type string
                     * @default "Are you sure you want to delete this record?"
                     */
                    confirmDeleteMessage: messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'),
                    /**
                     * @name GridBaseOptions.editing.texts.confirmDeleteTitle
                     * @type string
                     * @default ""
                     */
                    confirmDeleteTitle: ''
                },
                /**
                 * @name GridBaseOptions.editing.form
                 * @type dxFormOptions
                 */
                form: {
                    colCount: 2
                },

                /**
                 * @name GridBaseOptions.editing.popup
                 * @type dxPopupOptions
                 */
                popup: {},

                /**
                 * @name GridBaseOptions.editing.startEditAction
                 * @type Enums.GridStartEditAction
                 * @default "click"
                 */
                startEditAction: 'click'
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
                    const editingController = this.getController('editing');

                    !repaintChangesOnly && this._editingController.refresh();
                    const d = this.callBase.apply(this, arguments);

                    return d && d.done(function() {
                        editingController.resetRowAndPageIndices(true);
                    });
                },
                repaintRows: function() {
                    if(this.getController('editing').isSaving()) return;
                    return this.callBase.apply(this, arguments);
                },
                _updateEditRow: function(items) {
                    const editingController = this._editingController;
                    const editRowIndex = editingController.getEditRowIndex();
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
                _correctRowIndices: function(getRowIndexCorrection) {
                    this.callBase.apply(this, arguments);
                    this._editingController.correctEditRowIndex(getRowIndexCorrection);
                },
                _getChangedColumnIndices: function(oldItem, newItem, rowIndex, isLiveUpdate) {
                    const editingController = this.getController('editing');
                    const isRowEditMode = editingController.isRowEditMode();

                    if(oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed || (isRowEditMode && oldItem.isEditing !== newItem.isEditing)) {
                        return;
                    }

                    if(oldItem.rowType === newItem.rowType && isRowEditMode && editingController.isEditRow(rowIndex) && isLiveUpdate) {
                        return [];
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
                    let column;

                    if(editFormRowIndex === rowIndex && typeUtils.isString(columnIdentifier)) {
                        column = this._columnsController.columnOption(columnIdentifier);
                        return this._getEditFormEditorVisibleIndex($cells, column);
                    }

                    return this.callBase.apply(this, arguments);
                },

                _getEditFormEditorVisibleIndex: function($cells, column) {
                    let item;
                    let visibleIndex = -1;

                    each($cells, function(index, cellElement) {
                        item = $(cellElement).find('.dx-field-item-content').data('dx-form-item');
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
                    let editingController;
                    let isEditRow;
                    let isRowRemoved;
                    let isRowInserted;
                    let isRowModified;

                    if(row) {
                        editingController = this._editingController;
                        isEditRow = editingController.isEditRow(row.rowIndex);
                        isRowRemoved = !!row.removed;
                        isRowInserted = !!row.isNewRow;
                        isRowModified = !!row.modified;

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
                    e.event[TARGET_COMPONENT_NAME] = this.component;

                    if(!this._editCellByClick(e, 'click')) {
                        this.callBase.apply(this, arguments);
                    }
                },
                _rowDblClick: function(e) {
                    if(!this._editCellByClick(e, 'dblClick')) {
                        this.callBase.apply(this, arguments);
                    }
                },
                _cellPrepared: function($cell, parameters) {
                    const columnIndex = parameters.columnIndex;
                    const editingController = this._editingController;
                    const isCommandCell = !!parameters.column.command;
                    const isEditableCell = parameters.setValue;
                    const isEditing = parameters.isEditing || editingController.isEditRow(parameters.rowIndex) && parameters.column.allowEditing;

                    if(parameters.rowType === 'data' && !parameters.column.command && (isEditing || parameters.column.showEditorAlways)) {
                        const alignment = parameters.column.alignment;

                        $cell
                            .addClass(EDITOR_CELL_CLASS)
                            .toggleClass(this.addWidgetPrefix(READONLY_CLASS), !isEditableCell)
                            .toggleClass(CELL_FOCUS_DISABLED_CLASS, !isEditableCell);

                        if(alignment) {
                            $cell.find(EDITORS_INPUT_SELECTOR).first().css('textAlign', alignment);
                        }
                    }

                    if(isEditing) {
                        this._editCellPrepared($cell);
                    }

                    const modifiedValues = parameters.row && (parameters.row.isNewRow ? parameters.row.values : parameters.row.modifiedValues);

                    if(modifiedValues && modifiedValues[columnIndex] !== undefined && parameters.column && !isCommandCell && parameters.column.setCellValue) {
                        editingController.showHighlighting($cell);
                        $cell.addClass(CELL_MODIFIED);
                    } else if(isEditableCell) {
                        const skipValidation = parameters.row.isNewRow;

                        editingController.showHighlighting($cell, skipValidation);
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
                _renderCellContent: function($cell, options) {
                    if(options.rowType === 'data' && getEditMode(this) === EDIT_MODE_POPUP && options.row.visible === false) {
                        return;
                    }

                    this.callBase.apply(this, arguments);
                },
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, visibleColumnIndex)
                 * @param1 rowIndex:number
                 * @param2 visibleColumnIndex:number
                 * @return any
                 */
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, dataField)
                 * @param1 rowIndex:number
                 * @param2 dataField:string
                 * @return any
                 */
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, visibleColumnIndex, value)
                 * @param1 rowIndex:number
                 * @param2 visibleColumnIndex:number
                 * @param3 value:any
                 */
                /**
                 * @name GridBaseMethods.cellValue
                 * @publicName cellValue(rowIndex, dataField, value)
                 * @param1 rowIndex:number
                 * @param2 dataField:string
                 * @param3 value:any
                 */
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
                }
            },

            headerPanel: {
                _getToolbarItems: function() {
                    const items = this.callBase();
                    const editButtonItems = this.getController('editing').prepareEditButtons(this);

                    return editButtonItems.concat(items);
                },

                optionChanged: function(args) {
                    switch(args.name) {
                        case 'editing':
                            if(!(args.fullName && args.fullName.indexOf('editing.popup') === 0)) {
                                this._invalidate();
                            }
                            this.callBase(args);
                            break;
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
