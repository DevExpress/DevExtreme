import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import { addNamespace } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { isElementInDom } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import { isDefined, isString } from '@js/core/utils/type';
import Form from '@js/ui/form';
import { isMaterial } from '@js/ui/themes';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { AI_COLUMN_NAME } from '../ai_column/const';
import type { ColumnsController } from '../columns_controller/m_columns_controller';
import type { DataController } from '../data_controller/data_controller';
import type { EditingController } from '../editing/m_editing';
import type { KeyboardNavigationController } from '../keyboard_navigation/m_keyboard_navigation';
import modules from '../m_modules';
import type { RowKey } from '../m_types';
import gridCoreUtils from '../m_utils';
import type { RowsView } from '../views/m_rows_view';
import {
  ADAPTIVE_COLUMN_BUTTON_CLASS,
  ADAPTIVE_COLUMN_NAME,
  ADAPTIVE_COLUMN_NAME_CLASS,
  ADAPTIVE_ITEM_TEXT_CLASS,
  ADAPTIVE_NAMESPACE,
  ADAPTIVE_ROW_TYPE,
  COLUMN_HEADERS_VIEW,
  COLUMN_VIEWS,
  COMMAND_ADAPTIVE_HIDDEN_CLASS,
  EDIT_MODE_FORM,
  EDIT_MODE_POPUP,
  EDIT_MODE_ROW,
  FORM_ITEM_CONTENT_CLASS,
  FORM_ITEM_MODIFIED,
  GROUP_CELL_CLASS,
  GROUP_ROW_CLASS,
  HIDDEN_COLUMN_CLASS,
  HIDDEN_COLUMNS_WIDTH,
  MASTER_DETAIL_CELL_CLASS,
  ROWS_VIEW,
} from './const';
import { getHideableColumns } from './utils';

function getColumnId(that, column) {
  return that._columnsController.getColumnId(column);
}

function adaptiveCellTemplate(container, options) {
  let $adaptiveColumnButton;
  const $container = $(container);
  // TODO getController
  const adaptiveColumnsController = options.component.getController('adaptiveColumns');

  if (options.rowType === 'data') {
    $adaptiveColumnButton = $('<span>').addClass(adaptiveColumnsController.addWidgetPrefix(ADAPTIVE_COLUMN_BUTTON_CLASS));
    eventsEngine.on($adaptiveColumnButton, addNamespace(clickEventName, ADAPTIVE_NAMESPACE), adaptiveColumnsController.createAction(() => {
      adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
    }));
    $adaptiveColumnButton.appendTo($container);
  } else {
    gridCoreUtils.setEmptyText($container);
  }
}

export class AdaptiveColumnsController extends modules.ViewController {
  private _columnsController!: ColumnsController;

  private _dataController!: DataController;

  private _editingController!: EditingController;

  protected _rowsView!: RowsView;

  private _hiddenColumns: any;

  private _$itemContents: any;

  private _form?: Form;

  private _hidingColumnsQueue?: Column[];

  protected _keyboardNavigationController!: KeyboardNavigationController;

  public init() {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._editingController = this.getController('editing');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._rowsView = this.getView('rowsView');

    this._columnsController.addCommandColumn({
      type: ADAPTIVE_COLUMN_NAME,
      command: ADAPTIVE_COLUMN_NAME,
      visible: true,
      adaptiveHidden: true,
      cssClass: ADAPTIVE_COLUMN_NAME_CLASS,
      alignment: 'center',
      width: 'auto',
      cellTemplate: adaptiveCellTemplate,
      fixedPosition: 'right',
    });

    this._columnsController.columnsChanged.add(() => {
      const isAdaptiveVisible = !!this.updateHidingQueue(this._columnsController.getColumns()).length;
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !isAdaptiveVisible, true);
    });
    this._hidingColumnsQueue = [];
    this._hiddenColumns = [];
    this.createAction('onAdaptiveDetailRowPreparing');

