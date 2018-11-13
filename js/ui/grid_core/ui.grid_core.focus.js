var $ = require("../../core/renderer"),
    core = require("./ui.grid_core.modules"),
    each = require("../../core/utils/iterator").each,
    gridCoreUtils = require("./ui.grid_core.utils"),
    equalByValue = require("../../core/utils/common").equalByValue,
    isDefined = require("../../core/utils/type").isDefined,
    errors = require("../widget/ui.errors"),
    Deferred = require("../../core/utils/deferred").Deferred;

var ROW_FOCUSED_CLASS = "dx-row-focused",
    FOCUSED_ROW_SELECTOR = ".dx-row" + "." + ROW_FOCUSED_CLASS,
    CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled",
    UPDATE_FOCUSED_ROW_CHANGE_TYPE = "updateFocusedRow";

exports.FocusController = core.ViewController.inherit((function() {
    return {
        init: function() {
            this._dataController = this.getController("data");
            this._keyboardController = this.getController("keyboardNavigation");
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
            if(this.option("focusedRowEnabled")) {
                index = index !== undefined ? index : this.option("focusedRowIndex");

                var dataController = this.getController("data"),
                    localIndex = index >= 0 ? index - dataController.getRowIndexOffset() : -1,
                    rowKey = dataController.getKeyByRowIndex(localIndex);

                if(isDefined(rowKey) && !this.isRowFocused(rowKey)) {
                    this.option("focusedRowKey", rowKey);
                }
            }
        },

        publicMethods: function() {
            return ["navigateToRow", "isRowFocused"];
        },

        /**
         * @name GridBaseMethods.navigateToRow
         * @publicName navigateToRow(key)
         * @param1 key:any
         */
        navigateToRow: function(key) {
            var that = this,
                dataController = this.getController("data"),
                rowIndex = this.option("focusedRowIndex");

            if(key === undefined || !dataController.dataSource()) {
                return;
            }

            var rowIndexByKey = dataController.getRowIndexByKey(key) + dataController.getRowIndexOffset();

            if(rowIndex >= 0 && rowIndex === rowIndexByKey) {
                that._triggerUpdateFocusedRow(key);
            } else {
                dataController.getPageIndexByKey(key).done(function(pageIndex) {
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
                    this._triggerUpdateFocusedRow(focusedRowKey);
                } else {
                    this.navigateToRow(focusedRowKey);
                }
            } else {
                focusedRowKey = dataController.getKeyByRowIndex(focusedRowIndex);
                this.option("focusedRowKey", focusedRowKey);
            }
        },

        /**
         * @name GridBaseMethods.isRowFocused
         * @publicName isRowFocused(key)
         * @param1 key:any
         * @return boolean
         */
        isRowFocused: function(key) {
            var focusedRowKey = this.option("focusedRowKey");

            if(focusedRowKey !== undefined) {
                return equalByValue(key, this.option("focusedRowKey"));
            }
            return false;
        },

        updateFocusedRow: function(change) {
            var that = this,
                focusedRowIndex = that._dataController.getRowIndexByKey(change.focusedRowKey),
                rowsView = that.getView("rowsView"),
                $focusedRow,
                $tableElement;

            each(rowsView.getTableElements(), function(_, element) {
                $tableElement = $(element);
                that._clearPreviousFocusedRow($tableElement, focusedRowIndex);
                if(focusedRowIndex >= 0) {
                    $focusedRow = that._prepareFocusedRow(change.items[focusedRowIndex], $tableElement, focusedRowIndex);
                    that.getController("keyboardNavigation")._fireFocusedRowChanged($focusedRow);
                }
            });
        },
        _clearPreviousFocusedRow: function($tableElement, focusedRowIndex) {
            var $prevRowFocusedElement = $tableElement.find(FOCUSED_ROW_SELECTOR),
                $firstRow;
            $prevRowFocusedElement
                .removeClass(ROW_FOCUSED_CLASS)
                .removeClass(CELL_FOCUS_DISABLED_CLASS)
                .removeAttr("tabindex");
            $prevRowFocusedElement.children("td").removeAttr("tabindex");
            if(focusedRowIndex !== 0) {
                $firstRow = $(this.getView("rowsView").getRowElement(0));
                $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr("tabIndex");
            }
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
                } else {
                    that._scrollToFocusedRow($row);
                }
            }

            return $row;
        },

        _scrollToFocusedRow: function($row) {
            var that = this,
                rowsView = that.getView("rowsView"),
                $rowsViewElement = rowsView.element(),
                $focusedRow;

            if(!$rowsViewElement) {
                return;
            }

            $focusedRow = $row || $rowsViewElement.find(FOCUSED_ROW_SELECTOR);

            if($focusedRow.length > 0) {
                var focusedRowRect = $focusedRow[0].getBoundingClientRect(),
                    rowsViewRect = rowsView.element()[0].getBoundingClientRect(),
                    diff;

                if(focusedRowRect.bottom > rowsViewRect.bottom) {
                    diff = focusedRowRect.bottom - rowsViewRect.bottom;
                } else if(focusedRowRect.top < rowsViewRect.top) {
                    diff = focusedRowRect.top - rowsViewRect.top;
                }

                if(diff) {
                    rowsView.scrollTo(rowsView._scrollTop + diff);
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
             * @type any
             * @default undefined
             * @fires GridBaseOptions.onFocusedRowChanged
             */
            focusedRowKey: undefined,

            /**
             * @name GridBaseOptions.focusedRowIndex
             * @type number
             * @default -1
             * @fires GridBaseOptions.onFocusedRowChanged
             */
            focusedRowIndex: -1,

            /**
             * @name GridBaseOptions.focusedColumnIndex
             * @type number
             * @default -1
             * @fires GridBaseOptions.onFocusedCellChanged
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

                    if(this.option("focusedRowIndex") === rowIndex) {
                        this.getController("focus")._focusRowByIndex(rowIndex);
                    } else {
                        this.option("focusedRowIndex", rowIndex);
                    }
                },

                setFocusedColumnIndex: function(columnIndex) {
                    this.callBase(columnIndex);
                    this.option("focusedColumnIndex", columnIndex);
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
                        focusedRowEnabled = this.option("focusedRowEnabled"),
                        editingController = this.getController("editing"),
                        isRowElement = keyboardController._getElementType($element) === "row",
                        $cell;

                    if(!focusedRowEnabled || !keyboardController.isRowFocusType() || editingController.isEditing()) {
                        this.callBase($element, hideBorder);
                    } else if(focusedRowEnabled) {
                        if(isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
                            $cell = keyboardController.getFirstValidCellInRow($element);
                            keyboardController.focus($cell);
                        }
                    }
                }
            },

            columns: {
                getSortDataSourceParameters: function() {
                    var result = this.callBase.apply(this, arguments),
                        store = this.getController("data").store(),
                        key = store && store.key();

                    if(this.option("focusedRowEnabled") && key) {
                        key = Array.isArray(key) ? key : [key];
                        var notSortedKeys = key.filter(key => !this.columnOption(key, "sortOrder"));

                        notSortedKeys.forEach(notSortedKey => {
                            result = result || [];
                            result.push({ selector: notSortedKey, desc: false });
                        });
                    }

                    return result;
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
                                var key = this.option("focusedRowKey");
                                if(key !== undefined) {
                                    focusController.navigateToRow();
                                }
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
                        d = new Deferred();

                    that.getGlobalRowIndexByKey(key, d).done(function(globalIndex) {
                        d.resolve(Math.floor(globalIndex / that.pageSize()));
                    });

                    return d.promise();
                },
                getGlobalRowIndexByKey: function(key) {
                    if(this._dataSource.group()) {
                        return this._calculateGlobalRowIndexByGroupedData(key);
                    }
                    return this._calculateGlobalRowIndexByFlatData(key);
                },
                _calculateGlobalRowIndexByFlatData: function(key, groupFilter, useGroup) {
                    var that = this,
                        deferred = new Deferred(),
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key);

                    dataSource.load({
                        filter: that._concatWithCombinedFilter(filter),
                        skip: 0,
                        take: 1
                    }).done(function(data) {
                        if(data.length > 0) {
                            filter = that._generateOperationFilterByKey(key, data[0], useGroup);
                            dataSource.load({
                                filter: that._concatWithCombinedFilter(filter, groupFilter),
                                skip: 0,
                                take: 1,
                                requireTotalCount: true
                            }).done(function(_, extra) {
                                deferred.resolve(extra.totalCount);
                            });
                        }
                    });

                    return deferred.promise();
                },
                _concatWithCombinedFilter: function(filter, groupFilter) {
                    var combinedFilter = this.getCombinedFilter();
                    return gridCoreUtils.combineFilters([filter, combinedFilter, groupFilter]);
                },
                _generateOperationFilterByKey: function(key, rowData, useGroup) {
                    var that = this,
                        dataSource = that._dataSource,
                        filter = that._generateFilterByKey(key, "<"),
                        sort = that._columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().filtering);

                    if(useGroup) {
                        var group = that._columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().filtering);
                        if(group) {
                            sort = sort ? group.concat(sort) : group;
                        }
                    }

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

                            value = getter ? getter(rowData) : rowData[selector];

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
                        if(this.getController("focus").isRowFocused(row.key)) {
                            $row.addClass(ROW_FOCUSED_CLASS);
                        }
                    }

                    return $row;
                },

                _checkRowKeys: function(options) {
                    this.callBase.apply(this, arguments);

                    if(this.option("focusedRowEnabled") && this.option("dataSource")) {
                        var store = this._dataController.store();
                        if(store && !store.key()) {
                            this._dataController.dataErrorOccurred.fire(errors.Error("E1042", "Row focusing"));
                        }
                    }
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

                scrollToPage: function(pageIndex) {
                    this.callBase(pageIndex);
                    if(this.option("focusedRowEnabled")) {
                        this.getController("focus")._scrollToFocusedRow();
                    }
                },

                _updateFocusElementTabIndex: function($cellElements) {
                    var that = this,
                        $row,
                        columnIndex = that.option("focusedColumnIndex"),
                        focusedRowKey = that.option("focusedRowKey"),
                        rowIndex = that._dataController.getRowIndexByKey(focusedRowKey),
                        tabIndex = that.option("tabIndex"),
                        scrollToFocusedRow = function() {
                            that.getController("focus")._scrollToFocusedRow($row);
                            that.resizeCompleted.remove(scrollToFocusedRow);
                        };

                    if(that.option("focusedRowEnabled")) {
                        $cellElements = that.getCellElements(rowIndex >= 0 ? rowIndex : 0);
                        $row = $cellElements.eq(0).parent();
                        if($row.length) {
                            $row.attr("tabIndex", tabIndex);
                            if(rowIndex >= 0) {
                                if(columnIndex < 0) {
                                    columnIndex = 0;
                                }
                                rowIndex += this.getController("data").getRowIndexOffset();
                                this.getController("keyboardNavigation").setFocusedCellPosition(rowIndex, columnIndex);

                                that.resizeCompleted.add(scrollToFocusedRow);
                            }
                        }
                    } else {
                        that.callBase($cellElements);
                    }
                }
            }
        }
    }
};
