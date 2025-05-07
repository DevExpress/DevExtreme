/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import devices from '@js/core/devices';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { isElementInDom } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isString } from '@js/core/utils/type';
import Button from '@js/ui/button';
import Form from '@js/ui/form';
import Popup from '@js/ui/popup/ui.popup';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import type { ModuleType } from '../m_types';
import gridCoreUtils from '../m_utils';
import {
  BUTTON_CLASS,
  DATA_EDIT_DATA_INSERT_TYPE,
  EDIT_FORM_ITEM_CLASS,
  EDIT_MODE_FORM,
  EDIT_POPUP_CLASS,
  EDIT_POPUP_FORM_CLASS,
  EDITING_EDITROWKEY_OPTION_NAME,
  EDITING_FORM_OPTION_NAME,
  EDITING_POPUP_OPTION_NAME,
  FOCUSABLE_ELEMENT_CLASS,
  FOCUSABLE_ELEMENT_SELECTOR,
  FORM_BUTTONS_CONTAINER_CLASS,
} from './const';
import type { EditingController } from './m_editing';
import { forEachFormItems, getEditorType } from './m_editing_utils';

export interface IFormBasedEditingControllerExtender {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  renderFormEditorTemplate(detailCellOptions, item, formTemplateOptions, container, isReadOnly?): any;
}

