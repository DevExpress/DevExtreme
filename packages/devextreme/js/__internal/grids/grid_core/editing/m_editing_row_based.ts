/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { RefreshOptions } from '@ts/grids/grid_core/data_controller/types';
import { ROW_SELECTION_CLASS } from '@ts/grids/grid_core/selection/const';
import type { ModuleType } from '@ts/grids/grid_core/types';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { ViewRow } from '@ts/grids/grid_core/views/types';

import {
  CLASSES,
  EDIT_MODE,
  EDITING_EDITROWKEY_OPTION_NAME,
  MODES_WITH_DELAYED_FOCUS,
} from './const';
import type { EditingController } from './editing';
import { isRowBasedEditMode } from './editing_utils';
import { editingRowBasedDataControllerExtender } from './extenders/editing_row_based_data_controller';
import type { EditorCellOptions, InternalColumnButton } from './types';

const editingControllerExtender = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class RowBasedEditingControllerExtender extends Base {
  protected _afterCancelEditData(rowIndex: number): void {
    if (isRowBasedEditMode(this.getEditMode()) && rowIndex >= 0) {
      this._dataController.updateItems({
        changeType: 'update',
        rowIndices: [rowIndex, rowIndex + 1],
      });
    } else {
      super._afterCancelEditData(rowIndex);
    }
  }

  protected _isDefaultButtonVisible(
    button: InternalColumnButton,
    options: EditorCellOptions,
  ): boolean {
    const editMode = this.getEditMode();
    const isRowMode = isRowBasedEditMode(editMode);
    const isEditRow = editMode !== EDIT_MODE.popup
      && !!options.row
      && equalByValue(options.row.key, this.option(EDITING_EDITROWKEY_OPTION_NAME));

    if (isRowMode) {
      switch (button.name) {
        case 'edit':
          return !isEditRow && this.allowUpdating(options);
        case 'delete':
          return super._isDefaultButtonVisible(button, options) && !isEditRow;
        case 'save':
        case 'cancel':
          return isEditRow;
        default:
          return super._isDefaultButtonVisible(button, options);
      }
    }

    return super._isDefaultButtonVisible(button, options);
  }

  public isEditRow(rowIndex: number | undefined): boolean {
    return isRowBasedEditMode(this.getEditMode()) && this.isEditRowByIndex(rowIndex);
  }

  protected _cancelSaving(saveDeferred: DeferredObj<unknown>): void {
    if (isRowBasedEditMode(this.getEditMode())) {
      if (!this.hasChanges()) {
        this._cancelEditDataCore();
      }
    }

    super._cancelSaving(saveDeferred);
  }

  protected _refreshCore(params?: RefreshOptions): void {
    const { allowCancelEditing } = params ?? {};
    if (isRowBasedEditMode(this.getEditMode())) {
      const hasUpdateChanges = this.getChanges().filter((it) => it.type === 'update').length > 0;

      this.init();
      if (allowCancelEditing && hasUpdateChanges) {
        this._cancelEditDataCore();
      }
    }

    super._refreshCore(params);
  }

  protected _isEditColumnVisible(): boolean {
    const result = super._isEditColumnVisible();
    const editingOptions = this.option('editing');
    const isRowEditMode = this.getEditMode() === EDIT_MODE.row;
    const isVisibleInRowEditMode = !!editingOptions?.allowUpdating || !!editingOptions?.allowAdding;

    return result || (isRowEditMode && isVisibleInRowEditMode);
  }

  public _focusEditorIfNeed(): void {
    const editMode = this.getEditMode();

    if (this._needFocusEditor) {
      if (MODES_WITH_DELAYED_FOCUS.includes(editMode)) {
        const $editingCell = this.getFocusedCellInRow(this._getVisibleEditRowIndex());

        this._delayedInputFocus($editingCell, () => {
          if ($editingCell) {
            // @ts-expect-error focus() is typed for Element
            this.component.focus($editingCell);
          }
        });
      }

      this._needFocusEditor = false;
    }
  }
};

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class RowsViewEditingRowBasedExtender extends Base {
  protected _createRow(row?: ViewRow, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (row) {
      const editingController = this._editingController;
      const isEditRow = editingController.isEditRow(row.rowIndex);

      if (isEditRow) {
        $row.addClass(CLASSES.editRow);
        $row.removeClass(ROW_SELECTION_CLASS);

        if (row.rowType === 'detail') {
          $row.addClass(this.addWidgetPrefix(CLASSES.editForm));
        }
      }
    }

    return $row;
  }
};

export const editingRowBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      data: editingRowBasedDataControllerExtender,
    },
    views: {
      rowsView,
    },
  },
};
