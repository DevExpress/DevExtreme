import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import { getData } from '@ts/core/element_data';
import type { ColumnTemplateSource } from '@ts/grids/grid_core/columns_controller/types';
import { EDIT_FORM_ITEM_DATA_KEY } from '@ts/grids/grid_core/editing/const';
import type { EditingRowsViewExtension } from '@ts/grids/grid_core/editing/types';
import type { SelectionRowsViewExtension } from '@ts/grids/grid_core/selection/types';
import type { ModuleType } from '@ts/grids/grid_core/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type {
  CellPosition,
  ContextMenuItemsOptions,
  GridContextMenuItem,
  RowRenderOptions,
  ViewCellOptions,
  ViewRow,
} from '@ts/grids/grid_core/views/types';
import { FIELD_ITEM_CONTENT_CLASS } from '@ts/ui/form/constants';

import {
  ADAPTIVE_ROW_TYPE, CLASSES, EXPAND_ARIA_NAME, HIDDEN_COLUMNS_WIDTH,
} from '../const';
import type { AdaptiveDetailCellOptions, AdaptivityDataController } from '../types';

function getDataCellElements($row: dxElementWrapper): dxElementWrapper {
  return $row.find('td:not(.dx-datagrid-hidden-column):not([class*=\'dx-command-\'])');
}

type AdaptivityRowsViewBase = RowsView & EditingRowsViewExtension & SelectionRowsViewExtension;

export const adaptivityRowsViewExtender = (
  Base: ModuleType<AdaptivityRowsViewBase>,
): ModuleType<AdaptivityRowsViewBase> => class AdaptivityRowsViewExtender extends Base {
  protected _dataController!: AdaptivityDataController;

  protected _getCellTemplate(
    options: ViewCellOptions,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    const { column } = options;

    if (options.rowType === ADAPTIVE_ROW_TYPE && column.command === 'detail') {
      return (container: dxElementWrapper, cellOptions: AdaptiveDetailCellOptions): void => {
        this.adaptiveColumnsController.createFormByHiddenColumns($(container), cellOptions);
      };
    }
    return super._getCellTemplate(options);
  }

  protected _createRow(row?: ViewRow, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (
      row?.rowType === ADAPTIVE_ROW_TYPE
      && row.key === this._dataController.getAdaptiveExpandedKey()
    ) {
      $row.addClass(CLASSES.adaptiveDetailRow);
    }
    return $row;
  }

  protected _renderCells($row: dxElementWrapper, options: RowRenderOptions): void {
    super._renderCells($row, options);

    const hidingColumnsQueueLength = this.adaptiveColumnsController.getHidingColumnsQueue().length;
    const hiddenColumnsLength = this.adaptiveColumnsController.getHiddenColumns().length;

    if (hidingColumnsQueueLength && !hiddenColumnsLength) {
      getDataCellElements($row).last().addClass(CLASSES.lastDataCell);
    }

    if (options.row.rowType === 'data') {
      this.adaptiveColumnsController.setCommandAdaptiveAriaLabel($row, EXPAND_ARIA_NAME);
    }
  }

  public _getColumnIndexByElementCore($element: dxElementWrapper): number | undefined {
    const $itemContent = $element.closest(`.${FIELD_ITEM_CONTENT_CLASS}`);
    if ($itemContent.length && $itemContent.closest(this.component.$element()).length) {
      const formItem = $itemContent.length
        ? getData($itemContent.first(), EDIT_FORM_ITEM_DATA_KEY)
        : null;
      return formItem?.column && this._columnsController.getVisibleIndex(formItem.column.index);
    }
    return super._getColumnIndexByElementCore($element);
  }

  public _cellPrepared($cell: dxElementWrapper, options: ViewCellOptions): void {
    super._cellPrepared($cell, options);

    if (
      options.row?.rowType !== ADAPTIVE_ROW_TYPE
      && options.column.visibleWidth === HIDDEN_COLUMNS_WIDTH
    ) {
      $cell.addClass(this.addWidgetPrefix(CLASSES.hiddenColumn));
    }
  }

  public getCell(
    cellPosition: Partial<CellPosition>,
    rows?: dxElementWrapper,
    cells?: dxElementWrapper,
  ): dxElementWrapper | undefined {
    const rowIndex = cellPosition?.rowIndex;
    const item = isDefined(rowIndex) ? this._dataController.items()[rowIndex] : undefined;

    if (item?.rowType === ADAPTIVE_ROW_TYPE) {
      const $adaptiveDetailItems = this.adaptiveColumnsController.getAdaptiveDetailItems();

      return super.getCell(cellPosition, rows, $adaptiveDetailItems);
    }
    return super.getCell(cellPosition, rows, cells);
  }

  public _getCellElement(
    rowIndex: number,
    columnIdentifier: string | number,
  ): dxElementWrapper | undefined {
    const item = this._dataController.items()[rowIndex];

    if (item?.rowType === ADAPTIVE_ROW_TYPE) {
      return this.adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
    }
    return super._getCellElement(rowIndex, columnIdentifier);
  }

  public getContextMenuItems(
    options: ContextMenuItemsOptions,
  ): GridContextMenuItem[] | undefined {
    if (options.row?.rowType === 'detailAdaptive') {
      const view = this._columnHeadersView;
      const formItem = getData(
        $(options.targetElement).closest('.dx-field-item-label').next(),
        EDIT_FORM_ITEM_DATA_KEY,
      );
      options.column = formItem ? formItem.column : options.column;
      return view.getContextMenuItems?.(options);
    }
    return super.getContextMenuItems?.(options);
  }

  public isClickableElement($target: dxElementWrapper): boolean {
    const isClickable = super.isClickableElement?.($target) ?? false;

    return isClickable || !!$target.closest(`.${CLASSES.commandAdaptive}`).length;
  }
};
