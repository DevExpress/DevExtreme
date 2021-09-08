import {
    EDIT_MODE_ROW,
    MODES_WITH_DELAYED_FOCUS,
    ROW_SELECTED_CLASS,
    EDIT_FORM_CLASS

} from './ui.grid_core.editing_constants';

const EDIT_ROW = 'dx-edit-row';

export const editingRowBasedModule = {
    extenders: {
        controllers: {
            editing: {
                isRowEditMode: function() {
                    return this.getEditMode() === EDIT_MODE_ROW;
                },

                _afterCancelEditData: function(rowIndex) {
                    const dataController = this._dataController;

                    if(this.isRowBasedEditMode() && rowIndex >= 0) {
                        dataController.updateItems({
                            changeType: 'update',
                            rowIndices: [rowIndex, rowIndex + 1]
                        });
                    } else {
                        this.callBase.apply(this, arguments);
                    }
                },

                _isDefaultButtonVisible: function(button, options) {
                    const isRowMode = this.isRowBasedEditMode();
                    const isEditRow = options.row && options.row.rowIndex === this._getVisibleEditRowIndex();

                    if(isRowMode) {
                        switch(button.name) {
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

                isEditRow: function(rowIndex) {
                    return this.isRowBasedEditMode() && this._isEditRowByIndex(rowIndex);
                },

                _cancelSaving: function() {
                    if(this.isRowBasedEditMode()) {
                        if(!this.hasChanges()) {
                            this._cancelEditDataCore();
                        }
                    }

                    this.callBase.apply(this, arguments);
                },

                _refreshCore: function() {
                    if(this.isRowBasedEditMode()) {
                        this.init();
                    }

                    this.callBase.apply(this, arguments);
                },

                _isEditColumnVisible: function() {
                    const result = this.callBase.apply(this, arguments);
                    const editingOptions = this.option('editing');
                    const isRowEditMode = this.isRowEditMode();
                    const isVisibleInRowEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;

                    return result || (isRowEditMode && isVisibleInRowEditMode);
                },

                _focusEditorIfNeed: function() {
                    const editMode = this.getEditMode();

                    if(this._needFocusEditor) {
                        if(MODES_WITH_DELAYED_FOCUS.indexOf(editMode) !== -1) {
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
                _getChangedColumnIndices: function(oldItem, newItem, rowIndex, isLiveUpdate) {
                    const editingController = this.getController('editing');

                    if(editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
                        return;
                    }

                    return this.callBase.apply(this, arguments);
                }
            }
        },
        views: {
            rowsView: {
                _createRow: function(row) {
                    const $row = this.callBase(row);

                    if(row) {
                        const editingController = this._editingController;
                        const isEditRow = editingController.isEditRow(row.rowIndex);

                        if(isEditRow) {
                            $row.addClass(EDIT_ROW);
                            $row.removeClass(ROW_SELECTED_CLASS);

                            if(row.rowType === 'detail') {
                                $row.addClass(this.addWidgetPrefix(EDIT_FORM_CLASS));
                            }
                        }
                    }

                    return $row;
                },

                _update: function(change) {
                    this.callBase(change);
                    if(change.changeType === 'updateSelection') {
                        this.getTableElements().children('tbody').children('.' + EDIT_ROW).removeClass(ROW_SELECTED_CLASS);
                    }
                },
            }
        }
    }
};
