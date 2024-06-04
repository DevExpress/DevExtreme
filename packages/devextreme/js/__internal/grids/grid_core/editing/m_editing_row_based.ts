/* eslint-disable max-classes-per-file */
import { equalByValue } from '@js/core/utils/common';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import type { ModuleType } from '../m_types';
import {
  EDIT_FORM_CLASS,
  EDIT_MODE_ROW,
  EDIT_ROW,
  EDITING_EDITROWKEY_OPTION_NAME,
  MODES_WITH_DELAYED_FOCUS,
  ROW_SELECTED_CLASS,
} from './const';
import type { EditingController } from './m_editing';

const editingControllerExtender = (Base: ModuleType<EditingController>) => class RowBasedEditingControllerExtender extends Base {
  private isRowEditMode() {
    return this.getEditMode() === EDIT_MODE_ROW;
  }

  protected _afterCancelEditData(rowIndex) {
    const dataController = this._dataController;

    if (this.isRowBasedEditMode() && rowIndex >= 0) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [rowIndex, rowIndex + 1],
      });
    } else {
      super._afterCancelEditData(rowIndex);
    }
  }

  protected _isDefaultButtonVisible(button, options) {
    const isRowMode = this.isRowBasedEditMode();
    const isPopupEditMode = this.isPopupEditMode();
    const isEditRow = !isPopupEditMode && options.row && equalByValue(options.row.key, this.option(EDITING_EDITROWKEY_OPTION_NAME));

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

  public isEditRow(rowIndex) {
    return this.isRowBasedEditMode() && this.isEditRowByIndex(rowIndex);
  }

  protected _cancelSaving(result) {
    if (this.isRowBasedEditMode()) {
      if (!this.hasChanges()) {
        this._cancelEditDataCore();
      }
    }

    super._cancelSaving(result);
  }

  protected _refreshCore(params) {
    const { allowCancelEditing } = params ?? {};
    if (this.isRowBasedEditMode()) {
      const hasUpdateChanges = this.getChanges().filter((it) => it.type === 'update').length > 0;

      this.init();
      allowCancelEditing && hasUpdateChanges && this._cancelEditDataCore();
    }

    super._refreshCore(params);
  }

  protected _isEditColumnVisible() {
    const result = super._isEditColumnVisible();
    const editingOptions: any = this.option('editing');
    const isRowEditMode = this.isRowEditMode();
    const isVisibleInRowEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;

    return result || (isRowEditMode && isVisibleInRowEditMode);
  }

  public _focusEditorIfNeed() {
    const editMode = this.getEditMode();

    if (this._needFocusEditor) {
      if (MODES_WITH_DELAYED_FOCUS.includes(editMode)) {
        const $editingCell = this.getFocusedCellInRow(this._getVisibleEditRowIndex());

        this._delayedInputFocus($editingCell, () => {
          // @ts-expect-error
          $editingCell && this.component.focus($editingCell);
        });
      }

      this._needFocusEditor = false;
    }
  }
};

const data = (Base: ModuleType<DataController>) => class DataEditingRowBasedExtender extends Base {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
    if (this._editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
      return;
    }

    return super._getChangedColumnIndices.apply(this, arguments as any);
  }
};

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewEditingRowBasedExtender extends Base {
  protected _createRow(row) {
    const $row = super._createRow.apply(this, arguments as any);

    if (row) {
      const editingController = this._editingController;
      const isEditRow = editingController.isEditRow(row.rowIndex);

      if (isEditRow) {
        $row.addClass(EDIT_ROW);
        $row.removeClass(ROW_SELECTED_CLASS);

        if (row.rowType === 'detail') {
          $row.addClass(this.addWidgetPrefix(EDIT_FORM_CLASS));
        }
      }
    }

    return $row;
  }

  protected _update(change) {
    super._update(change);
    if (change.changeType === 'updateSelection') {
      this.getTableElements().children('tbody').children(`.${EDIT_ROW}`).removeClass(ROW_SELECTED_CLASS);
    }
  }
};

export const editingRowBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      data,
    },
    views: {
      rowsView,
    },
  },
};
