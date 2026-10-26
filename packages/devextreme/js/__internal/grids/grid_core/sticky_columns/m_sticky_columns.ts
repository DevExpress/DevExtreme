/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { getBoundingRect } from '@js/core/utils/position';
import { getWidth, setWidth } from '@js/core/utils/size';
import type { ItemClickEvent } from '@js/ui/context_menu';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type {
  DraggingPointCreatedOptions,
  DraggingPointsOptions,
} from '@ts/grids/grid_core/columns_resizing_reordering/types';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';
import type { HorizontalBounds } from '@ts/grids/grid_core/keyboard_navigation/types';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { ElementOffset } from '@ts/ui/scroll_view/types';

import { HIDDEN_COLUMNS_WIDTH } from '../adaptivity/const';
import type { ColumnHeadersView } from '../column_headers/column_headers';
import type { Column } from '../columns_controller/types';
import type {
  ColumnsResizerViewController,
  DraggingHeaderViewController,
} from '../columns_resizing_reordering/m_columns_resizing_reordering';
import type { HeadersKeyboardNavigationController } from '../keyboard_navigation/headers_keyboard_navigation';
import {
  isAdaptiveItem,
  isGroupFooterRow,
  isGroupRow as isGroupRowElement,
} from '../keyboard_navigation/utils';
import { CLASSES as MASTER_DETAIL_CLASSES } from '../master_detail/const';
import { isDetailRow } from '../master_detail/utils';
import type { ColumnPoint, ColumnPointProps, ModuleType } from '../types';
import gridCoreUtils from '../utils';
import type { ColumnsView } from '../views/columns_view';
import type { RowsView } from '../views/rows_view';
import { isGroupRow } from '../views/rows_view';
import type {
  CellRenderOptions,
  ColumnWidthsOptions,
  ContextMenuItemsOptions,
  GridContextMenuItem,
  RowRenderOptions,
  RowsViewScrollEvent,
  ViewCellOptions,
  ViewRow,
} from '../views/types';
import { CLASSES, StickyPosition } from './const';
import { GridCoreStickyColumnsDom } from './dom';
import type {
  StickyColumnHeadersView,
  StickyColumnsColumnsViewExtension,
  StickyOffsets,
  StickyRowsView,
} from './types';
import {
  getColumnFixedPosition,
  getStickyOffset,
  isFirstFixedColumn,
  isFixedEdge,
  isLastFixedColumn,
  needToDisableStickyColumn,
  needToRemoveColumnBorder,
  normalizeOffset,
  processFixedColumns,
} from './utils';

const baseStickyColumns = <T extends ModuleType<ColumnsView>>(
  Base: T,
): T & ModuleType<
  ColumnsView & StickyColumnsColumnsViewExtension
