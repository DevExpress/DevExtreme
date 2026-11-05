/* eslint-disable max-classes-per-file */
// TODO Move DataGrid's summary methods to the DataGrid
// TODO Move virtual scrolling related methods to the virtual_scrolling
import { move } from '@js/common/core/animation/translator';
import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import messageLocalization from '@js/common/core/localization/message';
import type { ColumnFixing } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterWidth } from '@js/core/utils/size';
import { setWidth } from '@js/core/utils/style';
import { isDefined } from '@js/core/utils/type';
import type { ActionEvent } from '@ts/core/action';
import type { EngineEvent } from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataChange, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import { CLASSES as MASTER_DETAIL_CLASSES } from '@ts/grids/grid_core/master_detail/const';
import type { ValidatingEditorFactoryExtension } from '@ts/grids/grid_core/validating/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type {
  VirtualScrollingResizingController,
  VirtualScrollingRowsViewExtension,
} from '@ts/grids/grid_core/virtual_scrolling/types';
import Scrollable from '@ts/ui/scroll_view/scrollable';
import type { ElementOffset } from '@ts/ui/scroll_view/types';

import type { ColumnHeadersView } from '../column_headers/column_headers';
import type {
  ColumnsResizerViewController,
  DraggingHeaderViewController,
} from '../columns_resizing_reordering/columns_resizing_reordering';
import type {
  Coordinates,
  DraggingPointCreatedOptions,
  DraggingPointsOptions,
} from '../columns_resizing_reordering/types';
import type { ResizingController } from '../grid_view/grid_view';
import type { KeyboardNavigationController } from '../keyboard_navigation/keyboard_navigation';
import type { ColumnPoint, ModuleType, OptionChanged } from '../types';
import gridCoreUtils from '../utils';
import type { ColumnsView } from '../views/columns_view';
import { normalizeWidth } from '../views/columns_view';
import type { RowsView } from '../views/rows_view';
import type {
  CellRenderOptions,
  ColumnWidth,
  ColumnWidthsOptions,
  GroupCellOptions,
  HintColumn,
  RowRenderOptions,
  RowsViewScrollEvent,
  SummaryRowsViewExtension,
  TableRenderOptions,
  ViewCellOptions,
  ViewDataChange,
  ViewRow,
} from '../views/types';
import { CLASSES, COMMAND_TRANSPARENT } from './const';
import type {
  ColumnFixingColumnHeadersView,
  ColumnFixingColumnHeadersViewExtension,
  ColumnFixingColumnsViewExtension,
  ColumnFixingFooterView,
  ColumnFixingRowRenderOptions,
  ColumnFixingRowsView,
} from './types';
import {
  getTransparentColumnIndex,
  isColumnHeadersPanel,
  normalizeColumnIndicesByPoints,
  normalizeColumnWidths,
} from './utils';

const FIRST_CELL_CLASS = 'dx-first-cell';
const LAST_CELL_CLASS = 'dx-last-cell';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FIXED_COL_CLASS = 'dx-col-fixed';
const FIXED_COLUMNS_CLASS = 'dx-fixed-columns';
const POINTER_EVENTS_NONE_CLASS = 'dx-pointer-events-none';
const FIXED_COLUMN_ICON_CLASS = 'fix-column';
const FIXED_COLUMN_LEFT_ICON_CLASS = 'fix-column-left';
const FIXED_COLUMN_RIGHT_ICON_CLASS = 'fix-column-right';
const STICKY_COLUMN_ICON_CLASS = 'stick-column';
const UNFIXED_COLUMN_ICON_CLASS = 'unfix-column';

// The browser can report the scroll maximum up to ~1px away from the integer
// (content.clientHeight - container.clientHeight), so at the bottom scrollOffset.top
// can be 1px past the computed max. An elastic offset within this range is that
// rounding noise, not a real elastic scroll (always larger), so it is ignored.
const ELASTIC_SCROLL_TOLERANCE = 1;

