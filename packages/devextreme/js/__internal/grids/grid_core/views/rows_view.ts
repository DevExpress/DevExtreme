import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import messageLocalization from '@js/common/core/localization/message';
import { data as elementData } from '@js/core/element_data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { Callback } from '@js/core/utils/callbacks';
import { deferRender, deferUpdate } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect, getDefaultAlignment } from '@js/core/utils/position';
import { getHeight, getOuterHeight, getWidth } from '@js/core/utils/size';
import { isEmpty } from '@js/core/utils/string';
import { setHeight } from '@js/core/utils/style';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { RowPreparedEvent } from '@js/ui/data_grid';
import type dxLoadPanel from '@js/ui/load_panel';
import type { Properties as LoadPanelProperties } from '@js/ui/load_panel';
import type { ActionEvent } from '@ts/core/action';
import { compileGetter } from '@ts/core/utils/data';
import { CLASSES as COLUMN_FIXING_CLASSES } from '@ts/grids/grid_core/column_fixing/const';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type {
  Column, ColumnRenderTemplate, ColumnsChanges, ColumnTemplateSource,
} from '@ts/grids/grid_core/columns_controller/types';
import type {
  ColumnsResizerViewController,
} from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type {
  DataChange, ProcessedItem, RowWatch, UpdateChange, UpdateItemChange,
} from '@ts/grids/grid_core/data_controller/types';
import { isSameItem } from '@ts/grids/grid_core/data_controller/utils/row_changes';
import { generateRowValues } from '@ts/grids/grid_core/data_controller/utils/row_values';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';
import type {
  KeyboardNavigationController,
} from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { OptionChanged, SummaryTextItem } from '@ts/grids/grid_core/types';
import type { ValidatingController } from '@ts/grids/grid_core/validating/m_validating';
import Scrollable from '@ts/ui/scroll_view/scrollable';
import type { ElementOffset } from '@ts/ui/scroll_view/types';

import { CLASSES as REORDERING_CLASSES } from '../columns_resizing_reordering/const';
import { isLocalStore } from '../data_source_adapter/utils/store';
import type { EditingController } from '../editing/m_editing';
import { CLASSES } from '../sticky_columns/const';
import gridCoreUtils from '../utils';
import { ColumnsView } from './columns_view';
import { CLASSES as VIEW_CLASSES } from './const';
import type {
  CellRenderOptions,
  FocusStateParams,
  GroupCellOptions,
  GroupContinuationData,
  HintColumn,
  RowPreparedOptions,
  RowRenderOptions,
  RowsModuleOptions,
  RowsViewContentChange,
  RowsViewLoadPanelOptions,
  RowsViewOptions,
  RowsViewScrollEvent,
  ScrollPosition,
  TableRenderOptions,
  ViewCellOptions,
  ViewDataChange,
  ViewRow,
  ViewRowEvent,
} from './types';
import {
  getCellText,
  getMaxHorizontalScrollOffset,
  insertRowElement,
  isRowElementVisible,
  isSameColumnLayout,
  keepContentHeight,
} from './utils';

const LOADPANEL_HIDE_TIMEOUT = 200;

export function isGroupRow(
  { rowType, column }: Pick<ViewCellOptions, 'rowType' | 'column'>,
): boolean {
  return rowType === 'group'
    && isDefined(column.groupIndex)
    && !column.showWhenGrouped && !column.command;
}

function setWatcher<TValue>({
  element, watch, getter, callBack,
}: {
  element: Element;
  watch?: RowWatch;
  getter: () => TValue;
  callBack: (value: TValue) => void;
}): void {
  if (watch) {
    // @ts-expect-error watch passes what the getter returns to the callback
    const dispose = watch(getter, callBack);

    eventsEngine.on(element, removeEvent, dispose);
  }
}

const defaultCellTemplate = function defaultCellTemplate(
  $container: dxElementWrapper,
  options: ViewCellOptions,
): void {
  const isDataTextEmpty = isEmpty(options.text) && options.rowType === 'data';
  const { text } = options;
  const container = $container.get(0);

  if (isDataTextEmpty) {
    gridCoreUtils.setEmptyText($container);
  } else if (options.column.encodeHtml) {
    container.textContent = text ?? null;
  } else {
    // @ts-expect-error text is undefined when customizeText returns nothing
    container.innerHTML = text;
  }
};

export class RowsView extends ColumnsView {
  private readonly _loadPanel?: dxLoadPanel | null;

  public _editingController!: EditingController;

  private _resizingController!: ResizingController;

  protected _columnsResizerController!: ColumnsResizerViewController;

  protected _focusController!: FocusController;

  protected _keyboardNavigationController!: KeyboardNavigationController;

  protected _validatingController!: ValidatingController;

  protected dataSourceController!: DataSourceController;

  public _columnHeadersView!: ColumnHeadersView;

  public _hasHeight: boolean | undefined;

  public _scrollTop!: number;

  protected declare _scrollLeft: number;

  private _scrollRight!: number;

  public _scrollable?: Scrollable;

  private _scrollableContainer?: dxElementWrapper;

  private _contentChanges!: RowsViewContentChange[];

  public _rowHeight!: number | null;

  public resizeCompleted!: Callback<[]>;

  private _lastColumnWidths?: Column['visibleWidth'][] | null;

  private _hideLoadingTimeoutID?: ReturnType<typeof setTimeout>;

