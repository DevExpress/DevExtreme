"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editingFormBasedModule = void 0;
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _guid = _interopRequireDefault(require("../../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _dom = require("../../../../core/utils/dom");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _remove = require("../../../../events/remove");
var _button = _interopRequireDefault(require("../../../../ui/button"));
var _form = _interopRequireDefault(require("../../../../ui/form"));
var _ui = _interopRequireDefault(require("../../../../ui/popup/ui.popup"));
var _ui2 = _interopRequireDefault(require("../../../../ui/scroll_view/ui.scrollable"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const = require("./const");
var _m_editing_utils = require("./m_editing_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const editingControllerExtender = Base => class FormBasedEditingControllerExtender extends Base {
  init() {
    this._editForm = null;
    this._updateEditFormDeferred = null;
    super.init();
  }
  isEditRow(rowIndex) {
    return !this.isPopupEditMode() && super.isEditRow(rowIndex);
  }
  isFormOrPopupEditMode() {
    return this.isPopupEditMode() || this.isFormEditMode();
  }
  isFormEditMode() {
    const editMode = this.option('editing.mode');
    return editMode === _const.EDIT_MODE_FORM;
  }
  getFirstEditableColumnIndex() {
    const firstFormItem = this._firstFormItem;
    if (this.isFormEditMode() && firstFormItem) {
      const editRowKey = this.option(_const.EDITING_EDITROWKEY_OPTION_NAME);
      const editRowIndex = this._dataController.getRowIndexByKey(editRowKey);
      const $editFormElements = this._rowsView.getCellElements(editRowIndex);
      // @ts-expect-error
      return this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
    }
    return super.getFirstEditableColumnIndex();
  }
  getEditFormRowIndex() {
    return this.isFormOrPopupEditMode() ? this._getVisibleEditRowIndex() : super.getEditFormRowIndex();
  }
  _isEditColumnVisible() {
    const result = super._isEditColumnVisible();
    const editingOptions = this.option('editing');
    return this.isFormOrPopupEditMode() ? editingOptions.allowUpdating || result : result;
  }
  _handleDataChanged(args) {
    if (this.isPopupEditMode()) {
      var _args$items, _args$changeTypes;
      const editRowKey = this.option('editing.editRowKey');
      const hasEditRow = args === null || args === void 0 || (_args$items = args.items) === null || _args$items === void 0 ? void 0 : _args$items.some(item => (0, _common.equalByValue)(item.key, editRowKey));
      const onlyInsertChanges = ((_args$changeTypes = args.changeTypes) === null || _args$changeTypes === void 0 ? void 0 : _args$changeTypes.length) && args.changeTypes.every(item => item === 'insert');
      if ((args.changeType === 'refresh' || hasEditRow && args.isOptionChanged) && !onlyInsertChanges) {
        this._repaintEditPopup();
      }
    }
    super._handleDataChanged(args);
  }
  getPopupContent() {
    var _this$_editPopup;
    const popupVisible = (_this$_editPopup = this._editPopup) === null || _this$_editPopup === void 0 ? void 0 : _this$_editPopup.option('visible');
    if (this.isPopupEditMode() && popupVisible) {
      return this._$popupContent;
    }
  }
  _showAddedRow(rowIndex) {
    if (this.isPopupEditMode()) {
      this._showEditPopup(rowIndex);
    } else {
      super._showAddedRow(rowIndex);
    }
  }
  _cancelEditDataCore() {
    super._cancelEditDataCore();
    if (this.isPopupEditMode()) {
      this._hideEditPopup();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue) {
    const editForm = this._editForm;
    if (this.isPopupEditMode()) {
      if (this.option('repaintChangesOnly')) {
        var _row$update;
        (_row$update = row.update) === null || _row$update === void 0 || _row$update.call(row, row);
        this._rowsView.renderDelayedTemplates();
      } else if (editForm) {
        // @ts-expect-error
        this._updateEditFormDeferred = new _deferred.Deferred().done(() => editForm.repaint());
        if (!this._updateLockCount) {
          this._updateEditFormDeferred.resolve();
        }
      }
    } else {
      super._updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue);
    }
  }
  _showEditPopup(rowIndex, repaintForm) {
    const isMobileDevice = _devices.default.current().deviceType !== 'desktop';
    const editPopupClass = this.addWidgetPrefix(_const.EDIT_POPUP_CLASS);
    const popupOptions = (0, _extend.extend)({
      showTitle: false,
      fullScreen: isMobileDevice,
      wrapperAttr: {
        class: editPopupClass
      },
      toolbarItems: [{
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: this._getSaveButtonConfig()
      }, {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: this._getCancelButtonConfig()
      }],
      contentTemplate: this._getPopupEditFormTemplate(rowIndex)
    }, this.option(_const.EDITING_POPUP_OPTION_NAME));
    if (!this._editPopup) {
      const $popupContainer = (0, _renderer.default)('<div>').appendTo(this.component.$element()).addClass(editPopupClass);
      this._editPopup = this._createComponent($popupContainer, _ui.default);
      this._editPopup.on('hiding', this._getEditPopupHiddenHandler());
      this._editPopup.on('shown', e => {
        _events_engine.default.trigger(e.component.$content().find(_const.FOCUSABLE_ELEMENT_SELECTOR).not(`.${_const.FOCUSABLE_ELEMENT_CLASS}`).first(), 'focus');
        if (repaintForm) {
          var _this$_editForm;
          (_this$_editForm = this._editForm) === null || _this$_editForm === void 0 || _this$_editForm.repaint();
        }
      });
    }
    this._editPopup.option(popupOptions);
    this._editPopup.show();
    super._showEditPopup(rowIndex, repaintForm);
  }
  _getPopupEditFormTemplate(rowIndex) {
    // @ts-expect-error
    const row = this.component.getVisibleRows()[rowIndex];
    const templateOptions = {
      row,
      values: row.values,
      rowType: row.rowType,
      key: row.key,
      rowIndex
    };
    this._rowsView._addWatchMethod(templateOptions, row);
    return container => {
      const formTemplate = this.getEditFormTemplate();
      const scrollable = this._createComponent((0, _renderer.default)('<div>').appendTo(container), _ui2.default);
      this._$popupContent = (0, _renderer.default)(scrollable.content());
      formTemplate(this._$popupContent, templateOptions, {
        isPopupForm: true
      });
      this._rowsView.renderDelayedTemplates();
      (0, _renderer.default)(container).parent().attr('aria-label', this.localize('dxDataGrid-ariaEditForm'));
    };
  }
  _repaintEditPopup() {
    const rowIndex = this._getVisibleEditRowIndex();
    if (rowIndex >= 0) {
      var _this$_editPopup2, _this$_editPopup3;
      const defaultAnimation = (_this$_editPopup2 = this._editPopup) === null || _this$_editPopup2 === void 0 ? void 0 : _this$_editPopup2.option('animation');
      (_this$_editPopup3 = this._editPopup) === null || _this$_editPopup3 === void 0 || _this$_editPopup3.option('animation', null);
      this._showEditPopup(rowIndex, true);
      if (defaultAnimation !== undefined) {
        this._editPopup.option('animation', defaultAnimation);
      }
    }
  }
  _hideEditPopup() {
    var _this$_editPopup4;
    (_this$_editPopup4 = this._editPopup) === null || _this$_editPopup4 === void 0 || _this$_editPopup4.option('visible', false);
  }
  optionChanged(args) {
    if (args.name === 'editing' && this.isFormOrPopupEditMode()) {
      const {
        fullName
      } = args;
      if (fullName.indexOf(_const.EDITING_FORM_OPTION_NAME) === 0) {
        this._handleFormOptionChange(args);
        args.handled = true;
      } else if (fullName.indexOf(_const.EDITING_POPUP_OPTION_NAME) === 0) {
        this._handlePopupOptionChange(args);
        args.handled = true;
      }
    }
    super.optionChanged(args);
  }
  _handleFormOptionChange(args) {
    var _this$_editPopup5;
    if (this.isFormEditMode()) {
      const editRowIndex = this._getVisibleEditRowIndex();
      if (editRowIndex >= 0) {
        this._dataController.updateItems({
          changeType: 'update',
          rowIndices: [editRowIndex]
        });
      }
    } else if ((_this$_editPopup5 = this._editPopup) !== null && _this$_editPopup5 !== void 0 && _this$_editPopup5.option('visible') && args.fullName.indexOf(_const.EDITING_FORM_OPTION_NAME) === 0) {
      this._repaintEditPopup();
    }
  }
  _handlePopupOptionChange(args) {
    const editPopup = this._editPopup;
    if (editPopup) {
      const popupOptionName = args.fullName.slice(_const.EDITING_POPUP_OPTION_NAME.length + 1);
      if (popupOptionName) {
        editPopup.option(popupOptionName, args.value);
      } else {
        editPopup.option(args.value);
      }
    }
  }
  /**
   * interface override
   */
  renderFormEditorTemplate(detailCellOptions, item, formTemplateOptions, container, isReadOnly) {
    const that = this;
    const $container = (0, _renderer.default)(container);
    const {
      column
    } = item;
    const editorType = (0, _m_editing_utils.getEditorType)(item);
    const row = detailCellOptions === null || detailCellOptions === void 0 ? void 0 : detailCellOptions.row;
    const rowData = row === null || row === void 0 ? void 0 : row.data;
    const form = formTemplateOptions.component;
    const value = column.calculateCellValue(rowData);
    const displayValue = _m_utils.default.getDisplayValue(column, value, rowData, row === null || row === void 0 ? void 0 : row.rowType);
    const {
      label,
      labelMark,
      labelMode
    } = formTemplateOptions.editorOptions || {};
    const cellOptions = (0, _extend.extend)({}, detailCellOptions, {
      data: rowData,
      cellElement: null,
      isOnForm: true,
      item,
      id: form.getItemID(item.name || item.dataField),
      column: (0, _extend.extend)({}, column, {
        editorType,
        editorOptions: (0, _extend.extend)({
          label,
          labelMark,
          labelMode
        }, column.editorOptions, item.editorOptions)
      }),
      columnIndex: column.index,
      setValue: !isReadOnly && column.allowEditing && function (value, text) {
        that.updateFieldValue(cellOptions, value, text);
      }
    });
    cellOptions.value = value;
    cellOptions.displayValue = displayValue;
    cellOptions.text = !column.command ? _m_utils.default.formatValue(displayValue, column) : '';
    const template = this._getFormEditItemTemplate.bind(this)(cellOptions, column);
    this._rowsView.renderTemplate($container, template, cellOptions, !!(0, _dom.isElementInDom)($container)).done(() => {
      this._rowsView._updateCell($container, cellOptions);
    });
    return cellOptions;
  }
  getFormEditorTemplate(cellOptions, item) {
    const column = this.component.columnOption(item.name || item.dataField);
    return (options, container) => {
      const $container = (0, _renderer.default)(container);
      const {
        row
      } = cellOptions;
      if (row !== null && row !== void 0 && row.watch) {
        const dispose = row.watch(() => column.selector(row.data), () => {
          var _validator;
          let $editorElement = $container.find('.dx-widget').first();
          let validator = $editorElement.data('dxValidator');
          const validatorOptions = (_validator = validator) === null || _validator === void 0 ? void 0 : _validator.option();
          $container.contents().remove();
          cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);
          $editorElement = $container.find('.dx-widget').first();
          validator = $editorElement.data('dxValidator');
          if (validatorOptions && !validator) {
            $editorElement.dxValidator({
              validationRules: validatorOptions.validationRules,
              validationGroup: validatorOptions.validationGroup,
              dataGetter: validatorOptions.dataGetter
            });
          }
        });
        _events_engine.default.on($container, _remove.removeEvent, dispose);
      }
      cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);
    };
  }
  getEditFormOptions(detailOptions) {
    var _this$_getValidationG;
    const editFormOptions = (_this$_getValidationG = this._getValidationGroupsInForm) === null || _this$_getValidationG === void 0 ? void 0 : _this$_getValidationG.call(this, detailOptions);
    const userCustomizeItem = this.option('editing.form.customizeItem');
    const editFormItemClass = this.addWidgetPrefix(_const.EDIT_FORM_ITEM_CLASS);
    let items = this.option('editing.form.items');
    const isCustomEditorType = {};
    if (!items) {
      const columns = this._columnsController.getColumns();
      items = [];
      (0, _iterator.each)(columns, (_, column) => {
        if (!column.isBand && !column.type) {
          items.push({
            column,
            name: column.name,
            dataField: column.dataField
          });
        }
      });
    } else {
      (0, _m_editing_utils.forEachFormItems)(items, item => {
        const itemId = (item === null || item === void 0 ? void 0 : item.name) || (item === null || item === void 0 ? void 0 : item.dataField);
        if (itemId) {
          isCustomEditorType[itemId] = !!item.editorType;
        }
      });
    }
    return (0, _extend.extend)({}, editFormOptions, {
      items,
      formID: `dx-${new _guid.default()}`,
      customizeItem: item => {
        let column;
        const itemId = item.name || item.dataField;
        if (item.column || itemId) {
          column = item.column || this._columnsController.columnOption(item.name ? `name:${item.name}` : `dataField:${item.dataField}`);
        }
        if (column) {
          item.label = item.label || {};
          item.label.text = item.label.text || column.caption;
          if (column.dataType === 'boolean' && item.label.visible === undefined) {
            const labelMode = this.option('editing.form.labelMode');
            if (labelMode === 'floating' || labelMode === 'static') {
              item.label.visible = true;
            }
          }
          item.template = item.template || this.getFormEditorTemplate(detailOptions, item);
          item.column = column;
          item.isCustomEditorType = isCustomEditorType[itemId];
          if (column.formItem) {
            (0, _extend.extend)(item, column.formItem);
          }
          if (item.isRequired === undefined && column.validationRules) {
            item.isRequired = column.validationRules.some(rule => rule.type === 'required');
            item.validationRules = [];
          }
          const itemVisible = (0, _type.isDefined)(item.visible) ? item.visible : true;
          if (!this._firstFormItem && itemVisible) {
            this._firstFormItem = item;
          }
        }
        userCustomizeItem === null || userCustomizeItem === void 0 || userCustomizeItem.call(this, item);
        item.cssClass = (0, _type.isString)(item.cssClass) ? `${item.cssClass} ${editFormItemClass}` : editFormItemClass;
      }
    });
  }
  getEditFormTemplate() {
    return ($container, detailOptions, options) => {
      const editFormOptions = this.option(_const.EDITING_FORM_OPTION_NAME);
      const baseEditFormOptions = this.getEditFormOptions(detailOptions);
      const $formContainer = (0, _renderer.default)('<div>').appendTo($container);
      const isPopupForm = options === null || options === void 0 ? void 0 : options.isPopupForm;
      this._firstFormItem = undefined;
      if (isPopupForm) {
        $formContainer.addClass(this.addWidgetPrefix(_const.EDIT_POPUP_FORM_CLASS));
      }
      this._editForm = this._createComponent($formContainer, _form.default, (0, _extend.extend)({}, editFormOptions, baseEditFormOptions));
      if (!isPopupForm) {
        const $buttonsContainer = (0, _renderer.default)('<div>').addClass(this.addWidgetPrefix(_const.FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);
        this._createComponent((0, _renderer.default)('<div>').appendTo($buttonsContainer), _button.default, this._getSaveButtonConfig());
        this._createComponent((0, _renderer.default)('<div>').appendTo($buttonsContainer), _button.default, this._getCancelButtonConfig());
      }
      this._editForm.on('contentReady', () => {
        var _this$_editPopup6;
        this._rowsView.renderDelayedTemplates();
        (_this$_editPopup6 = this._editPopup) === null || _this$_editPopup6 === void 0 || _this$_editPopup6.repaint();
      });
    };
  }
  getEditForm() {
    return this._editForm;
  }
  _endUpdateCore() {
    var _this$_updateEditForm;
    (_this$_updateEditForm = this._updateEditFormDeferred) === null || _this$_updateEditForm === void 0 || _this$_updateEditForm.resolve();
  }
  _beforeEndSaving(changes) {
    super._beforeEndSaving(changes);
    if (this.isPopupEditMode()) {
      var _this$_editPopup7;
      (_this$_editPopup7 = this._editPopup) === null || _this$_editPopup7 === void 0 || _this$_editPopup7.hide();
    }
  }
  _processDataItemCore(item, change, key, columns, generateDataValues) {
    const {
      type
    } = change;
    if (this.isPopupEditMode() && type === _const.DATA_EDIT_DATA_INSERT_TYPE) {
      item.visible = false;
    }
    super._processDataItemCore(item, change, key, columns, generateDataValues);
  }
  _editRowFromOptionChangedCore(rowIndices, rowIndex) {
    const isPopupEditMode = this.isPopupEditMode();
    super._editRowFromOptionChangedCore(rowIndices, rowIndex, isPopupEditMode);
    if (isPopupEditMode) {
      this._showEditPopup(rowIndex);
    }
  }
};
const data = Base => class DataEditingFormBasedExtender extends Base {
  _updateEditItem(item) {
    // @ts-expect-error
    if (this._editingController.isFormEditMode()) {
      item.rowType = 'detail';
    }
  }
  _getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
    // @ts-expect-error
    if (isLiveUpdate === false && newItem.isEditing && this._editingController.isFormEditMode()) {
      return;
    }
    return super._getChangedColumnIndices.apply(this, arguments);
  }
};
const rowsView = Base => class RowsViewEditingFormBasedExtender extends Base {
  _renderCellContent($cell, options) {
    // @ts-expect-error
    if (options.rowType === 'data' && this._editingController.isPopupEditMode() && options.row.visible === false) {
      return;
    }
    super._renderCellContent.apply(this, arguments);
  }
  getCellElements(rowIndex) {
    const $cellElements = super.getCellElements(rowIndex);
    const editingController = this._editingController;
    // @ts-expect-error
    const editForm = editingController.getEditForm();
    const editFormRowIndex = editingController.getEditFormRowIndex();
    if (editFormRowIndex === rowIndex && $cellElements && editForm) {
      return editForm.$element().find(`.${this.addWidgetPrefix(_const.EDIT_FORM_ITEM_CLASS)}, .${_const.BUTTON_CLASS}`);
    }
    return $cellElements;
  }
  _getVisibleColumnIndex($cells, rowIndex, columnIdentifier) {
    const editFormRowIndex = this._editingController.getEditFormRowIndex();
    if (editFormRowIndex === rowIndex && (0, _type.isString)(columnIdentifier)) {
      const column = this._columnsController.columnOption(columnIdentifier);
      return this._getEditFormEditorVisibleIndex($cells, column);
    }
    return super._getVisibleColumnIndex.apply(this, arguments);
  }
  _getEditFormEditorVisibleIndex($cells, column) {
    let visibleIndex = -1;
    // @ts-expect-error
    (0, _iterator.each)($cells, (index, cellElement) => {
      const item = (0, _renderer.default)(cellElement).find('.dx-field-item-content').data('dx-form-item');
      if (item !== null && item !== void 0 && item.column && column && item.column.index === column.index) {
        visibleIndex = index;
        return false;
      }
    });
    return visibleIndex;
  }
  _isFormItem(parameters) {
    const isDetailRow = parameters.rowType === 'detail' || parameters.rowType === 'detailAdaptive';
    // @ts-expect-error
    const isPopupEditing = parameters.rowType === 'data' && this._editingController.isPopupEditMode();
    return (isDetailRow || isPopupEditing) && parameters.item;
  }
  _updateCell($cell, parameters) {
    if (this._isFormItem(parameters)) {
      // @ts-expect-error Badly typed based class
      this._formItemPrepared(parameters, $cell);
    } else {
      super._updateCell($cell, parameters);
    }
  }
  _updateContent() {
    const editingController = this._editingController;
    // @ts-expect-error
    const oldEditForm = editingController.getEditForm();
    const validationGroup = oldEditForm === null || oldEditForm === void 0 ? void 0 : oldEditForm.option('validationGroup');
    const deferred = super._updateContent.apply(this, arguments);
    return deferred.done(() => {
      // @ts-expect-error
      const newEditForm = editingController.getEditForm();
      if (validationGroup && newEditForm && newEditForm !== oldEditForm) {
        newEditForm.option('validationGroup', validationGroup);
      }
    });
  }
};
const editingFormBasedModule = exports.editingFormBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      data
    },
    views: {
      rowsView
    }
  }
};