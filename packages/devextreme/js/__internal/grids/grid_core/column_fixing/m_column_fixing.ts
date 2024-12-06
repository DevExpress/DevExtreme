/* eslint-disable max-classes-per-file */
// TODO Move DataGrid's summary methods to the DataGrid
// TODO Move virtual scrolling related methods to the virtual_scrolling
import { move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { name as wheelEventName } from '@js/common/core/events/core/wheel';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getOuterWidth } from '@js/core/utils/size';
import { setWidth } from '@js/core/utils/style';
import { isDefined } from '@js/core/utils/type';
import Scrollable from '@js/ui/scroll_view/ui.scrollable';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type {
  ColumnsResizerViewController,
  DraggingHeaderViewController,
} from '../columns_resizing_reordering/m_columns_resizing_reordering';
import type { KeyboardNavigationController } from '../keyboard_navigation/m_keyboard_navigation';
import type { ModuleType } from '../m_types';
import gridCoreUtils from '../m_utils';
import type { ColumnsView } from '../views/m_columns_view';
import { normalizeWidth } from '../views/m_columns_view';
import type { ResizingController } from '../views/m_grid_view';
import type { RowsView } from '../views/m_rows_view';

const CONTENT_CLASS = 'content';
const CONTENT_FIXED_CLASS = 'content-fixed';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const FIRST_CELL_CLASS = 'dx-first-cell';
const LAST_CELL_CLASS = 'dx-last-cell';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FIXED_COL_CLASS = 'dx-col-fixed';
const FIXED_COLUMNS_CLASS = 'dx-fixed-columns';
const POINTER_EVENTS_NONE_CLASS = 'dx-pointer-events-none';
const COMMAND_TRANSPARENT = 'transparent';
const GROUP_ROW_CLASS = 'dx-group-row';
const DETAIL_ROW_CLASS = 'dx-master-detail-row';
const FIXED_COLUMN_ICON_CLASS = 'fix-column';
const FIXED_COLUMN_LEFT_ICON_CLASS = 'fix-column-left';
const FIXED_COLUMN_RIGHT_ICON_CLASS = 'fix-column-right';
const STICKY_COLUMN_ICON_CLASS = 'stick-column';
const UNFIXED_COLUMN_ICON_CLASS = 'unfix-column';

const getTransparentColumnIndex = function (fixedColumns: any[]) {
  let transparentColumnIndex = -1;

  each(fixedColumns, (index, column) => {
    if (column.command === COMMAND_TRANSPARENT) {
      transparentColumnIndex = index;
      return false;
    }
    return undefined;
  });

  return transparentColumnIndex;
};

const normalizeColumnWidths = function (fixedColumns, widths: number[], fixedWidths): number[] {
  let fixedColumnIndex = 0;

  if (fixedColumns && widths && fixedWidths) {
    for (let i = 0; i < fixedColumns.length; i++) {
      if (fixedColumns[i].command === COMMAND_TRANSPARENT) {
        fixedColumnIndex += fixedColumns[i].colspan;
      } else {
        if (widths[fixedColumnIndex] < fixedWidths[i]) {
          widths[fixedColumnIndex] = fixedWidths[i];
        }
        fixedColumnIndex++;
      }
    }
  }

  return widths;
};

