/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type {
  ColumnsResizerViewController,
} from '../columns_resizing_reordering/m_columns_resizing_reordering';
import type { ModuleType } from '../m_types';
import type { ColumnsView } from '../views/m_columns_view';
import type { RowsView } from '../views/m_rows_view';
import { StickyPosition } from './const';
import { GridCoreStickyColumnsDom } from './dom';
import {
  getColumnFixedPosition,
  getStickyOffset,
  isFirstFixedColumn,
  isFixedEdge,
  isLastFixedColumn,
  normalizeOffset,
  prevColumnIsFixed,
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

  protected _isStickyColumns(): boolean {
    const stickyColumns = this._columnsController?.getStickyColumns();

    return this.option('columnFixing.legacyMode') !== true && !!stickyColumns.length;
  }

  protected _renderCore(options?) {
    super._renderCore(options);

    const $element = this.element();
    const isStickyColumns = this._isStickyColumns();

    GridCoreStickyColumnsDom.toggleStickyColumnsClass(
      $element,
      isStickyColumns,
      this.addWidgetPrefix.bind(this),
    );
  }

  protected _createCell(options) {
    const { column } = options;
    const { rowType } = options;
    const $cell = super._createCell(options);
    const isStickyColumns = this._isStickyColumns();

    if (isStickyColumns && column.fixed) {
      const rowIndex = rowType === 'header' ? options.rowIndex : null;
      const fixedPosition = getColumnFixedPosition(column);

      GridCoreStickyColumnsDom.addStickyColumnClass(
        $cell,
        column,
        this.addWidgetPrefix.bind(this),
      );

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

    return $cell;
  }

  protected setStickyOffsets(rowIndex?: number, offsets?: Record<number, Record<string, number>>): void {
    let columns = this.getColumns(rowIndex);
    let widths = this.getColumnWidths(undefined, rowIndex);
    const rtlEnabled = this.option('rtlEnabled') as boolean;

    if (rtlEnabled) {
      columns = rtlEnabled ? [...columns].reverse() : columns;
      widths = rtlEnabled ? [...widths].reverse() : widths;
    }

    columns.forEach((column, columnIndex) => {
      if (column.fixed) {
        const visibleColumnIndex = rtlEnabled ? columns.length - columnIndex - 1 : columnIndex;
        const offset = getStickyOffset(columns, widths, columnIndex, offsets);

        if (offsets) {
          offsets[column.index] = offset;
        }

        const styleProps = normalizeOffset(offset);

        this.setCellProperties(styleProps, visibleColumnIndex, rowIndex);
      }
    });
  }

  protected setColumnWidths(options): void {
    const isStickyColumns = this._isStickyColumns();
    const columnsResizerController = this.getController('columnsResizer');
    const isColumnResizing = columnsResizerController?.isResizing();

    super.setColumnWidths(options);

    if (isStickyColumns && isColumnResizing) {
      this.setStickyOffsets();
    }
  }

  protected _resizeCore() {
    const isStickyColumns = this._isStickyColumns();

    super._resizeCore.apply(this, arguments as any);

    if (isStickyColumns) {
      this.setStickyOffsets();
    }
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
) => class ColumnHeadersViewStickyColumnsExtender extends baseStickyColumns(Base) {
  protected setStickyOffsets() {
    const offsets: Record<number, Record<string, number>> = {};
    const rowCount = this.getRowCount();

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      super.setStickyOffsets(rowIndex, offsets);
    }
  }

  protected _createCell(options: any): dxElementWrapper {
    const $cell = super._createCell(options);
    const rowCount = this.getRowCount();
    const { column, rowIndex } = options;
    const isStickyColumns = this._isStickyColumns();
    const columnsController = this._columnsController;

    if (isStickyColumns && rowCount > 1) {
      const prevCellIsFixed = prevColumnIsFixed(columnsController, column, rowIndex);

      if (prevCellIsFixed) {
        GridCoreStickyColumnsDom.addColumnNoBorderClass($cell, this.addWidgetPrefix.bind(this));
      }

      if (columnsController?.isFirstColumn(column, rowIndex)) {
        GridCoreStickyColumnsDom.addFirstHeaderClass($cell, this.addWidgetPrefix.bind(this));
      }
    }

    return $cell;
  }

  public getContextMenuItems(options) {
    const { column } = options;
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
            text: columnFixingOptions.texts.leftPosition, value: 'left', disabled: column.fixed && (!column.fixedPosition || column.fixedPosition === 'left'), onItemClick,
          },
          {
            text: columnFixingOptions.texts.rightPosition, value: 'right', disabled: column.fixed && column.fixedPosition === 'right', onItemClick,
          },
        ];

        if (this.option('columnFixing.legacyMode') !== true) {
          fixedPositionItems.push({
            text: columnFixingOptions.texts.stickyPosition, value: 'sticky', disabled: column.fixed && getColumnFixedPosition(column) === StickyPosition.Sticky, onItemClick,
          });
        }

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push(
          {
            text: columnFixingOptions.texts.fix,
            beginGroup: true,
            items: fixedPositionItems,
          },
          {
            text: columnFixingOptions.texts.unfix, value: 'none', disabled: !column.fixed, onItemClick,
          },
        );
      }
    }
    return items;
  }
};

const rowsView = (
  Base: ModuleType<RowsView>,
) => class RowsViewStickyColumnsExtender extends baseStickyColumns(Base) {};

const footerView = (
  Base: ModuleType<any>,
) => class FooterViewStickyColumnsExtender extends baseStickyColumns(Base) {};

const columnsResizer = (Base: ModuleType<ColumnsResizerViewController>) => class ColumnResizerStickyColumnsExtender extends Base {
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
    const isStickyColumns = this._columnHeadersView?._isStickyColumns();

    super._generatePointsByColumns(isStickyColumns);
  }

  protected _pointCreated(point, cellsLength, columns) {
    // @ts-expect-error
    const isStickyColumns = this._columnHeadersView?._isStickyColumns();
    const result = super._pointCreated(point, cellsLength, columns);
    const needToCheckPoint = isStickyColumns && cellsLength > 0;

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

export const stickyColumnsModule = {
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView,
    },
    controllers: {
      columnsResizer,
    },
  },
};
