/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import devices from '@js/core/devices';
import type { DxElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isElementInDom } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { isDefined, isString } from '@js/core/utils/type';
import Button from '@js/ui/button';
import type { SimpleItemTemplateData } from '@js/ui/form';
import Form from '@js/ui/form';
import Popup from '@js/ui/popup/ui.popup';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import { WIDGET_CLASS } from '@ts/core/widget/widget';
import type { Column, ColumnTemplateSource } from '@ts/grids/grid_core/columns_controller/types';
import type { GeneratedItem, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type {
  CellRenderOptions, ViewCellOptions, ViewDataChange,
} from '@ts/grids/grid_core/views/types';
import { FIELD_ITEM_CONTENT_CLASS } from '@ts/ui/form/constants';

import type { ModuleType, OptionChanged, RowKey } from '../types';
import gridCoreUtils from '../utils';
import {
  CLASSES,
  DATA_CHANGE_TYPE,
  EDIT_MODE,
  EDITING_EDITROWKEY_OPTION_NAME,
  EDITING_FORM_OPTION_NAME,
  EDITING_POPUP_OPTION_NAME,
  FOCUSABLE_ELEMENT_SELECTOR,
} from './const';
import type { EditingController } from './editing';
import { forEachFormItems, getEditorType, getEditorValidator } from './editing_utils';
import { editingFormBasedDataControllerExtender } from './extenders/editing_form_based_data_controller';
import type {
  EditFormColumnItem,
  EditFormDetailOptions,
  EditFormItem,
  EditFormOptions,
  EditingChange,
  EditorCellOptions,
} from './types';

export interface FormBasedEditingControllerExtension {
  isFormEditMode: () => boolean;
  renderFormEditorTemplate: (
    detailCellOptions: EditFormDetailOptions,
    item: EditFormColumnItem,
    formTemplateOptions: SimpleItemTemplateData,
    container: dxElementWrapper,
    isReadOnly?: boolean,
  ) => EditorCellOptions;
  getEditForm: () => Form | null | undefined;
}

export type FormBasedEditingController = EditingController & FormBasedEditingControllerExtension;

type EditFormTemplate = (
  $container: DxElement | dxElementWrapper,
  detailOptions: EditFormDetailOptions,
  options?: { isPopupForm?: boolean },
) => void;

const editingControllerExtender = (
  Base: ModuleType<EditingController>,
): ModuleType<FormBasedEditingController> => class FormBasedEditingControllerExtender extends Base {
  protected _rowsView!: RowsView & EditingFormBasedRowsViewExtension;

  private _updateEditFormDeferred?: DeferredObj<unknown> | null;

  private _firstFormItem?: EditFormItem;

  private _editPopup?: Popup;

  private _$popupContent?: dxElementWrapper;

  public init(): void {
    this._editForm = null;
    this._updateEditFormDeferred = null;

    super.init();
  }

  public isEditRow(rowIndex: number | undefined): boolean {
    return !this.isPopupEditMode() && super.isEditRow(rowIndex);
  }

  private isFormOrPopupEditMode(): boolean {
    return this.isPopupEditMode() || this.isFormEditMode();
  }

  public isFormEditMode(): boolean {
    const editMode = this.option('editing.mode');
    return editMode === EDIT_MODE.form;
  }

  protected getFirstEditableColumnIndex(): number | undefined {
    const firstFormItem = this._firstFormItem;

    if (this.isFormEditMode() && firstFormItem) {
      const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
      const editRowIndex = this._dataController.getRowIndexByKey(editRowKey);
      const $editFormElements = this._rowsView.getCellElements(editRowIndex);
      return this._rowsView._getEditFormEditorVisibleIndex($editFormElements, firstFormItem.column);
    }

    return super.getFirstEditableColumnIndex();
  }

  public getEditFormRowIndex(): number {
    return this.isFormOrPopupEditMode()
      ? this._getVisibleEditRowIndex()
      : super.getEditFormRowIndex();
  }

  protected _isEditColumnVisible(): boolean {
    const result = super._isEditColumnVisible();
    const editingOptions = this.option('editing');

    return this.isFormOrPopupEditMode() ? !!editingOptions?.allowUpdating || result : result;
  }

  protected _handleDataChanged(args: ViewDataChange & { isOptionChanged?: boolean }): void {
    if (this.isPopupEditMode()) {
      const editRowKey = this.option('editing.editRowKey');
      const hasEditRow = args?.items?.some((item) => equalByValue(item.key, editRowKey));
      const isEditRowChangedByOption = hasEditRow && args.isOptionChanged;
      const affectsEditPopup = args.changeType === 'refresh' || isEditRowChangedByOption;

      const onlyInsertChanges = args.changeTypes?.length && args.changeTypes.every((item) => item === 'insert');

      if (affectsEditPopup && !onlyInsertChanges) {
        this._repaintEditPopup();
      }
    }

    super._handleDataChanged(args);
  }

  protected getPopupContent(): dxElementWrapper | undefined {
    const popupVisible = this._editPopup?.option('visible');

    if (this.isPopupEditMode() && popupVisible) {
      return this._$popupContent;
    }

    return undefined;
  }

  protected _showAddedRow(rowIndex: number): void {
    if (this.isPopupEditMode()) {
      this._showEditPopup(rowIndex);
    } else {
      super._showAddedRow(rowIndex);
    }
  }

  protected _cancelEditDataCore(): void {
    super._cancelEditDataCore();

    if (this.isPopupEditMode()) {
      this._hideEditPopup();
    }
  }

  protected _updateEditRowCore(
    row: ProcessedItem,
    skipCurrentRow: boolean,
    isCustomSetCellValue?: boolean,
  ): void {
    const editForm = this._editForm;

    if (this.isPopupEditMode()) {
      if (this.option('repaintChangesOnly')) {
        row.update?.(row);
        this._rowsView.renderDelayedTemplates();
      } else if (editForm) {
        this._updateEditFormDeferred = Deferred<unknown>().done(() => editForm.repaint());
        if (!this._updateLockCount) {
          this._updateEditFormDeferred.resolve();
        }
      }
    } else {
      super._updateEditRowCore(row, skipCurrentRow, isCustomSetCellValue);
    }
  }

  protected _showEditPopup(rowIndex: number, repaintForm?: boolean): void {
    const isMobileDevice = devices.current().deviceType !== 'desktop';
    const editPopupClass = this.addWidgetPrefix(CLASSES.editPopup);
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
      this._editPopup.on('hiding', this.getEditPopupHidingHandler());
      this._editPopup.on('shown', (e) => {
        const $focusableElement = e.component.$content()
          .find(FOCUSABLE_ELEMENT_SELECTOR)
          .not(`.${CLASSES.focusableElement}`)
          .first();
        // @ts-expect-error eventsEngine.trigger is not fully typed
        eventsEngine.trigger($focusableElement, 'focus');

        if (repaintForm) {
          this._editForm?.repaint();
        }
      });
    }

    this._editPopup.option(popupOptions);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    this._editPopup.show();

    super._showEditPopup(rowIndex, repaintForm);
  }

  protected _getPopupEditFormTemplate(rowIndex: number): (container: DxElement) => void {
    const row = this.component.getVisibleRows()[rowIndex];
    const templateOptions = {
      row,
      values: row.values,
      rowType: row.rowType,
      key: row.key,
      rowIndex,
    };

    this._rowsView._addWatchMethod(templateOptions, row);

    return (container: DxElement): void => {
      const formTemplate = this.getEditFormTemplate();
      const scrollable = this._createComponent($('<div>').appendTo(container), Scrollable);

      this._$popupContent = $(scrollable.content());

      formTemplate(this._$popupContent, templateOptions, { isPopupForm: true });
      this._rowsView.renderDelayedTemplates();
      this.setAria('label', this.localize('dxDataGrid-ariaEditForm'), $(container).parent());
    };
  }

  protected _repaintEditPopup(): void {
    const rowIndex = this._getVisibleEditRowIndex();

    if (rowIndex >= 0) {
      const defaultAnimation = this._editPopup?.option('animation');

      this._editPopup?.option('animation', null);
      this._showEditPopup(rowIndex, true);

      if (defaultAnimation !== undefined) {
        this._editPopup?.option('animation', defaultAnimation);
      }
    }
  }

  protected _hideEditPopup(): void {
    this._editPopup?.option('visible', false);
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'editing' && this.isFormOrPopupEditMode()) {
      const { fullName } = args;

      if (fullName.startsWith(EDITING_FORM_OPTION_NAME)) {
        this._handleFormOptionChange(args);
        args.handled = true;
      } else if (fullName.startsWith(EDITING_POPUP_OPTION_NAME)) {
        this._handlePopupOptionChange(args);
        args.handled = true;
      }
    }

    super.optionChanged(args);
  }

  private _handleFormOptionChange(args: OptionChanged): void {
    if (this.isFormEditMode()) {
      const editRowIndex = this._getVisibleEditRowIndex();
      if (editRowIndex >= 0) {
        this._dataController.updateItems({
          changeType: 'update',
          rowIndices: [editRowIndex],
        });
      }
    } else if (
      this._editPopup?.option('visible')
      && args.fullName.startsWith(EDITING_FORM_OPTION_NAME)
    ) {
      this._repaintEditPopup();
    }
  }

  private _handlePopupOptionChange(args: OptionChanged): void {
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
  public renderFormEditorTemplate(
    detailCellOptions: EditFormDetailOptions,
    item: EditFormColumnItem,
    formTemplateOptions: SimpleItemTemplateData,
    container: dxElementWrapper,
    isReadOnly?: boolean,
  ): EditorCellOptions {
    const $container = $(container);
    const row = detailCellOptions?.row;

    // @ts-expect-error createColumn initializes calculateCellValue
    const value = item.column.calculateCellValue(row?.data);
    const displayValue = gridCoreUtils.getDisplayValue(item.column, value, row?.data, row?.rowType);
    const text = !item.column.command ? gridCoreUtils.formatValue(displayValue, item.column) : '';
    const { label, labelMark, labelMode } = formTemplateOptions.editorOptions ?? {};

    const editorOptions = extend(
      {
        label, labelMark, labelMode,
      },
      item.column.editorOptions,
      item.editorOptions,
    );
    const column = extend(
      {},
      item.column,
      {
        editorType: getEditorType(item),
        editorOptions,
      },
    );

    // @ts-expect-error the detail row is a ProcessedItem, and every column has an index
    const cellOptions: EditorCellOptions = extend({}, detailCellOptions, {
      data: row?.data,
      cellElement: null,
      isOnForm: true,
      item,
      // @ts-expect-error getItemID() isn't declared on the public dxForm type
      id: formTemplateOptions.component.getItemID(item.name || item.dataField),
      column,
      columnIndex: item.column.index,
      setValue: !isReadOnly && item.column.allowEditing
        && ((newValue: unknown, newText?: string): void => {
          this.updateFieldValue(cellOptions, newValue, newText);
        }),
    });

    cellOptions.value = value;
    cellOptions.displayValue = displayValue;
    cellOptions.text = text;

    const template = this._getFormEditItemTemplate.bind(this)(cellOptions, item.column);
    this._rowsView
      .renderTemplate($container, template, cellOptions, isElementInDom($container))
      .done(() => {
        this._rowsView._updateCell($container, cellOptions);
      });

    return cellOptions;
  }

  private getFormEditorTemplate(
    cellOptions: EditFormDetailOptions,
    item: EditFormColumnItem,
  ): (options: SimpleItemTemplateData, container: DxElement) => void {
    const column = this._columnsController.columnOption(item.name || item.dataField);
    let editorCellOptions = cellOptions;

    return (options: SimpleItemTemplateData, container: DxElement): void => {
      const $container = $(container);
      const { row } = editorCellOptions;

      if (row?.watch) {
        // @ts-expect-error no column without name or dataField; selector and data are set
        const dispose = row.watch(() => column.selector(row.data), () => {
          const validatorOptions = getEditorValidator($container)?.option();

          $container.contents().remove();
          editorCellOptions = this.renderFormEditorTemplate.bind(this)(
            editorCellOptions,
            item,
            options,
            $container,
          );

          if (validatorOptions && !getEditorValidator($container)) {
            // @ts-expect-error dxValidator is added to the renderer at runtime
            $container.find(`.${WIDGET_CLASS}`).first().dxValidator({
              validationRules: validatorOptions.validationRules,
              validationGroup: validatorOptions.validationGroup,
              dataGetter: validatorOptions.dataGetter,
            });
          }
        });

        eventsEngine.on($container, removeEvent, dispose);
      }

      editorCellOptions = this.renderFormEditorTemplate.bind(this)(
        editorCellOptions,
        item,
        options,
        $container,
      );
    };
  }

  private getEditFormOptions(detailOptions: EditFormDetailOptions): EditFormOptions {
    // @ts-expect-error _getValidationGroupsInForm is declared on the validating extender
    const editFormOptions: Partial<EditFormOptions> | undefined = this._getValidationGroupsInForm?.(
      detailOptions,
    );
    const userCustomizeItem = this.option('editing.form.customizeItem');
    const editFormItemClass = this.addWidgetPrefix(CLASSES.editFormItem);
    let items = this.option('editing.form.items');
    const isCustomEditorType: Record<string, boolean> = {};

    if (!items) {
      items = this._columnsController.getColumns()
        .filter((column) => !column.isBand && !column.type)
        .map((column): EditFormItem => ({
          column,
          name: column.name,
          dataField: column.dataField,
        }));
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
      customizeItem: (item: EditFormItem): void => {
        const itemId = item.name || item.dataField;
        const columnIdentifier = item.name ? `name:${item.name}` : `dataField:${item.dataField}`;
        const column = item.column
          ?? (itemId ? this._columnsController.columnOption(columnIdentifier) : undefined);

        if (column) {
          item.label = item.label ?? {};
          item.label.text = item.label.text || column.caption;
          if (column.dataType === 'boolean' && item.label.visible === undefined) {
            const labelMode = this.option('editing.form.labelMode');
            if (labelMode === 'floating' || labelMode === 'static') {
              item.label.visible = true;
            }
          }
          // @ts-expect-error the column is set below, before the form renders the template
          item.template = item.template || this.getFormEditorTemplate(detailOptions, item);
          item.column = column;
          // @ts-expect-error an item with only a column reads the 'undefined' key
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

  public getColumnTemplate(
    options: EditorCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    const { column, row, rowType } = options;

    if (column.command === 'detail' && rowType === 'detail' && this.isEditRow(row?.rowIndex)) {
      return this.getEditFormTemplate();
    }

    return super.getColumnTemplate(options);
  }

  private getEditFormTemplate(): EditFormTemplate {
    return ($container, detailOptions, options): void => {
      const editFormOptions = this.option(EDITING_FORM_OPTION_NAME);
      const baseEditFormOptions = this.getEditFormOptions(detailOptions);
      const $formContainer = $('<div>').appendTo($container);
      const isPopupForm = options?.isPopupForm;

      this._firstFormItem = undefined;

      if (isPopupForm) {
        $formContainer.addClass(this.addWidgetPrefix(CLASSES.editPopupForm));
      }
      this._editForm = this._createComponent(
        $formContainer,
        Form,
        extend({}, editFormOptions, baseEditFormOptions),
      );

      if (!isPopupForm) {
        const $buttonsContainer = $('<div>')
          .addClass(this.addWidgetPrefix(CLASSES.formButtonsContainer))
          .appendTo($container);
        this._createComponent($('<div>').appendTo($buttonsContainer), Button, this._getSaveButtonConfig());
        this._createComponent($('<div>').appendTo($buttonsContainer), Button, this._getCancelButtonConfig());
      }

      this._editForm.on('contentReady', () => {
        this._rowsView.renderDelayedTemplates();
        this._editPopup?.repaint();
      });
    };
  }

  public getEditForm(): Form | null | undefined {
    return this._editForm;
  }

  protected _endUpdateCore(): void {
    this._updateEditFormDeferred?.resolve();
  }

  protected _beforeEndSaving(changes: EditingChange[]): void {
    super._beforeEndSaving(changes);

    if (this.isPopupEditMode()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      this._editPopup?.hide();
    }
  }

  protected _processDataItemCore(
    item: GeneratedItem,
    change: EditingChange,
    key: RowKey,
    columns: Column[],
  ): void {
    if (this.isPopupEditMode() && change.type === DATA_CHANGE_TYPE.insert) {
      item.visible = false;
    }

    super._processDataItemCore(item, change, key, columns);
  }

  protected _editRowFromOptionChangedCore(rowIndices: number[], rowIndex: number): void {
    const isPopupEditMode = this.isPopupEditMode();

    super._editRowFromOptionChangedCore(rowIndices, rowIndex, isPopupEditMode);

    if (isPopupEditMode) {
      this._showEditPopup(rowIndex);
    }
  }
};

export interface EditingFormBasedRowsViewExtension {
  _getEditFormEditorVisibleIndex: (
    $cells: dxElementWrapper | undefined,
    column: Column | undefined,
  ) => number;
}

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<
  RowsView & EditingFormBasedRowsViewExtension
> => class RowsViewEditingFormBasedExtender extends Base {
  public _editingController!: FormBasedEditingController;

  protected _renderCellContent(
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    if (
      options.rowType === 'data'
      && this._editingController.isPopupEditMode()
      && options.row?.visible === false
    ) {
      return;
    }

    super._renderCellContent($cell, options, renderOptions);
  }

  public getCellElements(rowIndex: number): dxElementWrapper | undefined {
    const $cellElements = super.getCellElements(rowIndex);
    const editForm = this._editingController.getEditForm();
    const editFormRowIndex = this._editingController.getEditFormRowIndex();

    if (editFormRowIndex === rowIndex && $cellElements && editForm) {
      return editForm.$element().find(`.${this.addWidgetPrefix(CLASSES.editFormItem)}, .${CLASSES.button}`);
    }

    return $cellElements;
  }

  protected _getVisibleColumnIndex(
    $cells: dxElementWrapper,
    rowIndex: number,
    columnIdentifier: string | number,
  ): number {
    const editFormRowIndex = this._editingController.getEditFormRowIndex();

    if (editFormRowIndex === rowIndex && isString(columnIdentifier)) {
      const column = this._columnsController.columnOption(columnIdentifier);
      return this._getEditFormEditorVisibleIndex($cells, column);
    }

    return super._getVisibleColumnIndex($cells, rowIndex, columnIdentifier);
  }

  public _getEditFormEditorVisibleIndex(
    $cells: dxElementWrapper | undefined,
    column: Column | undefined,
  ): number {
    return $cells?.toArray().findIndex((cellElement) => {
      const item: EditFormItem | undefined = $(cellElement).find(`.${FIELD_ITEM_CONTENT_CLASS}`).data('dx-form-item');

      return Boolean(item?.column && column && item.column.index === column.index);
    }) ?? -1;
  }

  private _isFormItem(parameters: EditorCellOptions): EditFormColumnItem | false | undefined {
    const isDetailRow = parameters.rowType === 'detail' || parameters.rowType === 'detailAdaptive';
    const isPopupEditing = parameters.rowType === 'data' && this._editingController.isPopupEditMode();

    return (isDetailRow || isPopupEditing) && parameters.item;
  }

  public _updateCell($cell: dxElementWrapper, parameters: EditorCellOptions): void {
    if (this._isFormItem(parameters)) {
      // @ts-expect-error Badly typed based class
      this._formItemPrepared(parameters, $cell);
    } else {
      super._updateCell($cell, parameters);
    }
  }

  protected _updateContent(
    newTableElement: dxElementWrapper,
    change?: ViewDataChange,
    isFixedTableRendering?: boolean,
  ): DeferredObj<unknown> {
    const oldEditForm = this._editingController.getEditForm();
    const validationGroup = oldEditForm?.option('validationGroup');
    const deferred = super._updateContent(newTableElement, change, isFixedTableRendering);

    return deferred.done(() => {
      const newEditForm = this._editingController.getEditForm();
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
      data: editingFormBasedDataControllerExtender,
    },
    views: {
      rowsView,
    },
  },
};
