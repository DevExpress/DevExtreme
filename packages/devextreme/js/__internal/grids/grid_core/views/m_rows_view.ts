import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';
import messageLocalization from '@js/common/core/localization/message';
import type { LoadPanel } from '@js/common/grids';
import { data as elementData } from '@js/core/element_data';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { Callback } from '@js/core/utils/callbacks';
import { deferRender, deferUpdate } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
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
import { compileGetter } from '@ts/core/utils/m_data';
import { CLASSES as COLUMN_FIXING_CLASSES } from '@ts/grids/grid_core/column_fixing/const';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { Column, ColumnsChanges } from '@ts/grids/grid_core/columns_controller/types';
import type {
  ColumnsResizerViewController,
} from '@ts/grids/grid_core/columns_resizing_reordering/m_columns_resizing_reordering';
import type {
  DataChange, ProcessedItem, RowWatch,
} from '@ts/grids/grid_core/data_controller/types';
import { isSameItem } from '@ts/grids/grid_core/data_controller/utils/row_changes';
import { generateRowValues } from '@ts/grids/grid_core/data_controller/utils/row_values';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { FocusController } from '@ts/grids/grid_core/focus/m_focus';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { OptionChanged } from '@ts/grids/grid_core/types';
import type { ValidatingController } from '@ts/grids/grid_core/validating/m_validating';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';
import Scrollable from '@ts/ui/scroll_view/scrollable';
import type { ElementOffset } from '@ts/ui/scroll_view/types';

import { CLASSES as REORDERING_CLASSES } from '../columns_resizing_reordering/const';
import { isLocalStore } from '../data_source_adapter/utils/store';
import type { EditingController } from '../editing/m_editing';
import gridCoreUtils from '../m_utils';
import { CLASSES } from '../sticky_columns/const';
import { ColumnsView } from './columns_view';
import { CLASSES as VIEW_CLASSES } from './const';
import type {
  CellRenderOptions,
  ColumnRenderTemplate,
  ColumnTemplateSource,
  FocusStateParams,
  GroupCellOptions,
  GroupContinuationData,
  HintColumn,
  RowPreparedOptions,
  RowRenderOptions,
  RowsModuleOptions,
  RowsViewContentChange,
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
  getCellText, getMaxHorizontalScrollOffset, isRowElementVisible, isSameColumnLayout,
} from './utils';

const ROWS_VIEW_CLASS = 'rowsview';
const NOWRAP_CLASS = 'nowrap';
const FREE_SPACE_CLASS = 'dx-freespace-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const ROW_ALTERNATION_CLASS = 'dx-row-alt';
const LAST_ROW_BORDER = 'dx-last-row-border';
const EMPTY_CLASS = 'dx-empty';
const ROW_INSERTED_ANIMATION_CLASS = 'row-inserted-animation';
export const ROW_LINES_CLASS = 'dx-row-lines';

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