// View
const baseFixedColumns = <T extends ModuleType<ColumnsView>>(Base: T) => class BaseFixedColumnsExtender extends Base {
  protected _isFixedTableRendering!: boolean;

  protected _isFixedColumns!: boolean;

  protected _fixedTableElement: any;

  public init(): void {
    super.init();
    this._isFixedTableRendering = false;
    this._isFixedColumns = false;
  }

  protected _createCol(column) {
    return super._createCol(column).toggleClass(FIXED_COL_CLASS, !!(this._isFixedTableRendering && (column.fixed || column.command && column.command !== COMMAND_TRANSPARENT)));
  }

  private isIndicesArray(arr): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }

  private _correctColumnIndicesForFixedColumns(fixedColumns, change) {
    const columnIndicesArray = change?.columnIndices;
    if (!this.isIndicesArray(columnIndicesArray)) {
      return;
    }

    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColspan = fixedColumns[transparentColumnIndex].colspan;
    const transparentOffset = transparentColumnIndex + transparentColspan;
    const rowTypes = change?.items?.map(({ rowType }) => rowType);

    change.columnIndices = columnIndicesArray.map((columnIndices, idx) => {
      if (!this.isIndicesArray(columnIndices)) {
        return columnIndices;
      }

      const isGroupRow = rowTypes && rowTypes[idx] === 'group';

      if (isGroupRow) {
        return [...columnIndices];
      }

      return columnIndices.reduce((result, colIdx) => {
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

  private _partialUpdateFixedTable(fixedColumns, rows) {
    const fixedTableElement = this._fixedTableElement;
    const $rows = this._getRowElementsCore(fixedTableElement);
    const $colgroup = fixedTableElement.children('colgroup');

    $colgroup.replaceWith(this._createColGroup(fixedColumns));

    for (let i = 0; i < rows.length; i++) {
      this._partialUpdateFixedRow($($rows[i]), fixedColumns, rows[i]);
    }
  }

  private _partialUpdateFixedRow($row, fixedColumns, row) {
    const cellElements = $row.get(0).childNodes;
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColumn = fixedColumns[transparentColumnIndex];
    const columnIndexOffset = this._columnsController.getColumnIndexOffset();
    let groupCellOptions;
    let colIndex = columnIndexOffset + 1;
    let { colspan } = transparentColumn;

    if ($row.hasClass(DETAIL_ROW_CLASS)) {
      cellElements[0].setAttribute('colspan', this._columnsController.getVisibleColumns()?.length);

      return;
    }

    if ($row.hasClass(GROUP_ROW_CLASS)) {
      // @ts-expect-error RowsView's method
      groupCellOptions = this._getGroupCellOptions({
        row,
        columns: this._columnsController.getVisibleColumns(),
      });

      const hasSummary = row.summaryCells.length > 0;
      if (hasSummary) {
        // @ts-expect-error RowsView's method
        const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellOptions.colspan, {
          columns: this._columnsController.getVisibleColumns(),
          row,
          isFixed: true,
        });

        colspan = groupCellOptions.colspan - alignByColumnCellCount;
      } else {
        colspan = groupCellOptions.colspan - Math.max(0, cellElements.length - (groupCellOptions.columnIndex + 2));
      }
    }

    for (let j = 0; j < cellElements.length; j++) {
      const needUpdateColspan = groupCellOptions ? j === (groupCellOptions.columnIndex + 1) : j === transparentColumnIndex;

      cellElements[j].setAttribute('aria-colindex', colIndex);

      if (needUpdateColspan) {
        cellElements[j].setAttribute('colspan', colspan);
        colIndex += colspan;
      } else {
        colIndex++;
      }
    }
  }

  protected _renderTable(options) {
    let $fixedTable;
    const fixedColumns = this.getFixedColumns();

    this._isFixedColumns = this.isFixedColumns();
    const $table = super._renderTable(options);

    if (this._isFixedColumns) {
      const change = options?.change;
      const $fixedDataRows = this._getRowElements(this._fixedTableElement);
      const needPartialUpdate = change?.virtualColumnsScrolling && $fixedDataRows.length === change?.items?.length;

      this._isFixedTableRendering = true;

      if (needPartialUpdate && this.option('scrolling.legacyMode') !== true) {
        this._partialUpdateFixedTable(fixedColumns, options?.change?.items);
        this._isFixedTableRendering = false;
      } else {
        const columnIndices = change?.columnIndices;

        this._correctColumnIndicesForFixedColumns(fixedColumns, change);

        $fixedTable = this._createTable(fixedColumns);
        this._renderRows($fixedTable, extend({}, options, { columns: fixedColumns }));
        this._updateContent($fixedTable, change, true);

        if (columnIndices) {
          change.columnIndices = columnIndices;
        }

        this._isFixedTableRendering = false;
      }
    } else {
      this._fixedTableElement && this._fixedTableElement.parent().remove();
      this._fixedTableElement = null;
    }

    return $table;
  }

  protected _renderRow($table, options) {
    let fixedCorrection;
    let { cells } = options.row;

    super._renderRow.apply(this, arguments as any);

    if (this._isFixedTableRendering && cells && cells.length) {
      fixedCorrection = 0;
      const fixedCells = options.row.cells || [];
      cells = cells.slice();
      options.row.cells = cells;

      for (let i = 0; i < fixedCells.length; i++) {
        if (fixedCells[i].column && fixedCells[i].column.command === COMMAND_TRANSPARENT) {
          fixedCorrection = (fixedCells[i].column.colspan || 1) - 1;
          continue;
        }
        cells[i + fixedCorrection] = fixedCells[i];
      }
    }
  }

  protected _createCell(options) {
    const that = this;
    const { column } = options;
    const columnCommand = column && column.command;
    const { rowType } = options;
    const $cell = super._createCell.apply(that, arguments as any);
    let fixedColumns;
    let prevFixedColumn;
    let transparentColumnIndex;

    if (that._isFixedTableRendering || rowType === 'filter') {
      fixedColumns = that.getFixedColumns();
      transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
      prevFixedColumn = fixedColumns[transparentColumnIndex - 1];
    }

    if (that._isFixedTableRendering) {
      if (columnCommand === COMMAND_TRANSPARENT) {
        $cell
          .addClass(POINTER_EVENTS_NONE_CLASS)
          .toggleClass(FIRST_CELL_CLASS, transparentColumnIndex === 0 || prevFixedColumn && prevFixedColumn.command === 'expand')
          .toggleClass(LAST_CELL_CLASS, fixedColumns.length && transparentColumnIndex === (fixedColumns.length - 1));

        if (rowType !== 'freeSpace') {
          gridCoreUtils.setEmptyText($cell);
        }
      }
    } else if (rowType === 'filter') {
      $cell.toggleClass(FIRST_CELL_CLASS, options.columnIndex === transparentColumnIndex);
    }

    const isRowAltStyle = that.option('rowAlternationEnabled') && options.isAltRow;
    const isSelectAllCell = that.option('selection.mode') === 'multiple' && options.columnIndex === 0 && options.rowType === 'header';
    // T823783, T852898, T865179, T875201, T1120812
    if (browser.mozilla && options.column.fixed && options.rowType !== 'group' && !isRowAltStyle && !isSelectAllCell) {
      $cell.addClass(FIXED_COL_CLASS);
    }

    return $cell;
  }

  protected _wrapTableInScrollContainer($table, isFixedTableRendering) {
    const $scrollContainer = super._wrapTableInScrollContainer.apply(this, arguments as any);

    if (this._isFixedTableRendering || isFixedTableRendering) {
      $scrollContainer.addClass(this.addWidgetPrefix(CONTENT_FIXED_CLASS));
    }

    return $scrollContainer;
  }

  protected _renderCellContent($cell, options) {
    let isEmptyCell;
    const { column } = options;
    const isFixedTableRendering = this._isFixedTableRendering;
    const isGroupCell = options.rowType === 'group' && isDefined(column.groupIndex);

    // T747718, T824508, T821252
    if (isFixedTableRendering && isGroupCell && !column.command && !column.groupCellTemplate) {
      $cell.css('pointerEvents', 'none');
    }

    if (!isFixedTableRendering && this._isFixedColumns) {
      isEmptyCell = column.fixed || (column.command && column.fixed !== false);

      if (isGroupCell) {
        isEmptyCell = false;
        if (options.row.summaryCells && options.row.summaryCells.length) {
          const columns = this._columnsController.getVisibleColumns();
          // @ts-expect-error DataGrid's method
          const alignByFixedColumnCellCount = this._getAlignByColumnCellCount?.(
            column.colspan,
            {
              columns,
              row: options.row,
              isFixed: true,
            },
          ) ?? 0;

          if (alignByFixedColumnCellCount > 0) {
            const transparentColumnIndex = getTransparentColumnIndex(this._columnsController.getFixedColumns());
            isEmptyCell = (columns.length - alignByFixedColumnCellCount) < transparentColumnIndex;
          }
        }
      }

      if (isEmptyCell) {
        if (column.command && column.type !== 'buttons' || options.rowType === 'group') {
          $cell
            .html('&nbsp;')
            .addClass(column.cssClass);
          return;
        }
        $cell.addClass('dx-hidden-cell');
      }
    }

    if (column.command !== COMMAND_TRANSPARENT) {
      super._renderCellContent.apply(this, arguments as any);
    }
  }

  public getContent(isFixedTableRendering) {
    return isFixedTableRendering ? this._fixedTableElement?.parent() : super.getContent.apply(this, arguments as any);
  }

  public _getCellElementsCore(rowIndex): dxElementWrapper | undefined {
    const cellElements = super._getCellElementsCore.apply(this, arguments as any);

    const isGroupRow = cellElements?.parent().hasClass(GROUP_ROW_CLASS);
    const headerRowIndex = this.name === 'columnHeadersView' ? rowIndex : undefined; // TODO

    if (this._fixedTableElement && cellElements) {
      const fixedColumns = this.getFixedColumns(headerRowIndex);
      const fixedCellElements = this._getRowElements(this._fixedTableElement).eq(rowIndex).children('td');

      each(fixedCellElements, (columnIndex, cell) => {
        if (isGroupRow) {
          if (cellElements[columnIndex] && cell.style.visibility !== 'hidden') {
            cellElements[columnIndex] = cell;
          }
        } else {
          const fixedColumn = fixedColumns[columnIndex];

          if (fixedColumn) {
            if (fixedColumn.command === COMMAND_TRANSPARENT) {
              if (fixedCellElements.eq(columnIndex).hasClass(MASTER_DETAIL_CELL_CLASS)) {
                cellElements[columnIndex] = cell || cellElements[columnIndex];
              }
            } else {
              const fixedColumnIndex = this._columnsController.getVisibleIndexByColumn(fixedColumn, headerRowIndex);
              cellElements[fixedColumnIndex] = cell || cellElements[fixedColumnIndex];
            }
          }
        }
      });
    }

    return cellElements;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getColumnWidths(fixedTableElement?: any, rowIndex?: number) {
    const result = super.getColumnWidths(fixedTableElement, rowIndex);
    const fixedColumns = this.getFixedColumns();
    const fixedWidths = this._fixedTableElement && result.length
      ? super.getColumnWidths(this._fixedTableElement)
      : undefined;

    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  }

  public getTableElement(isFixedTableRendering?) {
    isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;
    const tableElement = isFixedTableRendering ? this._fixedTableElement : super.getTableElement();

    return tableElement;
  }

  public setTableElement(tableElement, isFixedTableRendering) {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      this._fixedTableElement = tableElement.addClass(POINTER_EVENTS_NONE_CLASS);
    } else {
      super.setTableElement(tableElement);
    }
  }

  public getColumns(rowIndex) {
    const $tableElement = this.getTableElement();

    if (this._isFixedTableRendering) {
      return this.getFixedColumns(rowIndex);
    }

    return super.getColumns(rowIndex, $tableElement);
  }

  public getRowIndex($row) {
    const $fixedTable = this._fixedTableElement;

    if ($fixedTable && $fixedTable.find($row).length) {
      return this._getRowElements($fixedTable).index($row);
    }

    return super.getRowIndex($row);
  }

  public getTableElements() {
    let result = super.getTableElements.apply(this, arguments as any);

    if (this._fixedTableElement) {
      result = $([result.get(0), this._fixedTableElement.get(0)] as any);
    }

    return result;
  }

  protected getFixedColumns(rowIndex?) {
    return this._columnsController.getFixedColumns(rowIndex);
  }

  protected getFixedColumnsOffset() {
    let offset = { left: 0, right: 0 };
    let $transparentColumn;

    if (this._fixedTableElement) {
      $transparentColumn = this.getTransparentColumnElement();
      const positionTransparentColumn = $transparentColumn.position();

      offset = {
        left: positionTransparentColumn.left,
        right: getOuterWidth(this.element(), true) - (getOuterWidth($transparentColumn, true) + positionTransparentColumn.left),
      };
    }

    return offset;
  }

  protected getTransparentColumnElement() {
    return this._fixedTableElement && this._fixedTableElement.find(`.${POINTER_EVENTS_NONE_CLASS}`).first();
  }

  protected getFixedTableElement() {
    return this._fixedTableElement;
  }

  protected _resizeCore() {
    super._resizeCore();
    this.synchronizeRows();
  }

  protected setColumnWidths(options): void {
    const { widths } = options;

    const visibleColumns = this._columnsController.getVisibleColumns();
    const isColumnWidthsSynced = widths?.length && visibleColumns.some((column) => isDefined(column.visibleWidth));
    const isColumnWidthChanged = options.optionNames?.width;

    super.setColumnWidths(options);

    if (this._fixedTableElement) {
      const hasAutoWidth = widths?.some((width) => width === 'auto' || !isDefined(width));
      // if order of calling isScrollbarVisible changed, performance tests will fail
      const needVisibleColumns = hasAutoWidth && (!isColumnWidthsSynced || !this.isScrollbarVisible(true));
      const columns = needVisibleColumns ? visibleColumns : this.getFixedColumns();

      this.setFixedTableColumnWidths(columns, widths);
    }

    const wordWrapEnabled = this.option('wordWrapEnabled');
    const needSynchronizeRows = isColumnWidthsSynced || (isColumnWidthChanged && wordWrapEnabled);

    if (needSynchronizeRows) {
      this.synchronizeRows();
    }
  }

  private setFixedTableColumnWidths(columns, widths): void {
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

  private _getClientHeight(element) {
    const boundingClientRectElement = element.getBoundingClientRect && getBoundingRect(element);

    return boundingClientRectElement && boundingClientRectElement.height ? boundingClientRectElement.height : element.clientHeight;
  }

  private synchronizeRows() {
    const rowHeights: any[] = [];
    const fixedRowHeights: any[] = [];
    let rowIndex;
    let $rowElements;
    let $fixedRowElements;
    let $contentElement;

    this.waitAsyncTemplates(true).done(() => {
      if (this._isFixedColumns && this._tableElement && this._fixedTableElement) {
        const heightTable = this._getClientHeight(this._tableElement.get(0));
        const heightFixedTable = this._getClientHeight(this._fixedTableElement.get(0));
        $rowElements = this._getRowElements(this._tableElement);
        $fixedRowElements = this._getRowElements(this._fixedTableElement);
        $contentElement = this._findContentElement();

        if (heightTable !== heightFixedTable) {
          $contentElement && $contentElement.css('height', heightTable);
          $rowElements.css('height', '');
          $fixedRowElements.css('height', '');

          for (rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
            rowHeights.push(this._getClientHeight($rowElements.get(rowIndex)));
            fixedRowHeights.push(this._getClientHeight($fixedRowElements.get(rowIndex)));
          }
          for (rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
            const rowHeight = rowHeights[rowIndex];
            const fixedRowHeight = fixedRowHeights[rowIndex];
            if (rowHeight > fixedRowHeight) {
              $fixedRowElements.eq(rowIndex).css('height', rowHeight);
            } else if (rowHeight < fixedRowHeight) {
              $rowElements.eq(rowIndex).css('height', fixedRowHeight);
            }
          }

          $contentElement && $contentElement.css('height', '');
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setScrollerSpacing(width, hWidth?) {
    const rtlEnabled = this.option('rtlEnabled');

    super.setScrollerSpacing(width);
    this.element().children(`.${this.addWidgetPrefix(CONTENT_FIXED_CLASS)}`).css({
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

const columnHeadersView = (Base: ModuleType<ColumnHeadersView>) => class ColumnHeadersViewFixedColumnsExtender extends baseFixedColumns(Base) {
  private _getRowVisibleColumns(rowIndex) {
    if (this._isFixedTableRendering) {
      return this.getFixedColumns(rowIndex);
    }
    // TODO Check that this method exists in runtime
    // @ts-expect-error A method with this name doesn't exist in js folder at all
    return super._getRowVisibleColumns(rowIndex);
  }

  private getFixedColumnElements(rowIndex?) {
    const that = this;

    if (!this._isFixedColumns) {
      return;
    }

    if (isDefined(rowIndex)) {
      return this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).children();
    }

    const columnElements: any = that.getColumnElements();
    const $transparentColumnElement = that.getTransparentColumnElement();
    if (columnElements && $transparentColumnElement && $transparentColumnElement.length) {
      const transparentColumnIndex = getTransparentColumnIndex(that.getFixedColumns());
      [].splice.apply(
        columnElements,
        [
          transparentColumnIndex,
          $transparentColumnElement.get(0)?.colSpan,
          $transparentColumnElement.get(0) as never,
        ],
      );
    }

    return columnElements;
  }

  public getColumnWidths(fixedTableElement?: any, rowIndex?: number) {
    const that = this;
    let fixedWidths;
    const result = super.getColumnWidths(fixedTableElement, rowIndex);
    const $fixedColumnElements = that.getFixedColumnElements();
    const fixedColumns = that.getFixedColumns();

    if (that._fixedTableElement) {
      if ($fixedColumnElements && $fixedColumnElements.length) {
        fixedWidths = that._getWidths($fixedColumnElements);
      } else {
        fixedWidths = super.getColumnWidths(that._fixedTableElement);
      }
    }

    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  }
};

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewFixedColumnsExtender extends baseFixedColumns(Base) {
  protected _fixedScrollTimeout: any;

  public dispose() {
    super.dispose.apply(this, arguments as any);
    clearTimeout(this._fixedScrollTimeout);
  }

  public optionChanged(args) {
    const that = this;

    super.optionChanged(args);

    if (args.name === 'hoverStateEnabled' && that._isFixedColumns) {
      args.value ? this._attachHoverEvents() : this._detachHoverEvents();
    }
  }

  private _detachHoverEvents() {
    const element = this.element();

    if (this._fixedTableElement && this._tableElement) {
      eventsEngine.off(element, 'mouseover mouseout', '.dx-data-row');
    }
  }

  private _attachHoverEvents() {
    if (this._fixedTableElement && this._tableElement) {
      eventsEngine.on(this.element(), 'mouseover mouseout', '.dx-data-row', this.createAction((args) => {
        const { event } = args;
        const rowIndex = this.getRowIndex($(event.target).closest('.dx-row'));
        const isHover = event.type === 'mouseover';

        if (rowIndex >= 0) {
          this._tableElement && this._getRowElements(this._tableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
          this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
        }
      }));
    }
  }

  private _getScrollDelay() {
    // @ts-expect-error m_virtual_scrolling method
    const hasResizeTimeout = this._resizingController?.hasResizeTimeout();

    if (hasResizeTimeout) {
      return this.option('scrolling.updateTimeout');
    }

    return browser.mozilla ? 60 : 0;
  }

  public _findContentElement(isFixedTableRendering) {
    let $content;
    let scrollTop;
    const contentClass = this.addWidgetPrefix(CONTENT_CLASS);
    const element = this.element();

    isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;

    if (element && isFixedTableRendering) {
      $content = element.children(`.${contentClass}`);

      const scrollable = this.getScrollable();
      if (!$content.length && scrollable) {
        $content = $('<div>').addClass(contentClass);

        eventsEngine.on($content, 'scroll', (e) => {
          const { target } = e;
          const scrollDelay = this._getScrollDelay();

          clearTimeout(this._fixedScrollTimeout);
          this._fixedScrollTimeout = setTimeout(() => {
            scrollTop = $(target).scrollTop();
            scrollable.scrollTo({ y: scrollTop });
          }, scrollDelay);
        });
        eventsEngine.on($content, wheelEventName, (e) => {
          const $nearestScrollable = $(e.target).closest('.dx-scrollable');
          let shouldScroll = false;

          if (scrollable && scrollable.$element().is($nearestScrollable)) {
            shouldScroll = true;
          } else {
            const nearestScrollableInstance = $nearestScrollable.length && Scrollable.getInstance($nearestScrollable.get(0));
            // @ts-expect-error
            const nearestScrollableHasVerticalScrollbar = nearestScrollableInstance && (nearestScrollableInstance.scrollHeight() - nearestScrollableInstance.clientHeight() > 0);

            // @ts-expect-error
            shouldScroll = nearestScrollableInstance && !nearestScrollableHasVerticalScrollbar;
          }

          if (shouldScroll) {
            scrollTop = scrollable.scrollTop();
            scrollable.scrollTo({ y: scrollTop - e.delta });

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

  protected _updateScrollable() {
    super._updateScrollable();

    const scrollable = this.getScrollable();

    if (scrollable?._disposed) {
      return;
    }

    const scrollTop = scrollable && scrollable.scrollOffset().top;

    this._updateFixedTablePosition(scrollTop);
  }

  protected _renderContent(contentElement, tableElement, isFixedTableRendering) {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      return contentElement
        .empty()
        .addClass(`${this.addWidgetPrefix(CONTENT_CLASS)} ${this.addWidgetPrefix(CONTENT_FIXED_CLASS)}`)
        .append(tableElement);
    }

    return super._renderContent(contentElement, tableElement);
  }

  protected _getGroupCellOptions(options) {
    if (this._isFixedTableRendering) {
      return super._getGroupCellOptions(extend({}, options, { columns: this._columnsController.getVisibleColumns() }));
    }

    return super._getGroupCellOptions(options);
  }

  protected _renderGroupedCells($row, options) {
    return super._renderGroupedCells($row, extend({}, options, { columns: this._columnsController.getVisibleColumns() }));
  }

  private _renderGroupSummaryCells($row, options) {
    if (this._isFixedTableRendering) {
      // @ts-expect-error DataGrid's method
      super._renderGroupSummaryCells($row, extend({}, options, { columns: this._columnsController.getVisibleColumns() }));
    } else {
      // @ts-expect-error DataGrid's method
      super._renderGroupSummaryCells($row, options);
    }
  }

  private _hasAlignByColumnSummaryItems(columnIndex, options) {
    // @ts-expect-error DataGrid's method
    const result = super._hasAlignByColumnSummaryItems.apply(this, arguments);
    const column = options.columns[columnIndex];

    if (options.isFixed) {
      return column.fixed && (result || column.fixedPosition === 'right');
    }

    return result && (!this._isFixedColumns || !column.fixed);
  }

  private _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    let alignByFixedColumnCellCount;

    if (this._isFixedTableRendering) {
      options.isFixed = true;
      // @ts-expect-error DataGrid's method
      alignByFixedColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
      options.isFixed = false;

      const startColumnIndex = options.columns.length - alignByFixedColumnCellCount;
      options = extend({}, options, { columns: this.getFixedColumns() });
      const transparentColumnIndex = getTransparentColumnIndex(options.columns);

      if (startColumnIndex < transparentColumnIndex) {
        alignByFixedColumnCellCount -= (options.columns[transparentColumnIndex].colspan - 1) || 0;
        groupCellColSpan -= (options.columns[transparentColumnIndex].colspan - 1) || 0;
      } else if (alignByColumnCellCount > 0) {
        $groupCell.css('visibility', 'hidden');
      }
      alignByColumnCellCount = alignByFixedColumnCellCount;
    }

    // @ts-expect-error DataGrid's method
    super._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
  }

  private _getSummaryCellIndex(columnIndex, columns) {
    if (this._isFixedTableRendering) {
      const transparentColumnIndex = getTransparentColumnIndex(columns);

      if (columnIndex > transparentColumnIndex) {
        columnIndex += columns[transparentColumnIndex].colspan - 1;
      }

      return columnIndex;
    }

    // @ts-expect-error DataGrid's method
    return super._getSummaryCellIndex.apply(this, arguments);
  }

  protected _renderCore(change) {
    this._detachHoverEvents();

    const deferred = super._renderCore(change);

    const isFixedColumns = this._isFixedColumns;

    this.element().toggleClass(FIXED_COLUMNS_CLASS, isFixedColumns);

    if (this.option('hoverStateEnabled') && isFixedColumns) {
      this._attachHoverEvents();
    }

    return deferred;
  }

  protected setAriaOwns(headerTableId, footerTableId, isFixed) {
    if (isFixed) {
      const contentFixedClass = this.addWidgetPrefix(CONTENT_FIXED_CLASS);
      const $contentFixedElement = this.element()?.children(`.${contentFixedClass}`);
      const $fixedTableElement = this.getFixedTableElement();

      if ($contentFixedElement.length && $fixedTableElement?.length) {
        this.setAria('owns', `${headerTableId ?? ''} ${$fixedTableElement.attr('id') ?? ''} ${footerTableId ?? ''}`.trim(), $contentFixedElement);
      }
    } else {
      super.setAriaOwns.apply(this, arguments as any);
    }
  }

  public toggleDraggableColumnClass(columnIndex, value) {
    super.toggleDraggableColumnClass(columnIndex, value);

    if (this.isFixedColumns()) {
      const $rows = this._getRowElements(this._fixedTableElement);
      this._toggleDraggableSourceColumnClass($rows, this.getFixedColumns(), columnIndex, value);
    }
  }

  public getCellIndex($cell) {
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
          return;
        }

        cellIndex++;
        return undefined;
      });

      return cellIndex;
    }

    return super.getCellIndex.apply(this, arguments as any);
  }

  private _updateFixedTablePosition(scrollTop, needFocus?) {
    if (this._fixedTableElement && this._tableElement) {
      let $focusedElement;

      this._fixedTableElement.parent().scrollTop(scrollTop);

      if (needFocus && this._editorFactoryController) {
        $focusedElement = this._editorFactoryController.focus();
        $focusedElement && this._editorFactoryController.focus($focusedElement);
      }
    }
  }

  public setScrollerSpacing(vWidth, hWidth) {
    const that = this;
    const styles = { marginBottom: 0 };
    const $fixedContent = that.element().children(`.${this.addWidgetPrefix(CONTENT_FIXED_CLASS)}`);

    if ($fixedContent.length && that._fixedTableElement) {
      $fixedContent.css(styles);
      that._fixedTableElement.css(styles);

      styles[that.option('rtlEnabled') ? 'marginLeft' : 'marginRight'] = vWidth;
      styles.marginBottom = hWidth;

      const useNativeScrolling = that._scrollable && that._scrollable.option('useNative');
      (useNativeScrolling ? $fixedContent : that._fixedTableElement).css(styles);
    }
  }

  private _getElasticScrollTop(e) {
    let elasticScrollTop = 0;

    if (e.scrollOffset.top < 0) {
      elasticScrollTop = -e.scrollOffset.top;
    } else if (e.reachedBottom) {
      const $scrollableContent = $(e.component.content());
      const $scrollableContainer = $(e.component.container());
      const maxScrollTop = Math.max($scrollableContent.get(0).clientHeight - $scrollableContainer.get(0).clientHeight, 0);

      elasticScrollTop = Math.min(maxScrollTop - e.scrollOffset.top, 0);
    }

    return Math.floor(elasticScrollTop);
  }

  private _applyElasticScrolling(e) {
    if (this._fixedTableElement) {
      const elasticScrollTop = this._getElasticScrollTop(e);

      if (Math.ceil(elasticScrollTop) !== 0) {
        move(this._fixedTableElement, { top: elasticScrollTop });
      } else {
        this._fixedTableElement.css('transform', '');
      }
    }
  }

  protected _handleScroll(e) {
    this._updateFixedTablePosition(e.scrollOffset.top, true);
    this._applyElasticScrolling(e);
    super._handleScroll(e);
  }

  private _updateContentPosition(isRender) {
    // @ts-expect-error m_virtual_scrolling method
    super._updateContentPosition.apply(this, arguments);
    if (!isRender) {
      this._updateFixedTablePosition(this._scrollTop);
    }
  }

  protected _afterRowPrepared(e) {
    if (this._isFixedTableRendering) return;
    super._afterRowPrepared(e);
  }

  public _scrollToElement($element, offset?) {
    const scrollOffset = this.isFixedColumns() ? this.getFixedColumnsOffset() : offset;

    super._scrollToElement($element, scrollOffset);
  }
};

// TODO Move this view to the DataGrid
const footerView = (Base: ModuleType<any>) => class FooterViewFixedColumnsExtender extends baseFixedColumns(Base) {};

const normalizeColumnIndicesByPoints = function (columns, fixedColumns, pointsByColumns) {
  const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
  const correctIndex = columns.length - fixedColumns.length;

  each(pointsByColumns, (_, point) => {
    if (point.index > transparentColumnIndex) {
      point.columnIndex += correctIndex;
      point.index += correctIndex;
    }
  });

  return pointsByColumns;
};

const draggingHeader = (Base: ModuleType<DraggingHeaderViewController>) => class DraggingHeaderColumnFixingExtender extends Base {
  public _generatePointsByColumns(options, needToCheckPrevPoint) {
    const visibleColumns = options.columns;
    const { targetDraggingPanel } = options;

    if (targetDraggingPanel && targetDraggingPanel.getName() === 'headers' && targetDraggingPanel.isFixedColumns()) {
      if (options.sourceColumn.fixed) {
        if (!options.rowIndex) {
          options.columnElements = targetDraggingPanel.getFixedColumnElements(0);
        }
        options.columns = targetDraggingPanel.getFixedColumns(options.rowIndex);

        const pointsByColumns = super._generatePointsByColumns(options, needToCheckPrevPoint);
        normalizeColumnIndicesByPoints(visibleColumns, options.columns, pointsByColumns);
        return pointsByColumns;
      }
    }

    return super._generatePointsByColumns(options, needToCheckPrevPoint);
  }

  protected _pointCreated(point, columns, location, sourceColumn) {
    const result = super._pointCreated.apply(this, arguments as any);
    const targetColumn = columns[point.columnIndex];
    // @ts-expect-error
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();

    if (!result && location === 'headers' && $transparentColumn && $transparentColumn.length) {
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

const columnsResizer = (Base: ModuleType<ColumnsResizerViewController>) => class ColumnResizerColumnFixingExtender extends Base {
  private _pointsByFixedColumns: any;

  protected _generatePointsByColumns(needToCheckPrevPoint) {
    const that = this;
    const columnsController = that._columnsController;
    const columns = columnsController && that._columnsController.getVisibleColumns();
    const fixedColumns = columnsController && that._columnsController.getFixedColumns();
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const correctIndex = columns.length - fixedColumns.length;
    // @ts-expect-error
    const cells = that._columnHeadersView.getFixedColumnElements();

    super._generatePointsByColumns(needToCheckPrevPoint);

    if (cells && cells.length > 0) {
      that._pointsByFixedColumns = gridCoreUtils.getPointsByColumns(cells, (point) => {
        if (point.index > transparentColumnIndex) {
          point.columnIndex += correctIndex;
          point.index += correctIndex;
        }

        return that._pointCreated(point, columns.length, columns);
      });
    }
  }

  protected _getTargetPoint(pointsByColumns, currentX, deltaX) {
    // @ts-expect-error
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();

    if ($transparentColumn && $transparentColumn.length) {
      const boundingRect = getBoundingRect($transparentColumn.get(0));

      if (currentX <= boundingRect.left || currentX >= boundingRect.right) {
        return super._getTargetPoint(this._pointsByFixedColumns, currentX, deltaX);
      }
    }

    return super._getTargetPoint(pointsByColumns, currentX, deltaX);
  }
};

const resizing = (Base: ModuleType<ResizingController>) => class ResizingColumnFixingExtender extends Base {
  protected _setAriaOwns() {
    super._setAriaOwns.apply(this, arguments as any);

    // @ts-expect-error
    const headerFixedTable = this._columnHeadersView?.getFixedTableElement();
    // @ts-expect-error
    const footerFixedTable = this._footerView?.getFixedTableElement();
    // @ts-expect-error
    this._rowsView?.setAriaOwns(headerFixedTable?.attr('id'), footerFixedTable?.attr('id'), true);
  }
};

const keyboardNavigation = (Base: ModuleType<KeyboardNavigationController>) => class KeyboardNavigationExtender extends Base {
  protected _toggleInertAttr(value: boolean): void {
    const $fixedContent = this._rowsView?.getFixedContentElement();

    if (value) {
      $fixedContent?.attr('inert', true);
    } else {
      $fixedContent?.removeAttr('inert');
    }
  }
};

const editorFactory = (Base: ModuleType<EditorFactory>) => class EditorFactoryFixedColumnsExtender extends Base {
  protected getValidationMessageContainer($cell: dxElementWrapper): dxElementWrapper {
    // @ts-expect-error RowsView's method
    const isFixedColumns = this._rowsView.isFixedColumns();

    if (isFixedColumns) {
      return this._rowsView.element() as dxElementWrapper;
    }

    // @ts-expect-error EditorFactory's method
    return super.getValidationMessageContainer($cell);
  }
};

export const columnFixingModule = {
  defaultOptions() {
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
