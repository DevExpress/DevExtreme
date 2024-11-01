/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unused-vars */
import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { deferRender, deferUpdate } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect, getDefaultAlignment } from '@js/core/utils/position';
import { getHeight, getOuterHeight, getWidth } from '@js/core/utils/size';
import { isEmpty } from '@js/core/utils/string';
import { setHeight } from '@js/core/utils/style';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type {
  ColumnsResizerViewController,
} from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type { ErrorHandlingController } from '@ts/grids/grid_core/error_handling/m_error_handling';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { ValidatingController } from '@ts/grids/grid_core/validating/m_validating';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';

import { CLASSES as REORDERING_CLASSES } from '../columns_resizing_reordering/const';
import type { EditingController } from '../editing/m_editing';
import type { EditorFactory } from '../editor_factory/m_editor_factory';
import gridCoreUtils from '../m_utils';
import { CLASSES } from '../sticky_columns/const';
import { ColumnsView } from './m_columns_view';

const ROWS_VIEW_CLASS = 'rowsview';
const CONTENT_CLASS = 'content';
const NOWRAP_CLASS = 'nowrap';
const GROUP_ROW_CLASS = 'dx-group-row';
const GROUP_CELL_CLASS = 'dx-group-cell';
const DATA_ROW_CLASS = 'dx-data-row';
const FREE_SPACE_CLASS = 'dx-freespace-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const ROW_ALTERNATION_CLASS = 'dx-row-alt';
const LAST_ROW_BORDER = 'dx-last-row-border';
const EMPTY_CLASS = 'dx-empty';
const ROW_INSERTED_ANIMATION_CLASS = 'row-inserted-animation';
const CONTENT_FIXED_CLASS = 'content-fixed';
export const ROW_LINES_CLASS = 'dx-row-lines';

const LOADPANEL_HIDE_TIMEOUT = 200;

function getMaxHorizontalScrollOffset(scrollable) {
  return scrollable ? Math.round(scrollable.scrollWidth() - scrollable.clientWidth()) : 0;
}
export function isGroupRow({ rowType, column }) {
  return rowType === 'group'
    && isDefined(column.groupIndex)
    && !column.showWhenGrouped && !column.command;
}

function setWatcher({
  element, watch, getter, callBack,
}) {
  if (watch) {
    const dispose = watch(getter, callBack);

    eventsEngine.on(element, removeEvent, dispose);
  }
}

const defaultCellTemplate = function ($container, options) {
  const isDataTextEmpty = isEmpty(options.text) && options.rowType === 'data';
  const { text } = options;
  const container = $container.get(0);

  if (isDataTextEmpty) {
    gridCoreUtils.setEmptyText($container);
  } else if (options.column.encodeHtml) {
    container.textContent = text;
  } else {
    container.innerHTML = text;
  }
};

const getScrollableBottomPadding = function (that) {
  const scrollable = that.getScrollable();
  // @ts-expect-error
  return scrollable ? Math.ceil(parseFloat($(scrollable.content()).css('paddingBottom'))) : 0;
};

export class RowsView extends ColumnsView {
  private readonly _loadPanel: any;

  public _editingController!: EditingController;

  private _resizingController!: ResizingController;

  protected _columnsResizerController!: ColumnsResizerViewController;

  protected _focusController!: FocusController;

  protected _keyboardNavigationController!: KeyboardNavigationController;

  protected _validatingController!: ValidatingController;

  protected _errorHandlingController!: ErrorHandlingController;

  public _columnHeadersView!: ColumnHeadersView;

  public _hasHeight: boolean | undefined;

  public _scrollTop: any;

  private _scrollRight: any;

  public _scrollable: any;

  private _scrollableContainer: any;

  private _contentChanges: any;

  public _rowHeight: any;

  public resizeCompleted: any;

  private _lastColumnWidths: any;

  private _hideLoadingTimeoutID: any;

  public init(): void {
    super.init();

    this._editingController = this.getController('editing');
    this._resizingController = this.getController('resizing');
    this._columnsResizerController = this.getController('columnsResizer');
    this._focusController = this.getController('focus');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._validatingController = this.getController('validating');
    this._errorHandlingController = this.getController('errorHandling');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._rowHeight = 0;
    this._scrollTop = 0;
    this._scrollLeft = -1;
    this._scrollRight = 0;
    this._hasHeight = undefined;
    this._contentChanges = [];
    this._dataController.loadingChanged.add((isLoading, messageText) => {
      this.setLoading(isLoading, messageText);
    });

    this._dataController.dataSourceChanged.add(() => {
      if (this._scrollLeft >= 0 && !this._dataController.isLoading()) {
        this._handleScroll({
          component: this.getScrollable(),
          forceUpdateScrollPosition: true,
          scrollOffset: { top: this._scrollTop, left: this._scrollLeft },
        });
      }
    });
  }

  public _getDefaultTemplate(column) {
    switch (column.command) {
      case 'empty':
        return function (container) {
          container.html('&nbsp;');
        };
      default:
        return defaultCellTemplate;
    }
  }

  public renderFocusState(params) { }