  public init(): void {
    super.init();

    this._editingController = this.getController('editing');
    this._resizingController = this.getController('resizing');
    this._columnsResizerController = this.getController('columnsResizer');
    this._focusController = this.getController('focus');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._validatingController = this.getController('validating');
    this.dataSourceController = this.getController('dataSource');
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
      const scrollable = this.getScrollable();

      if (scrollable && this._scrollLeft >= 0 && !this._dataController.isLoading()) {
        this._handleScroll({
          component: scrollable,
          forceUpdateScrollPosition: true,
          scrollOffset: { top: this._scrollTop, left: this._scrollLeft },
        });
      }
    });
  }

  public _getDefaultTemplate(column: Column): ColumnRenderTemplate<ViewCellOptions>['render'] {
    switch (column.command) {
      case 'empty':
        return function emptyCellTemplate(container: dxElementWrapper): void {
          container.html('&nbsp;');
        };
      default:
        return defaultCellTemplate;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public renderFocusState(params: FocusStateParams): void { }

  private _getDefaultGroupTemplate(
    column: Column,
  ): ColumnRenderTemplate<ViewCellOptions>['render'] {
    const summaryTexts = this.option('summary.texts');

    return function defaultGroupTemplate(
      $container: dxElementWrapper,
      options: ViewCellOptions,
    ): void {
      const { data } = options;
      let text = `${options.column.caption}: ${options.text}`;
      const container = $container.get(0);

      if (options.summaryItems?.length) {
        text += ` ${gridCoreUtils.getGroupRowSummaryText(options.summaryItems as SummaryTextItem[], summaryTexts)}`;
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
   * @extended: focus, selection
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _update(change?: DataChange): void { }

  /**
   * @extended: editing_form_based, search
   */
  public _updateCell($cell: dxElementWrapper, options: ViewCellOptions): void {
    if (isGroupRow(options)) {
      const isGroupContainer = $cell.is(`.${this.addWidgetPrefix(CLASSES.groupRowContainer)}`);
      const $groupCell = isGroupContainer
        ? $cell.parent()
        : $cell;

      $groupCell.addClass(VIEW_CLASSES.groupCell);
    }
    super._updateCell($cell, options);
  }

  /**
   * @extended: adaptivity, editing, master_detail
   */
  protected _getCellTemplate(
    options: ViewCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    const { column }: { column: HintColumn } = options;

    if (isGroupRow(options)) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
      return column.groupCellTemplate || {
        allowRenderToDetachedContainer: true,
        render: this._getDefaultGroupTemplate(column),
      };
    }

    if ((options.rowType === 'data' || column.command) && column.cellTemplate) {
      return column.cellTemplate;
    }

    return { allowRenderToDetachedContainer: true, render: this._getDefaultTemplate(column) };
  }

  /**
   * @extended: adaptivity, editing, editing_row_based, focus, master_detail
   */
  protected _createRow(row?: ViewRow, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (row) {
      const isGroup = row.rowType === 'group';
      const isDataRow = row.rowType === 'data';

      if (isDataRow) {
        $row.addClass(VIEW_CLASSES.dataRow);
      }
      if (isDataRow && this.option('showRowLines')) {
        $row.addClass(VIEW_CLASSES.rowLines);
      }

      if (this.option('showColumnLines')) {
        $row.addClass(VIEW_CLASSES.columnLines);
      }

      if (row.visible === false) {
        $row.hide();
      }

      if (isGroup) {
        $row.addClass(VIEW_CLASSES.groupRow);
        this.setAriaExpandedAttribute($row, row.isExpanded);
      }
    }

    return $row;
  }

  protected _rowPrepared(
    $row: dxElementWrapper,
    rowOptions: RowPreparedOptions,
    row: ViewRow,
  ): void {
    if (rowOptions.rowType === 'data') {
      if (this.option('rowAlternationEnabled')) {
        if (this._isAltRow(row)) {
          $row.addClass(VIEW_CLASSES.rowAlternation);
        }

        setWatcher({
          element: $row.get(0),
          watch: rowOptions.watch,
          getter: () => this._isAltRow(
            // The row needs to be obtained again because the current row is out of date.
            this._dataController.getRowByKey(row.key),
          ),
          callBack: (value) => {
            $row.toggleClass(VIEW_CLASSES.rowAlternation, value);
          },
        });
      }

      this._setAriaRowIndex($row, rowOptions.rowIndex);

      setWatcher({
        element: $row.get(0),
        watch: rowOptions.watch,
        getter: () => rowOptions.rowIndex,
        callBack: (rowIndex) => this._setAriaRowIndex($row, rowIndex),
      });
    }

    super._rowPrepared($row, rowOptions, row);
  }

  private _setAriaRowIndex($row: dxElementWrapper, rowIndex: number | undefined): void {
    if (!$row.is('tr')) {
      return;
    }

    const isStandardScrollingMode = this.option('scrolling.mode') === 'standard';
    const isPagerMode = isStandardScrollingMode && !gridCoreUtils.isVirtualRowRendering(this);

    const oneBasedRowIndex = Number(rowIndex) + 1;
    const rowIndexOffset = isPagerMode
      ? this.component.pageIndex() * this.component.pageSize()
      : this._dataController.getRowIndexOffset();

    this.setAria('rowindex', oneBasedRowIndex + rowIndexOffset, $row);
  }

  protected setAriaExpandedAttribute(
    $row: dxElementWrapper,
    isExpanded: boolean | undefined,
  ): void {
    const description = isExpanded
      ? this.localize('dxDataGrid-ariaExpandedRow')
      : this.localize('dxDataGrid-ariaCollapsedRow');
    this.setAria('roledescription', description, $row);
  }

  /**
   * @extended: column_fixing
   */
  protected _afterRowPrepared(e: ActionEvent): void {
    // @ts-expect-error ActionEvent is a common type: its args are unknown and not checked
    const arg: RowPreparedEvent = e.args[0];
    const row = this._dataController.getVisibleRows()[arg.rowIndex];
    const watch = this.option('integrationOptions.watchMethod');
    const isExistingDataRow = !!arg.data && arg.rowType === 'data' && !arg.isNewRow;
    const isTwoWayBindingEnabled = this.option('twoWayBindingEnabled');

    if (!isExistingDataRow || !isTwoWayBindingEnabled || !watch || !row) {
      return;
    }

    const dispose = watch(
      () => generateRowValues(arg.data, arg.columns),
      () => {
        this._dataController.repaintRows([row.rowIndex], this.option('repaintChangesOnly'));
      },
      {
        deep: true,
        skipImmediate: true,
      },
    );

    eventsEngine.on(arg.rowElement, removeEvent, dispose);
  }

  private _renderScrollable(force?: boolean): void {
    // @ts-expect-error the view is rendered here
    const $element: dxElementWrapper = this.element();

    if (!$element.children().length) {
      $element.append('<div>');
    }
    if (force || !this._loadPanel) {
      this._renderLoadPanel(
        $element,
        $element.parent(),
        isLocalStore(this.dataSourceController.store()),
      );
    }

    if ((force || !this.getScrollable()) && this._dataController.isLoaded()) {
      const columns = this.getColumns();
      let allColumnsHasWidth = true;

      for (const column of columns) {
        if (!column.width && !column.minWidth) {
          allColumnsHasWidth = false;
          break;
        }
      }

      if (
        this.option('columnAutoWidth')
        || this._hasHeight
        || allColumnsHasWidth
        || this._columnsController._isColumnFixing()
      ) {
        this._renderScrollableCore($element);
      }
    }
  }

  /**
   * @extended: column_fixing, virtual_column, virtual_scrolling
   */
  protected _handleScroll(e: RowsViewScrollEvent): void {
    const { top, left } = e.scrollOffset;
    const rtlEnabled = this.option('rtlEnabled');
    const isNativeScrolling = e.component.option('useNative');

    this._scrollTop = top;
    this._saveHorizontalScrollPosition(left);

    const scrollLeft = rtlEnabled && isNativeScrolling ? -this._scrollRight : left;

    this.scrollChanged.fire({ ...e.scrollOffset, left: scrollLeft }, this.name);
  }

  protected _saveHorizontalScrollPosition(left: number): void {
    const rtlEnabled = this.option('rtlEnabled');
    const isHorizontalScrollbarVisible = this.isScrollbarVisible(true);

    this._scrollLeft = rtlEnabled && !isHorizontalScrollbarVisible ? -1 : left;

    if (rtlEnabled) {
      const maxHorizontalScrollOffset = getMaxHorizontalScrollOffset(
        this._scrollableContainer?.get(0) as HTMLElement | undefined,
      );

      this._scrollRight = maxHorizontalScrollOffset - left;
    }
  }

  private _renderScrollableCore($element: dxElementWrapper): void {
    const dxScrollableOptions = {
      ...this._createScrollableOptions(),
      onScroll: this._handleScroll.bind(this),
    };

    // @ts-expect-error the onScroll event of the Scrollable always has a scrollOffset
    this._scrollable = this._createComponent($element, Scrollable, dxScrollableOptions);
    this._scrollableContainer = this._scrollable && $(this._scrollable.container());
  }

  private _renderLoadPanel(
    $element: dxElementWrapper,
    $container: dxElementWrapper,
    hasLocalStore?: boolean,
  ): void {
    return gridCoreUtils.renderLoadPanel.call(this, $element, $container, hasLocalStore);
  }

  /**
   * @extended: column_fixing, row_dragging
   */
  protected _renderContent(
    contentElement: dxElementWrapper,
    tableElement: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFixedTableRendering?: boolean,
  ): dxElementWrapper | undefined {
    contentElement.empty().append(tableElement);

    return this._findContentElement();
  }

  public isWaitingForRowsLayout(): boolean {
    return this.isWaitingForAsyncTemplates() && !this.isRenderedLayoutCurrent();
  }

  private isRenderedLayoutCurrent(): boolean {
    const items = this._dataController.items();
    const rowElements = this._getRowElements().toArray() as HTMLElement[];
    const renderedRows: (ProcessedItem & { columns: Column[] })[] = rowElements.map(
      (rowElement) => elementData(rowElement, 'options'),
    );

    const isSameRows = renderedRows.length === items.length
      && renderedRows.every((renderedRow, index) => isSameItem(renderedRow, items[index], true)
        && isRowElementVisible(rowElements[index]) === (items[index].visible !== false));

    if (!isSameRows || !renderedRows.length) {
      return isSameRows;
    }

    return isSameColumnLayout(renderedRows[0].columns, this._columnsController.getVisibleColumns());
  }

  /**
   * @extended: editing_form_based, virtual_scrolling
   */
  protected _updateContent(
    newTableElement: dxElementWrapper,
    change?: ViewDataChange,
    isFixedTableRendering?: boolean,
  ): DeferredObj<unknown> {
    this._contentChanges.push({ newTableElement, change, isFixedTableRendering });

    return this.waitAsyncTemplates().done(() => {
      const contentChanges = this._contentChanges;
      const hasRowChanges = contentChanges.some(
        ({ change: contentChange }) => contentChange?.changeType === 'update',
      );

      this._contentChanges = [];

      keepContentHeight(hasRowChanges ? this._findContentElement() : undefined, () => {
        contentChanges.forEach(({
          newTableElement: $newTable,
          change: contentChange,
          isFixedTableRendering: isFixedTable,
        }) => {
          const contentElement = this._findContentElement(isFixedTable);

          if (contentChange?.changeType === 'update') {
            this.applyRowChanges(contentChange, $newTable, isFixedTable);
          } else {
            this.replaceTable(contentElement, $newTable, isFixedTable);
          }
        });
      });
    }).fail(() => {
      this._contentChanges = [];
    });
  }

  private applyRowChanges(
    change: UpdateChange,
    $newTable: dxElementWrapper,
    isFixedTable?: boolean,
  ): void {
    const tableElement = this.getTableElement(isFixedTable);
    const $newRows = this._getRowElements($newTable);
    const shouldHighlightInserts = this.option('highlightChanges') && change.isLiveUpdate;
    const insertedRowClass = shouldHighlightInserts
      ? this.addWidgetPrefix(VIEW_CLASSES.rowInsertedAnimation)
      : undefined;

    change.rowIndices.forEach((rowIndex, index) => {
      const changeType = change.changeTypes?.[index];

      if (changeType) {
        this.applyRowChange(tableElement, $newRows.eq(index), {
          changeType,
          rowIndex,
          item: change.items?.[index],
          columnIndices: change.columnIndices?.[index],
        }, insertedRowClass);
      }
    });

    $newTable.remove();
  }

  private applyRowChange(
    tableElement: dxElementWrapper | null | undefined,
    $newRow: dxElementWrapper,
    {
      changeType, rowIndex, item, columnIndices,
    }: UpdateItemChange,
    insertedRowClass: string | undefined,
  ): void {
    const $rows = this._getRowElements(tableElement);
    const $row = $rows.eq(rowIndex);

    switch (changeType) {
      case 'update':
        if (item) {
          this.updateRowElement($row, $newRow, item, columnIndices);
        }
        break;
      case 'insert':
        insertRowElement($newRow, $rows, rowIndex, tableElement);

        if (insertedRowClass) {
          $newRow.addClass(insertedRowClass);
        }
        break;
      case 'remove':
        $row.remove();
        break;
      default:
        break;
    }
  }

  private updateRowElement(
    $row: dxElementWrapper,
    $newRow: dxElementWrapper,
    item: ProcessedItem,
    columnIndices: number[] | undefined,
  ): void {
    if (isDefined(item.visible) && item.visible !== $row.is(':visible')) {
      $row.toggle(item.visible);
    } else if (columnIndices) {
      this._updateCells($row, $newRow, columnIndices, item);
    } else {
      $row.replaceWith($newRow);
    }
  }

  private replaceTable(
    contentElement: dxElementWrapper | undefined,
    $newTable: dxElementWrapper,
    isFixedTable?: boolean,
  ): void {
    this.setTableElement($newTable, isFixedTable);

    if (contentElement) {
      contentElement.addClass(this.addWidgetPrefix(VIEW_CLASSES.content));
      this._setGridRole(contentElement);
      this._renderContent(contentElement, $newTable, isFixedTable);
    }
  }

  protected _getGridRoleName(): string {
    return 'grid';
  }

  private _setGridRole($element: dxElementWrapper): void {
    const gridRoleName = this._getGridRoleName();

    if ($element?.length) {
      this.setAria('role', gridRoleName, $element);
    }
  }

  public _createEmptyRow(className: string, isFixed?: boolean, height?: number): dxElementWrapper {
    const $row = this._createRow();
    const columns = isFixed ? this.getFixedColumns() : this.getColumns();

    $row
      .addClass(className)
      .toggleClass(VIEW_CLASSES.columnLines, this.option('showColumnLines'));

    for (let i = 0; i < columns.length; i += 1) {
      const $cell = this._createCell({
        column: columns[i], rowType: 'freeSpace', columnIndex: i, columns,
      });
      if (isNumeric(height)) {
        setHeight($cell, height);
      }

      $row.append($cell);
    }

    this.setAria('role', 'presentation', $row);

    return $row;
  }

  public getFixedColumns(): Column[] {
    throw new Error('Method not implemented.');
  }

  public _appendEmptyRow(
    $table: dxElementWrapper,
    $emptyRow: dxElementWrapper,
    location?: string,
  ): void {
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

  private _renderFreeSpaceRow($tableElement: dxElementWrapper): void {
    let $freeSpaceRowElement = this._createEmptyRow(VIEW_CLASSES.freeSpaceRow);

    $freeSpaceRowElement = this._wrapRowIfNeed($freeSpaceRowElement);

    this._appendEmptyRow($tableElement, $freeSpaceRowElement);
  }

  /**
   * @extended: focues
   */
  protected _checkRowKeys(options?: ViewDataChange): void {
    const rows = this._getRows(options);
    const keyExpr = this.dataSourceController.store()?.key();

    if (keyExpr) {
      rows.some((row) => {
        if (row.rowType === 'data' && row.key === undefined) {
          this._dataController.fireError('E1046', keyExpr);
          return true;
        }
        return undefined;
      });
    }
  }

  /**
   * @extended: columns_resizing_reordering, virtual_scrolling
   */
  protected _needUpdateRowHeight(itemsCount: number): boolean | undefined {
    return itemsCount > 0 && !this._rowHeight;
  }

  private _getRowsHeight($tableElement: dxElementWrapper): number {
    const $table = $tableElement || this._tableElement;

    const $rowElements = $table
      .children('tbody')
      .children()
      .not('.dx-virtual-row')
      .not(`.${VIEW_CLASSES.freeSpaceRow}`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- getBoundingRect returns any
    return $rowElements.toArray().reduce((sum, row) => sum + getBoundingRect(row).height, 0);
  }

  /**
   * @extended: virtual_scrolling
   */
  protected _updateRowHeight(): void {
    const $tableElement = this.getTableElement();
    const itemsCount = this._dataController.items().length;

    if ($tableElement && this._needUpdateRowHeight(itemsCount)) {
      const rowsHeight = this._getRowsHeight($tableElement);
      this._rowHeight = rowsHeight / itemsCount;
    }
  }

  /**
   * @extended: column_fixing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public _findContentElement(isFixedTableRendering?: boolean): dxElementWrapper | undefined {
    const $element = this.element();
    const scrollable = this.getScrollable();

    if (!$element) {
      return undefined;
    }

    if (scrollable) {
      return $(scrollable.content()).children().first();
    }

    return $element.children().first();
  }

  /**
   * @extended virtual_scrolling
   */
  public _getRowElements(tableElement?: dxElementWrapper | null): dxElementWrapper {
    const $rows = super._getRowElements(tableElement);

    return $rows?.not(`.${VIEW_CLASSES.freeSpaceRow}`);
  }

  public _getFreeSpaceRowElements($table?: dxElementWrapper): dxElementWrapper {
    const tableElements = $table ?? this.getTableElements();

    return tableElements && tableElements.children('tbody').children(`.${VIEW_CLASSES.freeSpaceRow}`);
  }

  private _getNoDataText(): string | undefined {
    return this.option('noDataText');
  }

  /**
   * @extended: editing, keyboard_navigation, selection
   */
  protected _rowClick(e: ViewRowEvent): void {
    const item: Partial<ProcessedItem> = this._dataController.items()[e.rowIndex] || {};
    this.executeAction('onRowClick', extend({
      evaluate(expr) {
        const getter = compileGetter(expr);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- compileGetter returns any
        return getter(item.data);
      },
    }, e, item));
  }

  /**
   * @extended: editing
   */
  protected _rowDblClick(e: ViewRowEvent): void {
    const item = this._dataController.items()[e.rowIndex] || {};
    this.executeAction('onRowDblClick', extend({}, e, item));
  }

  protected _getColumnsCountBeforeGroups(columns: Column[]): number {
    for (let i = 0; i < columns.length; i += 1) {
      if (columns[i].type === 'groupExpand') {
        return i;
      }
    }

    return 0;
  }

  /**
   * @extended: column_fixing
   */
  protected _getGroupCellOptions(options: RowRenderOptions): GroupCellOptions {
    const columnsCountBeforeGroups = this._getColumnsCountBeforeGroups(options.columns);
    const columnIndex = (options.row.groupIndex ?? 0) + columnsCountBeforeGroups;

    return {
      columnIndex,
      colspan: options.columns.length - columnIndex - 1,
    };
  }

  protected _needWrapRow(): boolean {
    return !!this.option('dataRowTemplate');
  }

  /**
   * @extended: adaptivity, master_details
   */
  protected _renderCells($row: dxElementWrapper, options: RowRenderOptions): void {
    if (options.row.rowType === 'group') {
      this._renderGroupedCells($row, options);
    } else if (options.row.values) {
      super._renderCells($row, options);
    }
  }

  /**
   * @extended: column_fixing
   */
  protected _renderGroupedCells($row: dxElementWrapper, options: RowRenderOptions): void {
    const { row, columns } = options;
    const { rowIndex } = row;
    const groupCellOptions = this._getGroupCellOptions(options);

    for (let i = 0; i <= groupCellOptions.columnIndex; i += 1) {
      const isGroupToggleCell = i === groupCellOptions.columnIndex
        && columns[i].allowCollapsing
        && options.scrollingMode !== 'infinite';

      const isExpanded = isGroupToggleCell ? !!row.isExpanded : null;
      const expandColumn: Column = isGroupToggleCell
        ? columns[i]
        : { command: 'expand', cssClass: columns[i].cssClass, fixed: columns[i].fixed };

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
        // @ts-expect-error group rows have values and a groupIndex
        value: row.values[row.groupIndex],
        row,
        rowIndex,
        // @ts-expect-error the group cell resets these column fields with null
        column: groupColumn,
        columnIndex: groupCellOptions.columnIndex + 1,
        columnIndices: options.columnIndices,
        change: options.change,
      });
    }
  }

  protected _renderRows($table: dxElementWrapper, options: TableRenderOptions): void {
    const scrollingMode = this.option('scrolling.mode');

    super._renderRows($table, extend({
      scrollingMode,
    }, options));

    this._checkRowKeys(options.change);

    this._renderFreeSpaceRow($table);
    if (!this._hasHeight) {
      this.updateFreeSpaceRowHeight($table);
    }
  }

  private _renderDataRowByTemplate(
    $table: dxElementWrapper,
    options: RowRenderOptions,
    dataRowTemplate: ColumnTemplateSource<RowPreparedOptions>,
  ): void {
    const { row } = options;
    const rowOptions: RowPreparedOptions = extend({ columns: options.columns }, row);
    const $tbody = this._createRow(row, 'tbody');
    $tbody.appendTo($table);
    this.renderTemplate($tbody, dataRowTemplate, rowOptions, true, options.change);
    this._rowPrepared($tbody, rowOptions, options.row);
  }

  /**
   * @extended: column_fixing
   */
  protected _renderRow($table: dxElementWrapper, options: RowRenderOptions): void {
    const { row } = options;
    const dataRowTemplate = this.option('dataRowTemplate');

    if (row.rowType === 'data' && dataRowTemplate) {
      this._renderDataRowByTemplate($table, options, dataRowTemplate);
      return;
    }

    super._renderRow($table, options);
  }

  /**
   * @extended: column_fixing
   */
  protected _renderTable(options?: TableRenderOptions): dxElementWrapper {
    const $table = super._renderTable(options);
    const resizeCompletedHandler = (): void => {
      const scrollableInstance = this.getScrollable();
      if (scrollableInstance && this.element()?.closest(getWindow().document).length) {
        this.resizeCompleted.remove(resizeCompletedHandler);
        scrollableInstance._visibilityChanged(true);
      }
    };

    if (!isDefined(this.getTableElement())) {
      this.setTableElement($table);
      this._renderScrollable(true);
      this.resizeCompleted.add(resizeCompletedHandler);
    } else {
      this._renderScrollable();
    }

    return $table;
  }

  /**
   * @extended: editing_cell_based
   */
  protected _createTable(columns?: Column[], isAppend?: boolean): dxElementWrapper {
    const $table = super._createTable(columns, isAppend);

    if (this.option().dataRowTemplate) {
      $table.appendTo(this.component.$element());
    }

    return $table;
  }

  /**
   * @extended: column_fixing, editing, keyboard_navigation, row_dragging, search, selection,
   * virtual_column, virtual_scrolling
   */
  protected _renderCore(change?: DataChange): DeferredObj<unknown> {
    const $element = this.element();

    if (!$element) {
      return Deferred<unknown>().resolve();
    }

    $element
      .addClass(this.addWidgetPrefix(VIEW_CLASSES.rowsView))
      .toggleClass(this.addWidgetPrefix(VIEW_CLASSES.noWrap), !this.option('wordWrapEnabled'));
    $element.toggleClass(VIEW_CLASSES.empty, this._dataController.isEmpty());

    this.setAria('role', 'presentation', $element);

    const $table = this._renderTable({ change });
    const deferred = this._updateContent($table, change);

    super._renderCore(change);

    this._lastColumnWidths = null;
    return deferred;
  }

  public _getRows(change?: ViewDataChange): ViewRow[] {
    return change?.items ?? this._dataController.items();
  }

  /**
   * @extended: editing
   */
  protected _getCellOptions(options: CellRenderOptions): ViewCellOptions {
    const { column, row, value } = options;
    const { data, summaryCells }: ViewRow & { data?: GroupContinuationData } = row;
    const displayValue = gridCoreUtils.getDisplayValue(column, value, data, row.rowType);

    // The same object: _addWatchMethod's watch/update closures hold it
    return Object.assign(
      super._getCellOptions(options),
      {
        value,
        oldValue: options.oldValue,
        displayValue,
        row,
        key: row.key,
        data,
        rowType: row.rowType,
        values: row.values,
        text: getCellText(column, displayValue),
        rowIndex: row.rowIndex,
        summaryItems: summaryCells?.[options.columnIndex],
        resized: column.resizedCallbacks,
      } satisfies Partial<ViewCellOptions>,
      this.getGroupContinuationMessages(column, data),
    );
  }

  private getGroupContinuationMessages(
    column: Column,
    data: GroupContinuationData | undefined,
  ): Pick<ViewCellOptions, 'groupContinuesMessage' | 'groupContinuedMessage'> {
    const { grouping, scrolling } = this.option() as RowsViewOptions;
    const isGroupCell = isDefined(column.groupIndex) && !column.command;
    const virtualPaging = scrolling?.mode === 'virtual' || scrolling?.mode === 'infinite';

    if (!isGroupCell || virtualPaging) {
      return {};
    }

    const texts = grouping?.texts;

    return {
      groupContinuesMessage: data?.isContinuationOnNextPage && texts?.groupContinuesMessage,
      groupContinuedMessage: data?.isContinuation && texts?.groupContinuedMessage,
    };
  }

  protected _toggleDraggableSourceColumnClass(
    $rows: dxElementWrapper,
    visibleColumns: Column[],
    columnIndex: number,
    value: boolean,
  ): void {
    const columns = this._columnsController.getColumns();
    const column = columns?.[columnIndex];
    const columnID = column && column.isBand && column.index;

    each($rows, (rowIndex, row) => {
      if ($(row).hasClass(VIEW_CLASSES.groupRow)) {
        return;
      }

      for (let i = 0; i < visibleColumns.length; i += 1) {
        const { index } = visibleColumns[i];
        const isInDraggedBand = isNumeric(columnID)
          && isDefined(index)
          && this._columnsController.isParentBandColumn(index, columnID);

        if (isInDraggedBand || index === columnIndex) {
          $rows.eq(rowIndex)
            .children()
            .eq(i)
            .toggleClass(this.addWidgetPrefix(REORDERING_CLASSES.draggableColumn), value);

          if (!isNumeric(columnID)) {
            break;
          }
        }
      }
    });
  }

  private _getDevicePixelRatio(): number {
    return getWindow().devicePixelRatio;
  }

  public renderNoDataText($element?: dxElementWrapper): void {
    return gridCoreUtils.renderNoDataText.call(this, $element);
  }

  public getCellOptions(
    rowIndex: number,
    columnIdentifier: string | number,
  ): ViewCellOptions | undefined {
    const rowOptions = this._dataController.items()[rowIndex];

    if (!rowOptions) {
      return undefined;
    }

    const column = isString(columnIdentifier)
      ? this._columnsController.columnOption(columnIdentifier)
      : this._columnsController.getVisibleColumns()[columnIdentifier];

    if (!column) {
      return undefined;
    }

    // @ts-expect-error the public getCellOptions builds the options without a columnIndex
    return this._getCellOptions({
      // @ts-expect-error createColumn sets it; virtual-column placeholders lack it and throw
      value: column.calculateCellValue(rowOptions.data),
      rowIndex: rowOptions.rowIndex,
      row: rowOptions,
      column,
    });
  }

  public getRow(index: number): dxElementWrapper | undefined {
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
  public updateFreeSpaceRowHeight($table?: dxElementWrapper): boolean | undefined {
    const itemCount = this._dataController.items(true).length;
    const contentElement = this._findContentElement();
    const freeSpaceRowElements = this._getFreeSpaceRowElements($table);

    if (
      !freeSpaceRowElements
      || !contentElement
      || !(this.dataSourceController.totalCount() >= 0)
    ) {
      return undefined;
    }

    let isFreeSpaceRowVisible = false;

    if (itemCount > 0) {
      if (!this._hasHeight) {
        const freeSpaceRowCount = this._dataController.pageSize() - itemCount;
        const scrollingMode = this.option('scrolling.mode');

        if (
          freeSpaceRowCount > 0
          && this.dataSourceController.pageCount() > 1
          && scrollingMode !== 'virtual'
          && scrollingMode !== 'infinite'
        ) {
          setHeight(freeSpaceRowElements, freeSpaceRowCount * Number(this._rowHeight));
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        deferUpdate(() => {
          const scrollbarWidth = this.getScrollbarWidth(true);
          const elementHeightWithoutScrollbar = getHeight(this.element()) - scrollbarWidth;
          const contentHeight = getOuterHeight(contentElement);
          const showFreeSpaceRow = (elementHeightWithoutScrollbar - contentHeight) > 0;
          const rowsHeight = this._getRowsHeight(contentElement.children().first());
          const $tableElement = $table ?? this.getTableElements();
          const borderTopWidth = Math.ceil(parseFloat($tableElement.css('borderTopWidth') ?? ''));
          const heightCorrection = this._getHeightCorrection();
          const resultHeight = elementHeightWithoutScrollbar
            - rowsHeight - borderTopWidth - heightCorrection;

          if (showFreeSpaceRow) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
            deferRender(() => {
              setHeight(freeSpaceRowElements, resultHeight);
              isFreeSpaceRowVisible = true;
              freeSpaceRowElements.show();
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
          deferRender(() => this._updateLastRowBorder(isFreeSpaceRowVisible));
        });
      }
    } else {
      setHeight(freeSpaceRowElements, 0);
      freeSpaceRowElements.show();
      this._updateLastRowBorder(true);
    }

    return undefined;
  }

  private _getHeightCorrection(): number {
    const isZoomedWebkit = browser.webkit && this._getDevicePixelRatio() >= 2; // T606935
    const hasExtraBorderTop = browser.mozilla && !this.option('showRowLines');

    return isZoomedWebkit || hasExtraBorderTop || browser.chrome ? 1 : 0;
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    if (e.changeTypes.grouping) {
      return;
    }

    if (e.optionNames.width || e.optionNames.visibleWidth) {
      super._columnOptionChanged(e);
      this._fireColumnResizedCallbacks();
    }
  }

  public getScrollable(): Scrollable | undefined {
    return this._scrollable;
  }

  protected _handleDataChanged(change: DataChange): void {
    switch (change.changeType) {
      case 'refresh':
      case 'prepend':
      case 'append':
      case 'update':
        this.render(null, change);
        break;
      default:
        this._update(change);
        break;
    }
  }

  public publicMethods(): string[] {
    return [
      'isScrollbarVisible',
      'getTopVisibleRowData',
      'getScrollbarWidth',
      'getCellElement',
      'getRowElement',
      'getScrollable',
    ];
  }

  public contentWidth(): number {
    return getWidth(this.element()) - this.getScrollbarWidth();
  }

  public getScrollbarWidth(isHorizontal?: boolean): number {
    const scrollableContainer = this._scrollableContainer?.get(0) as HTMLElement | undefined;
    let scrollbarWidth = 0;

    if (scrollableContainer) {
      if (!isHorizontal) {
        scrollbarWidth = scrollableContainer.clientWidth
          ? scrollableContainer.offsetWidth - scrollableContainer.clientWidth
          : 0;
      } else {
        scrollbarWidth = scrollableContainer.clientHeight
          ? scrollableContainer.offsetHeight - scrollableContainer.clientHeight
          : 0;
        scrollbarWidth += this.getScrollableBottomPadding(); // T703649, T697699
      }
    }
    return scrollbarWidth > 0 ? scrollbarWidth : 0;
  }

  private getScrollableBottomPadding(): number {
    const scrollable = this.getScrollable();
    return scrollable
      ? Math.ceil(parseFloat($(scrollable.content()).css('paddingBottom') ?? ''))
      : 0;
  }

  // TODO remove this call, move _fireColumnResizedCallbacks functionality to columnsController
  private _fireColumnResizedCallbacks(): void {
    const lastColumnWidths = this._lastColumnWidths ?? [];
    const columnWidths: Column['visibleWidth'][] = [];
    const columns = this.getColumns();

    for (let i = 0; i < columns.length; i += 1) {
      columnWidths[i] = columns[i].visibleWidth;
      if (
        columns[i].resizedCallbacks
        && !isDefined(columns[i].groupIndex)
        && lastColumnWidths[i] !== columnWidths[i]
      ) {
        columns[i].resizedCallbacks?.fire(columnWidths[i]);
      }
    }

    this._lastColumnWidths = columnWidths;
  }

  private _updateLastRowBorder(isFreeSpaceRowVisible: boolean): void {
    if (this.option('showBorders') && !isFreeSpaceRowVisible) {
      this.element()?.addClass(VIEW_CLASSES.lastRowBorder);
    } else {
      this.element()?.removeClass(VIEW_CLASSES.lastRowBorder);
    }
  }

  /**
   * @extended: column_fixing
   */
  protected _updateScrollable(): void {
    // @ts-expect-error the view is rendered here
    const scrollable = Scrollable.getInstance<Scrollable | undefined>(this.element());

    if (scrollable) {
      scrollable.update();

      this._updateHorizontalScrollPosition();
    }
  }

  private _updateHorizontalScrollPosition(): void {
    const scrollable = this.getScrollable();

    if (!scrollable) {
      return;
    }

    const scrollLeft = scrollable.scrollOffset().left;
    const rtlEnabled = this.option('rtlEnabled');

    if (rtlEnabled) {
      const maxHorizontalScrollOffset = getMaxHorizontalScrollOffset(
        this._scrollableContainer?.get(0) as HTMLElement | undefined,
      );
      const scrollRight = maxHorizontalScrollOffset - scrollLeft;

      if (scrollRight !== this._scrollRight) {
        this._scrollLeft = maxHorizontalScrollOffset - this._scrollRight;
      }
    }

    if (this._scrollLeft >= 0 && scrollLeft !== this._scrollLeft) {
      scrollable.scrollTo({ left: this._scrollLeft });
    }
  }

  /**
   * @extended: column_fixing, filter_row, row_dragging, vitrual_columns, virtual_scrolling
   */
  protected _resizeCore(): void {
    this._fireColumnResizedCallbacks();
    this._updateRowHeight();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    deferRender(() => {
      this._renderScrollable();
      this.renderNoDataText();
      this.updateFreeSpaceRowHeight();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      deferUpdate(() => {
        this._updateScrollable();
      });
    });
  }

  public scrollTo(location: ScrollPosition): void {
    const $element = this.element();
    const dxScrollable = $element && Scrollable.getInstance<Scrollable | undefined>($element);

    if (dxScrollable) {
      dxScrollable.scrollTo(location);
    }
  }

  public height(): number;
  public height(height: number | string | undefined): void;
  public height(height?: number | string): number | undefined {
    const $element = this.element();

    if (arguments.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- getOuterHeight returns any
      return $element ? getOuterHeight($element, true) : 0;
    }

    if (isDefined(height) && $element) {
      this.hasHeight(height !== 'auto');
      setHeight($element, height);
    }

    return undefined;
  }

  public hasHeight(): boolean;
  public hasHeight(hasHeight: boolean | undefined): undefined;
  public hasHeight(hasHeight?: boolean): boolean | undefined {
    if (arguments.length === 0) {
      return !!this._hasHeight;
    }

    this._hasHeight = hasHeight;

    return undefined;
  }

  /**
   * @extended: virtual_scrolling
   */
  public setLoading(isLoading: boolean, messageText?: string): void {
    const loadPanelOptions: RowsViewLoadPanelOptions | undefined = this.option('loadPanel');
    const animation = this._dataController.isLoaded() ? loadPanelOptions?.animation : null;
    const $element = this.element();

    if (!hasWindow()) {
      return;
    }

    if (
      !this._loadPanel
      && messageText !== undefined
      && isLocalStore(this.dataSourceController.store())
      && loadPanelOptions?.enabled === 'auto'
      && $element
    ) {
      this._renderLoadPanel($element, $element.parent());
    }

    // Kept for the hide timeout: a re-render can replace _loadPanel before it fires
    const loadPanel = this._loadPanel;

    if (loadPanel) {
      const visibilityOptions: LoadPanelProperties = {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- '' falls back
        message: messageText || loadPanelOptions?.text,
        // @ts-expect-error the LoadPanel takes null to turn the animation off
        animation,
        visible: isLoading,
      };
      if (isLoading) {
        // @ts-expect-error calculateLoadPanelPosition isn't typed yet
        visibilityOptions.position = gridCoreUtils.calculateLoadPanelPosition($element);
      }
      clearTimeout(this._hideLoadingTimeoutID);
      if (loadPanel.option('visible') && !isLoading) {
        // eslint-disable-next-line no-restricted-globals
        this._hideLoadingTimeoutID = setTimeout(() => {
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
  public toggleDraggableColumnClass(columnIndex: number, value: boolean): void {
    const $rows = this._getRowElements().not(`.${VIEW_CLASSES.groupRow}`) || [];
    this._toggleDraggableSourceColumnClass($rows, this.getColumns(), columnIndex, value);
  }

  protected _getCellElementsCore(rowIndex: number): dxElementWrapper | undefined {
    const $cells = super._getCellElementsCore(rowIndex);

    if ($cells) {
      const groupCellIndex = $cells.filter(`.${VIEW_CLASSES.groupCell}`).index();

      if (groupCellIndex >= 0 && $cells.length > groupCellIndex + 1) {
        return $cells.slice(0, groupCellIndex + 1);
      }
    }

    return $cells;
  }

  private _getBoundaryVisibleItemIndex(isTop: boolean, isFloor?: boolean): number {
    const items = this._dataController.items();
    const tableElement = this.getTableElement();
    const contentElementOffset = this._findContentElement()?.offset();

    if (!items.length || !tableElement || !contentElementOffset) {
      return 0;
    }

    const rowElements = this._getRowElements(tableElement).filter(':visible');
    let itemIndex = 0;
    let prevOffset = 0;
    let offset = 0;
    let viewportBoundary = this._scrollTop;

    if (!isTop) {
      const height = getOuterHeight(this._hasHeight ? this.element() : getWindow());

      viewportBoundary += height;
    }

    for (itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      prevOffset = offset;
      const $rowElement = $(rowElements).eq(itemIndex);
      const rowOffset = $rowElement.offset();

      if (rowOffset) {
        offset = (isTop ? rowOffset.top : rowOffset.top + getOuterHeight($rowElement))
          - contentElementOffset.top;

        if (offset > viewportBoundary) {
          return itemIndex && (isFloor || viewportBoundary * 2 < Math.round(offset + prevOffset))
            ? itemIndex - 1
            : itemIndex;
        }
      }
    }
    if (itemIndex && itemIndex === items.length) {
      itemIndex -= 1;
    }

    return itemIndex;
  }

  public getTopVisibleItemIndex(isFloor?: boolean): number {
    return this._getBoundaryVisibleItemIndex(true, isFloor);
  }

  public getBottomVisibleItemIndex(isFloor?: boolean): number {
    return this._getBoundaryVisibleItemIndex(false, isFloor);
  }

  private getTopVisibleRowData(): RawItemData | undefined {
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
  public _scrollToElement($element: dxElementWrapper, offset?: ElementOffset): void {
    const scrollable = this.getScrollable();
    if (scrollable) {
      scrollable.scrollToElement($element, offset);
    }
  }

  public optionChanged(args: OptionChanged): void {
    super.optionChanged(args);

    switch (args.name) {
      case 'wordWrapEnabled':
      case 'showColumnLines':
      case 'showRowLines':
      case 'rowAlternationEnabled':
      case 'dataRowTemplate':
      case 'twoWayBindingEnabled':
        this._invalidate(true, true);
        args.handled = true;
        break;
      case 'scrolling':
        this._rowHeight = null;
        this._tableElement = null;
        args.handled = true;
        break;
      case 'rtlEnabled':
        this._rowHeight = null;
        this._tableElement = null;
        break;
      case 'loadPanel':
        this._tableElement = null;
        this._invalidate(true, args.fullName !== 'loadPanel.enabled');
        args.handled = true;
        break;
      case 'noDataText':
        this.renderNoDataText();
        args.handled = true;
        break;
      default:
        break;
    }
  }

  /**
   * @extended: column_fixing
   */
  public setAriaOwns(
    headerTableId: string | undefined,
    footerTableId: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFixed?: boolean,
  ): void {
    const $contentElement = this._findContentElement();
    const $tableElement = this.getTableElement();

    if ($tableElement?.length && $contentElement) {
      const tableId = $tableElement.attr('id') ?? '';
      const ownedIds = `${headerTableId ?? ''} ${tableId} ${footerTableId ?? ''}`.trim();

      this.setAria('owns', ownedIds, $contentElement);
    }
  }

  public dispose(): void {
    super.dispose();
    clearTimeout(this._hideLoadingTimeoutID);
    this._scrollable?.dispose();
  }

  /**
   * @extended: column_fixing
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setScrollerSpacing(vScrollbarWidth?: number, hScrollbarWidth?: number): void { }

  public getFixedContentElement(): dxElementWrapper | undefined {
    const fixedContentClass = this.addWidgetPrefix(COLUMN_FIXING_CLASSES.contentFixed);

    return this.element()?.children(`.${fixedContentClass}`);
  }

  /**
   * @extended: validating, virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _restoreErrorRow(contentTable?: dxElementWrapper): void { }

  public isElementInside($element: dxElementWrapper): boolean {
    const $viewElement = this.element();

    if (!$viewElement) {
      return false;
    }

    const $rowsViewElement = $element.closest(`.${this.addWidgetPrefix(VIEW_CLASSES.rowsView)}`);

    return $rowsViewElement.is($viewElement);
  }

  /**
   * @extended: TreeList's rowsView extender & selection
   */
  protected _renderIcons(
    $iconContainer: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: ViewCellOptions,
  ): dxElementWrapper {
    return $iconContainer;
  }

  public normalizeScrollLeft(scrollLeft: number): number {
    const scrollable = this.getScrollable();

    if (this.option('rtlEnabled') && scrollable) {
      return getWidth(scrollable.$content()) - getWidth(scrollable.$element()) - scrollLeft;
    }

    return scrollLeft;
  }
}

export const rowsModule = {
  defaultOptions(): RowsModuleOptions {
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
        showPane: true,
      },
      // @ts-expect-error dataRowTemplate is typed without null
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
