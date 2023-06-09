import {
  EDIT_FORM_CLASS,
  EDIT_MODE_ROW,
  EDIT_ROW,
  MODES_WITH_DELAYED_FOCUS,
  ROW_SELECTED_CLASS,
} from './const';

export const editingRowBasedModule = {
  extenders: {
    controllers: {
      editing: {
        isRowEditMode() {
          return this.getEditMode() === EDIT_MODE_ROW;
        },

        _afterCancelEditData(rowIndex) {
          const dataController = this._dataController;

          if (this.isRowBasedEditMode() && rowIndex >= 0) {
            dataController.updateItems({
              changeType: 'update',
              rowIndices: [rowIndex, rowIndex + 1],
            });
          } else {
            this.callBase.apply(this, arguments);
          }
        },

        _isDefaultButtonVisible(button, options) {
          const isRowMode = this.isRowBasedEditMode();
          const isEditRow = options.row && options.row.rowIndex === this._getVisibleEditRowIndex();

          if (isRowMode) {
            switch (button.name) {
              case 'edit':
                return !isEditRow && this.allowUpdating(options);
              case 'delete':
                return this.callBase.apply(this, arguments) && !isEditRow;
              case 'save':
              case 'cancel':
                return isEditRow;
              default:
                return this.callBase.apply(this, arguments);
            }
          }

          return this.callBase.apply(this, arguments);
        },

        isEditRow(rowIndex) {
          return this.isRowBasedEditMode() && this.isEditRowByIndex(rowIndex);
        },

        _cancelSaving() {
          if (this.isRowBasedEditMode()) {
            if (!this.hasChanges()) {
              this._cancelEditDataCore();
            }
          }

          this.callBase.apply(this, arguments);
        },

        _refreshCore(params) {
          const { allowCancelEditing } = params ?? {};
          if (this.isRowBasedEditMode()) {
            const hasUpdateChanges = this.getChanges().filter((it) => it.type === 'update').length > 0;

            this.init();
            allowCancelEditing && hasUpdateChanges && this._cancelEditDataCore();
          }

          this.callBase.apply(this, arguments);
        },

        _isEditColumnVisible() {
          const result = this.callBase.apply(this, arguments);
          const editingOptions = this.option('editing');
          const isRowEditMode = this.isRowEditMode();
          const isVisibleInRowEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;

          return result || (isRowEditMode && isVisibleInRowEditMode);
        },

        _focusEditorIfNeed() {
          const editMode = this.getEditMode();

          if (this._needFocusEditor) {
            if (MODES_WITH_DELAYED_FOCUS.includes(editMode)) {
              const $editingCell = this.getFocusedCellInRow(this._getVisibleEditRowIndex());

              this._delayedInputFocus($editingCell, () => {
                $editingCell && this.component.focus($editingCell);
              });
            }

            this._needFocusEditor = false;
          }
        },
      },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _getChangedColumnIndices(oldItem, newItem, rowIndex, isLiveUpdate) {
          const editingController = this.getController('editing');

          if (editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
            return;
          }

          return this.callBase.apply(this, arguments);
        },
      },
    },
    views: {
      rowsView: {
        _createRow(row) {
          const $row = this.callBase.apply(this, arguments);

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
        },

        _update(change) {
          this.callBase(change);
          if (change.changeType === 'updateSelection') {
            this.getTableElements().children('tbody').children(`.${EDIT_ROW}`).removeClass(ROW_SELECTED_CLASS);
          }
        },
      },
    },
  },
};
