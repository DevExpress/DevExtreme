import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import { addNamespace } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import type { GridsEditMode } from '@js/common/grids';
import type { DxElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { isElementInDom } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { Properties as FormProperties, SimpleItemTemplateData } from '@js/ui/form';
import Form from '@js/ui/form';
import { isMaterial } from '@js/ui/themes';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import { FIELD_ITEM_CONTENT_CLASS } from '@ts/ui/form/constants';

import { AI_COLUMN_NAME } from '../ai_column/const';
import type { ColumnsController } from '../columns_controller/columns_controller';
import type { ProcessedItem } from '../data_controller/types';
import { EDIT_MODE_FORM, EDIT_MODE_POPUP, EDIT_MODE_ROW } from '../editing/const';
import type { EditingController } from '../editing/m_editing';
import type { KeyboardNavigationController } from '../keyboard_navigation/m_keyboard_navigation';
import { CLASSES as MASTER_DETAIL_CLASSES } from '../master_detail/const';
import modules from '../modules/modules';
import type { OptionChanged, RowKey } from '../types';
import gridCoreUtils from '../utils';
import type { RowsView } from '../views/rows_view';
import type { ColumnWidth, ViewCellOptions } from '../views/types';
import { isPercentWidth } from '../views/utils';
import {
  ADAPTIVE_COLUMN_NAME,
  ADAPTIVE_NAMESPACE,
  ADAPTIVE_ROW_TYPE,
  CLASSES,
  COLUMN_HEADERS_VIEW,
  COLUMN_VIEWS,
  HIDDEN_COLUMNS_WIDTH,
  ROWS_VIEW,
} from './const';
import type {
  AdaptiveDetailCellOptions,
  AdaptiveFormItem,
  AdaptivityDataController,
  HiddenCellInViewOptions,
  HiddenCellsInViewOptions,
  HideVisibleColumnInViewOptions,
  HideVisibleColumnOptions,
  PercentWidthOptions,
} from './types';
import { getHideableColumns } from './utils';

function adaptiveCellTemplate(container: DxElement, options: ViewCellOptions): void {
  const $container = $(container);
  // TODO getController
  // @ts-expect-error renderTemplate sets the component
  const adaptiveColumnsController = options.component.getController('adaptiveColumns');

  if (options.rowType === 'data') {
    const $adaptiveColumnButton = $('<span>')
      .addClass(adaptiveColumnsController.addWidgetPrefix(CLASSES.adaptiveColumnButton));

    eventsEngine.on(
      $adaptiveColumnButton,
      addNamespace(clickEventName, ADAPTIVE_NAMESPACE),
      adaptiveColumnsController.createAction(() => {
        adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
      }),
    );
    $adaptiveColumnButton.appendTo($container);
  } else {
    gridCoreUtils.setEmptyText($container);
  }
}

export class AdaptiveColumnsViewController extends modules.ViewController {
  private _columnsController!: ColumnsController;

  private _dataController!: AdaptivityDataController;

  private _editingController!: EditingController;

  protected _rowsView!: RowsView;

  private _hiddenColumns!: Column[];

  private _$itemContents?: dxElementWrapper | null;

  private _form?: Form;

  private _hidingColumnsQueue!: Column[];

  protected _keyboardNavigationController!: KeyboardNavigationController;

  public init(): void {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data') as AdaptivityDataController;
    this._editingController = this.getController('editing');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._rowsView = this.getView('rowsView');

    this._columnsController.addCommandColumn({
      type: ADAPTIVE_COLUMN_NAME,
      command: ADAPTIVE_COLUMN_NAME,
      visible: true,
      adaptiveHidden: true,
      cssClass: CLASSES.commandAdaptive,
      alignment: 'center',
      width: 'auto',
      cellTemplate: adaptiveCellTemplate,
      fixedPosition: 'right',
    });

    this._columnsController.columnsChanged.add(() => {
      const isAdaptiveVisible = !!this.updateHidingQueue(
        this._columnsController.getColumns(),
      ).length;
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !isAdaptiveVisible, true);
    });
    this._hidingColumnsQueue = [];
    this._hiddenColumns = [];
    this.createAction('onAdaptiveDetailRowPreparing');

    super.init();
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'columnHidingEnabled') {
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !args.value);
    }

    super.optionChanged(args);
  }

  public publicMethods(): string[] {
    return ['isAdaptiveDetailRowExpanded', 'expandAdaptiveDetailRow', 'collapseAdaptiveDetailRow'];
  }

  private _getValueFromCellOptions(
    columnIndex: number,
    cellOptions: AdaptiveDetailCellOptions,
  ): unknown {
    return cellOptions.row.values[columnIndex];
  }

  private _isRowEditMode(): boolean {
    const editMode = this._getEditMode();
    return editMode === EDIT_MODE_ROW;
  }

  private _isItemModified(
    item: AdaptiveFormItem,
    cellOptions: AdaptiveDetailCellOptions,
  ): boolean | undefined {
    const columnIndex = this._columnsController.getVisibleIndex(item.column.index);
    const rowIndex = this._dataController.getRowIndexByKey(cellOptions.key);
    const row: ProcessedItem | undefined = this._dataController.items()[rowIndex + 1];

    return row?.modifiedValues && isDefined(row.modifiedValues[columnIndex]);
  }

  private _renderFormViewTemplate(
    item: AdaptiveFormItem,
    cellOptions: AdaptiveDetailCellOptions,
    $container: dxElementWrapper,
  ): void {
    const { column } = item;
    const focusAction = this.createAction(() => {
      if (this._editingController.isEditing()) {
        // @ts-expect-error eventsEngine.trigger is not fully typed
        eventsEngine.trigger($container, clickEventName);
      }
    });
    const rowData = cellOptions.row.data;
    const columnIndex = this._columnsController.getVisibleIndex(column.index);

    const value = column.type === AI_COLUMN_NAME
      ? this._getValueFromCellOptions(columnIndex, cellOptions)
      // @ts-expect-error createColumn initializes calculateCellValue
      : column.calculateCellValue(rowData);

    const displayValue = gridCoreUtils.getDisplayValue(column, value, rowData, cellOptions.rowType);
    const text = gridCoreUtils.formatValue(displayValue, column);
    const isCellOrBatchEditMode = this._editingController.isCellOrBatchEditMode();
    const rowsView = this._rowsView;

    if (column.allowEditing && this._keyboardNavigationController.isKeyboardEnabled()) {
      // @ts-expect-error attr() is typed without undefined
      $container.attr('tabIndex', this.option('tabIndex'));

      if (isCellOrBatchEditMode) {
        eventsEngine.off($container, 'focus', focusAction);
        eventsEngine.on($container, 'focus', focusAction);
      }
    }

    if (column.cellTemplate) {
      const templateOptions = extend({}, cellOptions, {
        value, displayValue, text, column,
      });

      rowsView.renderTemplate(
        $container,
        column.cellTemplate,
        templateOptions,
        isElementInDom($container),
      ).done(() => {
        rowsView._cellPrepared($container, cellOptions);
      });
    } else {
      const container = $container.get(0);
      if (column.encodeHtml) {
        container.textContent = text;
      } else {
        container.innerHTML = text;
      }

      $container.addClass(CLASSES.adaptiveItemText);
      if (!isDefined(text) || text === '') {
        $container.html('&nbsp;');
      }

      if (!this._isRowEditMode()) {
        if (this._isItemModified(item, cellOptions)) {
          $container.addClass(CLASSES.itemModified);
        }
      }

      rowsView._cellPrepared($container, cellOptions);
    }
  }

  private _getTemplate(
    item: AdaptiveFormItem,
    cellOptions: AdaptiveDetailCellOptions,
  ): (options: SimpleItemTemplateData, container: DxElement) => void {
    const { column } = item;
    const editingController = this._editingController;

    return (options: SimpleItemTemplateData, container: DxElement): void => {
      const $container = $(container);
      const columnIndex = this._columnsController.getVisibleIndex(column.index);
      const templateOptions: AdaptiveDetailCellOptions = extend({}, cellOptions);

      const renderFormTemplate = (): void => {
        const isItemEdited = this._isItemEdited(item);
        templateOptions.value = this._getValueFromCellOptions(columnIndex, cellOptions);
        if (isItemEdited || column.showEditorAlways) {
          editingController.renderFormEditorTemplate(
            templateOptions,
            item,
            options,
            $container,
            !isItemEdited,
          );
        } else {
          templateOptions.column = column;
          templateOptions.columnIndex = columnIndex;
          this._renderFormViewTemplate(item, templateOptions, $container);
        }
      };

      renderFormTemplate();

      if (templateOptions.watch) {
        const dispose = templateOptions.watch(() => ({
          isItemEdited: this._isItemEdited(item),
          value: this._getValueFromCellOptions(columnIndex, cellOptions),
        }), () => {
          $container.contents().remove();
          $container.removeClass(CLASSES.adaptiveItemText);
          renderFormTemplate();
        });

        eventsEngine.on($container, removeEvent, dispose);
      }
    };
  }

  private _isVisibleColumnsValid(visibleColumns: Column[]): boolean {
    const commandColumnsCount = visibleColumns.filter((column) => column.command).length;

    if (visibleColumns.length < 2) {
      return false;
    }

    if (visibleColumns.length - commandColumnsCount <= 1) {
      return false;
    }

    return true;
  }

  private _calculatePercentWidths(widths: ColumnWidth[], visibleColumns: Column[]): number {
    let percentWidths = 0;

    visibleColumns.forEach((column, index) => {
      if (widths[index] !== HIDDEN_COLUMNS_WIDTH) {
        percentWidths += this._getColumnPercentWidth(column);
      }
    });

    return percentWidths;
  }

  private _getAverageColumnsWidth(
    containerWidth: number,
    columns: Column[],
    columnsCanFit: boolean,
  ): number {
    let fixedColumnsWidth = 0;
    let columnsWithoutFixedWidthCount = 0;

    columns.forEach((column) => {
      if (!this.isColumnHidden(column)) {
        const { width } = column;
        if (isDefined(width) && !isNaN(parseFloat(String(width)))) {
          fixedColumnsWidth += isPercentWidth(width) ? this._calculatePercentWidth({
            visibleIndex: column.visibleIndex,
            columnsCount: columns.length,
            columnsCanFit,
            bestFitWidth: column.bestFitWidth,
            columnWidth: width,
            containerWidth,
          }) : parseFloat(String(width));
        } else {
          columnsWithoutFixedWidthCount += 1;
        }
      }
    });
    return (containerWidth - fixedColumnsWidth) / columnsWithoutFixedWidthCount;
  }

  private _calculateColumnWidth(
    column: Column,
    containerWidth: number,
    contentColumns: Column[],
    columnsCanFit: boolean,
  ): number | undefined {
    const columnId = this._columnsController.getColumnId(column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');

    if (widthOption && widthOption !== 'auto') {
      if (isPercentWidth(widthOption)) {
        return this._calculatePercentWidth({
          visibleIndex: column.visibleIndex,
          columnsCount: contentColumns.length,
          columnsCanFit,
          bestFitWidth,
          columnWidth: widthOption,
          containerWidth,
        });
      }

      return parseFloat(String(widthOption));
    }

    const columnAutoWidth = this.option('columnAutoWidth');

    return columnAutoWidth || !!column.command
      ? bestFitWidth
      : this._getAverageColumnsWidth(containerWidth, contentColumns, columnsCanFit);
  }

  private _calculatePercentWidth(options: PercentWidthOptions): number {
    // @ts-expect-error visibleIndex can be absent; the comparison then returns false
    const columnFitted = (options.visibleIndex < options.columnsCount - 1) && options.columnsCanFit;
    const partialWidth = (options.containerWidth * parseFloat(options.columnWidth)) / 100;
    const resultWidth = options.columnsCanFit
      && options.bestFitWidth !== undefined
      && (partialWidth < options.bestFitWidth)
      ? options.bestFitWidth
      : partialWidth;

    return columnFitted
      ? (options.containerWidth * parseFloat(options.columnWidth)) / 100
      : resultWidth;
  }

  private _getNotTruncatedColumnWidth(
    column: Column,
    containerWidth: number,
    contentColumns: Column[],
    columnsCanFit: boolean,
  ): number | null | undefined {
    const columnId = this._columnsController.getColumnId(column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');

    if (widthOption && widthOption !== 'auto' && !isPercentWidth(widthOption)) {
      return parseFloat(String(widthOption));
    }

    const colWidth = this._calculateColumnWidth(
      column,
      containerWidth,
      contentColumns,
      columnsCanFit,
    );

    // @ts-expect-error bestFitWidth can be absent; the comparison then returns false
    return colWidth < bestFitWidth ? null : colWidth;
  }

  private _getColumnPercentWidth(column: Column): number {
    let result = 0;

    if (column.width && isPercentWidth(column.width)) {
      result = parseFloat(column.width);
    }

    return result;
  }

  private _getCommandColumnsWidth(): number {
    const columns = this._columnsController.getVisibleColumns();
    let colWidth = 0;

    each(columns, (index, column) => {
      if ((isDefined(column.index) && column.index < 0) || column.command) {
        colWidth += this._columnsController.columnOption(
          this._columnsController.getColumnId(column),
          'bestFitWidth',
        ) || 0;
      }
    });

    return colWidth;
  }

  private _isItemEdited(item: AdaptiveFormItem): boolean | undefined {
    if (this.isFormOrPopupEditMode()) {
      return false;
    }

    if (this._isRowEditMode()) {
      const editRowKey = this.option('editing.editRowKey');
      if (equalByValue(editRowKey, this._dataController.getAdaptiveExpandedKey())) {
        return true;
      }
    } else {
      const rowIndex = this._dataController.getRowIndexByKey(
        this._dataController.getAdaptiveExpandedKey(),
      ) + 1;
      const columnIndex = this._columnsController.getVisibleIndex(item.column.index);

      return this._editingController.isEditCell(rowIndex, columnIndex);
    }

    return undefined;
  }

  private _getFormItemsByHiddenColumns(hiddenColumns: Column[]): AdaptiveFormItem[] {
    const items: AdaptiveFormItem[] = [];
    each(hiddenColumns, (_, column) => {
      items.push({
        column,
        name: column.name,
        dataField: column.dataField,
        visibleIndex: column.visibleIndex,
      });
    });

    return items;
  }

  private _getAdaptiveColumnVisibleIndex(visibleColumns: Column[]): number | undefined {
    for (let i = 0; i < visibleColumns.length; i += 1) {
      const column = visibleColumns[i];
      if (column.command === ADAPTIVE_COLUMN_NAME) {
        return i;
      }
    }

    return undefined;
  }

  private _hideAdaptiveColumn(resultWidths: ColumnWidth[], visibleColumns: Column[]): void {
    const visibleIndex = this._getAdaptiveColumnVisibleIndex(visibleColumns);
    if (isDefined(visibleIndex)) {
      resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
      this._hideVisibleColumn({ isCommandColumn: true, visibleIndex });
    }
  }

  /**
   * @extended: keyboard_navigation
   */
  protected _showHiddenCellsInView({ $cells, isCommandColumn }: HiddenCellsInViewOptions): void {
    let cssClassNameToRemove = this.addWidgetPrefix(CLASSES.hiddenColumn);
    if (isCommandColumn) {
      cssClassNameToRemove = CLASSES.commandAdaptiveHidden;
      $cells.attr({
        tabIndex: 0,
        'aria-hidden': null,
      }).removeClass(cssClassNameToRemove);
    } else {
      $cells.removeClass(cssClassNameToRemove);
    }
  }

  public _showHiddenColumns(): void {
    for (const columnViewName of COLUMN_VIEWS) {
      const view = this.getView(columnViewName);
      if (view && view.isVisible() && view.element()) {
        const viewName = view.name;
        // @ts-expect-error the view is rendered here
        const $hiddenCommandCells = view.element().find(`.${CLASSES.commandAdaptiveHidden}`);
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCommandCells,
          isCommandColumn: true,
        });
        // @ts-expect-error the view is rendered here
        const $hiddenCells = view.element().find(`.${this.addWidgetPrefix(CLASSES.hiddenColumn)}`);
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCells,
        });
      }
    }
  }

  public _toggleGroupAdaptiveRowVisibility(isBestFit: boolean): void {
    const hasHiddenColumns = this.hasHiddenColumns() || this.getHidingColumnsQueue().length > 0;

    if (!hasHiddenColumns) {
      return;
    }

    const rowsView = this.getView(ROWS_VIEW);
    const items = this._dataController.items();

    if (!items || items.length === 0) {
      return;
    }

    items.forEach((item, index) => {
      if (item.rowType === ADAPTIVE_ROW_TYPE) {
        const $row = $(rowsView.getRowElement(index));
        $row.css('display', isBestFit ? 'none' : '');
      }
    });
  }

  private _isCellValid($cell: dxElementWrapper | undefined): boolean | number | undefined {
    return $cell?.length
      && !$cell.hasClass(MASTER_DETAIL_CLASSES.detailCell)
      && !$cell.hasClass(VIEW_CLASSES.groupCell);
  }

  private _hideVisibleColumn({ isCommandColumn, visibleIndex }: HideVisibleColumnOptions): void {
    COLUMN_VIEWS.forEach((viewName) => {
      const view = this.getView(viewName);
      if (view) {
        this._hideVisibleColumnInView({ view, isCommandColumn, visibleIndex });
      }
    });
  }

  protected _hideVisibleColumnInView({
    view, isCommandColumn, visibleIndex,
  }: HideVisibleColumnInViewOptions): void {
    const viewName = view.name;
    const column = this._columnsController.getVisibleColumns()[visibleIndex];
    const editFormRowIndex = this._editingController
      && this._editingController.getEditFormRowIndex();

    if (!(view && view.isVisible() && column)) {
      return;
    }

    const rowsCount: number = view.getRowsCount();
    const $rowElements = view._getRowElements();
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
      const cancelClassAdding = rowIndex === editFormRowIndex
        && viewName === ROWS_VIEW
        && this.option('editing.mode') !== 'popup';
      const currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW && !cancelClassAdding
        ? this._columnsController.getVisibleIndex(column.index, rowIndex)
        : visibleIndex;
      const $cellElement = !cancelClassAdding && currentVisibleIndex >= 0
        ? this._findCellElementInRow($rowElements.eq(rowIndex), currentVisibleIndex)
        : undefined;

      if ($cellElement && this._isCellValid($cellElement)) {
        this._hideVisibleCellInView({
          viewName,
          isCommandColumn,
          $cell: $cellElement,
        });
      }
    }
  }

  private _findCellElementInRow(
    $rowElement: dxElementWrapper,
    visibleColumnIndex: number,
  ): dxElementWrapper | undefined {
    const $rowCells = $rowElement.children();
    let visibleIndex = visibleColumnIndex;
    let cellIsInsideGroup = false;
    if ($rowElement.hasClass(VIEW_CLASSES.groupRow)) {
      const $groupCell = $rowElement.find(`.${VIEW_CLASSES.groupCell}`);
      const colSpan = $groupCell.attr('colspan');
      if ($groupCell.length && isDefined(colSpan)) {
        const groupCellLength = parseInt(colSpan, 10);
        const endGroupIndex = $groupCell.index() + groupCellLength - 1;
        if (visibleColumnIndex > endGroupIndex) {
          visibleIndex = visibleColumnIndex - groupCellLength + 1;
        } else {
          cellIsInsideGroup = true;
        }
      }
    }
    const $cellElement = !cellIsInsideGroup ? $rowCells.eq(visibleIndex) : undefined;
    return $cellElement;
  }

  /**
   * @extended: keyboard_navigation
   */
  protected _hideVisibleCellInView({ $cell, isCommandColumn }: HiddenCellInViewOptions): void {
    const cssClassNameToAdd = isCommandColumn
      ? CLASSES.commandAdaptiveHidden
      : this.addWidgetPrefix(CLASSES.hiddenColumn);
    $cell.attr({
      tabIndex: -1,
      'aria-hidden': true,
    }).addClass(cssClassNameToAdd);
  }

  private _getEditMode(): GridsEditMode {
    return this._editingController.getEditMode();
  }

  public isFormOrPopupEditMode(): boolean {
    const editMode = this._getEditMode();

    return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP;
  }

  public hideRedundantColumns(
    resultWidths: (number | string | undefined)[],
    visibleColumns: Column[],
    hiddenQueue: Column[],
  ): void {
    this._hiddenColumns = [];

    if (!(this._isVisibleColumnsValid(visibleColumns) && hiddenQueue.length)) {
      this._hideAdaptiveColumn(resultWidths, visibleColumns);
      return;
    }

    let totalWidth = 0;
    const $rootElement = this.component.$element();
    const availableWidth = getWidth($rootElement) - this._rowsView.getScrollbarWidth();
    let rootElementWidth = availableWidth - this._getCommandColumnsWidth();
    const getVisibleContentColumns = (): Column[] => visibleColumns.filter(
      (item) => !item.command
        && this._hiddenColumns.filter((i) => i.index === item.index).length === 0,
    );
    let visibleContentColumns = getVisibleContentColumns();
    const contentColumnsCount = visibleContentColumns.length;
    let hasHiddenColumns = false;
    let needHideColumn = false;

    do {
      needHideColumn = false;
      totalWidth = 0;

      const percentWidths = this._calculatePercentWidths(resultWidths, visibleColumns);

      const columnsCanFit = percentWidths < 100 && percentWidths !== 0;
      for (let i = 0; i < visibleColumns.length; i += 1) {
        const visibleColumn = visibleColumns[i];

        let columnWidth = this._getNotTruncatedColumnWidth(
          visibleColumn,
          rootElementWidth,
          visibleContentColumns,
          columnsCanFit,
        );
        const columnId = this._columnsController.getColumnId(visibleColumn);
        const widthOption = this._columnsController.columnOption(columnId, 'width');
        const minWidth = this._columnsController.columnOption(columnId, 'minWidth');
        const columnBestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');

        if (resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
          hasHiddenColumns = true;
          // eslint-disable-next-line no-continue -- removing it needs a loop rewrite
          continue;
        }
        if (!columnWidth && !visibleColumn.command && !visibleColumn.fixed) {
          needHideColumn = true;
          break;
        }

        if (!widthOption || widthOption === 'auto') {
          columnWidth = Math.max(columnBestFitWidth || 0, minWidth || 0);
        }

        if (visibleColumn.command !== ADAPTIVE_COLUMN_NAME || hasHiddenColumns) {
          // @ts-expect-error columnWidth can be empty for a command or fixed column
          totalWidth += columnWidth;
        }
      }

      needHideColumn = needHideColumn || totalWidth > availableWidth;

      if (needHideColumn) {
        const column = hiddenQueue.pop() as Column;
        const visibleIndex = this._columnsController.getVisibleIndex(column.index);

        // @ts-expect-error _calculateColumnWidth returns undefined when bestFitWidth is absent
        rootElementWidth += this._calculateColumnWidth(
          column,
          rootElementWidth,
          visibleContentColumns,
          columnsCanFit,
        );

        this._hideVisibleColumn({ visibleIndex });
        resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
        this._hiddenColumns.push(column);
        visibleContentColumns = getVisibleContentColumns();
      }
    }
    while (needHideColumn && visibleContentColumns.length > 1 && hiddenQueue.length);

    if (contentColumnsCount === visibleContentColumns.length) {
      this._hideAdaptiveColumn(resultWidths, visibleColumns);
    }
  }

  public getAdaptiveDetailItems(): dxElementWrapper | undefined {
    return this._$itemContents ?? undefined;
  }

  public getItemContentByColumnIndex(visibleColumnIndex: number): dxElementWrapper | undefined {
    // @ts-expect-error the adaptive detail form is rendered here
    const $itemContents: dxElementWrapper = this._$itemContents;

    for (let i = 0; i < $itemContents.length; i += 1) {
      const $itemContent = $itemContents.eq(i);
      // @ts-expect-error data(key) is typed as returning the wrapper
      const item: AdaptiveFormItem | undefined = $itemContent.data('dx-form-item');
      if (
        item?.column
        && this._columnsController.getVisibleIndex(item.column.index) === visibleColumnIndex
      ) {
        return $itemContent;
      }
    }

    return undefined;
  }

  public toggleExpandAdaptiveDetailRow(key?: RowKey, alwaysExpanded = false): void {
    if (!(this.isFormOrPopupEditMode() && this._editingController.isEditing())) {
      this._dataController.toggleExpandAdaptiveDetailRow(key, alwaysExpanded);
    }
  }

  public createFormByHiddenColumns(
    container: dxElementWrapper,
    options: AdaptiveDetailCellOptions,
  ): void {
    const $container = $(container);
    const userFormOptions: FormProperties & { formID: string } = {
      items: this._getFormItemsByHiddenColumns(this._hiddenColumns),
      formID: `dx-${new Guid()}`,
    };
    // @ts-expect-error isMaterial() without a theme checks the current one
    const defaultFormOptions = isMaterial() ? { colCount: 2 } : {};

    this.executeAction('onAdaptiveDetailRowPreparing', { formOptions: userFormOptions });

    this._$itemContents = null;

    // eslint-disable-next-line @typescript-eslint/no-this-alias -- Form callbacks use their this
    const that = this;
    this._form = this._createComponent(
      $('<div>').appendTo($container),
      Form,
      extend(defaultFormOptions, userFormOptions, {
        customizeItem(item) {
          const column = item.column
            || that._columnsController.columnOption(item.name || item.dataField);
          if (column) {
            item.label = item.label || {};
            item.label.text = item.label.text || column.caption;
            item.column = column;
            item.template = that._getTemplate(item, options);
          }
          if (userFormOptions.customizeItem) {
            userFormOptions.customizeItem.call(this, item);
          }
        },
        onContentReady(e) {
          if (userFormOptions.onContentReady) {
            userFormOptions.onContentReady.call(this, e);
          }
          that._$itemContents = $container.find(`.${FIELD_ITEM_CONTENT_CLASS}`);
        },
      }),
    );
  }

  public hasAdaptiveDetailRowExpanded(): boolean {
    return isDefined(this._dataController.getAdaptiveExpandedKey());
  }

  public updateForm(hiddenColumns?: Column[]): void {
    if (this.hasAdaptiveDetailRowExpanded()) {
      // @ts-expect-error _contentReadyAction isn't in the public Form type
      if (this._form && isDefined(this._form._contentReadyAction)) {
        if (hiddenColumns?.length) {
          this._form.option('items', this._getFormItemsByHiddenColumns(hiddenColumns));
        } else {
          this._form.repaint();
        }
      }
    }
  }

  public updateHidingQueue(columns: Column[]): Column[] {
    const hideableColumns = getHideableColumns(columns);
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned conditionally below
    let columnsHasHidingPriority: boolean | undefined;

    this._hidingColumnsQueue = [];

    if (this.option('allowColumnResizing') && this.option('columnResizingMode') === 'widget') {
      return this._hidingColumnsQueue;
    }

    for (const column of hideableColumns) {
      if (isDefined(column.hidingPriority) && column.hidingPriority >= 0) {
        columnsHasHidingPriority = true;
        this._hidingColumnsQueue[column.hidingPriority] = column;
      }
    }

    if (columnsHasHidingPriority) {
      this._hidingColumnsQueue.reverse();
    } else if (this.option('columnHidingEnabled')) {
      for (const column of hideableColumns) {
        const visibleIndex = this._columnsController.getVisibleIndex(column.index);
        this._hidingColumnsQueue[visibleIndex] = column;
      }
    }

    this._hidingColumnsQueue = this._hidingColumnsQueue.filter(Object);
    return this._hidingColumnsQueue;
  }

  public getHiddenColumns(): Column[] {
    return this._hiddenColumns;
  }

  public hasHiddenColumns(): boolean {
    return this._hiddenColumns.length > 0;
  }

  public getHidingColumnsQueue(): Column[] {
    return this._hidingColumnsQueue;
  }

  public isAdaptiveDetailRowExpanded(key: RowKey): unknown {
    const dataController = this._dataController;
    const adaptiveExpandedKey = dataController.getAdaptiveExpandedKey();

    return adaptiveExpandedKey && equalByValue(adaptiveExpandedKey, key);
  }

  private expandAdaptiveDetailRow(key: RowKey): void {
    if (!this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow(key);
    }
  }

  public collapseAdaptiveDetailRow(): void {
    if (this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow();
    }
  }

  public updateCommandAdaptiveAriaLabel(key: RowKey, label: string): void {
    const rowIndex = this._dataController.getRowIndexByKey(key);

    if (rowIndex === -1) {
      return;
    }

    const $row = $(this.component.getRowElement(rowIndex));

    this.setCommandAdaptiveAriaLabel($row, label);
  }

  public setCommandAdaptiveAriaLabel($row: dxElementWrapper, labelName: string): void {
    const $adaptiveCommand = $row.find('.dx-command-adaptive');

    if ($adaptiveCommand.length) {
      this.setAria('label', messageLocalization.format(labelName), $adaptiveCommand);
    }
  }

  public isColumnHidden(column: Column): boolean {
    return this._hiddenColumns
      .filter((hiddenColumn) => hiddenColumn.index === column.index).length > 0;
  }
}
