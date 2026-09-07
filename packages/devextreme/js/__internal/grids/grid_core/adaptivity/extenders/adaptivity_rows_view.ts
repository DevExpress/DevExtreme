/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-rest-params */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import {
  ADAPTIVE_COLUMN_NAME_CLASS,
  ADAPTIVE_DETAIL_ROW_CLASS,
  ADAPTIVE_ROW_TYPE,
  EXPAND_ARIA_NAME,
  FORM_ITEM_CONTENT_CLASS,
  HIDDEN_COLUMN_CLASS,
  HIDDEN_COLUMNS_WIDTH,
  LAST_DATA_CELL_CLASS,
} from '../const';
import type { AdaptivityDataController } from '../types';

function getDataCellElements($row) {
  return $row.find('td:not(.dx-datagrid-hidden-column):not([class*=\'dx-command-\'])');
}

export const adaptivityRowsViewExtender = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class AdaptivityRowsViewExtender extends Base {
  protected _dataController!: AdaptivityDataController;

  protected _getCellTemplate(options) {
    const that = this;
    const { column } = options;

    if (options.rowType === ADAPTIVE_ROW_TYPE && column.command === 'detail') {
      return function (container, options) {
        that.adaptiveColumnsController.createFormByHiddenColumns($(container), options);
      };
    }
    return super._getCellTemplate(options);
  }

  protected _createRow(row) {
    const $row = super._createRow.apply(this, arguments as any);

    if (row?.rowType === ADAPTIVE_ROW_TYPE && row.key === this._dataController.getAdaptiveExpandedKey()) {
      $row.addClass(ADAPTIVE_DETAIL_ROW_CLASS);
    }
    return $row;
  }

  protected _renderCells($row, options) {
    super._renderCells($row, options);

    const hidingColumnsQueueLength = this.adaptiveColumnsController.getHidingColumnsQueue().length;
    const hiddenColumnsLength = this.adaptiveColumnsController.getHiddenColumns().length;

    if (hidingColumnsQueueLength && !hiddenColumnsLength) {
      getDataCellElements($row).last().addClass(LAST_DATA_CELL_CLASS);
    }

    if (options.row.rowType === 'data') {
      this.adaptiveColumnsController.setCommandAdaptiveAriaLabel($row, EXPAND_ARIA_NAME);
    }
  }

  private _getColumnIndexByElementCore($element) {
    const $itemContent = $element.closest(`.${FORM_ITEM_CONTENT_CLASS}`);
    if ($itemContent.length && $itemContent.closest(this.component.$element()).length) {
      const formItem = $itemContent.length ? $itemContent.first().data('dx-form-item') : null;
      return formItem?.column && this._columnsController.getVisibleIndex(formItem.column.index);
    }
    // @ts-expect-error
    return super._getColumnIndexByElementCore($element);
  }

  public _cellPrepared($cell, options) {
    super._cellPrepared.apply(this, arguments as any);

    if (options.row.rowType !== ADAPTIVE_ROW_TYPE && options.column.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      $cell.addClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
    }
  }

  public getCell(cellPosition, rows) {
    const item = this._dataController.items()[cellPosition?.rowIndex];

    if (item?.rowType === ADAPTIVE_ROW_TYPE) {
      const $adaptiveDetailItems = this.adaptiveColumnsController.getAdaptiveDetailItems();

      return super.getCell(cellPosition, rows, $adaptiveDetailItems);
    }
    return super.getCell.apply(this, arguments as any);
  }

  public _getCellElement(rowIndex, columnIdentifier): dxElementWrapper | undefined {
    const item = this._dataController.items()[rowIndex];

    if (item?.rowType === ADAPTIVE_ROW_TYPE) {
      return this.adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
    }
    return super._getCellElement.apply(this, arguments as any);
  }

  private getContextMenuItems(options) {
    if (options.row?.rowType === 'detailAdaptive') {
      const view = this._columnHeadersView;
      const formItem = $(options.targetElement).closest('.dx-field-item-label').next().data('dx-form-item');
      // @ts-expect-error
      options.column = formItem ? formItem.column : options.column;
      return view.getContextMenuItems?.(options);
    }
    // @ts-expect-error
    return super.getContextMenuItems?.(options);
  }

  private isClickableElement($target) {
    // @ts-expect-error
    const isClickable = super.isClickableElement?.($target) ?? false;

    return isClickable || !!$target.closest(`.${ADAPTIVE_COLUMN_NAME_CLASS}`).length;
  }
};