const editingControllerExtender = (Base: ModuleType<EditingController>) => class FormBasedEditingControllerExtender extends Base implements IFormBasedEditingControllerExtender {
  private _updateEditFormDeferred: any;

  private _firstFormItem: any;

  private _editPopup: any;

  private _$popupContent: any;

  public init() {
    this._editForm = null;
    this._updateEditFormDeferred = null;

    super.init();
  }

  public isEditRow(rowIndex) {
    return !this.isPopupEditMode() && super.isEditRow(rowIndex);
  }

  private isFormOrPopupEditMode() {
    return this.isPopupEditMode() || this.isFormEditMode();
  }

  private isFormEditMode() {
    const editMode = this.option('editing.mode');
    return editMode === EDIT_MODE_FORM;
  }

  protected getFirstEditableColumnIndex() {
    const firstFormItem = this._firstFormItem;

    if (this.isFormEditMode() && firstFormItem) {
      const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
      const editRowIndex = this._dataController.getRowIndexByKey(editRowKey);
      const $editFormElements = this._rowsView.getCellElements(editRowIndex);
      // @ts-expect-error
      return this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
    }

    return super.getFirstEditableColumnIndex();
  }

  public getEditFormRowIndex() {
    return this.isFormOrPopupEditMode() ? this._getVisibleEditRowIndex() : super.getEditFormRowIndex();
  }

  protected _isEditColumnVisible() {
    const result = super._isEditColumnVisible();
    const editingOptions: any = this.option('editing');

    return this.isFormOrPopupEditMode() ? editingOptions.allowUpdating || result : result;
  }

  protected _handleDataChanged(args) {
    if (this.isPopupEditMode()) {
      const editRowKey = this.option('editing.editRowKey');
      const hasEditRow = args?.items?.some((item) => equalByValue(item.key, editRowKey));

      const onlyInsertChanges = args.changeTypes?.length && args.changeTypes.every((item) => item === 'insert');

      if ((args.changeType === 'refresh' || (hasEditRow && args.isOptionChanged)) && !onlyInsertChanges) {
        this._repaintEditPopup();
      }
    }

    super._handleDataChanged(args);
  }

  protected getPopupContent() {
    const popupVisible = this._editPopup?.option('visible');

    if (this.isPopupEditMode() && popupVisible) {
      return this._$popupContent;
    }
  }

  protected _showAddedRow(rowIndex) {
    if (this.isPopupEditMode()) {
      this._showEditPopup(rowIndex);
    } else {
      super._showAddedRow(rowIndex);
    }
  }

  protected _cancelEditDataCore() {
    super._cancelEditDataCore();

    if (this.isPopupEditMode()) {
      this._hideEditPopup();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue) {
    const editForm = this._editForm;

    if (this.isPopupEditMode()) {
      if (this.option('repaintChangesOnly')) {
        row.update?.(row);
        this._rowsView.renderDelayedTemplates();
      } else if (editForm) {
        // @ts-expect-error
        this._updateEditFormDeferred = new Deferred().done(() => editForm.repaint());
        if (!this._updateLockCount) {
          this._updateEditFormDeferred.resolve();
        }
      }
    } else {
      super._updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue);
    }
  }

  protected _showEditPopup(rowIndex, repaintForm?) {
    const isMobileDevice = devices.current().deviceType !== 'desktop';
    const editPopupClass = this.addWidgetPrefix(EDIT_POPUP_CLASS);
    const popupOptions = extend(
      {
        showTitle: false,
        fullScreen: isMobileDevice,
        wrapperAttr: { class: editPopupClass },
        toolbarItems: [
          {
            toolbar: 'bottom', location: 'after', widget: 'dxButton', options: this._getSaveButtonConfig(),
          },
          {
            toolbar: 'bottom', location: 'after', widget: 'dxButton', options: this._getCancelButtonConfig(),
          },
        ],
        contentTemplate: this._getPopupEditFormTemplate(rowIndex),
      },
      this.option(EDITING_POPUP_OPTION_NAME),
    );

    if (!this._editPopup) {
      const $popupContainer = $('<div>')
        .appendTo(this.component.$element())
        .addClass(editPopupClass);

      this._editPopup = this._createComponent($popupContainer, Popup);
      this._editPopup.on('hiding', this._getEditPopupHiddenHandler());
      this._editPopup.on('shown', (e) => {
        (eventsEngine as any).trigger(e.component.$content().find(FOCUSABLE_ELEMENT_SELECTOR).not(`.${FOCUSABLE_ELEMENT_CLASS}`).first(), 'focus');

        if (repaintForm) {
          this._editForm?.repaint();
        }
      });
    }

    this._editPopup.option(popupOptions);
    this._editPopup.show();

    super._showEditPopup(rowIndex, repaintForm);
  }

  protected _getPopupEditFormTemplate(rowIndex) {
    // @ts-expect-error
    const row = this.component.getVisibleRows()[rowIndex];
    const templateOptions = {
      row,
      values: row.values,
      rowType: row.rowType,
      key: row.key,
      rowIndex,
    };

    this._rowsView._addWatchMethod(templateOptions, row);

    return (container) => {
      const formTemplate = this.getEditFormTemplate();
      const scrollable = this._createComponent($('<div>').appendTo(container), Scrollable);

      this._$popupContent = $((scrollable as any).content());

      formTemplate(this._$popupContent, templateOptions, { isPopupForm: true });
      this._rowsView.renderDelayedTemplates();
      $(container).parent().attr('aria-label', this.localize('dxDataGrid-ariaEditForm'));
    };
  }

  protected _repaintEditPopup() {
    const rowIndex = this._getVisibleEditRowIndex();

    if (rowIndex >= 0) {
      const defaultAnimation = this._editPopup?.option('animation');

      this._editPopup?.option('animation', null);
      this._showEditPopup(rowIndex, true);

      if (defaultAnimation !== undefined) {
        this._editPopup.option('animation', defaultAnimation);
      }
    }
  }

  protected _hideEditPopup() {
    this._editPopup?.option('visible', false);
  }

  public optionChanged(args) {
    if (args.name === 'editing' && this.isFormOrPopupEditMode()) {
      const { fullName } = args;

      if (fullName.indexOf(EDITING_FORM_OPTION_NAME) === 0) {
        this._handleFormOptionChange(args);
        args.handled = true;
      } else if (fullName.indexOf(EDITING_POPUP_OPTION_NAME) === 0) {
        this._handlePopupOptionChange(args);
        args.handled = true;
      }
    }

    super.optionChanged(args);
  }

  private _handleFormOptionChange(args) {
    if (this.isFormEditMode()) {
      const editRowIndex = this._getVisibleEditRowIndex();
      if (editRowIndex >= 0) {
        this._dataController.updateItems({
          changeType: 'update',
          rowIndices: [editRowIndex],
        });
      }
    } else if (this._editPopup?.option('visible') && args.fullName.indexOf(EDITING_FORM_OPTION_NAME) === 0) {
      this._repaintEditPopup();
    }
  }

  private _handlePopupOptionChange(args) {
    const editPopup = this._editPopup;
    if (editPopup) {
      const popupOptionName = args.fullName.slice(EDITING_POPUP_OPTION_NAME.length + 1);
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
  public renderFormEditorTemplate(detailCellOptions, item, formTemplateOptions, container, isReadOnly?) {
    const that = this;
    const $container = $(container);
    const { column } = item;
    const editorType = getEditorType(item);
    const row = detailCellOptions?.row;
    const rowData = row?.data;
    const form = formTemplateOptions.component;
    const value = column.calculateCellValue(rowData);
    const displayValue = gridCoreUtils.getDisplayValue(column, value, rowData, row?.rowType);
    const { label, labelMark, labelMode } = formTemplateOptions.editorOptions || {};

    const cellOptions = extend({}, detailCellOptions, {
      data: rowData,
      cellElement: null,
      isOnForm: true,
      item,
      id: form.getItemID(item.name || item.dataField),
      column: extend({}, column, {
        editorType,
        editorOptions: extend({
          label, labelMark, labelMode,
        }, column.editorOptions, item.editorOptions),
      }),
      columnIndex: column.index,
      setValue: !isReadOnly && column.allowEditing && function (value, text) {
        that.updateFieldValue(cellOptions, value, text);
      },
    });

    cellOptions.value = value;
    cellOptions.displayValue = displayValue;
    cellOptions.text = !column.command ? gridCoreUtils.formatValue(displayValue, column) : '';

    const template = this._getFormEditItemTemplate.bind(this)(cellOptions, column);
    this._rowsView.renderTemplate($container, template, cellOptions, !!isElementInDom($container)).done(() => {
      this._rowsView._updateCell($container, cellOptions);
    });
    return cellOptions;
  }

  private getFormEditorTemplate(cellOptions, item) {
    const column = this.component.columnOption(item.name || item.dataField);

    return (options, container) => {
      const $container = $(container);
      const { row } = cellOptions;

      if (row?.watch) {
        const dispose = row.watch(() => column.selector(row.data), () => {
          let $editorElement: any = $container.find('.dx-widget').first();
          let validator: any = $editorElement.data('dxValidator');
          const validatorOptions = validator?.option();

          ($container.contents() as any).remove();
          cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);

          $editorElement = $container.find('.dx-widget').first();
          validator = $editorElement.data('dxValidator');
          if (validatorOptions && !validator) {
            $editorElement.dxValidator({
              validationRules: validatorOptions.validationRules,
              validationGroup: validatorOptions.validationGroup,
              dataGetter: validatorOptions.dataGetter,
            });
          }
        });

        eventsEngine.on($container, removeEvent, dispose);
      }

      cellOptions = this.renderFormEditorTemplate.bind(this)(cellOptions, item, options, $container);
    };
  }

  private getEditFormOptions(detailOptions) {
    const editFormOptions = (this as any)._getValidationGroupsInForm?.(detailOptions);
    const userCustomizeItem = this.option('editing.form.customizeItem');
    const editFormItemClass = this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS);
    let items: any = this.option('editing.form.items');
    const isCustomEditorType = {};

    if (!items) {
      const columns = this._columnsController.getColumns();
      items = [];
      each(columns, (_, column) => {
        if (!column.isBand && !column.type) {
          items.push({
            column,
            name: column.name,
            dataField: column.dataField,
          });
        }
      });
    } else {
      forEachFormItems(items, (item) => {
        const itemId = item?.name || item?.dataField;

        if (itemId) {
          isCustomEditorType[itemId] = !!item.editorType;
        }
      });
    }

    return extend({}, editFormOptions, {
      items,
      formID: `dx-${new Guid()}`,
      customizeItem: (item) => {
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
            extend(item, column.formItem);
          }
          if (item.isRequired === undefined && column.validationRules) {
            item.isRequired = column.validationRules.some((rule) => rule.type === 'required');
            item.validationRules = [];
          }

          const itemVisible = isDefined(item.visible) ? item.visible : true;
          if (!this._firstFormItem && itemVisible) {
            this._firstFormItem = item;
          }
        }
        userCustomizeItem?.call(this, item);
        item.cssClass = isString(item.cssClass) ? `${item.cssClass} ${editFormItemClass}` : editFormItemClass;
      },
    });
  }

  private getEditFormTemplate() {
    return ($container, detailOptions, options) => {
      const editFormOptions = this.option(EDITING_FORM_OPTION_NAME);
      const baseEditFormOptions = this.getEditFormOptions(detailOptions);
      const $formContainer = $('<div>').appendTo($container);
      const isPopupForm = options?.isPopupForm;

      this._firstFormItem = undefined;

      if (isPopupForm) {
        $formContainer.addClass(this.addWidgetPrefix(EDIT_POPUP_FORM_CLASS));
      }
      this._editForm = this._createComponent($formContainer, Form, extend({}, editFormOptions, baseEditFormOptions));

      if (!isPopupForm) {
        const $buttonsContainer = $('<div>').addClass(this.addWidgetPrefix(FORM_BUTTONS_CONTAINER_CLASS)).appendTo($container);
        this._createComponent($('<div>').appendTo($buttonsContainer), Button, this._getSaveButtonConfig());
        this._createComponent($('<div>').appendTo($buttonsContainer), Button, this._getCancelButtonConfig());
      }

      this._editForm.on('contentReady', () => {
        this._rowsView.renderDelayedTemplates();
        this._editPopup?.repaint();
      });
    };
  }

  private getEditForm() {
    return this._editForm;
  }

  protected _endUpdateCore() {
    this._updateEditFormDeferred?.resolve();
  }

  protected _beforeEndSaving(changes) {
    super._beforeEndSaving(changes);

    if (this.isPopupEditMode()) {
      this._editPopup?.hide();
    }
  }

  protected _processDataItemCore(item, change, key, columns, generateDataValues) {
    const { type } = change;

    if (this.isPopupEditMode() && type === DATA_EDIT_DATA_INSERT_TYPE) {
      item.visible = false;
    }

    super._processDataItemCore(item, change, key, columns, generateDataValues);
  }

  protected _editRowFromOptionChangedCore(rowIndices, rowIndex) {
    const isPopupEditMode = this.isPopupEditMode();

    super._editRowFromOptionChangedCore(rowIndices, rowIndex, isPopupEditMode);

    if (isPopupEditMode) {
      this._showEditPopup(rowIndex);
    }
  }
};

