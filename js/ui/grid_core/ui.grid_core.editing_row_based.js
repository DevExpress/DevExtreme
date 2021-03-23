const EDIT_MODE_ROW = 'row';
const EDIT_MODE_FORM = 'form';
const MODES_WITH_DELAYED_FOCUS = [EDIT_MODE_ROW, EDIT_MODE_FORM];

export const editingRowBasedModule = {
    extenders: {
        controllers: {
            editing: {
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
                    let result = true;
                    const isRowMode = this.isRowBasedEditMode();
                    const isEditRow = options.row && options.row.rowIndex === this._getVisibleEditRowIndex();

                    if(isRowMode) {
                        switch(button.name) {
                            case 'edit':
                                result = !isEditRow && this.allowUpdating(options);
                                break;
                            case 'delete':
                                result = this.callBase.apply(this, arguments) && !isEditRow;
                                break;
                            case 'save':
                            case 'cancel':
                                result = isEditRow;
                                break;
                            default:
                                result = this.callBase.apply(this, arguments);
                        }

                        return result;
                    }

                    return this.callBase.apply(this, arguments);
                },

                isEditRow: function(rowIndex) {
                    return this._getVisibleEditRowIndex() === rowIndex && this.isRowBasedEditMode();
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
        }
    }
};
