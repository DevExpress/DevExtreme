/* eslint-disable max-classes-per-file */
import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { ModuleType } from '../m_types';
import type { ColumnsView } from '../views/m_columns_view';
import type { RowsView } from '../views/m_rows_view';
import { StickyPosition } from './const';
import { GridCoreStickyColumnsDom } from './dom';
import { getColumnFixedPosition, getStickyOffset } from './utils';

const baseStickyColumns = <T extends ModuleType<ColumnsView>>(Base: T) => class BaseStickyColumnsExtender extends Base {
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
    const $cell = super._createCell(options);
    const isStickyColumns = this._isStickyColumns();

    if (isStickyColumns && column.fixed) {
      const stickyColumns = this._columnsController.getStickyColumns();
      const rtlEnabled = this.option('rtlEnabled');

      GridCoreStickyColumnsDom.addStickyColumnClasses(
        $cell,
        column,
        rtlEnabled ? [...stickyColumns].reverse() : stickyColumns,
        this.addWidgetPrefix.bind(this),
      );
    }

    return $cell;
  }

  protected setColumnWidths(options): void {
    const isStickyColumns = this._isStickyColumns();

    super.setColumnWidths(options);

    if (isStickyColumns) {
      const columns = this.getColumns();
      const rtlEnabled = this.option('rtlEnabled');

      columns.forEach((column, columnIndex) => {
        if (column.fixed) {
          const offset = getStickyOffset(columns, columnIndex, rtlEnabled as boolean);

          this.setCellProperties(offset, columnIndex);
        }
      });
    }
  }
};

const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
) => class ColumnHeadersViewStickyColumnsExtender extends baseStickyColumns(Base) {
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

        if (this._isStickyColumns()) {
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

export const stickyColumnsModule = {
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView,
    },
  },
};
