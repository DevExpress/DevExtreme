/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { setWidth } from '@js/core/utils/size';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';

import { HIDDEN_COLUMNS_WIDTH } from '../adaptivity/const';
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type {
  ColumnsResizerViewController,
  DraggingHeaderViewController,
} from '../columns_resizing_reordering/m_columns_resizing_reordering';
import type { ModuleType } from '../m_types';
import gridCoreUtils from '../m_utils';
import { CLASSES as MASTER_DETAIL_CLASSES } from '../master_detail/const';
import type { ColumnsView } from '../views/m_columns_view';
import type { RowsView } from '../views/m_rows_view';
import { isGroupRow } from '../views/m_rows_view';
import { CLASSES, StickyPosition } from './const';
import { GridCoreStickyColumnsDom } from './dom';
import {
  getColumnFixedPosition,
  getStickyOffset,
  hasFixedColumnsWithStickyPosition,
  isFirstFixedColumn,
  isFixedEdge,
  isLastFixedColumn,
  needToDisableStickyColumn,
  normalizeOffset,
  prevColumnIsFixed,
  processFixedColumns,
} from './utils';

const baseStickyColumns = <T extends ModuleType<ColumnsView>>(Base: T) => class BaseStickyColumnsExtender extends Base {
  private _addStickyColumnBorderLeftClass(
    $cell: dxElementWrapper,
    column,
    rowIndex: number,
    onlyWithinBandColumn = false,
    fixedPosition?: StickyPosition,
  ): void {
    const isFirstFixedCell = isFirstFixedColumn(
      this._columnsController,
      column,
      rowIndex,
      onlyWithinBandColumn,
      fixedPosition,
    );

    if (isFirstFixedCell) {
      GridCoreStickyColumnsDom
        .addStickyColumnBorderLeftClass($cell, this.addWidgetPrefix.bind(this));
    }
  }

  private _addStickyColumnBorderRightClass(
    $cell: dxElementWrapper,
    column,
    rowIndex: number,
    onlyWithinBandColumn = false,
    fixedPosition?: StickyPosition,
  ): void {
    const isLastFixedCell = isLastFixedColumn(
      this._columnsController,
      column,
      rowIndex,
      onlyWithinBandColumn,
      fixedPosition,
    );

    if (isLastFixedCell) {
      GridCoreStickyColumnsDom
        .addStickyColumnBorderRightClass($cell, this.addWidgetPrefix.bind(this));
    }
  }

  private updateBorderCellClasses(
    $cell: dxElementWrapper,
    column,
    rowIndex: number | null,
  ): void {
    const columnsController = this._columnsController;
    const isRowsView = this.name === 'rowsView';
    const prevCellIsFixed = prevColumnIsFixed(
      columnsController,
      column,
      rowIndex,
      isRowsView,
    );
    const isFirstColumn = columnsController?.isFirstColumn(column, rowIndex);

    GridCoreStickyColumnsDom
      .toggleColumnNoBorderClass($cell, prevCellIsFixed, this.addWidgetPrefix.bind(this));
    GridCoreStickyColumnsDom
      .toggleFirstHeaderClass($cell, isFirstColumn, this.addWidgetPrefix.bind(this));
  }

  private _updateBorderClasses(): void {
    const isColumnHeadersView = this.name === 'columnHeadersView';
    const $rows = this._getRowElementsCore().not(`.${MASTER_DETAIL_CLASSES.detailRow}`).toArray();

    $rows.forEach((row: Element, index: number) => {
      const rowIndex = isColumnHeadersView ? index : null;
      const $cells = $(row).children('td').toArray();
      let columns = this.getColumns(rowIndex);

      columns = processFixedColumns(this._columnsController, columns);

      $cells.forEach((cell: Element, cellIndex: number) => {
        const $cell = $(cell);
        const column = columns[cellIndex];

        if (column.visibleWidth !== HIDDEN_COLUMNS_WIDTH) {
          this.updateBorderCellClasses($cell, column, rowIndex);
        }
      });
    });
  }

  protected _renderCore(options?) {
    super._renderCore(options);

    const $element = this.element();
    const hasStickyColumns = this.hasStickyColumns();

    GridCoreStickyColumnsDom.toggleStickyColumnsClass(
      $element,
      hasStickyColumns,
      this.addWidgetPrefix.bind(this),
    );
  }

  protected _createCell(options) {
    const { column } = options;
    const { rowType } = options;
    const $cell = super._createCell(options);
    const hasStickyColumns = this.hasStickyColumns();
    const rowIndex = rowType === 'header' ? options.rowIndex : null;
    const isSummary = rowType === 'groupFooter' || rowType === 'totalFooter' || rowType === 'group';
    const isExpandColumn = column.command && column.command === 'expand';

    if (hasStickyColumns && !needToDisableStickyColumn(this._columnsController, column)) {
      this.updateBorderCellClasses($cell, column, rowIndex);

      if (column.fixed) {
        const fixedPosition = getColumnFixedPosition(this._columnsController, column);

        GridCoreStickyColumnsDom.addStickyColumnClass(
          $cell,
          fixedPosition,
          this.addWidgetPrefix.bind(this),
        );

        if (!isSummary && !isExpandColumn) {
          switch (fixedPosition) {
            case StickyPosition.Right: {
              this._addStickyColumnBorderLeftClass(
                $cell,
                column,
                rowIndex,
                false,
                StickyPosition.Right,
              );
              break;
            }
            case StickyPosition.Sticky: {
              this._addStickyColumnBorderLeftClass($cell, column, rowIndex, true);
              this._addStickyColumnBorderRightClass($cell, column, rowIndex, true);
              break;
            }
            default: {
              this._addStickyColumnBorderRightClass(
                $cell,
                column,
                rowIndex,
                false,
                StickyPosition.Left,
              );
            }
          }
        }
      }
    }

    return $cell;
  }

  protected setStickyOffsets(rowIndex?: number, offsets?: Record<number, Record<string, number>>): void {
    const columnsController = this._columnsController;
    const rtlEnabled = this.option('rtlEnabled') as boolean;
    const showColumnHeaders = this.option('showColumnHeaders');
    let widths = this.getColumnWidths(undefined, rowIndex);
    let columns = this.getColumns(showColumnHeaders ? rowIndex : undefined);

    columns = processFixedColumns(this._columnsController, columns);

    if (rtlEnabled) {
      columns = rtlEnabled ? [...columns].reverse() : columns;
      widths = rtlEnabled ? [...widths].reverse() : widths;
    }

    columns.forEach((column, columnIndex) => {
      if (column.fixed) {
        const visibleColumnIndex = rtlEnabled ? columns.length - columnIndex - 1 : columnIndex;
        const offset = getStickyOffset(columnsController, columns, widths, columnIndex, offsets);

        if (offsets) {
          offsets[column.index] = offset;
        }

        const styleProps = normalizeOffset(offset);

        this.setCellProperties(styleProps, visibleColumnIndex, rowIndex);
      }
    });
  }

  protected setColumnWidths(options): void {
    const hasStickyColumns = this.hasStickyColumns();
    const columnsResizerController = this.getController('columnsResizer');
    const isColumnResizing = columnsResizerController?.isResizing();

    super.setColumnWidths(options);

    if (hasStickyColumns && isColumnResizing) {
      this.setStickyOffsets();
    }
  }

  protected _resizeCore() {
    const hasStickyColumns = this.hasStickyColumns();
    const adaptiveColumns = this.getController('adaptiveColumns');
    const hidingColumnsQueue = adaptiveColumns?.getHidingColumnsQueue();

    super._resizeCore.apply(this, arguments as any);

    if (hasStickyColumns) {
      this.setStickyOffsets();

      if (hidingColumnsQueue?.length) {
        this._updateBorderClasses();
      }
    }
  }

  // TODO: Need to rename this method to hasFixedColumns after removing old fixed columns implementation
  public hasStickyColumns(): boolean {
    const stickyColumns = this._columnsController?.getStickyColumns();

    return this.option('columnFixing.legacyMode') !== true && !!stickyColumns.length;
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
) => class ColumnHeadersViewStickyColumnsExtender extends baseStickyColumns(Base) {
  protected setStickyOffsets() {
    const offsets: Record<number, Record<string, number>> = {};
    const rows = this._getRows();

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const isFilterRow = rows?.[rowIndex]?.rowType === 'filter';

      super.setStickyOffsets(rowIndex, isFilterRow ? undefined : offsets);
    }
  }

  protected _resizeCore() {
    super._resizeCore();

    if (this.hasStickyColumns()) {
      this.updateScrollPadding();
    }
  }

  public getContextMenuItems(options) {
    const { column } = options;
    const columnsController = this._columnsController;
    const columnFixingOptions: any = this.option('columnFixing');
    let items: any = super.getContextMenuItems(options);

    if (options.row && options.row.rowType === 'header') {
      if (columnFixingOptions.enabled === true && column && column.allowFixing) {
        const onItemClick = (params) => {
          // eslint-disable-next-line default-case
          switch (params.itemData.value) {
            case 'none':
              this._columnsController.columnOption(column.index, 'fixed', false);
              break;
            case 'left':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'left',
              });
              break;
            case 'right':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'right',
              });
              break;
            case 'sticky':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'sticky',
              });
              break;
          }
        };
        const fixedPositionItems = [
          {
            text: columnFixingOptions.texts.leftPosition,
            icon: columnFixingOptions.icons.leftPosition,
            value: 'left',
            disabled: column.fixed && (!column.fixedPosition || column.fixedPosition === 'left'),
            onItemClick,
          },
          {
            text: columnFixingOptions.texts.rightPosition,
            icon: columnFixingOptions.icons.rightPosition,
            value: 'right',
            disabled: column.fixed && column.fixedPosition === 'right',
            onItemClick,
          },
        ];

        if (this.option('columnFixing.legacyMode') !== true && !columnsController.isVirtualMode()) {
          fixedPositionItems.push({
            text: columnFixingOptions.texts.stickyPosition,
            icon: columnFixingOptions.icons.stickyPosition,
            value: 'sticky',
            disabled: column.fixed && column.fixedPosition === StickyPosition.Sticky,
            onItemClick,
          });
        }

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push(
          {
            text: columnFixingOptions.texts.fix,
            icon: columnFixingOptions.icons.fix,
            beginGroup: true,
            items: fixedPositionItems,
          },
          {
            text: columnFixingOptions.texts.unfix,
            icon: columnFixingOptions.icons.unfix,
            value: 'none',
            disabled: !column.fixed,
            onItemClick,
          },
        );
      }
    }
    return items;
  }

  public updateScrollPadding(): void {
    const $scrollContainer = $(this.getContent());
    const $cells = $(this.getColumnElements());

    GridCoreStickyColumnsDom.setScrollPadding(
      $cells,
      $scrollContainer,
      this.addWidgetPrefix.bind(this),
    );
  }
};

