/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-rest-params */
import { Deferred, when } from '@js/core/utils/deferred';
import type { EditingController } from '@ts/grids/grid_core/editing/m_editing';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import {
  ADAPTIVE_ROW_TYPE,
  EDIT_MODE_BATCH,
  EDIT_MODE_ROW,
  FORM_ITEM_CONTENT_CLASS,
} from '../const';
import type { AdaptivityDataController } from '../types';

export const adaptivityEditingViewControllerExtender = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class AdaptivityEditingViewControllerExtender extends Base {
  protected _dataController!: AdaptivityDataController;

  private _isForceRowAdaptiveExpand?: boolean;

  private _isRowEditMode() {
    return this.getEditMode() === EDIT_MODE_ROW;
  }

  protected _getFormEditItemTemplate(cellOptions, column) {
    if (this.getEditMode() !== EDIT_MODE_ROW && cellOptions.rowType === 'detailAdaptive') {
      cellOptions.columnIndex = this._columnsController.getVisibleIndex(column.index);
      return this.getColumnTemplate(cellOptions);
    }

    return super._getFormEditItemTemplate(cellOptions, column);
  }

  protected _closeEditItem($targetElement) {
    const $itemContents = $targetElement.closest(`.${FORM_ITEM_CONTENT_CLASS}`);
    const rowIndex = this._dataController.getRowIndexByKey(this._dataController.getAdaptiveExpandedKey()) + 1;
    const formItem = $itemContents.length ? $itemContents.first().data('dx-form-item') : null;
    const columnIndex = formItem?.column && this._columnsController.getVisibleIndex(formItem.column.index);

    if (!this.isEditCell(rowIndex, columnIndex)) {
      super._closeEditItem($targetElement);
    }
  }

  protected _beforeUpdateItems(rowIndices, rowIndex) {
    if (!this.adaptiveColumnsController.isFormOrPopupEditMode() && this.adaptiveColumnsController.hasHiddenColumns()) {
      const items = this._dataController.items();
      const item = items[rowIndex];
      const oldExpandRowIndex = gridCoreUtils.getIndexByKey(this._dataController.getAdaptiveExpandedKey(), items);

      this._isForceRowAdaptiveExpand = !this.adaptiveColumnsController.hasAdaptiveDetailRowExpanded();

      if (oldExpandRowIndex >= 0) {
        rowIndices.push(oldExpandRowIndex + 1);
      }

      rowIndices.push(rowIndex + 1);
      this._dataController.setAdaptiveExpandedKey(item.key);
    }
  }

  protected _afterInsertRow(key) {
    super._afterInsertRow.apply(this, arguments as any);

    if (this.adaptiveColumnsController.hasHiddenColumns()) {
      // @ts-expect-error
      this.adaptiveColumnsController.toggleExpandAdaptiveDetailRow(key, this.isRowEditMode());
      this._isForceRowAdaptiveExpand = true;
    }
  }

  private _collapseAdaptiveDetailRow() {
    if (this._isRowEditMode() && this._isForceRowAdaptiveExpand) {
      this.adaptiveColumnsController.collapseAdaptiveDetailRow();
      this._isForceRowAdaptiveExpand = false;
    }
  }

  private _cancelEditAdaptiveDetailRow() {
    if (this.adaptiveColumnsController.hasHiddenColumns()) {
      this._collapseAdaptiveDetailRow();
    }
  }

  protected _afterSaveEditData() {
    super._afterSaveEditData.apply(this, arguments as any);
    // @ts-expect-error
    const deferred = new Deferred();
    if (this._isRowEditMode() && this.adaptiveColumnsController.hasHiddenColumns()) {
      when(this._validatingController.validate(true)).done((isValid) => {
        if (isValid) {
          this._cancelEditAdaptiveDetailRow();
        }
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise();
  }

  protected _beforeCancelEditData() {
    super._beforeCancelEditData();
    this._cancelEditAdaptiveDetailRow();
  }

  protected _getRowIndicesForCascadeUpdating(row) {
    const rowIndices = super._getRowIndicesForCascadeUpdating.apply(this, arguments as any);

    if (this.adaptiveColumnsController.isAdaptiveDetailRowExpanded(row.key)) {
      rowIndices.push(row.rowType === ADAPTIVE_ROW_TYPE ? row.rowIndex - 1 : row.rowIndex + 1);
    }

    return rowIndices;
  }

  protected _beforeCloseEditCellInBatchMode(rowIndices) {
    const expandedKey = this._dataController.getAdaptiveExpandedKey();

    if (expandedKey) {
      const rowIndex = gridCoreUtils.getIndexByKey(expandedKey, this._dataController.items());
      if (rowIndex > -1) {
        rowIndices.unshift(rowIndex);
      }
    }
  }

  public editRow(rowIndex) {
    if (this.adaptiveColumnsController.isFormOrPopupEditMode()) {
      this.adaptiveColumnsController.collapseAdaptiveDetailRow();
    }

    return super.editRow(rowIndex);
  }

  protected deleteRow(rowIndex) {
    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);

    if (this.getEditMode() === EDIT_MODE_BATCH && this.adaptiveColumnsController.isAdaptiveDetailRowExpanded(rowKey)) {
      this.adaptiveColumnsController.collapseAdaptiveDetailRow();
    }

    super.deleteRow(rowIndex);
  }
};