> => class BaseStickyColumnsExtender extends Base {
  private _addStickyColumnBorderLeftClass(
    $cell: dxElementWrapper,
    column: Column,
    rowIndex: number | null,
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
    column: Column,
    rowIndex: number | null,
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

  private toggleColumnNoBorderClass(
    $cell: dxElementWrapper,
    column: Column,
    rowIndex: number | null,
  ): void {
    const columnsController = this._columnsController;
    const isRowsView = this.name === 'rowsView';
    const needToRemoveBorder = needToRemoveColumnBorder(
      columnsController,
      column,
      rowIndex,
      isRowsView,
    );

    GridCoreStickyColumnsDom
      .toggleColumnNoBorderClass($cell, needToRemoveBorder, this.addWidgetPrefix.bind(this));
  }

  private updateColumnNoBorderClasses(): void {
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
          this.toggleColumnNoBorderClass($cell, column, rowIndex);
        }
      });
    });
  }

  protected _renderCore(options?: DataChange): DeferredObj<unknown> {
    const deferred = super._renderCore(options);
    const $element = this.element();
    const hasStickyColumns = this.hasStickyColumns();

    GridCoreStickyColumnsDom.toggleStickyColumnsClass(
      $element,
      hasStickyColumns,
      this.addWidgetPrefix.bind(this),
    );

    if (hasStickyColumns) {
      return deferred.done(() => {
        this.setStickyOffsets();
      });
    }

    return deferred;
  }

  protected _createCell(options: ViewCellOptions): dxElementWrapper {
    const { column } = options;
    const { rowType } = options;
    const $cell = super._createCell(options);
    const hasStickyColumns = this.hasStickyColumns();
    const rowIndex = rowType === 'header' ? options.rowIndex ?? null : null;
    const isSummary = rowType === 'groupFooter' || rowType === 'totalFooter' || rowType === 'group';
    const isExpandColumn = column.command && column.command === 'expand';

    if (!hasStickyColumns || needToDisableStickyColumn(this._columnsController, column)) {
      return $cell;
    }

    this.toggleColumnNoBorderClass($cell, column, rowIndex);

    if (!column.fixed) {
      return $cell;
    }

    const fixedPosition = getColumnFixedPosition(this._columnsController, column);

    GridCoreStickyColumnsDom.addStickyColumnClass(
      $cell,
      fixedPosition,
      this.addWidgetPrefix.bind(this),
    );

    if (isSummary || isExpandColumn) {
      return $cell;
    }

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

    return $cell;
  }

  public setStickyOffsets(rowIndex?: number, offsets?: StickyOffsets): void {
    const columnsController = this._columnsController;
    const rtlEnabled = this.option('rtlEnabled');
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

        if (offsets && column.index !== undefined) {
          offsets[column.index] = offset;
        }

        const styleProps = normalizeOffset(offset);

        this.setCellProperties(styleProps, visibleColumnIndex, rowIndex);
      }
    });
  }

  protected setColumnWidths(options: ColumnWidthsOptions): void {
    const hasStickyColumns = this.hasStickyColumns();
    const columnsResizerController = this.getController('columnsResizer');
    const isColumnResizing = columnsResizerController?.isResizing();

    super.setColumnWidths(options);

    if (hasStickyColumns && isColumnResizing) {
      this.setStickyOffsets();
    }
  }

  protected _resizeCore(): void {
    const hasStickyColumns = this.hasStickyColumns();
    const hasHidingColumnsQueue = !!this.adaptiveColumnsController
      ?.getHidingColumnsQueue()?.length;

    super._resizeCore.apply(this);

    if (!hasStickyColumns) {
      return;
    }

    this.setStickyOffsets();

    if (hasHidingColumnsQueue) {
      this.updateColumnNoBorderClasses();
    }
  }

  // TODO: Need to rename this method to hasFixedColumns
  // after removing old fixed columns implementation
  public hasStickyColumns(): boolean {
    const stickyColumns = this._columnsController?.getStickyColumns();

    return this.option('columnFixing.legacyMode') !== true && !!stickyColumns.length;
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<StickyColumnHeadersView> => class ColumnHeadersViewStickyColumnsExtender
  extends baseStickyColumns(Base) {
  public setStickyOffsets(): void {
    const offsets: StickyOffsets = {};
    const rows = this._getRows();

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const isFilterRow = rows?.[rowIndex]?.rowType === 'filter';

      super.setStickyOffsets(rowIndex, isFilterRow ? undefined : offsets);
    }
  }

  public getContextMenuItems(
    options: ContextMenuItemsOptions,
  ): GridContextMenuItem[] | undefined {
    const { column } = options;
    const columnsController = this._columnsController;
    const columnFixingOptions = this.option('columnFixing');
    let items = super.getContextMenuItems(options);

    if (options.row?.rowType === 'header') {
      if (columnFixingOptions?.enabled === true && column && column.allowFixing) {
        const onItemClick = (params: ItemClickEvent): void => {
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
        const fixedPositionItems: GridContextMenuItem[] = [
          {
            text: columnFixingOptions.texts?.leftPosition,
            icon: columnFixingOptions.icons?.leftPosition,
            value: 'left',
            disabled: column.fixed && (!column.fixedPosition || column.fixedPosition === 'left'),
            onItemClick,
          },
          {
            text: columnFixingOptions.texts?.rightPosition,
            icon: columnFixingOptions.icons?.rightPosition,
            value: 'right',
            disabled: column.fixed && column.fixedPosition === 'right',
            onItemClick,
          },
        ];

        if (this.option('columnFixing.legacyMode') !== true && !columnsController.isVirtualMode()) {
          fixedPositionItems.push({
            text: columnFixingOptions.texts?.stickyPosition,
            icon: columnFixingOptions.icons?.stickyPosition,
            value: 'sticky',
            disabled: column.fixed && column.fixedPosition === StickyPosition.Sticky,
            onItemClick,
          });
        }

        items ??= [];
        items.push(
          {
            text: columnFixingOptions.texts?.fix,
            icon: columnFixingOptions.icons?.fix,
            beginGroup: true,
            items: fixedPositionItems,
          },
          {
            text: columnFixingOptions.texts?.unfix,
            icon: columnFixingOptions.icons?.unfix,
            value: 'none',
            disabled: !column.fixed,
            onItemClick,
          },
        );
      }
    }
    return items;
  }
};

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<StickyRowsView> => class RowsViewStickyColumnsExtender
  extends baseStickyColumns(Base) {
  private _getMasterDetailWidth(): number {
    const componentWidth = getWidth(this.component.$element().get(0)) ?? 0;
    const borderWidth = gridCoreUtils.getComponentBorderWidth(this, this._$element);

    return componentWidth - borderWidth - this.getScrollbarWidth();
  }

  protected _renderMasterDetailCell(
    $row: dxElementWrapper,
    row: ViewRow,
    options: RowRenderOptions,
  ): dxElementWrapper {
    // @ts-expect-error _renderMasterDetailCell is declared on the master detail extender
    const $detailCell: dxElementWrapper = super._renderMasterDetailCell($row, row, options);

    if (this.hasStickyColumns()) {
      const detailContainerSelector = `.${this.addWidgetPrefix(MASTER_DETAIL_CLASSES.detailContainer)}`;
      const $detailContainer = $detailCell.find(detailContainerSelector);

      $detailContainer.addClass(this.addWidgetPrefix(CLASSES.stickyColumnLeft));

      setWidth($detailContainer, this._getMasterDetailWidth());
    }

    return $detailCell;
  }

  private _updateMasterDetailWidths(): void {
    const $detailContainers = this._getRowElements()
      .children(`.${MASTER_DETAIL_CLASSES.detailCell}`)
      .children(`.${this.addWidgetPrefix(MASTER_DETAIL_CLASSES.detailContainer)}`);

    const width = this._getMasterDetailWidth();

    setWidth(
      $detailContainers,
      `${width}px`,
    );
  }

  public setStickyOffsets(rowIndex?: number, offsets?: StickyOffsets): void {
    super.setStickyOffsets(rowIndex, offsets);
    this.setStickyOffsetsForGroupCells();
  }

  private setStickyOffsetsForGroupCells(): void {
    const groupColumns = this._columnsController.getGroupColumns();
    let columns = this.getColumns();
    let widths = this.getColumnWidths();
    const columnsCountBeforeGroups = this._getColumnsCountBeforeGroups(columns);

    const rtlEnabled = this.option('rtlEnabled');

    if (rtlEnabled) {
      columns = rtlEnabled ? [...columns].reverse() : columns;
      widths = rtlEnabled ? [...widths].reverse() : widths;
    }

    // @ts-expect-error the view is rendered here
    const $tableElement: dxElementWrapper = this.getTableElement();

    groupColumns.forEach((column) => {
      const columnIndex = columnsCountBeforeGroups + column.groupIndex + 1;
      const visibleColumnIndex = rtlEnabled ? columns.length - columnIndex - 1 : columnIndex;
      const offset = getStickyOffset(this._columnsController, columns, widths, visibleColumnIndex);
      const styleProps = normalizeOffset(offset);

      const $cells = $tableElement
        .children().children(`.${VIEW_CLASSES.groupRow}`)
        .find(`.${VIEW_CLASSES.groupCell}[aria-colindex='${columnIndex + 1}']`);

      for (let i = 0; i < $cells.length; i += 1) {
        const cell = $cells.get(i) as HTMLElement;
        const container = $(cell).find('.dx-datagrid-group-row-container').get(0) as HTMLElement;
        Object.assign(cell.style, styleProps);
        Object.assign(container.style, styleProps);
      }
    });
  }

  protected _resizeCore(): void {
    const hasStickyColumns = this.hasStickyColumns();

    super._resizeCore();

    if (hasStickyColumns) {
      this._updateMasterDetailWidths();
    }
  }

  protected _renderCellContent(
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    const hasStickyColumns = this.hasStickyColumns();
    const isGroupRowResult = isGroupRow(options);
    const isDetailRowResult = isDetailRow(options);
    const needWrapContent = isGroupRowResult || isDetailRowResult;

    if (!hasStickyColumns || !needWrapContent) {
      return super._renderCellContent($cell, options, renderOptions);
    }

    const $container = $('<div>')
      .toggleClass(this.addWidgetPrefix(CLASSES.groupRowContainer), isGroupRowResult)
      .toggleClass(this.addWidgetPrefix(MASTER_DETAIL_CLASSES.detailContainer), isDetailRowResult)
      .appendTo($cell);

    return super._renderCellContent($container, options, renderOptions);
  }

  protected _renderGroupSummaryCellsCore(
    $groupCell: dxElementWrapper,
    options: RowRenderOptions,
    groupCellColSpan: number,
    alignByColumnCellCount: number,
  ): void {
    // @ts-expect-error _renderGroupSummaryCellsCore is defined by DataGrid summary
    super._renderGroupSummaryCellsCore(
      $groupCell,
      options,
      groupCellColSpan,
      alignByColumnCellCount,
    );
    const stickySummarySelector = `.${this.addWidgetPrefix(CLASSES.stickyColumn)}`;

    if (
      $groupCell.parent().find(stickySummarySelector).length
      && GridCoreStickyColumnsDom.doesGroupCellEndInFirstColumn($groupCell)
    ) {
      GridCoreStickyColumnsDom
        .addStickyColumnBorderRightClass($groupCell, this.addWidgetPrefix.bind(this));
    }
  }

  protected _handleScroll(e: RowsViewScrollEvent): void {
    const hasStickyColumns = this.hasStickyColumns();

    super._handleScroll(e);

    if (hasStickyColumns) {
      const editorFactoryController = this.getController('editorFactory');
      const hasOverlayElements = editorFactoryController.hasOverlayElements();

      if (hasOverlayElements) {
        const $focusedElement = editorFactoryController.focus();

        editorFactoryController.focus($focusedElement);
      }
    }
  }

  public _scrollToElement($element: dxElementWrapper, offset?: ElementOffset): void {
    let scrollOffset = offset;
    const scrollable = this.getScrollable();
    const hasStickyColumns = this.hasStickyColumns();

    if (hasStickyColumns && scrollable) {
      const isFixedCell = GridCoreStickyColumnsDom
        .isFixedCell($element, this.addWidgetPrefix.bind(this));

      if (!$element.is('td') || isFixedCell) {
        return;
      }

      const $row = $element?.closest('tr');
      const $cells = $row?.children();

      scrollOffset = GridCoreStickyColumnsDom
        .getScrollPadding($cells, $(scrollable.container()), this.addWidgetPrefix.bind(this));
    }

    super._scrollToElement($element, scrollOffset);
  }
};

const footerView = <T extends ModuleType<ColumnsView>>(
  Base: T,
): T => class FooterViewStickyColumnsExtender extends baseStickyColumns(Base) {};

const columnsResizer = (
  Base: ModuleType<ColumnsResizerViewController>,
): ModuleType<ColumnsResizerViewController> => class ColumnResizerStickyColumnsExtender
  extends Base {
  protected declare _columnHeadersView: StickyColumnHeadersView;

  private isNextCellPinned($nextCell: dxElementWrapper, $container: dxElementWrapper): boolean {
    const addWidgetPrefix = this.addWidgetPrefix.bind(this);

    return this.option('rtlEnabled')
      ? GridCoreStickyColumnsDom.isFixedCellPinnedToLeft($nextCell, $container, addWidgetPrefix)
      : GridCoreStickyColumnsDom.isFixedCellPinnedToRight($nextCell, $container, addWidgetPrefix);
  }

  protected getSeparatorOffsetX($cell: dxElementWrapper, $nextCell: dxElementWrapper): number {
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

      if (!isWidgetResizingMode && this.isNextCellPinned($nextCell, $container)) {
        const nextCellOffsetX: number = $nextCell.offset()?.left ?? 0;
        const nextCellWidth: number = $nextCell[0].getBoundingClientRect().width;

        return this.option('rtlEnabled') ? nextCellOffsetX + nextCellWidth : nextCellOffsetX;
      }
    }

    return super.getSeparatorOffsetX($cell, $nextCell);
  }

  protected _correctColumnIndexForPoint(
    point: ColumnPointProps,
    correctionValue: number,
    columns: Column[],
  ): void {
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
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();

    super._generatePointsByColumns(hasStickyColumns);
  }

  protected _pointCreated(
    point: ColumnPointProps,
    columns: Column[],
    cells?: dxElementWrapper,
  ): boolean {
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();
    const result = super._pointCreated(point, columns, cells);
    const cellsLength = cells?.length ?? columns.length;
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
          cells,
        },
        this.addWidgetPrefix.bind(this),
      );
    }

    return result;
  }
};