// View
const baseFixedColumns = <T extends ModuleType<ColumnsView>>(
  Base: T,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- protected members
) => class BaseFixedColumnsExtender extends Base {
  public _isFixedTableRendering!: boolean;

  protected _isFixedColumns!: boolean;

  protected _fixedTableElement?: dxElementWrapper | null;

  public init(): void {
    super.init();
    this._isFixedTableRendering = false;
    this._isFixedColumns = false;
  }

  protected _createCol(column: Column): dxElementWrapper {
    return super._createCol(column).toggleClass(
      FIXED_COL_CLASS,
      this._isFixedTableRendering
        && (!!column.fixed || (!!column.command && column.command !== COMMAND_TRANSPARENT)),
    );
  }

  private _correctColumnIndicesForFixedColumns(
    fixedColumns: Column[],
    change: ViewDataChange | undefined,
  ): void {
    const columnIndicesArray = change?.columnIndices;
    if (!change || !columnIndicesArray?.length) {
      return;
    }

    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColspan: number = fixedColumns[transparentColumnIndex].colspan ?? 1;
    const transparentOffset = transparentColumnIndex + transparentColspan;
    const rowTypes = change?.items?.map(({ rowType }) => rowType);

    change.columnIndices = columnIndicesArray.map((columnIndices, idx) => {
      if (!columnIndices?.length) {
        return columnIndices;
      }

      const isGroupRow = rowTypes?.[idx] === 'group';

      if (isGroupRow) {
        return [...columnIndices];
      }

      return columnIndices.reduce<number[]>((result, colIdx) => {
        switch (true) {
          case colIdx < transparentColumnIndex:
            result.push(colIdx);
            break;
          case colIdx >= transparentOffset:
            result.push(colIdx - transparentColspan + 1);
            break;
          default:
            break;
        }

        return result;
      }, []);
    });
  }

  private _partialUpdateFixedTable(fixedColumns: Column[], rows: ProcessedItem[]): void {
    const fixedTableElement = this._fixedTableElement;

    if (!fixedTableElement) {
      return;
    }

    const $rows = this._getRowElementsCore(fixedTableElement);
    const $colgroup = fixedTableElement.children('colgroup');

    $colgroup.replaceWith(this._createColGroup(fixedColumns));

    for (let i = 0; i < rows.length; i += 1) {
      this._partialUpdateFixedRow($($rows[i]), fixedColumns, rows[i]);
    }
  }

  protected getFixedGroupCellOptions?(row: ViewRow, cellCount: number): GroupCellOptions;

  private _partialUpdateFixedRow(
    $row: dxElementWrapper,
    fixedColumns: Column[],
    row: ProcessedItem,
  ): void {
    const cellElements: NodeListOf<HTMLTableCellElement> = $row[0].childNodes;
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColumn = fixedColumns[transparentColumnIndex];
    const columnIndexOffset = this._columnsController.getColumnIndexOffset();
    let colIndex = columnIndexOffset + 1;
    let { colspan = 1 } = transparentColumn;

    if ($row.hasClass(MASTER_DETAIL_CLASSES.detailRow)) {
      cellElements[0].setAttribute('colspan', String(this._columnsController.getVisibleColumns()?.length));

      return;
    }

    const groupCellOptions = $row.hasClass(VIEW_CLASSES.groupRow)
      ? this.getFixedGroupCellOptions?.(row, cellElements.length)
      : undefined;

    if (groupCellOptions) {
      colspan = groupCellOptions.colspan;
    }

    for (let j = 0; j < cellElements.length; j += 1) {
      const needUpdateColspan = groupCellOptions
        ? j === (groupCellOptions.columnIndex + 1)
        : j === transparentColumnIndex;

      cellElements[j].setAttribute('aria-colindex', String(colIndex));

      if (needUpdateColspan) {
        cellElements[j].setAttribute('colspan', String(colspan));
        colIndex += colspan;
      } else {
        colIndex += 1;
      }
    }
  }

  protected _renderTable(options?: TableRenderOptions): dxElementWrapper {
    const fixedColumns = this.getFixedColumns();

    this._isFixedColumns = this.isFixedColumns();
    const $table = super._renderTable(options);

    if (this._isFixedColumns) {
      const change = options?.change;
      const items = change?.items;
      const $fixedDataRows = this._getRowElements(this._fixedTableElement);
      const isVirtualColumnsScrolling = !!change && 'virtualColumnsScrolling' in change
        && change.virtualColumnsScrolling;
      const needPartialUpdate = isVirtualColumnsScrolling
        && $fixedDataRows.length === items?.length;

      this._isFixedTableRendering = true;

      if (needPartialUpdate && items && this.option('scrolling.legacyMode') !== true) {
        this._partialUpdateFixedTable(fixedColumns, items);
        this._isFixedTableRendering = false;
      } else {
        const columnIndices = change?.columnIndices;

        this._correctColumnIndicesForFixedColumns(fixedColumns, change);

        const $fixedTable = this._createTable(fixedColumns);
        this._renderRows($fixedTable, extend({}, options, { columns: fixedColumns }));
        this._updateContent($fixedTable, change, true);

        if (change && columnIndices) {
          change.columnIndices = columnIndices;
        }

        this._isFixedTableRendering = false;
      }
    } else {
      this._fixedTableElement?.parent().remove();
      this._fixedTableElement = null;
    }

    return $table;
  }

  protected _renderRow($table: dxElementWrapper, options: RowRenderOptions): void {
    let { cells } = options.row;

    super._renderRow($table, options);

    if (this._isFixedTableRendering && cells?.length) {
      let fixedCorrection = 0;
      const fixedCells = options.row.cells ?? [];
      cells = cells.slice();
      options.row.cells = cells;

      for (let i = 0; i < fixedCells.length; i += 1) {
        const fixedCell = fixedCells[i];

        if (fixedCell.column && fixedCell.column.command === COMMAND_TRANSPARENT) {
          fixedCorrection = (fixedCell.column.colspan ?? 1) - 1;
        } else {
          cells[i + fixedCorrection] = fixedCell;
        }
      }
    }
  }

  protected _createCell(options: ViewCellOptions): dxElementWrapper {
    const { column } = options;
    const columnCommand = column && column.command;
    const { rowType } = options;
    const $cell = super._createCell(options);
    const needFixedColumns = this._isFixedTableRendering || rowType === 'filter';
    const fixedColumns = needFixedColumns ? this.getFixedColumns() : [];
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const prevFixedColumn = fixedColumns[transparentColumnIndex - 1];

    if (this._isFixedTableRendering) {
      if (columnCommand === COMMAND_TRANSPARENT) {
        $cell
          .addClass(POINTER_EVENTS_NONE_CLASS)
          .toggleClass(
            FIRST_CELL_CLASS,
            transparentColumnIndex === 0 || (prevFixedColumn && prevFixedColumn.command === 'expand'),
          )
          .toggleClass(
            LAST_CELL_CLASS,
            !!fixedColumns.length && transparentColumnIndex === (fixedColumns.length - 1),
          );

        if (rowType !== 'freeSpace') {
          gridCoreUtils.setEmptyText($cell);
        }
      }
    } else if (rowType === 'filter') {
      $cell.toggleClass(FIRST_CELL_CLASS, options.columnIndex === transparentColumnIndex);
    }

    const isRowAltStyle = this.option('rowAlternationEnabled') && options.isAltRow;
    const isSelectAllCell = this.option('selection.mode') === 'multiple' && options.columnIndex === 0 && options.rowType === 'header';
    // T823783, T852898, T865179, T875201, T1120812
    if (browser.mozilla && options.column.fixed && options.rowType !== 'group' && !isRowAltStyle && !isSelectAllCell) {
      $cell.addClass(FIXED_COL_CLASS);
    }

    return $cell;
  }

  protected _wrapTableInScrollContainer(
    $table: dxElementWrapper,
    isFixedTableRendering?: boolean,
  ): dxElementWrapper {
    const $scrollContainer = super._wrapTableInScrollContainer($table, isFixedTableRendering);

    if (this._isFixedTableRendering || isFixedTableRendering) {
      $scrollContainer.addClass(this.addWidgetPrefix(CLASSES.contentFixed));
    }

    return $scrollContainer;
  }

  protected isEmptyGroupCell?(options: ViewCellOptions): boolean;

  protected _renderCellContent(
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    const { column }: { column: HintColumn } = options;
    const isFixedTableRendering = this._isFixedTableRendering;
    const isGroupCell = options.rowType === 'group' && isDefined(column.groupIndex);

    // T747718, T824508, T821252
    if (isFixedTableRendering && isGroupCell && !column.command && !column.groupCellTemplate) {
      $cell.css('pointerEvents', 'none');
    }

    if (!isFixedTableRendering && this._isFixedColumns) {
      const isEmptyCell = isGroupCell
        ? this.isEmptyGroupCell?.(options)
        : !!column.fixed || (!!column.command && column.fixed !== false);

      if (isEmptyCell) {
        if ((column.command && column.type !== 'buttons') || options.rowType === 'group') {
          $cell
            .html('&nbsp;')
            .addClass(column.cssClass ?? '');
          return;
        }
        $cell.addClass('dx-hidden-cell');
      }
    }

    if (column.command !== COMMAND_TRANSPARENT) {
      super._renderCellContent($cell, options, renderOptions);
    }
  }

  public getContent(isFixedTableRendering?: boolean): dxElementWrapper | undefined {
    return isFixedTableRendering
      ? this._fixedTableElement?.parent()
      : super.getContent(isFixedTableRendering);
  }

  public _getCellElementsCore(rowIndex: number): dxElementWrapper | undefined {
    const cellElements = super._getCellElementsCore(rowIndex);

    const isGroupRow = cellElements?.parent().hasClass(VIEW_CLASSES.groupRow);
    const headerRowIndex = this.name === 'columnHeadersView' ? rowIndex : undefined; // TODO

    if (this._fixedTableElement && cellElements) {
      const fixedColumns = this.getFixedColumns(headerRowIndex);
      const fixedCellElements = this._getRowElements(this._fixedTableElement).eq(rowIndex).children('td');

      each(fixedCellElements, (columnIndex, cell) => {
        if (isGroupRow) {
          if (cellElements[columnIndex] && (cell as HTMLElement).style.visibility !== 'hidden') {
            cellElements[columnIndex] = cell;
          }

          return;
        }

        const fixedColumn = fixedColumns[columnIndex];

        if (!fixedColumn) {
          return;
        }

        if (fixedColumn.command === COMMAND_TRANSPARENT) {
          if (fixedCellElements.eq(columnIndex).hasClass(MASTER_DETAIL_CLASSES.detailCell)) {
            cellElements[columnIndex] = cell || cellElements[columnIndex];
          }
        } else {
          const fixedColumnIndex = this._columnsController.getVisibleIndexByColumn(
            fixedColumn,
            headerRowIndex,
          );
          cellElements[fixedColumnIndex] = cell || cellElements[fixedColumnIndex];
        }
      });
    }

    return cellElements;
  }

  public getColumnWidths(fixedTableElement?: dxElementWrapper, rowIndex?: number): number[] {
    const result = super.getColumnWidths(fixedTableElement, rowIndex);
    const fixedColumns = this.getFixedColumns();
    const fixedWidths = this._fixedTableElement && result.length
      ? super.getColumnWidths(this._fixedTableElement)
      : undefined;

    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  }

  public getTableElement(isFixedTableRendering?: boolean): dxElementWrapper | null | undefined {
    const isFixedTable = this._isFixedTableRendering || isFixedTableRendering;

    return isFixedTable ? this._fixedTableElement : super.getTableElement();
  }

  public setTableElement(
    tableElement: dxElementWrapper | null | undefined,
    isFixedTableRendering?: boolean,
  ): void {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      this._fixedTableElement = tableElement?.addClass(POINTER_EVENTS_NONE_CLASS);
    } else {
      super.setTableElement(tableElement);
    }
  }

  public getColumns(rowIndex?: number | null): Column[] {
    const $tableElement = this.getTableElement();

    if (this._isFixedTableRendering) {
      return this.getFixedColumns(rowIndex);
    }

    return super.getColumns(rowIndex, $tableElement);
  }

  public getRowIndex($row: Element | dxElementWrapper): number {
    const $fixedTable = this._fixedTableElement;

    if ($fixedTable?.find($row).length) {
      return this._getRowElements($fixedTable).index($row);
    }

    return super.getRowIndex($row);
  }

  public getTableElements(): dxElementWrapper {
    const result = super.getTableElements();

    if (this._fixedTableElement) {
      return $([result.get(0), this._fixedTableElement.get(0)]);
    }

    return result;
  }

  public getFixedColumns(rowIndex?: number | null): Column[] {
    return this._columnsController.getFixedColumns(rowIndex);
  }

  protected getFixedColumnsOffset(): { left: number; right: number } {
    const $transparentColumn = this.getTransparentColumnElement();
    const positionTransparentColumn = $transparentColumn?.position();

    if (!$transparentColumn || !positionTransparentColumn) {
      return { left: 0, right: 0 };
    }

    return {
      left: positionTransparentColumn.left,
      right: Number(getOuterWidth(this.element(), true))
        - (Number(getOuterWidth($transparentColumn, true)) + positionTransparentColumn.left),
    };
  }

  public getTransparentColumnElement(): dxElementWrapper | null | undefined {
    return this._fixedTableElement?.find(`.${POINTER_EVENTS_NONE_CLASS}`).first();
  }

  public getFixedTableElement(): dxElementWrapper | null | undefined {
    return this._fixedTableElement;
  }

  protected _resizeCore(): void {
    super._resizeCore();
    this.synchronizeRows();
  }

  protected setColumnWidths(options: ColumnWidthsOptions): void {
    const { widths } = options;

    const visibleColumns = this._columnsController.getVisibleColumns();
    const isColumnWidthsSynced = !!widths?.length
      && visibleColumns.some((column) => isDefined(column.visibleWidth));
    const isColumnWidthChanged = options.optionNames?.width;

    super.setColumnWidths(options);

    if (this._fixedTableElement) {
      const hasAutoWidth = widths?.some((width) => width === 'auto' || !isDefined(width));
      // if order of calling isScrollbarVisible changed, performance tests will fail
      const needVisibleColumns = hasAutoWidth
        && (!isColumnWidthsSynced || !this.isScrollbarVisible(true));
      const columns = needVisibleColumns ? visibleColumns : this.getFixedColumns();

      this.setFixedTableColumnWidths(columns, widths);
    }

    const wordWrapEnabled = this.option('wordWrapEnabled');
    const needSynchronizeRows = isColumnWidthsSynced || (isColumnWidthChanged && wordWrapEnabled);

    if (needSynchronizeRows) {
      this.synchronizeRows();
    }
  }

  private setFixedTableColumnWidths(columns: Column[], widths?: ColumnWidth[]): void {
    if (!this._fixedTableElement || !widths) {
      return;
    }

    const $cols = this._fixedTableElement.children('colgroup').children('col');
    $cols.toArray().forEach((col) => col.removeAttribute('style'));

    let columnIndex = 0;

    columns.forEach((column) => {
      if (column.colspan) {
        columnIndex += column.colspan;
        return;
      }

      const colWidth = normalizeWidth(widths[columnIndex]);

      if (isDefined(colWidth)) {
        setWidth($cols.eq(columnIndex), colWidth);
      }

      columnIndex += 1;
    });
  }

  private _getClientHeight(element: Element): number {
    const boundingClientRect: DOMRect | undefined = getBoundingRect(element);

    return boundingClientRect?.height ?? element.clientHeight;
  }

  private synchronizeRows(): void {
    const rowHeights: number[] = [];
    const fixedRowHeights: number[] = [];

    this.waitAsyncTemplates(true).done(() => {
      if (!this._isFixedColumns || !this._tableElement || !this._fixedTableElement) {
        return;
      }

      const heightTable = this._getClientHeight(this._tableElement.get(0));
      const heightFixedTable = this._getClientHeight(this._fixedTableElement.get(0));
      const $rowElements = this._getRowElements(this._tableElement);
      const $fixedRowElements = this._getRowElements(this._fixedTableElement);
      const $contentElement = this._findContentElement();

      if (heightTable === heightFixedTable) {
        return;
      }

      $contentElement?.css('height', heightTable);
      $rowElements.css('height', '');
      $fixedRowElements.css('height', '');

      for (let rowIndex = 0; rowIndex < $rowElements.length; rowIndex += 1) {
        rowHeights.push(this._getClientHeight($rowElements.get(rowIndex)));
        fixedRowHeights.push(this._getClientHeight($fixedRowElements.get(rowIndex)));
      }

      for (let rowIndex = 0; rowIndex < $rowElements.length; rowIndex += 1) {
        const rowHeight = rowHeights[rowIndex];
        const fixedRowHeight = fixedRowHeights[rowIndex];

        if (rowHeight > fixedRowHeight) {
          $fixedRowElements.eq(rowIndex).css('height', rowHeight);
        } else if (rowHeight < fixedRowHeight) {
          $rowElements.eq(rowIndex).css('height', fixedRowHeight);
        }
      }

      $contentElement?.css('height', '');
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setScrollerSpacing(width: number, hWidth?: number): void {
    const rtlEnabled = this.option('rtlEnabled');

    super.setScrollerSpacing(width);
    this.element()?.children(`.${this.addWidgetPrefix(CLASSES.contentFixed)}`).css({
      paddingLeft: rtlEnabled ? width : '',
      paddingRight: !rtlEnabled ? width : '',
    });
  }

  public isFixedColumns(): boolean {
    const fixedColumns = this.getFixedColumns();
    const legacyMode = this.option('columnFixing.legacyMode');

    return legacyMode === true && !!fixedColumns.length;
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<
  ColumnHeadersView & ColumnFixingColumnHeadersViewExtension
> => class ColumnHeadersViewFixedColumnsExtender extends baseFixedColumns(Base) {
  public getFixedColumnElements(rowIndex?: number): dxElementWrapper | null | undefined {
    if (!this._isFixedColumns) {
      return undefined;
    }

    if (isDefined(rowIndex)) {
      return this._fixedTableElement
        && this._getRowElements(this._fixedTableElement).eq(rowIndex).children();
    }

    const columnElements = this.getColumnElements();
    const $transparentColumnElement = this.getTransparentColumnElement();

    if (columnElements && $transparentColumnElement?.length) {
      const transparentColumnIndex = getTransparentColumnIndex(this.getFixedColumns());
      const transparentCell = $transparentColumnElement.get(0) as HTMLTableCellElement;
      const elements = columnElements.toArray();

      elements.splice(transparentColumnIndex, transparentCell.colSpan, transparentCell);

      return $(elements);
    }

    return columnElements;
  }

  public getColumnWidths(fixedTableElement?: dxElementWrapper, rowIndex?: number): number[] {
    const result = super.getColumnWidths(fixedTableElement, rowIndex);
    const $fixedColumnElements = this.getFixedColumnElements();
    const fixedColumns = this.getFixedColumns();

    if (!this._fixedTableElement) {
      return normalizeColumnWidths(fixedColumns, result, undefined);
    }

    const fixedWidths = $fixedColumnElements?.length
      ? this._getWidths($fixedColumnElements)
      : super.getColumnWidths(this._fixedTableElement);

    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  }
};

const rowsView = (
  Base: ModuleType<RowsView & SummaryRowsViewExtension & VirtualScrollingRowsViewExtension>,
): ModuleType<
  ColumnFixingRowsView
> => class RowsViewFixedColumnsExtender extends baseFixedColumns(Base) {
  protected _fixedScrollTimeout?: ReturnType<typeof setTimeout>;

  private _resizingController!: VirtualScrollingResizingController;

  public init(): void {
    super.init();
    this._resizingController = this.getController('resizing') as VirtualScrollingResizingController;
  }

  public dispose(): void {
    super.dispose();
    clearTimeout(this._fixedScrollTimeout);
  }

  public optionChanged(args: OptionChanged): void {
    super.optionChanged(args);

    if (args.name === 'hoverStateEnabled' && this._isFixedColumns) {
      if (args.value) {
        this._attachHoverEvents();
      } else {
        this._detachHoverEvents();
      }
    }
  }

  private _detachHoverEvents(): void {
    const element = this.element();

    if (this._fixedTableElement && this._tableElement) {
      eventsEngine.off(element, 'mouseover mouseout', `.${VIEW_CLASSES.dataRow}`);
    }
  }

  private _attachHoverEvents(): void {
    if (this._fixedTableElement && this._tableElement) {
      eventsEngine.on(this.element(), 'mouseover mouseout', `.${VIEW_CLASSES.dataRow}`, this.createAction((args) => {
        const { event } = args;
        const rowIndex = this.getRowIndex($(event.target).closest(`.${VIEW_CLASSES.row}`));
        const isHover = event.type === 'mouseover';

        if (rowIndex >= 0) {
          if (this._tableElement) {
            this._getRowElements(this._tableElement)
              .eq(rowIndex)
              .toggleClass(HOVER_STATE_CLASS, isHover);
          }

          if (this._fixedTableElement) {
            this._getRowElements(this._fixedTableElement)
              .eq(rowIndex)
              .toggleClass(HOVER_STATE_CLASS, isHover);
          }
        }
      }));
    }
  }

  private _getScrollDelay(): number | undefined {
    const hasResizeTimeout = this._resizingController?.hasResizeTimeout();

    if (hasResizeTimeout) {
      return this.option('scrolling.updateTimeout');
    }

    return browser.mozilla ? 60 : 0;
  }

  public _findContentElement(isFixedTableRendering?: boolean): dxElementWrapper | undefined {
    const contentClass = this.addWidgetPrefix(VIEW_CLASSES.content);
    const element = this.element();
    const isTableRendering = this._isFixedTableRendering || isFixedTableRendering;

    if (element && isTableRendering) {
      let $content = element.children(`.${contentClass}`);
      const scrollable = this.getScrollable();

      if (!$content.length && scrollable) {
        $content = $('<div>').addClass(contentClass);

        eventsEngine.on($content, 'scroll', (e) => {
          const { target } = e;
          const scrollDelay = this._getScrollDelay();

          clearTimeout(this._fixedScrollTimeout);
          this._fixedScrollTimeout = setTimeout(() => {
            scrollable.scrollTo({ top: (target as Element).scrollTop });
          }, scrollDelay);
        });
        eventsEngine.on($content, wheelEventName, (e: EngineEvent & { delta: number }) => {
          const $nearestScrollable = $(e.target).closest('.dx-scrollable');
          let shouldScroll = false;

          if (scrollable?.$element().is($nearestScrollable)) {
            shouldScroll = true;
          } else {
            const nearestScrollableInstance = $nearestScrollable.length
              ? Scrollable.getInstance<Scrollable | undefined>($nearestScrollable.get(0))
              : undefined;

            if (nearestScrollableInstance) {
              const hasVerticalScrollbar = nearestScrollableInstance.scrollHeight()
                - nearestScrollableInstance.clientHeight() > 0;

              shouldScroll = !hasVerticalScrollbar;
            }
          }

          if (shouldScroll) {
            const scrollTop = scrollable.scrollTop();

            scrollable.scrollTo({ top: scrollTop - e.delta });

            const scrollableTop = scrollable.scrollTop() + scrollable.clientHeight();
            const scrollableHeight = scrollable.scrollHeight() + this.getScrollbarWidth();
            const isPreventDefault = scrollable.scrollTop() > 0 && scrollableTop < scrollableHeight;

            if (isPreventDefault) {
              return false;
            }
          }
          return undefined;
        });

        $content.appendTo(element);
      }

      return $content;
    }

    return super._findContentElement();
  }

  protected _updateScrollable(): void {
    super._updateScrollable();

    const scrollable = this.getScrollable();

    if (scrollable?._disposed) {
      return;
    }

    const scrollTop = scrollable?.scrollOffset().top;

    this._updateFixedTablePosition(scrollTop);
  }

  protected _renderContent(
    contentElement: dxElementWrapper,
    tableElement: dxElementWrapper,
    isFixedTableRendering?: boolean,
  ): dxElementWrapper | undefined {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      return contentElement
        .empty()
        .addClass(`${this.addWidgetPrefix(VIEW_CLASSES.content)} ${this.addWidgetPrefix(CLASSES.contentFixed)}`)
        .append(tableElement);
    }

    return super._renderContent(contentElement, tableElement);
  }

  protected _getGroupCellOptions(options: RowRenderOptions): GroupCellOptions {
    if (this._isFixedTableRendering) {
      return super._getGroupCellOptions(extend({}, options, {
        columns: this._columnsController.getVisibleColumns(),
      }));
    }

    return super._getGroupCellOptions(options);
  }

  protected _renderGroupedCells($row: dxElementWrapper, options: RowRenderOptions): void {
    return super._renderGroupedCells($row, extend({}, options, {
      columns: this._columnsController.getVisibleColumns(),
    }));
  }

  protected override getFixedGroupCellOptions(row: ViewRow, cellCount: number): GroupCellOptions {
    const columns = this._columnsController.getVisibleColumns();
    const { columnIndex, colspan } = this._getGroupCellOptions({ row, columns });

    if (row.summaryCells?.length) {
      const summaryOptions: ColumnFixingRowRenderOptions = { columns, row, isFixed: true };
      const alignByColumnCellCount = this.getAlignByColumnCellCount(colspan, summaryOptions);

      return { columnIndex, colspan: colspan - alignByColumnCellCount };
    }

    return { columnIndex, colspan: colspan - Math.max(0, cellCount - (columnIndex + 2)) };
  }

  protected override isEmptyGroupCell(options: ViewCellOptions): boolean {
    const { row, column } = options;

    if (!row?.summaryCells?.length) {
      return false;
    }

    const columns = this._columnsController.getVisibleColumns();
    const summaryOptions: ColumnFixingRowRenderOptions = { columns, row, isFixed: true };
    const alignByFixedColumnCellCount = this.getAlignByColumnCellCount(
      column.colspan ?? 1,
      summaryOptions,
    );

    if (alignByFixedColumnCellCount > 0) {
      const transparentColumnIndex = getTransparentColumnIndex(
        this._columnsController.getFixedColumns(),
      );

      return (columns.length - alignByFixedColumnCellCount) < transparentColumnIndex;
    }

    return false;
  }

  public override renderGroupSummaryCells($row: dxElementWrapper, options: RowRenderOptions): void {
    if (this._isFixedTableRendering) {
      super.renderGroupSummaryCells($row, extend({}, options, {
        columns: this._columnsController.getVisibleColumns(),
      }));
    } else {
      super.renderGroupSummaryCells($row, options);
    }
  }

  public override hasAlignByColumnSummaryItems(
    columnIndex: number,
    options: ColumnFixingRowRenderOptions,
  ): boolean {
    const result = super.hasAlignByColumnSummaryItems(columnIndex, options);
    const column = options.columns[columnIndex];

    if (options.isFixed) {
      return !!column.fixed && (result || column.fixedPosition === 'right');
    }

    return result && (!this._isFixedColumns || !column.fixed);
  }

  public override renderGroupSummaryCellsCore(
    $groupCell: dxElementWrapper,
    options: ColumnFixingRowRenderOptions,
    groupCellColSpan: number,
    alignByColumnCellCount: number,
  ): void {
    if (!this._isFixedTableRendering) {
      super.renderGroupSummaryCellsCore(
        $groupCell,
        options,
        groupCellColSpan,
        alignByColumnCellCount,
      );
      return;
    }

    options.isFixed = true;
    let alignByFixedColumnCellCount = this.getAlignByColumnCellCount(groupCellColSpan, options);
    options.isFixed = false;

    const startColumnIndex = options.columns.length - alignByFixedColumnCellCount;
    const fixedOptions = extend({}, options, { columns: this.getFixedColumns() });
    const transparentColumnIndex = getTransparentColumnIndex(fixedOptions.columns);
    let fixedGroupCellColSpan = groupCellColSpan;

    if (startColumnIndex < transparentColumnIndex) {
      const transparentColumn = fixedOptions.columns[transparentColumnIndex];
      const colspanCorrection = ((transparentColumn.colspan ?? 1) - 1) || 0;

      alignByFixedColumnCellCount -= colspanCorrection;
      fixedGroupCellColSpan -= colspanCorrection;
    } else if (alignByColumnCellCount > 0) {
      $groupCell.css('visibility', 'hidden');
    }

    super.renderGroupSummaryCellsCore(
      $groupCell,
      fixedOptions,
      fixedGroupCellColSpan,
      alignByFixedColumnCellCount,
    );
  }

  public override getSummaryCellIndex(columnIndex: number, columns: Column[]): number {
    if (this._isFixedTableRendering) {
      const transparentColumnIndex = getTransparentColumnIndex(columns);

      if (columnIndex > transparentColumnIndex) {
        return columnIndex + ((columns[transparentColumnIndex].colspan ?? 1) - 1);
      }

      return columnIndex;
    }

    return super.getSummaryCellIndex(columnIndex, columns);
  }

  protected _renderCore(change?: DataChange): DeferredObj<unknown> {
    this._detachHoverEvents();

    const deferred = super._renderCore(change);

    const isFixedColumns = this._isFixedColumns;

    this.element()?.toggleClass(FIXED_COLUMNS_CLASS, isFixedColumns);

    if (this.option('hoverStateEnabled') && isFixedColumns) {
      this._attachHoverEvents();
    }

    return deferred;
  }

  public setAriaOwns(
    headerTableId: string | undefined,
    footerTableId: string | undefined,
    isFixed?: boolean,
  ): void {
    if (isFixed) {
      const contentFixedClass = this.addWidgetPrefix(CLASSES.contentFixed);
      const $contentFixedElement = this.element()?.children(`.${contentFixedClass}`);
      const $fixedTableElement = this.getFixedTableElement();

      if ($contentFixedElement?.length && $fixedTableElement?.length) {
        this.setAria('owns', `${headerTableId ?? ''} ${$fixedTableElement.attr('id') ?? ''} ${footerTableId ?? ''}`.trim(), $contentFixedElement);
      }
    } else {
      super.setAriaOwns(headerTableId, footerTableId, isFixed);
    }
  }

  public toggleDraggableColumnClass(columnIndex: number, value: boolean): void {
    super.toggleDraggableColumnClass(columnIndex, value);

    if (this.isFixedColumns()) {
      const $rows = this._getRowElements(this._fixedTableElement);
      this._toggleDraggableSourceColumnClass($rows, this.getFixedColumns(), columnIndex, value);
    }
  }

  public getCellIndex($cell: dxElementWrapper, rowIndex?: number): number {
    const $fixedTable = this._fixedTableElement;
    let cellIndex = 0;

    if ($fixedTable && $cell.is('td') && $cell.closest($fixedTable).length) {
      const columns = this.getFixedColumns();

      each(columns, (index, column) => {
        if (index === $cell[0].cellIndex) {
          return false;
        }

        if (column.colspan) {
          cellIndex += column.colspan;
          return undefined;
        }

        cellIndex += 1;
        return undefined;
      });

      return cellIndex;
    }

    return super.getCellIndex($cell, rowIndex);
  }

  private _updateFixedTablePosition(scrollTop: number | undefined, needFocus?: boolean): void {
    if (this._fixedTableElement && this._tableElement) {
      const fixedContent = this._fixedTableElement.parent().get(0);

      if (fixedContent && scrollTop !== undefined) {
        fixedContent.scrollTop = scrollTop;
      }

      if (needFocus && this._editorFactoryController) {
        const $focusedElement = this._editorFactoryController.focus();

        if ($focusedElement) {
          this._editorFactoryController.focus($focusedElement);
        }
      }
    }
  }

  public setScrollerSpacing(vWidth: number, hWidth: number): void {
    const styles: Record<string, number> = { marginBottom: 0 };
    const $fixedContent = this.element()?.children(`.${this.addWidgetPrefix(CLASSES.contentFixed)}`);

    if ($fixedContent?.length && this._fixedTableElement) {
      $fixedContent.css(styles);
      this._fixedTableElement.css(styles);

      styles[this.option('rtlEnabled') ? 'marginLeft' : 'marginRight'] = vWidth;
      styles.marginBottom = hWidth;

      const useNativeScrolling = this._scrollable?.option('useNative');
      (useNativeScrolling ? $fixedContent : this._fixedTableElement).css(styles);
    }
  }

  private _getElasticScrollTop(e: RowsViewScrollEvent): number {
    let elasticScrollTop = 0;

    if (e.scrollOffset.top < 0) {
      elasticScrollTop = -e.scrollOffset.top;
    } else if (e.reachedBottom) {
      const $scrollableContent = $(e.component.content());
      const $scrollableContainer = $(e.component.container());
      const maxScrollTop = Math.max(
        $scrollableContent.get(0).clientHeight - $scrollableContainer.get(0).clientHeight,
        0,
      );

      elasticScrollTop = Math.min(maxScrollTop - e.scrollOffset.top, 0);
    }

    return Math.floor(elasticScrollTop);
  }

  private _applyElasticScrolling(e: RowsViewScrollEvent): void {
    if (this._fixedTableElement) {
      const elasticScrollTop = this._getElasticScrollTop(e);

      if (Math.abs(elasticScrollTop) > ELASTIC_SCROLL_TOLERANCE) {
        move(this._fixedTableElement, { top: elasticScrollTop });
      } else {
        this._fixedTableElement.css('transform', '');
      }
    }
  }

  protected _handleScroll(e: RowsViewScrollEvent): void {
    this._updateFixedTablePosition(e.scrollOffset.top, true);
    this._applyElasticScrolling(e);
    super._handleScroll(e);
  }

  public _updateContentPosition(isRender?: boolean): void {
    super._updateContentPosition(isRender);
    if (!isRender) {
      this._updateFixedTablePosition(this._scrollTop);
    }
  }

  protected _afterRowPrepared(e: ActionEvent): void {
    if (this._isFixedTableRendering) return;
    super._afterRowPrepared(e);
  }

  public _scrollToElement($element: dxElementWrapper, offset?: ElementOffset): void {
    const scrollOffset = this.isFixedColumns() ? this.getFixedColumnsOffset() : offset;

    super._scrollToElement($element, scrollOffset);
  }
};

// TODO Move this view to the DataGrid
const footerView = <T extends ModuleType<ColumnsView>>(
  Base: T,
): T & ModuleType<
  ColumnsView & ColumnFixingColumnsViewExtension
> => class FooterViewFixedColumnsExtender extends baseFixedColumns(Base) {};

const draggingHeader = (
  Base: ModuleType<DraggingHeaderViewController>,
): ModuleType<DraggingHeaderViewController> => class DraggingHeaderColumnFixingExtender
  extends Base {
  protected declare _columnHeadersView: ColumnFixingColumnHeadersView;

  public _generatePointsByColumns(
    options: DraggingPointsOptions,
    needToCheckPrevPoint?: boolean,
  ): ColumnPoint[] {
    const visibleColumns = options.columns;
    const { targetDraggingPanel } = options;

    if (
      targetDraggingPanel
      && isColumnHeadersPanel(targetDraggingPanel)
      && targetDraggingPanel.isFixedColumns()
    ) {
      if (options.sourceColumn.fixed) {
        if (!options.rowIndex) {
          const fixedColumnElements = targetDraggingPanel.getFixedColumnElements(0);

          options.columnElements = fixedColumnElements ?? $();
        }
        options.columns = targetDraggingPanel.getFixedColumns(options.rowIndex);

        const pointsByColumns = super._generatePointsByColumns(options, needToCheckPrevPoint);
        normalizeColumnIndicesByPoints(visibleColumns, options.columns, pointsByColumns);
        return pointsByColumns;
      }
    }

    return super._generatePointsByColumns(options, needToCheckPrevPoint);
  }

  protected _pointCreated({
    point, columns, location, sourceColumn, cells,
  }: DraggingPointCreatedOptions): boolean {
    const result = super._pointCreated({
      point, columns, location, sourceColumn, cells,
    });
    const targetColumn = columns[point.columnIndex];
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();

    if (!result && location === 'headers' && $transparentColumn?.length) {
      const boundingRect = getBoundingRect($transparentColumn.get(0));

      if (sourceColumn && sourceColumn.fixed) {
        return sourceColumn.fixedPosition === 'right' ? point.x < boundingRect.right : point.x > boundingRect.left;
      }
      if (targetColumn && targetColumn.fixed && targetColumn.fixedPosition !== 'right') {
        return true;
      }

      return point.x < boundingRect.left || point.x > boundingRect.right;
    }

    return result;
  }
};

const columnsResizer = (
  Base: ModuleType<ColumnsResizerViewController>,
): ModuleType<ColumnsResizerViewController> => class ColumnResizerColumnFixingExtender
  extends Base {
  protected declare _columnHeadersView: ColumnFixingColumnHeadersView;

  private _pointsByFixedColumns?: ColumnPoint[];

  protected _generatePointsByColumns(needToCheckPrevPoint?: boolean): void {
    const columns = this._columnsController.getVisibleColumns();
    const fixedColumns = this._columnsController.getFixedColumns();
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const correctIndex = columns.length - fixedColumns.length;
    const cells = this._columnHeadersView.getFixedColumnElements();

    super._generatePointsByColumns(needToCheckPrevPoint);

    if (cells && cells.length > 0) {
      this._pointsByFixedColumns = gridCoreUtils.getPointsByColumns(cells, (point) => {
        if (point.index > transparentColumnIndex) {
          point.columnIndex += correctIndex;
          point.index += correctIndex;
        }

        return this._pointCreated(point, columns);
      });
    }
  }

  protected _getTargetPoint(
    pointsByColumns: ColumnPoint[] | null | undefined,
    currentPoint: Coordinates,
    deltaX: number,
  ): ColumnPoint | null {
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();

    if ($transparentColumn?.length) {
      const boundingRect = getBoundingRect($transparentColumn.get(0));

      if (currentPoint.x <= boundingRect.left || currentPoint.x >= boundingRect.right) {
        return super._getTargetPoint(this._pointsByFixedColumns, currentPoint, deltaX);
      }
    }

    return super._getTargetPoint(pointsByColumns, currentPoint, deltaX);
  }
};

const resizing = (
  Base: ModuleType<ResizingController>,
): ModuleType<ResizingController> => class ResizingColumnFixingExtender extends Base {
  protected declare _columnHeadersView: ColumnFixingColumnHeadersView;

  protected declare _footerView: ColumnFixingFooterView;

  protected _setAriaOwns(): void {
    super._setAriaOwns();

    const headerFixedTable = this._columnHeadersView?.getFixedTableElement();
    const footerFixedTable = this._footerView?.getFixedTableElement();
    this._rowsView?.setAriaOwns(headerFixedTable?.attr('id'), footerFixedTable?.attr('id'), true);
  }
};

const keyboardNavigation = (
  Base: ModuleType<KeyboardNavigationController>,
): ModuleType<KeyboardNavigationController> => class KeyboardNavigationExtender extends Base {
  protected _toggleInertAttr(value: boolean): void {
    const $fixedContent = this._rowsView?.getFixedContentElement();

    if (value) {
      $fixedContent?.attr('inert', true);
    } else {
      $fixedContent?.removeAttr('inert');
    }
  }
};

const editorFactory = (
  Base: ModuleType<EditorFactory & ValidatingEditorFactoryExtension>,
): ModuleType<EditorFactory> => class EditorFactoryFixedColumnsExtender extends Base {
  protected declare _rowsView: ColumnFixingRowsView;

  public override getValidationMessageContainer($cell: dxElementWrapper): dxElementWrapper {
    const isFixedColumns = this._rowsView.isFixedColumns();

    if (isFixedColumns) {
      const $rowsViewElement = this._rowsView.element();

      return $rowsViewElement?.length ? $rowsViewElement : $();
    }

    return super.getValidationMessageContainer($cell);
  }
};

export const columnFixingModule = {
  defaultOptions(): { columnFixing: ColumnFixing & { legacyMode: boolean } } {
    return {
      columnFixing: {
        enabled: false,
        legacyMode: false,
        texts: {
          fix: messageLocalization.format('dxDataGrid-columnFixingFix'),
          unfix: messageLocalization.format('dxDataGrid-columnFixingUnfix'),
          leftPosition: messageLocalization.format('dxDataGrid-columnFixingLeftPosition'),
          rightPosition: messageLocalization.format('dxDataGrid-columnFixingRightPosition'),
          stickyPosition: messageLocalization.format('dxDataGrid-columnFixingStickyPosition'),
        },
        icons: {
          fix: FIXED_COLUMN_ICON_CLASS,
          unfix: UNFIXED_COLUMN_ICON_CLASS,
          leftPosition: FIXED_COLUMN_LEFT_ICON_CLASS,
          rightPosition: FIXED_COLUMN_RIGHT_ICON_CLASS,
          stickyPosition: STICKY_COLUMN_ICON_CLASS,
        },
      },
    };
  },
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView,
    },
    controllers: {
      draggingHeader,
      columnsResizer,
      resizing,
      keyboardNavigation,
      editorFactory,
    },
  },
};
