/* eslint-disable max-classes-per-file */
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ModuleType } from '../m_types';
import type { ColumnsView } from '../views/m_columns_view';
import type { RowsView } from '../views/m_rows_view';
import { GridCoreStickyColumnsDom } from './dom';
import { getStickyOffset } from './m_sticky_columns_utils';

// View
const baseStickyColumns = <T extends ModuleType<ColumnsView>>(Base: T) => class BaseStickyColumnsExtender extends Base {
  private _isStickyColumns(): boolean {
    const stickyColumns = this._columnsController?.getFixedColumns();

    return this.option('columnFixing.legacyMode') !== true && !!stickyColumns.length;
  }

  protected _renderCore(options?) {
    super._renderCore(options);

    const $element = this.element();
    const isStickyColumns = this._isStickyColumns();

    GridCoreStickyColumnsDom.toggleStickyColumnsClass($element, isStickyColumns);
  }

  protected _createCell(options) {
    const { column } = options;
    const $cell = super._createCell(options);
    const isStickyColumns = this._isStickyColumns();

    if (isStickyColumns && column.fixed) {
      const stickyColumns = this._columnsController.getFixedColumns();
      const rtlEnabled = this.option('rtlEnabled');

      GridCoreStickyColumnsDom.addStickyColumnClasses(
        $cell,
        column,
        rtlEnabled ? [...stickyColumns].reverse() : stickyColumns,
      );
    }

    return $cell;
  }

  protected setColumnWidths(options): void {
    const { widths } = options;
    const isStickyColumns = this._isStickyColumns();

    super.setColumnWidths(options);

    if (isStickyColumns) {
      const columns = this.getColumns();
      const rtlEnabled = this.option('rtlEnabled');

      columns.forEach((column, columnIndex) => {
        if (column.fixed) {
          const offset = getStickyOffset(columns, widths, columnIndex, rtlEnabled);

          this.setCellProperties(offset, columnIndex);
        }
      });
    }
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
) => class ColumnHeadersViewStickyColumnsExtender extends baseStickyColumns(Base) {};

const rowsView = (
  Base: ModuleType<RowsView>,
) => class RowsViewStickyColumnsExtender extends baseStickyColumns(Base) {};

const footerView = (
  Base: ModuleType<any>,
) => class FooterViewStickyColumnsExtender extends baseStickyColumns(Base) {};

export const stickyColumnsModule = {
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView,
    },
  },
};
