var $ = require("../../core/renderer"),
    core = require("./ui.grid_core.modules"),
    each = require("../../core/utils/iterator").each,
    isDefined = require("../../core/utils/type").isDefined;

var ROW_FOCUSED_CLASS = "dx-row-focused";

exports.FocusController = core.ViewController.inherit((function() {
    return {
        init: function() {
            var that = this,
                focusedRowIndex;

            that.dataController = that.getController("data");
            that.keyboardController = that.getController("keyboardNavigation");

            focusedRowIndex = that.option("focusedRowIndex");

            if(!isDefined(that.option("focusedRowEnabled")) && (isDefined(focusedRowIndex) && focusedRowIndex >= 0)) {
                that.option("focusedRowEnabled", true);
            }
            if(that.option("focusedRowEnabled")) {
                if(!isDefined(focusedRowIndex)) {
                    that.option("focusedRowIndex", 0);
                }
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
                    var that = this,
                        tableElements = that.getTableElements(),
                        focusedRowEnabled = that.option("focusedRowEnabled"),
                        focusedRowIndex = that.option("focusedRowIndex"),
                        tabIndex = that.option("tabindex") || 0,
                        $row,
                        changedItem;

                    if(focusedRowEnabled && change.changeType === "updateFocusedRow") {

                        tableElements.find(".dx-row")
                            .removeClass(ROW_FOCUSED_CLASS)
                            .removeAttr("tabindex");

                        if(tableElements.length > 0) {
                            each(tableElements, function(_, tableElement) {
                                changedItem = change.items[focusedRowIndex];
                                if(changedItem && (changedItem.rowType === "data" || changedItem.rowType === "group")) {
                                    $row = that._getRowElements($(tableElement)).eq(focusedRowIndex);
                                    $row.addClass(ROW_FOCUSED_CLASS)
                                        .attr("tabindex", tabIndex)
                                        .focus();
                                }
                            });
                        }
                    } else {
                        that.callBase(change);
                    }
                }
            }
        }
    }
};
