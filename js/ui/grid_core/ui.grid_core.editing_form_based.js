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
import Scrollable from '../scroll_view/ui.scrollable';
import Popup from '../popup';

const EDIT_FORM_ITEM_CLASS = 'edit-form-item';
const EDIT_POPUP_CLASS = 'edit-popup';
const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_POPUP = 'popup';
const BUTTON_CLASS = 'dx-button';

const EDITORS_INPUT_SELECTOR = 'input:not([type=\'hidden\'])';
const FOCUSABLE_ELEMENT_SELECTOR = '[tabindex], ' + EDITORS_INPUT_SELECTOR;

const EDITING_EDITROWKEY_OPTION_NAME = 'editing.editRowKey';
const EDITING_POPUP_OPTION_NAME = 'editing.popup';
const FORM_BUTTONS_CONTAINER_CLASS = 'form-buttons-container';

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
                    const editForm = this._editForm;

                    if(args.changeType === 'refresh' && this.isPopupEditMode() && editForm && editForm.option('visible')) {
                        this._repaintEditPopup();
                    }

                    this.callBase.apply(this, arguments);
                },

                getPopupContent: function() {
                    const popupVisible = this._editPopup && this._editPopup.option('visible');

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
                                that._editForm?.repaint();
                            }
                        });
                    }

                    that._editPopup.option(popupOptions);
                    that._editPopup.show();

                    this.callBase.apply(this, arguments);
                },

                _getPopupEditFormTemplate: function(rowIndex) {
                    const row = this.component.getVisibleRows()[rowIndex];
                    const templateOptions = {
                        row: row,
                        rowType: row.rowType,
                        key: row.key
                    };

                    return (container) => {
                        const formTemplate = this.getEditFormTemplate();
                        const scrollable = this._createComponent($('<div>').appendTo(container), Scrollable);

                        this._$popupContent = scrollable.$content();

                        formTemplate(this._$popupContent, templateOptions, true);
                    };
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

                _hideEditPopup: function() {
                    this._editPopup?.option('visible', false);
                },

                optionChanged: function(args) {
                    if(args.name === 'editing' && this.isFormOrPopupEditMode()) {
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
                        }

                        args.handled = true;
                    }

                    this.callBase.apply(this, arguments);
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
                    const editFormOptions = this._getValidationGroupsInForm?.(detailOptions);
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

                    return extend({}, editFormOptions, {
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
                    });
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


                getEditForm: function() {
                    return this._editForm;
                },

                _endUpdateCore: function() {
                    this._updateEditFormDeferred && this._updateEditFormDeferred.resolve();
                },
            },
            data: {
                _updateEditItem: function(item) {
                    if(this._editingController.isFormEditMode()) {
                        item.rowType = 'detail';
                    }
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
                        if(item && item.column && column && item.column.index === column.index) {
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