const data = (Base: ModuleType<DataController>) => class DataEditingFormBasedExtender extends Base {
  private _updateEditItem(item) {
    // @ts-expect-error
    if (this._editingController.isFormEditMode()) {
      item.rowType = 'detail';
    }
  }

  protected _getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate) {
    // @ts-expect-error
    if (isLiveUpdate === false && newItem.isEditing && this._editingController.isFormEditMode()) {
      return;
    }

    return super._getChangedColumnIndices.apply(this, arguments as any);
  }
};

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewEditingFormBasedExtender extends Base {
  protected _renderCellContent($cell, options) {
    // @ts-expect-error
    if (options.rowType === 'data' && this._editingController.isPopupEditMode() && options.row.visible === false) {
      return;
    }

    super._renderCellContent.apply(this, arguments as any);
  }

  public getCellElements(rowIndex): dxElementWrapper | undefined {
    const $cellElements = super.getCellElements(rowIndex);
    const editingController = this._editingController;
    // @ts-expect-error
    const editForm = editingController.getEditForm();
    const editFormRowIndex = editingController.getEditFormRowIndex();

    if (editFormRowIndex === rowIndex && $cellElements && editForm) {
      return editForm.$element().find(`.${this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS)}, .${BUTTON_CLASS}`);
    }

    return $cellElements;
  }

  protected _getVisibleColumnIndex($cells, rowIndex, columnIdentifier) {
    const editFormRowIndex = this._editingController.getEditFormRowIndex();

    if (editFormRowIndex === rowIndex && isString(columnIdentifier)) {
      const column = this._columnsController.columnOption(columnIdentifier);
      return this._getEditFormEditorVisibleIndex($cells, column);
    }

    return super._getVisibleColumnIndex.apply(this, arguments as any);
  }

  private _getEditFormEditorVisibleIndex($cells, column) {
    let visibleIndex: any = -1;

    // @ts-expect-error
    each($cells, (index, cellElement) => {
      const item: any = $(cellElement).find('.dx-field-item-content').data('dx-form-item');
      if (item?.column && column && item.column.index === column.index) {
        visibleIndex = index;
        return false;
      }
    });
    return visibleIndex;
  }

  private _isFormItem(parameters) {
    const isDetailRow = parameters.rowType === 'detail' || parameters.rowType === 'detailAdaptive';
    // @ts-expect-error
    const isPopupEditing = parameters.rowType === 'data' && this._editingController.isPopupEditMode();
    return (isDetailRow || isPopupEditing) && parameters.item;
  }

  public _updateCell($cell, parameters) {
    if (this._isFormItem(parameters)) {
      // @ts-expect-error Badly typed based class
      this._formItemPrepared(parameters, $cell);
    } else {
      super._updateCell($cell, parameters);
    }
  }

  protected _updateContent() {
    const editingController = this._editingController;
    // @ts-expect-error
    const oldEditForm = editingController.getEditForm();
    const validationGroup = oldEditForm?.option('validationGroup');
    const deferred = super._updateContent.apply(this, arguments as any);
    return deferred.done(() => {
      // @ts-expect-error
      const newEditForm = editingController.getEditForm();
      if (validationGroup && newEditForm && newEditForm !== oldEditForm) {
        newEditForm.option('validationGroup', validationGroup);
      }
    });
  }
};

export const editingFormBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      data,
    },
    views: {
      rowsView,
    },
  },
};
