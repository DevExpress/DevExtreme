/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { getBoundingRect } from '@js/core/utils/position';
import { getWidth, setWidth } from '@js/core/utils/size';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';
import { getElementLocationInternal } from '@ts/ui/scroll_view/utils/get_element_location_internal';

import { HIDDEN_COLUMNS_WIDTH } from '../adaptivity/const';
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type {
  ColumnsResizerViewController,
  DraggingHeaderViewController,
} from '../columns_resizing_reordering/m_columns_resizing_reordering';
import type { KeyboardNavigationController } from '../keyboard_navigation/m_keyboard_navigation';
import {
  isAdaptiveItem,
  isGroupFooterRow,
  isGroupRow as isGroupRowElement,
} from '../keyboard_navigation/m_keyboard_navigation_utils';
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
  isFirstFixedColumn,
  isFixedEdge,
  isLastFixedColumn,
  needToDisableStickyColumn,
  needToRemoveColumnBorder,
  normalizeOffset,
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
    const needToRemoveBorder = needToRemoveColumnBorder(
      columnsController,
      column,
      rowIndex,
      isRowsView,
    );
    const isFirstColumn = columnsController?.isFirstColumn(column, rowIndex);

    GridCoreStickyColumnsDom
      .toggleColumnNoBorderClass($cell, needToRemoveBorder, this.addWidgetPrefix.bind(this));
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
};

const rowsView = (
  Base: ModuleType<RowsView>,
) => class RowsViewStickyColumnsExtender extends baseStickyColumns(Base) {
  private _getMasterDetailWidth(): number {
    const componentWidth = getWidth(this.component.$element()) ?? 0;
    const borderWidth = gridCoreUtils.getComponentBorderWidth(this, this._$element);

    return componentWidth - borderWidth - this.getScrollbarWidth();
  }

  protected _renderMasterDetailCell($row, row, options): dxElementWrapper {
    // @ts-expect-error
    const $detailCell: dxElementWrapper = super._renderMasterDetailCell($row, row, options);

    if (this.hasStickyColumns()) {
      $detailCell.addClass(this.addWidgetPrefix(CLASSES.stickyColumnLeft));
      setWidth($detailCell, this._getMasterDetailWidth());
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
      const hasOverlayElements = editorFactoryController.hasOverlayElements();

      if (hasOverlayElements) {
        const $focusedElement = editorFactoryController.focus();

        editorFactoryController.focus($focusedElement);
      }
    }
  }

  public _scrollToElement($element, offset?) {
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
  private getOverlayContainerIfNeeded($cell: dxElementWrapper): dxElementWrapper | undefined {
    // @ts-expect-error
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

  protected updateFocusOverlaySize($element, position): void {
    // @ts-expect-error
    const hasFixedColumns = this._rowsView.hasStickyColumns();

    if (!hasFixedColumns) {
      super.updateFocusOverlaySize($element, position);
    }
  }

  protected getFocusOverlaySize($element: dxElementWrapper): { width: number; height: number } {
    // @ts-expect-error
    const hasFixedColumns = this._rowsView.hasStickyColumns();

    if (hasFixedColumns) {
      const elementRect = getBoundingRect($element.get(0));
      const isLastCell = GridCoreStickyColumnsDom.isLastCell($element);
      const isFixedCell = GridCoreStickyColumnsDom.isFixedCell(
        $element,
        this.addWidgetPrefix.bind(this),
      );

      return {
        width: elementRect.right - elementRect.left + (isLastCell || isFixedCell ? 0 : 1),
        height: elementRect.bottom - elementRect.top,
      };
    }

    return super.getFocusOverlaySize($element);
  }

  protected getValidationMessageContainer($cell: dxElementWrapper): dxElementWrapper {
    // @ts-expect-error
    return this.getOverlayContainerIfNeeded($cell) ?? super.getValidationMessageContainer($cell);
  }

  protected getRevertButtonContainer($cell: dxElementWrapper): dxElementWrapper {
    // @ts-expect-error
    return this.getOverlayContainerIfNeeded($cell) ?? super.getRevertButtonContainer($cell);
  }

  protected getFocusOverlayContainer($focusedElement: dxElementWrapper): dxElementWrapper {
    return this.getOverlayContainerIfNeeded($focusedElement)
      ?? super.getFocusOverlayContainer($focusedElement);
  }

  protected overlayPositionedHandler(e, isOverlayVisible: boolean): void {
    const columnHeaders = this.getView('columnHeadersView');
    // @ts-expect-error
    const hasStickyColumns = columnHeaders.hasStickyColumns();
    // @ts-expect-error
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

        // @ts-expect-error
        $wrapper.css('zIndex', isOutsideVisibleArea ? 1 : this?.getOverlayBaseZIndex() ?? 0);
      }
    }
  }

  protected updateFocusOverlay($element: dxElementWrapper, isHideBorder = false): void {
    if (!isHideBorder) {
      const isFixedCell = GridCoreStickyColumnsDom
        .isFixedCell($element, this.addWidgetPrefix.bind(this));
      this._$focusOverlay.toggleClass(CLASSES.focusedFixedElement, isFixedCell);
      const isGroupElement = isGroupRowElement($element);
      const isGroupFooterRowElement = isGroupFooterRow($element);
      const isAdaptiveElement = isAdaptiveItem($element);

      if (isFixedCell || isGroupElement || isGroupFooterRowElement || isAdaptiveElement) {
        this._$focusOverlay.toggleClass(CLASSES.focusedFixedElement, true);
      }
    }

    super.updateFocusOverlay($element, isHideBorder);
  }
};

