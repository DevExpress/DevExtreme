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
            that._needRestoreFocus = false;
        },

        optionChanged: function(args) {
            var that = this,
                rowKey;

            if(args.name === "focusedRowIndex") {
                rowKey = that._dataController.getKeyByRowIndex(args.value);
                if(isDefined(rowKey)) {
                    that.option("focusedRowKey", rowKey);
                }
                args.handled = true;
            } else if(args.name === "focusedRowKey") {
                that._focusRowByKey(args.value);
                args.handled = true;
            } else if(args.name === "focusedColumnIndex") {
                args.handled = true;
            } else if(args.name === "focusedRowEnabled") {
                args.handled = true;
            } else {
                that.callBase(args);
            }
        },

        _focusRowByKey: function(key) {
            var that = this,
                dataController = this._dataController,
                rowsView = this.getView("rowsView");

            dataController._getPageIndexByKey(key).done(function(pageIndex) {
                that._needRestoreFocus = $(rowsView._getRowElement(that.option("focusedRowIndex"))).is(":focus");
                if(pageIndex === dataController.pageIndex()) {
                    dataController.updateItems({
                        changeType: "updateFocusedRow",
                        focusedRowKey: key
                    });
                } else {
                    dataController.pageIndex(pageIndex);
                }
            });
        },

        handleDataChanged: function(e) {
            var focusedRowKey = this.option("focusedRowKey"),
                focusedRowIndex = this.option("focusedRowIndex"),
                dataController = this.getController("data");

            if(focusedRowKey !== undefined) {
                focusedRowIndex = dataController.getRowIndexByKey(focusedRowKey);
                this.option("focusedRowIndex", focusedRowIndex);
            } else {
                focusedRowKey = dataController.getKeyByRowIndex(focusedRowIndex);
                this.option("focusedRowKey", focusedRowKey);
            }
        },

        isRowFocused: function(rowKey) {
            return rowKey === this.option("focusedRowKey");
        },

        updateFocusedRow: function(change) {
            var that = this,
                focusedRowIndex = that._dataController.getRowIndexByKey(change.focusedRowKey),
                rowsView = that.getView("rowsView"),
                $tableElement;

            each(rowsView.getTableElements(), function(_, element) {
                $tableElement = $(element);
                that.clearPreviousFocusedRow($tableElement);
                if(focusedRowIndex >= 0) {
                    that.prepareFocusedRow(change.items[focusedRowIndex], $tableElement, focusedRowIndex);
                }
            });
        },

        clearPreviousFocusedRow: function($tableElement) {
            var $prevRowFocusedElement = $tableElement.find(".dx-row" + "." + ROW_FOCUSED_CLASS);
            $prevRowFocusedElement.removeClass(ROW_FOCUSED_CLASS).removeAttr("tabindex");
            $prevRowFocusedElement.children("td").removeAttr("tabindex");
        },
        prepareFocusedRow: function(changedItem, $tableElement, focusedRowIndex) {
            var that = this,
                $row,
                keyboardController,
                tabIndex = that.option("tabindex") || 0;

            if(changedItem && (changedItem.rowType === "data" || changedItem.rowType === "group")) {
                $row = $(that.getView("rowsView")._getRowElements($tableElement).eq(focusedRowIndex));
                $row.addClass(ROW_FOCUSED_CLASS).attr("tabindex", tabIndex);
                if(that._needRestoreFocus) {
                    that._needRestoreFocus = false;
                    keyboardController = that.getController("keyboardNavigation");
                    var $cell = keyboardController._getFocusedCell();
                    if($cell) {
                        keyboardController.focus($cell);
                    }
                }
            }
        }
    };
})());

module.exports = {
    defaultOptions: function() {
        return {
             /**
             * @name GridBaseOptions.focusedRowEnabled
             * @type boolean
             * @default false
             */
            focusedRowEnabled: false,

            /**
             * @name GridBaseOptions.focusedRowKey
             * @type object
             * @default undefined
             */
            focusedRowKey: undefined,

            /**
             * @name GridBaseOptions.focusedRowIndex
             * @type number
             * @default -1
             */
            focusedRowIndex: -1,

            /**
             * @name GridBaseOptions.focusedColumnIndex
             * @type number
             * @default -1
             */
            focusedColumnIndex: -1
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
                },

                _escapeKeyHandler: function(eventArgs, isEditing) {
                    if(isEditing || !this.option("focusedRowEnabled")) {
                        this.callBase(eventArgs, isEditing);
                        return;
                    }
                    if(this.isCellFocusType()) {
                        this.setRowFocusType();
                        this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true);
                    }
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
                renderFocusOverlay: function($element, hideBorder) {
                    var keyboardController = this.getController("keyboardNavigation"),
                        focusedRowEnabled = this.option("focusedRowEnabled");

                    if(!focusedRowEnabled || keyboardController.isCellFocusType()) {
                        this.callBase($element, hideBorder);
                    }
                }
            },

            data: {
                _fireChanged: function(e) {
                    this.getController("focus").handleDataChanged(e);

                    this.callBase(e);
                }
            }
        },

        views: {
            rowsView: {
                _createRow: function(row) {
                    var $row = this.callBase(row);

                    if(this.option("focusedRowEnabled") && row) {
                        if(this.getController("focus").isRowFocused(row.key)) {
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

                _updateFocusElementTabIndex: function(cellElements) {
                    var that = this,
                        $row = cellElements.eq(0).parent(),
                        columnIndex = that.option("focusedColumnIndex") || 0,
                        rowIndex = that.option("focusedRowIndex"),
                        tabIndex = that.option("tabIndex");

                    if(that.option("focusedRowEnabled") && rowIndex >= 0) {
                        if($row.length) {
                            $row.attr("tabIndex", tabIndex);
                            if(columnIndex < 0) {
                                columnIndex = 0;
                            }
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