const draggingHeader = (
  Base: ModuleType<DraggingHeaderViewController>,
): ModuleType<DraggingHeaderViewController> => class DraggingHeaderStickyColumnsExtender
  extends Base {
  protected declare _columnHeadersView: StickyColumnHeadersView;

  public _generatePointsByColumns(options: DraggingPointsOptions): ColumnPoint[] {
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();
    const { sourceLocation, sourceColumn, targetDraggingPanel } = options;
    const isDraggingBetweenHeaders = sourceLocation === 'headers' && targetDraggingPanel?.getName() === 'headers';

    if (hasStickyColumns && isDraggingBetweenHeaders) {
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

  protected _pointCreated({
    point, columns, location, sourceColumn, cells,
  }: DraggingPointCreatedOptions): boolean {
    const hasStickyColumns = this._columnHeadersView.hasStickyColumns();
    const needToCheckPoint = hasStickyColumns && location === 'headers' && cells?.length
        && (!sourceColumn?.fixed || sourceColumn.fixedPosition === StickyPosition.Sticky);
    const result = super._pointCreated({
      point, columns, location, sourceColumn,
    });

    if (needToCheckPoint && !result) {
      return GridCoreStickyColumnsDom.noNeedToCreateReorderingPoint(
        point,
        cells,
        $(this._columnHeadersView.getContent()),
        this.addWidgetPrefix.bind(this),
      );
    }

    return result;
  }
};

const editorFactory = (
  Base: ModuleType<EditorFactory>,
): ModuleType<EditorFactory> => class EditorFactoryStickyColumnsExtender extends Base {
  protected declare _rowsView: StickyRowsView;

  private getOverlayContainerIfNeeded($cell: dxElementWrapper): dxElementWrapper | undefined {
    const hasFixedColumns = this._rowsView.hasStickyColumns();
    const isFixedCell = GridCoreStickyColumnsDom.isFixedCell(
      $cell,
      this.addWidgetPrefix.bind(this),
    );

    if (hasFixedColumns && isFixedCell) {
      return $cell.closest(`.${this.addWidgetPrefix(CLASSES.stickyColumns)}`);
    }

    return undefined;
  }

  protected updateFocusOverlaySize($element: dxElementWrapper, position: object): void {
    const hasFixedColumns = this._rowsView.hasStickyColumns();

    if (!hasFixedColumns) {
      super.updateFocusOverlaySize($element, position);
    }
  }

  protected getFocusOverlaySize($element: dxElementWrapper): { width: number; height: number } {
    const hasFixedColumns = this._rowsView.hasStickyColumns();

    if (hasFixedColumns) {
      const elementRect = getBoundingRect($element.get(0));
      const isLastCell = GridCoreStickyColumnsDom.isLastCell($element);
      const isFixedCell = GridCoreStickyColumnsDom.isFixedCell(
        $element,
        this.addWidgetPrefix.bind(this),
      );
      const isGroupElement = isGroupRowElement($element);
      const isGroupFooter = isGroupFooterRow($element);
      const noExtraWidth = isLastCell || isFixedCell || isGroupElement || isGroupFooter;

      return {
        width: elementRect.right - elementRect.left + (noExtraWidth ? 0 : 1),
        height: elementRect.bottom - elementRect.top,
      };
    }

    return super.getFocusOverlaySize($element);
  }

  protected getValidationMessageContainer($cell: dxElementWrapper): dxElementWrapper {
    // @ts-expect-error getValidationMessageContainer is declared on the validating extender
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- validating extender adds it
    return this.getOverlayContainerIfNeeded($cell) ?? super.getValidationMessageContainer($cell);
  }

  protected getRevertButtonContainer($cell: dxElementWrapper): dxElementWrapper {
    // @ts-expect-error getRevertButtonContainer is declared on the validating extender
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- validating extender adds it
    return this.getOverlayContainerIfNeeded($cell) ?? super.getRevertButtonContainer($cell);
  }

  protected overlayPositionedHandler(e, isOverlayVisible: boolean): void {
    const columnHeaders = this.getView('columnHeadersView') as StickyColumnHeadersView;
    const hasStickyColumns = columnHeaders.hasStickyColumns();
    // @ts-expect-error overlayPositionedHandler is declared on the validating extender
    super.overlayPositionedHandler(e, isOverlayVisible);

    if (hasStickyColumns) {
      const $cell = $(e.element).closest('td');

      if (!GridCoreStickyColumnsDom.isFixedCell($cell, this.addWidgetPrefix.bind(this))) {
        const $wrapper = e.component.$wrapper();
        const $overlayContent = e.component.$content();
        const isOutsideVisibleArea = GridCoreStickyColumnsDom
          .isOutsideVisibleArea(
            $overlayContent,
            $(columnHeaders.getColumnElements()),
            $(columnHeaders.getContent()),
            this.addWidgetPrefix.bind(this),
          );

        // @ts-expect-error getOverlayBaseZIndex is declared on the validating extender
        $wrapper.css('zIndex', isOutsideVisibleArea ? 1 : this?.getOverlayBaseZIndex() ?? 0);
      }
    }
  }

  protected updateFocusOverlay($element: dxElementWrapper, isHideBorder = false): void {
    if (!isHideBorder) {
      const isFixedCell = GridCoreStickyColumnsDom
        .isFixedCell($element, this.addWidgetPrefix.bind(this));
      this._$focusOverlay?.toggleClass(CLASSES.focusedFixedElement, isFixedCell);
      const isGroupElement = isGroupRowElement($element);
      const isGroupFooterRowElement = isGroupFooterRow($element);
      const isAdaptiveElement = isAdaptiveItem($element);

      if (isFixedCell || isGroupElement || isGroupFooterRowElement || isAdaptiveElement) {
        this._$focusOverlay?.toggleClass(CLASSES.focusedFixedElement, true);
      }
    }

    super.updateFocusOverlay($element, isHideBorder);
  }
};

const resizing = (
  Base: ModuleType<ResizingController>,
): ModuleType<ResizingController> => class ResizingStickyColumnsExtender extends Base {
  protected declare _columnHeadersView: StickyColumnHeadersView;

  protected declare _rowsView: StickyRowsView;

  public resize(): DeferredObj<unknown> {
    const result = super.resize();
    const hasStickyColumns = this._columnHeadersView.hasStickyColumns();

    // @ts-expect-error hasResizeTimeout is declared on the virtual scrolling extender
    if (hasStickyColumns && this?.hasResizeTimeout()) {
      this._rowsView.setStickyOffsets();
    }

    return result;
  }
};

const headersKeyboardNavigation = (
  Base: ModuleType<HeadersKeyboardNavigationController>,
): ModuleType<
  HeadersKeyboardNavigationController
> => class HeadersKeyboardNavigationStickyColumnsExtender extends Base {
  protected declare _columnHeadersView: StickyColumnHeadersView;

  protected getContainerBoundingRect($container: dxElementWrapper): HorizontalBounds {
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();

    if (hasStickyColumns) {
      const $cells = $(this._columnHeadersView.getColumnElements());

      return GridCoreStickyColumnsDom.getNonFixedAreaBoundingRect(
        $cells,
        $container,
        this.addWidgetPrefix.bind(this),
      );
    }

    return super.getContainerBoundingRect($container);
  }

  // TODO Salimov: Most likely, we will need to remove the subscription
  // for headers after we implement sticky headers (pqKdLLL1).
  // Perhaps the headers will be rendered in the same table with data cells.
  // And this code will no longer be needed.
  protected tabKeyHandler({ originalEvent, shift }: KeyboardKeyDownEvent): void {
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();
    const scrollable = this.getView('rowsView')?.getScrollable();

    if (!hasStickyColumns || !scrollable) {
      return;
    }

    const $cell = $(originalEvent.target).closest('td');
    const $nextCell = GridCoreStickyColumnsDom.getNextHeaderCell(
      $cell,
      shift ? 'previous' : 'next',
    );
    const isFixedCell = GridCoreStickyColumnsDom
      .isFixedCell($nextCell, this.addWidgetPrefix.bind(this));

    if (isFixedCell) {
      return;
    }

    const nextCellIsOutsideVisibleArea = $nextCell.length && this.isOutsideVisibleArea(
      $nextCell,
      $(this._columnHeadersView.getContent()),
    );

    if (nextCellIsOutsideVisibleArea) {
      this.scrollToNextCell($nextCell);
    }
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
      resizing,
      headersKeyboardNavigation,
    },
  },
};