const rowsView = (
  Base: ModuleType<RowsView>,
) => class RowsViewStickyColumnsExtender extends baseStickyColumns(Base) {
  private _getMasterDetailWidth(): number {
    // @ts-expect-error
    const componentWidth = this.component.$element().width?.() ?? 0;
    return componentWidth - gridCoreUtils.getComponentBorderWidth(this, this._$element) - this.getScrollbarWidth();
  }

  protected _renderMasterDetailCell($row, row, options): dxElementWrapper {
    // @ts-expect-error
    const $detailCell: dxElementWrapper = super._renderMasterDetailCell($row, row, options);

    if (this.hasStickyColumns()) {
      $detailCell
        .addClass(this.addWidgetPrefix(CLASSES.stickyColumnLeft))
        // @ts-expect-error
        .width(this._getMasterDetailWidth());
    }

    return $detailCell;
  }

  private _updateMasterDetailWidths() {
    const width = this._getMasterDetailWidth();
    const $masterDetailCells = this._getRowElements().children('.dx-master-detail-cell');

    setWidth(
      $masterDetailCells,
      `${width}px`,
    );
  }

  protected setStickyOffsets(rowIndex?: number, offsets?: Record<number, Record<string, number>>) {
    super.setStickyOffsets(rowIndex, offsets);
    this.setStickyOffsetsForGroupCells();
  }

  private setStickyOffsetsForGroupCells() {
    const groupColumns = this._columnsController.getGroupColumns();
    let columns = this.getColumns();
    let widths = this.getColumnWidths();
    const columnsCountBeforeGroups = this._getColumnsCountBeforeGroups(columns);

    const rtlEnabled = this.option('rtlEnabled');

    if (rtlEnabled) {
      columns = rtlEnabled ? [...columns].reverse() : columns;
      widths = rtlEnabled ? [...widths].reverse() : widths;
    }

    const $tableElement = this.getTableElement()!;

    groupColumns.forEach((column) => {
      const columnIndex = columnsCountBeforeGroups + column.groupIndex + 1;
      const visibleColumnIndex = rtlEnabled ? columns.length - columnIndex - 1 : columnIndex;
      const offset = getStickyOffset(this._columnsController, columns, widths, visibleColumnIndex);
      const styleProps = normalizeOffset(offset);

      const $cells = $tableElement
        .children().children('.dx-group-row')
        .find(`.dx-group-cell[aria-colindex='${columnIndex + 1}']`);

      for (let i = 0; i < $cells.length; i += 1) {
        const cell = $cells.get(i) as HTMLElement;
        const container = $(cell).find('.dx-datagrid-group-row-container').get(0) as HTMLElement;
        Object.assign(cell.style, styleProps);
        Object.assign(container.style, styleProps);
      }
    });
  }

  protected _resizeCore() {
    const hasStickyColumns = this.hasStickyColumns();

    super._resizeCore.apply(this, arguments as any);

    if (hasStickyColumns) {
      this._updateMasterDetailWidths();
    }
  }

  protected _renderCellContent($cell, options, renderOptions) {
    if (!isGroupRow(options) || !this.hasStickyColumns()) {
      return super._renderCellContent($cell, options, renderOptions);
    }

    const $container = $('<div>')
      .addClass(this.addWidgetPrefix(CLASSES.groupRowContainer))
      .appendTo($cell);

    return super._renderCellContent($container, options, renderOptions);
  }

  protected _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    // @ts-expect-error
    super._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
    const stickySummarySelector = `.${this.addWidgetPrefix(CLASSES.stickyColumn)}`;

    if (
      $groupCell.parent().find(stickySummarySelector).length
      && GridCoreStickyColumnsDom.doesGroupCellEndInFirstColumn($groupCell)
    ) {
      GridCoreStickyColumnsDom
        .addStickyColumnBorderRightClass($groupCell, this.addWidgetPrefix.bind(this));
    }
  }

  protected _handleScroll(e): void {
    const hasStickyColumns = this.hasStickyColumns();

    super._handleScroll(e);

    if (hasStickyColumns) {
      const editorFactoryController = this.getController('editorFactory');
      const $focusOverlay = editorFactoryController.getFocusOverlay();

      if (!$focusOverlay?.hasClass(CLASSES.hidden)
        && $focusOverlay?.hasClass(CLASSES.focusedFixedCell)) {
        const $element = this.component.$element();
        // @ts-expect-error
        const $focusedCell = $element.find(`.${CLASSES.focused}`);
        const isStickyCell = GridCoreStickyColumnsDom
          .isStickyCell($focusedCell, this.addWidgetPrefix.bind(this));

        if (isStickyCell) {
          editorFactoryController.updateFocusOverlay($focusedCell);
        }
      }

      if (hasFixedColumnsWithStickyPosition(this._columnsController)) {
        // @ts-expect-error
        this._columnHeadersView?.updateScrollPadding();
      }
    }
  }

  public _scrollToElement($element, offset?) {
    let scrollOffset = offset;
    const hasStickyColumns = this.hasStickyColumns();
    const $row = $element?.closest('tr');
    const $cells = $row?.children();
    const $scrollContainer = this.getScrollable()?.container();

    if (hasStickyColumns && $cells.length) {
      scrollOffset = GridCoreStickyColumnsDom
        .getScrollPadding($cells, $scrollContainer, this.addWidgetPrefix.bind(this));
    }

    super._scrollToElement($element, scrollOffset);
  }
};

