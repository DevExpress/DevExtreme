var $ = require("../../core/renderer"),
    core = require("./ui.grid_core.modules"),
    each = require("../../core/utils/iterator").each,
    isDefined = require("../../core/utils/type").isDefined;

var ROW_FOCUSED_CLASS = "dx-row-focused",
    UPDATE_FOCUSED_ROW_CHANGE_TYPE = "updateFocusedRow";

exports.FocusController = core.ViewController.inherit((function() {
    return {
        init: function() {
            var that = this;

            that._dataController = that.getController("data");
            that._keyboardController = that.getController("keyboardNavigation");
        },

        optionChanged: function(args) {
            var that = this;

            if(args.value !== args.previousValue) {
                if(args.name === "focusedRowIndex") {
                    that._keyboardController.setFocusedRowIndex(args.value);
                    that._dataController.updateItems({
                        changeType: "updateFocusedRow"
                    });
                }
            }

            that.callBase(args);
        },

        isRowFocused: function(rowIndex) {
            var rowIndexOffset = this._dataController.getRowIndexOffset(),
                pageRowIndex = this.option("focusedRowIndex") - rowIndexOffset;
            return pageRowIndex === rowIndex;
        },

        verifyFocusedRow: function($element) {
            var that = this;

            var focusedRowIndex = that._keyboardController.getFocusedRowIndex(),
                focusedColumnIndex = that._keyboardController.getFocusedColumnIndex();

            if(focusedRowIndex >= 0 && focusedColumnIndex >= 0) return;

            that._keyboardController.focus($element);
        },

        updateFocusedRow: function(change) {
            var that = this,
                focusedRowIndex = that._keyboardController.getFocusedRowIndex(),
                rowsView = that.getView("rowsView"),
                $tableElement;

            if(focusedRowIndex >= 0) {
                each(rowsView.getTableElements(), function(_, element) {
                    $tableElement = $(element);
                    that.clearPreviousFocusedRow($tableElement);
                    that.prepareFocusedRow(change.items[focusedRowIndex], $tableElement, focusedRowIndex);
                });
            }
        },
        clearPreviousFocusedRow: function($tableElement) {
            var $prevRowFocusedElement = $tableElement.find(".dx-row" + "." + ROW_FOCUSED_CLASS);
            $prevRowFocusedElement.removeClass(ROW_FOCUSED_CLASS).removeAttr("tabindex");
            $prevRowFocusedElement.children("td").removeAttr("tabindex");
        },
        prepareFocusedRow: function(changedItem, $tableElement, focusedRowIndex) {
            var that = this,
                $row,
                tabIndex = that.option("tabindex") || 0;

            if(changedItem && (changedItem.rowType === "data" || changedItem.rowType === "group")) {
                $row = $(that.getView("rowsView")._getRowElements($tableElement).eq(focusedRowIndex));
                $row.addClass(ROW_FOCUSED_CLASS).attr("tabindex", tabIndex);
            }
        }
    };
})());

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.focusedRowIndex
             * @type number
             * @default -1
             */

            /**
             * @name GridBaseOptions.focusedColumnIndex
             * @type number
             * @default -1
             */

             /**
             * @name GridBaseOptions.focusedRowEnabled
             * @type boolean
             * @default false
             */
        };
    },

    controllers: {
        focus: exports.FocusController
    },

    extenders: {
        controllers: {
            keyboardNavigation: {
                init: function() {
                    var rowIndex = this.option("focusedRowIndex"),
                        columnIndex = this.option("focusedColumnIndex");

                    this.callBase();

                    this.setRowFocusType();

                    this._focusedCellPosition = { };
                    if(isDefined(rowIndex)) {
                        this._focusedCellPosition.rowIndex = this.option("focusedRowIndex");
                    }
                    if(isDefined(columnIndex)) {
                        this._focusedCellPosition.columnIndex = this.option("focusedColumnIndex");
                    }
                },

                setFocusedRowIndex: function(rowIndex) {
                    this.callBase(rowIndex);
                    this.option("focusedRowIndex", rowIndex);
                },

                setFocusedColumnIndex: function(columnIndex) {
                    this.callBase(columnIndex);
                    this.option("focusedColumnIndex", columnIndex);
                },

                _clickHandler: function(e) {
                    if(this.option("focusedRowEnabled")) {
                        this.setRowFocusType();
                    }
                    this.callBase(e);
                }
            },

            selection: {
                changeItemSelection: function(itemIndex, keys) {
                    if(!this.option("focusedRowEnabled") || this.isSelectionWithCheckboxes()) {
                        this.callBase(itemIndex, keys);
                    }
                    return null;
                },
            },

            editorFactory: {
                focus: function($element, hideBorder) {
                    if(this.option("focusedRowEnabled")) {
                        this.getController("focus").verifyFocusedRow($element);
                    }
                    return this.callBase($element, hideBorder);
                },

                renderFocusOverlay: function($element, hideBorder) {
                    var keyboardController = this.getController("keyboardNavigation"),
                        focusedRowEnabled = this.option("focusedRowEnabled");

                    if(!focusedRowEnabled || keyboardController.isCellFocusType()) {
                        this.callBase($element, hideBorder);
                    }
                }
            }
        },

        views: {
            rowsView: {
                _createRow: function(row) {
                    var focusedRowEnabled = this.option("focusedRowEnabled"),
                        $row = this.callBase(row);

                    if(focusedRowEnabled && row) {
                        if(this.getController("focus").isRowFocused(row.rowIndex)) {
                            $row.addClass(ROW_FOCUSED_CLASS);
                        }
                    }

                    return $row;
                },

                _update: function(change) {
                    if(change.changeType === UPDATE_FOCUSED_ROW_CHANGE_TYPE) {
                        if(this.option("focusedRowEnabled")) {
                            this.getController("focus").updateFocusedRow(change);
                        }
                    } else {
                        this.callBase(change);
                    }
                },

                dispatchFocus: function(cellElements) {
                    var that = this,
                        $row = cellElements.eq(0).parent(),
                        columnIndex = that.option("focusedColumnIndex") || 0,
                        rowIndex = that.option("focusedRowIndex"),
                        tabIndex = that.option("tabIndex");

                    if(that.option("focusedRowEnabled") && rowIndex >= 0) {
                        if($row.length) {
                            $row.attr("tabIndex", tabIndex);
                            this.getController("keyboardNavigation").setFocusedCellPosition(rowIndex, columnIndex);
                        }
                    } else {
                        that.callBase(cellElements);
                    }
                }
            }
        }
    }
};