  private _getDefaultGroupTemplate(column) {
    const that = this;
    const summaryTexts = that.option('summary.texts');

    return function ($container, options) {
      const { data } = options;
      let text = `${options.column.caption}: ${options.text}`;
      const container = $container.get(0);

      if (options.summaryItems && options.summaryItems.length) {
        text += ` ${gridCoreUtils.getGroupRowSummaryText(options.summaryItems, summaryTexts)}`;
      }

      if (data) {
        if (options.groupContinuedMessage && options.groupContinuesMessage) {
          text += ` (${options.groupContinuedMessage}. ${options.groupContinuesMessage})`;
        } else if (options.groupContinuesMessage) {
          text += ` (${options.groupContinuesMessage})`;
        } else if (options.groupContinuedMessage) {
          text += ` (${options.groupContinuedMessage})`;
        }
      }
      if (column.encodeHtml) {
        container.textContent = text;
      } else {
        container.innerHTML = text;
      }
    };
  }

  /**
   * @extended: editing_row_based, focus, selection
   */
  protected _update(change?) { }

  /**
   * @extended: editing_form_based, search
   */
  public _updateCell($cell, options) {
    if (isGroupRow(options)) {
      const isGroupContainer = $cell.is(`.${this.addWidgetPrefix(CLASSES.groupRowContainer)}`);
      const $groupCell = isGroupContainer
        ? $cell.parent()
        : $cell;

      $groupCell.addClass(GROUP_CELL_CLASS);
    }
    super._updateCell.apply(this, arguments as any);
  }

  /**
   * @extended: adaptivity, editing, master_detail
   */
  protected _getCellTemplate(options) {
    const that = this;
    const { column } = options;
    let template;

    if (isGroupRow(options)) {
      template = column.groupCellTemplate || { allowRenderToDetachedContainer: true, render: that._getDefaultGroupTemplate(column) };
    } else if ((options.rowType === 'data' || column.command) && column.cellTemplate) {
      template = column.cellTemplate;
    } else {
      template = { allowRenderToDetachedContainer: true, render: that._getDefaultTemplate(column) };
    }

    return template;
  }

  /**
   * @extended: adaptivity, editing, editing_row_based, focus, master_detail
   */
  protected _createRow(row?, tag?) {
    const $row = super._createRow.apply(this, arguments as any);

    if (row) {
      const isGroup = row.rowType === 'group';
      const isDataRow = row.rowType === 'data';

      isDataRow && $row.addClass(DATA_ROW_CLASS);
      isDataRow && this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);

      this.option('showColumnLines') && $row.addClass(COLUMN_LINES_CLASS);

      if (row.visible === false) {
        $row.hide();
      }

      if (isGroup) {
        $row.addClass(GROUP_ROW_CLASS);
        this.setAriaExpandedAttribute($row, row);
      }
    }