const getScrollableBottomPadding = function getScrollableBottomPadding(that: RowsView): number {
  const scrollable = that.getScrollable();
  return scrollable ? Math.ceil(parseFloat($(scrollable.content()).css('paddingBottom') ?? '')) : 0;
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
      if (this._scrollLeft >= 0 && !this._dataController.isLoading()) {
        this._handleScroll({
          // @ts-expect-error _scrollLeft >= 0 means the scrollable has scrolled
          component: this.getScrollable(),
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

  private _getDefaultGroupTemplate(column: Column): ColumnRenderTemplate<ViewCellOptions>['render'] {
    const summaryTexts = this.option('summary.texts');

    return function defaultGroupTemplate(
      $container: dxElementWrapper,
      options: ViewCellOptions,
    ): void {
      const { data } = options;
      let text = `${options.column.caption}: ${options.text}`;
      const container = $container.get(0);

      if (options.summaryItems?.length) {
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
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-chain
    let template: ColumnTemplateSource<ViewCellOptions>;

    if (isGroupRow(options)) {
      template = column.groupCellTemplate || {
        allowRenderToDetachedContainer: true,
        render: this._getDefaultGroupTemplate(column),
      };
    } else if ((options.rowType === 'data' || column.command) && column.cellTemplate) {
      // @ts-expect-error cellTemplate isn't typed yet
      template = column.cellTemplate;
    } else {
      template = { allowRenderToDetachedContainer: true, render: this._getDefaultTemplate(column) };
    }

    return template;
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
        $row.addClass(ROW_LINES_CLASS);
      }

      if (this.option('showColumnLines')) {
        $row.addClass(COLUMN_LINES_CLASS);
      }

      if (row.visible === false) {
        $row.hide();
      }

      if (isGroup) {
        $row.addClass(VIEW_CLASSES.groupRow);
        this.setAriaExpandedAttribute($row, row);
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
          $row.addClass(ROW_ALTERNATION_CLASS);
        }

        setWatcher({
          element: $row.get(0),
          watch: rowOptions.watch,
          getter: () => this._isAltRow(
            // The row needs to be obtained again because the current row is out of date.
            this._dataController.getRowByKey(row.key),
          ),
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

    super._rowPrepared($row, rowOptions, row);
  }

  private _setAriaRowIndex(row: RowPreparedOptions, $row: dxElementWrapper): void {
    if (!$row.is('tr')) {
      return;
    }

    const { component } = this;
    const isPagerMode = component.option('scrolling.mode') === 'standard' && !gridCoreUtils.isVirtualRowRendering(component);
    let rowIndex = Number(row.rowIndex) + 1;

    if (isPagerMode) {
      rowIndex = component.pageIndex() * component.pageSize() + rowIndex;
    } else {
      rowIndex += this._dataController.getRowIndexOffset();
    }
    this.setAria('rowindex', rowIndex, $row);
  }

  protected setAriaExpandedAttribute($row: dxElementWrapper, row: ViewRow): void {
    const description = row.isExpanded ? this.localize('dxDataGrid-ariaExpandedRow') : this.localize('dxDataGrid-ariaCollapsedRow');
    this.setAria('roledescription', description, $row);
  }

  /**
   * @extended: column_fixing
   */
  protected _afterRowPrepared(e: ActionEvent): void {
    // @ts-expect-error action args aren't typed yet
    const arg: RowPreparedEvent = e.args[0];
    const dataController = this._dataController;
    const row = dataController.getVisibleRows()[arg.rowIndex];
    const watch = this.option('integrationOptions.watchMethod');

    if (!arg.data || arg.rowType !== 'data' || arg.isNewRow || !this.option('twoWayBindingEnabled') || !watch || !row) return;

    const dispose = watch(
      () => generateRowValues(arg.data, arg.columns),
      () => {
        dataController.repaintRows([row.rowIndex], this.option('repaintChangesOnly'));
      },
      {
        // @ts-expect-error WatchOptions are typed without deep
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

      if (this.option('columnAutoWidth') || this._hasHeight || allColumnsHasWidth || this._columnsController._isColumnFixing()) {
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
    const isHorizontalScrollbarVisible = this.isScrollbarVisible(true);

    this._scrollTop = top;
    this._scrollLeft = rtlEnabled && !isHorizontalScrollbarVisible ? -1 : left;

    if (rtlEnabled) {
      const maxHorizontalScrollOffset = getMaxHorizontalScrollOffset(
        this._scrollableContainer?.get(0) as HTMLElement | undefined,
      );

      this._scrollRight = maxHorizontalScrollOffset - left;
    }

    const scrollLeft = rtlEnabled && isNativeScrolling ? -this._scrollRight : left;

    this.scrollChanged.fire({ ...e.scrollOffset, left: scrollLeft }, this.name);
  }

  private _renderScrollableCore($element: dxElementWrapper): void {
    const dxScrollableOptions = this._createScrollableOptions();
    const scrollHandler = this._handleScroll.bind(this);

    dxScrollableOptions.onScroll = scrollHandler;

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

      this._contentChanges = [];

      contentChanges.forEach(({
        newTableElement: $newTableElement,
        change: contentChange,
        isFixedTableRendering: isFixedTable,
      }) => {
        const tableElement = this.getTableElement(isFixedTable);
        // @ts-expect-error the view is rendered here
        const contentElement: dxElementWrapper = this._findContentElement(isFixedTable);
        const executors: (() => void)[] = [];
        const highlightChanges = this.option('highlightChanges');
        const rowInsertedClass = this.addWidgetPrefix(ROW_INSERTED_ANIMATION_CLASS);

        switch (contentChange?.changeType) {
          case 'update':
            each(contentChange.rowIndices, (index, rowIndex) => {
              const $newRowElement = this._getRowElements($newTableElement).eq(index);
              const dataChangeType = contentChange.changeTypes?.[index];
              const item = contentChange.items?.[index];

              executors.push(() => {
                // @ts-expect-error _getRowElements(null) reads the current table
                const $rowElements = this._getRowElements(tableElement);
                const $rowElement = $rowElements.eq(rowIndex);

                switch (dataChangeType) {
                  case 'update':
                    if (item) {
                      const columnIndices = contentChange.columnIndices?.[index];

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
                    if (highlightChanges && contentChange.isLiveUpdate) {
                      $newRowElement.addClass(rowInsertedClass);
                    }
                    break;
                  case 'remove':
                    $rowElement.remove();
                    break;
                  default:
                    break;
                }
              });
            });
            each(executors, function runExecutor(this: () => void) {
              this();
            });

            $newTableElement.remove();
            break;
          default:
            this.setTableElement($newTableElement, isFixedTable);
            contentElement.addClass(this.addWidgetPrefix(VIEW_CLASSES.content));
            this._setGridRole(contentElement);
            this._renderContent(contentElement, $newTableElement, isFixedTable);
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
      .toggleClass(COLUMN_LINES_CLASS, this.option('showColumnLines'));

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

  private _renderFreeSpaceRow($tableElement: dxElementWrapper, change?: ViewDataChange): void {
    let $freeSpaceRowElement = this._createEmptyRow(FREE_SPACE_CLASS);

    $freeSpaceRowElement = this._wrapRowIfNeed($tableElement, $freeSpaceRowElement, change?.changeType === 'refresh');

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

    const $rowElements = $table.children('tbody').children().not('.dx-virtual-row').not(`.${FREE_SPACE_CLASS}`);

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
    let $content = this.element();
    const scrollable = this.getScrollable();

    if ($content) {
      if (scrollable) {
        $content = $(scrollable.content());
      }
      return $content.children().first();
    }

    return undefined;
  }

  /**
   * @extended virtual_scrolling
   */
  public _getRowElements(tableElement?: dxElementWrapper): dxElementWrapper {
    const $rows = super._getRowElements(tableElement);

    return $rows?.not(`.${FREE_SPACE_CLASS}`);
  }

  public _getFreeSpaceRowElements($table?: dxElementWrapper): dxElementWrapper {
    const tableElements = $table || this.getTableElements();

    return tableElements && tableElements.children('tbody').children(`.${FREE_SPACE_CLASS}`);
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
    const columnIndex = (options.row.groupIndex || 0) + columnsCountBeforeGroups;

    return {
      columnIndex,
      colspan: options.columns.length - columnIndex - 1,
    };
  }

  protected _needWrapRow($tableElement: dxElementWrapper): boolean {
    return super._needWrapRow($tableElement) || !!this.option('dataRowTemplate');
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
    const { row } = options;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let expandColumn: Column;
    const { columns } = options;
    const { rowIndex } = row;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let isExpanded: boolean | null;
    const groupCellOptions = this._getGroupCellOptions(options);

    for (let i = 0; i <= groupCellOptions.columnIndex; i += 1) {
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

    this._renderFreeSpaceRow($table, options.change);
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
  protected _renderTable(options?: TableRenderOptions): dxElementWrapper {
    const $table = super._renderTable(options);
    const resizeCompletedHandler = (): void => {
      const scrollableInstance = this.getScrollable();
      // @ts-expect-error the view is rendered here
      if (scrollableInstance && this.element().closest(getWindow().document).length) {
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

    if (this.option().rowTemplate || this.option().dataRowTemplate) {
      $table.appendTo(this.component.$element());
    }

    return $table;
  }

  /**
   * @extended: column_fixing, editing, keyboard_navigation, row_dragging, search, selection,
   * virtual_column, virtual_scrolling
   */
  protected _renderCore(change?: DataChange): DeferredObj<unknown> {
    // @ts-expect-error the view is rendered here
    const $element: dxElementWrapper = this.element();

    $element.addClass(this.addWidgetPrefix(ROWS_VIEW_CLASS)).toggleClass(this.addWidgetPrefix(NOWRAP_CLASS), !this.option('wordWrapEnabled'));
    $element.toggleClass(EMPTY_CLASS, this._dataController.isEmpty());

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
    const { column } = options;
    const { row } = options;
    const { data }: { data?: RawItemData & GroupContinuationData } = row;
    const summaryCells = row?.summaryCells;
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
    parameters.text = getCellText(column, displayValue);
    parameters.rowIndex = row.rowIndex;
    parameters.summaryItems = summaryCells?.[options.columnIndex];
    parameters.resized = column.resizedCallbacks;

    if (isDefined(column.groupIndex) && !column.command) {
      const { grouping, scrolling } = this.option() as RowsViewOptions;
      if (scrolling?.mode !== 'virtual' && scrolling?.mode !== 'infinite') {
        parameters.groupContinuesMessage = data && data.isContinuationOnNextPage
          && grouping?.texts && grouping.texts.groupContinuesMessage;
        parameters.groupContinuedMessage = data && data.isContinuation
          && grouping?.texts && grouping.texts.groupContinuedMessage;
      }
    }

    return parameters;
  }

  protected _toggleDraggableSourceColumnClass(
    $rows: dxElementWrapper,
    visibleColumns: Column[],
    columnIndex: number,
    value: boolean,
  ): void {
    const columnsController = this._columnsController;
    const columns = columnsController.getColumns();
    const column = columns?.[columnIndex];
    const columnID = column && column.isBand && column.index;

    each($rows, (rowIndex, row) => {
      if ($(row).hasClass(VIEW_CLASSES.groupRow)) {
        return;
      }

      for (let i = 0; i < visibleColumns.length; i += 1) {
        if (
          (isNumeric(columnID)
            // @ts-expect-error visible columns have an index
            && columnsController.isParentBandColumn(visibleColumns[i].index, columnID))
          || visibleColumns[i].index === columnIndex
        ) {
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
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned below
    let cellOptions: ViewCellOptions | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let column: Column | undefined;

    if (rowOptions) {
      if (isString(columnIdentifier)) {
        column = this._columnsController.columnOption(columnIdentifier);
      } else {
        column = this._columnsController.getVisibleColumns()[columnIdentifier];
      }

      if (column) {
        // @ts-expect-error the public getCellOptions builds the options without a columnIndex
        cellOptions = this._getCellOptions({
          // @ts-expect-error createColumn initializes calculateCellValue
          value: column.calculateCellValue(rowOptions.data),
          rowIndex: rowOptions.rowIndex,
          row: rowOptions,
          column,
        });
      }
    }
    return cellOptions;
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
    const dataController = this._dataController;
    const itemCount = dataController.items(true).length;
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
        const freeSpaceRowCount = dataController.pageSize() - itemCount;
        const scrollingMode = this.option('scrolling.mode');

        if (freeSpaceRowCount > 0 && this.dataSourceController.pageCount() > 1 && scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
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
          const $tableElement = $table || this.getTableElements();
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
    // @ts-expect-error the version string is compared as a number
    const isChromeLatest = browser.chrome && browser.version >= 91;
    // @ts-expect-error the version string is compared as a number
    const hasExtraBorderTop = browser.mozilla && browser.version >= 70 && !this.option('showRowLines');
    return isZoomedWebkit || hasExtraBorderTop || isChromeLatest ? 1 : 0;
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    const { optionNames } = e;

    if (e.changeTypes.grouping) return;

    if (optionNames.width || optionNames.visibleWidth) {
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
    return ['isScrollbarVisible', 'getTopVisibleRowData', 'getScrollbarWidth', 'getCellElement', 'getRowElement', 'getScrollable'];
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
        scrollbarWidth += getScrollableBottomPadding(this); // T703649, T697699
      }
    }
    return scrollbarWidth > 0 ? scrollbarWidth : 0;
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
        // @ts-expect-error resizedCallbacks get the visibleWidth as is, not only numbers
        columns[i].resizedCallbacks?.fire(columnWidths[i]);
      }
    }

    this._lastColumnWidths = columnWidths;
  }

  private _updateLastRowBorder(isFreeSpaceRowVisible: boolean): void {
    if (this.option('showBorders') && !isFreeSpaceRowVisible) {
      // @ts-expect-error the view is rendered here
      this.element().addClass(LAST_ROW_BORDER);
    } else {
      // @ts-expect-error the view is rendered here
      this.element().removeClass(LAST_ROW_BORDER);
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
    // @ts-expect-error _updateScrollable calls it once the scrollable exists
    const scrollable: Scrollable = this.getScrollable();
    const scrollLeft = scrollable && scrollable.scrollOffset().left;
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
      // @ts-expect-error scrollTo() is typed without x and y
      scrollable.scrollTo({ x: this._scrollLeft });
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

  public scrollTo(location: ScrollPosition & { x?: number; y?: number }): void {
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
    if (arguments.length === 0) { return !!this._hasHeight; }

    this._hasHeight = hasHeight;

    return undefined;
  }

  /**
   * @extended: virtual_scrolling
   */
  public setLoading(isLoading: boolean, messageText?: string): void {
    let loadPanel = this._loadPanel;
    const dataController = this._dataController;
    const loadPanelOptions: LoadPanel & Pick<LoadPanelProperties, 'animation'> = this.option('loadPanel') ?? {};
    const animation = dataController.isLoaded() ? loadPanelOptions.animation : null;
    const $element = this.element();

    if (!hasWindow()) {
      return;
    }

    if (!loadPanel && messageText !== undefined && isLocalStore(this.dataSourceController.store()) && loadPanelOptions.enabled === 'auto' && $element) {
      this._renderLoadPanel($element, $element.parent());
      loadPanel = this._loadPanel;
    }
    if (loadPanel) {
      const visibilityOptions: LoadPanelProperties = {
        message: messageText || loadPanelOptions.text,
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
    let itemIndex = 0;
    let prevOffset = 0;
    let offset = 0;
    let viewportBoundary = this._scrollTop;
    const $contentElement = this._findContentElement();
    // @ts-expect-error rendered view; offset() is typed as possibly undefined
    const contentElementOffsetTop: number = $contentElement?.offset().top;
    const items = this._dataController.items();
    const tableElement = this.getTableElement();

    if (!items.length || !tableElement) {
      return itemIndex;
    }

    const rowElements = this._getRowElements(tableElement).filter(':visible');

    if (!isTop) {
      const height = getOuterHeight(this._hasHeight ? this.element() : getWindow());

      viewportBoundary += height;
    }

    for (itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      prevOffset = offset;
      const $rowElement = $(rowElements).eq(itemIndex);
      if ($rowElement.length) {
        // @ts-expect-error offset() is typed as possibly undefined
        const rowOffset: Coordinates = $rowElement.offset();
        offset = (isTop ? rowOffset.top : rowOffset.top + getOuterHeight($rowElement))
          - contentElementOffsetTop;

        if (offset > viewportBoundary) {
          if (itemIndex && (isFloor || viewportBoundary * 2 < Math.round(offset + prevOffset))) {
            itemIndex -= 1;
          }
          break;
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

  private getBottomVisibleItemIndex(isFloor?: boolean): number {
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
      case 'rowTemplate':
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
    // @ts-expect-error the view is rendered here
    const $contentElement: dxElementWrapper = this._findContentElement();
    const $tableElement = this.getTableElement();

    if ($tableElement?.length) {
      this.setAria('owns', `${headerTableId ?? ''} ${$tableElement.attr('id') ?? ''} ${footerTableId ?? ''}`.trim(), $contentElement);
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

  public getFixedContentElement(): dxElementWrapper {
    const fixedContentClass = this.addWidgetPrefix(COLUMN_FIXING_CLASSES.contentFixed);

    // @ts-expect-error the view is rendered here
    return this.element()?.children(`.${fixedContentClass}`);
  }

  /**
   * @extended: validating, virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _restoreErrorRow(contentTable?: dxElementWrapper): void { }

  public isElementInside($element: dxElementWrapper): boolean {
    const $rowsViewElement = $element.closest(`.${this.addWidgetPrefix(ROWS_VIEW_CLASS)}`);

    // @ts-expect-error the view is rendered here
    return $rowsViewElement.is(this.element());
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