    super.init();
  }

  public optionChanged(args) {
    if (args.name === 'columnHidingEnabled') {
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !args.value);
    }

    super.optionChanged(args);
  }

  public publicMethods() {
    return ['isAdaptiveDetailRowExpanded', 'expandAdaptiveDetailRow', 'collapseAdaptiveDetailRow'];
  }

  private _getValueFromCellOptions(columnIndex: number, cellOptions: any) {
    return cellOptions.row.values[columnIndex];
  }

  private _isRowEditMode() {
    const editMode = this._getEditMode();
    return editMode === EDIT_MODE_ROW;
  }

  private _isItemModified(item, cellOptions) {
    const columnIndex = this._columnsController.getVisibleIndex(item.column.index);
    const rowIndex = this._dataController.getRowIndexByKey(cellOptions.key);
    const row: any = this._dataController.items()[rowIndex + 1];

    return row && row.modifiedValues && isDefined(row.modifiedValues[columnIndex]);
  }

  private _renderFormViewTemplate(item, cellOptions, $container) {
    const that = this;
    const { column } = item;
    const focusAction = that.createAction(() => {
      if (that._editingController.isEditing()) {
        // @ts-expect-error
        eventsEngine.trigger($container, clickEventName);
      }
    });
    const rowData = cellOptions.row.data;
    const columnIndex = that._columnsController.getVisibleIndex(column.index);

    const value = column.type === AI_COLUMN_NAME
      ? this._getValueFromCellOptions(columnIndex, cellOptions)
      : column.calculateCellValue(rowData);

    const displayValue = gridCoreUtils.getDisplayValue(column, value, rowData, cellOptions.rowType);
    const text = gridCoreUtils.formatValue(displayValue, column);
    const isCellOrBatchEditMode = this._editingController.isCellOrBatchEditMode();
    const rowsView = that._rowsView;

    if (column.allowEditing && this._keyboardNavigationController.isKeyboardEnabled()) {
      $container.attr('tabIndex', that.option('tabIndex'));

      if (isCellOrBatchEditMode) {
        eventsEngine.off($container, 'focus', focusAction);
        eventsEngine.on($container, 'focus', focusAction);
      }
    }

    if (column.cellTemplate) {
      const templateOptions = extend({}, cellOptions, {
        value, displayValue, text, column,
      });

      rowsView.renderTemplate($container, column.cellTemplate, templateOptions, isElementInDom($container)).done(() => {
        rowsView._cellPrepared($container, cellOptions);
      });
    } else {
      const container = $container.get(0);
      if (column.encodeHtml) {
        container.textContent = text;
      } else {
        container.innerHTML = text;
      }

      $container.addClass(ADAPTIVE_ITEM_TEXT_CLASS);
      if (!isDefined(text) || text === '') {
        $container.html('&nbsp;');
      }

      if (!that._isRowEditMode()) {
        if (that._isItemModified(item, cellOptions)) {
          $container.addClass(FORM_ITEM_MODIFIED);
        }
      }

      rowsView._cellPrepared($container, cellOptions);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _getTemplate(item, cellOptions, updateForm?) {
    const that = this;
    const { column } = item;
    const editingController = this._editingController;

    return function (options, container) {
      const $container = $(container);
      const columnIndex = that._columnsController.getVisibleIndex(column.index);
      const templateOptions = extend({}, cellOptions);

      const renderFormTemplate = function () {
        const isItemEdited = that._isItemEdited(item);
        templateOptions.value = that._getValueFromCellOptions(columnIndex, cellOptions);
        if (isItemEdited || column.showEditorAlways) {
          editingController.renderFormEditorTemplate(templateOptions, item, options, $container, !isItemEdited);
        } else {
          templateOptions.column = column;
          templateOptions.columnIndex = columnIndex;
          that._renderFormViewTemplate(item, templateOptions, $container);
        }
      };

      renderFormTemplate();

      if (templateOptions.watch) {
        const dispose = templateOptions.watch(() => ({
          isItemEdited: that._isItemEdited(item),
          value: that._getValueFromCellOptions(columnIndex, cellOptions),
        }), () => {
          $container.contents().remove();
          $container.removeClass(ADAPTIVE_ITEM_TEXT_CLASS);
          renderFormTemplate();
        });

        eventsEngine.on($container, removeEvent, dispose);
      }
    };
  }

  private _isVisibleColumnsValid(visibleColumns) {
    const getCommandColumnsCount = function () {
      let result = 0;

      for (let j = 0; j < visibleColumns.length; j++) {
        const visibleColumn = visibleColumns[j];
        if (visibleColumn.command) {
          result++;
        }
      }
      return result;
    };

    if (visibleColumns < 2) {
      return false;
    }

    if (visibleColumns.length - getCommandColumnsCount() <= 1) {
      return false;
    }

    return true;
  }

  private _calculatePercentWidths(widths, visibleColumns) {
    const that = this;
    let percentWidths = 0;

    visibleColumns.forEach((item, index) => {
      if (widths[index] !== HIDDEN_COLUMNS_WIDTH) {
        percentWidths += that._getItemPercentWidth(item);
      }
    });

    return percentWidths;
  }

  private _isPercentWidth(width) {
    return isString(width) && width.endsWith('%');
  }

  private _getAverageColumnsWidth(containerWidth, columns, columnsCanFit) {
    const that = this;
    let fixedColumnsWidth = 0;
    let columnsWithoutFixedWidthCount = 0;

    columns.forEach((column) => {
      if (!that.isColumnHidden(column)) {
        const { width } = column;
        if (isDefined(width) && !isNaN(parseFloat(width))) {
          fixedColumnsWidth += that._isPercentWidth(width) ? that._calculatePercentWidth({
            visibleIndex: column.visibleIndex,
            columnsCount: columns.length,
            columnsCanFit,
            bestFitWidth: column.bestFitWidth,
            columnWidth: width,
            containerWidth,
          }) : parseFloat(width);
        } else {
          columnsWithoutFixedWidthCount++;
        }
      }
    });
    return (containerWidth - fixedColumnsWidth) / columnsWithoutFixedWidthCount;
  }

  private _calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    const columnId = getColumnId(this, column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');
    const columnsCount = contentColumns.length;
    let colWidth;

    if (widthOption && widthOption !== 'auto') {
      if (this._isPercentWidth(widthOption)) {
        colWidth = this._calculatePercentWidth({
          visibleIndex: column.visibleIndex,
          columnsCount,
          columnsCanFit,
          bestFitWidth,
          columnWidth: widthOption,
          containerWidth,
        });
      } else {
        return parseFloat(widthOption);
      }
    } else {
      const columnAutoWidth = this.option('columnAutoWidth');
      colWidth = columnAutoWidth || !!column.command ? bestFitWidth : this._getAverageColumnsWidth(containerWidth, contentColumns, columnsCanFit);
    }

    return colWidth;
  }

  private _calculatePercentWidth(options) {
    const columnFitted = (options.visibleIndex < options.columnsCount - 1) && options.columnsCanFit;
    const partialWidth = options.containerWidth * parseFloat(options.columnWidth) / 100;
    const resultWidth = options.columnsCanFit && (partialWidth < options.bestFitWidth) ? options.bestFitWidth : partialWidth;

    return columnFitted ? options.containerWidth * parseFloat(options.columnWidth) / 100 : resultWidth;
  }

  private _getNotTruncatedColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    const columnId = getColumnId(this, column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');

    if (widthOption && widthOption !== 'auto' && !this._isPercentWidth(widthOption)) {
      return parseFloat(widthOption);
    }

    const colWidth = this._calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit);

    return colWidth < bestFitWidth ? null : colWidth;
  }

  private _getItemPercentWidth(item) {
    let result = 0;

    if (item.width && this._isPercentWidth(item.width)) {
      result = parseFloat(item.width);
    }

    return result;
  }

  private _getCommandColumnsWidth() {
    const that = this;
    const columns = that._columnsController.getVisibleColumns();
    let colWidth = 0;

    each(columns, (index, column) => {
      if (column.index < 0 || column.command) {
        colWidth += that._columnsController.columnOption(getColumnId(that, column), 'bestFitWidth') || 0;
      }
    });

    return colWidth;
  }

  private _isItemEdited(item) {
    if (this.isFormOrPopupEditMode()) {
      return false;
    }

    if (this._isRowEditMode()) {
      const editRowKey = this.option('editing.editRowKey');
      if (equalByValue(editRowKey, this._dataController.getAdaptiveExpandedKey())) {
        return true;
      }
    } else {
      const rowIndex = this._dataController.getRowIndexByKey(this._dataController.getAdaptiveExpandedKey()) + 1;
      const columnIndex = this._columnsController.getVisibleIndex(item.column.index);

      return this._editingController.isEditCell(rowIndex, columnIndex);
    }

    return undefined;
  }

  private _getFormItemsByHiddenColumns(hiddenColumns) {
    const items: any[] = [];
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

  private _getAdaptiveColumnVisibleIndex(visibleColumns) {
    for (let i = 0; i < visibleColumns.length; i++) {
      const column = visibleColumns[i];
      if (column.command === ADAPTIVE_COLUMN_NAME) {
        return i;
      }
    }

    return undefined;
  }

  private _hideAdaptiveColumn(resultWidths, visibleColumns) {
    const visibleIndex = this._getAdaptiveColumnVisibleIndex(visibleColumns);
    if (isDefined(visibleIndex)) {
      resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
      this._hideVisibleColumn({ isCommandColumn: true, visibleIndex });
    }
  }

  /**
   * @extended: keyboard_navigation
   */
  protected _showHiddenCellsInView({ $cells, isCommandColumn }: any) {
    let cssClassNameToRemove = this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    if (isCommandColumn) {
      cssClassNameToRemove = COMMAND_ADAPTIVE_HIDDEN_CLASS;
      $cells.attr({
        tabIndex: 0,
        'aria-hidden': null,
      }).removeClass(cssClassNameToRemove);
    } else {
      $cells.removeClass(cssClassNameToRemove);
    }
  }

  public _showHiddenColumns() {
    for (let i = 0; i < COLUMN_VIEWS.length; i++) {
      const view = this.getView(COLUMN_VIEWS[i]);
      if (view && view.isVisible() && view.element()) {
        const viewName = view.name;
        const $hiddenCommandCells = view.element().find(`.${COMMAND_ADAPTIVE_HIDDEN_CLASS}`);
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCommandCells,
          isCommandColumn: true,
        });
        const $hiddenCells = view.element().find(`.${this.addWidgetPrefix(HIDDEN_COLUMN_CLASS)}`);
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCells,
        });
      }
    }
  }

  public _toggleGroupAdaptiveRowVisibility(isBestFit: boolean) {
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

  private _isCellValid($cell) {
    return $cell && $cell.length && !$cell.hasClass(MASTER_DETAIL_CELL_CLASS) && !$cell.hasClass(GROUP_CELL_CLASS);
  }

  private _hideVisibleColumn({ isCommandColumn, visibleIndex }: any) {
    const that = this;
    COLUMN_VIEWS.forEach((viewName) => {
      const view = that.getView(viewName);
      view && that._hideVisibleColumnInView({ view, isCommandColumn, visibleIndex });
    });
  }

  protected _hideVisibleColumnInView({ view, isCommandColumn, visibleIndex }) {
    const viewName = view.name;
    let $cellElement;
    const column = this._columnsController.getVisibleColumns()[visibleIndex];
    const editFormRowIndex = this._editingController && this._editingController.getEditFormRowIndex();

    if (view && view.isVisible() && column) {
      const rowsCount = view.getRowsCount();
      const $rowElements = view._getRowElements();
      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const cancelClassAdding = rowIndex === editFormRowIndex && viewName === ROWS_VIEW && this.option('editing.mode') !== 'popup';

        if (!cancelClassAdding) {
          const currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW ? this._columnsController.getVisibleIndex(column.index, rowIndex) : visibleIndex;
          if (currentVisibleIndex >= 0) {
            const $rowElement = $rowElements.eq(rowIndex);
            $cellElement = this._findCellElementInRow($rowElement, currentVisibleIndex);
            this._isCellValid($cellElement) && this._hideVisibleCellInView({
              viewName,
              isCommandColumn,
              $cell: $cellElement,
            });
          }
        }
      }
    }
  }

  private _findCellElementInRow($rowElement, visibleColumnIndex) {
    const $rowCells = $rowElement.children();
    let visibleIndex = visibleColumnIndex;
    let cellIsInsideGroup = false;
    if ($rowElement.hasClass(GROUP_ROW_CLASS)) {
      const $groupCell = $rowElement.find(`.${GROUP_CELL_CLASS}`);
      const colSpan = $groupCell.attr('colspan');
      if ($groupCell.length && isDefined(colSpan)) {
        // eslint-disable-next-line radix
        const groupCellLength = parseInt(colSpan);
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
  protected _hideVisibleCellInView({ $cell, isCommandColumn }: any) {
    const cssClassNameToAdd = isCommandColumn ? COMMAND_ADAPTIVE_HIDDEN_CLASS : this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    $cell.attr({
      tabIndex: -1,
      'aria-hidden': true,
    }).addClass(cssClassNameToAdd);
  }

  private _getEditMode() {
    return this._editingController.getEditMode();
  }

  public isFormOrPopupEditMode() {
    const editMode = this._getEditMode();

    return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP;
  }

  public hideRedundantColumns(
    resultWidths: (number | string | undefined)[],
    visibleColumns: Column[],
    hiddenQueue: Column[],
  ): void {
    this._hiddenColumns = [];

    if (this._isVisibleColumnsValid(visibleColumns) && hiddenQueue.length) {
      let totalWidth = 0;
      const $rootElement = this.component.$element();
      const availableWidth = getWidth($rootElement) - this._rowsView.getScrollbarWidth();
      let rootElementWidth = availableWidth - this._getCommandColumnsWidth();
      const getVisibleContentColumns = function () {
        return visibleColumns.filter((item) => !item.command && this._hiddenColumns.filter((i) => i.index === item.index).length === 0);
      }.bind(this);
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

          let columnWidth = this._getNotTruncatedColumnWidth(visibleColumn, rootElementWidth, visibleContentColumns, columnsCanFit);
          const columnId = getColumnId(this, visibleColumn);
          const widthOption = this._columnsController.columnOption(columnId, 'width');
          const minWidth = this._columnsController.columnOption(columnId, 'minWidth');
          const columnBestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');

          if (resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
            hasHiddenColumns = true;
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
            totalWidth += columnWidth;
          }
        }

        needHideColumn = needHideColumn || totalWidth > availableWidth;

        if (needHideColumn) {
          const column = hiddenQueue.pop() as Column;
          const visibleIndex = this._columnsController.getVisibleIndex(column.index);

          rootElementWidth += this._calculateColumnWidth(column, rootElementWidth, visibleContentColumns, columnsCanFit);

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
    } else {
      this._hideAdaptiveColumn(resultWidths, visibleColumns);
    }
  }

  public getAdaptiveDetailItems() {
    return this._$itemContents;
  }

  public getItemContentByColumnIndex(visibleColumnIndex) {
    let $itemContent;

    for (let i = 0; i < this._$itemContents.length; i++) {
      $itemContent = this._$itemContents.eq(i);
      const item = $itemContent.data('dx-form-item');
      if (item && item.column && this._columnsController.getVisibleIndex(item.column.index) === visibleColumnIndex) {
        return $itemContent;
      }
    }
  }

  public toggleExpandAdaptiveDetailRow(key?: RowKey, alwaysExpanded = false): void {
    if (!(this.isFormOrPopupEditMode() && this._editingController.isEditing())) {
      this._dataController.toggleExpandAdaptiveDetailRow(key, alwaysExpanded);
    }
  }

  public createFormByHiddenColumns(container, options) {
    const that = this;
    const $container = $(container);
    const userFormOptions: any = {
      items: that._getFormItemsByHiddenColumns(that._hiddenColumns),
      formID: `dx-${new Guid()}`,
    };
    // @ts-expect-error
    const defaultFormOptions = isMaterial() ? { colCount: 2 } : {};

    this.executeAction('onAdaptiveDetailRowPreparing', { formOptions: userFormOptions });

    that._$itemContents = null;

    that._form = that._createComponent($('<div>').appendTo($container), Form, extend(defaultFormOptions, userFormOptions, {
      customizeItem(item) {
        const column = item.column || that._columnsController.columnOption(item.name || item.dataField);
        if (column) {
          item.label = item.label || {};
          item.label.text = item.label.text || column.caption;
          item.column = column;
          item.template = that._getTemplate(item, options, that.updateForm.bind(that));
        }
        userFormOptions.customizeItem && userFormOptions.customizeItem.call(this, item);
      },
      onContentReady(e) {
        userFormOptions.onContentReady && userFormOptions.onContentReady.call(this, e);
        that._$itemContents = $container.find(`.${FORM_ITEM_CONTENT_CLASS}`);
      },
    }));
  }

  public hasAdaptiveDetailRowExpanded() {
    return isDefined(this._dataController.getAdaptiveExpandedKey());
  }

  public updateForm(hiddenColumns) {
    if (this.hasAdaptiveDetailRowExpanded()) {
      if (this._form && isDefined((this._form as any)._contentReadyAction)) {
        if (hiddenColumns && hiddenColumns.length) {
          this._form.option('items', this._getFormItemsByHiddenColumns(hiddenColumns));
        } else {
          this._form.repaint();
        }
      }
    }
  }

  public updateHidingQueue(columns) {
    const that = this;
    const hideableColumns = getHideableColumns(columns);
    let columnsHasHidingPriority;
    let i;

    that._hidingColumnsQueue = [];

    if (that.option('allowColumnResizing') && that.option('columnResizingMode') === 'widget') {
      return that._hidingColumnsQueue;
    }

    for (i = 0; i < hideableColumns.length; i++) {
      const column = hideableColumns[i];

      if (isDefined(column.hidingPriority) && column.hidingPriority >= 0) {
        columnsHasHidingPriority = true;
        that._hidingColumnsQueue[column.hidingPriority] = column;
      }
    }

    if (columnsHasHidingPriority) {
      that._hidingColumnsQueue.reverse();
    } else if (that.option('columnHidingEnabled')) {
      for (i = 0; i < hideableColumns.length; i++) {
        const visibleIndex = that._columnsController.getVisibleIndex(hideableColumns[i].index);
        that._hidingColumnsQueue[visibleIndex] = hideableColumns[i];
      }
    }

    that._hidingColumnsQueue = that._hidingColumnsQueue.filter(Object);
    return that._hidingColumnsQueue;
  }

  public getHiddenColumns() {
    return this._hiddenColumns;
  }

  public hasHiddenColumns() {
    return this._hiddenColumns.length > 0;
  }

  public getHidingColumnsQueue(): Column[] {
    return this._hidingColumnsQueue ?? [];
  }

  public isAdaptiveDetailRowExpanded(key) {
    const dataController = this._dataController;
    const adaptiveExpandedKey = dataController.getAdaptiveExpandedKey();

    return adaptiveExpandedKey && equalByValue(adaptiveExpandedKey, key);
  }

  private expandAdaptiveDetailRow(key) {
    if (!this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow(key);
    }
  }

  public collapseAdaptiveDetailRow() {
    if (this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow();
    }
  }

  public updateCommandAdaptiveAriaLabel(key, label) {
    const rowIndex = this._dataController.getRowIndexByKey(key);

    if (rowIndex === -1) {
      return;
    }

    const $row = $(this.component.getRowElement(rowIndex));

    this.setCommandAdaptiveAriaLabel($row, label);
  }

  public setCommandAdaptiveAriaLabel($row, labelName) {
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
