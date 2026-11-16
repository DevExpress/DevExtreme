import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import { getData } from '@ts/core/element_data';
import type { ColumnTemplateSource } from '@ts/grids/grid_core/columns_controller/types';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import { isFormBasedEditMode } from '@ts/grids/grid_core/editing/editing_utils';
import type {
  CellBasedEditingController,
  EditingColumn,
  EditorCellOptions,
} from '@ts/grids/grid_core/editing/types';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import type { ViewCellOptions } from '@ts/grids/grid_core/views/types';
import { FIELD_ITEM_CONTENT_CLASS } from '@ts/ui/form/constants';

import { EDIT_FORM_ITEM_DATA_KEY, EDIT_MODE } from '../../editing/const';
import { ADAPTIVE_ROW_TYPE } from '../const';
import type { AdaptivityDataController } from '../types';

export const adaptivityEditingViewControllerExtender = (
  Base: ModuleType<CellBasedEditingController>,
): ModuleType<CellBasedEditingController> => class AdaptivityEditingViewControllerExtender
  extends Base {
  protected _dataController!: AdaptivityDataController;

  private _isForceRowAdaptiveExpand?: boolean;

  protected _getFormEditItemTemplate(
    cellOptions: EditorCellOptions,
    column: EditingColumn,
  ): ColumnTemplateSource<ViewCellOptions> | undefined {
    if (this.getEditMode() !== EDIT_MODE.row && cellOptions.rowType === 'detailAdaptive') {
      cellOptions.columnIndex = this._columnsController.getVisibleIndex(column.index);
      return this.getColumnTemplate(cellOptions);
    }

    return super._getFormEditItemTemplate(cellOptions, column);
  }

  protected _closeEditItem($targetElement: dxElementWrapper): void {
    const $itemContents = $targetElement.closest(`.${FIELD_ITEM_CONTENT_CLASS}`);
    const rowIndex = this._dataController.getRowIndexByKey(
      this._dataController.getAdaptiveExpandedKey(),
    ) + 1;
    const formItem = $itemContents.length
      ? getData($itemContents.first(), EDIT_FORM_ITEM_DATA_KEY)
      : null;
    const columnIndex = formItem?.column
      && this._columnsController.getVisibleIndex(formItem.column.index);

    if (!this.isEditCell(rowIndex, columnIndex)) {
      super._closeEditItem($targetElement);
    }
  }

  protected _beforeUpdateItems(rowIndices: number[], rowIndex: number): void {
    if (
      !isFormBasedEditMode(this.getEditMode())
      && this.adaptiveColumnsController.hasHiddenColumns()
    ) {
      const items = this._dataController.items();
      const item = items[rowIndex];
      const oldExpandRowIndex = gridCoreUtils.getIndexByKey(
        this._dataController.getAdaptiveExpandedKey(),
        items,
      );

      this._isForceRowAdaptiveExpand = !this.adaptiveColumnsController
        .hasAdaptiveDetailRowExpanded();

      if (oldExpandRowIndex >= 0) {
        rowIndices.push(oldExpandRowIndex + 1);
      }

      rowIndices.push(rowIndex + 1);
      this._dataController.setAdaptiveExpandedKey(item.key);
    }
  }

  protected _afterInsertRow(key: RowKey): void {
    super._afterInsertRow(key);

    if (this.adaptiveColumnsController.hasHiddenColumns()) {
      this.adaptiveColumnsController.toggleExpandAdaptiveDetailRow(
        key,
        this.getEditMode() === EDIT_MODE.row,
      );
      this._isForceRowAdaptiveExpand = true;
    }
  }

  private _collapseAdaptiveDetailRow(): void {
    if (this.getEditMode() === EDIT_MODE.row && this._isForceRowAdaptiveExpand) {
      this.adaptiveColumnsController.collapseAdaptiveDetailRow();
      this._isForceRowAdaptiveExpand = false;
    }
  }

  private _cancelEditAdaptiveDetailRow(): void {
    if (this.adaptiveColumnsController.hasHiddenColumns()) {
      this._collapseAdaptiveDetailRow();
    }
  }

  protected _afterSaveEditData(cancel?: boolean): DeferredObj<unknown> {
    super._afterSaveEditData(cancel);
    const deferred = Deferred<unknown>();
    if (this.getEditMode() === EDIT_MODE.row && this.adaptiveColumnsController.hasHiddenColumns()) {
      this._validatingController.validate().done((isValid) => {
        if (isValid) {
          this._cancelEditAdaptiveDetailRow();
        }
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  protected _beforeCancelEditData(): void {
    super._beforeCancelEditData();
    this._cancelEditAdaptiveDetailRow();
  }

  protected _getRowIndicesForCascadeUpdating(
    row: ProcessedItem,
    skipCurrentRow?: boolean,
  ): number[] {
    const rowIndices = super._getRowIndicesForCascadeUpdating(row, skipCurrentRow);

    if (
      isDefined(row.rowIndex)
      && this.adaptiveColumnsController.isAdaptiveDetailRowExpanded(row.key)
    ) {
      rowIndices.push(row.rowType === ADAPTIVE_ROW_TYPE ? row.rowIndex - 1 : row.rowIndex + 1);
    }

    return rowIndices;
  }

  public override beforeCloseEditCell(rowIndices: number[]): void {
    const expandedKey = this._dataController.getAdaptiveExpandedKey();

    if (expandedKey) {
      const rowIndex = gridCoreUtils.getIndexByKey(expandedKey, this._dataController.items());
      if (rowIndex > -1) {
        rowIndices.unshift(rowIndex);
      }
    }
  }

  public editRow(rowIndex: number): boolean | undefined {
    if (isFormBasedEditMode(this.getEditMode())) {
      this.adaptiveColumnsController.collapseAdaptiveDetailRow();
    }

    return super.editRow(rowIndex);
  }

  protected deleteRow(rowIndex: number): void {
    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);

    if (
      this.getEditMode() === EDIT_MODE.batch
      && this.adaptiveColumnsController.isAdaptiveDetailRowExpanded(rowKey)
    ) {
      this.adaptiveColumnsController.collapseAdaptiveDetailRow();
    }

    super.deleteRow(rowIndex);
  }
};
