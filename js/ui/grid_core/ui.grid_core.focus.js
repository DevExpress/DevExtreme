var $ = require("../../core/renderer"),
    core = require("./ui.grid_core.modules"),
    each = require("../../core/utils/iterator").each,
    gridCoreUtils = require("./ui.grid_core.utils"),
    equalByValue = require("../../core/utils/common").equalByValue,
    isDefined = require("../../core/utils/type").isDefined,
    Deferred = require("../../core/utils/deferred").Deferred;

var ROW_FOCUSED_CLASS = "dx-row-focused",
    UPDATE_FOCUSED_ROW_CHANGE_TYPE = "updateFocusedRow";

exports.FocusController = core.ViewController.inherit((function() {
    return {
        init: function() {
            this._dataController = this.getController("data");
            this._keyboardController = this.getController("keyboardNavigation");
            this._needRestoreFocus = false;
        },

        optionChanged: function(args) {
            var that = this;

            if(args.name === "focusedRowIndex") {
                that._focusRowByIndex(args.value);
                args.handled = true;
            } else if(args.name === "focusedRowKey") {
                that.navigateToRow(args.value);
                args.handled = true;
            } else if(args.name === "focusedColumnIndex") {
                args.handled = true;
            } else if(args.name === "focusedRowEnabled") {
                args.handled = true;
            } else {
                that.callBase(args);
            }
        },

        _focusRowByIndex: function(index) {
            index = index !== undefined ? index : this.option("focusedRowIndex");

            var dataController = this.getController("data"),
                localIndex = index >= 0 ? index - dataController.getRowIndexOffset() : -1,
                rowKey = dataController.getKeyByRowIndex(localIndex);

            if(isDefined(rowKey) && !this.isRowFocused(rowKey)) {
                this.option("focusedRowKey", rowKey);
            }
        },

        publicMethods: function() {
            return ["navigateToRow"];
        },

        /**
         * @name dxDataGridMethods.navigateToRow
         * @publicName navigateToRow(key)
         * @param1 key:any
         */
        navigateToRow: function(key) {
            var that = this,
                dataController = this.getController("data"),
                rowsView = this.getView("rowsView"),
                rowIndex = this.option("focusedRowIndex");

            key = key !== undefined ? key : this.option("focusedRowKey");

            var rowIndexByKey = dataController.getRowIndexByKey(key) + dataController.getRowIndexOffset();

            if(rowIndex >= 0 && rowIndex === rowIndexByKey) {
                that._triggerUpdateFocusedRow(key);
            } else {
                dataController.getPageIndexByKey(key).done(function(pageIndex) {
                    that._needRestoreFocus = $(rowsView._getRowElement(that.option("focusedRowIndex"))).is(":focus");
                    if(pageIndex === dataController.pageIndex()) {
                        dataController.reload().done(function() {
                            that._triggerUpdateFocusedRow(key);
                        });
                    } else {
                        dataController.pageIndex(pageIndex).done(function() {
                            that._triggerUpdateFocusedRow(key);
                        });
                    }
                });
            }
        },

        _triggerUpdateFocusedRow: function(key) {
            var dataController = this.getController("data"),
                rowIndex = dataController.getRowIndexByKey(key) + dataController.getRowIndexOffset();

            this.getController("keyboardNavigation").setFocusedRowIndex(rowIndex);

            dataController.updateItems({
                changeType: "updateFocusedRow",
                focusedRowKey: key
            });
        },

        _handleDataChanged: function(e) {
            var focusedRowKey = this.option("focusedRowKey"),
                focusedRowIndex = this.option("focusedRowIndex"),
                keyboardController = this.getController("keyboardNavigation"),
                dataController = this.getController("data");

            if(focusedRowKey !== undefined) {
                focusedRowIndex = dataController.getRowIndexByKey(focusedRowKey);
                if(focusedRowIndex >= 0) {
                    if(keyboardController._isVirtualScrolling()) {
                        focusedRowIndex += dataController.getRowIndexOffset();
                    }
                    keyboardController.setFocusedRowIndex(focusedRowIndex);
                } else {
                    this.navigateToRow(focusedRowKey);
                }
            } else {
                focusedRowKey = dataController.getKeyByRowIndex(focusedRowIndex);
                this.option("focusedRowKey", focusedRowKey);
            }
        },

        isRowFocused: function(key, index) {
            var focusedRowKey = this.option("focusedRowKey"),
                focusedRowIndex;

            if(focusedRowKey !== undefined) {
                return equalByValue(key, this.option("focusedRowKey"));
            }
            focusedRowIndex = this.getController("keyboardNavigation").getVisibleRowIndex();
            return focusedRowIndex === index;
        },

        _resetFocusedRowKey: function() {
            this.option("focusedRowKey", undefined);
        },

        updateFocusedRow: function(change) {
            var that = this,
                focusedRowIndex = that._dataController.getRowIndexByKey(change.focusedRowKey),
                rowsView = that.getView("rowsView"),
                $focusedRow,
                $tableElement;

            each(rowsView.getTableElements(), function(_, element) {
                $tableElement = $(element);
                that._clearPreviousFocusedRow($tableElement);
                if(focusedRowIndex >= 0) {
                    $focusedRow = that._prepareFocusedRow(change.items[focusedRowIndex], $tableElement, focusedRowIndex);
                    that.getController("keyboardNavigation")._fireFocusedRowChanged($focusedRow);
                }
            });
        },
        _clearPreviousFocusedRow: function($tableElement) {
            var $prevRowFocusedElement = $tableElement.find(".dx-row" + "." + ROW_FOCUSED_CLASS);
            $prevRowFocusedElement.removeClass(ROW_FOCUSED_CLASS).removeAttr("tabindex");
            $prevRowFocusedElement.children("td").removeAttr("tabindex");
        },
        _prepareFocusedRow: function(changedItem, $tableElement, focusedRowIndex) {
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

            return $row;
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

            /**
             * @name GridBaseMethods.navigateToRow
             * @publicName navigateToRow(key)
             * @param1 key:any
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

                    if(this.option("focusedRowEnabled")) {
                        this.createAction("onFocusedRowChanging", { excludeValidators: ["disabled", "readOnly"] });
                        this.createAction("onFocusedRowChanged", { excludeValidators: ["disabled", "readOnly"] });
                    }

                    this.createAction("onFocusedCellChanging", { excludeValidators: ["disabled", "readOnly"] });
                    this.createAction("onFocusedCellChanged", { excludeValidators: ["disabled", "readOnly"] });

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
                },

                _updateFocusedCellPosition: function($cell, direction) {
                    var prevRowIndex = this.option("focusedRowIndex"),
                        prevColumnIndex = this.option("focusedColumnIndex");

                    this.callBase($cell, direction);

                    this._fireFocusedCellChanged($cell, prevColumnIndex, prevRowIndex);
                },
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

                    if(!focusedRowEnabled || !keyboardController.isRowFocusType()) {
                        this.callBase($element, hideBorder);
                    }
                }
            },

            data: {
                _applyChange: function(change) {
                    if(change && change.changeType === "updateFocusedRow") return;

                    return this.callBase.apply(this, arguments);
                },

                _fireChanged: function(e) {
                    var operationTypes,
                        focusController;

                    if(this.option("focusedRowEnabled")) {
                        operationTypes = this._dataSource.operationTypes();
                        focusController = this.getController("focus");

                        if(e.changeType === "refresh") {
                            var prevPageIndex = this._prevPageIndex,
                                paging = prevPageIndex !== undefined && prevPageIndex !== this.pageIndex();

                            this._prevPageIndex = this.pageIndex();

                            if(operationTypes.reload) {
                                focusController.navigateToRow();
                                return;
                            }

                            if(paging) {
                                if(!this.getController("keyboardNavigation")._isVirtualScrolling()) {
                                    focusController._focusRowByIndex();
                                }
                            } else {
                                focusController._handleDataChanged(e);
                            }
                        }
                    }

                    this.callBase(e);
                },

                getPageIndexByKey: function(key) {
                    var that = this,
                        dataSource = that._dataSource,
                        d = new Deferred(),
                        filter = that._generateFilterByKey(key);

                    dataSource.load({
                        filter: that._concatWithCombinedFilter(filter),
                        skip: 0,
                        take: 1
                    }).done(function(data) {
                        if(data.length > 0) {
                            filter = that._generateOperationFilterByKey(key, data[0]);
                            dataSource.load({
                                filter: that._concatWithCombinedFilter(filter),
                                skip: 0,
                                take: 1,
                                requireTotalCount: true
                            }).done(function(_, extra) {
                                var pageIndex = Math.floor(extra.totalCount / that.pageSize());
                                d.resolve(pageIndex);
                            });
                        }
                    });

                    return d.promise();
                },
                _concatWithCombinedFilter: function(filter) {
                    var combinedFilter = this.getCombinedFilter();
                    return gridCoreUtils.combineFilters([filter, combinedFilter]);
                },
                _generateOperationFilterByKey: function(key, rowData) {
                    var that = this,
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key, "<"),
                        sort = that._columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().filtering);

                    if(sort) {
                        sort.slice().reverse().forEach(function(sortInfo) {
                            var selector = sortInfo.selector,
                                getter,
                                value;

                            if(typeof selector === "function") {
                                getter = selector;
                            } else {
                                getter = that._columnsController.columnOption(selector, "selector");
                            }
                            if(getter) {
                                value = getter(rowData);
                            }
                            filter = [[selector, "=", value], "and", filter];
                            filter = [[selector, sortInfo.desc ? ">" : "<", value], "or", filter];
                        });
                    }

                    return filter;
                },
                _generateFilterByKey: function(key, operation) {
                    var dataSourceKey = this._dataSource.key(),
                        filter = [],
                        keyPart;

                    if(!operation) {
                        operation = "=";
                    }

                    if(Array.isArray(dataSourceKey)) {
                        for(var i = 0; i < dataSourceKey.length; ++i) {
                            keyPart = key[dataSourceKey[i]];
                            if(keyPart) {
                                if(filter.length > 0) {
                                    filter.push("and");
                                }
                                filter.push([dataSourceKey[i], operation, keyPart]);
                            }
                        }
                    } else {
                        filter = [dataSourceKey, operation, key];
                    }

                    return filter;
                }
            }
        },

        views: {
            rowsView: {
                _createRow: function(row) {
                    var $row = this.callBase(row);

                    if(this.option("focusedRowEnabled") && row) {
                        if(this.getController("focus").isRowFocused(row.key, row.rowIndex)) {
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