const footerView = (
  Base: ModuleType<any>,
) => class FooterViewStickyColumnsExtender extends baseStickyColumns(Base) {};

const columnsResizer = (Base: ModuleType<ColumnsResizerViewController>) => class ColumnResizerStickyColumnsExtender extends Base {
  protected getSeparatorOffsetX($cell: dxElementWrapper): number {
    // @ts-expect-error
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();

    if (hasStickyColumns) {
      const $container = $(this._columnHeadersView.getContent());
      const isFixedCellPinnedToRight = GridCoreStickyColumnsDom.isFixedCellPinnedToRight(
        $cell,
        $container,
        this.addWidgetPrefix.bind(this),
      );
      const isWidgetResizingMode = this.option('columnResizingMode') === 'widget';

      if (isWidgetResizingMode && isFixedCellPinnedToRight) {
        return $cell.offset()?.left ?? 0;
      }
    }

    return super.getSeparatorOffsetX($cell);
  }

  protected _correctColumnIndexForPoint(point, correctionValue: number, columns): void {
    const rtlEnabled = this.option('rtlEnabled');
    const isWidgetResizingMode = this.option('columnResizingMode') === 'widget';
    const columnIndex = Math.max(point.index - 1, 0);
    const column = columns[columnIndex];
    const nextColumnIndex = this._getNextColumnIndex(columnIndex);
    const nextColumn = columns[nextColumnIndex];

    if (isWidgetResizingMode && !isFixedEdge(point, column, nextColumn)) {
      const $container = $(this._columnHeadersView.getContent());
      const isFixedCellPinnedToRight = GridCoreStickyColumnsDom.isFixedCellPinnedToRight(
        $(point.item),
        $container,
        this.addWidgetPrefix.bind(this),
      );

      if (isFixedCellPinnedToRight) {
        point.columnIndex -= rtlEnabled ? 1 : 0;

        return;
      }
    }

    super._correctColumnIndexForPoint(point, correctionValue, columns);
  }

  protected _needToInvertResizing($cell: dxElementWrapper): boolean {
    const result = super._needToInvertResizing($cell);
    const isWidgetResizingMode = this.option('columnResizingMode') === 'widget';

    if (!result && isWidgetResizingMode) {
      const $container = $(this._columnHeadersView.getContent());

      return GridCoreStickyColumnsDom.isFixedCellPinnedToRight(
        $cell,
        $container,
        this.addWidgetPrefix.bind(this),
      );
    }

    return result;
  }

  protected _generatePointsByColumns(): void {
    // @ts-expect-error
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();

    super._generatePointsByColumns(hasStickyColumns);
  }

  protected _pointCreated(point, cellsLength, columns) {
    // @ts-expect-error
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();
    const result = super._pointCreated(point, cellsLength, columns);
    const needToCheckPoint = hasStickyColumns && cellsLength > 0;

    if (needToCheckPoint && !result) {
      const column = columns[point.index - 1];
      const nextColumnIndex = this._getNextColumnIndex(point.index - 1);
      const nextColumn = columns[nextColumnIndex];

      return GridCoreStickyColumnsDom.noNeedToCreateResizingPoint(
        this._columnHeadersView,
        {
          point,
          column,
          nextColumn,
        },
        this.addWidgetPrefix.bind(this),
      );
    }

    return result;
  }
};

