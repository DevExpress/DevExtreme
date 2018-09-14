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
                focusedRowKey,
                focusedRowEnabled;

            focusedRowIndex = that.option("focusedRowIndex");
            focusedRowKey = that.option("focusedRowKey");
            focusedRowEnabled = that.option("focusedRowEnabled");
            if(focusedRowIndex >= 0 && focusedRowKey) {
                that.option("focusedRowIndex", -1);
            }

            that.dataController = that.getController("data");

            that.updateFocusedRowState();

            if(!isDefined(focusedRowEnabled) && (isDefined(focusedRowIndex) && focusedRowIndex >= 0 || isDefined(focusedRowKey))) {
                that.option("focusedRowEnabled", true);
            }
        },

        updateFocusedRowState: function() {
            var that = this;

            that.dataController.changed.add(function(e) {
                var rowIndex,
                    rowKey;

                if(e.changeType !== "refresh" && e.changeType !== "update") {
                    return;
                }

                rowIndex = that.option("focusedRowIndex");
                if(rowIndex >= 0) {
                    rowKey = that.dataController.getKeyByRowIndex(rowIndex);
                    if(isDefined(rowKey)) {
                        that.option("focusedRowKey", rowKey);
                    }
                } else {
                    rowKey = that.option("focusedRowKey");
                    if(isDefined(rowKey)) {
                        rowIndex = that.dataController.getRowIndexByKey(rowKey);
                        if(rowIndex >= 0) {
                            that.option("focusedRowIndex", rowIndex);
                        }
                    }
                }
            });
        },

        optionChanged: function(args) {
            var that = this,
                rowKey,
                rowIndex;

            if(args.value !== args.previousValue) {
                if(args.name === "focusedRowIndex" && args.value >= 0) {
                    rowKey = that.dataController.getKeyByRowIndex(args.value);
                    if(isDefined(rowKey)) {
                        that.option("focusedRowKey", rowKey);
                    }
                } else if(args.name === "focusedRowKey") {
                    rowKey = args.value;
                    if(isDefined(rowKey)) {
                        rowIndex = that.dataController.getRowIndexByKey(rowKey);
                        that.option("focusedRowIndex", rowIndex);
                        that.dataController.updateItems({
                            changeType: "updateFocusedRow",
                            focusedRowKey: args.value
                        });
                    }
                }
            }

            that.callBase(args);
        },

        isRowFocused: function(arg) {
            return this.option("focusedRowIndex") === arg.rowIndex || this.option("focusedRowKey") === arg.key;
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
             * @name GridBaseOptions.focusedRowKey
             * @type object
             * @default null
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
            },

            data: {
                _processDataItem: function(item, options) {
                    var that = this,
                        focusController = that.getController("focus"),
                        dataItem = that.callBase.apply(that, arguments);

                    dataItem.isFocused = focusController.isRowFocused({
                        key: dataItem.key,
                        rowIndex: options.rowIndex
                    });

                    return dataItem;
                }
            }
        },

        views: {
            rowsView: {
                _createRow: function(row) {
                    var $row = this.callBase(row);

                    if(row && row.isFocused) {
                        $row.addClass(ROW_FOCUSED_CLASS);
                    }

                    return $row;
                },

                _update: function(change) {
                    var that = this,
                        tableElements = that.getTableElements(),
                        focusedRowKey = that.option("focusedRowKey"),
                        rowIndex = that._dataController.getRowIndexByKey(focusedRowKey),
                        $row,
                        changedItem;

                    if(change.changeType === "updateFocusedRow") {

                        tableElements.find(".dx-row").removeClass(ROW_FOCUSED_CLASS);

                        if(tableElements.length > 0) {
                            each(tableElements, function(_, tableElement) {
                                changedItem = change.items[rowIndex];
                                if(changedItem && (changedItem.rowType === "data" || changedItem.rowType === "group")) {
                                    $row = that._getRowElements($(tableElement)).eq(rowIndex);
                                    $row.addClass(ROW_FOCUSED_CLASS);
                                }
                            });
                            that._updateCheckboxesClass();
                        }
                    } else {
                        that.callBase(change);
                    }
                },

                _rowClick: function(e) {
                    var that = this,
                        rowKey,
                        dxEvent = e.event;

                    if(that.option("focusedRowEnabled")) {
                        rowKey = this._dataController.getKeyByRowIndex(e.rowIndex);
                        if(rowKey) {
                            that.option("focusedRowKey", rowKey);
                        }
                        dxEvent.preventDefault();
                        e.handled = true;
                    }
                    that.callBase(e);
                }
            }
        }
    }
};
