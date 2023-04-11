import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import eventsEngine from '../../events/core/events_engine';
import Guid from '../../core/guid';
import { isDefined, isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import Button from '../button';
import devices from '../../core/devices';
import Form from '../form';
import { Deferred } from '../../core/utils/deferred';
import { equalByValue } from '../../core/utils/common';
import Scrollable from '../scroll_view/ui.scrollable';
import Popup from '../popup';
import {
    EDIT_MODE_FORM,
    EDIT_MODE_POPUP,
    FOCUSABLE_ELEMENT_SELECTOR,
    EDITING_EDITROWKEY_OPTION_NAME,
    EDITING_POPUP_OPTION_NAME,
    DATA_EDIT_DATA_INSERT_TYPE,
    EDITING_FORM_OPTION_NAME
} from './ui.grid_core.editing_constants';

const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

const EDIT_FORM_ITEM_CLASS = 'edit-form-item';
const EDIT_POPUP_CLASS = 'edit-popup';
const EDIT_POPUP_FORM_CLASS = 'edit-popup-form';
const FOCUSABLE_ELEMENT_CLASS = isRenovatedScrollable ? 'dx-scrollable' : 'dx-scrollable-container';
const BUTTON_CLASS = 'dx-button';

const FORM_BUTTONS_CONTAINER_CLASS = 'form-buttons-container';

const getEditorType = (item) => {
    const column = item.column;

    return item.isCustomEditorType ? item.editorType : column.formItem?.editorType;
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

export const editingFormBasedModule = {
    extenders: {
        controllers: {
            editing: {
                init: function() {
                    this._editForm = null;
                    this._updateEditFormDeferred = null;

                    this.callBase.apply(this, arguments);
                },

                isFormOrPopupEditMode: function() {
                    return this.isPopupEditMode() || this.isFormEditMode();
                },

                isPopupEditMode: function() {
                    const editMode = this.option('editing.mode');
                    return editMode === EDIT_MODE_POPUP;
                },

                isFormEditMode: function() {
                    const editMode = this.option('editing.mode');
                    return editMode === EDIT_MODE_FORM;
                },

                getFirstEditableColumnIndex: function() {
                    const firstFormItem = this._firstFormItem;

                    if(this.isFormEditMode() && firstFormItem) {
                        const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
                        const editRowIndex = this._dataController.getRowIndexByKey(editRowKey);
                        const $editFormElements = this._rowsView.getCellElements(editRowIndex);
                        return this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
                    }

                    return this.callBase.apply(this, arguments);
                },

                getEditFormRowIndex: function() {
                    return this.isFormOrPopupEditMode() ? this._getVisibleEditRowIndex() : this.callBase.apply(this, arguments);
                },

                _isEditColumnVisible: function() {
                    const result = this.callBase.apply(this, arguments);
                    const editingOptions = this.option('editing');

                    return this.isFormOrPopupEditMode() ? editingOptions.allowUpdating || result : result;
                },

                _handleDataChanged: function(args) {
                    if(this.isPopupEditMode()) {
                        const editRowKey = this.option('editing.editRowKey');
                        const hasEditRow = args?.items?.some((item) => equalByValue(item.key, editRowKey));

                        const onlyInsertChanges = args.changeTypes?.length && args.changeTypes.every(item => item === 'insert');

                        if((args.changeType === 'refresh' || (hasEditRow && args.isOptionChanged)) && !onlyInsertChanges) {
                            this._repaintEditPopup();
                        }
                    }

                    this.callBase.apply(this, arguments);
                },

                getPopupContent: function() {
                    const popupVisible = this._editPopup?.option('visible');

                    if(this.isPopupEditMode() && popupVisible) {
                        return this._$popupContent;
                    }
                },

                _showAddedRow: function(rowIndex) {
                    if(this.isPopupEditMode()) {
                        this._showEditPopup(rowIndex);
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                _cancelEditDataCore: function() {
                    this.callBase.apply(this, arguments);

                    if(this.isPopupEditMode()) {
                        this._hideEditPopup();
                    }
                },

                _updateEditRowCore: function(row, skipCurrentRow, isCustomSetCellValue) {
                    const editForm = this._editForm;

                    if(this.isPopupEditMode()) {
                        if(this.option('repaintChangesOnly')) {
                            row.update?.(row);
                            this._rowsView.renderDelayedTemplates();
                        } else if(editForm) {
                            this._updateEditFormDeferred = new Deferred().done(() => editForm.repaint());
                            if(!this._updateLockCount) {
                                this._updateEditFormDeferred.resolve();
                            }
                        }
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                _showEditPopup: function(rowIndex, repaintForm) {
                    const isMobileDevice = devices.current().deviceType !== 'desktop';
                    const popupOptions = extend(
                        {
                            showTitle: false,
                            fullScreen: isMobileDevice,
                            copyRootClassesToWrapper: true,
                            _ignoreCopyRootClassesToWrapperDeprecation: true,
                            toolbarItems: [
                                { toolbar: 'bottom', location: 'after', widget: 'dxButton', options: this._getSaveButtonConfig() },
                                { toolbar: 'bottom', location: 'after', widget: 'dxButton', options: this._getCancelButtonConfig() }
                            ],
                            contentTemplate: this._getPopupEditFormTemplate(rowIndex)
                        },
                        this.option(EDITING_POPUP_OPTION_NAME)
                    );

                    if(!this._editPopup) {
                        const $popupContainer = $('<div>')
                            .appendTo(this.component.$element())
                            .addClass(this.addWidgetPrefix(EDIT_POPUP_CLASS));

                        this._editPopup = this._createComponent($popupContainer, Popup, { copyRootClassesToWrapper: true, _ignoreCopyRootClassesToWrapperDeprecation: true });
                        this._editPopup.on('hiding', this._getEditPopupHiddenHandler());
                        this._editPopup.on('shown', (e) => {
                            eventsEngine.trigger(e.component.$content().find(FOCUSABLE_ELEMENT_SELECTOR).not(`.${FOCUSABLE_ELEMENT_CLASS}`).first(), 'focus');

                            if(repaintForm) {
                                this._editForm?.repaint();
                            }
                        });
                    }

                    this._editPopup.option(popupOptions);
                    this._editPopup.show();

                    this.callBase.apply(this, arguments);
                },

                _getPopupEditFormTemplate: function(rowIndex) {
                    const row = this.component.getVisibleRows()[rowIndex];
                    const templateOptions = {
                        row: row,
                        values: row.values,
                        rowType: row.rowType,
                        key: row.key,
                        rowIndex
                    };

                    this._rowsView._addWatchMethod(templateOptions, row);

                    return (container) => {
                        const formTemplate = this.getEditFormTemplate();
                        const scrollable = this._createComponent($('<div>').appendTo(container), Scrollable);

                        this._$popupContent = $(scrollable.content());

                        formTemplate(this._$popupContent, templateOptions, { isPopupForm: true });
                        this._rowsView.renderDelayedTemplates();
                    };
                },

                _repaintEditPopup: function() {
                    const rowIndex = this._getVisibleEditRowIndex();

                    if(rowIndex >= 0) {
                        const defaultAnimation = this._editPopup?.option('animation');

                        this._editPopup?.option('animation', null);
                        this._showEditPopup(rowIndex, true);

                        if(defaultAnimation !== undefined) {
                            this._editPopup.option('animation', defaultAnimation);
                        }
                    }
                },

                _hideEditPopup: function() {
                    this._editPopup?.option('visible', false);
                },

                optionChanged: function(args) {
                    if(args.name === 'editing' && this.isFormOrPopupEditMode()) {
                        const fullName = args.fullName;

                        if(fullName.indexOf(EDITING_FORM_OPTION_NAME) === 0) {
                            this._handleFormOptionChange(args);
                            args.handled = true;
                        } else if(fullName.indexOf(EDITING_POPUP_OPTION_NAME) === 0) {
                            this._handlePopupOptionChange(args);
                            args.handled = true;
                        }
                    }

                    this.callBase.apply(this, arguments);
                },

                _handleFormOptionChange: function(args) {
                    if(this.isFormEditMode()) {
                        const editRowIndex = this._getVisibleEditRowIndex();
                        if(editRowIndex >= 0) {
                            this._dataController.updateItems({
                                changeType: 'update',
                                rowIndices: [editRowIndex]
                            });
                        }
                    } else if(this._editPopup?.option('visible') && args.fullName.indexOf(EDITING_FORM_OPTION_NAME) === 0) {
                        this._repaintEditPopup();
                    }
                },

                _handlePopupOptionChange: function(args) {
                    const editPopup = this._editPopup;
                    if(editPopup) {
                        const popupOptionName = args.fullName.slice(EDITING_POPUP_OPTION_NAME.length + 1);
                        if(popupOptionName) {
                            editPopup.option(popupOptionName, args.value);
                        } else {
                            editPopup.option(args.value);
                        }
                    }
                },
                renderFormEditorTemplate: function(detailCellOptions, item, formTemplateOptions, container, isReadOnly) {
                    const that = this;
                    const $container = $(container);
                    const column = item.column;
                    const editorType = getEditorType(item);
                    const rowData = detailCellOptions?.row.data;
                    const form = formTemplateOptions.component;
                    const { label, labelMark, labelMode } = formTemplateOptions.editorOptions || {};

                    const cellOptions = extend({}, detailCellOptions, {
                        data: rowData,
                        cellElement: null,
                        isOnForm: true,
                        item: item,
                        id: form.getItemID(item.name || item.dataField),
                        column: extend({}, column, {
                            editorType: editorType,
                            editorOptions: extend({
                                label, labelMark, labelMode
                            }, column.editorOptions, item.editorOptions)
                        }),
                        columnIndex: column.index,
                        setValue: !isReadOnly && column.allowEditing && function(value, text) {
                            that.updateFieldValue(cellOptions, value, text);
                        }
                    });

                    cellOptions.value = column.calculateCellValue(rowData);

                    const template = this._getFormEditItemTemplate.bind(this)(cellOptions, column);
                    this._rowsView.renderTemplate($container, template, cellOptions, !!$container.closest(getWindow().document).length).done(() => {
                        this._rowsView._updateCell($container, cellOptions);
                    });
                    return cellOptions;
                },

                getFormEditorTemplate: function(cellOptions, item) {
                    const column = this.component.columnOption(item.dataField);

                    return (options, container) => {
                        const $container = $(container);

                        cellOptions.row.watch?.(function() {
                            return column.selector(cellOptions.row.data);
                        }, () => {
                            let $editorElement = $container.find('.dx-widget').first();
                            let validator = $editorElement.data('dxValidator');
                            const validatorOptions = validator?.option();

                            $container.contents().remove();
                            cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);

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

                        cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);
                    };
                },

                getEditFormOptions: function(detailOptions) {
                    const editFormOptions = this._getValidationGroupsInForm?.(detailOptions);
                    const userCustomizeItem = this.option('editing.form.customizeItem');
                    const editFormItemClass = this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS);
                    let items = this.option('editing.form.items');
                    const isCustomEditorType = {};

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

                    return extend({}, editFormOptions, {
                        items,
                        formID: 'dx-' + new Guid(),
                        customizeItem: (item) => {
                            let column;
                            const itemId = item.name || item.dataField;

                            if(item.column || itemId) {
                                column = item.column || this._columnsController.columnOption(item.name ? 'name:' + item.name : 'dataField:' + item.dataField);
                            }
                            if(column) {
                                item.label = item.label || {};
                                item.label.text = item.label.text || column.caption;
                                if(column.dataType === 'boolean' && item.label.visible === undefined) {
                                    const labelMode = this.option('editing.form.labelMode');
                                    if(labelMode === 'floating' || labelMode === 'static') {
                                        item.label.visible = true;
                                    }
                                }
                                item.template = item.template || this.getFormEditorTemplate(detailOptions, item);
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
                                if(!this._firstFormItem && itemVisible) {
                                    this._firstFormItem = item;
                                }
                            }
                            userCustomizeItem?.call(this, item);
                            item.cssClass = isString(item.cssClass) ? item.cssClass + ' ' + editFormItemClass : editFormItemClass;
                        }
                    });
                },

                getEditFormTemplate: function() {
                    return ($container, detailOptions, options) => {
                        const editFormOptions = this.option(EDITING_FORM_OPTION_NAME);
                        const baseEditFormOptions = this.getEditFormOptions(detailOptions);
                        const $formContainer = $('<div>').appendTo($container);
                        const isPopupForm = options?.isPopupForm;

                        this._firstFormItem = undefined;

                        if(isPopupForm) {
                            $formContainer.addClass(this.addWidgetPrefix(EDIT_POPUP_FORM_CLASS));
                        }
                        this._editForm = this._createComponent($formContainer, Form, extend({}, editFormOptions, baseEditFormOptions));

                        if(!isPopupForm) {
                            const $buttonsContainer = $('<div>').addClass(this.addWidgetPrefix(FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);
                            this._createComponent($('<div>').appendTo($buttonsContainer), Button, this._getSaveButtonConfig());
                            this._createComponent($('<div>').appendTo($buttonsContainer), Button, this._getCancelButtonConfig());
                        }

                        this._editForm.on('contentReady', () => {
                            this._rowsView.renderDelayedTemplates();
                            this._editPopup?.repaint();
                        });
                    };
                },

                getEditForm: function() {
                    return this._editForm;
                },

                _endUpdateCore: function() {
                    this._updateEditFormDeferred?.resolve();
                },

                _beforeEndSaving: function() {
                    this.callBase.apply(this, arguments);

                    if(this.isPopupEditMode()) {
                        this._editPopup?.hide();
                    }
                },

                _processDataItemCore: function(item, { type }) {
                    if(this.isPopupEditMode() && type === DATA_EDIT_DATA_INSERT_TYPE) {
                        item.visible = false;
                    }

                    this.callBase.apply(this, arguments);
                },

                _editRowFromOptionChangedCore: function(rowIndices, rowIndex) {
                    const isPopupEditMode = this.isPopupEditMode();

                    this.callBase(rowIndices, rowIndex, isPopupEditMode);

                    if(isPopupEditMode) {
                        this._showEditPopup(rowIndex);
                    }
                }
            },
            data: {
                _updateEditItem: function(item) {
                    if(this._editingController.isFormEditMode()) {
                        item.rowType = 'detail';
                    }
                },

                _getChangedColumnIndices: function(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
                    if(isLiveUpdate === false && newItem.isEditing && this._editingController.isFormEditMode()) {
                        return;
                    }

                    return this.callBase.apply(this, arguments);
                }
            }
        },
        views: {
            rowsView: {
                _renderCellContent: function($cell, options) {
                    if(options.rowType === 'data' && this._editingController.isPopupEditMode() && options.row.visible === false) {
                        return;
                    }

                    this.callBase.apply(this, arguments);
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
                        if(item?.column && column && item.column.index === column.index) {
                            visibleIndex = index;
                            return false;
                        }
                    });
                    return visibleIndex;
                },
                _isFormItem: function(parameters) {
                    const isDetailRow = parameters.rowType === 'detail' || parameters.rowType === 'detailAdaptive';
                    const isPopupEditing = parameters.rowType === 'data' && this._editingController.isPopupEditMode();
                    return (isDetailRow || isPopupEditing) && parameters.item;
                },
                _updateCell: function($cell, parameters) {
                    if(this._isFormItem(parameters)) {
                        this._formItemPrepared(parameters, $cell);
                    } else {
                        this.callBase($cell, parameters);
                    }
                },
            }
        }
    }
};