const draggingHeader = (Base: ModuleType<DraggingHeaderViewController>) => class DraggingHeaderStickyColumnsExtender extends Base {
  public _generatePointsByColumns(options): any[] {
    // @ts-expect-error
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();
    const { sourceLocation, sourceColumn } = options;

    if (hasStickyColumns && sourceLocation === 'headers') {
      const columnFixedPosition = getColumnFixedPosition(this._columnsController, sourceColumn);

      switch (true) {
        case sourceColumn.fixed && columnFixedPosition === StickyPosition.Left:
          options.columnElements = GridCoreStickyColumnsDom.getLeftFixedCells(
            options.columnElements,
            this.addWidgetPrefix.bind(this),
          );
          options.startColumnIndex = options.columnElements.eq(0).index();
          break;
        case sourceColumn.fixed && columnFixedPosition === StickyPosition.Right:
          options.columnElements = GridCoreStickyColumnsDom.getRightFixedCells(
            options.columnElements,
            this.addWidgetPrefix.bind(this),
          );
          options.startColumnIndex = options.columnElements.eq(0).index();
          break;
        default:
          options.columnElements = GridCoreStickyColumnsDom.getNonFixedAndStickyCells(
            options.columnElements,
            this.addWidgetPrefix.bind(this),
          );
          options.startColumnIndex = options.columnElements.eq(0).index();
      }
    }

    return super._generatePointsByColumns(options, hasStickyColumns);
  }

  protected _pointCreated(point, columns, location, sourceColumn) {
    // @ts-expect-error
    const hasStickyColumns = this._columnHeadersView.hasStickyColumns();
    const $cells = this._columnHeadersView.getColumnElements();
    const needToCheckPoint = hasStickyColumns && location === 'headers' && $cells?.length
        && (!sourceColumn.fixed || sourceColumn.fixedPosition === StickyPosition.Sticky);
    const result = super._pointCreated(point, columns, location, sourceColumn);

    if (needToCheckPoint && !result) {
      return GridCoreStickyColumnsDom.noNeedToCreateReorderingPoint(
        point,
        $cells,
        $(this._columnHeadersView.getContent()),
        this.addWidgetPrefix.bind(this),
      );
    }

    return result;
  }
};