const resizing = (Base: ModuleType<ResizingController>) => class ResizingStickyColumnsExtender extends Base {
  public resize(): DeferredObj<unknown> {
    const result = super.resize();
    // @ts-expect-error ColumnHeadersView's method
    const hasStickyColumns = this._columnHeadersView.hasStickyColumns();

    // @ts-expect-error Resizing's method
    if (hasStickyColumns && this?.hasResizeTimeout()) {
      // @ts-expect-error RowsView's method
      this._rowsView.setStickyOffsets();
    }

    return result;
  }
};

const keyboardNavigation = (Base: ModuleType<KeyboardNavigationController>) => class KeyboardNavigationStickyColumnsExtender extends Base {
  // TODO Salimov: Most likely, we will need to remove the subscription
  // for headers after we implement sticky headers (pqKdLLL1).
  // Perhaps the headers will be rendered in the same table with data cells.
  // And this code will no longer be needed.
  protected headerTabKeyHandler({ originalEvent, shift }) {
    // @ts-expect-error columnHeadersView's method
    const hasStickyColumns = this._columnHeadersView?.hasStickyColumns();
    const scrollable = this._rowsView?.getScrollable();

    if (hasStickyColumns && scrollable) {
      const $cell = $(originalEvent.target).closest('td');
      const $nextCell = GridCoreStickyColumnsDom.getNextHeaderCell(
        $cell,
        shift ? 'previous' : 'next',
      );
      const isFixedCell = GridCoreStickyColumnsDom
        .isFixedCell($nextCell, this.addWidgetPrefix.bind(this));

      if ($nextCell.length && !isFixedCell) {
        const $cells = $(this._columnHeadersView.getColumnElements());
        const cellIsOutsideVisibleArea = GridCoreStickyColumnsDom.isOutsideVisibleArea(
          $nextCell,
          $cells,
          $(this._columnHeadersView.getContent()),
          this.addWidgetPrefix.bind(this),
        );

        if (cellIsOutsideVisibleArea) {
          const scrollPadding = GridCoreStickyColumnsDom.getScrollPadding(
            $cells,
            $(scrollable.container()),
            this.addWidgetPrefix.bind(this),
          );
          const scrollPosition = getElementLocationInternal(
            $nextCell[0],
            'horizontal',
            $(this._columnHeadersView.getContent())[0],
            scrollable.scrollOffset(),
            scrollPadding,
            this.addWidgetPrefix('table'),
          );

          scrollable.scrollTo({ x: scrollPosition });
        }
      }
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
      keyboardNavigation,
    },
  },
};
