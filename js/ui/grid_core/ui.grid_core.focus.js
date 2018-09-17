var $ = require("../../core/renderer"),
    gridCore = require("../data_grid/ui.data_grid.core"),
    each = require("../../core/utils/iterator").each,
    isDefined = require("../../core/utils/type").isDefined;

var ROW_FOCUSED_CLASS = "dx-row-focused";

exports.FocusController = gridCore.Controller.inherit((function() {
    return {
        init: function() {
            var that = this,
                focusedRowIndex,
                focusedRowEnabled;

            that.dataController = that.getController("data");

            focusedRowIndex = that.option("focusedRowIndex");
            focusedRowEnabled = that.option("focusedRowEnabled");

            if(!isDefined(focusedRowEnabled) && (isDefined(focusedRowIndex) && focusedRowIndex >= 0)) {
                that.option("focusedRowEnabled", true);
            }
        },

        optionChanged: function(args) {
            var that = this;

            if(args.value !== args.previousValue) {
                if(args.name === "focusedRowIndex" && args.value >= 0) {
                    that.dataController.updateItems({
                        changeType: "updateFocusedRow"
                    });
                }
            }

            that.callBase(args);
        },

        isRowFocused: function(rowIndex) {
            return this.option("focusedRowIndex") === rowIndex;
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
                _focus: function($cell, disableFocus, isInteractiveElement) {
                    var nextRowIndex;

                    this.callBase($cell, disableFocus, isInteractiveElement);

                    if(this.option("focusedRowEnabled")) {
                        nextRowIndex = this._focusedCellPosition && this._focusedCellPosition.rowIndex;
                        this.option("focusedRowIndex", nextRowIndex);
                    }
                }
            }
        },

        views: {
            rowsView: {
                _createRow: function(row) {
                    var $row = this.callBase(row);

                    if(row) {
                        if(this.getController("focus").isRowFocused(row.rowIndex)) {
                            $row.addClass(ROW_FOCUSED_CLASS);
                        }
                    }

                    return $row;
                },

                _update: function(change) {
                    var that = this,
                        tableElements = that.getTableElements(),
                        focusedRowIndex = that.option("focusedRowIndex"),
                        $row,
                        changedItem;

                    if(change.changeType === "updateFocusedRow") {

                        tableElements.find(".dx-row").removeClass(ROW_FOCUSED_CLASS);

                        if(tableElements.length > 0) {
                            each(tableElements, function(_, tableElement) {
                                changedItem = change.items[focusedRowIndex];
                                if(changedItem && (changedItem.rowType === "data" || changedItem.rowType === "group")) {
                                    $row = that._getRowElements($(tableElement)).eq(focusedRowIndex);
                                    $row.addClass(ROW_FOCUSED_CLASS);
                                }
                            });
                        }
                    } else {
                        that.callBase(change);
                    }
                },

                _rowClick: function(e) {
                    var that = this,
                        dxEvent = e.event;

                    if(that.option("focusedRowEnabled")) {
                        that.option("focusedRowIndex", e.rowIndex);
                        dxEvent.preventDefault();
                        e.handled = true;
                    }
                    that.callBase(e);
                }
            }
        }
    }
};