const editorFactory = (Base: ModuleType<EditorFactory>) => class EditorFactoryStickyColumnsExtender extends Base {
  public updateFocusOverlay($element: dxElementWrapper, isHideBorder = false): void {
    if (!isHideBorder) {
      const scrollable = this._rowsView.getScrollable();
      const $container = $(scrollable?.container());
      const isFixedCell = GridCoreStickyColumnsDom
        .isFixedCell($element, this.addWidgetPrefix.bind(this));
      const isStickyCell = GridCoreStickyColumnsDom
        .isStickyCell($element, this.addWidgetPrefix.bind(this));
      const isStickyCellPinned = isStickyCell && $container.length
        && GridCoreStickyColumnsDom
          .isStickyCellPinned($element, $container, this.addWidgetPrefix.bind(this));

      this._$focusOverlay.toggleClass(CLASSES.focusedFixedCell, isFixedCell);

      if (isFixedCell && (!isStickyCell || isStickyCellPinned)) {
        this._$focusOverlay.css('position', 'fixed');
      } else {
        this._$focusOverlay.css('position', '');
      }
    }

    super.updateFocusOverlay($element, isHideBorder);
  }
};

export const stickyColumnsModule = {
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView,
    },
    controllers: {
      columnsResizer,
      draggingHeader,
      editorFactory,
    },
  },
};
