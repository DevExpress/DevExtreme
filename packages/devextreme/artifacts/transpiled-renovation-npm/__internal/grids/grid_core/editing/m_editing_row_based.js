"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editingRowBasedModule = void 0;
var _common = require("../../../../core/utils/common");
var _const = require("./const");
/* eslint-disable max-classes-per-file */

const editingControllerExtender = Base => class RowBasedEditingControllerExtender extends Base {
  isRowEditMode() {
    return this.getEditMode() === _const.EDIT_MODE_ROW;
  }
  _afterCancelEditData(rowIndex) {
    const dataController = this._dataController;
    if (this.isRowBasedEditMode() && rowIndex >= 0) {
      dataController.updateItems({
        changeType: 'update',
        rowIndices: [rowIndex, rowIndex + 1]
      });
    } else {
      super._afterCancelEditData(rowIndex);
    }
  }
  _isDefaultButtonVisible(button, options) {
    const isRowMode = this.isRowBasedEditMode();
    const isPopupEditMode = this.isPopupEditMode();
    const isEditRow = !isPopupEditMode && options.row && (0, _common.equalByValue)(options.row.key, this.option(_const.EDITING_EDITROWKEY_OPTION_NAME));
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
  isEditRow(rowIndex) {
    return this.isRowBasedEditMode() && this.isEditRowByIndex(rowIndex);
  }
  _cancelSaving(result) {
    if (this.isRowBasedEditMode()) {
      if (!this.hasChanges()) {
        this._cancelEditDataCore();
      }
    }
    super._cancelSaving(result);
  }
  _refreshCore(params) {
    const {
      allowCancelEditing
    } = params ?? {};
    if (this.isRowBasedEditMode()) {
      const hasUpdateChanges = this.getChanges().filter(it => it.type === 'update').length > 0;
      this.init();
      allowCancelEditing && hasUpdateChanges && this._cancelEditDataCore();
    }
    super._refreshCore(params);
  }
  _isEditColumnVisible() {
    const result = super._isEditColumnVisible();
    const editingOptions = this.option('editing');
    const isRowEditMode = this.isRowEditMode();
    const isVisibleInRowEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;
    return result || isRowEditMode && isVisibleInRowEditMode;
  }
  _focusEditorIfNeed() {
    const editMode = this.getEditMode();
    if (this._needFocusEditor) {
      if (_const.MODES_WITH_DELAYED_FOCUS.includes(editMode)) {
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
const data = Base => class DataEditingRowBasedExtender extends Base {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
    if (this._editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
      return;
    }
    return super._getChangedColumnIndices.apply(this, arguments);
  }
};
const rowsView = Base => class RowsViewEditingRowBasedExtender extends Base {
  _createRow(row) {
    const $row = super._createRow.apply(this, arguments);
    if (row) {
      const editingController = this._editingController;
      const isEditRow = editingController.isEditRow(row.rowIndex);
      if (isEditRow) {
        $row.addClass(_const.EDIT_ROW);
        $row.removeClass(_const.ROW_SELECTED_CLASS);
        if (row.rowType === 'detail') {
          $row.addClass(this.addWidgetPrefix(_const.EDIT_FORM_CLASS));
        }
      }
    }
    return $row;
  }
  _update(change) {
    super._update(change);
    if (change.changeType === 'updateSelection') {
      this.getTableElements().children('tbody').children(`.${_const.EDIT_ROW}`).removeClass(_const.ROW_SELECTED_CLASS);
    }
  }
};
const editingRowBasedModule = exports.editingRowBasedModule = {
  extenders: {
    controllers: {
      editing: editingControllerExtender,
      data
    },
    views: {
      rowsView
    }
  }
};