    return $row;
  }

  protected _rowPrepared($row, rowOptions, row) {
    if (rowOptions.rowType === 'data') {
      if (this.option('rowAlternationEnabled')) {
        this._isAltRow(row) && $row.addClass(ROW_ALTERNATION_CLASS);

        setWatcher({
          element: $row.get(0),
          watch: rowOptions.watch,
          getter: () => this._isAltRow(row),
          callBack: (value) => {
            $row.toggleClass(ROW_ALTERNATION_CLASS, value);
          },
        });
      }

      this._setAriaRowIndex(rowOptions, $row);

      setWatcher({
        element: $row.get(0),
        watch: rowOptions.watch,
        getter: () => rowOptions.rowIndex,
        callBack: () => this._setAriaRowIndex(rowOptions, $row),
      });
    }

    super._rowPrepared.apply(this, arguments as any);
  }

  private _setAriaRowIndex(row, $row) {
    if (!$row.is('tr')) {
      return;
    }

    const { component } = this;
    const isPagerMode = component.option('scrolling.mode') === 'standard' && !gridCoreUtils.isVirtualRowRendering(component);
    let rowIndex = row.rowIndex + 1;

    if (isPagerMode) {
      rowIndex = component.pageIndex() * component.pageSize() + rowIndex;
    } else {
      rowIndex += this._dataController.getRowIndexOffset();
    }
    this.setAria('rowindex', rowIndex, $row);
  }

  protected setAriaExpandedAttribute($row, row) {
    const description = row.isExpanded ? this.localize('dxDataGrid-ariaExpandedRow') : this.localize('dxDataGrid-ariaCollapsedRow');
    this.setAria('roledescription', description, $row);
  }

  /**
   * @extended: column_fixing
   */
  protected _afterRowPrepared(e) {
    const arg = e.args[0];
    const dataController = this._dataController;
    const row = dataController.getVisibleRows()[arg.rowIndex];
    const watch: any = this.option('integrationOptions.watchMethod');

    if (!arg.data || arg.rowType !== 'data' || arg.isNewRow || !this.option('twoWayBindingEnabled') || !watch || !row) return;

    const dispose = watch(
      () => dataController.generateDataValues(arg.data, arg.columns),
      () => {
        dataController.repaintRows([row.rowIndex], this.option('repaintChangesOnly'));
      },
      {
        deep: true,
        skipImmediate: true,
      },
    );

    eventsEngine.on(arg.rowElement, removeEvent, dispose);
  }

  private _renderScrollable(force?) {
    const that = this;
    const $element = that.element();

    if (!$element.children().length) {
      $element.append('<div>');
    }
    if (force || !that._loadPanel) {
      that._renderLoadPanel($element, $element.parent(), that._dataController.isLocalStore());
    }

    if ((force || !that.getScrollable()) && that._dataController.isLoaded()) {
      const columns = that.getColumns();
      let allColumnsHasWidth = true;

      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].width && !columns[i].minWidth) {
          allColumnsHasWidth = false;
          break;
        }
      }

      if (that.option('columnAutoWidth') || that._hasHeight || allColumnsHasWidth || that._columnsController._isColumnFixing()) {
        that._renderScrollableCore($element);
      }
    }
  }

  /**
   * @extended: column_fixing, virtual_column, virtual_scrolling
   */
  protected _handleScroll(e) {
    const that = this;
    const rtlEnabled = that.option('rtlEnabled');
    const isNativeScrolling = e.component.option('useNative');

    that._scrollTop = e.scrollOffset.top;
    that._scrollLeft = e.scrollOffset.left;
    let scrollLeft = e.scrollOffset.left;
    if (rtlEnabled) {
      this._scrollRight = getMaxHorizontalScrollOffset(e.component) - this._scrollLeft;

      if (isNativeScrolling) {
        scrollLeft = -this._scrollRight;
      }

      if (!this.isScrollbarVisible(true)) {
        this._scrollLeft = -1;
      }
    }
    that.scrollChanged.fire({ ...e.scrollOffset, left: scrollLeft }, that.name);
  }

  private _renderScrollableCore($element) {
    const that = this;
    const dxScrollableOptions = that._createScrollableOptions();
    const scrollHandler = that._handleScroll.bind(that);

    dxScrollableOptions.onScroll = scrollHandler;

    that._scrollable = that._createComponent($element, Scrollable, dxScrollableOptions);
    that._scrollableContainer = that._scrollable && $(that._scrollable.container());
  }

  private _renderLoadPanel(...args: any[]) {
    return gridCoreUtils.renderLoadPanel.apply(this, arguments as any);
  }

  /**
   * @extended: column_fixing, row_dragging
   */
  protected _renderContent(contentElement, tableElement, isFixedTableRendering?) {
    contentElement.empty().append(tableElement);

    return this._findContentElement();
  }

  /**
   * @extended: editing_form_based, virtual_scrolling
   */
  protected _updateContent(newTableElement, change, isFixedTableRendering?) {
    this._contentChanges.push({ newTableElement, change, isFixedTableRendering });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.waitAsyncTemplates().done(() => {
      const contentChanges = this._contentChanges;

      this._contentChanges = [];

      contentChanges.forEach(({ newTableElement, change, isFixedTableRendering }) => {
        const tableElement = this.getTableElement(isFixedTableRendering);
        const contentElement = this._findContentElement(isFixedTableRendering);
        const changeType = change?.changeType;
        const executors: any[] = [];
        const highlightChanges = this.option('highlightChanges');
        const rowInsertedClass = this.addWidgetPrefix(ROW_INSERTED_ANIMATION_CLASS);

        switch (changeType) {
          case 'update':
            each(change.rowIndices, (index, rowIndex) => {
              const $newRowElement = this._getRowElements(newTableElement).eq(index);
              const dataChangeType = change.changeTypes?.[index];
              const item = change.items && change.items[index];

              executors.push(() => {
                const $rowElements = this._getRowElements(tableElement);
                const $rowElement = $rowElements.eq(rowIndex);

                // eslint-disable-next-line default-case
                switch (dataChangeType) {
                  case 'update':
                    if (item) {
                      const columnIndices = change.columnIndices?.[index];

                      if (isDefined(item.visible) && item.visible !== $rowElement.is(':visible')) {
                        $rowElement.toggle(item.visible);
                      } else if (columnIndices) {
                        this._updateCells($rowElement, $newRowElement, columnIndices, item);
                      } else {
                        $rowElement.replaceWith($newRowElement);
                      }
                    }
                    break;
                  case 'insert':
                    if (!$rowElements.length) {
                      if (tableElement) {
                        const target = $newRowElement.is('tbody') ? tableElement : tableElement.children('tbody');
                        $newRowElement.prependTo(target);
                      }
                    } else if ($rowElement.length) {
                      $newRowElement.insertBefore($rowElement);
                    } else {
                      $newRowElement.insertAfter($rowElements.last());
                    }
                    if (highlightChanges && change.isLiveUpdate) {
                      $newRowElement.addClass(rowInsertedClass);
                    }
                    break;
                  case 'remove':
                    $rowElement.remove();
                    break;
                }
              });
            });
            each(executors, function () {
              this();
            });

            newTableElement.remove();
            break;
          default:
            this.setTableElement(newTableElement, isFixedTableRendering);
            contentElement.addClass(this.addWidgetPrefix(CONTENT_CLASS));
            this._setGridRole(contentElement);
            this._renderContent(contentElement, newTableElement, isFixedTableRendering);
            break;
        }
      });
    }).fail(() => {
      this._contentChanges = [];
    });
  }

  protected _getGridRoleName(): string {
    return 'grid';
  }

  private _setGridRole($element: dxElementWrapper): void {
    const hasData = !this._dataController?.isEmpty();
    const gridRoleName = this._getGridRoleName();

    if ($element?.length && hasData) {
      this.setAria('role', gridRoleName, $element);
    }
  }

  public _createEmptyRow(className, isFixed?, height?) {
    const that = this;
    let $cell;
    const $row = that._createRow();
    const columns = isFixed ? this.getFixedColumns() : this.getColumns();

    $row
      .addClass(className)
      .toggleClass(COLUMN_LINES_CLASS, that.option('showColumnLines'));

    for (let i = 0; i < columns.length; i++) {
      $cell = that._createCell({
        column: columns[i], rowType: 'freeSpace', columnIndex: i, columns,
      });
      isNumeric(height) && $cell.css('height', height);

      $row.append($cell);
    }

    that.setAria('role', 'presentation', $row);

    return $row;
  }

  public getFixedColumns() {
    throw new Error('Method not implemented.');
  }

  public _appendEmptyRow($table, $emptyRow, location?) {
    const $tBodies = this._getBodies($table);
    const isTableContainer = !$tBodies.length || $emptyRow.is('tbody');
    const $container = isTableContainer ? $table : $tBodies;

    if (location === 'top') {
      $container.first().prepend($emptyRow);
      if (isTableContainer) {
        const $colgroup = $container.children('colgroup');
        $container.prepend($colgroup);
      }
    } else {
      $container.last().append($emptyRow);
    }
  }

  private _renderFreeSpaceRow($tableElement, change) {
    let $freeSpaceRowElement = this._createEmptyRow(FREE_SPACE_CLASS);

    $freeSpaceRowElement = this._wrapRowIfNeed($tableElement, $freeSpaceRowElement, change?.changeType === 'refresh');

    this._appendEmptyRow($tableElement, $freeSpaceRowElement);
  }

  /**
   * @extended: focues
   */
  protected _checkRowKeys(options) {
    const that = this;
    const rows = that._getRows(options);
    const keyExpr = that._dataController.store() && that._dataController.store().key();

    keyExpr && rows.some((row) => {
      if (row.rowType === 'data' && row.key === undefined) {
        that._dataController.fireError('E1046', keyExpr);
        return true;
      }
      return undefined;
    });
  }

  /**
   * @extended: columns_resizing_reordering, virtual_scrolling
   */
  protected _needUpdateRowHeight(itemsCount): boolean | undefined {
    return itemsCount > 0 && !this._rowHeight;
  }

  private _getRowsHeight($tableElement) {
    $tableElement = $tableElement || this._tableElement;

    const $rowElements = $tableElement.children('tbody').children().not('.dx-virtual-row').not(`.${FREE_SPACE_CLASS}`);

    return $rowElements.toArray().reduce((sum, row) => sum + getBoundingRect(row).height, 0);
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _updateRowHeight() {
    const that = this;
    const $tableElement = that.getTableElement();
    const itemsCount = that._dataController.items().length;

    if ($tableElement && that._needUpdateRowHeight(itemsCount)) {
      const rowsHeight = that._getRowsHeight($tableElement);
      that._rowHeight = rowsHeight / itemsCount;
    }
  }

  /**
   * @extended: column_fixing
   */
  public _findContentElement(isFixedTableRendering?): any {
    let $content = this.element();
    const scrollable = this.getScrollable();

    if ($content) {
      if (scrollable) {
        $content = $(scrollable.content());
      }
      return $content.children().first();
    }
  }

  /**
   * @extended virtual_scrolling
   */
  public _getRowElements(tableElement?) {
    const $rows = super._getRowElements(tableElement);

    return $rows && $rows.not(`.${FREE_SPACE_CLASS}`);
  }

  public _getFreeSpaceRowElements($table) {
    const tableElements = $table || this.getTableElements();

    return tableElements && tableElements.children('tbody').children(`.${FREE_SPACE_CLASS}`);
  }

  private _getNoDataText() {
    return this.option('noDataText');
  }

  /**
   * @extended: editing, keyboard_navigation, selection
   */
  protected _rowClick(e?) {
    const item = this._dataController.items()[e.rowIndex] || {};
    this.executeAction('onRowClick', extend({
      evaluate(expr) {
        const getter = compileGetter(expr);
        // @ts-expect-error
        return getter(item.data);
      },
    }, e, item));
  }

  /**
   * @extended: editing
   */
  protected _rowDblClick(e?) {
    const item = this._dataController.items()[e.rowIndex] || {};
    this.executeAction('onRowDblClick', extend({}, e, item));
  }

  protected _getColumnsCountBeforeGroups(columns) {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].type === 'groupExpand') {
        return i;
      }
    }

    return 0;
  }

  /**
   * @extended: column_fixing
   */
  protected _getGroupCellOptions(options) {
    const columnsCountBeforeGroups = this._getColumnsCountBeforeGroups(options.columns);
    const columnIndex = (options.row.groupIndex || 0) + columnsCountBeforeGroups;

    return {
      columnIndex,
      colspan: options.columns.length - columnIndex - 1,
    };
  }

  protected _needWrapRow() {
    return super._needWrapRow.apply(this, arguments as any) || !!this.option('dataRowTemplate');
  }

  /**
   * @extended: adaptivity, master_details
   */
  protected _renderCells($row, options) {
    if (options.row.rowType === 'group') {
      this._renderGroupedCells($row, options);
    } else if (options.row.values) {
      super._renderCells($row, options);
    }
  }

  /**
   * @extended: column_fixing
   */
  protected _renderGroupedCells($row, options) {
    const { row } = options;
    let expandColumn;
    const { columns } = options;
    const { rowIndex } = row;
    let isExpanded;
    const groupCellOptions = this._getGroupCellOptions(options);

    for (let i = 0; i <= groupCellOptions.columnIndex; i++) {
      if (i === groupCellOptions.columnIndex && columns[i].allowCollapsing && options.scrollingMode !== 'infinite') {
        isExpanded = !!row.isExpanded;
        expandColumn = columns[i];
      } else {
        isExpanded = null;
        expandColumn = {
          command: 'expand',
          cssClass: columns[i].cssClass,
          fixed: columns[i].fixed,
        };
      }

      if (this._needRenderCell(i, options.columnIndices)) {
        this._renderCell($row, {
          value: isExpanded,
          row,
          rowIndex,
          column: expandColumn,
          columnIndex: i,
          columnIndices: options.columnIndices,
          change: options.change,
        });
      }
    }

    const groupColumnAlignment = getDefaultAlignment(this.option('rtlEnabled'));

    const groupColumn = extend(
      {},
      columns[groupCellOptions.columnIndex],
      {
        command: null,
        type: null,
        cssClass: null,
        width: null,
        showWhenGrouped: false,
        alignment: groupColumnAlignment,
      },
    );

    if (groupCellOptions.colspan > 1) {
      groupColumn.colspan = groupCellOptions.colspan;
    }

    if (this._needRenderCell(groupCellOptions.columnIndex + 1, options.columnIndices)) {
      this._renderCell($row, {
        value: row.values[row.groupIndex],
        row,
        rowIndex,
        column: groupColumn,
        columnIndex: groupCellOptions.columnIndex + 1,
        columnIndices: options.columnIndices,
        change: options.change,
      });
    }
  }

  protected _renderRows($table, options) {
    const that = this;
    const scrollingMode = that.option('scrolling.mode');

    super._renderRows($table, extend({
      scrollingMode,
    }, options));

    that._checkRowKeys(options.change);

    that._renderFreeSpaceRow($table, options.change);
    if (!that._hasHeight) {
      that.updateFreeSpaceRowHeight($table);
    }
  }

  private _renderDataRowByTemplate($table, options, dataRowTemplate) {
    const { row } = options;
    const rowOptions = extend({ columns: options.columns }, row);
    const $tbody = this._createRow(row, 'tbody');
    $tbody.appendTo($table);
    this.renderTemplate($tbody, dataRowTemplate, rowOptions, true, options.change);
    this._rowPrepared($tbody, rowOptions, options.row);
  }

  /**
   * @extended: column_fixing
   */
  protected _renderRow($table, options) {
    const { row } = options;
    const { rowTemplate } = this.option();
    const dataRowTemplate = this.option('dataRowTemplate');

    if (row.rowType === 'data' && dataRowTemplate) {
      this._renderDataRowByTemplate($table, options, dataRowTemplate);
    } else if ((row.rowType === 'data' || row.rowType === 'group') && !isDefined(row.groupIndex) && rowTemplate) {
      this.renderTemplate($table, rowTemplate, extend({ columns: options.columns }, row), true);
    } else {
      super._renderRow($table, options);
    }
  }

  /**
   * @extended: column_fixing
   */
  protected _renderTable(options) {
    const that = this;
    const $table = super._renderTable(options);
    const resizeCompletedHandler = function () {
      const scrollableInstance = that.getScrollable();
      if (scrollableInstance && that.element().closest(getWindow().document).length) {
        that.resizeCompleted.remove(resizeCompletedHandler);
        scrollableInstance._visibilityChanged(true);
      }
    };

    if (!isDefined(that.getTableElement())) {
      that.setTableElement($table);
      that._renderScrollable(true);
      that.resizeCompleted.add(resizeCompletedHandler);
    } else {
      that._renderScrollable();
    }

    return $table;
  }

  /**
   * @extended: editing_cell_based
   */
  protected _createTable() {
    const $table = super._createTable.apply(this, arguments as any);

    if (this.option().rowTemplate || this.option().dataRowTemplate) {
      $table.appendTo(this.component.$element());
    }

    return $table;
  }

  /**
   * @extended: column_fixing, editing, keyboard_navigation, row_dragging, search, selection, virtual_column, virtual_scrolling
   */
  protected _renderCore(change) {
    const $element = this.element();

    $element.addClass(this.addWidgetPrefix(ROWS_VIEW_CLASS)).toggleClass(this.addWidgetPrefix(NOWRAP_CLASS), !this.option('wordWrapEnabled'));
    $element.toggleClass(EMPTY_CLASS, this._dataController.isEmpty());

    this.setAria('role', 'presentation', $element);

    const $table = this._renderTable({ change });
    const deferred = this._updateContent($table, change);

    super._renderCore(change);

    this._lastColumnWidths = null;
    return deferred;
  }

  protected _getRows(change) {
    return change && change.items || this._dataController.items();
  }

  /**
   * @extended: editing
   */
  protected _getCellOptions(options) {
    const that = this;
    const { column } = options;
    const { row } = options;
    const { data } = row;
    const summaryCells = row && row.summaryCells;
    const { value } = options;
    const displayValue = gridCoreUtils.getDisplayValue(column, value, data, row.rowType);

    const parameters = super._getCellOptions(options);
    parameters.value = value;
    parameters.oldValue = options.oldValue;
    parameters.displayValue = displayValue;
    parameters.row = row;
    parameters.key = row.key;
    parameters.data = data;
    parameters.rowType = row.rowType;
    parameters.values = row.values;
    parameters.text = !column.command ? gridCoreUtils.formatValue(displayValue, column) : '';
    parameters.rowIndex = row.rowIndex;
    parameters.summaryItems = summaryCells && summaryCells[options.columnIndex];
    parameters.resized = column.resizedCallbacks;

    if (isDefined(column.groupIndex) && !column.command) {
      const groupingTextsOptions: any = that.option('grouping.texts');
      const scrollingMode = that.option('scrolling.mode');
      if (scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
        parameters.groupContinuesMessage = data && data.isContinuationOnNextPage && groupingTextsOptions && groupingTextsOptions.groupContinuesMessage;
        parameters.groupContinuedMessage = data && data.isContinuation && groupingTextsOptions && groupingTextsOptions.groupContinuedMessage;
      }
    }

    return parameters;
  }

  protected _toggleDraggableSourceColumnClass($rows, visibleColumns, columnIndex, value) {
    const columnsController = this._columnsController;
    const columns = columnsController.getColumns();
    const column = columns && columns[columnIndex];
    const columnID = column && column.isBand && column.index;

    each($rows, (rowIndex, row) => {
      if (!$(row).hasClass(GROUP_ROW_CLASS)) {
        for (let i = 0; i < visibleColumns.length; i++) {
          if (isNumeric(columnID) && columnsController.isParentBandColumn(visibleColumns[i].index, columnID) || visibleColumns[i].index === columnIndex) {
            $rows.eq(rowIndex)
              .children()
              .eq(i)
              .toggleClass(this.addWidgetPrefix(REORDERING_CLASSES.draggableColumn), value);

            if (!isNumeric(columnID)) {
              break;
            }
          }
        }
      }
    });
  }

  private _getDevicePixelRatio() {
    return getWindow().devicePixelRatio;
  }

  public renderNoDataText() {
    return gridCoreUtils.renderNoDataText.apply(this, arguments as any);
  }

  public getCellOptions(rowIndex, columnIdentifier) {
    const rowOptions = this._dataController.items()[rowIndex];
    let cellOptions;
    let column;

    if (rowOptions) {
      if (isString(columnIdentifier)) {
        column = this._columnsController.columnOption(columnIdentifier);
      } else {
        column = this._columnsController.getVisibleColumns()[columnIdentifier];
      }

      if (column) {
        cellOptions = this._getCellOptions({
          value: column.calculateCellValue(rowOptions.data),
          rowIndex: rowOptions.rowIndex,
          row: rowOptions,
          column,
        });
      }
    }
    return cellOptions;
  }

  public getRow(index) {
    if (index >= 0) {
      const rows = this._getRowElements();

      if (rows.length > index) {
        return $(rows[index]);
      }
    }

    return undefined;
  }

  /**
   * @extended: validating, virtual_scrolling
   */
  public updateFreeSpaceRowHeight($table?) {
    const dataController = this._dataController;
    const itemCount = dataController.items(true).length;
    const contentElement = this._findContentElement();
    const freeSpaceRowElements = this._getFreeSpaceRowElements($table);

    if (freeSpaceRowElements && contentElement && dataController.totalCount() >= 0) {
      let isFreeSpaceRowVisible = false;

      if (itemCount > 0) {
        if (!this._hasHeight) {
          const freeSpaceRowCount = dataController.pageSize() - itemCount;
          const scrollingMode = this.option('scrolling.mode');

          if (freeSpaceRowCount > 0 && dataController.pageCount() > 1 && scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
            setHeight(freeSpaceRowElements, freeSpaceRowCount * this._rowHeight);
            isFreeSpaceRowVisible = true;
          }
          if (!isFreeSpaceRowVisible && $table) {
            setHeight(freeSpaceRowElements, 0);
          } else {
            freeSpaceRowElements.toggle(isFreeSpaceRowVisible);
          }
          this._updateLastRowBorder(isFreeSpaceRowVisible);
        } else {
          freeSpaceRowElements.hide();
          deferUpdate(() => {
            const scrollbarWidth = this.getScrollbarWidth(true);
            const elementHeightWithoutScrollbar = getHeight(this.element()) - scrollbarWidth;
            const contentHeight = getOuterHeight(contentElement);
            const showFreeSpaceRow = (elementHeightWithoutScrollbar - contentHeight) > 0;
            const rowsHeight = this._getRowsHeight(contentElement.children().first());
            const $tableElement = $table || this.getTableElements();
            const borderTopWidth = Math.ceil(parseFloat($tableElement.css('borderTopWidth')));
            const heightCorrection = this._getHeightCorrection();
            const resultHeight = elementHeightWithoutScrollbar - rowsHeight - borderTopWidth - heightCorrection;

            if (showFreeSpaceRow) {
              deferRender(() => {
                freeSpaceRowElements.css('height', resultHeight);
                isFreeSpaceRowVisible = true;
                freeSpaceRowElements.show();
              });
            }
            deferRender(() => this._updateLastRowBorder(isFreeSpaceRowVisible));
          });
        }
      } else {
        freeSpaceRowElements.css('height', 0);
        freeSpaceRowElements.show();
        this._updateLastRowBorder(true);
      }
    }
  }

  private _getHeightCorrection() {
    const isZoomedWebkit = browser.webkit && this._getDevicePixelRatio() >= 2; // T606935
    // @ts-expect-error
    const isChromeLatest = browser.chrome && browser.version >= 91;
    // @ts-expect-error
    const hasExtraBorderTop = browser.mozilla && browser.version >= 70 && !this.option('showRowLines');
    return isZoomedWebkit || hasExtraBorderTop || isChromeLatest ? 1 : 0;
  }

  protected _columnOptionChanged(e) {
    const { optionNames } = e;

    if (e.changeTypes.grouping) return;

    if (optionNames.width || optionNames.visibleWidth) {
      super._columnOptionChanged(e);
      this._fireColumnResizedCallbacks();
    }
  }

  public getScrollable() {
    return this._scrollable;
  }

  protected _handleDataChanged(change?) {
    const that = this;

    switch (change.changeType) {
      case 'refresh':
      case 'prepend':
      case 'append':
      case 'update':
        that.render(null, change);
        break;
      default:
        that._update(change);
        break;
    }
  }

  public publicMethods() {
    return ['isScrollbarVisible', 'getTopVisibleRowData', 'getScrollbarWidth', 'getCellElement', 'getRowElement', 'getScrollable'];
  }

  public contentWidth() {
    return getWidth(this.element()) - this.getScrollbarWidth();
  }

  public getScrollbarWidth(isHorizontal?) {
    const scrollableContainer = this._scrollableContainer && this._scrollableContainer.get(0);
    let scrollbarWidth = 0;

    if (scrollableContainer) {
      if (!isHorizontal) {
        scrollbarWidth = scrollableContainer.clientWidth ? scrollableContainer.offsetWidth - scrollableContainer.clientWidth : 0;
      } else {
        scrollbarWidth = scrollableContainer.clientHeight ? scrollableContainer.offsetHeight - scrollableContainer.clientHeight : 0;
        scrollbarWidth += getScrollableBottomPadding(this); // T703649, T697699
      }
    }
    return scrollbarWidth > 0 ? scrollbarWidth : 0;
  }

  // TODO remove this call, move _fireColumnResizedCallbacks functionality to columnsController
  private _fireColumnResizedCallbacks() {
    const that = this;
    const lastColumnWidths = that._lastColumnWidths || [];
    const columnWidths: any[] = [];
    const columns = that.getColumns();

    for (let i = 0; i < columns.length; i++) {
      columnWidths[i] = columns[i].visibleWidth;
      if (columns[i].resizedCallbacks && !isDefined(columns[i].groupIndex) && lastColumnWidths[i] !== columnWidths[i]) {
        columns[i].resizedCallbacks.fire(columnWidths[i]);
      }
    }

    that._lastColumnWidths = columnWidths;
  }

  private _updateLastRowBorder(isFreeSpaceRowVisible) {
    if (this.option('showBorders') && !isFreeSpaceRowVisible) {
      this.element().addClass(LAST_ROW_BORDER);
    } else {
      this.element().removeClass(LAST_ROW_BORDER);
    }
  }

  /**
   * @extended: column_fixing
   */
  protected _updateScrollable() {
    const scrollable = Scrollable.getInstance(this.element());

    if (scrollable) {
      // @ts-expect-error
      scrollable.update();

      // @ts-expect-error
      if (scrollable.option('useNative') || !scrollable?.isRenovated()) {
        this._updateHorizontalScrollPosition();
      }
    }
  }

  private _updateHorizontalScrollPosition() {
    const scrollable = this.getScrollable();
    const scrollLeft = scrollable && scrollable.scrollOffset().left;
    const rtlEnabled = this.option('rtlEnabled');

    if (rtlEnabled) {
      const maxHorizontalScrollOffset = getMaxHorizontalScrollOffset(scrollable);
      const scrollRight = maxHorizontalScrollOffset - scrollLeft;
      if (scrollRight !== this._scrollRight) {
        this._scrollLeft = maxHorizontalScrollOffset - this._scrollRight;
      }
    }

    if (this._scrollLeft >= 0 && scrollLeft !== this._scrollLeft) {
      scrollable.scrollTo({ x: this._scrollLeft });
    }
  }

  /**
   * @extended: column_fixing, filter_row, row_dragging, vitrual_columns, virtual_scrolling
   */
  protected _resizeCore() {
    const that = this;

    that._fireColumnResizedCallbacks();
    that._updateRowHeight();

    deferRender(() => {
      that._renderScrollable();
      that.renderNoDataText();
      that.updateFreeSpaceRowHeight();
      deferUpdate(() => {
        that._updateScrollable();
      });
    });
  }

  public scrollTo(location) {
    const $element = this.element();
    const dxScrollable = $element && Scrollable.getInstance($element);

    if (dxScrollable) {
      dxScrollable.scrollTo(location);
    }
  }

  public height(height?) {
    const that = this;
    const $element = this.element();

    if (arguments.length === 0) {
      return $element ? getOuterHeight($element, true) : 0;
    }

    if (isDefined(height) && $element) {
      that.hasHeight(height !== 'auto');
      setHeight($element, height);
    }
  }

  public hasHeight(hasHeight?) {
    if (arguments.length === 0) { return !!this._hasHeight; }

    this._hasHeight = hasHeight;

    return undefined;
  }

  /**
   * @extended: virtual_scrolling
   */
  public setLoading(isLoading, messageText?) {
    const that = this;
    let loadPanel = that._loadPanel;
    const dataController = that._dataController;
    const loadPanelOptions: any = that.option('loadPanel') || {};
    const animation = dataController.isLoaded() ? loadPanelOptions.animation : null;
    const $element = that.element();

    if (!hasWindow()) {
      return;
    }

    if (!loadPanel && messageText !== undefined && dataController.isLocalStore() && loadPanelOptions.enabled === 'auto' && $element) {
      that._renderLoadPanel($element, $element.parent());
      loadPanel = that._loadPanel;
    }
    if (loadPanel) {
      const visibilityOptions: any = {
        message: messageText || loadPanelOptions.text,
        animation,
        visible: isLoading,
      };
      if (isLoading) {
        visibilityOptions.position = gridCoreUtils.calculateLoadPanelPosition($element);
      }
      clearTimeout(that._hideLoadingTimeoutID);
      if (loadPanel.option('visible') && !isLoading) {
        that._hideLoadingTimeoutID = setTimeout(() => {
          loadPanel.option(visibilityOptions);
        }, LOADPANEL_HIDE_TIMEOUT);
      } else {
        loadPanel.option(visibilityOptions);
      }
    }
  }

  /**
   * @extended: column_fixing
   */
  public toggleDraggableColumnClass(columnIndex, value) {
    const $rows = this._getRowElements().not(`.${GROUP_ROW_CLASS}`) || [];
    this._toggleDraggableSourceColumnClass($rows, this.getColumns(), columnIndex, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _getCellElementsCore(rowIndex): dxElementWrapper | undefined {
    const $cells = super._getCellElementsCore.apply(this, arguments as any);

    if ($cells) {
      const groupCellIndex = $cells.filter(`.${GROUP_CELL_CLASS}`).index();

      if (groupCellIndex >= 0 && $cells.length > groupCellIndex + 1) {
        return $cells.slice(0, groupCellIndex + 1);
      }
    }

    return $cells;
  }

  private _getBoundaryVisibleItemIndex(isTop, isFloor) {
    const that = this;
    let itemIndex = 0;
    let prevOffset = 0;
    let offset: any = 0;
    let viewportBoundary = that._scrollTop;
    const $contentElement = that._findContentElement();
    const contentElementOffsetTop = $contentElement && $contentElement.offset().top;
    const items = this._dataController.items();
    const tableElement = that.getTableElement();

    if (items.length && tableElement) {
      const rowElements = that._getRowElements(tableElement).filter(':visible');

      if (!isTop) {
        const height = getOuterHeight(this._hasHeight ? this.element() : getWindow());

        viewportBoundary += height;
      }

      for (itemIndex = 0; itemIndex < items.length; itemIndex++) {
        prevOffset = offset;
        const $rowElement = $(rowElements).eq(itemIndex);
        if ($rowElement.length) {
          offset = $rowElement.offset();
          offset = (isTop ? offset.top : offset.top + getOuterHeight($rowElement)) - contentElementOffsetTop;

          if (offset > viewportBoundary) {
            if (itemIndex) {
              if (isFloor || viewportBoundary * 2 < Math.round(offset + prevOffset)) {
                itemIndex--;
              }
            }
            break;
          }
        }
      }
      if (itemIndex && itemIndex === items.length) {
        itemIndex--;
      }
    }

    return itemIndex;
  }

  public getTopVisibleItemIndex(isFloor?) {
    return this._getBoundaryVisibleItemIndex(true, isFloor);
  }

  private getBottomVisibleItemIndex(isFloor) {
    return this._getBoundaryVisibleItemIndex(false, isFloor);
  }

  private getTopVisibleRowData() {
    const itemIndex = this.getTopVisibleItemIndex();
    const items = this._dataController.items();

    if (items[itemIndex]) {
      return items[itemIndex].data;
    }

    return undefined;
  }

  /**
   * @extended: column_fixing
   */
  public _scrollToElement($element, offset?) {
    const scrollable = this.getScrollable();
    scrollable && scrollable.scrollToElement($element, offset);
  }

  public optionChanged(args) {
    const that = this;

    super.optionChanged(args);

    // eslint-disable-next-line default-case
    switch (args.name) {
      case 'wordWrapEnabled':
      case 'showColumnLines':
      case 'showRowLines':
      case 'rowAlternationEnabled':
      case 'rowTemplate':
      case 'dataRowTemplate':
      case 'twoWayBindingEnabled':
        that._invalidate(true, true);
        args.handled = true;
        break;
      case 'scrolling':
        that._rowHeight = null;
        that._tableElement = null;
        args.handled = true;
        break;
      case 'rtlEnabled':
        that._rowHeight = null;
        that._tableElement = null;
        break;
      case 'loadPanel':
        that._tableElement = null;
        that._invalidate(true, args.fullName !== 'loadPanel.enabled');
        args.handled = true;
        break;
      case 'noDataText':
        that.renderNoDataText();
        args.handled = true;
        break;
    }
  }

  /**
   * @extended: column_fixing
   */
  protected setAriaOwns(headerTableId: string, footerTableId: string, isFixed?: boolean): void {
    const $contentElement = this._findContentElement();
    const $tableElement = this.getTableElement();

    if ($tableElement?.length) {
      this.setAria('owns', `${headerTableId ?? ''} ${$tableElement.attr('id') ?? ''} ${footerTableId ?? ''}`.trim(), $contentElement);
    }
  }

  public dispose() {
    super.dispose();
    clearTimeout(this._hideLoadingTimeoutID);
    this._scrollable && this._scrollable.dispose();
  }

  /**
   * @extended: column_fixing
   */
  public setScrollerSpacing(vScrollbarWidth?, hScrollbarWidth?) { }

  public getFixedContentElement(): dxElementWrapper {
    const fixedContentClass = this.addWidgetPrefix(CONTENT_FIXED_CLASS);

    return this.element()?.children(`.${fixedContentClass}`);
  }

  /**
   * @extended: validating, virtual_scrolling
   */
  // eslint-disable-next-line
  protected _restoreErrorRow(contentTable?) { }

  public isElementInside($element) {
    const $rowsViewElement = $element.closest(`.${this.addWidgetPrefix(ROWS_VIEW_CLASS)}`);

    return $rowsViewElement.is(this.element());
  }
}

export const rowsModule = {
  defaultOptions() {
    return {
      hoverStateEnabled: false,

      scrolling: {
        useNative: 'auto',
      },

      loadPanel: {
        enabled: 'auto',
        text: messageLocalization.format('Loading'),
        width: 200,
        height: 90,
        showIndicator: true,
        indicatorSrc: '',
        showPane: true,
      },
      dataRowTemplate: null,
      columnAutoWidth: false,
      noDataText: messageLocalization.format('dxDataGrid-noDataText'),
      wordWrapEnabled: false,
      showColumnLines: true,
      showRowLines: false,
      rowAlternationEnabled: false,
      activeStateEnabled: false,
      twoWayBindingEnabled: true,
    };
  },
  views: {
    rowsView: RowsView,
  },
};
